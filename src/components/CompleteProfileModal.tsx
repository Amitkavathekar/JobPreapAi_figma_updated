import { useState } from "react";
import { UserProfile } from "../types";

interface CompleteProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onSaveProfile: (updatedProfile: UserProfile) => void;
}

export default function CompleteProfileModal({
  isOpen,
  onClose,
  profile,
  onSaveProfile,
}: CompleteProfileModalProps) {
  const [formData, setFormData] = useState<UserProfile>({ ...profile });
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [educationList, setEducationList] = useState([
    {
      degree: profile.degree || "Bachelor of Technology (B.Tech)",
      field_of_study: profile.field_of_study || "Computer Science",
      institution: profile.institution || "IIT Bombay",
      start_year: profile.start_year || 2019,
      end_year: profile.end_year || 2023,
    },
  ]);

  const addEducation = () => {
    setEducationList((prev) => [
      ...prev,
      {
        degree: "",
        field_of_study: "",
        institution: "",
        start_year: "",
        end_year: "",
      },
    ]);
  };

  const removeEducation = (index: number) => {
    setEducationList((prev) => prev.filter((_, i) => i !== index));
  };

  const handleEducationChange = (
    index: number,
    field: string,
    value: string | number
  ) => {
    setEducationList((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  if (!isOpen) return null;

  const handleChange = (
    key: keyof UserProfile,
    value: string | boolean | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
      updated_at: new Date().toISOString(),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setShowSuccess(true);
      const finalData = {
        ...formData,
        updated_at: new Date().toISOString(),
      };
      onSaveProfile(finalData);
      setTimeout(() => {
        setShowSuccess(false);
        onClose();
      }, 1200);
    }, 600);
  };

  const getInitials = (name: string) => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <div
      className="fade-in"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 10000,
        background: "rgba(7, 7, 26, 0.78)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        boxSizing: "border-box",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="glass custom-scrollbar"
        style={{
          width: "95%",
          maxWidth: 880,
          maxHeight: "92vh",
          overflowY: "auto",
          background: "#0d0d2b",
          border: "1px solid rgba(124, 58, 237, 0.38)",
          borderRadius: 24,
          padding: "32px 36px",
          boxShadow:
            "0 24px 70px rgba(0, 0, 0, 0.85), 0 0 45px rgba(124, 58, 237, 0.35)",
          color: "#ffffff",
          position: "relative",
          boxSizing: "border-box",
        }}
      >
        {/* Top Header Bar */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: 24,
            borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
            paddingBottom: 16,
          }}
        >
          <div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "4px 14px",
                borderRadius: 20,
                background: "rgba(124, 58, 237, 0.15)",
                border: "1px solid rgba(124, 58, 237, 0.3)",
                fontSize: 11,
                fontWeight: 700,
                color: "#a78bfa",
                marginBottom: 8,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              <span>⚡ CANDIDATE ACCOUNT PROFILE</span>
            </div>
            <h2
              style={{
                fontSize: 26,
                fontWeight: 800,
                color: "white",
                margin: 0,
                letterSpacing: "-0.02em",
              }}
            >
              Complete Your <span className="gradient-text">Profile</span>
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: "rgba(255, 255, 255, 0.08)",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              color: "rgba(148, 163, 184, 0.8)",
              fontSize: 16,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.2s",
            }}
            title="Close / Skip"
          >
            ✕
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {/* Avatar upload section */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 20,
              background: "rgba(255, 255, 255, 0.03)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: 16,
              padding: "16px 20px",
            }}
          >
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: "50%",
                background: formData.avatar_url
                  ? `url(${formData.avatar_url}) center/cover`
                  : "linear-gradient(135deg, #7c3aed, #06b6d4)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 24,
                fontWeight: 800,
                color: "white",
                flexShrink: 0,
                boxShadow: "0 0 24px rgba(124, 58, 237, 0.45)",
              }}
            >
              {!formData.avatar_url && getInitials(formData.full_name)}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: "white", marginBottom: 8 }}>
                Profile Photo / Avatar Upload
              </div>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <input
                  className="glass-input"
                  style={{ padding: "7px 12px", fontSize: 12, flex: 1 }}
                  placeholder="Paste Image URL (https://...)"
                  value={formData.avatar_url || ""}
                  onChange={(e) => handleChange("avatar_url", e.target.value)}
                />
                <label
                  className="btn-ghost"
                  style={{
                    padding: "7px 14px",
                    fontSize: 12,
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <span>📷 Upload</span>
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
                            handleChange("avatar_url", String(reader.result));
                          }
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Full Name & Password */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 16,
            }}
          >
            <div>
              <label
                style={{
                  fontSize: 13,
                  color: "rgba(148, 163, 184, 0.9)",
                  display: "block",
                  marginBottom: 6,
                  fontWeight: 600,
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
                value={formData.full_name || ""}
                readOnly
                disabled
              />
            </div>

            <div>
              <label
                style={{
                  fontSize: 13,
                  color: "rgba(148, 163, 184, 0.9)",
                  display: "block",
                  marginBottom: 6,
                  fontWeight: 600,
                }}
              >
                Login Password
              </label>
              <div style={{ position: "relative" }}>
                <input
                  className="glass-input"
                  type={showPassword ? "text" : "password"}
                  style={{
                    background: "rgba(255, 255, 255, 0.04)",
                    color: "rgba(255, 255, 255, 0.9)",
                    width: "100%",
                    paddingRight: 40,
                  }}
                  value={formData.password_hash || "••••••••••••"}
                  onChange={(e) => handleChange("password_hash", e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: 10,
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    color: "rgba(148, 163, 184, 0.8)",
                    cursor: "pointer",
                    fontSize: 14,
                    padding: 4,
                  }}
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>
          </div>

          {/* Section: Professional Details & Contact Links */}
          <div>
            <div
              style={{
                fontSize: 14,
                fontWeight: 700,
                color: "#06b6d4",
                marginBottom: 14,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <span>💼</span> Professional Details & Contact Info
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {/* Professional Title & Phone Number */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 16,
                }}
              >
                <div>
                  <label
                    style={{
                      fontSize: 13,
                      color: "rgba(148, 163, 184, 0.9)",
                      display: "block",
                      marginBottom: 6,
                      fontWeight: 600,
                    }}
                  >
                    Professional Title *
                  </label>
                  <input
                    className="glass-input"
                    value={formData.professional_title || ""}
                    onChange={(e) =>
                      handleChange("professional_title", e.target.value)
                    }
                    placeholder="e.g. Senior Frontend Engineer / Data Analyst"
                    required
                  />
                </div>

                <div>
                  <label
                    style={{
                      fontSize: 13,
                      color: "rgba(148, 163, 184, 0.9)",
                      display: "block",
                      marginBottom: 6,
                      fontWeight: 600,
                    }}
                  >
                    Phone Number (phone_no)
                  </label>
                  <input
                    className="glass-input"
                    value={formData.phone_no || ""}
                    onChange={(e) => handleChange("phone_no", e.target.value)}
                    placeholder="e.g. +91 98765 43210"
                  />
                </div>
              </div>

              {/* Location & Preferred Language */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 16,
                }}
              >
                <div>
                  <label
                    style={{
                      fontSize: 13,
                      color: "rgba(148, 163, 184, 0.9)",
                      display: "block",
                      marginBottom: 6,
                      fontWeight: 600,
                    }}
                  >
                    Location (location)
                  </label>
                  <input
                    className="glass-input"
                    value={formData.location || ""}
                    onChange={(e) => handleChange("location", e.target.value)}
                    placeholder="e.g. Mumbai, India / Remote"
                  />
                </div>

                <div>
                  <label
                    style={{
                      fontSize: 13,
                      color: "rgba(148, 163, 184, 0.9)",
                      display: "block",
                      marginBottom: 6,
                      fontWeight: 600,
                    }}
                  >
                    Select Language
                  </label>
                  <select
                    className="glass-select"
                    value={formData.language || "en"}
                    onChange={(e) => handleChange("language", e.target.value)}
                  >
                    <option value="en">English (US)</option>
                    <option value="hi">Hindi (हिंदी)</option>
                    <option value="mr">Marathi (मराठी)</option>
                    <option value="de">Deutsch</option>
                    <option value="fr">Français</option>
                    <option value="es">Español</option>
                  </select>
                </div>
              </div>

              {/* Portfolio URL, GitHub & LinkedIn Links */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gap: 16,
                }}
              >
                <div>
                  <label
                    style={{
                      fontSize: 13,
                      color: "rgba(148, 163, 184, 0.9)",
                      display: "block",
                      marginBottom: 6,
                      fontWeight: 600,
                    }}
                  >
                    Portfolio URL (portfolio_url)
                  </label>
                  <input
                    className="glass-input"
                    value={formData.portfolio_url || ""}
                    onChange={(e) =>
                      handleChange("portfolio_url", e.target.value)
                    }
                    placeholder="https://yourportfolio.com"
                  />
                </div>

                <div>
                  <label
                    style={{
                      fontSize: 13,
                      color: "rgba(148, 163, 184, 0.9)",
                      display: "block",
                      marginBottom: 6,
                      fontWeight: 600,
                    }}
                  >
                    GitHub Profile (github)
                  </label>
                  <input
                    className="glass-input"
                    value={formData.github || ""}
                    onChange={(e) => handleChange("github", e.target.value)}
                    placeholder="https://github.com/username"
                  />
                </div>

                <div>
                  <label
                    style={{
                      fontSize: 13,
                      color: "rgba(148, 163, 184, 0.9)",
                      display: "block",
                      marginBottom: 6,
                      fontWeight: 600,
                    }}
                  >
                    LinkedIn Profile (linkedin)
                  </label>
                  <input
                    className="glass-input"
                    value={formData.linkedin || ""}
                    onChange={(e) => handleChange("linkedin", e.target.value)}
                    placeholder="https://linkedin.com/in/username"
                  />
                </div>
              </div>

              {/* Bio / Candidate Summary */}
              <div>
                <label
                  style={{
                    fontSize: 13,
                    color: "rgba(148, 163, 184, 0.9)",
                    display: "block",
                    marginBottom: 6,
                    fontWeight: 600,
                  }}
                >
                  Bio / Candidate Summary
                </label>
                <textarea
                  className="glass-textarea"
                  rows={2}
                  value={formData.bio || ""}
                  onChange={(e) => handleChange("bio", e.target.value)}
                  placeholder="Tell us about your technical skills, experience, or career goals..."
                />
              </div>
            </div>
          </div>

          {/* Section: Education Degree (from education_degree table) */}
          <div
            style={{
              background: "rgba(124, 58, 237, 0.05)",
              border: "1px solid rgba(124, 58, 237, 0.2)",
              borderRadius: 16,
              padding: "18px 20px",
            }}
          >
            <div
              style={{
                fontSize: 14,
                fontWeight: 700,
                color: "#a78bfa",
                marginBottom: 16,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span>🎓</span> Education & Degree Qualification (education_degree)
              </div>
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
                  <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: 14,
                      }}
                    >
                      <div>
                        <label
                          style={{
                            fontSize: 12,
                            color: "rgba(148, 163, 184, 0.9)",
                            display: "block",
                            marginBottom: 4,
                            fontWeight: 600,
                          }}
                        >
                          Degree Name {educationList.length > 1 ? `#${index + 1}` : ""}
                        </label>
                        <input
                          className="glass-input"
                          value={edu.degree || ""}
                          onChange={(e) => {
                            handleEducationChange(index, "degree", e.target.value);
                            if (index === 0) handleChange("degree", e.target.value);
                          }}
                          placeholder="e.g. Bachelor of Technology (B.Tech)"
                        />
                      </div>

                      <div>
                        <label
                          style={{
                            fontSize: 12,
                            color: "rgba(148, 163, 184, 0.9)",
                            display: "block",
                            marginBottom: 4,
                            fontWeight: 600,
                          }}
                        >
                          Field of Study
                        </label>
                        <input
                          className="glass-input"
                          value={edu.field_of_study || ""}
                          onChange={(e) => {
                            handleEducationChange(index, "field_of_study", e.target.value);
                            if (index === 0) handleChange("field_of_study", e.target.value);
                          }}
                          placeholder="e.g. Computer Science / Data Analytics"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        style={{
                          fontSize: 12,
                          color: "rgba(148, 163, 184, 0.9)",
                          display: "block",
                          marginBottom: 4,
                          fontWeight: 600,
                        }}
                      >
                        Institution / University Name
                      </label>
                      <input
                        className="glass-input"
                        value={edu.institution || ""}
                        onChange={(e) => {
                          handleEducationChange(index, "institution", e.target.value);
                          if (index === 0) handleChange("institution", e.target.value);
                        }}
                        placeholder="e.g. IIT Bombay / University of Mumbai"
                      />
                    </div>

                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: 14,
                      }}
                    >
                      <div>
                        <label
                          style={{
                            fontSize: 12,
                            color: "rgba(148, 163, 184, 0.9)",
                            display: "block",
                            marginBottom: 4,
                            fontWeight: 600,
                          }}
                        >
                          Start Year
                        </label>
                        <input
                          className="glass-input"
                          type="number"
                          value={edu.start_year || ""}
                          onChange={(e) => {
                            handleEducationChange(index, "start_year", e.target.value);
                            if (index === 0) handleChange("start_year", e.target.value);
                          }}
                          placeholder="e.g. 2019"
                        />
                      </div>

                      <div>
                        <label
                          style={{
                            fontSize: 12,
                            color: "rgba(148, 163, 184, 0.9)",
                            display: "block",
                            marginBottom: 4,
                            fontWeight: 600,
                          }}
                        >
                          End Year
                        </label>
                        <input
                          className="glass-input"
                          type="number"
                          value={edu.end_year || ""}
                          onChange={(e) => {
                            handleEducationChange(index, "end_year", e.target.value);
                            if (index === 0) handleChange("end_year", e.target.value);
                          }}
                          placeholder="e.g. 2023"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div
            style={{
              marginTop: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
              borderTop: "1px solid rgba(255, 255, 255, 0.08)",
              paddingTop: 18,
            }}
          >
            <button
              type="button"
              className="btn-ghost"
              onClick={onClose}
              style={{ padding: "10px 20px", fontSize: 13 }}
            >
              Skip for Now
            </button>

            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              {showSuccess && (
                <div
                  className="fade-in"
                  style={{
                    color: "#10b981",
                    fontSize: 13,
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  ✓ Profile Saved Successfully!
                </div>
              )}

              <button
                type="submit"
                className="btn-primary"
                disabled={isSaving}
                style={{
                  padding: "11px 26px",
                  fontSize: 14,
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                {isSaving ? (
                  <>
                    <span
                      style={{
                        display: "inline-block",
                        width: 16,
                        height: 16,
                        border: "2px solid rgba(255,255,255,0.3)",
                        borderTopColor: "white",
                        borderRadius: "50%",
                        animation: "spin-slow 0.8s linear infinite",
                      }}
                    />
                    Saving Profile...
                  </>
                ) : (
                  "Save Profile Information →"
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
