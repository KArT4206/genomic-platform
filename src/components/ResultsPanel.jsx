import React from "react";

export default function ResultsPanel({ summary = [], fileName = "(file)" }) {
  return (
    <div className="p-6 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 shadow-lg border border-slate-700">
      <div className="flex justify-between items-center mb-4">
        <div>
          <div className="text-xs text-slate-400">File</div>
          <div className="font-semibold text-indigo-300">{fileName}</div>
        </div>
        <div className="text-right">
          <div className="text-xs text-slate-400">Tests</div>
          <div className="font-semibold text-cyan-300">{summary.length}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {summary.length === 0 ? (
          <div className="text-slate-400 text-center py-3">No results yet</div>
        ) : (
          summary.map((s, idx) => (
            <div
              key={idx}
              className="bg-slate-900 p-4 rounded-lg border border-slate-700 hover:border-indigo-500 transition"
            >
              <div className="text-cyan-300 font-semibold">{s.name}</div>
              <div className="text-xs text-slate-400 mt-1">
                {s.count} matches found
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
