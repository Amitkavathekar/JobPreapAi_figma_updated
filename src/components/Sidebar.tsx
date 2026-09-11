import { Screen } from "../types";

interface NavItem {
  id: Screen;
  icon: string;
  label: string;
  tag?: string;
}

interface NavSection {
  label: string;
  items: NavItem[];
}

const sections: NavSection[] = [
  {
    label: "Overview",
    items: [
      { id: "dashboard", icon: "⊞", label: "Dashboard" },
    ],
  },
  {
    label: "Resume AI",
    items: [
      { id: "job-resume", icon: "⬆", label: "Job & Resume" },
      { id: "ai-analysis", icon: "◈", label: "AI Analysis" },
      { id: "resume-editor", icon: "✎", label: "Resume Editor" },
      { id: "ats-analysis", icon: "◉", label: "ATS Analysis" },
    ],
  },
  {
    label: "Interview",
    items: [
      { id: "interview-prep", icon: "◷", label: "Interview Prep" },
      { id: "mock-interview", icon: "◐", label: "Mock Interview" },
    ],
  },
  {
    label: "History",
    items: [{ id: "reports", icon: "◫", label: "Reports & History" }],
  },
  {
    label: "Settings",
    items: [{ id: "profile", icon: "◎", label: "Profile Settings" }],
  },
];

interface SidebarProps {
  active: Screen;
  onNavigate: (s: Screen) => void;
  onLogout: () => void;
  isOpen: boolean;
  onToggle: () => void;
  progress: number;
  visited: Set<Screen>;
  profile?: {
    full_name: string;
    email: string;
    avatar_url?: string;
  };
  onOpenProfileModal?: () => void;
  hasActiveSubscription?: boolean;
  userSubscription?: any;
  onOpenUpgradeModal?: () => void;
  onOpenSupportModal?: () => void;
  isStep2Enabled?: boolean;
}

