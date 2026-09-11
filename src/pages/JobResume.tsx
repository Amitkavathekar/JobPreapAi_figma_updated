import { useState } from "react";
import { Screen } from "../types";

interface JobResumeProps {
  onNavigate: (s: Screen) => void;
  onComplete: () => void;
}

export default function JobResume({ onNavigate, onComplete }: JobResumeProps) {
  const [jobDesc, setJobDesc] = useState("");
  const [uploaded, setUploaded] = useState(false);
  const [validating, setValidating] = useState(false);
  const [validated, setValidated] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [showValidation, setShowValidation] = useState(false);

  const handleUpload = () => {
    setUploaded(true);
    setValidating(true);
    setTimeout(() => {
      setValidating(false);
      setValidated(true);
    }, 1800);
  };

  const handleValidate = () => {
    if (!jobDesc || jobDesc.length < 20) {
      setJobDesc("Senior Frontend Engineer at Stripe\n\nWe are looking for a Senior Frontend Engineer to build scalable React & TypeScript web applications. Requirements: React, TypeScript, GraphQL, REST APIs, AWS, Performance Optimization, Node.js, CI/CD, and Microservices experience.");
    }
    if (!uploaded) {
      setUploaded(true);
      setValidated(true);
    }
    onComplete();
    onNavigate("ai-analysis");
  };

  const validatedFields = [
    { label: "Name", value: "Arjun Kumar", status: "ok" },
    { label: "Email", value: "arjun.kumar@gmail.com", status: "ok" },
    { label: "Phone", value: "+91 98765 43210", status: "ok" },
    { label: "LinkedIn", value: "linkedin.com/in/arjunkumar", status: "ok" },
    { label: "Total Experience", value: "5 years 4 months", status: "ok" },
    { label: "Education", value: "B.Tech CSE — IIT Delhi", status: "ok" },
    { label: "Skills Detected", value: "React, TypeScript, Node.js, AWS, GraphQL (+12)", status: "ok" },
    { label: "Certifications", value: "AWS SAA · Not found in resume", status: "warn" },
  ];

  return (
    <div className="fade-in page-container" style={{ height: "100%", overflowY: "auto" }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: "white", margin: 0, letterSpacing: "-0.02em" }}>
          Step 1: <span className="gradient-text">Job Description & Resume</span>
        </h1>
        <p style={{ color: "rgba(148,163,184,0.6)", fontSize: 14, margin: "6px 0 0" }}>
          Paste the target job description and your resume text (or select an existing file) to begin AI analysis.
        </p>
      </div>

      <div className="grid-responsive-sidebar" style={{ gap: 20, marginBottom: 20 }}>
        {/* LEFT — Job Description */}
        <div className="glass" style={{ padding: "24px 28px", display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: "white", marginBottom: 16 }}>Job Description</div>
          <textarea
            className="glass-textarea"
            style={{ flex: 1, minHeight: 280 }}
            placeholder={"Paste job description here...\n\nExample:\nSenior Frontend Engineer at Stripe\nWe're looking for a Senior Frontend Engineer to join our Growth team..."}
            value={jobDesc}
            onChange={(e) => setJobDesc(e.target.value)}
          />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12 }}>
            <div style={{ fontSize: 12, fontFamily: "JetBrains Mono", color: "rgba(148,163,184,0.4)" }}>
              {jobDesc.length} chars · {jobDesc.split(/\s+/).filter(Boolean).length} words
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              {jobDesc.length >= 50 && <span className="tag tag-green">✓ Ready</span>}
              {jobDesc.length > 0 && jobDesc.length < 50 && <span className="tag tag-amber">Too short</span>}
            </div>
          </div>
        </div>

        {/* RIGHT — Upload Resume */}
        <div className="glass" style={{ padding: "24px 28px", display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: "white", marginBottom: 6 }}>Upload Resume</div>
          <div style={{ fontSize: 13, color: "rgba(148,163,184,0.5)", marginBottom: 20 }}>PDF or DOCX · Max 5MB · We parse text, structure, and formatting.</div>

          <div
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => { e.preventDefault(); setDragging(false); handleUpload(); }}
            onClick={!uploaded ? handleUpload : undefined}
            style={{
              border: `2px dashed ${dragging ? "rgba(124,58,237,0.7)" : uploaded ? "rgba(16,185,129,0.4)" : "rgba(255,255,255,0.12)"}`,
              borderRadius: 14, padding: "40px 24px", textAlign: "center",
              cursor: uploaded ? "default" : "pointer",
              background: dragging ? "rgba(124,58,237,0.08)" : uploaded ? "rgba(16,185,129,0.05)" : "rgba(255,255,255,0.02)",
              transition: "all 0.2s", flex: 1,
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            }}
          >
            <div style={{ fontSize: 40, marginBottom: 12 }}>{uploaded ? "📄" : "⬆"}</div>
            {!uploaded ? (
              <>
                <div style={{ fontSize: 15, fontWeight: 600, color: "white", marginBottom: 6 }}>Drop your resume here</div>
                <div style={{ fontSize: 13, color: "rgba(148,163,184,0.5)", marginBottom: 16 }}>or click to browse files</div>
                <div style={{ display: "inline-flex", gap: 8 }}>
                  <span className="tag tag-purple">PDF</span>
                  <span className="tag tag-cyan">DOCX</span>
                  <span className="tag tag-green">TXT</span>
                </div>
              </>
            ) : (
              <>
                <div style={{ fontSize: 14, fontWeight: 600, color: validating ? "#f59e0b" : "#10b981", marginBottom: 6 }}>
                  {validating ? "Parsing document..." : "Arjun_Kumar_Resume_v7.pdf"}
                </div>
                <div style={{ fontSize: 12, color: "rgba(148,163,184,0.5)", marginBottom: 12 }}>
                  {validating ? "Extracting fields..." : "243 KB · Successfully parsed"}
                </div>
                {!validating && (
                  <div style={{ display: "flex", gap: 8 }}>
                    <span className="tag tag-green">✓ Parsed</span>
                    <span className="tag tag-cyan">243 KB</span>
                  </div>
                )}
                {validating && (
                  <div className="progress-bar" style={{ height: 4, width: 120 }}>
                    <div className="progress-fill" style={{ width: "60%" }} />
                  </div>
                )}
              </>
            )}
          </div>

          {uploaded && !validating && (
            <button
              className="btn-ghost"
              style={{ marginTop: 12, padding: "8px 0", fontSize: 13, width: "100%" }}
              onClick={() => { setUploaded(false); setValidated(false); setValidating(false); }}
            >
              ↺ Replace File
            </button>
          )}
        </div>
      </div>

      {/* Tip */}
      <div className="glass" style={{ padding: "14px 20px", marginBottom: 20, display: "flex", gap: 12, alignItems: "center" }}>
        <span style={{ fontSize: 20 }}>💡</span>
        <div>
          <span style={{ fontSize: 13, fontWeight: 600, color: "white" }}>Pro tip: </span>
          <span style={{ fontSize: 13, color: "rgba(148,163,184,0.6)" }}>Include the full JD including requirements, responsibilities, and preferred qualifications for the best analysis accuracy.</span>
        </div>
      </div>

      {/* Validate button */}
      {!showValidation && (
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button
            className="btn-primary"
            style={{ padding: "11px 28px", fontSize: 14 }}
            onClick={handleValidate}
          >
            Step 1: Validate Data & Proceed to AI Analysis →
          </button>
        </div>
      )}

      {/* Validation results */}
      {showValidation && (
        <div className="glass fade-in" style={{ padding: "24px 28px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "white" }}>Extracted & Validated Data</div>
              <div style={{ fontSize: 13, color: "rgba(148,163,184,0.5)", marginTop: 3 }}>Review AI-extracted fields. Correct any errors before analysis.</div>
            </div>
            <span className="tag tag-green">✓ 7/8 fields validated</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {validatedFields.map((f, i) => (
              <div key={f.label} style={{ display: "flex", alignItems: "center", gap: 16, padding: "13px 0", borderBottom: i < validatedFields.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
                <div style={{ width: 140, fontSize: 12, fontFamily: "JetBrains Mono", color: "rgba(148,163,184,0.45)", flexShrink: 0 }}>{f.label}</div>
                <div style={{ flex: 1, fontSize: 14, color: "rgba(226,232,240,0.9)" }}>{f.value}</div>
                <div>
                  {f.status === "ok" ? <span className="tag tag-green">✓ OK</span> : <span className="tag tag-amber">⚠ Review</span>}
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 20, display: "flex", justifyContent: "flex-end" }}>
            <button className="btn-primary" style={{ padding: "10px 22px", fontSize: 14 }} onClick={() => onNavigate("ai-analysis")}>
              Run AI Analysis →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
