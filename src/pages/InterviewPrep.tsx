import { useState } from "react";
import { Screen } from "../types";

interface InterviewPrepProps {
  onNavigate: (s: Screen) => void;
}

interface QuestionItem {
  id: string;
  q: string;
  answer: string;
  keyPoints: string[];
}

interface QuestionBankCategory {
  category: string;
  count: number;
  icon: string;
  color: string;
  questions: QuestionItem[];
}

const studyPlan = [
  { day: "Day 1", focus: "Behavioral & STAR Method", items: 14, status: "done" },
  { day: "Day 2", focus: "System Architecture & MFE", items: 16, status: "done" },
  { day: "Day 3", focus: "React Fiber & Core Internals", items: 12, status: "in-progress" },
  { day: "Day 4", focus: "TypeScript & State Management", items: 10, status: "upcoming" },
  { day: "Day 5", focus: "Frontend Security & PCI-DSS", items: 12, status: "upcoming" },
  { day: "Day 6", focus: "Performance Optimization", items: 10, status: "upcoming" },
  { day: "Day 7", focus: "Full Live Voice Mock Interview", items: 10, status: "upcoming" },
];

const questionBanks: QuestionBankCategory[] = [
  {
    category: "Behavioral (STAR Method)",
    count: 14,
    icon: "◷",
    color: "#7c3aed",
    questions: [
      {
        id: "b1",
        q: "Tell me about a time you had to optimize frontend performance under tight deadline constraints.",
        answer: "In my previous role at TechCorp, our main checkout dashboard suffered from severe LCP delays exceeding 3.8s, causing a 12% drop in conversions. Under a 2-week deadline, I audited bundle size, implemented React.lazy code-splitting, lazy-loaded offscreen assets, and optimized GraphQL caching. Result: LCP dropped to 1.4s (62% improvement) and recovered ~$2.3M in revenue.",
        keyPoints: ["Situation: 3.8s LCP causing dropoff", "Task: 2-week deadline", "Action: Code splitting & GraphQL cache", "Result: LCP reduced to 1.4s, $2.3M saved"],
      },
      {
        id: "b2",
        q: "Describe a situation where you strongly disagreed with an architectural decision.",
        answer: "Our team proposed rebuilding our internal UI with a heavy third-party framework that added 400KB bundle overhead. I set up a quick 1-day benchmark comparing it against our native React design tokens. I presented load-time metrics and accessibility scores to the team, leading us to adopt our lightweight internal library.",
        keyPoints: ["Focus on empirical data over opinions", "Built quick prototype/benchmark", "Collaborative decision making"],
      },
    ],
  },
  {
    category: "System Design & Architecture",
    count: 16,
    icon: "◈",
    color: "#06b6d4",
    questions: [
      {
        id: "s1",
        q: "Design the frontend architecture for a real-time collaborative document editor like Notion.",
        answer: "Architecture consists of 4 layers: 1) Presentation Layer using React & ContentEditable, 2) In-Memory Document Store using CRDTs (Yjs) for conflict-free sync, 3) Bidirectional WebSocket Engine for streaming deltas, 4) Web Workers for background diff calculation without blocking main UI thread.",
        keyPoints: ["CRDTs/OT for conflict resolution", "WebSocket real-time delta sync", "Web Workers for async diffing", "IndexedDB for offline persistence"],
      },
      {
        id: "s2",
        q: "How would you design a global Micro-Frontend setup for an enterprise application?",
        answer: "Using Webpack 5 / Vite Module Federation. Each team maintains an independent repository deployed to CDN edge servers. A container application dynamically imports remote entry bundles at runtime with shared dependencies configured as singletons.",
        keyPoints: ["Module Federation runtime import", "Autonomous team deployment", "Shared singleton dependencies"],
      },
    ],
  },
  {
    category: "Technical Depth (React & TypeScript)",
    count: 22,
    icon: "◎",
    color: "#10b981",
    questions: [
      {
        id: "t1",
        q: "Explain React's Reconciliation algorithm and how Fiber enables concurrent rendering.",
        answer: "React Fiber transformed reconciliation from a synchronous stack machine into an asynchronous priority-based linked list. Fiber breaks rendering into incremental work units that can be paused or aborted by the scheduler based on browser frame budgets (e.g. prioritizing user inputs over background renders).",
        keyPoints: ["Fiber tree linked list structure", "Priority scheduler & work loop", "Concurrent rendering without blocking UI"],
      },
      {
        id: "t2",
        q: "What is the difference between useMemo, useCallback, and persistent state caching?",
        answer: "useMemo memoizes computed values across re-renders; useCallback memoizes function references to prevent child component re-renders. State caches like React Query extend this with TTL, background polling, and cache invalidation tags.",
        keyPoints: ["useMemo for heavy calculations", "useCallback for stable handler props", "React Query for server-state caching"],
      },
    ],
  },
  {
    category: "Role & JD Alignment",
    count: 12,
    icon: "◉",
    color: "#f59e0b",
    questions: [
      {
        id: "r1",
        q: "How do you ensure PCI-DSS security compliance when handling payment forms in frontend code?",
        answer: "Card data must never touch our application server directly. We embed tokenized Hosted iFrames (e.g. Stripe Elements). Inputs are isolated inside iframe origins that return a secure single-use payment token (`tok_123`), keeping PCI scope to zero on our frontend.",
        keyPoints: ["Hosted iFrames (Stripe Elements)", "Tokenized payment payloads", "Zero PCI scope on app server", "Strict CSP headers & XSS protection"],
      },
      {
        id: "r2",
        q: "How do you optimize core Web Vitals (LCP, CLS, INP) in high-traffic single-page applications?",
        answer: "LCP is improved by dynamic image optimization, HTTP/3 asset preloading, and critical inline CSS. CLS is mitigated by reserving explicit width/height dimensions on image skeletons and dynamic DOM containers. INP is optimized by yielding long tasks back to the browser event loop using requestIdleCallback and scheduler.yield().",
        keyPoints: ["Preload critical route chunks", "Reserve layout dimensions for image skeletons", "Break long JS tasks with scheduler.yield()"],
      },
    ],
  },
];

