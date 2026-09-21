import { useState } from "react";
import { UserProfile } from "../types";

interface ProfileProps {
  userProfile?: UserProfile;
  onSaveProfile?: (updatedProfile: UserProfile) => void;
  onOpenProfileModal?: () => void;
}

export default function Profile({
  userProfile,
  onSaveProfile,
}: ProfileProps) {
  const [activeTab, setActiveTab] = useState<"general" | "security" | "danger">(
    "general"
  );

  const [fullName] = useState(userProfile?.full_name || "Arjun Kumar");
  const [email] = useState(userProfile?.email || "arjun.kumar@gmail.com");
  const [language, setLanguage] = useState(userProfile?.language || "en");
  const [timezone, setTimezone] = useState(userProfile?.timezone || "Asia/Kolkata");
  const [professionalTitle, setProfessionalTitle] = useState(
    userProfile?.professional_title || "Senior Frontend Engineer"
  );
  const [bio, setBio] = useState(
    userProfile?.bio ||
      "5+ years building scalable web applications. Passionate about DX and design systems."
  );
  const [avatarUrl, setAvatarUrl] = useState(userProfile?.avatar_url || "");
  const [is2FAEnabled, setIs2FAEnabled] = useState(
    userProfile?.is_2fa_enabled ?? true
  );

  const [phoneNo, setPhoneNo] = useState(userProfile?.phone_no || "+91 98765 43210");
  const [location, setLocation] = useState(userProfile?.location || "Mumbai, India");
  const [portfolioUrl, setPortfolioUrl] = useState(userProfile?.portfolio_url || "https://arjun-kumar.dev");
  const [github, setGithub] = useState(userProfile?.github || "https://github.com/arjunkumar");
  const [linkedin, setLinkedin] = useState(userProfile?.linkedin || "https://linkedin.com/in/arjunkumar");

  const [degree, setDegree] = useState(userProfile?.degree || "Bachelor of Technology (B.Tech)");
  const [institution, setInstitution] = useState(userProfile?.institution || "IIT Bombay");
  const [fieldOfStudy, setFieldOfStudy] = useState(userProfile?.field_of_study || "Computer Science & Engineering");
  const [startYear, setStartYear] = useState<string | number>(userProfile?.start_year || 2019);
  const [endYear, setEndYear] = useState<string | number>(userProfile?.end_year || 2023);

  const [educationList, setEducationList] = useState([
    {
      degree: userProfile?.degree || "Bachelor of Technology (B.Tech)",
      fieldOfStudy: userProfile?.field_of_study || "Computer Science & Engineering",
      institution: userProfile?.institution || "IIT Bombay",
      startYear: userProfile?.start_year || 2019,
      endYear: userProfile?.end_year || 2023,
    },
  ]);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  const addEducation = () => {
    setEducationList((prev) => [
      ...prev,
      {
        degree: "",
        fieldOfStudy: "",
        institution: "",
        startYear: "",
        endYear: "",
      },
    ]);
  };

  const removeEducation = (index: number) => {
    setEducationList((prev) => prev.filter((_, i) => i !== index));
  };

  const handleEducationChange = (index: number, field: string, value: string | number) => {
    setEducationList((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleChangePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    if (!currentPassword) {
      setPasswordError("Please enter your current password.");
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters long.");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setPasswordError("New password and confirm password do not match.");
      return;
    }
    setPasswordChangeSuccess(true);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmNewPassword("");
    setTimeout(() => setPasswordChangeSuccess(false), 3000);
  };

  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    if (onSaveProfile && userProfile) {
      onSaveProfile({
        ...userProfile,
        full_name: fullName,
        email,
        language,
        timezone,
        professional_title: professionalTitle,
        bio,
        avatar_url: avatarUrl,
        is_2fa_enabled: is2FAEnabled,
        phone_no: phoneNo,
        location,
        portfolio_url: portfolioUrl,
        github,
        linkedin,
        degree,
        institution,
        field_of_study: fieldOfStudy,
        start_year: startYear,
        end_year: endYear,
        updated_at: new Date().toISOString(),
      });
    }
    setTimeout(() => setSaved(false), 2000);
  };

  const getInitials = (name: string) => {
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <div
      className="fade-in page-container"
      style={{ height: "100%", overflowY: "auto" }}
    >
      <div
        style={{
          marginBottom: 28,
          display: "flex",
          justify: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <div>
          <h1
            style={{
              fontSize: 26,
              fontWeight: 800,
              color: "white",
              margin: 0,
              letterSpacing: "-0.02em",
            }}
          >
            Profile <span className="gradient-text">Settings</span>
          </h1>
          <p style={{ color: "rgba(148,163,184,0.6)", fontSize: 14, margin: "6px 0 0" }}>
            Manage your candidate profile and security settings.
          </p>
        </div>
      </div>

      <div className="profile-grid">
        {/* Tab nav */}
        <div className="glass" style={{ padding: 10, height: "fit-content" }}>
          {(
            [
              ["general", "◎", "General Profile"],
              ["security", "◉", "Security & Password"],
              ["danger", "⚠ Danger Zone"],
            ] as const
          ).map(([id, icon, label]) => (
            <div
              key={id}
              className={`nav-item${activeTab === id ? " active" : ""}`}
              style={{ marginBottom: 2 }}
              onClick={() => setActiveTab(id)}
            >
              <span>{icon}</span> {label}
            </div>
          ))}
        </div>

        {/* Content */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {activeTab === "general" && (
            <>
              {/* Avatar */}
              <div
                className="glass"
                style={{
                  padding: "24px 28px",
                  display: "flex",
                  alignItems: "center",
                  gap: 24,
                }}
              >
                <div
                  style={{
                    width: 72,
                    height: 72,
                    borderRadius: "50%",
                    background: avatarUrl
                      ? `url(${avatarUrl}) center/cover`
                      : "linear-gradient(135deg, #7c3aed, #06b6d4)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 26,
                    fontWeight: 800,
                    color: "white",
                    flexShrink: 0,
                  }}
                  className="glow-purple"
                >
                  {!avatarUrl && getInitials(fullName)}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: "white", marginBottom: 12 }}>
                    Profile Photo / Avatar Upload
                  </div>
                  <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                    <input
                      className="glass-input"
                      style={{ fontSize: 13, padding: "7px 12px", minWidth: 260, flex: 1 }}
                      value={avatarUrl}
                      onChange={(e) => setAvatarUrl(e.target.value)}
                      placeholder="https://..."
                    />
                    <label
                      className="btn-ghost"
                      style={{
                        padding: "7px 14px",
                        fontSize: 13,
                        cursor: "pointer",
                        whiteSpace: "nowrap",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                      }}
                    >
                      <span>📷 Upload Photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={(e) => {
                          if (e.target.files?.[0]) {
                            const file = e.target.files[0];
                            const reader = new FileReader();
                            reader.onload = () => {
                              if (reader.result) {
                                setAvatarUrl(String(reader.result));
                              }
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                    {avatarUrl && (
                      <button
                        className="btn-ghost"
                        style={{ padding: "7px 14px", fontSize: 13 }}
                        onClick={() => setAvatarUrl("")}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Fields */}
              <div className="glass" style={{ padding: "24px 28px" }}>
                <div
                  style={{
                    fontSize: 15,
                    fontWeight: 700,
                    color: "white",
                    marginBottom: 20,
                  }}
                >
                  Personal Information
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
                  <div>
                    <label
                      style={{
                        fontSize: 13,
                        color: "rgba(148,163,184,0.7)",
                        display: "block",
                        marginBottom: 7,
                        fontWeight: 500,
                      }}
                    >
                      Full Name
                    </label>
                    <input
                      className="glass-input"
                      style={{
                        background: "rgba(255, 255, 255, 0.04)",
                        color: "rgba(255, 255, 255, 0.6)",
                        cursor: "not-allowed",
                        borderColor: "rgba(255, 255, 255, 0.1)",
                      }}
                      value={fullName}
                      readOnly
                      disabled
                    />
                  </div>
                  <div>
                    <label
                      style={{
                        fontSize: 13,
                        color: "rgba(148,163,184,0.7)",
                        display: "block",
                        marginBottom: 7,
                        fontWeight: 500,
                      }}
                    >
                      Email Address
                    </label>
                    <input
                      className="glass-input"
                      style={{
                        background: "rgba(255, 255, 255, 0.04)",
                        color: "rgba(255, 255, 255, 0.6)",
                        cursor: "not-allowed",
                        borderColor: "rgba(255, 255, 255, 0.1)",
                      }}
                      type="email"
                      value={email}
                      readOnly
                      disabled
                    />
                  </div>
                  <div>
                    <label
                      style={{
                        fontSize: 13,
                        color: "rgba(148,163,184,0.7)",
                        display: "block",
                        marginBottom: 7,
                        fontWeight: 500,
                      }}
                    >
                      Phone Number (phone_no)
                    </label>
                    <input
                      className="glass-input"
                      value={phoneNo}
                      onChange={(e) => setPhoneNo(e.target.value)}
                      placeholder="+91 98765 43210"
                    />
                  </div>
                  <div>
                    <label
                      style={{
                        fontSize: 13,
                        color: "rgba(148,163,184,0.7)",
                        display: "block",
                        marginBottom: 7,
                        fontWeight: 500,
                      }}
                    >
                      Location (location)
                    </label>
                    <input
                      className="glass-input"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="Mumbai, India"
                    />
                  </div>

                  <div>
                    <label
                      style={{
                        fontSize: 13,
                        color: "rgba(148,163,184,0.7)",
                        display: "block",
                        marginBottom: 7,
                        fontWeight: 500,
                      }}
                    >
                      Portfolio URL (portfolio_url)
                    </label>
                    <input
                      className="glass-input"
                      value={portfolioUrl}
                      onChange={(e) => setPortfolioUrl(e.target.value)}
                      placeholder="https://..."
                    />
                  </div>
                  <div>
                    <label
                      style={{
                        fontSize: 13,
                        color: "rgba(148,163,184,0.7)",
                        display: "block",
                        marginBottom: 7,
                        fontWeight: 500,
                      }}
                    >
                      GitHub Profile (github)
                    </label>
                    <input
                      className="glass-input"
                      value={github}
                      onChange={(e) => setGithub(e.target.value)}
                      placeholder="https://github.com/..."
                    />
                  </div>
                  <div style={{ gridColumn: "1 / -1" }}>
                    <label
                      style={{
                        fontSize: 13,
                        color: "rgba(148,163,184,0.7)",
                        display: "block",
                        marginBottom: 7,
                        fontWeight: 500,
                      }}
                    >
                      LinkedIn Profile (linkedin)
                    </label>
                    <input
                      className="glass-input"
                      value={linkedin}
                      onChange={(e) => setLinkedin(e.target.value)}
                      placeholder="https://linkedin.com/in/..."
                    />
                  </div>

                  <div style={{ gridColumn: "1 / -1" }}>
                    <label
                      style={{
                        fontSize: 13,
                        color: "rgba(148,163,184,0.7)",
                        display: "block",
                        marginBottom: 7,
                        fontWeight: 500,
                      }}
                    >
                      Select Language
                    </label>
                    <select
                      className="glass-select"
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                    >
                      <option value="en">English (US)</option>
                      <option value="hi">Hindi (हिंदी)</option>
                      <option value="mr">Marathi (मराठी)</option>
                      <option value="de">Deutsch</option>
                      <option value="fr">Français</option>
                      <option value="es">Español</option>
                    </select>
                  </div>
                  <div style={{ gridColumn: "1 / -1" }}>
                    <label
                      style={{
                        fontSize: 13,
                        color: "rgba(148,163,184,0.7)",
                        display: "block",
                        marginBottom: 7,
                        fontWeight: 500,
                      }}
                    >
                      Professional Title
                    </label>
                    <input
                      className="glass-input"
                      value={professionalTitle}
                      onChange={(e) => setProfessionalTitle(e.target.value)}
                    />
                  </div>
                  <div style={{ gridColumn: "1 / -1" }}>
                    <label
                      style={{
                        fontSize: 13,
                        color: "rgba(148,163,184,0.7)",
                        display: "block",
                        marginBottom: 7,
                        fontWeight: 500,
                      }}
                    >
                      Bio
                    </label>
                    <textarea
                      className="glass-textarea"
                      rows={3}
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                    />
                  </div>
                </div>

                {/* Education Section */}
                <hr className="glass-divider" style={{ margin: "24px 0" }} />
                <div
                  style={{
                    fontSize: 15,
                    fontWeight: 700,
                    color: "#a78bfa",
                    marginBottom: 16,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <div>🎓 Education & Degree Details (education_degree)</div>
                  <button
                    type="button"
                    className="btn-ghost"
                    onClick={addEducation}
                    style={{
                      fontSize: 12,
                      padding: "5px 12px",
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      borderColor: "rgba(167, 139, 250, 0.4)",
                      color: "#a78bfa",
                    }}
                  >
                    <span>➕</span> Add Education Degree
                  </button>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                  {educationList.map((edu, index) => (
                    <div
                      key={index}
                      style={{
                        background: "rgba(255, 255, 255, 0.02)",
                        border: "1px solid rgba(255, 255, 255, 0.06)",
                        borderRadius: 12,
                        padding: 16,
                        position: "relative",
                      }}
                    >
                      {educationList.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeEducation(index)}
                          style={{
                            position: "absolute",
                            top: 12,
                            right: 12,
                            background: "rgba(239, 68, 68, 0.15)",
                            border: "1px solid rgba(239, 68, 68, 0.3)",
                            color: "#ef4444",
                            borderRadius: 6,
                            fontSize: 11,
                            padding: "3px 8px",
                            cursor: "pointer",
                          }}
                        >
                          ✕ Remove
                        </button>
                      )}
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
                        <div>
                          <label
                            style={{
                              fontSize: 13,
                              color: "rgba(148,163,184,0.7)",
                              display: "block",
                              marginBottom: 7,
                              fontWeight: 500,
                            }}
                          >
                            Degree {educationList.length > 1 ? `#${index + 1}` : ""}
                          </label>
                          <input
                            className="glass-input"
                            value={edu.degree}
                            onChange={(e) => {
                              handleEducationChange(index, "degree", e.target.value);
                              if (index === 0) setDegree(e.target.value);
                            }}
                            placeholder="e.g. Bachelor of Technology"
                          />
                        </div>
                        <div>
                          <label
                            style={{
                              fontSize: 13,
                              color: "rgba(148,163,184,0.7)",
                              display: "block",
                              marginBottom: 7,
                              fontWeight: 500,
                            }}
                          >
                            Field of Study
                          </label>
                          <input
                            className="glass-input"
                            value={edu.fieldOfStudy}
                            onChange={(e) => {
                              handleEducationChange(index, "fieldOfStudy", e.target.value);
                              if (index === 0) setFieldOfStudy(e.target.value);
                            }}
                            placeholder="e.g. Computer Science"
                          />
                        </div>
                        <div style={{ gridColumn: "1 / -1" }}>
                          <label
                            style={{
                              fontSize: 13,
                              color: "rgba(148,163,184,0.7)",
                              display: "block",
                              marginBottom: 7,
                              fontWeight: 500,
                            }}
                          >
                            Institution / University
                          </label>
                          <input
                            className="glass-input"
                            value={edu.institution}
                            onChange={(e) => {
                              handleEducationChange(index, "institution", e.target.value);
                              if (index === 0) setInstitution(e.target.value);
                            }}
                            placeholder="e.g. IIT Bombay"
                          />
                        </div>
                        <div>
                          <label
                            style={{
                              fontSize: 13,
                              color: "rgba(148,163,184,0.7)",
                              display: "block",
                              marginBottom: 7,
                              fontWeight: 500,
                            }}
                          >
                            Start Year
                          </label>
                          <input
                            className="glass-input"
                            type="number"
                            value={edu.startYear}
                            onChange={(e) => {
                              handleEducationChange(index, "startYear", e.target.value);
                              if (index === 0) setStartYear(e.target.value);
                            }}
                          />
                        </div>
                        <div>
                          <label
                            style={{
                              fontSize: 13,
                              color: "rgba(148,163,184,0.7)",
                              display: "block",
                              marginBottom: 7,
                              fontWeight: 500,
                            }}
                          >
                            End Year
                          </label>
                          <input
                            className="glass-input"
                            type="number"
                            value={edu.endYear}
                            onChange={(e) => {
                              handleEducationChange(index, "endYear", e.target.value);
                              if (index === 0) setEndYear(e.target.value);
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: 20, display: "flex", gap: 10, alignItems: "center" }}>
                  <button
                    className="btn-primary"
                    style={{ padding: "10px 22px", fontSize: 14 }}
                    onClick={handleSave}
                  >
                    {saved ? "✓ Profile Saved!" : "Save Profile Changes"}
                  </button>
                </div>
              </div>
            </>
          )}

          {activeTab === "security" && (
            <div className="glass" style={{ padding: "24px 28px" }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: "white", marginBottom: 20 }}>
                Login Password & Security
              </div>

              <form onSubmit={handleChangePasswordSubmit} style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 460 }}>
                {passwordError && (
                  <div
                    style={{
                      background: "rgba(239, 68, 68, 0.12)",
                      border: "1px solid rgba(239, 68, 68, 0.3)",
                      color: "#ef4444",
                      padding: "10px 14px",
                      borderRadius: 8,
                      fontSize: 13,
                    }}
                  >
                    ⚠ {passwordError}
                  </div>
                )}
                {passwordChangeSuccess && (
                  <div
                    style={{
                      background: "rgba(16, 185, 129, 0.12)",
                      border: "1px solid rgba(16, 185, 129, 0.3)",
                      color: "#10b981",
                      padding: "10px 14px",
                      borderRadius: 8,
                      fontSize: 13,
                      fontWeight: 600,
                    }}
                  >
                    ✓ Password updated successfully!
                  </div>
                )}

                <div>
                  <label
                    style={{
                      fontSize: 13,
                      color: "rgba(148,163,184,0.7)",
                      display: "block",
                      marginBottom: 7,
                      fontWeight: 500,
                    }}
                  >
                    Current Password
                  </label>
                  <div style={{ position: "relative" }}>
                    <input
                      className="glass-input"
                      type={showCurrentPassword ? "text" : "password"}
                      placeholder="Enter current password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      style={{ width: "100%", paddingRight: 40 }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      style={{
                        position: "absolute",
                        right: 10,
                        top: "50%",
                        transform: "translateY(-50%)",
                        background: "none",
                        border: "none",
                        color: "rgba(148,163,184,0.8)",
                        cursor: "pointer",
                        fontSize: 14,
                        padding: 4,
                      }}
                      title={showCurrentPassword ? "Hide password" : "Show password"}
                    >
                      {showCurrentPassword ? "🙈" : "👁️"}
                    </button>
                  </div>
                </div>

                <div>
                  <label
                    style={{
                      fontSize: 13,
                      color: "rgba(148,163,184,0.7)",
                      display: "block",
                      marginBottom: 7,
                      fontWeight: 500,
                    }}
                  >
                    New Password
                  </label>
                  <div style={{ position: "relative" }}>
                    <input
                      className="glass-input"
                      type={showNewPassword ? "text" : "password"}
                      placeholder="Enter new password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      style={{ width: "100%", paddingRight: 40 }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      style={{
                        position: "absolute",
                        right: 10,
                        top: "50%",
                        transform: "translateY(-50%)",
                        background: "none",
                        border: "none",
                        color: "rgba(148,163,184,0.8)",
                        cursor: "pointer",
                        fontSize: 14,
                        padding: 4,
                      }}
                      title={showNewPassword ? "Hide password" : "Show password"}
                    >
                      {showNewPassword ? "🙈" : "👁️"}
                    </button>
                  </div>
                </div>

                <div>
                  <label
                    style={{
                      fontSize: 13,
                      color: "rgba(148,163,184,0.7)",
                      display: "block",
                      marginBottom: 7,
                      fontWeight: 500,
                    }}
                  >
                    Confirm New Password
                  </label>
                  <div style={{ position: "relative" }}>
                    <input
                      className="glass-input"
                      type={showConfirmNewPassword ? "text" : "password"}
                      placeholder="Confirm new password"
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      style={{ width: "100%", paddingRight: 40 }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                      style={{
                        position: "absolute",
                        right: 10,
                        top: "50%",
                        transform: "translateY(-50%)",
                        background: "none",
                        border: "none",
                        color: "rgba(148,163,184,0.8)",
                        cursor: "pointer",
                        fontSize: 14,
                        padding: 4,
                      }}
                      title={showConfirmNewPassword ? "Hide password" : "Show password"}
                    >
                      {showConfirmNewPassword ? "🙈" : "👁️"}
                    </button>
                  </div>
                </div>

                <div style={{ marginTop: 6 }}>
                  <button
                    type="submit"
                    className="btn-primary"
                    style={{ padding: "9px 20px", fontSize: 13 }}
                  >
                    Update Password
                  </button>
                </div>
              </form>


            </div>
          )}

          {activeTab === "danger" && (
            <div
              className="glass"
              style={{ padding: "24px 28px", border: "1px solid rgba(239,68,68,0.2)" }}
            >
              <div style={{ fontSize: 15, fontWeight: 700, color: "#fca5a5", marginBottom: 8 }}>
                ⚠ Danger Zone
              </div>
              <div style={{ fontSize: 13, color: "rgba(148,163,184,0.6)", marginBottom: 24 }}>
                These actions are permanent and cannot be undone.
              </div>
              {[
                {
                  title: "Deactivate Account",
                  desc: "Temporarily disable your account. You can reactivate anytime.",
                  btn: "Deactivate",
                  color: "#f59e0b",
                },
                {
                  title: "Delete Account",
                  desc: "Permanently delete your account and all associated data.",
                  btn: "Delete Account",
                  color: "#ef4444",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "16px 0",
                    borderBottom: "1px solid rgba(255,255,255,0.05)",
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: 14,
                        fontWeight: 600,
                        color: "rgba(226,232,240,0.9)",
                        marginBottom: 3,
                      }}
                    >
                      {item.title}
                    </div>
                    <div style={{ fontSize: 12, color: "rgba(148,163,184,0.5)" }}>
                      {item.desc}
                    </div>
                  </div>
                  <button
                    style={{
                      padding: "8px 16px",
                      fontSize: 13,
                      borderRadius: 8,
                      border: `1px solid ${item.color}55`,
                      background: `${item.color}15`,
                      color: item.color,
                      cursor: "pointer",
                      fontFamily: "Outfit",
                      fontWeight: 500,
                      flexShrink: 0,
                      marginLeft: 20,
                    }}
                  >
                    {item.btn}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
