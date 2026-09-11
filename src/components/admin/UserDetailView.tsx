import React, { useState, useEffect } from "react";
import { AdminUser, SupportTicket } from "../../types";
import { getStoredTickets, updateTicketStatus } from "../../services/supportTickets";

interface UserDetailViewProps {
  user: AdminUser;
  onBack: () => void;
  onSuspend: (user: AdminUser) => void;
  onChangePlan: (user: AdminUser, newPlan: string) => void;
  onIssueRefund: (user: AdminUser, amount: string) => void;
  onResetPassword: (user: AdminUser) => void;
}

export default function UserDetailView({
  user,
  onBack,
  onSuspend,
  onChangePlan,
  onIssueRefund,
  onResetPassword,
}: UserDetailViewProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "payments" | "activity" | "tickets">("overview");
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [selectedNewPlan, setSelectedNewPlan] = useState(user.plan);
  const [refundAmount, setRefundAmount] = useState(user.spent.replace(/[^0-9]/g, "") || "499");

  // Load candidate's real tickets
  const [userTickets, setUserTickets] = useState<SupportTicket[]>([]);

  const reloadTickets = () => {
    const all = getStoredTickets();
    const filtered = all.filter(
      (t) =>
        t.userId === user.id ||
        t.userEmail.toLowerCase() === user.email.toLowerCase()
    );
    setUserTickets(filtered);
  };

  useEffect(() => {
    reloadTickets();
    const handleUpdate = () => reloadTickets();
    window.addEventListener("support_tickets_updated", handleUpdate);
    return () => window.removeEventListener("support_tickets_updated", handleUpdate);
  }, [user.id, user.email]);

  const handleMarkResolved = (tId: string) => {
    updateTicketStatus(tId, "Resolved", "Marked as resolved by Admin from Candidate Detail View");
    reloadTickets();
  };

  // Mock sub data
  const paymentHistory = [
    { id: "inv_9041", date: user.joined, amount: user.spent, plan: user.plan, status: "Paid", method: "Razorpay / UPI" },
    { id: "inv_8102", date: "2026-06-15", amount: "₹1,299", plan: "3-Month Sprint", status: "Paid", method: "Razorpay / Cards" },
  ];

  const candidateActivityLog = [
    { title: "Completed AI Mock Interview", detail: "Senior Frontend Engineer Simulation (Score: 84/100)", time: "2 hours ago" },
    { title: "ATS Resume Analysis Executed", detail: "Scanned resume against Tech Lead Job Description (Score: 91%)", time: "Yesterday at 4:15 PM" },
    { title: "Plan Upgraded", detail: `Subscribed to ${user.plan}`, time: user.joined },
    { title: "Account Created", detail: "Candidate registered via Email Authentication", time: user.joined },
  ];

  const supportTickets = [
    { id: "TICK-402", subject: "Questions regarding ATS score calculation", status: "Closed", date: "2026-08-14" },
    { id: "TICK-311", subject: "Audio recording permission on Firefox browser", status: "Resolved", date: "2026-07-02" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Top Bar with Back Button & Action Controls */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <button
          onClick={onBack}
          style={{
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.12)",
            color: "white",
            padding: "6px 14px",
            borderRadius: 8,
            cursor: "pointer",
            fontSize: 13,
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          ← Back to Candidates Directory
        </button>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button
            onClick={() => onResetPassword(user)}
            style={{
              padding: "6px 12px",
              borderRadius: 8,
              fontSize: 12,
              fontWeight: 600,
              background: "rgba(6, 182, 212, 0.15)",
              border: "1px solid rgba(6, 182, 212, 0.3)",
              color: "#67e8f9",
              cursor: "pointer",
            }}
          >
            🔑 Reset Password
          </button>
          <button
            onClick={() => setShowPlanModal(true)}
            style={{
              padding: "6px 12px",
              borderRadius: 8,
              fontSize: 12,
              fontWeight: 600,
              background: "rgba(124, 58, 237, 0.2)",
              border: "1px solid rgba(124, 58, 237, 0.4)",
              color: "#a78bfa",
              cursor: "pointer",
            }}
          >
            💳 Change Plan
          </button>
          <button
            onClick={() => setShowRefundModal(true)}
            style={{
              padding: "6px 12px",
              borderRadius: 8,
              fontSize: 12,
              fontWeight: 600,
              background: "rgba(245, 158, 11, 0.15)",
              border: "1px solid rgba(245, 158, 11, 0.3)",
              color: "#fbbf24",
              cursor: "pointer",
            }}
          >
            ↩ Issue Refund
          </button>
          <button
            onClick={() => onSuspend(user)}
            style={{
              padding: "6px 12px",
              borderRadius: 8,
              fontSize: 12,
              fontWeight: 600,
              background: user.status === "Suspended" ? "rgba(16, 185, 129, 0.15)" : "rgba(239, 68, 68, 0.15)",
              border: user.status === "Suspended" ? "1px solid rgba(16, 185, 129, 0.3)" : "1px solid rgba(239, 68, 68, 0.3)",
              color: user.status === "Suspended" ? "#34d399" : "#f87171",
              cursor: "pointer",
            }}
          >
            {user.status === "Suspended" ? "Unsuspend User" : "🚫 Suspend User"}
          </button>
        </div>
      </div>

      {/* User Header Profile Card */}
      <div className="glass-card" style={{ padding: 24, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #ec4899, #7c3aed)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 20,
              fontWeight: 800,
              color: "white",
              boxShadow: "0 0 16px rgba(236, 72, 153, 0.4)",
            }}
          >
            {user.name.slice(0, 2).toUpperCase()}
          </div>

          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "white" }}>{user.name}</h2>
              <span
                style={{
                  padding: "2px 10px",
                  borderRadius: 20,
                  fontSize: 11,
                  fontWeight: 700,
                  background: user.status === "Active" ? "rgba(16, 185, 129, 0.15)" : "rgba(239, 68, 68, 0.15)",
                  color: user.status === "Active" ? "#34d399" : "#f87171",
                  border: user.status === "Active" ? "1px solid rgba(16,185,129,0.3)" : "1px solid rgba(239,68,68,0.3)",
                }}
              >
                ● {user.status}
              </span>
            </div>

            <div style={{ display: "flex", gap: 16, marginTop: 4, fontSize: 13, color: "#94a3b8" }}>
              <span>✉ {user.email}</span>
              <span>•</span>
              <span style={{ fontFamily: "JetBrains Mono" }}>ID: {user.id}</span>
              <span>•</span>
              <span>📅 Joined: {user.joined}</span>
            </div>
          </div>
        </div>

        {/* Quick Stat Pill Highlights */}
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          <div style={{ background: "rgba(255,255,255,0.03)", padding: "10px 16px", borderRadius: 10, textAlign: "center" }}>
            <div style={{ fontSize: 10, color: "#94a3b8", textTransform: "uppercase", fontFamily: "JetBrains Mono" }}>Current Plan</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#ec4899", marginTop: 2 }}>{user.plan}</div>
          </div>
          <div style={{ background: "rgba(255,255,255,0.03)", padding: "10px 16px", borderRadius: 10, textAlign: "center", border: "1px solid rgba(245, 158, 11, 0.2)" }}>
            <div style={{ fontSize: 10, color: "#f59e0b", textTransform: "uppercase", fontFamily: "JetBrains Mono", fontWeight: 700 }}>📅 Plan Expiry Date</div>
            <div style={{ fontSize: 14, fontWeight: 800, color: "#fde047", marginTop: 2 }}>{user.planExpiry || "2027-02-12"}</div>
          </div>
          <div style={{ background: "rgba(255,255,255,0.03)", padding: "10px 16px", borderRadius: 10, textAlign: "center" }}>
            <div style={{ fontSize: 10, color: "#94a3b8", textTransform: "uppercase", fontFamily: "JetBrains Mono" }}>Total Spent</div>
            <div style={{ fontSize: 14, fontWeight: 800, color: "#10b981", marginTop: 2 }}>{user.spent}</div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div style={{ display: "flex", gap: 8, borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: 8 }}>
        {[
          { id: "overview", label: "Overview" },
          { id: "payments", label: "Payment History" },
          { id: "activity", label: "Candidate Activity Log" },
          { id: "tickets", label: "Support Tickets" },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                padding: "8px 16px",
                borderRadius: 8,
                fontSize: 13,
                fontWeight: isActive ? 700 : 500,
                border: "none",
                background: isActive ? "rgba(236, 72, 153, 0.2)" : "transparent",
                color: isActive ? "#f472b6" : "#94a3b8",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT */}

      {/* 1. OVERVIEW TAB */}
      {activeTab === "overview" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
          <div className="glass-card" style={{ padding: 22 }}>
            <h3 style={{ margin: "0 0 14px", fontSize: 16, color: "white" }}>Candidate Details & Metadata</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: 13, color: "#cbd5e1" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#94a3b8" }}>Full Name:</span>
                <span style={{ fontWeight: 600, color: "white" }}>{user.name}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#94a3b8" }}>Email Address:</span>
                <span>{user.email}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#94a3b8" }}>Phone Number:</span>
                <span>{user.phone || "+91 98201 44102"}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#94a3b8" }}>Location / Region:</span>
                <span>{user.location || "Mumbai, India"}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#94a3b8" }}>Account Status:</span>
                <span style={{ color: user.status === "Active" ? "#34d399" : "#f87171", fontWeight: 700 }}>{user.status}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#94a3b8" }}>Plan Expiry Date:</span>
                <span style={{ color: "#fde047", fontWeight: 700, fontFamily: "JetBrains Mono" }}>{user.planExpiry || "2027-02-12"}</span>
              </div>
            </div>
          </div>

          <div className="glass-card" style={{ padding: 22 }}>
            <h3 style={{ margin: "0 0 14px", fontSize: 16, color: "white" }}>Usage & AI Quotas</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, fontSize: 13 }}>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", color: "#cbd5e1", marginBottom: 4 }}>
                  <span>AI Mock Interviews Completed:</span>
                  <span style={{ fontWeight: 700, color: "#ec4899" }}>{user.mockCount || 14} interviews</span>
                </div>
                <div className="progress-bar" style={{ height: 6 }}>
                  <div className="progress-fill" style={{ width: "70%" }} />
                </div>
              </div>

              <div>
                <div style={{ display: "flex", justifyContent: "space-between", color: "#cbd5e1", marginBottom: 4 }}>
                  <span>ATS Resume Scans Run:</span>
                  <span style={{ fontWeight: 700, color: "#06b6d4" }}>{user.atsCount || 28} scans</span>
                </div>
                <div className="progress-bar" style={{ height: 6 }}>
                  <div className="progress-fill" style={{ width: "85%", background: "linear-gradient(90deg, #06b6d4, #3b82f6)" }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. PAYMENT HISTORY TAB */}
      {activeTab === "payments" && (
        <div className="glass-card" style={{ padding: 22 }}>
          <h3 style={{ margin: "0 0 14px", fontSize: 16, color: "white" }}>Transactions & Invoices</h3>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, textAlign: "left" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.1)", color: "#94a3b8" }}>
                <th style={{ padding: 10 }}>Invoice ID</th>
                <th style={{ padding: 10 }}>Date</th>
                <th style={{ padding: 10 }}>Plan</th>
                <th style={{ padding: 10 }}>Payment Mode</th>
                <th style={{ padding: 10 }}>Amount</th>
                <th style={{ padding: 10 }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {paymentHistory.map((item) => (
                <tr key={item.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                  <td style={{ padding: 10, fontFamily: "JetBrains Mono", color: "#94a3b8" }}>{item.id}</td>
                  <td style={{ padding: 10, color: "#cbd5e1" }}>{item.date}</td>
                  <td style={{ padding: 10, color: "#ec4899", fontWeight: 600 }}>{item.plan}</td>
                  <td style={{ padding: 10, color: "#94a3b8" }}>{item.method}</td>
                  <td style={{ padding: 10, fontWeight: 700, color: "#10b981" }}>{item.amount}</td>
                  <td style={{ padding: 10 }}>
                    <span style={{ padding: "2px 8px", borderRadius: 4, fontSize: 11, background: "rgba(16,185,129,0.15)", color: "#34d399" }}>
                      ● {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 3. ACTIVITY LOG TAB */}
      {activeTab === "activity" && (
        <div className="glass-card" style={{ padding: 22 }}>
          <h3 style={{ margin: "0 0 14px", fontSize: 16, color: "white" }}>Candidate Action History</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {candidateActivityLog.map((act, idx) => (
              <div key={idx} style={{ background: "rgba(255,255,255,0.03)", padding: 12, borderRadius: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontWeight: 700, color: "white", fontSize: 13 }}>{act.title}</div>
                  <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>{act.detail}</div>
                </div>
                <span style={{ fontSize: 11, color: "#64748b", fontFamily: "JetBrains Mono" }}>{act.time}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. SUPPORT TICKETS TAB */}
      {activeTab === "tickets" && (
        <div className="glass-card" style={{ padding: 22 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <h3 style={{ margin: 0, fontSize: 16, color: "white" }}>Support Queries & Tickets ({userTickets.length})</h3>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {userTickets.length === 0 ? (
              <div style={{ padding: 20, textAlign: "center", color: "#94a3b8", fontSize: 13 }}>
                No support tickets filed by {user.name} yet.
              </div>
            ) : (
              userTickets.map((t) => (
                <div
                  key={t.id}
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    padding: 14,
                    borderRadius: 10,
                    border: "1px solid rgba(255,255,255,0.08)",
                    display: "flex",
                    flexDirection: "column",
                    gap: 10,
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 11, fontFamily: "JetBrains Mono", color: "#ec4899", fontWeight: 700 }}>
                          {t.id}
                        </span>
                        <span style={{ fontSize: 11, padding: "2px 6px", borderRadius: 4, background: "rgba(255,255,255,0.06)", color: "#cbd5e1" }}>
                          {t.category}
                        </span>
                      </div>
                      <div style={{ fontWeight: 700, color: "white", fontSize: 14, marginTop: 4 }}>
                        {t.subject}
                      </div>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span
                        style={{
                          fontSize: 11,
                          padding: "3px 10px",
                          borderRadius: 20,
                          fontWeight: 700,
                          background: t.status === "Resolved" ? "rgba(16,185,129,0.15)" : t.status === "In Progress" ? "rgba(6,182,212,0.15)" : "rgba(245,158,11,0.15)",
                          color: t.status === "Resolved" ? "#34d399" : t.status === "In Progress" ? "#38bdf8" : "#fbbf24",
                        }}
                      >
                        {t.status === "Resolved" ? "✓ Resolved" : t.status}
                      </span>

                      {t.status !== "Resolved" && (
                        <button
                          onClick={() => handleMarkResolved(t.id)}
                          style={{
                            padding: "4px 10px",
                            borderRadius: 6,
                            fontSize: 11,
                            fontWeight: 700,
                            background: "rgba(16, 185, 129, 0.2)",
                            border: "1px solid rgba(16, 185, 129, 0.4)",
                            color: "#34d399",
                            cursor: "pointer",
                          }}
                        >
                          Mark Resolved
                        </button>
                      )}
                    </div>
                  </div>

                  <div style={{ fontSize: 12, color: "#cbd5e1", lineHeight: 1.5, background: "rgba(0,0,0,0.2)", padding: 8, borderRadius: 6 }}>
                    {t.description}
                  </div>

                  {t.adminResponse && (
                    <div style={{ fontSize: 12, color: "#f472b6", background: "rgba(236,72,153,0.1)", padding: 8, borderRadius: 6, border: "1px solid rgba(236,72,153,0.2)" }}>
                      <strong>Admin Reply: </strong>{t.adminResponse}
                    </div>
                  )}

                  <div style={{ fontSize: 10, color: "#64748b" }}>
                    Submitted on {new Date(t.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* CHANGE PLAN MODAL */}
      {showPlanModal && (
        <div style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(5,5,16,0.8)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div className="glass-card" style={{ padding: 24, width: 400, borderRadius: 16, background: "rgba(13,13,35,0.95)" }}>
            <h3 style={{ margin: "0 0 12px", color: "white" }}>Change Candidate Plan</h3>
            <label style={{ fontSize: 12, color: "#94a3b8" }}>Select New Plan for {user.name}:</label>
            <select
              value={selectedNewPlan}
              onChange={(e) => setSelectedNewPlan(e.target.value)}
              style={{ width: "100%", padding: 10, marginTop: 8, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", color: "white", borderRadius: 8 }}
            >
              <option value="Monthly Starter">Monthly Starter (₹499)</option>
              <option value="3-Month Sprint">3-Month Sprint (₹1,299)</option>
              <option value="6-Month Pro Prep">6-Month Pro Prep (₹2,299)</option>
              <option value="1-Year Career Pass">1-Year Career Pass (₹3,999)</option>
              <option value="Super Admin">Super Admin (VIP Access)</option>
            </select>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 18 }}>
              <button onClick={() => setShowPlanModal(false)} className="btn-ghost" style={{ padding: "6px 14px" }}>Cancel</button>
              <button
                onClick={() => {
                  onChangePlan(user, selectedNewPlan);
                  setShowPlanModal(false);
                }}
                className="btn-primary"
                style={{ padding: "6px 16px", background: "linear-gradient(135deg, #ec4899, #7c3aed)" }}
              >
                Update Plan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ISSUE REFUND MODAL */}
      {showRefundModal && (
        <div style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(5,5,16,0.8)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div className="glass-card" style={{ padding: 24, width: 400, borderRadius: 16, background: "rgba(13,13,35,0.95)" }}>
            <h3 style={{ margin: "0 0 12px", color: "white" }}>Issue Refund</h3>
            <label style={{ fontSize: 12, color: "#94a3b8" }}>Refund Amount (₹ INR):</label>
            <input
              type="number"
              value={refundAmount}
              onChange={(e) => setRefundAmount(e.target.value)}
              className="glass-input"
              style={{ marginTop: 8 }}
            />
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 18 }}>
              <button onClick={() => setShowRefundModal(false)} className="btn-ghost" style={{ padding: "6px 14px" }}>Cancel</button>
              <button
                onClick={() => {
                  onIssueRefund(user, `₹${refundAmount}`);
                  setShowRefundModal(false);
                }}
                style={{ padding: "6px 16px", borderRadius: 8, border: "none", background: "linear-gradient(135deg, #f59e0b, #d97706)", color: "white", fontWeight: 700, cursor: "pointer" }}
              >
                Confirm Refund
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
