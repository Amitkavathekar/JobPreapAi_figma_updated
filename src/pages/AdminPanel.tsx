import React, { useState } from "react";
import { AdminScreen, Coupon, ActivityLogItem, AdminUser } from "../types";
import AdminSidebar from "../components/AdminSidebar";

// Import modular sub-components
import PlanModal, { PlanData } from "../components/admin/PlanModal";
import CouponModal from "../components/admin/CouponModal";
import UserDetailView from "../components/admin/UserDetailView";
import ActivityLogScreen from "../components/admin/ActivityLogScreen";
import ConfirmationModal from "../components/admin/ConfirmationModal";
import EmptyState from "../components/admin/EmptyState";
import SupportTicketsScreen from "../components/admin/SupportTicketsScreen";

interface AdminPanelProps {
  onLogout: () => void;
}

const INITIAL_PLANS: PlanData[] = [
  {
    id: "plan-monthly",
    name: "Basic",
    duration: "1 Month",
    months: 1,
    priceINR: 499,
    originalPriceINR: 699,
    mockLimit: "10 Interviews / mo",
    atsLimit: "25 Resume Scans / mo",
    aiCredits: 500,
    status: "Active",
    subscribersCount: 342,
    features: [
      "10 AI Mock Interviews per month",
      "25 ATS Resume Analysis scans",
      "Standard AI Feedback & Score",
      "Basic Access",
      "Email Support",
    ],
  },
  {
    id: "plan-quarterly",
    name: "Plus",
    duration: "3 Months",
    months: 3,
    priceINR: 1299,
    originalPriceINR: 2097,
    badge: "Save 38%",
    mockLimit: "35 Interviews / qtr",
    atsLimit: "75 Resume Scans / qtr",
    aiCredits: 1800,
    status: "Active",
    subscribersCount: 856,
    features: [
      "35 AI Mock Interviews (3 Months)",
      "75 ATS Resume Scans",
      "Deep Detailed AI Audio/Video Feedback",
      "Resume PDF Exporter & Editor",
      "Priority Chat Support",
    ],
  },
  {
    id: "plan-halfyearly",
    name: "Pro",
    duration: "6 Months",
    months: 6,
    priceINR: 2299,
    originalPriceINR: 4194,
    badge: "Most Popular",
    popular: true,
    mockLimit: "Unlimited Mock Interviews",
    atsLimit: "Unlimited Resume Scans",
    aiCredits: 4500,
    status: "Active",
    subscribersCount: 1420,
    features: [
      "Unlimited AI Mock Interviews",
      "Unlimited ATS Scans & Resume Tailoring",
      "Company-Specific Interview Simulations (Google, TCS, Infosys)",
      "Live Speech Speed & Filler Word AI Analysis",
      "Export PDF Reports with Custom Branding",
      "1-on-1 AI Resume Optimization Assistant",
    ],
  },
  {
    id: "plan-annual",
    name: "Elite",
    duration: "1 Year",
    months: 12,
    priceINR: 3999,
    originalPriceINR: 8388,
    badge: "Best Value (Save 52%)",
    mockLimit: "Unlimited + VIP Priority",
    atsLimit: "Unlimited + VIP Priority",
    aiCredits: 10000,
    status: "Active",
    subscribersCount: 680,
    features: [
      "All Pro Plan Features Included",
      "VIP Priority Queue for AI Speech Processing",
      "Unlimited Mock Interviews & Resume Revisions for 365 Days",
      "Job Application Tracker & Referral Assistant",
      "Dedicated Placement & Interview Consultation",
      "Certificate of Job Readiness",
    ],
  },
];

const INITIAL_COUPONS: Coupon[] = [
  {
    id: "cpn_1",
    code: "FESTIVE25",
    discountType: "Percentage",
    discountValue: 25,
    applicablePlans: ["All Plans"],
    usageLimit: 500,
    timesUsed: 412,
    expiryDate: "2026-12-31",
    status: "Active",
  },
  {
    id: "cpn_2",
    code: "STUDENT50",
    discountType: "Percentage",
    discountValue: 50,
    applicablePlans: ["Pro", "Elite"],
    usageLimit: 1000,
    timesUsed: 890,
    expiryDate: "2026-10-15",
    status: "Active",
  },
  {
    id: "cpn_3",
    code: "EARLYBIRD",
    discountType: "Flat Amount",
    discountValue: 300,
    applicablePlans: ["Basic", "Plus"],
    usageLimit: 200,
    timesUsed: 200,
    expiryDate: "2026-08-30",
    status: "Expired",
  },
];

const INITIAL_USERS: AdminUser[] = [
  { id: "usr_101", name: "Rahul Sharma", email: "rahul.s@gmail.com", plan: "Pro", planExpiry: "2027-02-12", status: "Active", joined: "2026-08-12", spent: "₹2,299", phone: "+91 98201 12345", location: "Mumbai, MH", mockCount: 18, atsCount: 32 },
  { id: "usr_102", name: "Priya Patil", email: "priya.patil@outlook.com", plan: "Elite", planExpiry: "2027-07-04", status: "Active", joined: "2026-07-04", spent: "₹3,999", phone: "+91 97110 54321", location: "Pune, MH", mockCount: 42, atsCount: 95 },
  { id: "usr_103", name: "Amit Kavathekar", email: "amit.k@jobprep.ai", plan: "Super Admin", planExpiry: "Lifetime VIP", status: "Active", joined: "2026-05-01", spent: "₹0", phone: "+91 98900 00000", location: "Bangalore, KA", mockCount: 120, atsCount: 200 },
  { id: "usr_104", name: "Sneha Deshmukh", email: "sneha.d@yahoo.com", plan: "Plus", planExpiry: "2026-08-10 (Expired)", status: "Expired", joined: "2026-05-10", spent: "₹1,299", phone: "+91 96500 11223", location: "Nagpur, MH", mockCount: 8, atsCount: 15 },
  { id: "usr_105", name: "Vikram Mehta", email: "v.mehta@techcorp.io", plan: "Basic", planExpiry: "2026-10-01", status: "Active", joined: "2026-09-01", spent: "₹499", phone: "+91 99887 76655", location: "Hyderabad, TS", mockCount: 3, atsCount: 9 },
  { id: "usr_106", name: "Aarti Kulkarni", email: "aarti.k@gmail.com", plan: "Pro", planExpiry: "2027-02-28", status: "Active", joined: "2026-08-28", spent: "₹2,299", phone: "+91 94220 33445", location: "Thane, MH", mockCount: 12, atsCount: 24 },
];

const INITIAL_ACTIVITY_LOGS: ActivityLogItem[] = [
  { id: "log_1", adminName: "Amit Kavathekar", adminRole: "Super Admin", action: "Changed price of Pro Plan to ₹2,299", target: "Pro", type: "Pricing", timestamp: "10 mins ago" },
  { id: "log_2", adminName: "Neha Kulkarni", adminRole: "Support Admin", action: "Issued ₹499 refund to user usr_105", target: "Vikram Mehta (usr_105)", type: "User Action", timestamp: "1 hour ago" },
  { id: "log_3", adminName: "Amit Kavathekar", adminRole: "Super Admin", action: "Created promotional coupon FESTIVE25", target: "FESTIVE25", type: "Coupon", timestamp: "3 hours ago" },
  { id: "log_4", adminName: "Amit Kavathekar", adminRole: "Super Admin", action: "Updated Razorpay & Stripe Gateway API Credentials", target: "Payment Gateways", type: "Settings", timestamp: "2 days ago" },
];

