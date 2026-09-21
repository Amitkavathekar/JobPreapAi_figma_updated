import { useState } from "react";

interface AnalysisItem {
  id: number;
  role: string;
  company: string;
  date: string;
  score: number;
  ats: number;
  status: string;
  matched: string[];
  missing: string[];
  tips: string[];
}

interface InterviewItem {
  id: number;
  type: string;
  role: string;
  date: string;
  score: number;
  duration: string;
  questions: number;
  techAcc: number;
  commClarity: number;
  probSolve: number;
  feedback: { q: string; score: string; note: string }[];
}

const analysisHistory: AnalysisItem[] = [
  {
    id: 1,
    role: "Senior Frontend Engineer",
    company: "Stripe",
    date: "Sep 3, 2026",
    score: 68,
    ats: 74,
    status: "analyzed",
    matched: ["React", "TypeScript", "Redux", "GraphQL", "REST APIs", "Jest"],
    missing: ["Kubernetes", "gRPC", "Docker"],
    tips: [
      "Include quantified impact for AWS EC2 deployment.",
      "Add container orchestration or Kubernetes experience.",
      "Ensure phone number format includes country code."
    ],
  },
  {
    id: 2,
    role: "Staff Software Engineer",
    company: "Notion",
    date: "Aug 28, 2026",
    score: 82,
    ats: 88,
    status: "applied",
    matched: ["React", "TypeScript", "Next.js", "Tailwind CSS", "WebSockets", "Vite"],
    missing: ["Rust", "WebAssembly"],
    tips: [
      "Highlight CRDT document synchronization experience.",
      "Emphasize offline storage optimization with IndexedDB."
    ],
  },
  {
    id: 3,
    role: "Frontend Lead",
    company: "Linear",
    date: "Aug 21, 2026",
    score: 75,
    ats: 71,
    status: "interview",
    matched: ["React", "TypeScript", "Vite", "GraphQL", "Jest"],
    missing: ["Electron", "SQLite"],
    tips: [
      "Emphasize desktop application performance optimization.",
      "Add optimistic UI update patterns."
    ],
  },
  {
    id: 4,
    role: "Senior Engineer (Growth)",
    company: "Figma",
    date: "Aug 15, 2026",
    score: 91,
    ats: 93,
    status: "offer",
    matched: ["React", "TypeScript", "Canvas API", "WebGL", "CI/CD", "Tailwind CSS"],
    missing: ["C++"],
    tips: [
      "Outstanding overall match!",
      "Highlight revenue growth achieved through A/B testing."
    ],
  },
  {
    id: 5,
    role: "Principal Engineer",
    company: "Vercel",
    date: "Aug 8, 2026",
    score: 55,
    ats: 62,
    status: "rejected",
    matched: ["Next.js", "Edge Functions", "TypeScript"],
    missing: ["Turbopack", "Compiler Architecture"],
    tips: [
      "Add deep compiler and edge runtime experience.",
      "Quantify open-source contributions."
    ],
  },
];

