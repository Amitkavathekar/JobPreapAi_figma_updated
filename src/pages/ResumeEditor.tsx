import { useState } from "react";
import { Screen } from "../types";
import { resumeSections } from "./AIAnalysis";
import LockedBlurOverlay from "../components/LockedBlurOverlay";

interface ResumeEditorProps {
  onNavigate: (s: Screen) => void;
  hasActiveSubscription?: boolean;
  onOpenUpgradeModal?: () => void;
}

const formatChecks = [
  { label: "No tables or complex grid columns", pass: true },
  { label: "Standard ATS fonts (Arial, Calibri, Helvetica)", pass: true },
  { label: "Consistent date format (MM/YYYY)", pass: true, note: "Contains minor variations" },
  { label: "No images or graphics in document body", pass: true },
  { label: "Contact info present in main body block", pass: false, note: "Phone number is inside header margin" },
  { label: "No special bullet symbols in section headers", pass: false, note: "bullet character detected in section title" },
  { label: "File size under 1MB limit", pass: true },
  { label: "UTF-8 standard text encoding", pass: true },
];

const initialSuggestions = [
  {
    id: 1, section: "Experience", type: "Impact", status: "pending" as const,
    original: "Built and maintained React components for internal dashboard.",
    suggested: "Engineered 40+ reusable React components powering internal analytics dashboard used by 1,200+ employees, reducing dashboard load time by 62%.",
    impact: "high",
  },
  {
    id: 2, section: "Skills", type: "Keywords", status: "pending" as const,
    original: "JavaScript, React, CSS, HTML",
    suggested: "JavaScript (ES2022+), React 18, TypeScript, GraphQL, Tailwind CSS, Jest, Playwright",
    impact: "high",
  },
  {
    id: 3, section: "Experience", type: "Quantify", status: "pending" as const,
    original: "Improved performance of the checkout flow.",
    suggested: "Optimized checkout flow performance achieving 41% reduction in Time-to-Interactive, directly contributing to $2.3M incremental annual revenue.",
    impact: "high",
  },
  {
    id: 4, section: "Summary", type: "Alignment", status: "pending" as const,
    original: "Experienced frontend engineer with 5 years of experience.",
    suggested: "Senior Frontend Engineer with 5+ years building high-performance, scalable web applications at fintech scale. Expert in React, TypeScript, and distributed systems UI.",
    impact: "medium",
  },
  {
    id: 5, section: "Projects", type: "Detail", status: "pending" as const,
    original: "Open-source contributions.",
    suggested: "Contributor to React core (3 merged PRs), maintainer of react-query-devtools plugin (2.1k GitHub stars).",
    impact: "medium",
  },
];

type Status = "pending" | "accepted" | "rejected";

interface Suggestion {
  id: number;
  section: string;
  type: string;
  status: Status;
  original: string;
  suggested: string;
  impact: string;
}

