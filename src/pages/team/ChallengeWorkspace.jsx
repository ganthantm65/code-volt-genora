import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Play, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  GripVertical 
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
      try {
        const data = await apiRequest(`/team/challenges/${id}`, 'GET', null, 'team');
        const chal = data.challenge || data;
        setChallenge(chal);

        if (chal.challenge_type === 'JUMBLED_CODE' && chal.content_payload?.blocks) {
          // Shuffle items if loading fresh so contestants must reorder
          const blocksCopy = [...chal.content_payload.blocks];
          const shuffled = blocksCopy.sort(() => 0.5 - Math.random());
          setOrderedBlocks(shuffled);
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

  return (
    <div className="min-h-screen bg-canvas-base flex flex-col font-sans">
      <Navbar role="team" />

      {/* Workspace Sub-nav */}
      <header className="bg-canvas-panel border-b border-border-subtle px-6 py-3 flex items-center justify-between">
        <button
          onClick={() => navigate('/lobby')}
          className="flex items-center gap-1.5 text-xs text-content-muted hover:text-content-primary transition"
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
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Problem Brief */}
        <section className="bg-canvas-panel border border-border-subtle rounded-xl p-5 shadow-card space-y-4 self-start">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-brand-subtle text-brand border border-brand/20">
              #{challenge.challenge_number} • {challenge.challenge_type}
            </span>
            <span className="text-xs font-mono text-content-muted">
              Max: {challenge.max_points} pts
            </span>
          </div>

          <h1 className="text-lg font-bold text-content-primary">{challenge.title}</h1>
          <p className="text-xs text-content-secondary whitespace-pre-line leading-relaxed">
            {challenge.description}
          </p>
        </section>

        {/* Right Column: Interaction Arena */}
        <section className="space-y-4">
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
              <div className="space-y-3">
                <h2 className="text-xs font-semibold text-content-primary uppercase tracking-wider">
                  Test Case Assertion
                </h2>
                <div>
                  <label className="block text-xs font-medium text-content-primary mb-1">
                    Defective Test Case ID
                  </label>
                  <input
                    type="text"
                    value={defectiveTcId}
                    onChange={(e) => setDefectiveTcId(e.target.value)}
                    placeholder="e.g. tc_2"
                    className="w-full bg-white border border-border-subtle rounded-md px-3 py-2 text-xs font-mono focus:border-brand focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-content-primary mb-1">
                    Corrected Expected Output
                  </label>
                  <input
                    type="text"
                    value={correctedOutput}
                    onChange={(e) => setCorrectedOutput(e.target.value)}
                    placeholder="e.g. -1"
                    className="w-full bg-white border border-border-subtle rounded-md px-3 py-2 text-xs font-mono focus:border-brand focus:outline-none"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Result Alert */}
          {result && (
            <div className={`p-4 rounded-xl border text-xs ${
              result.correct 
                ? 'bg-status-passBg border-status-pass/20 text-status-pass' 
                : 'bg-status-failBg border-status-fail/20 text-status-fail'
            }`}>
              <div className="flex items-center gap-2 font-bold mb-1">
                {result.correct ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                <span>{result.correct ? 'Accepted!' : 'Test Cases / Order Failed'}</span>
              </div>
              <p>{result.feedback}</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}