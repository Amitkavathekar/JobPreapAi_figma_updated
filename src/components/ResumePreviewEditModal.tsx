import React, { useState, useEffect } from "react";

export interface ResumeDocument {
  id: number;
  name: string;
  job: string | null;
  score: string | null;
  type: string;
  createdAt: string;
  lastEdit: string;
  candidateName?: string;
  title?: string;
  email?: string;
  phone?: string;
  location?: string;
  summary?: string;
  experience?: string;
  skills?: string;
  education?: string;
}

interface ResumePreviewEditModalProps {
  isOpen: boolean;
  resume: ResumeDocument | null;
  isEditable?: boolean;
  onClose: () => void;
  onSave: (updatedResume: ResumeDocument) => void;
  onNavigateToFullEditor?: () => void;
}

export default function ResumePreviewEditModal({
  isOpen,
  resume,
  isEditable = false,
  onClose,
  onSave,
}: ResumePreviewEditModalProps) {
  if (!isOpen || !resume) return null;

  // Editable mode state
  const [editable, setEditable] = useState(isEditable);

  useEffect(() => {
    setEditable(isEditable);
  }, [isEditable, resume]);

  // Editable local state
  const [docName, setDocName] = useState(resume.name);
  const [candidateName, setCandidateName] = useState(resume.candidateName || "Arjun Kumar");
  const [jobTitle, setJobTitle] = useState(resume.title || "Senior Frontend Engineer");
  const [email, setEmail] = useState(resume.email || "arjun.kumar@techcorp.com");
  const [phone, setPhone] = useState(resume.phone || "+91 98765 43210");
  const [location, setLocation] = useState(resume.location || "Bengaluru, India");

  const [summary, setSummary] = useState(
    resume.summary ||
      "Results-driven Senior Frontend Engineer with 6+ years of experience designing, building, and optimizing scalable web applications using React, TypeScript, and modern CSS architectures."
  );

  const [experience, setExperience] = useState(
    resume.experience ||
      "• Senior Frontend Engineer — TechCorp Global (2023 - Present)\n  - Engineered 40+ reusable React & TypeScript UI components, reducing page load times by 45%.\n  - Mentored 6 junior developers and established CI/CD automated testing standards.\n\n• Frontend Developer — InnovateX Solutions (2021 - 2023)\n  - Built real-time analytics dashboard powering 15,000+ daily active users using GraphQL & WebSockets."
  );

  const [skills, setSkills] = useState(
    resume.skills ||
      "React 18, TypeScript, JavaScript (ES2022), Redux Toolkit, Next.js, Tailwind CSS, GraphQL, REST APIs, Jest, Vite, Git, Webpack"
  );

  const [education, setEducation] = useState(
    resume.education ||
      "B.Tech in Computer Science & Engineering\nNational Institute of Technology (NIT), 2017 - 2021 (GPA: 8.8/10)"
  );

  const [exportFormat, setExportFormat] = useState<"pdf" | "docx" | "txt">("pdf");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const formatOptions = [
    { id: "pdf" as const, label: "PDF Document", ext: ".pdf", icon: "📄", color: "#ef4444", desc: "Print-ready PDF document" },
    { id: "docx" as const, label: "Microsoft Word", ext: ".docx", icon: "📘", color: "#3b82f6", desc: "Editable DOCX file for Word" },
    { id: "txt" as const, label: "Plain Text", ext: ".txt", icon: "📃", color: "#a78bfa", desc: "Clean text file for ATS" },
  ];

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleSaveOnly = () => {
    const updated: ResumeDocument = {
      ...resume,
      name: docName,
      candidateName,
      title: jobTitle,
      email,
      phone,
      location,
      summary,
      experience,
      skills,
      education,
      lastEdit: "Just now",
    };

    onSave(updated);
    showToast("Resume saved successfully!");
    setTimeout(() => onClose(), 800);
  };

  const handleSaveAndExport = () => {
    const updated: ResumeDocument = {
      ...resume,
      name: docName,
      candidateName,
      title: jobTitle,
      email,
      phone,
      location,
      summary,
      experience,
      skills,
      education,
      lastEdit: "Just now",
    };

    onSave(updated);

    const safeFileName = docName.replace(/[^a-zA-Z0-9]/g, "_");

    if (exportFormat === "txt") {
      const fullText = `NAME: ${candidateName}\nTITLE: ${jobTitle}\nCONTACT: ${email} | ${phone} | ${location}\n\nSUMMARY:\n${summary}\n\nEXPERIENCE:\n${experience}\n\nSKILLS:\n${skills}\n\nEDUCATION:\n${education}`;
      const blob = new Blob([fullText], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${safeFileName}.txt`;
      a.click();
      URL.revokeObjectURL(url);
    } else if (exportFormat === "docx") {
      const docHtml = `
        <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
        <head><meta charset='utf-8'><title>${safeFileName}</title></head>
        <body style="font-family: Arial, sans-serif; font-size: 11pt; line-height: 1.5; color: #111827; padding: 30px;">
          <h1 style="color: #1e1b4b; margin-bottom: 2px;">${candidateName}</h1>
          <p style="color: #4f46e5; font-weight: bold; margin-top: 0;">${jobTitle}</p>
          <p style="color: #64748b; font-size: 9pt;">${email} | ${phone} | ${location}</p>
          <h3 style="color: #4338ca; border-bottom: 1px solid #cbd5e1;">PROFESSIONAL SUMMARY</h3>
          <p style="white-space: pre-wrap;">${summary}</p>
          <h3 style="color: #4338ca; border-bottom: 1px solid #cbd5e1;">WORK EXPERIENCE</h3>
          <p style="white-space: pre-wrap;">${experience}</p>
          <h3 style="color: #4338ca; border-bottom: 1px solid #cbd5e1;">TECHNICAL SKILLS</h3>
          <p>${skills}</p>
          <h3 style="color: #4338ca; border-bottom: 1px solid #cbd5e1;">EDUCATION</h3>
          <p style="white-space: pre-wrap;">${education}</p>
        </body>
        </html>
      `;
      const blob = new Blob([docHtml], { type: "application/msword;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${safeFileName}.docx`;
      a.click();
      URL.revokeObjectURL(url);
    } else {
      const printWin = window.open("", "_blank");
      if (printWin) {
        printWin.document.write(`
          <!DOCTYPE html>
          <html>
          <head>
            <title>${safeFileName}</title>
            <style>
              body { font-family: 'Arial', sans-serif; padding: 40px; color: #111827; max-width: 800px; margin: 0 auto; line-height: 1.5; }
              h1 { color: #1e1b4b; margin: 0 0 4px; font-size: 24px; font-weight: 800; }
              .subtitle { color: #6366f1; font-weight: 700; font-size: 14px; margin-bottom: 6px; }
              .contact { font-size: 11px; color: #475569; margin-bottom: 20px; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px; }
              .section-title { font-size: 12px; font-weight: 800; color: #4338ca; text-transform: uppercase; letter-spacing: 0.05em; margin-top: 18px; margin-bottom: 6px; border-bottom: 1px solid #cbd5e1; padding-bottom: 2px; }
              .content { font-size: 12px; color: #334155; white-space: pre-wrap; margin-bottom: 10px; }
            </style>
          </head>
          <body>
            <h1>${candidateName}</h1>
            <div class="subtitle">${jobTitle}</div>
            <div class="contact">📧 ${email} | 📞 ${phone} | 📍 ${location}</div>

            <div class="section-title">Professional Summary</div>
            <div class="content">${summary}</div>

            <div class="section-title">Work Experience</div>
            <div class="content">${experience}</div>

            <div class="section-title">Technical Skills</div>
            <div class="content">${skills}</div>

            <div class="section-title">Education</div>
            <div class="content">${education}</div>

            <script>
              window.onload = function() { window.print(); }
            </script>
          </body>
          </html>
        `);
        printWin.document.close();
      }
    }

    showToast(`Saved & Exported as ${exportFormat.toUpperCase()}!`);
    setTimeout(() => onClose(), 1000);
  };

  const editableStyle: React.CSSProperties = {
    outline: "none",
    borderRadius: 6,
    padding: "2px 6px",
    border: "1px dashed transparent",
    transition: "all 0.2s ease",
    cursor: editable ? "text" : "default",
  };

  const handleFocus = (e: React.FocusEvent<HTMLDivElement>) => {
    if (!editable) return;
    e.currentTarget.style.border = "1px dashed #a78bfa";
    e.currentTarget.style.background = "rgba(167, 139, 250, 0.08)";
  };

  const handleBlur = (e: React.FocusEvent<HTMLDivElement>, setter: (val: string) => void) => {
    if (!editable) return;
    e.currentTarget.style.border = "1px dashed transparent";
    e.currentTarget.style.background = "transparent";
    setter(e.currentTarget.innerText.trim());
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    if (editable && document.activeElement !== e.currentTarget) {
      e.currentTarget.style.border = "1px dashed rgba(167, 139, 250, 0.4)";
    }
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    if (document.activeElement !== e.currentTarget) {
      e.currentTarget.style.border = "1px dashed transparent";
    }
  };

  return (
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
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Toast */}
      {toastMsg && (
        <div
          style={{
            position: "fixed",
            top: 20,
            right: 20,
            zIndex: 11000,
            background: "rgba(16, 185, 129, 0.9)",
            color: "white",
            padding: "10px 18px",
            borderRadius: 10,
            fontSize: 13,
            fontWeight: 700,
            boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
          }}
        >
          ✓ {toastMsg}
        </div>
      )}

      <div
        className="glass"
        style={{
          width: "100%",
          maxWidth: 860,
          maxHeight: "92vh",
          display: "flex",
          flexDirection: "column",
          borderRadius: 20,
          background: "#0d0d2b",
          border: "1px solid rgba(255, 255, 255, 0.15)",
          boxShadow: "0 25px 70px rgba(0,0,0,0.85), 0 0 40px rgba(124, 58, 237, 0.2)",
          overflow: "hidden",
          position: "relative",
        }}
      >
        {/* Sleek Top Bar with Document Name & Close Button */}
        <div
          style={{
            padding: "14px 22px",
            borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "rgba(255, 255, 255, 0.02)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 18 }}>📄</span>
            {editable ? (
              <input
                type="text"
                value={docName}
                onChange={(e) => setDocName(e.target.value)}
                style={{
                  background: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(255, 255, 255, 0.12)",
                  color: "#ffffff",
                  fontWeight: 700,
                  fontSize: 15,
                  padding: "4px 10px",
                  borderRadius: 8,
                  outline: "none",
                  width: 280,
                }}
                placeholder="Document Name"
              />
            ) : (
              <span style={{ color: "#ffffff", fontWeight: 700, fontSize: 16 }}>
                {docName}
              </span>
            )}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {/* Toggle View Mode vs Edit Mode Button */}
            <button
              onClick={() => setEditable((prev) => !prev)}
              style={{
                background: editable ? "rgba(124, 58, 237, 0.25)" : "rgba(255, 255, 255, 0.08)",
                border: editable ? "1px solid rgba(124, 58, 237, 0.5)" : "1px solid rgba(255, 255, 255, 0.12)",
                color: editable ? "#a78bfa" : "#cbd5e1",
                padding: "6px 14px",
                borderRadius: 8,
                fontSize: 12,
                fontWeight: 700,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
              className="glass-hover"
            >
              {editable ? "👁 Switch to View Mode" : "✏️ Enable Editing"}
            </button>

            <button
              onClick={onClose}
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
                transition: "all 0.2s ease",
              }}
              className="glass-hover"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Modal Body: Direct Editable / View Only Resume Preview Card */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: 24,
            background: "#090922",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* Visual Mode Hint Banner */}
          <div
            style={{
              fontSize: 11,
              color: editable ? "#a78bfa" : "#34d399",
              background: editable ? "rgba(124, 58, 237, 0.12)" : "rgba(16, 185, 129, 0.12)",
              border: editable ? "1px solid rgba(124, 58, 237, 0.25)" : "1px solid rgba(16, 185, 129, 0.25)",
              padding: "5px 14px",
              borderRadius: 20,
              marginBottom: 16,
              fontWeight: 600,
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            {editable ? (
              <>
                <span>✏️</span> Edit Mode Enabled: Click any text directly inside the resume to edit inline
              </>
            ) : (
              <>
                <span>👁</span> View-Only Mode: Previewing resume. Click "✏️ Enable Editing" or select "Preview & Edit" from menu to make changes.
              </>
            )}
          </div>

          {/* Dark Glass Resume Preview Document Sheet */}
          <div
            className="glass"
            style={{
              width: "100%",
              maxWidth: 760,
              padding: "32px 36px",
              background: "rgba(13, 13, 43, 0.95)",
              border: "1px solid rgba(124, 58, 237, 0.35)",
              borderRadius: 16,
              boxShadow: "0 15px 40px rgba(0,0,0,0.6)",
              color: "#ffffff",
              lineHeight: 1.6,
              fontSize: 13,
            }}
          >
            {/* Document Header: Name & Title */}
            <div style={{ borderBottom: "1px solid rgba(255,255,255,0.12)", paddingBottom: 14, marginBottom: 18 }}>
              {/* Candidate Name Inline Editable */}
              <div
                contentEditable={editable}
                suppressContentEditableWarning
                onFocus={handleFocus}
                onBlur={(e) => handleBlur(e, setCandidateName)}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                style={{
                  ...editableStyle,
                  fontSize: 24,
                  fontWeight: 800,
                  color: "#ffffff",
                  letterSpacing: "-0.01em",
                }}
                title={editable ? "Click to edit Candidate Name" : ""}
              >
                {candidateName}
              </div>

              {/* Job Title Inline Editable */}
              <div
                contentEditable={editable}
                suppressContentEditableWarning
                onFocus={handleFocus}
                onBlur={(e) => handleBlur(e, setJobTitle)}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                style={{
                  ...editableStyle,
                  fontSize: 14,
                  fontWeight: 700,
                  color: "#a78bfa",
                  marginTop: 2,
                }}
                title={editable ? "Click to edit Professional Title" : ""}
              >
                {jobTitle}
              </div>

              {/* Contact Info Row */}
              <div style={{ fontSize: 11, color: "rgba(148, 163, 184, 0.8)", marginTop: 8, display: "flex", flexWrap: "wrap", gap: 14 }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                  <span>📧</span>
                  <span
                    contentEditable={editable}
                    suppressContentEditableWarning
                    onFocus={handleFocus}
                    onBlur={(e) => handleBlur(e, setEmail)}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    style={editableStyle}
                    title={editable ? "Click to edit Email" : ""}
                  >
                    {email}
                  </span>
                </span>

                <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                  <span>📞</span>
                  <span
                    contentEditable={editable}
                    suppressContentEditableWarning
                    onFocus={handleFocus}
                    onBlur={(e) => handleBlur(e, setPhone)}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    style={editableStyle}
                    title={editable ? "Click to edit Phone" : ""}
                  >
                    {phone}
                  </span>
                </span>

                <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                  <span>📍</span>
                  <span
                    contentEditable={editable}
                    suppressContentEditableWarning
                    onFocus={handleFocus}
                    onBlur={(e) => handleBlur(e, setLocation)}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    style={editableStyle}
                    title={editable ? "Click to edit Location" : ""}
                  >
                    {location}
                  </span>
                </span>
              </div>
            </div>

            {/* Professional Summary */}
            <div style={{ marginBottom: 18 }}>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#a78bfa",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  marginBottom: 6,
                  fontFamily: "JetBrains Mono",
                }}
              >
                PROFESSIONAL SUMMARY
              </div>
              <div
                contentEditable={editable}
                suppressContentEditableWarning
                onFocus={handleFocus}
                onBlur={(e) => handleBlur(e, setSummary)}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                style={{
                  ...editableStyle,
                  fontSize: 12.5,
                  color: "rgba(226, 232, 240, 0.88)",
                  whiteSpace: "pre-wrap",
                  lineHeight: 1.6,
                }}
                title={editable ? "Click to edit Professional Summary" : ""}
              >
                {summary}
              </div>
            </div>

            {/* Work Experience */}
            <div style={{ marginBottom: 18 }}>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#a78bfa",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  marginBottom: 6,
                  fontFamily: "JetBrains Mono",
                }}
              >
                WORK EXPERIENCE
              </div>
              <div
                contentEditable={editable}
                suppressContentEditableWarning
                onFocus={handleFocus}
                onBlur={(e) => handleBlur(e, setExperience)}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                style={{
                  ...editableStyle,
                  fontSize: 12.5,
                  color: "rgba(226, 232, 240, 0.88)",
                  whiteSpace: "pre-wrap",
                  lineHeight: 1.6,
                }}
                title={editable ? "Click to edit Work Experience" : ""}
              >
                {experience}
              </div>
            </div>

            {/* Technical Skills */}
            <div style={{ marginBottom: 18 }}>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#a78bfa",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  marginBottom: 6,
                  fontFamily: "JetBrains Mono",
                }}
              >
                TECHNICAL SKILLS
              </div>
              <div
                contentEditable={editable}
                suppressContentEditableWarning
                onFocus={handleFocus}
                onBlur={(e) => handleBlur(e, setSkills)}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                style={{
                  ...editableStyle,
                  fontSize: 12.5,
                  color: "rgba(226, 232, 240, 0.88)",
                  lineHeight: 1.6,
                }}
                title={editable ? "Click to edit Technical Skills" : ""}
              >
                {skills}
              </div>
            </div>

            {/* Education */}
            <div>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#a78bfa",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  marginBottom: 6,
                  fontFamily: "JetBrains Mono",
                }}
              >
                EDUCATION
              </div>
              <div
                contentEditable={editable}
                suppressContentEditableWarning
                onFocus={handleFocus}
                onBlur={(e) => handleBlur(e, setEducation)}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                style={{
                  ...editableStyle,
                  fontSize: 12.5,
                  color: "rgba(226, 232, 240, 0.88)",
                  whiteSpace: "pre-wrap",
                  lineHeight: 1.6,
                }}
                title={editable ? "Click to edit Education" : ""}
              >
                {education}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div
          style={{
            padding: "14px 24px",
            borderTop: "1px solid rgba(255, 255, 255, 0.08)",
            background: "rgba(255, 255, 255, 0.02)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          {/* Custom Glassmorphic Split Dropdown for Save & Export */}
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
                  background: "linear-gradient(90deg, #7c3aed 0%, #06b6d4 100%)",
                  boxShadow: "0 0 16px rgba(124, 58, 237, 0.5)",
                }}
                onClick={handleSaveAndExport}
              >
                <span>💾</span>
                <span>Save & Export ({exportFormat.toUpperCase()})</span>
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
                    bottom: "calc(100% + 8px)",
                    left: 0,
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

          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <button
              type="button"
              onClick={onClose}
              className="btn-ghost"
              style={{ padding: "8px 16px", fontSize: 12, borderRadius: 8 }}
            >
              Close
            </button>
            {editable && (
              <button
                type="button"
                onClick={handleSaveOnly}
                className="btn-primary"
                style={{ padding: "8px 20px", fontSize: 12, borderRadius: 8, background: "linear-gradient(135deg, #7c3aed, #06b6d4)" }}
              >
                💾 Save Changes
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