export default function Sidebar({
  active,
  onNavigate,
  onLogout,
  isOpen,
  onToggle,
  progress,
  visited,
  profile,
  onOpenProfileModal,
  hasActiveSubscription,
  userSubscription,
  onOpenUpgradeModal,
  onOpenSupportModal,
  isStep2Enabled = false,
}: SidebarProps) {
  const width = isOpen ? 228 : 60;
  const displayName = profile?.full_name || "Arjun Kumar";
  const displayEmail = profile?.email || "arjun@email.com";
  
  const getInitials = (name: string) => {
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const initials = getInitials(displayName);

  return (
    <aside
      style={{
        width,
        minWidth: width,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRight: "1px solid rgba(255,255,255,0.08)",
        background: "rgba(255,255,255,0.03)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        padding: isOpen ? "20px 12px" : "20px 8px",
        gap: 4,
        overflowY: "auto",
        overflowX: "hidden",
        transition: "width 0.25s ease, min-width 0.25s ease, padding 0.25s ease",
        position: "relative",
        flexShrink: 0,
      }}
    >
      {/* User profile header + toggle row */}
      <div style={{ display: "flex", alignItems: "center", marginBottom: 20, paddingLeft: isOpen ? 2 : 0, gap: 8, justifyContent: isOpen ? "flex-start" : "center" }}>
        {isOpen && (
          <div
            onClick={onOpenProfileModal || (() => onNavigate("profile"))}
            title="Click to view / edit complete profile"
            style={{ display: "flex", alignItems: "center", gap: 10, flex: 1, minWidth: 0, cursor: "pointer" }}
            className="glass-hover"
          >
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: profile?.avatar_url ? `url(${profile.avatar_url}) center/cover` : "linear-gradient(135deg, #7c3aed, #06b6d4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "white", flexShrink: 0 }}>
              {!profile?.avatar_url && initials}
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontWeight: 700, fontSize: 14, color: "white", lineHeight: 1.1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{displayName}</div>
              <div style={{ fontSize: 10, color: "rgba(148,163,184,0.6)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{displayEmail}</div>
            </div>
          </div>
        )}
        {!isOpen && (
          <div
            onClick={onOpenProfileModal || (() => onNavigate("profile"))}
            title={`${displayName} (${displayEmail}) - Click to complete profile`}
            style={{ width: 32, height: 32, borderRadius: "50%", background: profile?.avatar_url ? `url(${profile.avatar_url}) center/cover` : "linear-gradient(135deg, #7c3aed, #06b6d4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "white", cursor: "pointer" }}
          >
            {!profile?.avatar_url && initials}
          </div>
        )}
        <button
          onClick={onToggle}
          title={isOpen ? "Collapse sidebar" : "Expand sidebar"}
          style={{
            width: 24, height: 24, borderRadius: 6, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.05)",
            color: "rgba(148,163,184,0.7)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 12, flexShrink: 0, transition: "all 0.2s",
          }}
        >
          {isOpen ? "‹" : "›"}
        </button>
      </div>

      {/* Nav */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
        {sections.map((section) => {
          const isResumeAI = section.label === "Resume AI";
          if (isResumeAI) {
            const stepOrder: Record<Screen, number> = {
              "job-resume": 1,
              "ai-analysis": 2,
              "resume-editor": 3,
              "ats-analysis": 4,
            };
            const currentStepNum =
              stepOrder[active] ||
              (visited.has("ats-analysis")
                ? 4
                : visited.has("resume-editor")
                ? 3
                : visited.has("ai-analysis")
                ? 2
                : 1);
            const currentStepProgress = Math.round((currentStepNum / 4) * 100);

            return (
              <div key={section.label}>
                {isOpen && (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "8px 14px 4px",
                    }}
                  >
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 600,
                        letterSpacing: "0.1em",
                        color: "rgba(148,163,184,0.45)",
                        textTransform: "uppercase",
                        fontFamily: "JetBrains Mono",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {section.label}
                    </span>
                    <span
                      style={{
                        fontSize: 10,
                        fontFamily: "JetBrains Mono",
                        color: "rgba(167,139,250,0.9)",
                        fontWeight: 700,
                        transition: "all 0.3s",
                      }}
                      title="Progress"
                    >
                      {currentStepProgress}%
                    </span>
                  </div>
                )}
                {!isOpen && <div style={{ height: 8 }} />}

                <div
                  style={{
                    display: "flex",
                    gap: 8,
                    position: "relative",
                    alignItems: "stretch",
                  }}
                >
                  {/* Items list on LEFT */}
                  <div
                    style={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      gap: 4,
                    }}
                  >
                    {section.items.map((item) => {
                      const isDisabled = !isStep2Enabled && ["ai-analysis", "resume-editor", "ats-analysis", "interview-prep"].includes(item.id);
                      return (
                        <div
                          key={item.id}
                          className={`nav-item${
                            active === item.id ? " active" : ""
                          }`}
                          style={{
                            justifyContent: isOpen ? "flex-start" : "center",
                            padding: isOpen ? "8px 12px" : "8px 0",
                            position: "relative",
                            opacity: isDisabled ? 0.38 : 1,
                            cursor: isDisabled ? "not-allowed" : "pointer",
                            pointerEvents: "auto",
                          }}
                          onClick={() => !isDisabled && onNavigate(item.id)}
                          title={isDisabled ? "🔒 Fill Job Description & Upload Resume to unlock" : !isOpen ? item.label : undefined}
                        >
                          <span
                            style={{
                              fontSize: 16,
                              width: 20,
                              textAlign: "center",
                              flexShrink: 0,
                              position: "relative",
                            }}
                          >
                            {item.icon}
                          </span>
                          {isOpen && (
                            <span
                              style={{
                                flex: 1,
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {item.label}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Vertical Stepper Progress Bar on RIGHT (Nodes 1 to 4 with original gradient color) */}
                  <div
                    style={{
                      width: 26,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      alignItems: "center",
                      position: "relative",
                      padding: "6px 0",
                      flexShrink: 0,
                    }}
                    title={`Progress: ${currentStepProgress}%`}
                  >
                    {/* Background Vertical Line */}
                    <div
                      style={{
                        position: "absolute",
                        top: 14,
                        bottom: 14,
                        width: 3,
                        background: "rgba(255, 255, 255, 0.12)",
                        borderRadius: 2,
                        zIndex: 1,
                      }}
                    />

                    {/* Active Progress Vertical Line Fill */}
                    <div
                      style={{
                        position: "absolute",
                        top: 14,
                        height: `${((currentStepNum - 1) / 3) * 100}%`,
                        width: 3,
                        background: "linear-gradient(180deg, #7c3aed, #06b6d4)",
                        borderRadius: 2,
                        zIndex: 1,
                        transition: "height 0.4s ease",
                      }}
                    />

                    {/* Vertical Stepper Nodes 1 to 4 */}
                    {[1, 2, 3, 4].map((stepNum) => {
                      const stepScreen = (
                        stepNum === 1
                          ? "job-resume"
                          : stepNum === 2
                          ? "ai-analysis"
                          : stepNum === 3
                          ? "resume-editor"
                          : "ats-analysis"
                      ) as Screen;
                      const isCompleted = stepNum < currentStepNum;
                      const isActive = stepNum === currentStepNum;
                      const isUpcoming = stepNum > currentStepNum;
                      const nodeDisabled = !isStep2Enabled && stepNum > 1;

                      return (
                        <div
                          key={stepNum}
                          onClick={() => !nodeDisabled && onNavigate(stepScreen)}
                          style={{
                            width: 20,
                            height: 20,
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 10,
                            fontWeight: 800,
                            fontFamily: "Outfit, sans-serif",
                            cursor: nodeDisabled ? "not-allowed" : "pointer",
                            pointerEvents: "auto",
                            opacity: nodeDisabled ? 0.35 : 1,
                            zIndex: 2,
                            transition: "all 0.3s ease",
                            ...(isCompleted && {
                              background: "linear-gradient(135deg, #7c3aed, #06b6d4)",
                              color: "#ffffff",
                              boxShadow: "0 0 8px rgba(6, 182, 212, 0.4)",
                            }),
                            ...(isActive && {
                              background: "linear-gradient(135deg, #7c3aed, #06b6d4)",
                              color: "#ffffff",
                              boxShadow:
                                "0 0 0 2.5px #7c3aed, 0 0 0 5.5px rgba(6, 182, 212, 0.45)",
                            }),
                            ...(isUpcoming && {
                              background: "#ffffff",
                              color: "#7c3aed",
                              border: "2px solid #7c3aed",
                              boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                            }),
                          }}
                          title={nodeDisabled ? "🔒 Fill Job Description & Upload Resume to unlock" : `Step ${stepNum}: Click to navigate`}
                        >
                          {nodeDisabled ? "🔒" : isCompleted ? "✓" : stepNum}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          }

          return (
            <div key={section.label}>
              {isOpen && (
                <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", color: "rgba(148,163,184,0.45)", padding: "8px 14px 4px", textTransform: "uppercase", fontFamily: "JetBrains Mono", whiteSpace: "nowrap" }}>
                  {section.label}
                </div>
              )}
              {!isOpen && <div style={{ height: 8 }} />}
              {section.items.map((item) => {
                const isVisited = visited.has(item.id);
                const isDisabled = !isStep2Enabled && item.id === "interview-prep";
                return (
                  <div
                    key={item.id}
                    className={`nav-item${active === item.id ? " active" : ""}`}
                    style={{
                      justifyContent: isOpen ? "flex-start" : "center",
                      padding: isOpen ? "8px 12px" : "8px 0",
                      position: "relative",
                      opacity: isDisabled ? 0.38 : 1,
                      cursor: isDisabled ? "not-allowed" : "pointer",
                      pointerEvents: "auto",
                    }}
                    onClick={() => !isDisabled && onNavigate(item.id)}
                    title={isDisabled ? "🔒 Fill Job Description & Upload Resume to unlock" : !isOpen ? item.label : undefined}
                  >
                    <span style={{ fontSize: 16, width: 20, textAlign: "center", flexShrink: 0, position: "relative" }}>
                      {item.icon}
                    </span>
                    {isOpen && (
                      <>
                        <span style={{ flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                          <span>{item.label}</span>
                          {isDisabled && <span style={{ fontSize: 11, opacity: 0.8 }}>🔒</span>}
                        </span>
                        {item.tag && !isDisabled && (
                          <span style={{ fontSize: 10, fontFamily: "JetBrains Mono", color: "rgba(124,58,237,0.7)", background: "rgba(124,58,237,0.1)", padding: "1px 6px", borderRadius: 4, flexShrink: 0 }}>
                            {item.tag}
                          </span>
                        )}
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Footer / Support & Sign Out */}
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 10, marginTop: 8, display: "flex", flexDirection: "column", gap: 6 }}>
        {onOpenSupportModal && (
          isOpen ? (
            <button
              className="btn-ghost"
              style={{
                width: "100%",
                padding: "8px 12px",
                fontSize: 12,
                textAlign: "left",
                display: "flex",
                alignItems: "center",
                gap: 8,
                color: "#38bdf8",
                background: "rgba(6, 182, 212, 0.1)",
                border: "1px solid rgba(6, 182, 212, 0.2)",
                borderRadius: 8,
                cursor: "pointer",
                fontWeight: 600,
              }}
              onClick={onOpenSupportModal}
            >
              <span>🎧</span>
              <span>Help & Support</span>
            </button>
          ) : (
            <button
              className="btn-ghost"
              style={{
                width: 36,
                height: 36,
                padding: 0,
                fontSize: 15,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto",
                color: "#38bdf8",
                background: "rgba(6, 182, 212, 0.1)",
                border: "1px solid rgba(6, 182, 212, 0.2)",
                borderRadius: 8,
                cursor: "pointer",
              }}
              title="Help & Support"
              onClick={onOpenSupportModal}
            >
              🎧
            </button>
          )
        )}

        {isOpen ? (
          <button className="btn-ghost" style={{ width: "100%", padding: "9px 14px", fontSize: 13, textAlign: "left" }} onClick={onLogout}>
            ⎋ Sign Out
          </button>
        ) : (
          <button
            className="btn-ghost"
            style={{ width: 36, height: 36, padding: 0, fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto" }}
            title="Sign Out"
            onClick={onLogout}
          >
            ⎋
          </button>
        )}
      </div>
    </aside>
  );
}
