import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Play, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  GripVertical,
  Code2,
  Bug,
  FileCode2
} from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import confetti from 'canvas-confetti';
import { apiRequest } from '../../services/api';
import Navbar from '../../components/Navbar';
import CountdownTimer from '../../components/CountdownTimer';

export default function ChallengeWorkspace() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [challenge, setChallenge] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  // Challenge workspace interaction state
  const [orderedBlocks, setOrderedBlocks] = useState([]);
  const [defectiveTcId, setDefectiveTcId] = useState('');
  const [correctedOutput, setCorrectedOutput] = useState('');

  useEffect(() => {
    async function loadWorkspaceChallenge() {
      setLoading(true);
      setError('');
      setResult(null);
      try {
        const data = await apiRequest(`/team/challenges/${id}`, 'GET', null, 'team');
        const chal = data.challenge || data;
        setChallenge(chal);

        if (chal.challenge_type === 'JUMBLED_CODE' && chal.content_payload?.blocks) {
          // Shuffle items if loading fresh so contestants must reorder
          const blocksCopy = [...chal.content_payload.blocks];
          const shuffled = blocksCopy.sort(() => 0.5 - Math.random());
          setOrderedBlocks(shuffled);
        } else if (chal.challenge_type === 'INVALID_TEST_CASE') {
          setDefectiveTcId('');
          setCorrectedOutput('');
        }
      } catch (err) {
        setError(err.message || 'Failed to load challenge workspace');
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      loadWorkspaceChallenge();
    }
  }, [id]);

  const handleDragEnd = (dragResult) => {
    if (!dragResult.destination) return;

    const sourceIndex = dragResult.source.index;
    const destIndex = dragResult.destination.index;

    if (sourceIndex === destIndex) return;

    const items = Array.from(orderedBlocks);
    const [reorderedItem] = items.splice(sourceIndex, 1);
    items.splice(destIndex, 0, reorderedItem);

    setOrderedBlocks(items);
  };

  const handleSubmit = async () => {
    if (!challenge) return;
    setSubmitting(true);
    setResult(null);

    let submissionPayload = {};
    if (challenge.challenge_type === 'JUMBLED_CODE') {
      submissionPayload = {
        ordered_block_ids: orderedBlocks.map((b) => b.id)
      };
    } else {
      submissionPayload = {
        defective_test_case_id: defectiveTcId.trim(),
        corrected_expected_output: correctedOutput.trim()
      };
    }

    try {
      const res = await apiRequest('/team/submit', 'POST', {
        challenge_id: challenge.id,
        submission_payload: submissionPayload
      }, 'team');

      setResult(res);

      if (res.correct) {
        confetti({
          particleCount: 110,
          spread: 80,
          origin: { y: 0.6 }
        });
      }
    } catch (err) {
      setResult({
        correct: false,
        feedback: err.message || 'Execution failed or produced wrong output on hidden test cases.'
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-canvas-base flex flex-col font-sans">
        <Navbar role="team" />
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="flex items-center gap-2 text-content-muted text-sm font-mono">
            <Loader2 className="w-5 h-5 animate-spin text-brand" />
            <span>Loading Challenge Workspace...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-canvas-base flex flex-col font-sans items-center justify-center p-4">
        <div className="bg-canvas-panel border border-border-subtle rounded-xl p-8 max-w-md w-full text-center shadow-card space-y-4">
          <p className="text-status-fail text-sm font-medium">{error}</p>
          <button
            onClick={() => navigate('/lobby')}
            className="px-4 py-2 bg-brand text-white text-xs font-semibold rounded-md hover:bg-brand-hover transition cursor-pointer"
          >
            Back to Problem Suite
          </button>
        </div>
      </div>
    );
  }

  const isInvalidTestCase = challenge.challenge_type === 'INVALID_TEST_CASE';
  const testCases = challenge.content_payload?.test_cases || [];
  const referenceCode = challenge.content_payload?.reference_code;

  return (
    <div className="min-h-screen bg-canvas-base flex flex-col font-sans">
      <Navbar role="team" />

      {/* Workspace Sub-nav */}
      <header className="bg-canvas-panel border-b border-border-subtle px-6 py-3 flex items-center justify-between sticky top-0 z-20">
        <button
          onClick={() => navigate('/lobby')}
          className="flex items-center gap-1.5 text-xs text-content-muted hover:text-content-primary transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Problem Suite</span>
        </button>

        <div className="flex items-center gap-4">
          <CountdownTimer />
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-brand hover:bg-brand-hover text-white text-xs font-semibold rounded-md shadow-xs transition disabled:opacity-60 cursor-pointer"
          >
            {submitting ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Play className="w-3.5 h-3.5 fill-current" />
            )}
            <span>Execute & Submit</span>
          </button>
        </div>
      </header>

      {/* Main Workspace Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Problem Brief & Code Viewer (Takes 7 columns on large displays) */}
        <section className="lg:col-span-7 bg-canvas-panel border border-border-subtle rounded-xl p-6 shadow-card space-y-5 self-start">
          <div className="flex items-center justify-between border-b border-border-subtle pb-3">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-brand-subtle text-brand border border-brand/20">
                #{challenge.challenge_number} • {challenge.challenge_type}
              </span>
              <span className="text-xs font-mono text-content-muted">
                Max: {challenge.max_points} pts
              </span>
            </div>
            {isInvalidTestCase && (
              <span className="flex items-center gap-1 text-[11px] font-mono text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                <Bug className="w-3 h-3" /> Trap Debugging
              </span>
            )}
          </div>

          <div>
            <h1 className="text-lg font-bold text-content-primary">{challenge.title}</h1>
            <p className="text-xs text-content-secondary whitespace-pre-line leading-relaxed mt-2">
              {challenge.description}
            </p>
          </div>

          {/* INVALID_TEST_CASE: Render Source Code */}
          {isInvalidTestCase && referenceCode && (
            <div className="space-y-2 pt-2">
              <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-slate-800 uppercase tracking-wider">
                <FileCode2 className="w-4 h-4 text-brand" />
                <span>Given Implementation:</span>
              </div>
              <pre className="p-4 bg-[#0a0e17] text-purple-200 font-mono text-xs rounded-xl overflow-x-auto border border-slate-800 shadow-inner leading-relaxed">
                <code>{referenceCode}</code>
              </pre>
            </div>
          )}

          {/* INVALID_TEST_CASE: Render Available Candidate Test Cases */}
          {isInvalidTestCase && testCases.length > 0 && (
            <div className="space-y-3 pt-2">
              <h2 className="text-xs font-mono font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Code2 className="w-4 h-4 text-brand" />
                <span>Test Cases Suite:</span>
              </h2>
              <div className="grid grid-cols-1 gap-2.5">
                {testCases.map((tc) => {
                  const isSelected = defectiveTcId === tc.id;
                  return (
                    <div
                      key={tc.id}
                      onClick={() => setDefectiveTcId(tc.id)}
                      className={`p-3.5 rounded-lg border text-xs font-mono transition cursor-pointer ${
                        isSelected
                          ? 'border-brand bg-brand-subtle/40 ring-1 ring-brand'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-bold text-brand">
                          Test Case ID: {tc.id}
                        </span>
                        {isSelected && (
                          <span className="text-[10px] uppercase font-semibold text-brand bg-white px-2 py-0.5 rounded border border-brand/30">
                            Selected
                          </span>
                        )}
                      </div>
                      <div className="text-slate-700">
                        <span className="text-slate-400 font-sans">Input: </span>
                        <span className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-800 whitespace-pre">
                          {tc.input}
                        </span>
                      </div>
                      <div className="text-slate-700 mt-1">
                        <span className="text-slate-400 font-sans">Asserted Output: </span>
                        <span className="font-semibold text-slate-900">{tc.expected_output}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </section>

        {/* Right Column: Interaction Arena (Takes 5 columns on large displays) */}
        <section className="lg:col-span-5 space-y-4">
          <div className="bg-canvas-panel border border-border-subtle rounded-xl p-5 shadow-card">
            {challenge.challenge_type === 'JUMBLED_CODE' ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-xs font-semibold text-content-primary uppercase tracking-wider">
                    Drag Lines into Correct Order
                  </h2>
                  <span className="text-[11px] text-content-muted">
                    Use handles to arrange statements
                  </span>
                </div>

                <DragDropContext onDragEnd={handleDragEnd}>
                  <Droppable droppableId="code-blocks-list">
                    {(provided) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="space-y-2 bg-[#06090e] p-3 rounded-lg border border-slate-800"
                      >
                        {orderedBlocks.map((b, idx) => (
                          <Draggable key={b.id} draggableId={b.id} index={idx}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                className={`p-2.5 rounded-md font-mono text-xs flex items-center gap-3 transition select-none ${
                                  snapshot.isDragging
                                    ? 'bg-slate-800 border-brand shadow-lg ring-1 ring-brand text-white'
                                    : 'bg-[#0f141c] hover:bg-[#161d28] border border-slate-800 text-slate-200'
                                }`}
                              >
                                <div
                                  {...provided.dragHandleProps}
                                  className="cursor-grab active:cursor-grabbing text-slate-500 hover:text-slate-300"
                                >
                                  <GripVertical className="w-4 h-4" />
                                </div>

                                <span className="text-slate-500 text-[11px] w-5 text-right font-mono">
                                  {idx + 1}.
                                </span>

                                <pre className="font-mono text-xs overflow-x-auto m-0 flex-1 whitespace-pre">
                                  {b.code}
                                </pre>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="border-b border-border-subtle pb-2">
                  <h2 className="text-xs font-semibold text-content-primary uppercase tracking-wider">
                    Test Case Assertion
                  </h2>
                  <p className="text-[11px] text-content-muted mt-0.5">
                    Select the test case that exposes the bug and submit the corrected return output.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-content-primary mb-1">
                    Defective Test Case ID
                  </label>
                  {testCases.length > 0 ? (
                    <select
                      value={defectiveTcId}
                      onChange={(e) => setDefectiveTcId(e.target.value)}
                      className="w-full bg-white border border-border-subtle rounded-md px-3 py-2 text-xs font-mono focus:border-brand focus:outline-none cursor-pointer"
                    >
                      <option value="">-- Choose Failing Test Case ID --</option>
                      {testCases.map((tc) => (
                        <option key={tc.id} value={tc.id}>
                          {tc.id} (Input: {tc.input.replace(/\n/g, ', ')})
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      value={defectiveTcId}
                      onChange={(e) => setDefectiveTcId(e.target.value)}
                      placeholder="e.g. tc_C or tc_2"
                      className="w-full bg-white border border-border-subtle rounded-md px-3 py-2 text-xs font-mono focus:border-brand focus:outline-none"
                    />
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium text-content-primary mb-1">
                    Corrected Expected Output
                  </label>
                  <input
                    type="text"
                    value={correctedOutput}
                    onChange={(e) => setCorrectedOutput(e.target.value)}
                    placeholder="e.g. 4294967294"
                    className="w-full bg-white border border-border-subtle rounded-md px-3 py-2 text-xs font-mono focus:border-brand focus:outline-none"
                  />
                  <p className="text-[10px] text-content-muted mt-1 font-mono">
                    Must be the exact output returned by a bug-free specification.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Result Alert */}
          {result && (
            <div className={`p-4 rounded-xl border text-xs shadow-xs animate-in fade-in duration-200 ${
              result.correct 
                ? 'bg-status-passBg border-status-pass/20 text-status-pass' 
                : 'bg-status-failBg border-status-fail/20 text-status-fail'
            }`}>
              <div className="flex items-center gap-2 font-bold mb-1">
                {result.correct ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                <span>{result.correct ? 'Accepted!' : 'Test Cases / Order Failed'}</span>
              </div>
              <p className="leading-relaxed">{result.feedback}</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}