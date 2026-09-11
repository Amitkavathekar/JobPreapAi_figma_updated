import { useState } from "react";
import { Screen, UserProfile } from "./types";
import Sidebar from "./components/Sidebar";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import JobResume from "./pages/JobResume";
import AIAnalysis from "./pages/AIAnalysis";
import ResumeEditor from "./pages/ResumeEditor";
import ATSAnalysis from "./pages/ATSAnalysis";
import InterviewPrep from "./pages/InterviewPrep";
import MockInterview from "./pages/MockInterview";
import Reports from "./pages/Reports";
import AdminPanel from "./pages/AdminPanel";
import UserMembershipModal from "./components/UserMembershipModal";
import UserSupportModal from "./components/UserSupportModal";
import RazorpayCheckoutModal from "./components/RazorpayCheckoutModal";
import { PlanData } from "./components/admin/PlanModal";

// Ordered list of screens that contribute to progress
const PROGRESS_SCREENS: Screen[] = [
  "dashboard",
  "profile",
  "job-resume",
  "ai-analysis",
  "resume-editor",
  "ats-analysis",
  "interview-prep",
  "mock-interview",
  "reports",
];

const INITIAL_USER_PLANS: PlanData[] = [
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

const defaultUserProfile: UserProfile = {
  id: "usr_9f83a21e-4b91-4c12-921a-7b3281ef09a1",
  full_name: "Arjun Kumar",
  email: "arjun.kumar@gmail.com",
  password_hash: "$2b$12$e8Y9u1mZ8vWqL7pX0rN...hash",
  professional_title: "Senior Frontend Engineer",
  bio: "5+ years building scalable web applications. Passionate about DX and design systems.",
  avatar_url: "",
  language: "en",
  timezone: "Asia/Kolkata",
  is_2fa_enabled: true,
  phone_no: "+91 98765 43210",
  location: "Mumbai, India",
  portfolio_url: "https://arjun-kumar.dev",
  github: "https://github.com/arjunkumar",
  linkedin: "https://linkedin.com/in/arjunkumar",
  degree: "Bachelor of Technology (B.Tech)",
  institution: "IIT Bombay",
  field_of_study: "Computer Science & Engineering",
  start_year: 2019,
  end_year: 2023,
  created_at: "2026-01-15T08:30:00Z",
  updated_at: new Date().toISOString(),
};

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<"user" | "admin" | null>(null);
  const [authView, setAuthView] = useState<"landing" | "login">("landing");
  const [authTab, setAuthTab] = useState<"login" | "register">("login");
  const [screen, setScreen] = useState<Screen>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [visited, setVisited] = useState<Set<Screen>>(new Set(["dashboard"]));

  // Candidate Profile State & Login Modal Popup State
  const [userProfile, setUserProfile] = useState<UserProfile>(defaultUserProfile);
  const [showProfileModal, setShowProfileModal] = useState(false);

  // Membership & Subscription State
  const [userSubscription, setUserSubscription] = useState<PlanData | null>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [isSupportHovered, setIsSupportHovered] = useState(false);
  const [userPlans] = useState<PlanData[]>(INITIAL_USER_PLANS);

  // Razorpay Checkout Modal State
  const [showRazorpayModal, setShowRazorpayModal] = useState(false);
  const [selectedRazorpayPlan, setSelectedRazorpayPlan] = useState<PlanData | null>(null);

  // Step 2 & Dependent Screens Lock State (requires JD + Resume PDF in Step 1)
  const [isStep2Enabled, setIsStep2Enabled] = useState(false);

  const hasActiveSubscription = !!userSubscription;

  const navigate = (s: Screen) => {
    // Guard navigation: lock AI Analysis, Resume Editor, ATS Analysis, Interview Prep if Step 1 is not valid
    if (!isStep2Enabled && ["ai-analysis", "resume-editor", "ats-analysis", "interview-prep"].includes(s)) {
      return;
    }
    setScreen(s);
    if (s !== "landing") {
      setVisited((prev) => new Set([...prev, s]));
    }
  };

  const markComplete = (s: Screen) => {
    setVisited((prev) => new Set([...prev, s]));
  };

  const handleLogout = () => {
    setLoggedIn(false);
    setUserRole(null);
    setShowProfileModal(false);
    setShowUpgradeModal(false);
    setShowRazorpayModal(false);
    setAuthView("login");
    setScreen("dashboard");
  };

  const handleUserLogin = (role: "user" | "admin") => {
    setLoggedIn(true);
    setUserRole(role);
    if (role === "admin") {
      setScreen("admin");
    } else {
      setScreen("dashboard");
      setVisited(new Set(["dashboard"]));
      // Popup Complete Profile Form Modal on user login landing on Dashboard!
      setShowProfileModal(true);
    }
  };

  const handleSubscribe = (plan: PlanData) => {
    setSelectedRazorpayPlan(plan);
    setShowRazorpayModal(true);
  };

  const handleRazorpaySuccess = (plan: PlanData) => {
    setUserSubscription(plan);
  };

  const progress = Math.round((visited.size / PROGRESS_SCREENS.length) * 100);

  // Unauthenticated Flow
  if (!loggedIn) {
    if (authView === "login") {
      return (
        <div className="mesh-bg" style={{ height: "100%", width: "100%" }}>
          <Login
            initialTab={authTab}
            onLogin={handleUserLogin}
            onBackToLanding={() => setAuthView("landing")}
          />
        </div>
      );
    }

    return (
      <LandingPage
        onNavigateToApp={(targetScreen) => {
          setLoggedIn(true);
          setUserRole("user");
          if (targetScreen && targetScreen !== "landing") {
            setScreen(targetScreen);
            setVisited(new Set([targetScreen]));
          } else {
            setScreen("dashboard");
            setVisited(new Set(["dashboard"]));
          }
          // Popup Complete Profile Form Modal on user login landing on Dashboard!
          setShowProfileModal(true);
        }}
        onNavigateToLogin={(tab = "login") => {
          setAuthTab(tab);
          setAuthView("login");
        }}
      />
    );
  }

  // Admin User Flow (Completely isolated Admin Portal)
  if (userRole === "admin" || screen === "admin") {
    return <AdminPanel onLogout={handleLogout} />;
  }

  // Candidate User Flow (Candidate App without Admin links)
  const renderScreen = () => {
    switch (screen) {
      case "landing":
        return (
          <LandingPage
            onNavigateToApp={(targetScreen) => {
              if (targetScreen && targetScreen !== "landing") {
                navigate(targetScreen);
              } else {
                navigate("dashboard");
              }
            }}
            onNavigateToLogin={(tab = "login") => {
              setLoggedIn(false);
              setUserRole(null);
              setAuthTab(tab);
              setAuthView("login");
            }}
          />
        );
      case "dashboard":
        return (
          <Dashboard
            onNavigate={navigate}
            userProfile={userProfile}
            showProfileModal={showProfileModal}
            onCloseProfileModal={() => setShowProfileModal(false)}
            onOpenProfileModal={() => setShowProfileModal(true)}
            onSaveProfile={(updated) => setUserProfile(updated)}
          />
        );
      case "profile":
        return (
          <Profile
            userProfile={userProfile}
            onSaveProfile={(updated) => setUserProfile(updated)}
            onOpenProfileModal={() => setShowProfileModal(true)}
          />
        );
      case "job-resume":
        return (
          <JobResume
            onNavigate={navigate}
            onComplete={() => markComplete("job-resume")}
            onStep2EnabledChange={(enabled) => setIsStep2Enabled(enabled)}
          />
        );
      case "ai-analysis":
        return (
          <AIAnalysis
            onNavigate={navigate}
            onComplete={() => markComplete("ai-analysis")}
            hasActiveSubscription={hasActiveSubscription}
            onOpenUpgradeModal={() => setShowUpgradeModal(true)}
          />
        );
      case "resume-editor":
        return (
          <ResumeEditor
            onNavigate={navigate}
            hasActiveSubscription={hasActiveSubscription}
            onOpenUpgradeModal={() => setShowUpgradeModal(true)}
          />
        );
      case "ats-analysis":
        return (
          <ATSAnalysis
            onNavigate={navigate}
            hasActiveSubscription={hasActiveSubscription}
            onOpenUpgradeModal={() => setShowUpgradeModal(true)}
          />
        );
      case "interview-prep":
        return (
          <InterviewPrep
            onNavigate={navigate}
            hasActiveSubscription={hasActiveSubscription}
            onOpenUpgradeModal={() => setShowUpgradeModal(true)}
          />
        );
      case "mock-interview":
        return (
          <MockInterview
            onNavigate={navigate}
            onComplete={() => markComplete("mock-interview")}
            hasActiveSubscription={hasActiveSubscription}
            onOpenUpgradeModal={() => setShowUpgradeModal(true)}
            isStep2Enabled={isStep2Enabled}
          />
        );
      case "reports":
        return <Reports />;
      default:
        return (
          <Dashboard
            onNavigate={navigate}
            userProfile={userProfile}
            showProfileModal={showProfileModal}
            onCloseProfileModal={() => setShowProfileModal(false)}
            onOpenProfileModal={() => setShowProfileModal(true)}
            onSaveProfile={(updated) => setUserProfile(updated)}
          />
        );
    }
  };

  if (screen === "landing") {
    return (
      <div style={{ height: "100%", width: "100%", position: "relative" }}>
        {renderScreen()}
      </div>
    );
  }

  return (
    <div
      className="mesh-bg"
      style={{ height: "100%", width: "100%", display: "flex", flexDirection: "column", overflow: "hidden" }}
    >
      {/* User Membership Plan Modal */}
      <UserMembershipModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        plans={userPlans}
        currentPlanId={userSubscription?.id || null}
        onSubscribe={handleSubscribe}
      />

      {/* Razorpay Detailed Payment Modal */}
      <RazorpayCheckoutModal
        isOpen={showRazorpayModal}
        onClose={() => setShowRazorpayModal(false)}
        plan={selectedRazorpayPlan}
        onSuccess={handleRazorpaySuccess}
      />

      {/* User Support Query Modal */}
      <UserSupportModal
        isOpen={showSupportModal}
        onClose={() => setShowSupportModal(false)}
        userProfile={userProfile}
      />

      {/* Non-intrusive Floating Support Trigger Button (Icon only by default, expands text on hover) */}
      <button
        onClick={() => setShowSupportModal(true)}
        onMouseEnter={() => setIsSupportHovered(true)}
        onMouseLeave={() => setIsSupportHovered(false)}
        title="Help & Support (Click to raise query)"
        style={{
          position: "fixed",
          bottom: 24,
          right: 24,
          zIndex: 900,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 6,
          height: 48,
          minWidth: 48,
          padding: isSupportHovered ? "0 18px" : "0 12px",
          borderRadius: 24,
          background: "linear-gradient(135deg, #7c3aed, #06b6d4)",
          border: "1px solid rgba(255, 255, 255, 0.25)",
          color: "white",
          fontSize: 14,
          fontWeight: 700,
          cursor: "pointer",
          boxShadow: isSupportHovered
            ? "0 10px 25px rgba(124, 58, 237, 0.6), 0 0 20px rgba(6, 182, 212, 0.4)"
            : "0 8px 20px rgba(0, 0, 0, 0.4), 0 0 12px rgba(124, 58, 237, 0.3)",
          transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
          overflow: "hidden",
        }}
      >
        <span style={{ fontSize: 20, flexShrink: 0, display: "flex", alignItems: "center" }}>🎧</span>
        {isSupportHovered && (
          <span
            style={{
              whiteSpace: "nowrap",
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: "0.02em",
            }}
          >
            Support
          </span>
        )}
      </button>

      {/* Mobile Top Header */}
      <div
        className="mobile-header"
        style={{
          display: "none",
          padding: "12px 16px",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          background: "rgba(7,7,26,0.9)",
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
          <div style={{ fontSize: 15, fontWeight: 800, color: "white" }}>
            AI Job <span className="gradient-text">Prep</span>
          </div>
        </div>
        <div style={{ fontSize: 12, fontFamily: "JetBrains Mono", color: "#06b6d4" }}>
          {progress}% Done
        </div>
      </div>

      <div style={{ flex: 1, display: "flex", overflow: "hidden", position: "relative" }}>
        <Sidebar
          active={screen}
          onNavigate={(s) => {
            navigate(s);
            if (window.innerWidth < 768) {
              setSidebarOpen(false);
            }
          }}
          onLogout={handleLogout}
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen((o) => !o)}
          progress={progress}
          visited={visited}
          profile={userProfile}
          onOpenProfileModal={() => setShowProfileModal(true)}
          hasActiveSubscription={hasActiveSubscription}
          userSubscription={userSubscription}
          onOpenUpgradeModal={() => setShowUpgradeModal(true)}
          onOpenSupportModal={() => setShowSupportModal(true)}
          isStep2Enabled={isStep2Enabled}
        />
        <main style={{ flex: 1, overflow: "hidden", position: "relative" }}>
          {renderScreen()}
        </main>
      </div>
    </div>
  );
}


