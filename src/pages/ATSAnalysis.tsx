import { useState } from "react";
import { Screen } from "../types";
import LockedBlurOverlay from "../components/LockedBlurOverlay";

interface ATSAnalysisProps {
  onNavigate: (s: Screen) => void;
  hasActiveSubscription?: boolean;
  onOpenUpgradeModal?: () => void;
}

const checks = [
  { label: "No tables or columns", pass: true },
  { label: "No headers/footers with critical info", pass: true },
  { label: "Standard fonts (Arial, Calibri, Times)", pass: true },
  { label: "Consistent date formatting", pass: true },
  { label: "No graphics or images in body", pass: true },
  { label: "Contact info in body (not header only)", pass: false, note: "Phone in header — move to body" },
  { label: "No special characters in headings", pass: false, note: "• bullet character used in section titles" },
  { label: "File size under 1MB", pass: true },
  { label: "UTF-8 encoding", pass: true },
  { label: "No text boxes", pass: true },
];

const keywordCoverage = [
  { category: "Technical Skills", matched: 14, total: 18, color: "#7c3aed" },
  { category: "Soft Skills", matched: 5, total: 6, color: "#10b981" },
  { category: "Action Verbs", matched: 12, total: 16, color: "#06b6d4" },
  { category: "Industry Terms", matched: 7, total: 11, color: "#f59e0b" },
];

const recommendations = [
  { priority: "Critical", text: "Move phone number from header to body section — many ATS systems skip headers.", fix: "Edit contact block" },
  { priority: "Critical", text: "Replace bullet character (•) in section headings with standard hyphens or remove entirely.", fix: "Auto-fix" },
  { priority: "High", text: "Add 'Kubernetes' and 'Terraform' to skills section — both required by target JD.", fix: "Add keywords" },
  { priority: "Medium", text: "Expand acronyms on first use: 'CI/CD (Continuous Integration/Continuous Deployment)'.", fix: "Apply" },
  { priority: "Low", text: "Standardize all dates to 'Month YYYY' format (currently mixed with 'MM/YY').", fix: "Normalize" },
];