export default function InterviewPrep({ onNavigate }: InterviewPrepProps) {
  const [expandedBank, setExpandedBank] = useState<string | null>("Behavioral (STAR Method)");

  return (
    <div className="fade-in page-container" style={{ height: "100%", overflowY: "auto" }}>
      {/* Header */}
      <div className="stack-on-mobile" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24, gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: "white", margin: 0, letterSpacing: "-0.02em" }}>
            Interview <span className="gradient-text">Prep & Question Bank</span>
          </h1>
          <p style={{ color: "rgba(148,163,184,0.6)", fontSize: 14, margin: "6px 0 0" }}>
            AI-curated question bank tailored to your Job Description & Resume with model answers.
          </p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button className="btn-primary" style={{ padding: "9px 18px", fontSize: 13 }} onClick={() => onNavigate("mock-interview")}>
            Start Voice Mock Interview →
          </button>
        </div>
      </div>

      <div className="grid-responsive-sidebar">
        {/* Question banks */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "white", marginBottom: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span>Tailored JD Question Bank</span>
            <span style={{ fontSize: 12, color: "#06b6d4", fontFamily: "JetBrains Mono" }}>64 Questions Total</span>
          </div>

          {questionBanks.map((bank) => {
            const isExpanded = expandedBank === bank.category;
            return (
              <div key={bank.category} className="glass" style={{ overflow: "hidden", border: isExpanded ? "1px solid rgba(124,58,237,0.3)" : undefined }}>
                <div
                  style={{ padding: "16px 20px", display: "flex", alignItems: "center", gap: 14, cursor: "pointer", background: isExpanded ? "rgba(124,58,237,0.06)" : undefined }}
                  onClick={() => setExpandedBank(isExpanded ? null : bank.category)}
                >
                  <div style={{ width: 38, height: 38, borderRadius: 10, background: `${bank.color}20`, border: `1px solid ${bank.color}40`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>
                    {bank.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "white", marginBottom: 2 }}>{bank.category}</div>
                    <div style={{ fontSize: 12, color: "rgba(148,163,184,0.6)" }}>{bank.count} questions tailored for Senior FE Role</div>
                  </div>
                  <span style={{ fontSize: 18, color: "rgba(148,163,184,0.4)", transition: "transform 0.2s", transform: isExpanded ? "rotate(90deg)" : "none" }}>›</span>
                </div>

                {isExpanded && (
                  <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "16px 20px" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                      {bank.questions.map((item, i) => (
                        <div key={item.id} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: 16 }}>
                          <div style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 12 }}>
                            <span style={{ fontSize: 11, fontFamily: "JetBrains Mono", color: bank.color, fontWeight: 700, marginTop: 2, flexShrink: 0, background: `${bank.color}15`, padding: "2px 6px", borderRadius: 4 }}>
                              Q{i + 1}
                            </span>
                            <div style={{ flex: 1, fontSize: 14, fontWeight: 600, color: "white", lineHeight: 1.4 }}>
                              {item.q}
                            </div>
                          </div>

                          {/* Model Answer Box - Directly Visible */}
                          <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px dashed rgba(255,255,255,0.1)" }}>
                            <div style={{ fontSize: 11, fontFamily: "JetBrains Mono", color: "#10b981", marginBottom: 6, fontWeight: 700 }}>
                              ✓ RECOMMENDED MODEL ANSWER:
                            </div>
                            <div style={{ fontSize: 13, color: "rgba(226,232,240,0.85)", lineHeight: 1.6, marginBottom: 12, background: "rgba(16,185,129,0.04)", padding: 12, borderRadius: 8, border: "1px solid rgba(16,185,129,0.15)" }}>
                              {item.answer}
                            </div>

                            <div style={{ fontSize: 11, fontFamily: "JetBrains Mono", color: "rgba(148,163,184,0.6)", marginBottom: 6 }}>
                              KEY POINTS TO MENTION:
                            </div>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                              {item.keyPoints.map((kp, idx) => (
                                <span key={idx} style={{ fontSize: 11, background: "rgba(124,58,237,0.15)", color: "#a78bfa", padding: "3px 8px", borderRadius: 6, border: "1px solid rgba(124,58,237,0.3)" }}>
                                  • {kp}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Study plan */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="glass" style={{ padding: "20px 22px" }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "white", marginBottom: 4 }}>7-Day Study Plan</div>
            <div style={{ fontSize: 12, color: "rgba(148,163,184,0.5)", marginBottom: 16 }}>Personalized for your schedule</div>
            {studyPlan.map((day) => {
              const statusColors = { done: "#10b981", "in-progress": "#7c3aed", upcoming: "rgba(148,163,184,0.3)" };
              const c = statusColors[day.status as keyof typeof statusColors];
              return (
                <div key={day.day} style={{ display: "flex", gap: 12, marginBottom: 14, alignItems: "flex-start" }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0 }}>
                    <div style={{ width: 20, height: 20, borderRadius: "50%", background: day.status === "done" ? "#10b981" : day.status === "in-progress" ? "#7c3aed" : "rgba(255,255,255,0.08)", border: `2px solid ${c}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "white", flexShrink: 0 }}>
                      {day.status === "done" ? "✓" : day.status === "in-progress" ? "●" : "○"}
                    </div>
                    <div style={{ width: 1, flex: 1, background: c, opacity: 0.3, marginTop: 3, minHeight: 20 }} />
                  </div>
                  <div style={{ paddingBottom: 12 }}>
                    <div style={{ fontSize: 11, fontFamily: "JetBrains Mono", color: c, marginBottom: 2 }}>{day.day}</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: day.status === "upcoming" ? "rgba(148,163,184,0.5)" : "rgba(226,232,240,0.9)", marginBottom: 2 }}>{day.focus}</div>
                    <div style={{ fontSize: 11, color: "rgba(148,163,184,0.4)" }}>{day.items} questions</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
