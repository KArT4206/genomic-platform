// src/components/UserDashboard.jsx
import React, { useState, useEffect } from "react";
import {
  auth,
  db,
  signOut,
  collection,
  addDoc,
  serverTimestamp,
  onAuthStateChanged,
} from "../firebase";
import { onSnapshot, query, orderBy, where } from "firebase/firestore";
import ResultsPanel from "./ResultsPanel";
import { tests, runAllTests } from "../dnaTests";

export default function UserDashboard() {
  const [sequence, setSequence] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState([]);
  const [tab, setTab] = useState("results");
  const [user, setUser] = useState(null);
  const [localResult, setLocalResult] = useState(null);
  const [fileName, setFileName] = useState("");

  // 🔥 Auth listener
  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsubAuth();
  }, []);

  // 🔥 Real-time Firestore listener
  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, "results"),
      where("user", "==", user.email),
      orderBy("createdAt", "desc")
    );
    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setResults(data);
    });
    return () => unsub();
  }, [user]);

  // ⚡ Parse FASTA file
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFileName(file.name);
    const text = await file.text();
    // Extract sequence (remove FASTA header and newlines)
    const parsedSequence = text
      .split("\n")
      .filter((line) => !line.startsWith(">"))
      .join("")
      .trim()
      .toUpperCase();

    if (!parsedSequence.match(/^[ATGC]+$/i)) {
      alert("Invalid FASTA sequence (should only contain A, T, G, C)");
      return;
    }

    setSequence(parsedSequence);
    setTab("analyze");
  };

  // ⚡ Analyze DNA instantly
  const handleAnalyze = async () => {
    if (!sequence.trim()) return alert("Please enter or upload a DNA sequence!");
    setAnalyzing(true);

    try {
      const analysis = runAllTests(sequence);
      const summary = Object.keys(analysis).map((key) => ({
        name: key,
        count: analysis[key].length,
      }));

      // Save to Firestore
      await addDoc(collection(db, "results"), {
        user: user.email,
        fileName: fileName || "Direct Input Sequence",
        summary,
        createdAt: serverTimestamp(),
      });

      // Show instantly
      setLocalResult({ fileName: fileName || "Direct Input Sequence", summary });

      setSequence("");
      setFileName("");
      setTab("results");
    } catch (err) {
      console.error(err);
      alert("Error analyzing sequence");
    } finally {
      setAnalyzing(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100 flex flex-col">
      {/* Navbar */}
      <nav className="flex items-center justify-between bg-slate-900 px-6 py-4 border-b border-slate-800 shadow-md">
        <h1 className="text-xl font-semibold text-indigo-300">🧬 Genomic Dashboard</h1>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setTab("results")}
            className={`px-3 py-1 rounded transition-all ${
              tab === "results"
                ? "bg-indigo-600 text-white"
                : "bg-slate-800 hover:bg-slate-700 text-slate-300"
            }`}
          >
            My Results
          </button>
          <button
            onClick={() => setTab("analyze")}
            className={`px-3 py-1 rounded transition-all ${
              tab === "analyze"
                ? "bg-indigo-600 text-white"
                : "bg-slate-800 hover:bg-slate-700 text-slate-300"
            }`}
          >
            Analyze DNA
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-white"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Main */}
      <div className="flex-1 p-6">
        {/* Results Tab */}
        {tab === "results" && (
          <div className="space-y-6">
            {localResult && (
              <ResultsPanel
                key="local"
                fileName={localResult.fileName}
                summary={localResult.summary}
              />
            )}
            {results.length === 0 && !localResult ? (
              <div className="text-center text-slate-400 py-20 text-lg">
                No results yet — analyze a DNA sequence 🧬
              </div>
            ) : (
              results.map((r) => (
                <ResultsPanel key={r.id} fileName={r.fileName} summary={r.summary} />
              ))
            )}
          </div>
        )}

        {/* Analyze Tab */}
        {tab === "analyze" && (
          <div className="bg-slate-900 p-8 rounded-2xl shadow-lg max-w-2xl mx-auto mt-10 border border-slate-800">
            <h2 className="text-lg font-semibold mb-4 text-indigo-300">
              🧫 Paste DNA Sequence or Upload FASTA File
            </h2>

            <input
              type="file"
              accept=".fasta,.fa,.txt"
              onChange={handleFileUpload}
              className="block w-full text-sm text-slate-300 bg-slate-800 border border-slate-700 rounded p-2 mb-3 cursor-pointer"
            />

            <textarea
              rows={6}
              value={sequence}
              onChange={(e) => setSequence(e.target.value.toUpperCase())}
              placeholder="Enter your DNA sequence here (A, T, G, C)..."
              className="block w-full text-sm text-slate-200 bg-slate-800 border border-slate-700 rounded p-3 mb-4 focus:ring-2 focus:ring-indigo-600 outline-none resize-none"
            />

            <button
              onClick={handleAnalyze}
              disabled={analyzing}
              className={`w-full py-2 rounded-md font-medium transition-all ${
                analyzing
                  ? "bg-indigo-400 cursor-wait"
                  : "bg-indigo-600 hover:bg-indigo-700"
              }`}
            >
              {analyzing ? "Analyzing..." : "Run DNA Analysis"}
            </button>

            {analyzing && (
              <div className="mt-4 text-center text-sm text-indigo-300 animate-pulse">
                Running {tests.length} genomic tests instantly ⚡
              </div>
            )}
          </div>
        )}{/* 🖨️ Print Button */}
<div className="flex justify-end mt-6">
  <button
    onClick={() => window.print()}
    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded shadow-md"
  >
    🖨️ Print My Report
  </button>
</div>

      </div>
    
    </div>
  );
}
// src/components/UserDashboard.jsx
// src/components/UserDashboard.jsx