export default function ATSAnalysis({ onNavigate, hasActiveSubscription, onOpenUpgradeModal }: ATSAnalysisProps) {
  const [score, setScore] = useState(74);
  const [analyzing, setAnalyzing] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

  const handleUploadResume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFileName(file.name);
      setAnalyzing(true);
      setTimeout(() => {
        setAnalyzing(false);
        setScore((prev) => Math.min(95, prev + 8));
      }, 1500);
    }
  };

  const handleCheckATS = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      setScore((prev) => Math.min(98, prev + 5));
    }, 1200);
  };

  const ScoreGauge = ({ value }: { value: number }) => {
    const color = value >= 80 ? "#10b981" : value >= 60 ? "#f59e0b" : "#ef4444";
    return (
      <div style={{ position: "relative", width: 170, height: 170, margin: "0 auto" }}>
        <svg width="170" height="170" viewBox="0 0 170 170">
          <circle cx="85" cy="85" r="66" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="14" />
          <circle
            cx="85"
            cy="85"
            r="66"
            fill="none"
            stroke={color}
            strokeWidth="14"
            strokeLinecap="round"
            strokeDasharray={`${(value / 100) * 414.69} 414.69`}
            transform="rotate(-90 85 85)"
            style={{ filter: `drop-shadow(0 0 12px ${color}99)`, transition: "stroke-dasharray 0.8s ease" }}
          />
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <div style={{ fontSize: 54, fontWeight: 800, color: "white", letterSpacing: "-0.04em", lineHeight: 1 }}>
            {analyzing ? "..." : value}
          </div>
          <div style={{ fontSize: 11, color: "rgba(148,163,184,0.6)", fontFamily: "JetBrains Mono", marginTop: 4, letterSpacing: "0.08em", textTransform: "uppercase" }}>
            {analyzing ? "Scanning..." : "ATS Score"}
          </div>
        </div>
      </div>
    );
  };

  const passCount = checks.filter((c) => c.pass).length;

  return (
    <div className="fade-in page-container" style={{ height: "100%", overflowY: "auto" }}>
      <div className="stack-on-mobile" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20, gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: "white", margin: 0, letterSpacing: "-0.02em" }}>ATS <span className="gradient-text">Analysis</span></h1>
          <p style={{ color: "rgba(148,163,184,0.6)", fontSize: 14, margin: "6px 0 0" }}>
            Applicant Tracking System compatibility check for Stripe SWE role.
            {uploadedFileName && <span style={{ color: "#67e8f9", marginLeft: 8, fontWeight: 600 }}>[Resume: {uploadedFileName}]</span>}
          </p>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          {!hasActiveSubscription && (
            <button className="btn-primary" style={{ padding: "9px 16px", fontSize: 13, background: "linear-gradient(135deg, #7c3aed, #06b6d4)" }} onClick={onOpenUpgradeModal}>
              ⚡ Upgrade Plan
            </button>
          )}
          <button
            className="btn-primary"
            style={{ padding: "9px 16px", fontSize: 13, display: "inline-flex", alignItems: "center", gap: 6 }}
            onClick={handleCheckATS}
            disabled={analyzing}
          >
            {analyzing ? "⚡ Scanning..." : "🎯 Refresh ATS Score"}
          </button>
          <button className="btn-ghost" style={{ padding: "9px 16px", fontSize: 13 }} onClick={() => onNavigate("resume-editor")}>
            Fix Issues →
          </button>
        </div>
      </div>

      <div className="grid-responsive-3col" style={{ gap: 16, marginBottom: 20 }}>
        <div className="glass" style={{ padding: "14px 16px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <ScoreGauge value={score} />
          <div style={{ marginTop: 6, fontSize: 15, fontWeight: 800, color: "#f59e0b" }}>Good Match</div>
          <div style={{ fontSize: 11, color: "rgba(148,163,184,0.5)", marginTop: 2 }}>Above average for SWE roles</div>
        </div>

        <div className="glass" style={{ padding: "14px 18px" }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "white", marginBottom: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span>Formatting Checks</span>
            {!hasActiveSubscription && <span style={{ fontSize: 11, color: "#c4b5fd", fontFamily: "JetBrains Mono" }}>2 Visible</span>}
          </div>
          <div style={{ fontSize: 11, fontFamily: "JetBrains Mono", color: "rgba(148,163,184,0.4)", marginBottom: 8 }}>{passCount}/{checks.length} passing</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            {/* Visible Checks (Top 2) */}
            {checks.slice(0, 2).map((c) => (
              <div
                key={c.label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "3px 6px",
                }}
              >
                <span style={{ fontSize: 12, color: c.pass ? "#10b981" : "#ef4444", flexShrink: 0 }}>{c.pass ? "✓" : "✗"}</span>
                <span style={{ fontSize: 12, color: c.pass ? "rgba(226,232,240,0.7)" : "rgba(252,165,165,0.9)" }}>
                  {c.label}
                </span>
                {!c.pass && c.note && <span style={{ fontSize: 11, color: "rgba(252,165,165,0.5)", fontFamily: "JetBrains Mono" }}>— {c.note}</span>}
              </div>
            ))}

            {/* Locked Checks (Grouped in ONE single LockedBlurOverlay centered in the middle) */}
            {!hasActiveSubscription && checks.length > 2 && (
              <LockedBlurOverlay
                isLocked={true}
                onOpenUpgradeModal={onOpenUpgradeModal}
                customText="to view remaining checks"
              >
                <div style={{ display: "flex", flexDirection: "column", gap: 5, padding: "2px 0" }}>
                  {checks.slice(2).map((c) => (
                    <div
                      key={c.label}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        padding: "3px 6px",
                      }}
                    >
                      <span style={{ fontSize: 12, color: c.pass ? "#10b981" : "#ef4444", flexShrink: 0 }}>{c.pass ? "✓" : "✗"}</span>
                      <span style={{ fontSize: 12, color: c.pass ? "rgba(226,232,240,0.7)" : "rgba(252,165,165,0.9)" }}>
                        {c.label}
                      </span>
                      {!c.pass && c.note && <span style={{ fontSize: 11, color: "rgba(252,165,165,0.5)", fontFamily: "JetBrains Mono" }}>— {c.note}</span>}
                    </div>
                  ))}
                </div>
              </LockedBlurOverlay>
            )}
          </div>
        </div>

        <div className="glass" style={{ padding: "14px 18px" }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "white", marginBottom: 10 }}>Keyword Coverage</div>
          {keywordCoverage.map((k) => (
            <div key={k.category} style={{ marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontSize: 12, color: "rgba(148,163,184,0.8)" }}>{k.category}</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: k.color, fontFamily: "JetBrains Mono" }}>{k.matched}/{k.total}</span>
              </div>
              <div className="progress-bar" style={{ height: 5 }}>
                <div className="progress-fill" style={{ width: `${(k.matched / k.total) * 100}%`, background: `linear-gradient(90deg, ${k.color}, ${k.color}88)` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <div className="glass" style={{ padding: "20px 24px" }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: "white", marginBottom: 16 }}>Prioritized Recommendations</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {recommendations.map((r, i) => {
            const colors = { Critical: "#ef4444", High: "#f59e0b", Medium: "#06b6d4", Low: "#10b981" };
            const tagClasses = { Critical: "tag-red", High: "tag-amber", Medium: "tag-cyan", Low: "tag-green" };
            const c = colors[r.priority as keyof typeof colors];
            const tc = tagClasses[r.priority as keyof typeof tagClasses];
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 16, padding: "13px 16px", borderRadius: 10, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <span className={`tag ${tc}`}>{r.priority}</span>
                <span style={{ flex: 1, fontSize: 13, color: "rgba(226,232,240,0.8)" }}>{r.text}</span>
                <button className="btn-ghost" style={{ padding: "6px 14px", fontSize: 12, flexShrink: 0 }} onClick={() => onNavigate("resume-editor")}>{r.fix}</button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
