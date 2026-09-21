import { useState, useRef, useEffect } from "react";
import { Screen } from "../types";

interface JobResumeProps {
  onNavigate: (s: Screen) => void;
  onComplete: () => void;
  onStep2EnabledChange?: (enabled: boolean) => void;
}

export default function JobResume({ onNavigate, onComplete, onStep2EnabledChange }: JobResumeProps) {
  const [jobDesc, setJobDesc] = useState("");
  const [uploaded, setUploaded] = useState(false);
  const [fileName, setFileName] = useState("Arjun_Kumar_Resume_v7.pdf");
  const [fileSize, setFileSize] = useState("243 KB");
  const [validating, setValidating] = useState(false);
  const [validated, setValidated] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [showValidation, setShowValidation] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const isJobDescValid = jobDesc.trim().length >= 10;
  const isFormValid = isJobDescValid && uploaded && !validating;

  const handleUpload = (customName?: string, customSize?: string) => {
    if (customName) setFileName(customName);
    if (customSize) setFileSize(customSize);
    setUploaded(true);
    setValidating(true);
    setTimeout(() => {
      setValidating(false);
      setValidated(true);
    }, 1200);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const kb = Math.round(file.size / 1024);
      handleUpload(file.name, `${kb > 1024 ? (kb / 1024).toFixed(1) + " MB" : kb + " KB"}`);
    }
  };

  const handleValidate = () => {
    if (!isFormValid) return;
    onComplete();
    if (onStep2EnabledChange) {
      onStep2EnabledChange(true);
    }
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
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        accept=".pdf,.docx,.txt"
        style={{ display: "none" }}
        onChange={handleFileSelect}
      />

      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: "white", margin: 0, letterSpacing: "-0.02em" }}>
          Step 1: <span className="gradient-text">Job Description & Resume</span>
        </h1>
        <p style={{ color: "rgba(148,163,184,0.6)", fontSize: 14, margin: "6px 0 0" }}>
          Paste the target job description and upload your resume PDF to unlock Step 2 AI analysis.
        </p>
      </div>

      <div className="grid-responsive-sidebar" style={{ gap: 20, marginBottom: 20 }}>
        {/* LEFT — Job Description */}
        <div className="glass" style={{ padding: "24px 28px", display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: "white", marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span>
              Job Description <span style={{ color: "#ef4444", marginLeft: 4 }}>*</span>
            </span>
            {isJobDescValid ? (
              <span className="tag tag-green">✓ Filled</span>
            ) : (
              <span className="tag tag-amber">* Required</span>
            )}
          </div>
          <textarea
            className="glass-textarea"
            style={{
              flex: 1,
              minHeight: 280,
              border: !isJobDescValid && jobDesc.length > 0 ? "1px solid rgba(245,158,11,0.5)" : undefined,
            }}
            placeholder={"Paste target job description here...\n\nExample:\nSenior Frontend Engineer at Stripe\nWe are looking for a Senior Frontend Engineer to build scalable React & TypeScript web applications..."}
            value={jobDesc}
            onChange={(e) => setJobDesc(e.target.value)}
          />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12 }}>
            <div style={{ fontSize: 12, fontFamily: "JetBrains Mono", color: "rgba(148,163,184,0.4)" }}>
              {jobDesc.length} chars · {jobDesc.split(/\s+/).filter(Boolean).length} words
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              {jobDesc.length >= 20 && <span className="tag tag-green">✓ Ready</span>}
              {jobDesc.length > 0 && jobDesc.length < 20 && <span className="tag tag-amber">Min 10 chars</span>}
              {jobDesc.length === 0 && <span className="tag tag-red">Required</span>}
            </div>
          </div>
        </div>

        {/* RIGHT — Upload Resume & Step 2 Button */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Upload Resume Box */}
          <div className="glass" style={{ padding: "20px 24px", display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: "white", marginBottom: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span>
                Upload Resume <span style={{ color: "#ef4444", marginLeft: 4 }}>*</span>
              </span>
              {uploaded ? (
                <span className="tag tag-green">✓ Uploaded</span>
              ) : (
                <span className="tag tag-amber">* Required</span>
              )}
            </div>
            <div style={{ fontSize: 12, color: "rgba(148,163,184,0.5)", marginBottom: 12 }}>PDF or DOCX · Max 5MB · We parse text, structure, and formatting.</div>

            <div
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragging(false);
                const droppedFile = e.dataTransfer.files?.[0];
                if (droppedFile) {
                  const kb = Math.round(droppedFile.size / 1024);
                  handleUpload(droppedFile.name, `${kb > 1024 ? (kb / 1024).toFixed(1) + " MB" : kb + " KB"}`);
                } else {
                  handleUpload();
                }
              }}
              onClick={() => {
                if (!uploaded && fileInputRef.current) {
                  fileInputRef.current.click();
                }
              }}
              style={{
                border: `2px dashed ${dragging ? "rgba(124,58,237,0.7)" : uploaded ? "rgba(16,185,129,0.4)" : "rgba(255,255,255,0.15)"}`,
                borderRadius: 14, padding: "22px 16px", textAlign: "center",
                cursor: uploaded ? "default" : "pointer",
                background: dragging ? "rgba(124,58,237,0.08)" : uploaded ? "rgba(16,185,129,0.05)" : "rgba(255,255,255,0.02)",
                transition: "all 0.2s", flex: 1,
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              }}
            >
              <div style={{ fontSize: 32, marginBottom: 8 }}>{uploaded ? "📄" : "⬆"}</div>
              {!uploaded ? (
                <>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "white", marginBottom: 4 }}>Drop your resume here</div>
                  <div style={{ fontSize: 12, color: "rgba(148,163,184,0.5)", marginBottom: 12 }}>or click to browse files</div>
                  <div style={{ display: "inline-flex", gap: 6 }}>
                    <span className="tag tag-purple">PDF</span>
                    <span className="tag tag-cyan">DOCX</span>
                    <span className="tag tag-green">TXT</span>
                  </div>
                </>
              ) : (
                <>
                  <div style={{ fontSize: 13, fontWeight: 600, color: validating ? "#f59e0b" : "#10b981", marginBottom: 4 }}>
                    {validating ? "Parsing document..." : fileName}
                  </div>
                  <div style={{ fontSize: 11, color: "rgba(148,163,184,0.5)", marginBottom: 10 }}>
                    {validating ? "Extracting fields..." : `${fileSize} · Successfully parsed`}
                  </div>
                  {!validating && (
                    <div style={{ display: "flex", gap: 6 }}>
                      <span className="tag tag-green">✓ Parsed</span>
                      <span className="tag tag-cyan">{fileSize}</span>
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
                style={{ marginTop: 10, padding: "6px 0", fontSize: 12, width: "100%" }}
                onClick={() => {
                  setUploaded(false);
                  setValidated(false);
                  setValidating(false);
                  if (fileInputRef.current) fileInputRef.current.value = "";
                }}
              >
                ↺ Replace File
              </button>
            )}
          </div>

          {/* Step 2 Validate button */}
          {!showValidation && (
            <button
              className="btn-primary"
              disabled={!isFormValid}
              style={{
                width: "100%",
                padding: "12px 20px",
                fontSize: 14,
                fontWeight: 600,
                opacity: isFormValid ? 1 : 0.45,
                cursor: isFormValid ? "pointer" : "not-allowed",
                background: isFormValid ? "linear-gradient(135deg, #7c3aed, #06b6d4)" : "rgba(255, 255, 255, 0.1)",
                border: isFormValid ? "1px solid rgba(255, 255, 255, 0.2)" : "1px solid rgba(255, 255, 255, 0.1)",
                boxShadow: isFormValid ? "0 4px 15px rgba(124, 58, 237, 0.4)" : "none",
                transition: "all 0.25s ease",
              }}
              onClick={handleValidate}
            >
              Step 2: Validate Data & Proceed to AI Analysis →
            </button>
          )}
        </div>
      </div>

      {/* Tip (Original Full-Width Box) */}
      <div className="glass" style={{ padding: "14px 20px", marginBottom: 20, display: "flex", gap: 12, alignItems: "center" }}>
        <span style={{ fontSize: 20 }}>💡</span>
        <div>
          <span style={{ fontSize: 13, fontWeight: 600, color: "white" }}>Pro tip: </span>
          <span style={{ fontSize: 13, color: "rgba(148,163,184,0.6)" }}>Both Job Description and Resume PDF are required (*). Once both are provided, Step 2 button will be enabled.</span>
        </div>
      </div>

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
              Step 2: Validate Data & Proceed to AI Analysis →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