const interviewHistory: InterviewItem[] = [
  {
    id: 1,
    type: "Mock Interview",
    role: "Stripe SWE",
    date: "Sep 3, 2026",
    score: 78,
    duration: "42 min",
    questions: 3,
    techAcc: 82,
    commClarity: 88,
    probSolve: 72,
    feedback: [
      {
        q: "Explain React Fiber reconciliation and Fiber tree structure.",
        score: "8.5/10",
        note: "Strong grasp of Fiber linked list. Add details on work loop scheduling and priority levels."
      },
      {
        q: "Design a high-concurrency payment checkout API layer.",
        score: "7.8/10",
        note: "Good architecture breakdown. Mention idempotency headers and tokenized iframe security."
      },
      {
        q: "STAR Method: Resolving technical disagreements with senior leads.",
        score: "8.0/10",
        note: "Clear Situation & Action. Include hard revenue or metric improvements in the Result."
      }
    ]
  },
  {
    id: 2,
    type: "Mock Interview",
    role: "Notion Staff Eng",
    date: "Aug 25, 2026",
    score: 85,
    duration: "38 min",
    questions: 2,
    techAcc: 88,
    commClarity: 90,
    probSolve: 84,
    feedback: [
      {
        q: "CRDTs vs Operational Transformation for collaborative document sync.",
        score: "9.0/10",
        note: "Excellent comparison! Clear explanation of Yjs vector clocks and causal ordering."
      },
      {
        q: "Optimizing WebGL canvas rendering at 60fps.",
        score: "8.2/10",
        note: "Solid understanding of batching draw calls and reducing Garbage Collection spikes."
      }
    ]
  },
  {
    id: 3,
    type: "Behavioral Drill",
    role: "General Leadership",
    date: "Aug 20, 2026",
    score: 80,
    duration: "22 min",
    questions: 2,
    techAcc: 78,
    commClarity: 85,
    probSolve: 80,
    feedback: [
      {
        q: "Tell me about a production outage caused by a peer's deployment.",
        score: "8.0/10",
        note: "Great blameless post-mortem approach and quick 3-minute rollback protocol."
      },
      {
        q: "How do you mentor junior developers across remote teams?",
        score: "8.0/10",
        note: "Good emphasis on design RFCs and pair programming."
      }
    ]
  },
  {
    id: 4,
    type: "System Design",
    role: "Linear Lead",
    date: "Aug 18, 2026",
    score: 72,
    duration: "55 min",
    questions: 2,
    techAcc: 75,
    commClarity: 74,
    probSolve: 70,
    feedback: [
      {
        q: "Real-time sync engine for high-frequency issue tracker.",
        score: "7.2/10",
        note: "Good WebSocket overview. Add optimistic UI update fallback & conflict resolution mechanisms."
      }
    ]
  },
];

const statusStyles: Record<string, { bg: string; color: string; label: string }> = {
  analyzed: { bg: "rgba(124,58,237,0.15)", color: "#c4b5fd", label: "Analyzed" },
  applied: { bg: "rgba(6,182,212,0.15)", color: "#67e8f9", label: "Applied" },
  interview: { bg: "rgba(245,158,11,0.15)", color: "#fcd34d", label: "In Interview" },
  offer: { bg: "rgba(16,185,129,0.15)", color: "#6ee7b7", label: "Offer" },
  rejected: { bg: "rgba(239,68,68,0.15)", color: "#fca5a5", label: "Rejected" },
};

