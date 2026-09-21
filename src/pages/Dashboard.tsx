import { useState } from "react";
import { Screen, UserProfile } from "../types";
import CompleteProfileModal from "../components/CompleteProfileModal";
import ResumePreviewEditModal, { ResumeDocument } from "../components/ResumePreviewEditModal";

interface DashboardProps {
  onNavigate: (s: Screen) => void;
  userProfile?: UserProfile;
  showProfileModal?: boolean;
  onCloseProfileModal?: () => void;
  onOpenProfileModal?: () => void;
  onSaveProfile?: (profile: UserProfile) => void;
}

const stats = [
  { label: "ATS Match", value: "74", unit: "%", color: "#06b6d4", sub: "Senior FE Engineer" },
  { label: "Interviews Completed", value: "12", unit: "", color: "#10b981", sub: "This month" },
  { label: "Total Resumes", value: "5", unit: "", color: "#f59e0b", sub: "5 active resumes" },
];

const INITIAL_DOCUMENTS: ResumeDocument[] = [
  {
    id: 1,
    name: "Data Analyst - TechCorp",
    job: "TechCorp",
    score: "90%",
    type: "Resume",
    createdAt: "Sep 3, 2026",
    lastEdit: "1 day ago",
    candidateName: "Arjun Kumar",
    title: "Senior Data Analyst",
    email: "arjun.kumar@techcorp.com",
    phone: "+91 98765 43210",
    location: "Bengaluru, India",
  },
  {
    id: 2,
    name: "Data Visualization & Reporting Engineer",
    job: "Toyota Automation",
    score: "89%",
    type: "Resume",
    createdAt: "Sep 3, 2026",
    lastEdit: "1 day ago",
    candidateName: "Arjun Kumar",
    title: "Data Visualization Engineer",
  },
  {
    id: 3,
    name: "Data Engineer - Orinova Innovations",
    job: "Orinova Innovations",
    score: "99%",
    type: "Resume",
    createdAt: "Sep 3, 2026",
    lastEdit: "2 days ago",
    candidateName: "Arjun Kumar",
    title: "Data Engineer",
  },
  {
    id: 4,
    name: "Frontend Engineer - Google Prep",
    job: "Google",
    score: "92%",
    type: "Resume",
    createdAt: "Sep 3, 2026",
    lastEdit: "2 days ago",
    candidateName: "Arjun Kumar",
    title: "Senior Frontend Engineer",
  },
  {
    id: 5,
    name: "Data Analyst - Deloitte",
    job: "Deloitte",
    score: "88%",
    type: "Resume",
    createdAt: "Aug 27, 2026",
    lastEdit: "4 days ago",
    candidateName: "Arjun Kumar",
    title: "Analytics Consultant",
  },
  {
    id: 6,
    name: "Senior Full Stack Dev - Stripe",
    job: "Stripe",
    score: "94%",
    type: "Resume",
    createdAt: "Aug 20, 2026",
    lastEdit: "5 days ago",
    candidateName: "Arjun Kumar",
    title: "Full Stack Engineer",
  },
  {
    id: 7,
    name: "Backend Engineer - Amazon",
    job: "Amazon",
    score: "87%",
    type: "Resume",
    createdAt: "Aug 15, 2026",
    lastEdit: "1 week ago",
    candidateName: "Arjun Kumar",
    title: "Backend Engineer",
  },
  {
    id: 8,
    name: "UI/UX Developer - Notion",
    job: "Notion",
    score: "91%",
    type: "Resume",
    createdAt: "Aug 10, 2026",
    lastEdit: "2 weeks ago",
    candidateName: "Arjun Kumar",
    title: "Frontend Architect",
  },
];

