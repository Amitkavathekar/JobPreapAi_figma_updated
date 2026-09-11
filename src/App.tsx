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

  const navigate = (s: Screen) => {
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
        return <JobResume onNavigate={navigate} onComplete={() => markComplete("job-resume")} />;
      case "ai-analysis":
        return <AIAnalysis onNavigate={navigate} onComplete={() => markComplete("ai-analysis")} />;
      case "resume-editor":
        return <ResumeEditor onNavigate={navigate} />;
      case "ats-analysis":
        return <ATSAnalysis onNavigate={navigate} />;
      case "interview-prep":
        return <InterviewPrep onNavigate={navigate} />;
      case "mock-interview":
        return <MockInterview onNavigate={navigate} onComplete={() => markComplete("mock-interview")} />;
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
        />
        <main style={{ flex: 1, overflow: "hidden", position: "relative" }}>
          {renderScreen()}
        </main>
      </div>
    </div>
  );
}

