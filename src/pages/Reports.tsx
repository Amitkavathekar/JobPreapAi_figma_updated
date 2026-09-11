import { useState } from "react";

const analysisHistory = [
  { id: 1, role: "Senior Frontend Engineer", company: "Stripe", date: "Sep 3, 2026", score: 68, ats: 74, status: "analyzed" },
  { id: 2, role: "Staff Software Engineer", company: "Notion", date: "Aug 28, 2026", score: 82, ats: 88, status: "applied" },
  { id: 3, role: "Frontend Lead", company: "Linear", date: "Aug 21, 2026", score: 75, ats: 71, status: "interview" },
  { id: 4, role: "Senior Engineer (Growth)", company: "Figma", date: "Aug 15, 2026", score: 91, ats: 93, status: "offer" },
  { id: 5, role: "Principal Engineer", company: "Vercel", date: "Aug 8, 2026", score: 55, ats: 62, status: "rejected" },
];

const interviewHistory = [
  { id: 1, type: "Mock Interview", role: "Stripe SWE", date: "Sep 3, 2026", score: 78, duration: "42 min", questions: 4 },
  { id: 2, type: "Mock Interview", role: "Notion Staff Eng", date: "Aug 25, 2026", score: 85, duration: "38 min", questions: 4 },
  { id: 3, type: "Behavioral Drill", role: "General", date: "Aug 20, 2026", score: 80, duration: "22 min", questions: 6 },
  { id: 4, type: "System Design", role: "Linear Lead", date: "Aug 18, 2026", score: 72, duration: "55 min", questions: 2 },
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

  return (
    <div className="fade-in page-container" style={{ height: "100%", overflowY: "auto" }}>
      <div className="stack-on-mobile" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24, gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: "white", margin: 0, letterSpacing: "-0.02em" }}>Reports & <span className="gradient-text">History</span></h1>
          <p style={{ color: "rgba(148,163,184,0.6)", fontSize: 14, margin: "6px 0 0" }}>Complete history of analyses, interviews, and career progress.</p>
        </div>
        <button
          className="btn-primary"
          style={{ padding: "9px 18px", fontSize: 13 }}
          onClick={() => {
            const blob = new Blob(["JobPrep AI Report - Arjun Kumar\n\nAnalysis History:\n" + analysisHistory.map(a => `${a.role} @ ${a.company} — Score: ${a.score}/100`).join("\n")], { type: "text/plain" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a"); a.href = url; a.download = "JobPrep_AI_Report.txt"; a.click();
          }}
        >
          ↓ Export PDF
        </button>
      </div>

      {/* Summary stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 14, marginBottom: 24 }}>
        {[
          { label: "Total Analyses", value: "38", color: "#7c3aed" },
          { label: "Avg Match Score", value: "74%", color: "#06b6d4" },
          { label: "Mock Interviews", value: "12", color: "#10b981" },
          { label: "Offers Received", value: "3", color: "#f59e0b" },
          { label: "Acceptance Rate", value: "7.9%", color: "#a78bfa" },
        ].map((s) => (
          <div key={s.label} className="glass glass-hover" style={{ padding: "16px 18px", textAlign: "center" }}>
            <div style={{ fontSize: 26, fontWeight: 800, color: s.color, letterSpacing: "-0.03em", marginBottom: 4 }}>{s.value}</div>
            <div style={{ fontSize: 11, color: "rgba(148,163,184,0.5)", fontFamily: "JetBrains Mono" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 4, marginBottom: 20, background: "rgba(255,255,255,0.04)", borderRadius: 10, padding: 4, width: "fit-content" }}>
        {([["analysis", "Analysis History"], ["interviews", "Interview History"]] as const).map(([id, label]) => (
          <button key={id} onClick={() => setActiveTab(id)}
            style={{ padding: "8px 20px", borderRadius: 8, border: "none", cursor: "pointer", fontFamily: "Outfit", fontWeight: 600, fontSize: 13,
              background: activeTab === id ? "linear-gradient(135deg, #7c3aed, #06b6d4)" : "transparent",
              color: activeTab === id ? "white" : "rgba(148,163,184,0.6)" }}
          >
            {label}
          </button>
        ))}
      </div>

      {activeTab === "analysis" && (
        <div className="glass" style={{ overflow: "hidden" }}>
          <div style={{ padding: "16px 22px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "grid", gridTemplateColumns: "1fr 120px 80px 80px 110px 80px", gap: 16 }}>
            {["Role & Company", "Date", "Match", "ATS", "Status", ""].map((h) => (
              <div key={h} style={{ fontSize: 11, fontFamily: "JetBrains Mono", color: "rgba(148,163,184,0.4)", fontWeight: 600, letterSpacing: "0.06em" }}>{h.toUpperCase()}</div>
            ))}
          </div>
          {analysisHistory.map((a, i) => {
            const ss = statusStyles[a.status];
            return (
              <div key={a.id} style={{ padding: "16px 22px", borderBottom: i < analysisHistory.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none", display: "grid", gridTemplateColumns: "1fr 120px 80px 80px 110px 80px", gap: 16, alignItems: "center", transition: "background 0.15s" }} className="glass-hover">
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "white" }}>{a.role}</div>
                  <div style={{ fontSize: 12, color: "rgba(148,163,184,0.5)" }}>{a.company}</div>
                </div>
                <div style={{ fontSize: 13, color: "rgba(148,163,184,0.6)", fontFamily: "JetBrains Mono" }}>{a.date}</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: a.score >= 80 ? "#10b981" : a.score >= 65 ? "#f59e0b" : "#ef4444", fontFamily: "JetBrains Mono" }}>{a.score}%</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: a.ats >= 80 ? "#10b981" : a.ats >= 65 ? "#f59e0b" : "#ef4444", fontFamily: "JetBrains Mono" }}>{a.ats}%</div>
                <div>
                  <span style={{ padding: "4px 10px", borderRadius: 6, fontSize: 12, fontWeight: 500, background: ss.bg, color: ss.color }}>{ss.label}</span>
                </div>
                <button className="btn-ghost" style={{ padding: "6px 12px", fontSize: 12 }}>View</button>
              </div>
            );
          })}
        </div>
      )}

      {activeTab === "interviews" && (
        <div className="glass" style={{ overflow: "hidden" }}>
          <div style={{ padding: "16px 22px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "grid", gridTemplateColumns: "1fr 110px 120px 90px 90px 80px", gap: 16 }}>
            {["Type & Role", "Date", "Duration", "Questions", "Score", ""].map((h) => (
              <div key={h} style={{ fontSize: 11, fontFamily: "JetBrains Mono", color: "rgba(148,163,184,0.4)", fontWeight: 600, letterSpacing: "0.06em" }}>{h.toUpperCase()}</div>
            ))}
          </div>
          {interviewHistory.map((iv, i) => (
            <div key={iv.id} style={{ padding: "16px 22px", borderBottom: i < interviewHistory.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none", display: "grid", gridTemplateColumns: "1fr 110px 120px 90px 90px 80px", gap: 16, alignItems: "center" }} className="glass-hover">
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "white" }}>{iv.type}</div>
                <div style={{ fontSize: 12, color: "rgba(148,163,184,0.5)" }}>{iv.role}</div>
              </div>
              <div style={{ fontSize: 13, color: "rgba(148,163,184,0.6)", fontFamily: "JetBrains Mono" }}>{iv.date}</div>
              <div style={{ fontSize: 13, color: "rgba(148,163,184,0.6)" }}>{iv.duration}</div>
              <div style={{ fontSize: 13, color: "rgba(148,163,184,0.6)", fontFamily: "JetBrains Mono" }}>{iv.questions} Q</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: iv.score >= 80 ? "#10b981" : iv.score >= 65 ? "#f59e0b" : "#ef4444", fontFamily: "JetBrains Mono" }}>{iv.score}/100</div>
              <button className="btn-ghost" style={{ padding: "6px 12px", fontSize: 12 }}>Review</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