const recentActivity = [
  { icon: "◈", text: "AI Analysis run for Stripe SWE role", time: "2h ago", color: "#7c3aed" },
  { icon: "✎", text: "Resume v7 saved with 3 AI suggestions", time: "5h ago", color: "#06b6d4" },
  { icon: "◉", text: "ATS Score improved to 74% (+11)", time: "Yesterday", color: "#10b981" },
  { icon: "◷", text: "Mock interview: System Design (78/100)", time: "2 days ago", color: "#f59e0b" },
  { icon: "⬆", text: "New job description added: Notion PM", time: "3 days ago", color: "#a78bfa" },
  { icon: "⚡", text: "ATS Scan executed for Tech Lead role", time: "4 days ago", color: "#ec4899" },
  { icon: "📄", text: "Exported Data Analyst Resume (PDF)", time: "5 days ago", color: "#3b82f6" },
  { icon: "🎯", text: "Completed AI Mock Interview: Frontend Lead", time: "1 week ago", color: "#10b981" },
];

export default function Dashboard({
  onNavigate,
  userProfile,
  showProfileModal,
  onCloseProfileModal,
  onOpenProfileModal,
  onSaveProfile,
}: DashboardProps) {
  const [activeMenuId, setActiveMenuId] = useState<number | null>(null);
  const [documentsList, setDocumentsList] = useState<ResumeDocument[]>(INITIAL_DOCUMENTS);
  const [pinnedDocs, setPinnedDocs] = useState<{ [key: number]: boolean }>({});
  const [selectedResumeForModal, setSelectedResumeForModal] = useState<ResumeDocument | null>(null);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [isModalEditable, setIsModalEditable] = useState(false);

  const handleTogglePin = (id: number) => {
    setPinnedDocs((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleDeleteDoc = (id: number) => {
    setDocumentsList((prev) => prev.filter((d) => d.id !== id));
  };

  // Pagination State for Resumes Table
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;
  const totalPages = Math.ceil(documentsList.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedDocs = documentsList.slice(startIndex, startIndex + itemsPerPage);

  const handleOpenPreviewModal = (doc: ResumeDocument, editable: boolean = false) => {
    setSelectedResumeForModal(doc);
    setIsModalEditable(editable);
    setIsPreviewModalOpen(true);
  };

  const handleSaveModalResume = (updated: ResumeDocument) => {
    setDocumentsList((prev) =>
      prev.map((d) => (d.id === updated.id ? updated : d))
    );
  };

  // In-Dashboard ATS Scanner Modal State
  const [showAtsModal, setShowAtsModal] = useState(false);
  const [atsFile, setAtsFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState("Arjun_Kumar_Resume.pdf");
  const [targetJobRole, setTargetJobRole] = useState("Senior Frontend Engineer");
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const [scanResult, setScanResult] = useState<{
    score: number;
    parseRate: number;
    matched: string[];
    missing: string[];
    tips: string[];
  } | null>(null);

  const firstName = userProfile?.full_name?.trim().split(" ")[0] || "Arjun";

  const handleRunAtsScan = () => {
    setIsScanning(true);
    setScanStep(20);
    setScanResult(null);

    setTimeout(() => setScanStep(55), 400);
    setTimeout(() => setScanStep(85), 800);
    setTimeout(() => {
      setScanStep(100);
      setIsScanning(false);
      setScanResult({
        score: 88,
        parseRate: 99.4,
        matched: ["React", "TypeScript", "Redux", "GraphQL", "AWS", "Node.js", "CI/CD", "Agile"],
        missing: ["Kubernetes", "gRPC", "Docker Compose"],
        tips: [
          "Include quantified impact for AWS EC2 deployment.",
          "Add Kubernetes or container orchestration experience.",
          "Ensure phone number format includes country code."
        ],
      });
    }, 1200);
  };

  const handleDownload = (docName: string) => {
    const blob = new Blob([`Document: ${docName}\nOwner: ${userProfile?.full_name || "Arjun Kumar"}\nGenerated by JobPrep AI`], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${docName.replace(/[^a-zA-Z0-9]/g, "_")}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fade-in page-container" style={{ height: "100%", overflowY: "auto" }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <div className="stack-on-mobile" style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}>
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 800, color: "white", margin: 0, letterSpacing: "-0.02em" }}>
              Good morning, <span className="gradient-text">{firstName}</span> 👋
            </h1>
            <p style={{ color: "rgba(148,163,184,0.6)", fontSize: 14, margin: "6px 0 0" }}>
              Your candidate profile is active ({userProfile?.professional_title || "Senior Frontend Engineer"}).
            </p>
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
            <button
              onClick={onOpenProfileModal}
              style={{
                background: "rgba(124, 58, 237, 0.15)",
                border: "1px solid rgba(124, 58, 237, 0.3)",
                borderRadius: 14,
                padding: "10px 18px",
                fontSize: 13,
                fontWeight: 700,
                color: "#a78bfa",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                transition: "all 0.2s ease",
              }}
              className="glass-hover"
            >
              <span>👤</span> Edit Complete Profile
            </button>
            <button
              style={{
                background: "linear-gradient(90deg, #8b5cf6 0%, #06b6d4 100%)",
                border: "none",
                borderRadius: 14,
                padding: "11px 22px",
                fontSize: 14,
                fontWeight: 700,
                color: "#ffffff",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                flexShrink: 0,
                boxShadow: "0 4px 20px rgba(6, 182, 212, 0.35)",
                transition: "all 0.2s ease",
                fontFamily: "'Outfit', sans-serif",
              }}
              onClick={() => {
                setShowAtsModal(true);
                if (!scanResult) handleRunAtsScan();
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-1px) scale(1.02)";
                e.currentTarget.style.boxShadow = "0 8px 25px rgba(6, 182, 212, 0.5)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "none";
                e.currentTarget.style.boxShadow = "0 4px 20px rgba(6, 182, 212, 0.35)";
              }}
            >
              <span style={{ fontSize: 18, lineHeight: 1 }}>🎯</span>
              <span style={{ letterSpacing: "-0.01em" }}>Check ATS Score</span>
            </button>
            <button className="btn-primary" style={{ padding: "10px 18px", fontSize: 13, flexShrink: 0 }} onClick={() => onNavigate("job-resume")}>
              + New Analysis
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid-responsive-3col" style={{ marginBottom: 24 }}>
        {stats.map((s) => (
          <div
            key={s.label}
            className="glass glass-hover"
            style={{
              padding: "20px 22px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 11, color: "rgba(148,163,184,0.5)", marginBottom: 10, fontFamily: "JetBrains Mono", letterSpacing: "0.06em", textTransform: "uppercase" }}>{s.label}</div>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: 2, marginBottom: 8 }}>
              <span style={{ fontSize: 36, fontWeight: 800, color: s.color, letterSpacing: "-0.04em" }}>{s.value}</span>
              <span style={{ fontSize: 16, color: "rgba(148,163,184,0.5)", fontWeight: 500 }}>{s.unit}</span>
            </div>
            <div style={{ fontSize: 12, color: "rgba(148,163,184,0.5)" }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* SIDE-BY-SIDE GRID: Documents (70%) | Recent Activity (30%) */}
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 7fr) minmax(0, 3fr)", gap: 20, alignItems: "stretch" }}>
        {/* LEFT COLUMN: DOCUMENTS (70%) */}
        <div className="glass" style={{ padding: "24px 28px", height: 395, display: "flex", flexDirection: "column", justifyContent: "space-between", boxSizing: "border-box" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: "white", margin: 0 }}>Resumes</h2>
            <div style={{ display: "flex", gap: 14, alignItems: "center" }}>


            </div>
          </div>

          {/* Documents Table */}
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                  <th style={{ padding: "12px 14px", fontSize: 13, fontWeight: 600, color: "rgba(226,232,240,0.8)" }}>Name</th>
                  <th style={{ padding: "12px 14px", fontSize: 13, fontWeight: 600, color: "rgba(226,232,240,0.8)" }}>Created at</th>
                  <th style={{ padding: "12px 14px", fontSize: 13, fontWeight: 600, color: "rgba(226,232,240,0.8)" }}>
                    Last edit <span style={{ fontSize: 11 }}>↓</span>
                  </th>
                  <th style={{ padding: "12px 14px", fontSize: 13, fontWeight: 600, color: "rgba(226,232,240,0.8)", textAlign: "center", width: 170 }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {paginatedDocs.map((doc, idx) => (
                  <tr
                    key={doc.id}
                    style={{
                      borderBottom: idx < paginatedDocs.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                      transition: "background 0.15s ease",
                    }}
                    className="glass-hover"
                  >
                    {/* Name */}
                    <td style={{ padding: "14px", fontSize: 13, fontWeight: 500, color: "white" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 15, opacity: 0.8 }}>📄</span>
                        <span
                          style={{
                            cursor: "pointer",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            maxWidth: 210,
                            color: "#a78bfa",
                            fontWeight: 600,
                            textDecoration: "none",
                          }}
                          className="hover:underline"
                          title={`Click to view ${doc.name}`}
                          onClick={() => handleOpenPreviewModal(doc, false)}
                        >
                          {doc.name}
                        </span>
                      </div>
                    </td>

                    {/* Created at */}
                    <td style={{ padding: "14px", fontSize: 12, color: "rgba(148,163,184,0.7)", fontFamily: "JetBrains Mono", whiteSpace: "nowrap" }}>
                      {doc.createdAt}
                    </td>

                    {/* Last edit */}
                    <td style={{ padding: "14px", fontSize: 12, color: "rgba(148,163,184,0.7)", whiteSpace: "nowrap" }}>
                      {doc.lastEdit}
                    </td>

                    {/* Actions — Action icons (Edit, Download, Pin, Delete) */}
                    <td style={{ padding: "14px 10px", textAlign: "center" }}>
                      <div style={{ display: "inline-flex", alignItems: "center", gap: 12 }}>
                        {/* 1. Sparkles / AI Edit */}
                        <button
                          title="Edit / AI Suggest"
                          onClick={() => handleOpenPreviewModal(doc, true)}
                          style={{
                            background: "none",
                            border: "none",
                            color: "rgba(226,232,240,0.8)",
                            cursor: "pointer",
                            padding: 4,
                            borderRadius: 4,
                            display: "flex",
                            alignItems: "center",
                            transition: "all 0.15s ease"
                          }}
                          className="hover:text-cyan-400 hover:scale-110"
                        >
                          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
                            <path d="M20 3v4" />
                            <path d="M18 5h4" />
                          </svg>
                        </button>

                        {/* 2. Download */}
                        <button
                          title="Download"
                          onClick={() => handleDownload(doc.name)}
                          style={{
                            background: "none",
                            border: "none",
                            color: "rgba(226,232,240,0.8)",
                            cursor: "pointer",
                            padding: 4,
                            borderRadius: 4,
                            display: "flex",
                            alignItems: "center",
                            transition: "all 0.15s ease"
                          }}
                          className="hover:text-sky-400 hover:scale-110"
                        >
                          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                            <polyline points="7 10 12 15 17 10"></polyline>
                            <line x1="12" y1="15" x2="12" y2="3"></line>
                          </svg>
                        </button>

                        {/* 3. Pin (Replaces Favorite) */}
                        <button
                          title={pinnedDocs[doc.id] ? "Unpin Resume" : "Pin Resume"}
                          onClick={() => handleTogglePin(doc.id)}
                          style={{
                            background: "none",
                            border: "none",
                            color: pinnedDocs[doc.id] ? "#f59e0b" : "rgba(226,232,240,0.8)",
                            cursor: "pointer",
                            padding: 4,
                            borderRadius: 4,
                            display: "flex",
                            alignItems: "center",
                            transition: "all 0.15s ease"
                          }}
                          className="hover:text-amber-400 hover:scale-110"
                        >
                          <svg width="17" height="17" viewBox="0 0 24 24" fill={pinnedDocs[doc.id] ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="12" y1="17" x2="12" y2="22"></line>
                            <path d="M5 17h14l-1.5-6H6.5L5 17z"></path>
                            <path d="M9 11V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v7"></path>
                          </svg>
                        </button>

                        {/* 4. Trash / Delete */}
                        <button
                          title="Delete"
                          onClick={() => handleDeleteDoc(doc.id)}
                          style={{
                            background: "none",
                            border: "none",
                            color: "rgba(226,232,240,0.8)",
                            cursor: "pointer",
                            padding: 4,
                            borderRadius: 4,
                            display: "flex",
                            alignItems: "center",
                            transition: "all 0.15s ease"
                          }}
                          className="hover:text-red-400 hover:scale-110"
                        >
                          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            <line x1="10" y1="11" x2="10" y2="17"></line>
                            <line x1="14" y1="11" x2="14" y2="17"></line>
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 20, paddingTop: 16, borderTop: "1px solid rgba(255,255,255,0.06)", flexWrap: "wrap", gap: 12 }}>
              <div style={{ fontSize: 12, color: "rgba(148,163,184,0.6)" }}>
                Showing <span style={{ color: "white", fontWeight: 600 }}>{startIndex + 1}</span> to{" "}
                <span style={{ color: "white", fontWeight: 600 }}>{Math.min(startIndex + itemsPerPage, documentsList.length)}</span> of{" "}
                <span style={{ color: "white", fontWeight: 600 }}>{documentsList.length}</span> resumes
              </div>
              <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  style={{
                    padding: "5px 12px",
                    fontSize: 12,
                    fontWeight: 600,
                    borderRadius: 8,
                    border: "1px solid rgba(255,255,255,0.1)",
                    background: "rgba(255,255,255,0.03)",
                    color: currentPage === 1 ? "rgba(148,163,184,0.3)" : "rgba(226,232,240,0.8)",
                    cursor: currentPage === 1 ? "not-allowed" : "pointer",
                    transition: "all 0.15s ease",
                  }}
                  className={currentPage !== 1 ? "glass-hover" : ""}
                >
                  ← Prev
                </button>
                {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    style={{
                      width: 30,
                      height: 30,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 12,
                      fontWeight: 700,
                      borderRadius: 8,
                      border: page === currentPage ? "none" : "1px solid rgba(255,255,255,0.1)",
                      background: page === currentPage ? "linear-gradient(135deg, #7c3aed, #06b6d4)" : "rgba(255,255,255,0.03)",
                      color: page === currentPage ? "#ffffff" : "rgba(226,232,240,0.8)",
                      cursor: "pointer",
                      transition: "all 0.15s ease",
                      boxShadow: page === currentPage ? "0 2px 10px rgba(124,58,237,0.4)" : "none",
                    }}
                    className={page !== currentPage ? "glass-hover" : ""}
                  >
                    {page}
                  </button>
                ))}
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  style={{
                    padding: "5px 12px",
                    fontSize: 12,
                    fontWeight: 600,
                    borderRadius: 8,
                    border: "1px solid rgba(255,255,255,0.1)",
                    background: "rgba(255,255,255,0.03)",
                    color: currentPage === totalPages ? "rgba(148,163,184,0.3)" : "rgba(226,232,240,0.8)",
                    cursor: currentPage === totalPages ? "not-allowed" : "pointer",
                    transition: "all 0.15s ease",
                  }}
                  className={currentPage !== totalPages ? "glass-hover" : ""}
                >
                  Next →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: RECENT ACTIVITY (30%) */}
        <div className="glass" style={{ padding: "24px 22px", height: 395, display: "flex", flexDirection: "column", boxSizing: "border-box" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18, flexShrink: 0 }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: "white" }}>Recent Activity</div>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 10,
              flex: 1,
              overflowY: "auto",
              minHeight: 0,
              paddingRight: 4,
            }}
            className="custom-scrollbar"
          >
            {recentActivity.map((a, i) => (
              <div key={i} style={{ display: "flex", gap: 10, padding: "10px 12px", borderRadius: 10, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }} className="glass-hover">
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: `${a.color}22`, border: `1px solid ${a.color}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>
                  {a.icon}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, color: "rgba(226,232,240,0.9)", fontWeight: 500, lineHeight: 1.3, marginBottom: 3 }}>{a.text}</div>
                  <div style={{ fontSize: 11, color: "rgba(148,163,184,0.5)", fontFamily: "JetBrains Mono" }}>{a.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* IN-DASHBOARD REAL-TIME ATS SCANNER MODAL */}
      {showAtsModal && (
        <div
          className="fade-in"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: 9999,
            background: "rgba(7, 7, 26, 0.55)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
            boxSizing: "border-box",
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowAtsModal(false);
          }}
        >
          <div
            className="glass"
            style={{
              width: "100%",
              maxWidth: 640,
              maxHeight: "85vh",
              overflowY: "auto",
              background: "#0d0d2b",
              border: "1px solid rgba(255, 255, 255, 0.18)",
              borderRadius: 20,
              padding: "24px 28px",
              boxShadow: "0 20px 60px rgba(0, 0, 0, 0.7), 0 0 30px rgba(124, 58, 237, 0.25)",
              color: "#ffffff",
              position: "relative",
              boxSizing: "border-box",
            }}
          >
            {/* Header & Close */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                  <span style={{ fontSize: 22 }}>🎯</span>
                  <h2 style={{ fontSize: 22, fontWeight: 800, color: "white", margin: 0 }}>
                    In-Dashboard ATS Score Scanner
                  </h2>
                </div>
                <p style={{ fontSize: 13, color: "rgba(148, 163, 184, 0.7)", margin: 0 }}>
                  Upload your resume file or scan instantly without leaving your Dashboard.
                </p>
              </div>
              <button
                onClick={() => setShowAtsModal(false)}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  background: "rgba(255, 255, 255, 0.08)",
                  border: "1px solid rgba(255, 255, 255, 0.12)",
                  color: "rgba(148, 163, 184, 0.8)",
                  fontSize: 16,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                ✕
              </button>
            </div>

            {/* File Upload Box & Job Input */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 20 }}>
              <div style={{ background: "rgba(255,255,255,0.03)", border: "1px dashed rgba(255,255,255,0.15)", borderRadius: 14, padding: "16px 20px", textAlign: "center" }}>
                <div style={{ fontSize: 12, color: "rgba(148,163,184,0.6)", marginBottom: 6 }}>Resume File</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#06b6d4", marginBottom: 8, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  📄 {fileName}
                </div>
                <label style={{ fontSize: 12, color: "#a78bfa", textDecoration: "underline", cursor: "pointer" }}>
                  Change File
                  <input
                    type="file"
                    accept=".pdf,.docx,.txt"
                    style={{ display: "none" }}
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        setAtsFile(e.target.files[0]);
                        setFileName(e.target.files[0].name);
                      }
                    }}
                  />
                </label>
              </div>

              <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: "16px 20px" }}>
                <label style={{ fontSize: 12, color: "rgba(148,163,184,0.6)", display: "block", marginBottom: 6 }}>Target Job Role</label>
                <input
                  className="glass-input"
                  style={{ width: "100%", padding: "8px 12px", fontSize: 13, background: "rgba(255,255,255,0.05)" }}
                  value={targetJobRole}
                  onChange={(e) => setTargetJobRole(e.target.value)}
                  placeholder="e.g. Senior Frontend Engineer"
                />
              </div>
            </div>

            {/* Scan Action Button */}
            <button
              style={{
                width: "100%",
                background: "linear-gradient(90deg, #7c3aed 0%, #06b6d4 100%)",
                border: "none",
                borderRadius: 12,
                padding: "12px",
                fontSize: 14,
                fontWeight: 700,
                color: "white",
                cursor: isScanning ? "wait" : "pointer",
                marginBottom: 24,
                boxShadow: "0 4px 20px rgba(124, 58, 237, 0.4)",
              }}
              disabled={isScanning}
              onClick={handleRunAtsScan}
            >
              {isScanning ? `Scanning ATS Score (${scanStep}%)...` : "⚡ Run ATS Diagnostic Scan"}
            </button>

            {/* Scanning Progress Bar */}
            {isScanning && (
              <div style={{ marginBottom: 24 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#06b6d4", marginBottom: 6, fontWeight: 600 }}>
                  <span>Analyzing ATS parser compliance...</span>
                  <span>{scanStep}%</span>
                </div>
                <div style={{ width: "100%", height: 8, borderRadius: 999, background: "rgba(255,255,255,0.1)", overflow: "hidden" }}>
                  <div
                    style={{
                      height: "100%",
                      width: `${scanStep}%`,
                      background: "linear-gradient(90deg, #7c3aed, #06b6d4)",
                      borderRadius: 999,
                      transition: "width 0.3s ease",
                    }}
                  />
                </div>
              </div>
            )}

            {/* Scan Results Output */}
            {scanResult && !isScanning && (
              <div className="fade-in" style={{ background: "rgba(255, 255, 255, 0.03)", border: "1px solid rgba(255, 255, 255, 0.1)", borderRadius: 18, padding: 24 }}>
                {/* Score Banner */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, paddingBottom: 16, borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                  <div>
                    <div style={{ fontSize: 12, color: "rgba(148, 163, 184, 0.7)", textTransform: "uppercase", letterSpacing: "0.06em", fontFamily: "JetBrains Mono" }}>
                      Overall ATS Match Score
                    </div>
                    <div style={{ fontSize: 42, fontWeight: 800, color: "#10b981", lineHeight: 1.1 }}>
                      {scanResult.score}% <span style={{ fontSize: 14, color: "rgba(148, 163, 184, 0.7)", fontWeight: 500 }}>/ 100</span>
                    </div>
                  </div>

                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 12, color: "rgba(148, 163, 184, 0.7)" }}>Parse Compatibility</div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: "#06b6d4" }}>{scanResult.parseRate}% Passed</div>
                  </div>
                </div>

                {/* Keywords Matched vs Missing */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#10b981", marginBottom: 8 }}>
                      ✓ Matched Keywords ({scanResult.matched.length})
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {scanResult.matched.map((kw) => (
                        <span key={kw} style={{ fontSize: 11, background: "rgba(16, 185, 129, 0.15)", color: "#10b981", padding: "3px 8px", borderRadius: 6, border: "1px solid rgba(16, 185, 129, 0.3)" }}>
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#ef4444", marginBottom: 8 }}>
                      ⚠ Missing Critical Keywords ({scanResult.missing.length})
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {scanResult.missing.map((kw) => (
                        <span key={kw} style={{ fontSize: 11, background: "rgba(239, 68, 68, 0.15)", color: "#ef4444", padding: "3px 8px", borderRadius: 6, border: "1px solid rgba(239, 68, 68, 0.3)" }}>
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* AI Optimization Recommendations */}
                <div style={{ background: "rgba(124, 58, 237, 0.1)", border: "1px solid rgba(124, 58, 237, 0.3)", borderRadius: 12, padding: 14, marginBottom: 20 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#a78bfa", marginBottom: 6 }}>
                    💡 AI Score Booster Tips:
                  </div>
                  <ul style={{ margin: 0, paddingLeft: 18, fontSize: 12, color: "rgba(226, 232, 240, 0.85)", display: "flex", flexDirection: "column", gap: 4 }}>
                    {scanResult.tips.map((tip, i) => (
                      <li key={i}>{tip}</li>
                    ))}
                  </ul>
                </div>

                {/* Footer Buttons */}
                <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
                  <button
                    className="btn-ghost"
                    style={{ padding: "8px 16px", fontSize: 12 }}
                    onClick={() => {
                      const text = `ATS Score Audit Report\nFile: ${fileName}\nJob: ${targetJobRole}\nScore: ${scanResult.score}%\nParse Rate: ${scanResult.parseRate}%\nMatched: ${scanResult.matched.join(", ")}\nMissing: ${scanResult.missing.join(", ")}`;
                      const blob = new Blob([text], { type: "text/plain" });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement("a");
                      a.href = url;
                      a.download = `ATS_Audit_${fileName.replace(/\.[^/.]+$/, "")}.txt`;
                      a.click();
                      URL.revokeObjectURL(url);
                    }}
                  >
                    📥 Download Audit Report
                  </button>
                  <button
                    className="btn-primary"
                    style={{ padding: "8px 18px", fontSize: 12 }}
                    onClick={() => setShowAtsModal(false)}
                  >
                    Done & Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Complete Profile Popup Modal */}
      {userProfile && (
        <CompleteProfileModal
          isOpen={!!showProfileModal}
          onClose={onCloseProfileModal || (() => { })}
          profile={userProfile}
          onSaveProfile={onSaveProfile || (() => { })}
        />
      )}

      {/* Resume Live Preview & Edit Modal */}
      <ResumePreviewEditModal
        isOpen={isPreviewModalOpen}
        resume={selectedResumeForModal}
        isEditable={isModalEditable}
        onClose={() => setIsPreviewModalOpen(false)}
        onSave={handleSaveModalResume}
        onNavigateToFullEditor={() => onNavigate("resume-editor")}
      />
    </div>
  );
}
