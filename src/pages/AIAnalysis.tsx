import { useState } from "react";
import { Screen } from "../types";
import LockedBlurOverlay from "../components/LockedBlurOverlay";

interface AIAnalysisProps {
  onNavigate: (s: Screen) => void;
  onComplete: () => void;
  hasActiveSubscription?: boolean;
  onOpenUpgradeModal?: () => void;
}

const keywords = {
  matched: [
    "React",
    "TypeScript",
    "GraphQL",
    "REST API",
    "Node.js",
    "CI/CD",
    "Agile",
    "AWS",
    "Performance Optimization",
    "Code Review",
    "Jest & RTL",
    "Webpack / Vite",
    "Tailwind CSS",
    "HTML5 / CSS3",
    "Git / GitHub Workflow",
  ],
  missing: [
    "Kafka",
    "Kubernetes",
    "Go",
    "gRPC",
    "Terraform",
    "GraphQL Subscriptions",
    "Elasticsearch",
    "Datadog / APM Telemetry",
    "OpenTelemetry",
  ],
  partial: [
    "System Design (mentioned briefly)",
    "Microservices (1 mention)",
    "Redis (implied via caching)",
    "Docker (basic containerization)",
    "State Management (Redux without Toolkit)",
    "Web Workers (brief mention in background tasks)",
    "CI/CD Pipelines (GitHub Actions only)",
  ],
};

const gaps = [
  { area: "Infrastructure & DevOps", severity: "high", detail: "No Kubernetes or container orchestration experience mentioned." },
  { area: "Backend Depth", severity: "medium", detail: "Role requires Go or Rust. Only Node.js present in resume." },
  { area: "Distributed Systems", severity: "medium", detail: "Kafka/event streaming not mentioned. Partial credit for async patterns." },
  { area: "Leadership Evidence", severity: "low", detail: "1 team lead mention, but role expects 3+ mentorship examples." },
  { area: "Observability & Monitoring", severity: "high", detail: "No Datadog, Prometheus, or real-time APM telemetry instrumentation listed." },
  { area: "Automated E2E Testing", severity: "medium", detail: "End-to-end Cypress or Playwright testing frameworks missing from technical stack." },
  { area: "Security & Authentication", severity: "low", detail: "OAuth 2.0 / OIDC security architecture and IAM role management not highlighted." },
];

const suggestions = [
  { id: 1, text: "Add quantified achievement for React performance work: 'Reduced bundle size by 42%, improving LCP by 1.8s.'", impact: "high", category: "Impact" },
  { id: 2, text: "Reframe AWS experience to highlight EC2 auto-scaling and CloudFront CDN configuration specifics.", impact: "high", category: "Keywords" },
  { id: 3, text: "Include a brief section on system design experience: 'Designed event-driven microservice for 200k DAU.'", impact: "medium", category: "Gaps" },
  { id: 4, text: "Add GraphQL subscription experience — currently only queries/mutations mentioned.", impact: "medium", category: "Keywords" },
  { id: 5, text: "Mention code review culture: 'Led weekly architecture reviews across 6-engineer team.'", impact: "low", category: "Leadership" },
];

export const resumeSections = [
  {
    title: "Arjun Kumar",
    isHeader: true,
    content: "arjun.kumar@gmail.com · +91 98765 43210 · linkedin.com/in/arjunkumar · github.com/arjunkumar",
  },
  {
    title: "Summary",
    content: "Experienced frontend engineer with 5 years of experience building scalable web applications. Strong expertise in React and TypeScript.",
    highlights: ["React", "TypeScript"],
  },
  {
    title: "Skills",
    content: "JavaScript, React, CSS, HTML, Node.js, AWS, GraphQL, REST API, Agile, CI/CD, Code Review",
    highlights: ["React", "Node.js", "AWS", "GraphQL", "REST API", "CI/CD"],
  },
  {
    title: "Experience",
    content: "Senior Frontend Engineer @ TechCorp (2021–Present)\nBuilt and maintained React components for internal dashboard. Improved performance of the checkout flow. Led migration from class to functional components.",
    highlights: ["React", "Performance Optimization"],
  },
  {
    title: "Experience",
    content: "Frontend Engineer @ StartupXYZ (2019–2021)\nDeveloped reusable component library. Worked with Node.js backend APIs. Implemented CI/CD pipelines.",
    highlights: ["Node.js", "CI/CD"],
  },
  {
    title: "Education",
    content: "B.Tech Computer Science · IIT Delhi · 2019\nGPA: 8.6/10 · Dean's List",
    highlights: [],
  },
];

