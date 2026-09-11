import React, { useState, useEffect } from "react";
import { UserProfile, SupportTicket } from "../types";
import {
  getStoredTickets,
  createNewTicket,
} from "../services/supportTickets";

interface UserSupportModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
}

export default function UserSupportModal({
  isOpen,
  onClose,
  userProfile,
}: UserSupportModalProps) {
  const [activeTab, setActiveTab] = useState<"raise" | "history">("raise");
  const [category, setCategory] = useState<SupportTicket["category"]>("Technical Issue");
  const [priority, setPriority] = useState<SupportTicket["priority"]>("Medium");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [tickets, setTickets] = useState<SupportTicket[]>([]);

  // Load candidate's tickets
  const loadUserTickets = () => {
    const all = getStoredTickets();
    const myTickets = all.filter(
      (t) =>
        t.userId === userProfile.id ||
        t.userEmail.toLowerCase() === userProfile.email.toLowerCase()
    );
    setTickets(myTickets);
  };

  useEffect(() => {
    if (isOpen) {
      loadUserTickets();
      setSuccessMsg("");
    }
  }, [isOpen, userProfile.id, userProfile.email]);

  useEffect(() => {
    const handleUpdate = () => loadUserTickets();
    window.addEventListener("support_tickets_updated", handleUpdate);
    return () => window.removeEventListener("support_tickets_updated", handleUpdate);
  }, []);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !description.trim()) return;

    setSubmitting(true);
    setTimeout(() => {
      createNewTicket(
        {
          id: userProfile.id,
          name: userProfile.full_name,
          email: userProfile.email,
        },
        {
          category,
          subject: subject.trim(),
          description: description.trim(),
          priority,
        }
      );

      setSubmitting(false);
      setSuccessMsg("Your query has been submitted successfully! Support team will respond shortly.");
      setSubject("");
      setDescription("");
      loadUserTickets();

      // Switch to history tab after 1.2 sec
      setTimeout(() => {
        setActiveTab("history");
        setSuccessMsg("");
      }, 1200);
    }, 400);
  };

  const getStatusBadge = (status: SupportTicket["status"]) => {
    switch (status) {
      case "Open":
        return { bg: "rgba(245, 158, 11, 0.15)", border: "rgba(245, 158, 11, 0.3)", color: "#fbbf24", label: "Open" };
      case "In Progress":
        return { bg: "rgba(6, 182, 212, 0.15)", border: "rgba(6, 182, 212, 0.3)", color: "#38bdf8", label: "In Progress" };
      case "Resolved":
        return { bg: "rgba(16, 185, 129, 0.15)", border: "rgba(16, 185, 129, 0.3)", color: "#34d399", label: "✓ Resolved" };
      case "Closed":
        return { bg: "rgba(148, 163, 184, 0.15)", border: "rgba(148, 163, 184, 0.3)", color: "#94a3b8", label: "Closed" };
    }
  };

  const getPriorityBadge = (p: SupportTicket["priority"]) => {
    switch (p) {
      case "Urgent":
        return { color: "#ef4444", bg: "rgba(239, 68, 68, 0.15)" };
      case "High":
        return { color: "#f97316", bg: "rgba(249, 115, 22, 0.15)" };
      case "Medium":
        return { color: "#eab308", bg: "rgba(234, 179, 8, 0.15)" };
      case "Low":
        return { color: "#10b981", bg: "rgba(16, 185, 129, 0.15)" };
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(3, 7, 18, 0.75)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        padding: "16px",
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 640,
          maxHeight: "90vh",
          background: "linear-gradient(145deg, rgba(17, 24, 39, 0.95), rgba(10, 10, 26, 0.98))",
          border: "1px solid rgba(124, 58, 237, 0.3)",
          borderRadius: 20,
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 30px rgba(124, 58, 237, 0.2)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          color: "#f8fafc",
          animation: "modalFadeIn 0.25s ease-out",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "20px 24px",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "rgba(255,255,255,0.02)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: 12,
                background: "linear-gradient(135deg, #7c3aed, #06b6d4)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 20,
                boxShadow: "0 0 15px rgba(124, 58, 237, 0.4)",
              }}
            >
              🎧
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "white" }}>
                Help & Support Center
              </h3>
              <p style={{ margin: 0, fontSize: 12, color: "rgba(148,163,184,0.7)" }}>
                Submit queries or report issues directly to our AI JobPrep support team
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              border: "1px solid rgba(255,255,255,0.1)",
              background: "rgba(255,255,255,0.05)",
              color: "#94a3b8",
              cursor: "pointer",
              fontSize: 16,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.2s",
            }}
          >
            ✕
          </button>
        </div>

        {/* Navigation Tabs */}
        <div
          style={{
            display: "flex",
            padding: "8px 24px",
            gap: 12,
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            background: "rgba(0,0,0,0.2)",
          }}
        >
          <button
            onClick={() => setActiveTab("raise")}
            style={{
              padding: "8px 16px",
              borderRadius: 10,
              fontSize: 13,
              fontWeight: 600,
              border: "none",
              cursor: "pointer",
              transition: "all 0.2s",
              background: activeTab === "raise" ? "linear-gradient(135deg, #7c3aed, #06b6d4)" : "transparent",
              color: activeTab === "raise" ? "#ffffff" : "#94a3b8",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <span>➕ Raise New Query</span>
          </button>

          <button
            onClick={() => setActiveTab("history")}
            style={{
              padding: "8px 16px",
              borderRadius: 10,
              fontSize: 13,
              fontWeight: 600,
              border: "none",
              cursor: "pointer",
              transition: "all 0.2s",
              background: activeTab === "history" ? "linear-gradient(135deg, #7c3aed, #06b6d4)" : "transparent",
              color: activeTab === "history" ? "#ffffff" : "#94a3b8",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <span>🎫 My Submitted Queries</span>
            {tickets.length > 0 && (
              <span
                style={{
                  fontSize: 11,
                  padding: "2px 7px",
                  borderRadius: 20,
                  background: activeTab === "history" ? "rgba(255,255,255,0.25)" : "rgba(124, 58, 237, 0.3)",
                  color: "#white",
                }}
              >
                {tickets.length}
              </span>
            )}
          </button>
        </div>

        {/* Tab Body */}
        <div style={{ padding: 24, overflowY: "auto", flex: 1 }}>
          {successMsg && (
            <div
              style={{
                marginBottom: 20,
                padding: "12px 16px",
                borderRadius: 12,
                background: "rgba(16, 185, 129, 0.15)",
                border: "1px solid rgba(16, 185, 129, 0.4)",
                color: "#34d399",
                fontSize: 13,
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <span>✓</span>
              <span>{successMsg}</span>
            </div>
          )}

          {activeTab === "raise" ? (
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              {/* Category & Priority Selectors */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#cbd5e1", marginBottom: 6 }}>
                    Issue Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      borderRadius: 10,
                      background: "rgba(255, 255, 255, 0.05)",
                      border: "1px solid rgba(255, 255, 255, 0.15)",
                      color: "white",
                      fontSize: 13,
                      outline: "none",
                    }}
                  >
                    <option value="Technical Issue" style={{ background: "#0f172a", color: "white" }}>Technical Issue</option>
                    <option value="Billing & Payment" style={{ background: "#0f172a", color: "white" }}>Billing & Payment</option>
                    <option value="Resume AI" style={{ background: "#0f172a", color: "white" }}>Resume AI / ATS</option>
                    <option value="Mock Interview" style={{ background: "#0f172a", color: "white" }}>Mock Interview</option>
                    <option value="Account & Other" style={{ background: "#0f172a", color: "white" }}>Account & Other</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#cbd5e1", marginBottom: 6 }}>
                    Priority Level
                  </label>
                  <div style={{ display: "flex", gap: 6 }}>
                    {(["Low", "Medium", "High", "Urgent"] as const).map((p) => {
                      const isSelected = priority === p;
                      const badge = getPriorityBadge(p);
                      return (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setPriority(p)}
                          style={{
                            flex: 1,
                            padding: "8px 0",
                            borderRadius: 8,
                            fontSize: 11,
                            fontWeight: 700,
                            border: isSelected ? `1.5px solid ${badge.color}` : "1px solid rgba(255,255,255,0.1)",
                            background: isSelected ? badge.bg : "rgba(255,255,255,0.03)",
                            color: isSelected ? badge.color : "#94a3b8",
                            cursor: "pointer",
                            transition: "all 0.2s",
                          }}
                        >
                          {p}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Subject Input */}
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#cbd5e1", marginBottom: 6 }}>
                  Subject / Summary
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ATS scan stuck at 90% or Refund query"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: 10,
                    background: "rgba(255, 255, 255, 0.05)",
                    border: "1px solid rgba(255, 255, 255, 0.15)",
                    color: "white",
                    fontSize: 13,
                    outline: "none",
                  }}
                />
              </div>

              {/* Description Input */}
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#cbd5e1", marginBottom: 6 }}>
                  Detailed Description of Problem
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Describe what happened, error messages, or details of your request..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "12px 14px",
                    borderRadius: 10,
                    background: "rgba(255, 255, 255, 0.05)",
                    border: "1px solid rgba(255, 255, 255, 0.15)",
                    color: "white",
                    fontSize: 13,
                    outline: "none",
                    resize: "vertical",
                    fontFamily: "inherit",
                  }}
                />
              </div>

              {/* User Auto Info */}
              <div
                style={{
                  padding: "10px 14px",
                  borderRadius: 10,
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  fontSize: 12,
                  color: "#94a3b8",
                }}
              >
                <span>Submitting as: <strong style={{ color: "white" }}>{userProfile.full_name}</strong> ({userProfile.email})</span>
                <span style={{ color: "#06b6d4", fontSize: 11 }}>● Priority SLA ~ 2 hrs</span>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                style={{
                  padding: "12px 20px",
                  borderRadius: 12,
                  background: "linear-gradient(135deg, #7c3aed, #06b6d4)",
                  border: "none",
                  color: "white",
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: submitting ? "not-allowed" : "pointer",
                  boxShadow: "0 4px 15px rgba(124, 58, 237, 0.4)",
                  transition: "all 0.2s",
                }}
              >
                {submitting ? "Submitting Ticket..." : "🚀 Submit Support Ticket"}
              </button>
            </form>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {tickets.length === 0 ? (
                <div
                  style={{
                    textAlign: "center",
                    padding: "40px 20px",
                    color: "#94a3b8",
                  }}
                >
                  <div style={{ fontSize: 40, marginBottom: 12 }}>📬</div>
                  <h4 style={{ margin: "0 0 6px", color: "white", fontSize: 16 }}>No support queries yet</h4>
                  <p style={{ margin: 0, fontSize: 13 }}>
                    If you run into any issue or have questions, click "Raise New Query" above!
                  </p>
                </div>
              ) : (
                tickets.map((t) => {
                  const badge = getStatusBadge(t.status);
                  const priorityInfo = getPriorityBadge(t.priority);
                  return (
                    <div
                      key={t.id}
                      style={{
                        padding: 18,
                        borderRadius: 14,
                        background: "rgba(255, 255, 255, 0.03)",
                        border: "1px solid rgba(255, 255, 255, 0.08)",
                        display: "flex",
                        flexDirection: "column",
                        gap: 12,
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                        <div>
                          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                            <span style={{ fontSize: 11, fontFamily: "JetBrains Mono", color: "#a78bfa", fontWeight: 700 }}>
                              {t.id}
                            </span>
                            <span
                              style={{
                                fontSize: 10,
                                padding: "2px 8px",
                                borderRadius: 4,
                                background: priorityInfo.bg,
                                color: priorityInfo.color,
                                fontWeight: 700,
                              }}
                            >
                              {t.priority} Priority
                            </span>
                            <span style={{ fontSize: 10, color: "#64748b" }}>
                              • {t.category}
                            </span>
                          </div>
                          <h4 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "white" }}>
                            {t.subject}
                          </h4>
                        </div>

                        <span
                          style={{
                            padding: "4px 10px",
                            borderRadius: 20,
                            fontSize: 12,
                            fontWeight: 700,
                            background: badge.bg,
                            border: `1px solid ${badge.border}`,
                            color: badge.color,
                            whiteSpace: "nowrap",
                          }}
                        >
                          {badge.label}
                        </span>
                      </div>

                      <p style={{ margin: 0, fontSize: 13, color: "#cbd5e1", lineHeight: 1.5, background: "rgba(0,0,0,0.2)", padding: 10, borderRadius: 8 }}>
                        {t.description}
                      </p>

                      {/* Admin Response Box if available */}
                      {t.adminResponse && (
                        <div
                          style={{
                            marginTop: 4,
                            padding: 12,
                            borderRadius: 10,
                            background: "rgba(124, 58, 237, 0.12)",
                            border: "1px solid rgba(124, 58, 237, 0.3)",
                            display: "flex",
                            flexDirection: "column",
                            gap: 6,
                          }}
                        >
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <span style={{ fontSize: 11, fontWeight: 700, color: "#a78bfa", display: "flex", alignItems: "center", gap: 6 }}>
                              <span>🛡</span> Official Admin Response
                            </span>
                            {t.responseAt && (
                              <span style={{ fontSize: 10, color: "rgba(167,139,250,0.7)" }}>
                                {new Date(t.responseAt).toLocaleDateString()} {new Date(t.responseAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            )}
                          </div>
                          <p style={{ margin: 0, fontSize: 13, color: "#f1f5f9", lineHeight: 1.5, fontWeight: 500 }}>
                            {t.adminResponse}
                          </p>
                        </div>
                      )}

                      <div style={{ fontSize: 11, color: "#64748b", display: "flex", justifyContent: "space-between", paddingTop: 4 }}>
                        <span>Submitted: {new Date(t.createdAt).toLocaleDateString()}</span>
                        <span>Updated: {new Date(t.updatedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