export default function AdminPanel({ onLogout }: AdminPanelProps) {
  const [activeAdminScreen, setActiveAdminScreen] = useState<AdminScreen>("admin-dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Core Data States
  const [plans, setPlans] = useState<PlanData[]>(INITIAL_PLANS);
  const [coupons, setCoupons] = useState<Coupon[]>(INITIAL_COUPONS);
  const [users, setUsers] = useState<AdminUser[]>(INITIAL_USERS);
  const [activityLogs, setActivityLogs] = useState<ActivityLogItem[]>(INITIAL_ACTIVITY_LOGS);

  // User Directory Filters & Detail View State
  const [userSearchQuery, setUserSearchQuery] = useState("");
  const [userPlanFilter, setUserPlanFilter] = useState("All");
  const [userStatusFilter, setUserStatusFilter] = useState("All");
  const [userDateFilter, setUserDateFilter] = useState("All Time");
  const [userCurrentPage, setUserCurrentPage] = useState(1);
  const [selectedUserDetail, setSelectedUserDetail] = useState<AdminUser | null>(null);

  // Modals Visibility States
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<PlanData | null>(null);

  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);

  // Notification Toast State
  const [notification, setNotification] = useState<string | null>(null);

  // Confirmation Modal State
  const [confirmation, setConfirmation] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    consequenceWarning?: string;
    confirmLabel?: string;
    onConfirm: () => void;
    isDanger?: boolean;
  }>({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => { },
  });

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const addAuditLog = (action: string, target: string, type: ActivityLogItem["type"]) => {
    const newLog: ActivityLogItem = {
      id: `log_${Date.now()}`,
      adminName: "Amit Kavathekar",
      adminRole: "Super Admin",
      action,
      target,
      type,
      timestamp: "Just now",
    };
    setActivityLogs((prev) => [newLog, ...prev]);
  };

  const handleViewPlanSubscribers = (planName: string) => {
    setUserPlanFilter(planName);
    setUserCurrentPage(1);
    setSelectedUserDetail(null);
    setActiveAdminScreen("admin-users");
    showNotification(`Showing subscribers for plan: ${planName}`);
  };

  // Logout Confirmation Handler
  const promptLogout = () => {
    setConfirmation({
      isOpen: true,
      title: "Confirm Admin Sign Out",
      message: "Are you sure you want to sign out of the JobPrepAI Super Admin Panel?",
      consequenceWarning: "Your active admin session will be closed securely.",
      confirmLabel: "Sign Out",
      isDanger: true,
      onConfirm: () => {
        onLogout();
      },
    });
  };

  // Quick Price Edit Confirmation Handler
  const promptUpdatePrice = (plan: PlanData, newPrice: number) => {
    if (!newPrice || newPrice <= 0 || newPrice === plan.priceINR) return;
    setConfirmation({
      isOpen: true,
      title: `Update Price for ${plan.name}?`,
      message: `Are you sure you want to update the price of ${plan.name} from ₹${plan.priceINR} to ₹${newPrice}?`,
      consequenceWarning: `This new price (₹${newPrice}) will take effect immediately across all candidate checkout pages.`,
      confirmLabel: `Update Price to ₹${newPrice}`,
      isDanger: false,
      onConfirm: () => {
        setPlans((prev) =>
          prev.map((p) => {
            if (p.id === plan.id) {
              addAuditLog(`Changed price of ${p.name} to ₹${newPrice}`, p.name, "Pricing");
              return { ...p, priceINR: newPrice };
            }
            return p;
          })
        );
        showNotification(`Price for ${plan.name} updated to ₹${newPrice}!`);
      },
    });
  };

  // Plan Handlers
  const handleSavePlan = (plan: PlanData) => {
    setPlans((prev) => {
      const idx = prev.findIndex((p) => p.id === plan.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = plan;
        return next;
      }
      return [...prev, plan];
    });
    showNotification(`Plan "${plan.name}" saved!`);
    addAuditLog(`Saved plan ${plan.name}`, plan.name, "Pricing");
  };

  const handleUpdatePrice = (id: string, newPrice: number) => {
    setPlans((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          addAuditLog(`Changed price of ${p.name} to ₹${newPrice}`, p.name, "Pricing");
          return { ...p, priceINR: newPrice };
        }
        return p;
      })
    );
    showNotification("Plan price updated!");
  };

  const promptTogglePlanStatus = (plan: PlanData) => {
    const nextStatus = plan.status === "Active" ? "Draft" : "Active";
    setConfirmation({
      isOpen: true,
      title: `${nextStatus === "Draft" ? "Pause / Archive" : "Activate"} ${plan.name}?`,
      message: `Are you sure you want to change the status of ${plan.name} to ${nextStatus}?`,
      consequenceWarning: `${plan.subscribersCount} active subscribers are currently on this plan.`,
      confirmLabel: `${nextStatus === "Draft" ? "Pause Plan" : "Activate Plan"}`,
      isDanger: nextStatus === "Draft",
      onConfirm: () => {
        setPlans((prev) => prev.map((p) => (p.id === plan.id ? { ...p, status: nextStatus } : p)));
        showNotification(`Plan ${plan.name} status set to ${nextStatus}`);
        addAuditLog(`Set status of ${plan.name} to ${nextStatus}`, plan.name, "Pricing");
      },
    });
  };

  // Coupon Handlers
  const handleSaveCoupon = (coupon: Coupon) => {
    setCoupons((prev) => {
      const idx = prev.findIndex((c) => c.id === coupon.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = coupon;
        return next;
      }
      return [...prev, coupon];
    });
    showNotification(`Coupon ${coupon.code} created successfully!`);
    addAuditLog(`Created coupon ${coupon.code}`, coupon.code, "Coupon");
  };

  const promptDeleteCoupon = (coupon: Coupon) => {
    setConfirmation({
      isOpen: true,
      title: `Delete Coupon ${coupon.code}?`,
      message: `Are you sure you want to remove coupon ${coupon.code}?`,
      consequenceWarning: `${coupon.timesUsed} candidates have already redeemed this code.`,
      confirmLabel: "Delete Coupon",
      isDanger: true,
      onConfirm: () => {
        setCoupons((prev) => prev.filter((c) => c.id !== coupon.id));
        showNotification(`Coupon ${coupon.code} deleted`);
        addAuditLog(`Deleted coupon ${coupon.code}`, coupon.code, "Coupon");
      },
    });
  };

  // User Action Handlers
  const promptSuspendUser = (user: AdminUser) => {
    const isSuspending = user.status !== "Suspended";
    setConfirmation({
      isOpen: true,
      title: `${isSuspending ? "Suspend" : "Unsuspend"} User ${user.name}?`,
      message: `Are you sure you want to ${isSuspending ? "suspend" : "unsuspend"} candidate ${user.name} (${user.email})?`,
      consequenceWarning: isSuspending ? "This user will immediately lose access to mock interviews & ATS resume scans." : undefined,
      confirmLabel: isSuspending ? "Suspend User" : "Unsuspend User",
      isDanger: isSuspending,
      onConfirm: () => {
        const nextStatus = isSuspending ? "Suspended" : "Active";
        setUsers((prev) => prev.map((u) => (u.id === user.id ? { ...u, status: nextStatus } : u)));
        if (selectedUserDetail && selectedUserDetail.id === user.id) {
          setSelectedUserDetail({ ...selectedUserDetail, status: nextStatus });
        }
        showNotification(`User ${user.name} ${isSuspending ? "suspended" : "reactivated"}`);
        addAuditLog(`${isSuspending ? "Suspended" : "Un-suspended"} user ${user.name}`, user.id, "User Action");
      },
    });
  };

  // Filtered Users computation
  const filteredUsers = users.filter((usr) => {
    const matchesSearch =
      usr.name.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
      usr.email.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
      usr.id.toLowerCase().includes(userSearchQuery.toLowerCase());

    const matchesPlan = userPlanFilter === "All" || usr.plan === userPlanFilter;
    const matchesStatus = userStatusFilter === "All" || usr.status === userStatusFilter;

    return matchesSearch && matchesPlan && matchesStatus;
  });

  const pageSize = 5;
  const totalUserPages = Math.ceil(filteredUsers.length / pageSize) || 1;
  const paginatedUsers = filteredUsers.slice((userCurrentPage - 1) * pageSize, userCurrentPage * pageSize);

  return (
    <div className="mesh-bg" style={{ height: "100%", width: "100%", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      {/* Admin Mobile Top Header */}
      <div
        className="mobile-header"
        style={{
          display: "none",
          padding: "12px 16px",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          background: "rgba(10,10,28,0.95)",
          backdropFilter: "blur(12px)",
          alignItems: "center",
          justifyContent: "space-between",
          zIndex: 40,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button
            onClick={() => setSidebarOpen((o) => !o)}
            style={{
              padding: "6px 10px",
              borderRadius: 8,
              border: "1px solid rgba(255,255,255,0.12)",
              background: "rgba(255,255,255,0.06)",
              color: "white",
              fontSize: 16,
              cursor: "pointer",
            }}
          >
            ☰
          </button>
          <div style={{ fontSize: 14, fontWeight: 800, color: "white" }}>
            Admin <span style={{ color: "#ec4899" }}>Portal</span>
          </div>
        </div>
        <button
          onClick={promptLogout}
          style={{
            fontSize: 11,
            color: "#f87171",
            background: "rgba(239,68,68,0.1)",
            border: "1px solid rgba(239,68,68,0.2)",
            padding: "4px 8px",
            borderRadius: 6,
            cursor: "pointer",
          }}
        >
          Sign Out
        </button>
      </div>

      <div style={{ flex: 1, display: "flex", overflow: "hidden", position: "relative" }}>
        {/* Admin Left Sidebar */}
        <AdminSidebar
          active={activeAdminScreen}
          onNavigate={(s) => {
            setActiveAdminScreen(s);
            setSelectedUserDetail(null);
            if (window.innerWidth < 768) {
              setSidebarOpen(false);
            }
          }}
          onLogout={promptLogout}
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen((o) => !o)}
        />

        {/* Main Admin Content Container */}
        <main style={{ flex: 1, overflowY: "auto", padding: "14px 24px", color: "#e2e8f0" }}>
          {/* Notification Toast */}
          {notification && (
            <div
              style={{
                position: "fixed",
                top: 16,
                right: 20,
                zIndex: 1100,
                background: "rgba(236, 72, 153, 0.25)",
                border: "1px solid #ec4899",
                color: "#f472b6",
                padding: "10px 16px",
                borderRadius: 10,
                fontSize: 12,
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: 10,
                backdropFilter: "blur(12px)",
                boxShadow: "0 8px 24px rgba(0,0,0,0.6)",
              }}
            >
              <span>✓</span>
              <span>{notification}</span>
            </div>
          )}

          {/* Clean Top Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 10, marginBottom: 10, flexWrap: "wrap", gap: 10 }}>
            <div>
              <h1 style={{ fontSize: 22, fontWeight: 800, color: "white", margin: 0, lineHeight: 1.2 }}>
                JobPrep<span className="gradient-text">AI</span> Admin Module
              </h1>
            </div>
          </div>

          {/* 1. OVERVIEW: ADMIN DASHBOARD */}
          {activeAdminScreen === "admin-dashboard" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {/* KPI Metrics Widgets */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12 }}>
                <div className="glass-card" style={{ padding: "10px 14px", borderLeft: "4px solid #10b981" }}>
                  <div style={{ fontSize: 10, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", fontFamily: "JetBrains Mono" }}>
                    Total Revenue (MRR)
                  </div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: "#10b981", marginTop: 2 }}>₹4,87,450</div>
                  <div style={{ fontSize: 10, color: "#34d399", marginTop: 2 }}>↑ +18.4% this month</div>
                </div>

                <div className="glass-card" style={{ padding: "10px 14px", borderLeft: "4px solid #06b6d4" }}>
                  <div style={{ fontSize: 10, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", fontFamily: "JetBrains Mono" }}>
                    Active Subscribers
                  </div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: "#06b6d4", marginTop: 2 }}>3,298</div>
                  <div style={{ fontSize: 10, color: "#67e8f9", marginTop: 2 }}>Monthly, 3M, 6M & 1Yr Plans</div>
                </div>

                <div className="glass-card" style={{ padding: "10px 14px", borderLeft: "4px solid #ec4899" }}>
                  <div style={{ fontSize: 10, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", fontFamily: "JetBrains Mono" }}>
                    AI Tokens Used
                  </div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: "#ec4899", marginTop: 2 }}>14.2M</div>
                  <div style={{ fontSize: 10, color: "#f472b6", marginTop: 2 }}>Gemini 1.5 & GPT-4o</div>
                </div>

                <div className="glass-card" style={{ padding: "10px 14px", borderLeft: "4px solid #f59e0b" }}>
                  <div style={{ fontSize: 10, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", fontFamily: "JetBrains Mono" }}>
                    Completed Mock Interviews
                  </div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: "#f59e0b", marginTop: 2 }}>18,420</div>
                  <div style={{ fontSize: 10, color: "#fbbf24", marginTop: 2 }}>Avg Score: 78.4 / 100</div>
                </div>
              </div>

              {/* Main Chart + Quick Actions (65% / 35% Layout) */}
              <div style={{ display: "flex", gap: 14, width: "100%", flexWrap: "wrap", marginTop: 10 }}>
                {/* Revenue Growth Bar Chart (65% WIDTH) */}
                <div className="glass-card" style={{ flex: "1 1 calc(65% - 7px)", width: "calc(65% - 7px)", minWidth: 320, padding: "18px 20px", display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: 380 }}>
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                      <div>
                        <h3 style={{ margin: 0, fontSize: 16, color: "white", fontWeight: 700, display: "flex", alignItems: "center", gap: 8 }}>
                          <span>📈</span> Monthly Revenue Growth (₹)
                        </h3>
                        <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>Last 6 months subscription revenue performance</div>
                      </div>
                      <span style={{ fontSize: 11, background: "rgba(236,72,153,0.15)", border: "1px solid rgba(236,72,153,0.3)", color: "#f472b6", padding: "3px 10px", borderRadius: 4, fontFamily: "JetBrains Mono", fontWeight: 700 }}>
                        +42% YoY Growth
                      </span>
                    </div>

                    {/* Height 280px Bar Chart */}
                    <div style={{ height: 280, display: "flex", alignItems: "flex-end", gap: 20, padding: "14px 10px 8px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                      {[
                        { month: "Apr", val: 180, rev: "₹1.80L" },
                        { month: "May", val: 240, rev: "₹2.40L" },
                        { month: "Jun", val: 310, rev: "₹3.10L" },
                        { month: "Jul", val: 390, rev: "₹3.90L" },
                        { month: "Aug", val: 420, rev: "₹4.20L" },
                        { month: "Sep", val: 487, rev: "₹4.87L", active: true },
                      ].map((b, i) => (
                        <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, height: "100%", justifyContent: "flex-end" }}>
                          <span style={{ fontSize: 11, color: b.active ? "#ec4899" : "#cbd5e1", fontWeight: b.active ? 800 : 600, fontFamily: "JetBrains Mono" }}>{b.rev}</span>
                          <div
                            style={{
                              width: "100%",
                              maxWidth: 52,
                              height: `${(b.val / 500) * 100}%`,
                              background: b.active ? "linear-gradient(180deg, #ec4899, #7c3aed)" : "rgba(255, 255, 255, 0.12)",
                              borderRadius: "8px 8px 0 0",
                              boxShadow: b.active ? "0 0 16px rgba(236, 72, 153, 0.45)" : "none",
                              transition: "height 0.5s ease",
                            }}
                          />
                          <span style={{ fontSize: 12, color: b.active ? "white" : "#94a3b8", fontWeight: b.active ? 700 : 500 }}>{b.month}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Revenue Growth Summary Footer */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12, paddingTop: 8, fontSize: 12, color: "#94a3b8" }}>
                    <div>Total 6-Mo Revenue: <strong style={{ color: "white" }}>₹20.27 Lakhs</strong></div>
                    <div>Avg Growth: <strong style={{ color: "#34d399" }}>+18.4% / mo</strong></div>
                    <div>Peak: <strong style={{ color: "#ec4899" }}>Sep (₹4.87L)</strong></div>
                  </div>
                </div>

                {/* Payment Method Distribution (Donut Chart) (35% WIDTH) */}
                <div className="glass-card" style={{ flex: "1 1 calc(35% - 7px)", width: "calc(35% - 7px)", minWidth: 240, padding: "18px 20px", display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: 380 }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                      <div>
                        <h3 style={{ margin: 0, fontSize: 16, color: "white", fontWeight: 700, display: "flex", alignItems: "center", gap: 6 }}>
                          <span>📱</span> Payment Method Distribution
                        </h3>
                        <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>Real-time payment mode breakdown</div>
                      </div>
                      <span style={{ fontSize: 10, background: "rgba(52, 211, 153, 0.15)", border: "1px solid rgba(52, 211, 153, 0.3)", color: "#34d399", padding: "3px 10px", borderRadius: 10, fontWeight: 700, fontFamily: "JetBrains Mono", display: "flex", alignItems: "center", gap: 4 }}>
                        <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#34d399", display: "inline-block" }}></span>
                        98.8% SUCCESS
                      </span>
                    </div>

                    {/* Donut Chart & Center Stats */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", margin: "10px 0 16px", position: "relative" }}>
                      <svg width="150" height="150" viewBox="0 0 140 140" style={{ transform: "rotate(-90deg)" }}>
                        <defs>
                          <linearGradient id="grad-upi" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#34d399" />
                            <stop offset="100%" stopColor="#059669" />
                          </linearGradient>
                          <linearGradient id="grad-cards" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#ec4899" />
                            <stop offset="100%" stopColor="#8b5cf6" />
                          </linearGradient>
                          <linearGradient id="grad-netbank" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#38bdf8" />
                            <stop offset="100%" stopColor="#0284c7" />
                          </linearGradient>
                          <linearGradient id="grad-wallets" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#a855f7" />
                            <stop offset="100%" stopColor="#7e22ce" />
                          </linearGradient>
                        </defs>
                        {/* Background track */}
                        <circle cx="70" cy="70" r="50" fill="transparent" stroke="rgba(255,255,255,0.05)" strokeWidth="18" />

                        {/* 1. UPI (GPay, PhonePe, Paytm) (64%) */}
                        <circle
                          cx="70"
                          cy="70"
                          r="50"
                          fill="transparent"
                          stroke="url(#grad-upi)"
                          strokeWidth="18"
                          strokeDasharray="201.06 113.10"
                          strokeDashoffset="0"
                          style={{ transition: "all 0.5s ease" }}
                        />
                        {/* 2. Credit & Debit Cards (22%) */}
                        <circle
                          cx="70"
                          cy="70"
                          r="50"
                          fill="transparent"
                          stroke="url(#grad-cards)"
                          strokeWidth="18"
                          strokeDasharray="69.12 245.04"
                          strokeDashoffset="-201.06"
                          style={{ transition: "all 0.5s ease" }}
                        />
                        {/* 3. Net Banking (9%) */}
                        <circle
                          cx="70"
                          cy="70"
                          r="50"
                          fill="transparent"
                          stroke="url(#grad-netbank)"
                          strokeWidth="18"
                          strokeDasharray="28.27 285.89"
                          strokeDashoffset="-270.18"
                          style={{ transition: "all 0.5s ease" }}
                        />
                        {/* 4. Wallets & EMI (5%) */}
                        <circle
                          cx="70"
                          cy="70"
                          r="50"
                          fill="transparent"
                          stroke="url(#grad-wallets)"
                          strokeWidth="18"
                          strokeDasharray="15.71 298.45"
                          strokeDashoffset="-298.45"
                          style={{ transition: "all 0.5s ease" }}
                        />
                      </svg>

                      {/* Donut Center Display */}
                      <div
                        style={{
                          position: "absolute",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          textAlign: "center",
                        }}
                      >
                        <span style={{ fontSize: 19, fontWeight: 900, color: "white", fontFamily: "JetBrains Mono", lineHeight: 1 }}>₹72.6L</span>
                        <span style={{ fontSize: 10, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", marginTop: 3 }}>Total Volume</span>
                      </div>
                    </div>

                    {/* Breakdown List Legend */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
                      {/* Item 1 */}
                      <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
                          <span style={{ color: "#e2e8f0", display: "flex", alignItems: "center", gap: 6, fontWeight: 600 }}>
                            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#34d399" }}></span>
                            UPI (GPay / PhonePe / Paytm)
                          </span>
                          <span style={{ color: "#34d399", fontWeight: 700, fontFamily: "JetBrains Mono" }}>64% (₹46.46L)</span>
                        </div>
                        <div style={{ width: "100%", height: 4, background: "rgba(255,255,255,0.06)", borderRadius: 4, overflow: "hidden" }}>
                          <div style={{ width: "64%", height: "100%", background: "linear-gradient(90deg, #34d399, #059669)", borderRadius: 4 }}></div>
                        </div>
                      </div>

                      {/* Item 2 */}
                      <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
                          <span style={{ color: "#e2e8f0", display: "flex", alignItems: "center", gap: 6, fontWeight: 600 }}>
                            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#ec4899" }}></span>
                            Credit & Debit Cards
                          </span>
                          <span style={{ color: "#f472b6", fontWeight: 700, fontFamily: "JetBrains Mono" }}>22% (₹15.97L)</span>
                        </div>
                        <div style={{ width: "100%", height: 4, background: "rgba(255,255,255,0.06)", borderRadius: 4, overflow: "hidden" }}>
                          <div style={{ width: "22%", height: "100%", background: "linear-gradient(90deg, #ec4899, #8b5cf6)", borderRadius: 4 }}></div>
                        </div>
                      </div>

                      {/* Item 3 */}
                      <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
                          <span style={{ color: "#e2e8f0", display: "flex", alignItems: "center", gap: 6, fontWeight: 600 }}>
                            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#38bdf8" }}></span>
                            Net Banking (SBI / HDFC / ICICI)
                          </span>
                          <span style={{ color: "#38bdf8", fontWeight: 700, fontFamily: "JetBrains Mono" }}>9% (₹6.53L)</span>
                        </div>
                        <div style={{ width: "100%", height: 4, background: "rgba(255,255,255,0.06)", borderRadius: 4, overflow: "hidden" }}>
                          <div style={{ width: "9%", height: "100%", background: "linear-gradient(90deg, #38bdf8, #0284c7)", borderRadius: 4 }}></div>
                        </div>
                      </div>

                      {/* Item 4 */}
                      <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
                          <span style={{ color: "#e2e8f0", display: "flex", alignItems: "center", gap: 6, fontWeight: 600 }}>
                            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#a855f7" }}></span>
                            Wallets & No-Cost EMI
                          </span>
                          <span style={{ color: "#c084fc", fontWeight: 700, fontFamily: "JetBrains Mono" }}>5% (₹3.63L)</span>
                        </div>
                        <div style={{ width: "100%", height: 4, background: "rgba(255,255,255,0.06)", borderRadius: 4, overflow: "hidden" }}>
                          <div style={{ width: "5%", height: "100%", background: "linear-gradient(90deg, #a855f7, #7e22ce)", borderRadius: 4 }}></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Donut Footer Info */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 14, paddingTop: 10, borderTop: "1px solid rgba(255,255,255,0.08)", fontSize: 11, color: "#94a3b8" }}>
                    <div>Avg Speed: <strong style={{ color: "#34d399" }}>&lt;1.8s</strong></div>
                    <div>Failure Rate: <strong style={{ color: "#38bdf8" }}>1.2%</strong></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 2. MONETIZATION: MEMBERSHIP PLANS SCREEN (With 4 Financial Analytics Cards at Top) */}
          {activeAdminScreen === "admin-membership" && (
            <div>
              {/* 4 Financial Analytics Cards embedded directly above Membership Plans */}
              <div style={{ marginBottom: 24 }}>
                <h4 style={{ margin: "0 0 12px", fontSize: 14, fontWeight: 700, color: "#ec4899", textTransform: "uppercase", letterSpacing: "0.08em", fontFamily: "JetBrains Mono" }}>
                  📊 Financial Analytics & Plan Revenue Overview
                </h4>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
                  {/* 1 Month Plan KPI Card */}
                  <div
                    className="glass-card"
                    onClick={() => handleViewPlanSubscribers("Basic")}
                    title="Click to view candidates subscribed to Basic Plan"
                    style={{
                      padding: 18,
                      borderLeft: "4px solid #38bdf8",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-3px)")}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ fontSize: 12, color: "#94a3b8" }}>1 Month (Basic)</div>
                      <span style={{ fontSize: 10, color: "#38bdf8", fontWeight: 700, background: "rgba(56, 189, 248, 0.12)", padding: "2px 6px", borderRadius: 4 }}>👥 VIEW USERS</span>
                    </div>
                    <div style={{ fontSize: 22, fontWeight: 800, color: "white", marginTop: 4 }}>₹1,70,658</div>
                    <div style={{ fontSize: 11, color: "#38bdf8", marginTop: 2 }}>342 Active Subscribers →</div>
                  </div>

                  {/* 3 Months Plan KPI Card */}
                  <div
                    className="glass-card"
                    onClick={() => handleViewPlanSubscribers("Plus")}
                    title="Click to view candidates subscribed to Plus Plan"
                    style={{
                      padding: 18,
                      borderLeft: "4px solid #a855f7",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-3px)")}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ fontSize: 12, color: "#94a3b8" }}>3 Months (Plus)</div>
                      <span style={{ fontSize: 10, color: "#c084fc", fontWeight: 700, background: "rgba(168, 85, 247, 0.12)", padding: "2px 6px", borderRadius: 4 }}>👥 VIEW USERS</span>
                    </div>
                    <div style={{ fontSize: 22, fontWeight: 800, color: "white", marginTop: 4 }}>₹11,11,944</div>
                    <div style={{ fontSize: 11, color: "#c084fc", marginTop: 2 }}>856 Active Subscribers →</div>
                  </div>

                  {/* 6 Months Plan KPI Card */}
                  <div
                    className="glass-card"
                    onClick={() => handleViewPlanSubscribers("Pro")}
                    title="Click to view candidates subscribed to Pro Plan"
                    style={{
                      padding: 18,
                      borderLeft: "4px solid #ec4899",
                      background: "rgba(236,72,153,0.08)",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-3px)")}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ fontSize: 12, color: "#f472b6", fontWeight: 700 }}>6 Months (Pro)</div>
                      <span style={{ fontSize: 10, color: "#ec4899", fontWeight: 700, background: "rgba(236, 72, 153, 0.2)", padding: "2px 6px", borderRadius: 4 }}>👥 VIEW USERS</span>
                    </div>
                    <div style={{ fontSize: 22, fontWeight: 800, color: "white", marginTop: 4 }}>₹32,64,580</div>
                    <div style={{ fontSize: 11, color: "#f472b6", marginTop: 2 }}>1,420 Active Subscribers (43% volume) →</div>
                  </div>

                  {/* 1 Year Plan KPI Card */}
                  <div
                    className="glass-card"
                    onClick={() => handleViewPlanSubscribers("Elite")}
                    title="Click to view candidates subscribed to Elite Plan"
                    style={{
                      padding: 18,
                      borderLeft: "4px solid #34d399",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-3px)")}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ fontSize: 12, color: "#94a3b8" }}>1 Year (Elite)</div>
                      <span style={{ fontSize: 10, color: "#34d399", fontWeight: 700, background: "rgba(52, 211, 153, 0.12)", padding: "2px 6px", borderRadius: 4 }}>👥 VIEW USERS</span>
                    </div>
                    <div style={{ fontSize: 22, fontWeight: 800, color: "white", marginTop: 4 }}>₹27,19,320</div>
                    <div style={{ fontSize: 11, color: "#34d399", marginTop: 2 }}>680 Active Subscribers (High LTV) →</div>
                  </div>
                </div>
              </div>

              {/* Membership Plans List Header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18, flexWrap: "wrap", gap: 12 }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "white" }}>
                    Membership & Subscription Tiers
                  </h3>

                </div>
                <br></br>
                <br></br>
                <button
                  className="btn-primary"
                  onClick={() => {
                    setEditingPlan(null);
                    setIsPlanModalOpen(true);
                  }}
                  style={{ fontSize: 12, padding: "8px 16px", borderRadius: 8, background: "linear-gradient(135deg, #ec4899, #7c3aed)" }}
                >
                  + Add New Plan
                </button>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
                {plans.map((plan) => (
                  <div
                    key={plan.id}
                    className="glass-card"
                    style={{
                      padding: 22,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      position: "relative",
                      border: plan.popular ? "1px solid rgba(236, 72, 153, 0.6)" : "1px solid rgba(255,255,255,0.08)",
                      background: plan.popular ? "rgba(236, 72, 153, 0.06)" : "rgba(255,255,255,0.02)",
                    }}
                  >
                    {plan.badge && (
                      <span
                        style={{
                          position: "absolute",
                          top: -12,
                          right: 16,
                          background: plan.popular ? "linear-gradient(135deg, #ec4899, #8b5cf6)" : "#06b6d4",
                          color: "white",
                          padding: "2px 10px",
                          borderRadius: 20,
                          fontSize: 10,
                          fontWeight: 800,
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                          boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
                        }}
                      >
                        {plan.badge}
                      </span>
                    )}

                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: 11, fontWeight: 700, fontFamily: "JetBrains Mono", color: "#ec4899", textTransform: "uppercase" }}>
                          {plan.duration} ({plan.months} Month{plan.months > 1 ? "s" : ""})
                        </span>
                        <span
                          style={{
                            fontSize: 11,
                            padding: "2px 8px",
                            borderRadius: 4,
                            background: plan.status === "Active" ? "rgba(16, 185, 129, 0.15)" : "rgba(239, 68, 68, 0.15)",
                            color: plan.status === "Active" ? "#34d399" : "#f87171",
                            fontWeight: 600,
                          }}
                        >
                          ● {plan.status}
                        </span>
                      </div>

                      <h4 style={{ fontSize: 20, fontWeight: 800, color: "white", margin: "8px 0 4px" }}>{plan.name}</h4>

                      <div style={{ display: "flex", alignItems: "baseline", gap: 8, margin: "10px 0 16px" }}>
                        <span style={{ fontSize: 28, fontWeight: 800, color: "#ffffff" }}>₹{plan.priceINR}</span>
                        <span style={{ fontSize: 13, textDecoration: "line-through", color: "#64748b" }}>₹{plan.originalPriceINR}</span>
                        <span style={{ fontSize: 11, color: "#94a3b8" }}>/ total</span>
                      </div>

                      <ul style={{ paddingLeft: 16, margin: "0 0 16px", fontSize: 12, color: "#cbd5e1", display: "flex", flexDirection: "column", gap: 6 }}>
                        {plan.features.map((feat, idx) => (
                          <li key={idx}>{feat}</li>
                        ))}
                      </ul>
                    </div>

                    <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                      <button
                        onClick={() => promptTogglePlanStatus(plan)}
                        style={{
                          flex: 1,
                          padding: "8px 12px",
                          borderRadius: 6,
                          fontSize: 12,
                          border: "1px solid rgba(255,255,255,0.1)",
                          background: "rgba(255,255,255,0.05)",
                          color: plan.status === "Active" ? "#f87171" : "#34d399",
                          cursor: "pointer",
                          fontWeight: 600,
                        }}
                      >
                        {plan.status === "Active" ? "Pause Plan" : "Activate Plan"}
                      </button>
                      <button
                        onClick={() => {
                          setEditingPlan(plan);
                          setIsPlanModalOpen(true);
                        }}
                        style={{
                          padding: "8px 14px",
                          borderRadius: 6,
                          fontSize: 12,
                          border: "1px solid rgba(236,72,153,0.3)",
                          background: "rgba(236,72,153,0.15)",
                          color: "#f472b6",
                          cursor: "pointer",
                          fontWeight: 600,
                        }}
                      >
                        Edit Plan
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. MONETIZATION: COUPONS SCREEN */}
          {activeAdminScreen === "admin-coupons" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: "white" }}>
                    🏷 Coupon Codes & Promotional Discounts
                  </h3>
                  <p style={{ margin: "4px 0 0", fontSize: 12, color: "#94a3b8" }}>
                    Create and manage percentage or flat-discount promotional codes
                  </p>
                </div>
                <button
                  className="btn-primary"
                  onClick={() => {
                    setEditingCoupon(null);
                    setIsCouponModalOpen(true);
                  }}
                  style={{ fontSize: 12, padding: "8px 16px", borderRadius: 8, background: "linear-gradient(135deg, #ec4899, #7c3aed)" }}
                >
                  + Create Coupon
                </button>
              </div>

              <div className="glass-card" style={{ padding: 22 }}>
                {coupons.length === 0 ? (
                  <EmptyState
                    icon="🏷"
                    title="No Coupons Found"
                    description="You haven't created any promotional discount coupon codes yet."
                    actionLabel="+ Create Coupon"
                    onAction={() => {
                      setEditingCoupon(null);
                      setIsCouponModalOpen(true);
                    }}
                  />
                ) : (
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
                    {coupons.map((c) => (
                      <div key={c.id} style={{ background: "rgba(255,255,255,0.03)", padding: 16, borderRadius: 12, border: "1px solid rgba(255,255,255,0.08)", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                        <div>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <span style={{ fontWeight: 800, fontFamily: "JetBrains Mono", fontSize: 16, color: "#ec4899", letterSpacing: "0.05em" }}>
                              {c.code}
                            </span>
                            <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 4, background: c.status === "Active" ? "rgba(16,185,129,0.15)" : "rgba(239,68,68,0.15)", color: c.status === "Active" ? "#34d399" : "#f87171" }}>
                              ● {c.status}
                            </span>
                          </div>

                          <div style={{ fontSize: 20, fontWeight: 800, color: "white", marginTop: 8 }}>
                            {c.discountType === "Percentage" ? `${c.discountValue}% OFF` : `₹${c.discountValue} OFF`}
                          </div>

                          <div style={{ fontSize: 12, color: "#cbd5e1", marginTop: 6 }}>
                            <strong>Applicable:</strong> {c.applicablePlans.join(", ")}
                          </div>

                          <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 4 }}>
                            Redeemed: <span style={{ color: "#06b6d4", fontWeight: 700 }}>{c.timesUsed}</span> / {c.usageLimit} times
                          </div>

                          <div style={{ fontSize: 11, color: "#64748b", marginTop: 2, fontFamily: "JetBrains Mono" }}>
                            Expires: {c.expiryDate}
                          </div>
                        </div>

                        <div style={{ display: "flex", gap: 8, marginTop: 14, borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 10 }}>
                          <button
                            onClick={() => {
                              setEditingCoupon(c);
                              setIsCouponModalOpen(true);
                            }}
                            style={{ flex: 1, padding: "6px", borderRadius: 6, fontSize: 11, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "white", cursor: "pointer" }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => promptDeleteCoupon(c)}
                            style={{ padding: "6px 12px", borderRadius: 6, fontSize: 11, background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)", color: "#f87171", cursor: "pointer" }}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 4. USERS: USER DIRECTORY & USER DETAIL VIEW */}
          {activeAdminScreen === "admin-users" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {selectedUserDetail ? (
                <UserDetailView
                  user={selectedUserDetail}
                  onBack={() => setSelectedUserDetail(null)}
                  onSuspend={promptSuspendUser}
                  onChangePlan={(usr, newPlan) => {
                    setUsers((prev) => prev.map((u) => (u.id === usr.id ? { ...u, plan: newPlan } : u)));
                    setSelectedUserDetail({ ...selectedUserDetail, plan: newPlan });
                    showNotification(`Plan updated to ${newPlan}`);
                    addAuditLog(`Changed plan of ${usr.name} to ${newPlan}`, usr.id, "User Action");
                  }}
                  onIssueRefund={(usr, amt) => {
                    showNotification(`Refund of ${amt} issued to ${usr.name}`);
                    addAuditLog(`Issued refund of ${amt} to ${usr.name}`, usr.id, "User Action");
                  }}
                  onResetPassword={(usr) => {
                    showNotification(`Password reset link emailed to ${usr.email}`);
                    addAuditLog(`Reset password for ${usr.name}`, usr.id, "User Action");
                  }}
                />
              ) : (
                <div className="glass-card" style={{ padding: 22 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 12 }}>
                    <div>
                      <h3 style={{ margin: 0, fontSize: 18, color: "white" }}>Registered Candidates Directory</h3>
                      <p style={{ margin: "2px 0 0", fontSize: 12, color: "#94a3b8" }}>Search, filter, and manage candidate accounts</p>
                    </div>

                    <input
                      type="text"
                      placeholder="Search candidate name or email..."
                      value={userSearchQuery}
                      onChange={(e) => {
                        setUserSearchQuery(e.target.value);
                        setUserCurrentPage(1);
                      }}
                      className="glass-input"
                      style={{ padding: "8px 14px", fontSize: 13, width: 240 }}
                    />
                  </div>

                  {/* Filter Controls Bar */}
                  <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 16, background: "rgba(255,255,255,0.03)", padding: 12, borderRadius: 10 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <label style={{ fontSize: 11, color: "#94a3b8", textTransform: "uppercase" }}>Plan:</label>
                      <select
                        value={userPlanFilter}
                        onChange={(e) => {
                          setUserPlanFilter(e.target.value);
                          setUserCurrentPage(1);
                        }}
                        style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", color: "white", padding: "6px 10px", borderRadius: 6, fontSize: 12 }}
                      >
                        <option value="All">All Plans</option>
                        <option value="Basic">Basic (1 Month)</option>
                        <option value="Plus">Plus (3 Months)</option>
                        <option value="Pro">Pro (6 Months)</option>
                        <option value="Elite">Elite (1 Year)</option>
                        <option value="Super Admin">Super Admin</option>
                      </select>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <label style={{ fontSize: 11, color: "#94a3b8", textTransform: "uppercase" }}>Status:</label>
                      <select
                        value={userStatusFilter}
                        onChange={(e) => {
                          setUserStatusFilter(e.target.value);
                          setUserCurrentPage(1);
                        }}
                        style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", color: "white", padding: "6px 10px", borderRadius: 6, fontSize: 12 }}
                      >
                        <option value="All">All Statuses</option>
                        <option value="Active">Active</option>
                        <option value="Suspended">Suspended</option>
                        <option value="Expired">Expired</option>
                      </select>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <label style={{ fontSize: 11, color: "#94a3b8", textTransform: "uppercase" }}>Join Date:</label>
                      <select
                        value={userDateFilter}
                        onChange={(e) => setUserDateFilter(e.target.value)}
                        style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", color: "white", padding: "6px 10px", borderRadius: 6, fontSize: 12 }}
                      >
                        <option value="All Time">All Time</option>
                        <option value="Last 7 Days">Last 7 Days</option>
                        <option value="Last 30 Days">Last 30 Days</option>
                        <option value="Last 90 Days">Last 90 Days</option>
                      </select>
                    </div>

                    {(userSearchQuery || userPlanFilter !== "All" || userStatusFilter !== "All") && (
                      <button
                        onClick={() => {
                          setUserSearchQuery("");
                          setUserPlanFilter("All");
                          setUserStatusFilter("All");
                          setUserCurrentPage(1);
                        }}
                        style={{ fontSize: 11, background: "none", border: "none", color: "#ec4899", cursor: "pointer", textDecoration: "underline" }}
                      >
                        Reset Filters
                      </button>
                    )}
                  </div>

                  {paginatedUsers.length === 0 ? (
                    <EmptyState
                      icon="🔍"
                      title="No Candidates Found"
                      description="No candidates match your current search query or active filter criteria."
                      actionLabel="Reset Search & Filters"
                      onAction={() => {
                        setUserSearchQuery("");
                        setUserPlanFilter("All");
                        setUserStatusFilter("All");
                        setUserCurrentPage(1);
                      }}
                    />
                  ) : (
                    <>
                      <div style={{ overflowX: "auto" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, textAlign: "left" }}>
                          <thead>
                            <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.1)", color: "#94a3b8" }}>
                              <th style={{ padding: 10 }}>ID</th>
                              <th style={{ padding: 10 }}>Candidate</th>
                              <th style={{ padding: 10 }}>Active Plan</th>
                              <th style={{ padding: 10 }}>Plan Expiry</th>
                              <th style={{ padding: 10 }}>Status</th>
                              <th style={{ padding: 10 }}>Joined Date</th>
                              <th style={{ padding: 10 }}>Total Spent</th>
                              <th style={{ padding: 10 }}>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {paginatedUsers.map((usr) => (
                              <tr key={usr.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                                <td style={{ padding: 10, fontFamily: "JetBrains Mono", color: "#94a3b8" }}>{usr.id}</td>
                                <td style={{ padding: 10 }}>
                                  <div style={{ fontWeight: 600, color: "white" }}>{usr.name}</div>
                                  <div style={{ fontSize: 11, color: "#64748b" }}>{usr.email}</div>
                                </td>
                                <td style={{ padding: 10, color: "#ec4899", fontWeight: 600 }}>{usr.plan}</td>
                                <td style={{ padding: 10, color: "#fde047", fontFamily: "JetBrains Mono", fontSize: 12 }}>{usr.planExpiry || "2027-02-12"}</td>
                                <td style={{ padding: 10 }}>
                                  <span
                                    style={{
                                      padding: "2px 8px",
                                      borderRadius: 4,
                                      fontSize: 11,
                                      background: usr.status === "Active" ? "rgba(16, 185, 129, 0.15)" : "rgba(239,68,68,0.15)",
                                      color: usr.status === "Active" ? "#34d399" : "#f87171",
                                    }}
                                  >
                                    {usr.status}
                                  </span>
                                </td>
                                <td style={{ padding: 10, color: "#94a3b8" }}>{usr.joined}</td>
                                <td style={{ padding: 10, fontWeight: 700, color: "white" }}>{usr.spent}</td>
                                <td style={{ padding: 10 }}>
                                  <button
                                    onClick={() => setSelectedUserDetail(usr)}
                                    style={{ padding: "4px 12px", fontSize: 11, borderRadius: 6, background: "rgba(236, 72, 153, 0.15)", border: "1px solid rgba(236, 72, 153, 0.3)", color: "#f472b6", cursor: "pointer", fontWeight: 600 }}
                                  >
                                    Manage
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* Pagination Controls */}
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 18, borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 12 }}>
                        <span style={{ fontSize: 12, color: "#94a3b8" }}>
                          Showing Page {userCurrentPage} of {totalUserPages} ({filteredUsers.length} total candidates)
                        </span>

                        <div style={{ display: "flex", gap: 8 }}>
                          <button
                            disabled={userCurrentPage === 1}
                            onClick={() => setUserCurrentPage((p) => Math.max(1, p - 1))}
                            className="btn-ghost"
                            style={{ padding: "4px 12px", fontSize: 12, opacity: userCurrentPage === 1 ? 0.4 : 1 }}
                          >
                            Previous
                          </button>
                          <button
                            disabled={userCurrentPage >= totalUserPages}
                            onClick={() => setUserCurrentPage((p) => Math.min(totalUserPages, p + 1))}
                            className="btn-ghost"
                            style={{ padding: "4px 12px", fontSize: 12, opacity: userCurrentPage >= totalUserPages ? 0.4 : 1 }}
                          >
                            Next
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          )}

          {/* 4.5 USERS: STANDALONE SUPPORT TICKETS SCREEN */}
          {activeAdminScreen === "admin-support" && (
            <SupportTicketsScreen />
          )}

          {/* 5. SYSTEM: AI TOKENS & MODELS */}
          {activeAdminScreen === "admin-ai-models" && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
              <div className="glass-card" style={{ padding: 22 }}>
                <h3 style={{ margin: "0 0 12px", fontSize: 16, color: "white" }}>AI Engine & Model Router</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <div>
                    <label style={{ fontSize: 12, color: "#94a3b8", display: "block", marginBottom: 4 }}>Mock Interview Evaluator Model:</label>
                    <select style={{ width: "100%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", color: "white", padding: 8, borderRadius: 6 }}>
                      <option value="gemini-1.5-pro">Google Gemini 1.5 Pro (Recommended)</option>
                      <option value="gpt-4o">OpenAI GPT-4o</option>
                      <option value="claude-3-5-sonnet">Anthropic Claude 3.5 Sonnet</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: 12, color: "#94a3b8", display: "block", marginBottom: 4 }}>ATS Resume Parser Engine:</label>
                    <select style={{ width: "100%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", color: "white", padding: 8, borderRadius: 6 }}>
                      <option value="gemini-flash">Gemini 1.5 Flash (Ultra Fast)</option>
                      <option value="gpt-4o-mini">GPT-4o Mini</option>
                    </select>
                  </div>
                  <button
                    className="btn-primary"
                    onClick={() => showNotification("AI Model Router Saved!")}
                    style={{ marginTop: 10, fontSize: 12, padding: "8px 14px", borderRadius: 6, background: "linear-gradient(135deg, #ec4899, #7c3aed)" }}
                  >
                    Save Model Routing Config
                  </button>
                </div>
              </div>

              <div className="glass-card" style={{ padding: 22 }}>
                <h3 style={{ margin: "0 0 12px", fontSize: 16, color: "white" }}>AI Token Limits per Tier</h3>
                <div style={{ fontSize: 12, color: "#cbd5e1", lineHeight: 1.8 }}>
                  <p style={{ margin: 0 }}>• Free Users: Max 50,000 tokens / month</p>
                  <p style={{ margin: 0 }}>• 1 Month Subscribers: Max 500,000 tokens / month</p>
                  <p style={{ margin: 0 }}>• 3 Month Subscribers: Max 1,800,000 tokens / qtr</p>
                  <p style={{ margin: 0 }}>• 6 Month Subscribers: Max 4,500,000 tokens / 6mo</p>
                  <p style={{ margin: 0 }}>• 1 Year Pass Subscribers: Max 10,000,000 tokens / yr</p>
                </div>
              </div>
            </div>
          )}

          {/* 7. SYSTEM: NOTIFICATIONS SETTINGS */}
          {activeAdminScreen === "admin-notifications" && (
            <div className="glass-card" style={{ padding: 22, maxWidth: 600 }}>
              <h3 style={{ margin: "0 0 14px", fontSize: 16, color: "white" }}>Automated Notification & Reminder Settings</h3>
              <div style={{ fontSize: 13, color: "#cbd5e1", display: "flex", flexDirection: "column", gap: 12 }}>
                <label style={{ display: "flex", alignItems: "center", gap: 10, background: "rgba(255,255,255,0.03)", padding: 12, borderRadius: 8 }}>
                  <input type="checkbox" defaultChecked />
                  <span>Send Renewal Alert 3 Days Prior to Subscription Expiry</span>
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: 10, background: "rgba(255,255,255,0.03)", padding: 12, borderRadius: 8 }}>
                  <input type="checkbox" defaultChecked />
                  <span>Send WhatsApp Score Card after AI Mock Interview completion</span>
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: 10, background: "rgba(255,255,255,0.03)", padding: 12, borderRadius: 8 }}>
                  <input type="checkbox" defaultChecked />
                  <span>Send Automated Email Invoice Receipt on successful payment</span>
                </label>
              </div>
              <button
                className="btn-primary"
                onClick={() => showNotification("Notification preferences saved!")}
                style={{ marginTop: 16, fontSize: 12, padding: "8px 16px", borderRadius: 8, background: "linear-gradient(135deg, #ec4899, #7c3aed)" }}
              >
                Save Notification Settings
              </button>
            </div>
          )}

          {/* 8. SYSTEM: ACTIVITY LOG SCREEN */}
          {activeAdminScreen === "admin-activity-log" && (
            <ActivityLogScreen logs={activityLogs} />
          )}
        </main>
      </div>

      {/* PLAN MODAL WITH LIVE PREVIEW */}
      {isPlanModalOpen && (
        <PlanModal
          isOpen={isPlanModalOpen}
          initialData={editingPlan}
          onClose={() => setIsPlanModalOpen(false)}
          onSave={handleSavePlan}
        />
      )}

      {/* COUPON MODAL */}
      {isCouponModalOpen && (
        <CouponModal
          isOpen={isCouponModalOpen}
          initialData={editingCoupon}
          onClose={() => setIsCouponModalOpen(false)}
          onSave={handleSaveCoupon}
        />
      )}



      {/* CONFIRMATION POPUP DIALOG */}
      {confirmation.isOpen && (
        <ConfirmationModal
          isOpen={confirmation.isOpen}
          title={confirmation.title}
          message={confirmation.message}
          consequenceWarning={confirmation.consequenceWarning}
          confirmLabel={confirmation.confirmLabel}
          isDanger={confirmation.isDanger}
          onConfirm={confirmation.onConfirm}
          onClose={() => setConfirmation({ ...confirmation, isOpen: false })}
        />
      )}
    </div>
  );
}