export default function Reports() {
  const [activeTab, setActiveTab] = useState<"analysis" | "interviews">("analysis");

  // Selected item for View Analysis Modal
  const [selectedAnalysis, setSelectedAnalysis] = useState<AnalysisItem | null>(null);

  // Selected item for Review Interview Modal
  const [selectedInterview, setSelectedInterview] = useState<InterviewItem | null>(null);

  return (
    <div className="fade-in page-container" style={{ height: "100%", overflowY: "auto" }}>
      {/* Header */}
      <div className="stack-on-mobile" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24, gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: "white", margin: 0, letterSpacing: "-0.02em" }}>
            Reports & <span className="gradient-text">History</span>
          </h1>
          <p style={{ color: "rgba(148,163,184,0.6)", fontSize: 14, margin: "6px 0 0" }}>
            Complete history of analyses, interviews, and candidate progress.
          </p>
        </div>
        <button
          className="btn-primary"
          style={{ padding: "9px 18px", fontSize: 13 }}
          onClick={() => {
            const blob = new Blob(
              [
                "JobPrep AI Report - Candidate Summary\n\nAnalysis History:\n" +
                  analysisHistory.map((a) => `${a.role} @ ${a.company} — Match: ${a.score}%, ATS: ${a.ats}%`).join("\n") +
                  "\n\nInterview History:\n" +
                  interviewHistory.map((iv) => `${iv.type} (${iv.role}) — Score: ${iv.score}/100`).join("\n")
              ],
              { type: "text/plain" }
            );
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "JobPrep_AI_Performance_Report.txt";
            a.click();
            URL.revokeObjectURL(url);
          }}
        >
          ↓ Export Report Summary
        </button>
      </div>

      {/* Summary Stats (3 Cards as requested - Offers Received and Acceptance Rate cards removed) */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 24 }}>
        {[
          { label: "Total Analyses", value: "38", color: "#7c3aed", sub: "Resumes & JD Scans" },
          { label: "Avg Match Score", value: "74%", color: "#06b6d4", sub: "Top Candidate Percentile" },
          { label: "Mock Interviews", value: "12", color: "#10b981", sub: "AI Voice Sessions" },
        ].map((s) => (
          <div key={s.label} className="glass glass-hover" style={{ padding: "20px 22px" }}>
            <div style={{ fontSize: 11, color: "rgba(148,163,184,0.5)", fontFamily: "JetBrains Mono", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>
              {s.label}
            </div>
            <div style={{ fontSize: 32, fontWeight: 800, color: s.color, letterSpacing: "-0.03em", marginBottom: 4 }}>
              {s.value}
            </div>
            <div style={{ fontSize: 12, color: "rgba(148,163,184,0.6)" }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 4, marginBottom: 20, background: "rgba(255,255,255,0.04)", borderRadius: 10, padding: 4, width: "fit-content" }}>
        {([["analysis", "Analysis History"], ["interviews", "Interview History"]] as const).map(([id, label]) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            style={{
              padding: "8px 20px",
              borderRadius: 8,
              border: "none",
              cursor: "pointer",
              fontFamily: "Outfit",
              fontWeight: 600,
              fontSize: 13,
              background: activeTab === id ? "linear-gradient(135deg, #7c3aed, #06b6d4)" : "transparent",
              color: activeTab === id ? "white" : "rgba(148,163,184,0.6)",
              transition: "all 0.2s ease",
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Analysis History Tab */}
      {activeTab === "analysis" && (
        <div className="glass" style={{ overflow: "hidden" }}>
          <div style={{ padding: "16px 22px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "grid", gridTemplateColumns: "1fr 140px 100px 100px 90px", gap: 16 }}>
            {["Role & Company", "Date", "Match", "ATS", "Action"].map((h) => (
              <div key={h} style={{ fontSize: 11, fontFamily: "JetBrains Mono", color: "rgba(148,163,184,0.4)", fontWeight: 600, letterSpacing: "0.06em" }}>
                {h.toUpperCase()}
              </div>
            ))}
          </div>
          {analysisHistory.map((a, i) => {
            return (
              <div
                key={a.id}
                style={{
                  padding: "16px 22px",
                  borderBottom: i < analysisHistory.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                  display: "grid",
                  gridTemplateColumns: "1fr 140px 100px 100px 90px",
                  gap: 16,
                  alignItems: "center",
                  transition: "background 0.15s",
                }}
                className="glass-hover"
              >
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "white" }}>{a.role}</div>
                  <div style={{ fontSize: 12, color: "rgba(148,163,184,0.5)" }}>{a.company}</div>
                </div>
                <div style={{ fontSize: 13, color: "rgba(148,163,184,0.6)", fontFamily: "JetBrains Mono" }}>{a.date}</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: a.score >= 80 ? "#10b981" : a.score >= 65 ? "#f59e0b" : "#ef4444", fontFamily: "JetBrains Mono" }}>
                  {a.score}%
                </div>
                <div style={{ fontSize: 15, fontWeight: 700, color: a.ats >= 80 ? "#10b981" : a.ats >= 65 ? "#f59e0b" : "#ef4444", fontFamily: "JetBrains Mono" }}>
                  {a.ats}%
                </div>
                <button
                  className="btn-ghost"
                  style={{
                    padding: "6px 14px",
                    fontSize: 12,
                    borderColor: "rgba(124, 58, 237, 0.4)",
                    color: "#a78bfa",
                    cursor: "pointer",
                    fontWeight: 600,
                  }}
                  onClick={() => setSelectedAnalysis(a)}
                >
                  👁 View
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Interview History Tab */}
      {activeTab === "interviews" && (
        <div className="glass" style={{ overflow: "hidden" }}>
          <div style={{ padding: "16px 22px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "grid", gridTemplateColumns: "1fr 110px 120px 90px 90px 90px", gap: 16 }}>
            {["Type & Role", "Date", "Duration", "Questions", "Score", "Action"].map((h) => (
              <div key={h} style={{ fontSize: 11, fontFamily: "JetBrains Mono", color: "rgba(148,163,184,0.4)", fontWeight: 600, letterSpacing: "0.06em" }}>
                {h.toUpperCase()}
              </div>
            ))}
          </div>
          {interviewHistory.map((iv, i) => (
            <div
              key={iv.id}
              style={{
                padding: "16px 22px",
                borderBottom: i < interviewHistory.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                display: "grid",
                gridTemplateColumns: "1fr 110px 120px 90px 90px 90px",
                gap: 16,
                alignItems: "center",
              }}
              className="glass-hover"
            >
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "white" }}>{iv.type}</div>
                <div style={{ fontSize: 12, color: "rgba(148,163,184,0.5)" }}>{iv.role}</div>
              </div>
              <div style={{ fontSize: 13, color: "rgba(148,163,184,0.6)", fontFamily: "JetBrains Mono" }}>{iv.date}</div>
              <div style={{ fontSize: 13, color: "rgba(148,163,184,0.6)" }}>{iv.duration}</div>
              <div style={{ fontSize: 13, color: "rgba(148,163,184,0.6)", fontFamily: "JetBrains Mono" }}>{iv.questions} Q</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: iv.score >= 80 ? "#10b981" : iv.score >= 65 ? "#f59e0b" : "#ef4444", fontFamily: "JetBrains Mono" }}>
                {iv.score}/100
              </div>
              <button
                className="btn-ghost"
                style={{
                  padding: "6px 14px",
                  fontSize: 12,
                  borderColor: "rgba(6, 182, 212, 0.4)",
                  color: "#06b6d4",
                  cursor: "pointer",
                  fontWeight: 600,
                }}
                onClick={() => setSelectedInterview(iv)}
              >
                📋 Review
              </button>
            </div>
          ))}
        </div>
      )}

      {/* MODAL 1: VIEW ANALYSIS REPORT DETAILS */}
      {selectedAnalysis && (
        <div
          className="fade-in"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            background: "rgba(5, 5, 18, 0.85)",
            backdropFilter: "blur(14px)",
            WebkitBackdropFilter: "blur(14px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedAnalysis(null);
          }}
        >
          <div
            className="glass"
            style={{
              width: "100%",
              maxWidth: 680,
              maxHeight: "88vh",
              overflowY: "auto",
              borderRadius: 20,
              background: "#0d0d2b",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              boxShadow: "0 25px 70px rgba(0,0,0,0.85), 0 0 30px rgba(124, 58, 237, 0.25)",
              padding: 28,
              color: "#ffffff",
              position: "relative",
            }}
          >
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
              <div>
                <div style={{ fontSize: 20, fontWeight: 800, color: "white", marginBottom: 2 }}>
                  {selectedAnalysis.role}
                </div>
                <div style={{ fontSize: 13, color: "#a78bfa", fontWeight: 600 }}>
                  🏢 {selectedAnalysis.company} • <span style={{ color: "rgba(148,163,184,0.7)" }}>{selectedAnalysis.date}</span>
                </div>
              </div>

              <button
                onClick={() => setSelectedAnalysis(null)}
                style={{
                  background: "rgba(255, 255, 255, 0.08)",
                  border: "1px solid rgba(255, 255, 255, 0.12)",
                  color: "rgba(226, 232, 240, 0.8)",
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  fontSize: 16,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                className="glass-hover"
              >
                ✕
              </button>
            </div>

            {/* Score Cards Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 22 }}>
              <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: "16px 18px" }}>
                <div style={{ fontSize: 11, color: "rgba(148,163,184,0.6)", fontFamily: "JetBrains Mono", textTransform: "uppercase" }}>Overall JD Match</div>
                <div style={{ fontSize: 32, fontWeight: 800, color: selectedAnalysis.score >= 80 ? "#10b981" : "#f59e0b", marginTop: 4 }}>
                  {selectedAnalysis.score}%
                </div>
              </div>

              <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: "16px 18px" }}>
                <div style={{ fontSize: 11, color: "rgba(148,163,184,0.6)", fontFamily: "JetBrains Mono", textTransform: "uppercase" }}>ATS Parse Score</div>
                <div style={{ fontSize: 32, fontWeight: 800, color: selectedAnalysis.ats >= 80 ? "#10b981" : "#06b6d4", marginTop: 4 }}>
                  {selectedAnalysis.ats}%
                </div>
              </div>
            </div>

            {/* Matched Skills */}
            <div style={{ marginBottom: 18 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#10b981", marginBottom: 8 }}>
                ✓ Matched Key Skills ({selectedAnalysis.matched.length})
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {selectedAnalysis.matched.map((m) => (
                  <span key={m} style={{ fontSize: 12, background: "rgba(16, 185, 129, 0.15)", color: "#10b981", padding: "4px 10px", borderRadius: 8, border: "1px solid rgba(16, 185, 129, 0.3)", fontWeight: 600 }}>
                    {m}
                  </span>
                ))}
              </div>
            </div>

            {/* Missing Skills */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#ef4444", marginBottom: 8 }}>
                ⚠ Missing Keywords ({selectedAnalysis.missing.length})
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {selectedAnalysis.missing.map((m) => (
                  <span key={m} style={{ fontSize: 12, background: "rgba(239, 68, 68, 0.15)", color: "#ef4444", padding: "4px 10px", borderRadius: 8, border: "1px solid rgba(239, 68, 68, 0.3)", fontWeight: 600 }}>
                    {m}
                  </span>
                ))}
              </div>
            </div>

            {/* AI Recommendations */}
            <div style={{ background: "rgba(124, 58, 237, 0.1)", border: "1px solid rgba(124, 58, 237, 0.3)", borderRadius: 14, padding: 16, marginBottom: 24 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#a78bfa", marginBottom: 8 }}>
                💡 Key Recommendations:
              </div>
              <ul style={{ margin: 0, paddingLeft: 18, fontSize: 12.5, color: "rgba(226,232,240,0.85)", display: "flex", flexDirection: "column", gap: 6, lineHeight: 1.5 }}>
                {selectedAnalysis.tips.map((t, idx) => (
                  <li key={idx}>{t}</li>
                ))}
              </ul>
            </div>

            {/* Actions */}
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <button
                className="btn-ghost"
                style={{ padding: "8px 16px", fontSize: 12 }}
                onClick={() => {
                  const content = `Analysis Report\nRole: ${selectedAnalysis.role}\nCompany: ${selectedAnalysis.company}\nDate: ${selectedAnalysis.date}\nMatch Score: ${selectedAnalysis.score}%\nATS Score: ${selectedAnalysis.ats}%\nMatched: ${selectedAnalysis.matched.join(", ")}\nMissing: ${selectedAnalysis.missing.join(", ")}`;
                  const blob = new Blob([content], { type: "text/plain" });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = `Analysis_${selectedAnalysis.company}_${selectedAnalysis.role.replace(/\s+/g, "_")}.txt`;
                  a.click();
                  URL.revokeObjectURL(url);
                }}
              >
                📥 Download Full Report
              </button>
              <button
                className="btn-primary"
                style={{ padding: "8px 20px", fontSize: 12 }}
                onClick={() => setSelectedAnalysis(null)}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: REVIEW INTERVIEW SCORECARD & FEEDBACK */}
      {selectedInterview && (
        <div
          className="fade-in"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            background: "rgba(5, 5, 18, 0.85)",
            backdropFilter: "blur(14px)",
            WebkitBackdropFilter: "blur(14px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedInterview(null);
          }}
        >
          <div
            className="glass"
            style={{
              width: "100%",
              maxWidth: 720,
              maxHeight: "88vh",
              overflowY: "auto",
              borderRadius: 20,
              background: "#0d0d2b",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              boxShadow: "0 25px 70px rgba(0,0,0,0.85), 0 0 30px rgba(6, 182, 212, 0.25)",
              padding: 28,
              color: "#ffffff",
              position: "relative",
            }}
          >
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
              <div>
                <div style={{ fontSize: 20, fontWeight: 800, color: "white", marginBottom: 2 }}>
                  {selectedInterview.type} Scorecard
                </div>
                <div style={{ fontSize: 13, color: "#06b6d4", fontWeight: 600 }}>
                  🎯 {selectedInterview.role} • <span style={{ color: "rgba(148,163,184,0.7)" }}>{selectedInterview.date} ({selectedInterview.duration})</span>
                </div>
              </div>

              <button
                onClick={() => setSelectedInterview(null)}
                style={{
                  background: "rgba(255, 255, 255, 0.08)",
                  border: "1px solid rgba(255, 255, 255, 0.12)",
                  color: "rgba(226, 232, 240, 0.8)",
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  fontSize: 16,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                className="glass-hover"
              >
                ✕
              </button>
            </div>

            {/* Overall Performance Card */}
            <div style={{ background: "rgba(6, 182, 212, 0.1)", border: "1px solid rgba(6, 182, 212, 0.3)", borderRadius: 16, padding: 20, marginBottom: 22, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontSize: 11, color: "rgba(148,163,184,0.7)", textTransform: "uppercase", letterSpacing: "0.06em", fontFamily: "JetBrains Mono" }}>
                  Overall Interview Score
                </div>
                <div style={{ fontSize: 36, fontWeight: 800, color: "#10b981", lineHeight: 1.1, marginTop: 2 }}>
                  {selectedInterview.score} <span style={{ fontSize: 16, color: "rgba(148,163,184,0.6)", fontWeight: 500 }}>/ 100</span>
                </div>
              </div>

              <div style={{ textAlign: "right" }}>
                <span style={{ background: "rgba(16, 185, 129, 0.2)", border: "1px solid rgba(16, 185, 129, 0.4)", color: "#34d399", padding: "6px 14px", borderRadius: 8, fontSize: 13, fontWeight: 700 }}>
                  Grade: B+ (Strong Candidate)
                </span>
              </div>
            </div>

            {/* Metric Breakdown */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 24 }}>
              <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: "12px 14px", textAlign: "center" }}>
                <div style={{ fontSize: 11, color: "rgba(148,163,184,0.6)" }}>Tech Accuracy</div>
                <div style={{ fontSize: 20, fontWeight: 800, color: "#a78bfa", marginTop: 2 }}>{selectedInterview.techAcc}%</div>
              </div>
              <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: "12px 14px", textAlign: "center" }}>
                <div style={{ fontSize: 11, color: "rgba(148,163,184,0.6)" }}>Communication</div>
                <div style={{ fontSize: 20, fontWeight: 800, color: "#06b6d4", marginTop: 2 }}>{selectedInterview.commClarity}%</div>
              </div>
              <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: "12px 14px", textAlign: "center" }}>
                <div style={{ fontSize: 11, color: "rgba(148,163,184,0.6)" }}>Problem Solving</div>
                <div style={{ fontSize: 20, fontWeight: 800, color: "#10b981", marginTop: 2 }}>{selectedInterview.probSolve}%</div>
              </div>
            </div>

            {/* Questions Breakdown */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "white", marginBottom: 12 }}>
                💬 Question-by-Question Feedback ({selectedInterview.feedback.length} Questions)
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {selectedInterview.feedback.map((fb, idx) => (
                  <div key={idx} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: 14 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "#e2e8f0" }}>
                        Q{idx + 1}: {fb.q}
                      </div>
                      <span style={{ fontSize: 11, fontWeight: 700, color: "#10b981", fontFamily: "JetBrains Mono" }}>
                        {fb.score}
                      </span>
                    </div>
                    <div style={{ fontSize: 12, color: "rgba(148,163,184,0.8)", lineHeight: 1.5 }}>
                      {fb.note}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <button
                className="btn-ghost"
                style={{ padding: "8px 16px", fontSize: 12 }}
                onClick={() => {
                  const content = `Interview Review Scorecard\nType: ${selectedInterview.type}\nRole: ${selectedInterview.role}\nScore: ${selectedInterview.score}/100\nDuration: ${selectedInterview.duration}\nAccuracy: ${selectedInterview.techAcc}%\nCommunication: ${selectedInterview.commClarity}%\nProblem Solving: ${selectedInterview.probSolve}%\n\nFeedback:\n` + selectedInterview.feedback.map((f, i) => `Q${i+1}: ${f.q} (${f.score})\nNote: ${f.note}`).join("\n\n");
                  const blob = new Blob([content], { type: "text/plain" });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = `Interview_Scorecard_${selectedInterview.role.replace(/\s+/g, "_")}.txt`;
                  a.click();
                  URL.revokeObjectURL(url);
                }}
              >
                📥 Download Scorecard
              </button>
              <button
                className="btn-primary"
                style={{ padding: "8px 20px", fontSize: 12 }}
                onClick={() => setSelectedInterview(null)}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
