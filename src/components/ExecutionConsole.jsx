import React from 'react';
import { Terminal, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';

export default function ExecutionConsole({ result, isSubmitting, error }) {
  return (
    <div className="flex-1 flex flex-col bg-canvas-dark rounded-lg border border-slate-800 overflow-hidden font-mono text-xs shadow-card">
      <div className="h-9 bg-[#0e131f] border-b border-slate-800 px-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-400 font-mono text-[11px] uppercase tracking-wider">
          <Terminal className="w-3.5 h-3.5" />
          <span>Execution Console</span>
        </div>
        {isSubmitting && (
          <span className="text-amber-400 animate-pulse text-[11px]">Running in Sandbox...</span>
        )}
      </div>

      <div className="p-4 overflow-y-auto space-y-3 flex-1 text-slate-300">
        {error && (
          <div className="p-3 bg-status-failBg/10 border border-status-fail/30 text-rose-300 rounded flex items-start gap-2">
            <XCircle className="w-4 h-4 text-status-fail shrink-0 mt-0.5" />
            <div className="whitespace-pre-wrap">{error}</div>
          </div>
        )}

        {result ? (
          <div className="space-y-3">
            <div
              className={`p-3 rounded border flex items-center justify-between ${
                result.correct || result.is_correct
                  ? 'bg-emerald-950/40 border-status-pass/40 text-emerald-300'
                  : 'bg-rose-950/40 border-status-fail/40 text-rose-300'
              }`}
            >
              <div className="flex items-center gap-2 font-medium">
                {result.correct || result.is_correct ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                )}
                <span>{result.feedback}</span>
              </div>
              <span className="text-[11px] px-2 py-0.5 rounded bg-black/40 border border-white/10">
                {result.test_cases_passed ?? 0} / {result.total_test_cases ?? 0} Passed
              </span>
            </div>

            {Array.isArray(result.execution_logs) && result.execution_logs.length > 0 && (
              <div className="space-y-2 mt-3">
                <div className="text-[11px] uppercase tracking-wider text-slate-500 font-mono">Detailed Test Trace</div>
                <div className="space-y-1.5">
                  {result.execution_logs.map((log, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded bg-[#0b0f19] border border-slate-800 text-[12px] space-y-1"
                    >
                      {log.case !== undefined && (
                        <div className="flex justify-between items-center text-slate-400 text-[11px]">
                          <span>Test Case #{log.case}</span>
                          <span className={log.passed ? 'text-status-pass' : 'text-status-fail'}>
                            {log.passed ? 'PASSED' : 'FAILED'}
                          </span>
                        </div>
                      )}
                      {log.actual !== undefined && (
                        <div className="text-slate-300">
                          <span className="text-slate-500 mr-2">Actual:</span>
                          <span className="text-amber-300 font-mono">{log.actual || '<empty>'}</span>
                        </div>
                      )}
                      {log.expected !== undefined && (
                        <div className="text-slate-300">
                          <span className="text-slate-500 mr-2">Expected:</span>
                          <span className="text-emerald-400 font-mono">{log.expected}</span>
                        </div>
                      )}
                      {log.error && (
                        <div className="text-rose-400 font-mono whitespace-pre-wrap mt-1">
                          {log.error}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          !error && (
            <div className="text-slate-600 italic text-[12px] pt-2">
              Run or submit your solution to view Docker execution logs and hidden test results.
            </div>
          )
        )}
      </div>
    </div>
  );
}