export default function AIAnalysis({ onNavigate, onComplete, hasActiveSubscription, onOpenUpgradeModal }: AIAnalysisProps) {
  const [activeTab, setActiveTab] = useState<"score" | "keywords" | "gaps" | "suggestions">("score");
  const [appliedSuggestionIds, setAppliedSuggestionIds] = useState<Set<number>>(new Set());
  const [previewSections, setPreviewSections] = useState(resumeSections);
  const score = 68;

  const handleApplySuggestion = (s: (typeof suggestions)[0]) => {
    setAppliedSuggestionIds((prev) => new Set([...prev, s.id]));

    setPreviewSections((prev) =>
      prev.map((sec) => {
        if (s.id === 1 && sec.title === "Experience" && sec.content.includes("TechCorp")) {
          return {
            ...sec,
            content: sec.content + "\n• Reduced bundle size by 42%, improving LCP by 1.8s.",
            highlights: [...(sec.highlights || []), "Reduced bundle size by 42%"],
          };
        }
        if (s.id === 2 && sec.title === "Skills") {
          return {
            ...sec,
            content: sec.content + ", EC2 Auto-Scaling, CloudFront CDN",
            highlights: [...(sec.highlights || []), "EC2 Auto-Scaling", "CloudFront CDN"],
          };
        }
        if (s.id === 3 && sec.title === "Experience" && sec.content.includes("TechCorp")) {
          return {
            ...sec,
            content: sec.content + "\n• Designed event-driven microservice architecture for 200k DAU.",
            highlights: [...(sec.highlights || []), "event-driven microservice"],
          };
        }
        if (s.id === 4 && sec.title === "Skills") {
          return {
            ...sec,
            content: sec.content + ", GraphQL Subscriptions",
            highlights: [...(sec.highlights || []), "GraphQL Subscriptions"],
          };
        }
        if (s.id === 5 && sec.title === "Experience" && sec.content.includes("TechCorp")) {
          return {
            ...sec,
            content: sec.content + "\n• Led weekly architecture reviews across 6-engineer team.",
            highlights: [...(sec.highlights || []), "architecture reviews"],
          };
        }
        return sec;
      })
    );
  };

  const handleUndoSuggestion = (s: (typeof suggestions)[0]) => {
    setAppliedSuggestionIds((prev) => {
      const next = new Set(prev);
      next.delete(s.id);
      return next;
    });

    setPreviewSections((prev) =>
      prev.map((sec) => {
        if (s.id === 1 && sec.title === "Experience" && sec.content.includes("TechCorp")) {
          return {
            ...sec,
            content: sec.content.replace("\n• Reduced bundle size by 42%, improving LCP by 1.8s.", ""),
            highlights: (sec.highlights || []).filter((h) => h !== "Reduced bundle size by 42%"),
          };
        }
        if (s.id === 2 && sec.title === "Skills") {
          return {
            ...sec,
            content: sec.content.replace(", EC2 Auto-Scaling, CloudFront CDN", ""),
            highlights: (sec.highlights || []).filter((h) => h !== "EC2 Auto-Scaling" && h !== "CloudFront CDN"),
          };
        }
        if (s.id === 3 && sec.title === "Experience" && sec.content.includes("TechCorp")) {
          return {
            ...sec,
            content: sec.content.replace("\n• Designed event-driven microservice architecture for 200k DAU.", ""),
            highlights: (sec.highlights || []).filter((h) => h !== "event-driven microservice"),
          };
        }
        if (s.id === 4 && sec.title === "Skills") {
          return {
            ...sec,
            content: sec.content.replace(", GraphQL Subscriptions", ""),
            highlights: (sec.highlights || []).filter((h) => h !== "GraphQL Subscriptions"),
          };
        }
        if (s.id === 5 && sec.title === "Experience" && sec.content.includes("TechCorp")) {
          return {
            ...sec,
            content: sec.content.replace("\n• Led weekly architecture reviews across 6-engineer team.", ""),
            highlights: (sec.highlights || []).filter((h) => h !== "architecture reviews"),
          };
        }
        return sec;
      })
    );
  };

  const ScoreArc = ({ value }: { value: number }) => {
    const color = value >= 75 ? "#10b981" : value >= 50 ? "#f59e0b" : "#ef4444";
    return (
      <svg width="180" height="100" viewBox="0 0 180 100">
        <path d="M 10 90 A 80 80 0 0 1 170 90" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="12" strokeLinecap="round" />
        <path d="M 10 90 A 80 80 0 0 1 170 90" fill="none" stroke={color} strokeWidth="12" strokeLinecap="round"
          strokeDasharray={`${(value / 100) * 251.3} 251.3`}
          style={{ filter: `drop-shadow(0 0 8px ${color}88)` }}
        />
        <text x="90" y="85" textAnchor="middle" fill="white" fontSize="28" fontWeight="800" fontFamily="Outfit">{value}</text>
        <text x="90" y="100" textAnchor="middle" fill="rgba(148,163,184,0.5)" fontSize="11" fontFamily="JetBrains Mono">/ 100</text>
      </svg>
    );
  };

  const tabs = [
    { id: "score", label: "JD Match Score" },
    { id: "keywords", label: "JD Keyword Match" },
    { id: "gaps", label: "JD Gaps" },
    { id: "suggestions", label: "JD Suggestions" },
  ] as const;

  const highlightText = (text: string, highlights: string[]) => {
    if (!highlights.length) return <span>{text}</span>;
    const parts = text.split(new RegExp(`(${highlights.join("|")})`, "gi"));
    return (
      <>
        {parts.map((part, i) =>
          highlights.some((h) => h.toLowerCase() === part.toLowerCase()) ? (
            <mark key={i} style={{ background: "rgba(124,58,237,0.3)", color: "#c4b5fd", borderRadius: 3, padding: "0 2px" }}>{part}</mark>
          ) : (
            <span key={i}>{part}</span>
          )
        )}
      </>
    );
  };

  const handleTabChange = (tab: typeof activeTab) => {
    setActiveTab(tab);
    onComplete();
  };

  return (
    <div className="fade-in page-container" style={{ height: "100%", overflow: "hidden", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div className="stack-on-mobile" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexShrink: 0, gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: "white", margin: 0, letterSpacing: "-0.02em" }}>AI <span className="gradient-text">Analysis</span></h1>
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {!hasActiveSubscription && (
            <button className="btn-primary" style={{ padding: "9px 18px", fontSize: 13, background: "linear-gradient(135deg, #7c3aed, #06b6d4)" }} onClick={onOpenUpgradeModal}>
              ⚡ Upgrade Plan to Unlock All
            </button>
          )}
          <button className="btn-ghost" style={{ padding: "9px 18px", fontSize: 13 }} onClick={() => onNavigate("job-resume")}>← Re-upload</button>
          <button className="btn-primary" style={{ padding: "9px 18px", fontSize: 13 }} onClick={() => onNavigate("resume-editor")}>Step 2: Apply Suggestions →</button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 6, marginBottom: 20, borderBottom: "1px solid rgba(255,255,255,0.08)", paddingBottom: 12, flexShrink: 0, overflowX: "auto" }}>
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => handleTabChange(t.id)}
            style={{
              padding: "8px 16px",
              borderRadius: 8,
              border: activeTab === t.id ? "1px solid rgba(124,58,237,0.5)" : "1px solid transparent",
              background: activeTab === t.id ? "rgba(124,58,237,0.15)" : "transparent",
              color: activeTab === t.id ? "#c4b5fd" : "rgba(148,163,184,0.7)",
              fontSize: 13,
              fontWeight: 500,
              cursor: "pointer",
              transition: "all 0.2s ease",
              whiteSpace: "nowrap",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Two-column layout: AI Analysis (left) | Resume (right 50%) */}
      <div className="grid-responsive-2col" style={{ flex: 1, minHeight: 0, overflow: "hidden", paddingBottom: 28 }}>
        {/* LEFT — AI Analysis content */}
        <div style={{ overflowY: "auto", height: "100%", paddingRight: 6 }}>
          {activeTab === "score" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: 16, alignItems: "start" }}>
                <div className="glass" style={{ padding: "24px", textAlign: "center", height: 250, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", flexShrink: 0 }}>
                  <ScoreArc value={score} />
                  <div style={{ fontSize: 14, color: "rgba(148,163,184,0.6)", marginTop: 8 }}>Match Probability</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: "#f59e0b", marginTop: 4 }}>Moderate Match</div>
                </div>
                <div className="glass" style={{ padding: "20px 24px" }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "white", marginBottom: 14, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span>What's Working</span>
                    {!hasActiveSubscription && <span style={{ fontSize: 11, color: "#c4b5fd", fontFamily: "JetBrains Mono" }}>2/4 Points Visible</span>}
                  </div>
                  {/* Top 2 Visible Points */}
                  {["Strong React + TypeScript portfolio with measurable outcomes", "AWS experience aligns with infrastructure requirements"].map((item, i) => (
                    <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "8px 12px", background: "rgba(255,255,255,0.02)", borderRadius: 8, marginBottom: 10 }}>
                      <span style={{ color: "#10b981", fontSize: 14, marginTop: 1 }}>✓</span>
                      <span style={{ fontSize: 13, color: "rgba(226,232,240,0.85)" }}>
                        {item}
                      </span>
                    </div>
                  ))}

                  {/* Locked Remaining Points (Grouped in ONE single LockedBlurOverlay) */}
                  {!hasActiveSubscription && (
                    <LockedBlurOverlay
                      isLocked={true}
                      onOpenUpgradeModal={onOpenUpgradeModal}
                      customText="to view remaining points"
                    >
                      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                        {["Agile methodology match: 5+ years in scrum teams", "GraphQL API design experience mentioned prominently"].map((item, i) => (
                          <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "8px 12px", background: "rgba(255,255,255,0.02)", borderRadius: 8 }}>
                            <span style={{ color: "#10b981", fontSize: 14, marginTop: 1 }}>✓</span>
                            <span style={{ fontSize: 13, color: "rgba(226,232,240,0.85)" }}>
                              {item}
                            </span>
                          </div>
                        ))}
                      </div>
                    </LockedBlurOverlay>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === "keywords" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {[
                { title: "Matched Keywords", items: keywords.matched, tagClass: "tag-green", icon: "✓" },
                { title: "Partially Matched", items: keywords.partial, tagClass: "tag-amber", icon: "≈" },
                { title: "Missing Keywords", items: keywords.missing, tagClass: "tag-red", icon: "✗" },
              ].map((section) => (
                <div key={section.title} className="glass" style={{ padding: "20px 24px" }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "white", marginBottom: 14, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span>{section.title}</span>
                    {!hasActiveSubscription && <span style={{ fontSize: 11, color: "#c4b5fd", fontFamily: "JetBrains Mono" }}>Top 2 Visible</span>}
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
                    {/* Visible Keywords (Top 2) */}
                    {section.items.slice(0, 2).map((item) => (
                      <span
                        key={item}
                        className={`tag ${section.tagClass}`}
                        style={{ fontSize: 13, padding: "5px 12px" }}
                      >
                        {section.icon} {item}
                      </span>
                    ))}

                    {/* Locked Keywords (Grouped in ONE single LockedBlurOverlay block) */}
                    {!hasActiveSubscription && section.items.length > 2 && (
                      <LockedBlurOverlay
                        isLocked={true}
                        onOpenUpgradeModal={onOpenUpgradeModal}
                        customText="to view remaining keywords"
                        style={{ display: "inline-flex" }}
                      >
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, padding: "2px 4px" }}>
                          {section.items.slice(2).map((item) => (
                            <span
                              key={item}
                              className={`tag ${section.tagClass}`}
                              style={{ fontSize: 13, padding: "5px 12px" }}
                            >
                              {section.icon} {item}
                            </span>
                          ))}
                        </div>
                      </LockedBlurOverlay>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "gaps" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {/* Visible Gaps (Top 2) */}
              {gaps.slice(0, 2).map((g, i) => {
                const colors = { high: "#ef4444", medium: "#f59e0b", low: "#06b6d4" };
                const c = colors[g.severity as keyof typeof colors];
                return (
                  <div
                    key={i}
                    className="glass"
                    style={{
                      padding: "18px 22px",
                      display: "flex",
                      gap: 16,
                      alignItems: "flex-start",
                    }}
                  >
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: `${c}20`, border: `1px solid ${c}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>
                      {g.severity === "high" ? "🔴" : g.severity === "medium" ? "🟡" : "🔵"}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 5 }}>
                        <span style={{ fontSize: 14, fontWeight: 700, color: "white" }}>{g.area}</span>
                        <span style={{ fontSize: 11, fontFamily: "JetBrains Mono", color: c, background: `${c}18`, padding: "2px 8px", borderRadius: 4 }}>{g.severity.toUpperCase()}</span>
                      </div>
                      <div style={{ fontSize: 13, color: "rgba(148,163,184,0.7)" }}>{g.detail}</div>
                    </div>
                    <button
                      className="btn-primary"
                      style={{ padding: "6px 14px", fontSize: 12, flexShrink: 0 }}
                      onClick={() => onNavigate("resume-editor")}
                    >
                      Fix →
                    </button>
                  </div>
                );
              })}

              {/* Locked Gaps (Grouped in ONE single LockedBlurOverlay block) */}
              {!hasActiveSubscription && gaps.length > 2 && (
                <LockedBlurOverlay
                  isLocked={true}
                  onOpenUpgradeModal={onOpenUpgradeModal}
                  customText="to view remaining skill gaps & recommendations"
                >
                  <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    {gaps.slice(2).map((g, i) => {
                      const colors = { high: "#ef4444", medium: "#f59e0b", low: "#06b6d4" };
                      const c = colors[g.severity as keyof typeof colors];
                      return (
                        <div
                          key={i}
                          className="glass"
                          style={{
                            padding: "18px 22px",
                            display: "flex",
                            gap: 16,
                            alignItems: "flex-start",
                          }}
                        >
                          <div style={{ width: 40, height: 40, borderRadius: 10, background: `${c}20`, border: `1px solid ${c}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>
                            {g.severity === "high" ? "🔴" : g.severity === "medium" ? "🟡" : "🔵"}
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 5 }}>
                              <span style={{ fontSize: 14, fontWeight: 700, color: "white" }}>{g.area}</span>
                              <span style={{ fontSize: 11, fontFamily: "JetBrains Mono", color: c, background: `${c}18`, padding: "2px 8px", borderRadius: 4 }}>{g.severity.toUpperCase()}</span>
                            </div>
                            <div style={{ fontSize: 13, color: "rgba(148,163,184,0.7)" }}>{g.detail}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </LockedBlurOverlay>
              )}
            </div>
          )}

          {activeTab === "suggestions" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {/* Visible Suggestions (Top 2) */}
              {suggestions.slice(0, 2).map((s) => {
                const isApplied = appliedSuggestionIds.has(s.id);
                return (
                  <div
                    key={s.id}
                    className="glass"
                    style={{
                      padding: "18px 22px",
                      border: isApplied ? "1px solid rgba(16, 185, 129, 0.4)" : undefined,
                      background: isApplied ? "rgba(16, 185, 129, 0.05)" : undefined,
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
                      <div style={{ width: 28, height: 28, borderRadius: 7, background: s.impact === "high" ? "rgba(16,185,129,0.2)" : s.impact === "medium" ? "rgba(245,158,11,0.2)" : "rgba(6,182,212,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: s.impact === "high" ? "#10b981" : s.impact === "medium" ? "#f59e0b" : "#06b6d4", fontFamily: "JetBrains Mono", flexShrink: 0 }}>{s.id}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", gap: 8, marginBottom: 7 }}>
                          <span className={`tag ${s.impact === "high" ? "tag-green" : s.impact === "medium" ? "tag-amber" : "tag-cyan"}`}>{s.impact} impact</span>
                          <span className="tag tag-purple">{s.category}</span>
                          {isApplied && <span className="tag tag-green">✓ Live Applied</span>}
                        </div>
                        <div style={{ fontSize: 14, color: "rgba(226,232,240,0.85)", lineHeight: 1.5 }}>{s.text}</div>
                      </div>
                      {isApplied ? (
                        <div style={{ display: "flex", gap: 6, alignItems: "center", flexShrink: 0 }}>
                          <button
                            type="button"
                            className="btn-ghost"
                            style={{
                              padding: "7px 12px",
                              fontSize: 12,
                              background: "rgba(16, 185, 129, 0.15)",
                              color: "#10b981",
                              border: "1px solid rgba(16, 185, 129, 0.4)",
                              fontWeight: 600,
                              cursor: "default",
                            }}
                          >
                            ✓ Applied
                          </button>
                          <button
                            type="button"
                            className="btn-ghost"
                            style={{
                              padding: "7px 12px",
                              fontSize: 12,
                              borderColor: "rgba(239, 68, 68, 0.4)",
                              color: "#fca5a5",
                              fontWeight: 600,
                              cursor: "pointer",
                            }}
                            onClick={() => handleUndoSuggestion(s)}
                            title="Undo and revert this suggestion from live resume preview"
                          >
                            ↩ Undo
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          className="btn-primary"
                          style={{
                            padding: "7px 16px",
                            fontSize: 12,
                            flexShrink: 0,
                            fontWeight: 600,
                          }}
                          onClick={() => handleApplySuggestion(s)}
                        >
                          Apply
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Locked Suggestions (Grouped in ONE single LockedBlurOverlay block) */}
              {!hasActiveSubscription && suggestions.length > 2 && (
                <LockedBlurOverlay
                  isLocked={true}
                  onOpenUpgradeModal={onOpenUpgradeModal}
                  customText="to view remaining AI suggestions"
                >
                  <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    {suggestions.slice(2).map((s) => (
                      <div
                        key={s.id}
                        className="glass"
                        style={{
                          padding: "18px 22px",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
                          <div style={{ width: 28, height: 28, borderRadius: 7, background: s.impact === "high" ? "rgba(16,185,129,0.2)" : s.impact === "medium" ? "rgba(245,158,11,0.2)" : "rgba(6,182,212,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: s.impact === "high" ? "#10b981" : s.impact === "medium" ? "#f59e0b" : "#06b6d4", fontFamily: "JetBrains Mono", flexShrink: 0 }}>{s.id}</div>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: "flex", gap: 8, marginBottom: 7 }}>
                              <span className={`tag ${s.impact === "high" ? "tag-green" : s.impact === "medium" ? "tag-amber" : "tag-cyan"}`}>{s.impact} impact</span>
                              <span className="tag tag-purple">{s.category}</span>
                            </div>
                            <div style={{ fontSize: 14, color: "rgba(226,232,240,0.85)", lineHeight: 1.5 }}>{s.text}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </LockedBlurOverlay>
              )}
            </div>
          )}
        </div>

        {/* RIGHT — Resume preview */}
        <div className="glass" style={{ display: "flex", flexDirection: "column", overflow: "hidden", height: "100%" }}>
          <div style={{ padding: "16px 20px 12px", borderBottom: "1px solid rgba(255,255,255,0.07)", flexShrink: 0, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "white", marginBottom: 2 }}>Resume Preview</div>
              <div style={{ fontSize: 11, fontFamily: "JetBrains Mono", color: "rgba(148,163,184,0.4)" }}>Arjun_Kumar_Resume_v7.pdf</div>
            </div>
            <span className="tag tag-purple" style={{ fontSize: 10, cursor: "default" }} title="Click any text in preview to edit directly">
              ✎ Click text to edit
            </span>
          </div>
          <div style={{ flex: 1, overflowY: "auto", padding: "16px 18px" }}>
            {activeTab !== "score" && (
              <div style={{ fontSize: 11, fontFamily: "JetBrains Mono", color: "rgba(124,58,237,0.7)", marginBottom: 12, letterSpacing: "0.06em" }}>
                {activeTab === "keywords" ? "↑ MATCHED KEYWORDS HIGHLIGHTED" : activeTab === "gaps" ? "↑ GAP AREAS MARKED" : "↑ SUGGESTED CHANGES MARKED"}
              </div>
            )}
            {previewSections.map((section, i) => (
              <div key={i} style={{ marginBottom: 16 }}>
                {section.isHeader ? (
                  <div style={{ marginBottom: 12, paddingBottom: 10, borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
                    <div className="editable-text" contentEditable suppressContentEditableWarning style={{ fontSize: 16, fontWeight: 800, color: "white", marginBottom: 4 }}>{section.title}</div>
                    <div className="editable-text" contentEditable suppressContentEditableWarning style={{ fontSize: 11, color: "rgba(148,163,184,0.6)", lineHeight: 1.6 }}>{section.content}</div>
                  </div>
                ) : (
                  <div>
                    <div className="editable-text" contentEditable suppressContentEditableWarning style={{ fontSize: 11, fontWeight: 700, color: "rgba(124,58,237,0.8)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 5, fontFamily: "JetBrains Mono" }}>{section.title}</div>
                    <div className="editable-text" contentEditable suppressContentEditableWarning style={{ fontSize: 12, color: "rgba(226,232,240,0.75)", lineHeight: 1.7, whiteSpace: "pre-line" }}>
                      {activeTab === "keywords" && section.highlights
                        ? highlightText(section.content, section.highlights)
                        : section.content}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