export default function ResumeEditor({ onNavigate, hasActiveSubscription, onOpenUpgradeModal }: ResumeEditorProps) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>(initialSuggestions);
  const [editorSections, setEditorSections] = useState(resumeSections);
  const [editing, setEditing] = useState<number | null>(null);
  const [editText, setEditText] = useState("");
  const [version, setVersion] = useState(7);
  const [saved, setSaved] = useState(false);
  const [exportFormat, setExportFormat] = useState<"pdf" | "docx" | "txt">("pdf");
  const [showAtsSlidebar, setShowAtsSlidebar] = useState(true);

  const applySuggestionsToSections = (currentSuggestions: Suggestion[]) => {
    let updatedSecs = resumeSections.map((sec) => ({ ...sec }));
    currentSuggestions.forEach((s) => {
      if (s.status === "accepted") {
        updatedSecs = updatedSecs.map((sec) => {
          if (sec.content.includes(s.original)) {
            return {
              ...sec,
              content: sec.content.replace(s.original, s.suggested),
            };
          }
          return sec;
        });
      }
    });
    setEditorSections(updatedSecs);
  };

  const updateStatus = (id: number, status: Status) => {
    const updated = suggestions.map((s) => (s.id === id ? { ...s, status } : s));
    setSuggestions(updated);
    applySuggestionsToSections(updated);
  };

  const startEdit = (s: Suggestion) => {
    setEditing(s.id);
    setEditText(s.suggested);
  };

  const saveEdit = (id: number) => {
    const updated = suggestions.map((s) => (s.id === id ? { ...s, suggested: editText, status: "accepted" as Status } : s));
    setSuggestions(updated);
    applySuggestionsToSections(updated);
    setEditing(null);
  };

  const handleDownload = () => {
    setSaved(true);
    setVersion((v) => v + 1);

    const nextVer = version + 1;
    const fileName = `Arjun_Kumar_Resume_v${nextVer}`;

    if (exportFormat === "txt") {
      const fullText = editorSections
        .map((sec) => `${sec.title.toUpperCase()}\n${sec.content}`)
        .join("\n\n----------------------------------------\n\n");
      const blob = new Blob([fullText], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${fileName}.txt`;
      a.click();
      URL.revokeObjectURL(url);
    } else if (exportFormat === "docx") {
      const docHtml = `
        <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
        <head><meta charset='utf-8'><title>${fileName}</title></head>
        <body style="font-family: Arial, sans-serif; font-size: 11pt; line-height: 1.5; color: #111827; padding: 20px;">
          ${editorSections
          .map(
            (sec) =>
              `<h2 style="color: #4f46e5; border-bottom: 2px solid #6366f1; padding-bottom: 4px; margin-top: 18px; margin-bottom: 8px;">${sec.title}</h2><p style="white-space: pre-wrap; margin-bottom: 12px;">${sec.content}</p>`
          )
          .join("")}
        </body>
        </html>
      `;
      const blob = new Blob([docHtml], { type: "application/msword;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${fileName}.docx`;
      a.click();
      URL.revokeObjectURL(url);
    } else {
      // PDF print/save window
      const printWin = window.open("", "_blank");
      if (printWin) {
        printWin.document.write(`
          <!DOCTYPE html>
          <html>
          <head>
            <title>${fileName}</title>
            <style>
              body { font-family: 'Inter', -apple-system, sans-serif; padding: 40px; color: #1e293b; max-width: 800px; margin: 0 auto; line-height: 1.6; }
              h1 { color: #0f172a; margin-bottom: 4px; font-size: 26px; font-weight: 800; }
              .sub-header { font-size: 12px; color: #64748b; margin-bottom: 24px; padding-bottom: 12px; border-bottom: 2px solid #e2e8f0; }
              .section-title { font-size: 13px; font-weight: 700; color: #6366f1; text-transform: uppercase; letter-spacing: 0.06em; margin-top: 20px; margin-bottom: 6px; }
              .section-content { font-size: 13px; color: #334155; white-space: pre-wrap; margin-bottom: 14px; }
            </style>
          </head>
          <body>
            ${editorSections
            .map((sec) =>
              sec.isHeader
                ? `<h1>${sec.title}</h1><div class="sub-header">${sec.content}</div>`
                : `<div class="section-title">${sec.title}</div><div class="section-content">${sec.content}</div>`
            )
            .join("")}
            <script>
              window.onload = function() { window.print(); }
            </script>
          </body>
          </html>
        `);
        printWin.document.close();
      }
    }

    setTimeout(() => setSaved(false), 2500);
  };

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const formatOptions = [
    {
      id: "pdf" as const,
      label: "PDF Document",
      ext: ".pdf",
      icon: "📄",
      color: "#ef4444",
      desc: "Print-ready vector PDF file",
    },
    {
      id: "docx" as const,
      label: "Microsoft Word",
      ext: ".docx",
      icon: "📘",
      color: "#3b82f6",
      desc: "Editable DOCX file for Word",
    },
    {
      id: "txt" as const,
      label: "Plain Text",
      ext: ".txt",
      icon: "📃",
      color: "#a78bfa",
      desc: "Clean text for ATS software",
    },
  ];

  return (
    <div className="fade-in page-container" style={{ height: "100%", overflowY: "auto", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div className="stack-on-mobile" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20, flexShrink: 0, gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: "white", margin: 0, letterSpacing: "-0.02em" }}>
            Step 3: Resume <span className="gradient-text">Editor & Refactor</span>
          </h1>
          <p style={{ color: "rgba(148,163,184,0.6)", fontSize: 14, margin: "6px 0 0" }}>
            Refactor and tailor your existing resume with AI-driven suggestions and live real-time editing.
          </p>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          <button className="btn-primary" style={{ padding: "9px 18px", fontSize: 13 }} onClick={() => onNavigate("ats-analysis")}>Step 4: Check ATS Score →</button>

          {/* Custom Glassmorphic Split Dropdown for Save & Download */}
          <div style={{ position: "relative" }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                background: "rgba(13, 13, 40, 0.88)",
                border: "1px solid rgba(124, 58, 237, 0.45)",
                borderRadius: 12,
                padding: "4px",
                boxShadow: "0 8px 24px rgba(0, 0, 0, 0.45), 0 0 20px rgba(124, 58, 237, 0.25)",
                backdropFilter: "blur(12px)",
                gap: 6,
              }}
            >
              {/* Format Dropdown Trigger */}
              <button
                type="button"
                onClick={() => setDropdownOpen((prev) => !prev)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  background: "rgba(255, 255, 255, 0.07)",
                  border: "1px solid rgba(255, 255, 255, 0.12)",
                  borderRadius: 8,
                  padding: "7px 12px",
                  color: "#e2e8f0",
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                <span style={{ fontSize: 14 }}>
                  {formatOptions.find((f) => f.id === exportFormat)?.icon}
                </span>
                <span style={{ color: "#c4b5fd", fontFamily: "JetBrains Mono" }}>
                  {exportFormat.toUpperCase()}
                </span>
                <span
                  style={{
                    fontSize: 10,
                    color: "rgba(148, 163, 184, 0.7)",
                    transform: dropdownOpen ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.2s ease",
                  }}
                >
                  ▼
                </span>
              </button>

              {/* Save & Export Button */}
              <button
                type="button"
                className="btn-primary"
                style={{
                  padding: "8px 18px",
                  fontSize: 13,
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  borderRadius: 8,
                  boxShadow: "0 0 16px rgba(124, 58, 237, 0.5)",
                }}
                onClick={handleDownload}
              >
                <span>💾</span>
                <span>
                  {saved ? `✓ Saved v${version}!` : `Save & Export (${exportFormat.toUpperCase()})`}
                </span>
              </button>
            </div>

            {/* Floating Glass Dropdown Menu */}
            {dropdownOpen && (
              <>
                <div
                  style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100vw",
                    height: "100vh",
                    zIndex: 99,
                  }}
                  onClick={() => setDropdownOpen(false)}
                />
                <div
                  className="fade-in glass"
                  style={{
                    position: "absolute",
                    top: "calc(100% + 8px)",
                    right: 0,
                    zIndex: 100,
                    width: 250,
                    background: "#0d0d2b",
                    border: "1px solid rgba(124, 58, 237, 0.5)",
                    borderRadius: 14,
                    padding: 8,
                    boxShadow: "0 20px 50px rgba(0, 0, 0, 0.9), 0 0 30px rgba(124, 58, 237, 0.4)",
                  }}
                >
                  <div
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      color: "rgba(148, 163, 184, 0.6)",
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                      padding: "6px 10px 4px",
                      fontFamily: "JetBrains Mono",
                    }}
                  >
                    Select Export Format
                  </div>

                  {formatOptions.map((opt) => {
                    const isSelected = exportFormat === opt.id;
                    return (
                      <div
                        key={opt.id}
                        onClick={() => {
                          setExportFormat(opt.id);
                          setDropdownOpen(false);
                        }}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 12,
                          padding: "10px 12px",
                          borderRadius: 10,
                          cursor: "pointer",
                          background: isSelected ? "rgba(124, 58, 237, 0.22)" : "transparent",
                          border: isSelected ? "1px solid rgba(124, 58, 237, 0.4)" : "1px solid transparent",
                          transition: "all 0.15s ease",
                          marginBottom: 4,
                        }}
                      >
                        <div
                          style={{
                            width: 32,
                            height: 32,
                            borderRadius: 8,
                            background: `${opt.color}20`,
                            border: `1px solid ${opt.color}40`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 16,
                            flexShrink: 0,
                          }}
                        >
                          {opt.icon}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <span style={{ fontSize: 13, fontWeight: 700, color: "white" }}>
                              {opt.label}
                            </span>
                            <span
                              style={{
                                fontSize: 10,
                                color: opt.color,
                                fontFamily: "JetBrains Mono",
                                fontWeight: 600,
                              }}
                            >
                              {opt.ext}
                            </span>
                          </div>
                          <div style={{ fontSize: 11, color: "rgba(148, 163, 184, 0.7)" }}>
                            {opt.desc}
                          </div>
                        </div>
                        {isSelected && (
                          <span style={{ color: "#10b981", fontSize: 14, fontWeight: 800 }}>✓</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, flex: 1, overflow: "hidden", paddingBottom: 28 }}>
        {/* LEFT — Resume Editor content */}
        <div style={{ overflowY: "auto", display: "flex", flexDirection: "column", gap: 16, paddingRight: 4 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {suggestions.map((s, idx) => {
              const isLocked = !hasActiveSubscription && idx >= 2;
              const statusStyle =
                s.status === "accepted" ? { borderColor: "rgba(16,185,129,0.35)", background: "rgba(16,185,129,0.05)" }
                  : s.status === "rejected" ? { borderColor: "rgba(239,68,68,0.25)", background: "rgba(239,68,68,0.04)", opacity: 0.65 }
                    : {};

              return (
                <LockedBlurOverlay
                  key={s.id}
                  isLocked={isLocked}
                  onOpenUpgradeModal={onOpenUpgradeModal}
                  title="Unlock Resume AI Suggestion"
                  subtitle="Upgrade plan to apply high-impact bullet optimizations & ATS keywords"
                >
                  <div
                    className="glass"
                    style={{
                      padding: "20px 22px",
                      transition: "all 0.2s",
                      ...statusStyle,
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                      <div style={{ display: "flex", gap: 8 }}>
                        <span className="tag tag-purple">{s.section}</span>
                        <span className={`tag ${s.impact === "high" ? "tag-green" : "tag-amber"}`}>{s.impact} impact</span>
                        <span className="tag tag-cyan">{s.type}</span>
                      </div>
                      {s.status !== "pending" && (
                        <span className={`tag ${s.status === "accepted" ? "tag-green" : "tag-red"}`}>
                          {s.status === "accepted" ? "✓ Accepted & Applied to Resume" : "✗ Rejected"}
                        </span>
                      )}
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 14 }}>
                      <div style={{ padding: "12px 14px", borderRadius: 10, background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.15)" }}>
                        <div style={{ fontSize: 11, color: "rgba(239,68,68,0.7)", fontFamily: "JetBrains Mono", marginBottom: 6 }}>BEFORE</div>
                        <div style={{ fontSize: 13, color: "rgba(226,232,240,0.7)", lineHeight: 1.5 }}>{s.original}</div>
                      </div>
                      <div style={{ padding: "12px 14px", borderRadius: 10, background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)" }}>
                        <div style={{ fontSize: 11, color: "rgba(16,185,129,0.7)", fontFamily: "JetBrains Mono", marginBottom: 6 }}>AI SUGGESTION</div>
                        {editing === s.id ? (
                          <textarea
                            className="glass-textarea"
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            rows={3}
                            style={{ fontSize: 13, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(124,58,237,0.4)" }}
                          />
                        ) : (
                          <div style={{ fontSize: 13, color: "rgba(226,232,240,0.85)", lineHeight: 1.5 }}>{s.suggested}</div>
                        )}
                      </div>
                    </div>

                    {!isLocked && s.status === "pending" && (
                      <div style={{ display: "flex", gap: 8 }}>
                        {editing === s.id ? (
                          <>
                            <button className="btn-primary" style={{ padding: "7px 16px", fontSize: 13 }} onClick={() => saveEdit(s.id)}>Save Edit & Accept</button>
                            <button className="btn-ghost" style={{ padding: "7px 16px", fontSize: 13 }} onClick={() => setEditing(null)}>Cancel</button>
                          </>
                        ) : (
                          <>
                            <button className="btn-primary" style={{ padding: "7px 16px", fontSize: 13, background: "linear-gradient(135deg, #10b981, #059669)" }} onClick={() => updateStatus(s.id, "accepted")}>✓ Accept</button>
                            <button className="btn-ghost" style={{ padding: "7px 16px", fontSize: 13, borderColor: "rgba(239,68,68,0.4)", color: "#fca5a5" }} onClick={() => updateStatus(s.id, "rejected")}>✗ Reject</button>
                            <button className="btn-ghost" style={{ padding: "7px 16px", fontSize: 13 }} onClick={() => startEdit(s)}>✎ Edit</button>
                          </>
                        )}
                      </div>
                    )}
                    {!isLocked && s.status !== "pending" && (
                      <button className="btn-ghost" style={{ padding: "6px 14px", fontSize: 12 }} onClick={() => updateStatus(s.id, "pending")}>Undo</button>
                    )}
                  </div>
                </LockedBlurOverlay>
              );
            })}
          </div>
        </div>

        {/* RIGHT — Resume preview (50% width) */}
        <div className="glass" style={{ display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <div style={{ padding: "16px 20px 12px", borderBottom: "1px solid rgba(255,255,255,0.07)", flexShrink: 0, position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: "white", letterSpacing: "-0.01em" }}>Resume Preview</div>
              <div style={{ fontSize: 11, fontFamily: "JetBrains Mono", color: "rgba(148,163,184,0.5)", marginTop: 2 }}>Arjun_Kumar_Resume_v7.pdf</div>
            </div>
            <span className="tag tag-green" style={{ position: "absolute", right: 20, fontSize: 10, cursor: "default" }}>
              ✓ Live Updated
            </span>
          </div>
          <div style={{ flex: 1, overflowY: "auto", padding: "16px 18px" }}>
            {editorSections.map((section, i) => (
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
                      {section.content}
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
