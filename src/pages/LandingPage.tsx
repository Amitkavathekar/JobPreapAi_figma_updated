import { Screen } from "../types";

interface LandingPageProps {
  onNavigateToApp: (screen?: Screen) => void;
  onNavigateToLogin: (defaultTab?: "login" | "register") => void;
}

export default function LandingPage({ onNavigateToApp, onNavigateToLogin }: LandingPageProps) {
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div style={{ width: "100%", height: "100%", overflowY: "auto", overflowX: "hidden", background: "#07071a", color: "#e2e8f0" }}>
      {/* 1. STICKY TOP NAVIGATION BAR */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          background: "rgba(7, 7, 26, 0.85)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
          padding: "14px 40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Brand Logo & Name */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }} onClick={() => scrollToSection("hero")}>
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              background: "linear-gradient(135deg, #7c3aed, #06b6d4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 16,
              fontWeight: 800,
              color: "white",
              boxShadow: "0 0 20px rgba(124, 58, 237, 0.4)",
            }}
          >
            JP
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 18, color: "white", letterSpacing: "-0.02em", lineHeight: 1.1 }}>
              JobPrep <span style={{ color: "#06b6d4" }}>AI</span>
            </div>
            <div style={{ fontSize: 10, color: "rgba(148, 163, 184, 0.6)", fontWeight: 500 }}>
              Enterprise Career Platform
            </div>
          </div>
        </div>

        {/* Center Nav Links */}
        <nav style={{ display: "flex", alignItems: "center", gap: 28 }}>
          {[
            { label: "Trusted", id: "trusted" },
            { label: "About", id: "about" },
            { label: "Modules", id: "modules" },
            { label: "Workflow", id: "workflow" },
            { label: "Membership Plans", id: "pricing" },
          ].map((link) => (
            <button
              key={link.id}
              onClick={() => scrollToSection(link.id)}
              style={{
                background: "none",
                border: "none",
                color: "rgba(226, 232, 240, 0.75)",
                fontSize: 13,
                fontWeight: 500,
                cursor: "pointer",
                transition: "color 0.2s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#ffffff")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(226, 232, 240, 0.75)")}
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Right CTA Actions */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button
            className="btn-ghost"
            style={{ padding: "8px 18px", fontSize: 13, borderRadius: 8 }}
            onClick={() => onNavigateToLogin("login")}
          >
            Login
          </button>
          <button
            className="btn-primary"
            style={{ padding: "9px 22px", fontSize: 13, borderRadius: 8, boxShadow: "0 0 20px rgba(124, 58, 237, 0.35)" }}
            onClick={() => onNavigateToLogin("register")}
          >
            Sign up
          </button>
        </div>
      </header>

      {/* 2. HERO SECTION 1: DARK GRID (matching Screenshot 1) */}
      <section
        id="hero"
        style={{
          position: "relative",
          minHeight: "calc(100vh - 65px)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "80px 40px",
          textAlign: "center",
          background:
            "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(124, 58, 237, 0.3) 0%, transparent 70%), linear-gradient(180deg, #07071a 0%, #0d0d2e 100%)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
        }}
      >
        {/* Subtle background grid pattern */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
            pointerEvents: "none",
            opacity: 0.6,
          }}
        />

        <div style={{ maxWidth: 900, margin: "0 auto", position: "relative", zIndex: 1 }}>
          {/* Top Pill Tag */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 16px",
              borderRadius: 999,
              background: "rgba(124, 58, 237, 0.15)",
              border: "1px solid rgba(167, 139, 250, 0.3)",
              fontSize: 12,
              fontWeight: 600,
              color: "#a78bfa",
              marginBottom: 24,
              fontFamily: "JetBrains Mono",
            }}
          >
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#06b6d4", boxShadow: "0 0 10px #06b6d4" }} />
            Trusted by 50,000+ candidates
          </div>

          {/* Headline */}
          <h1
            style={{
              fontSize: 52,
              fontWeight: 800,
              color: "#ffffff",
              lineHeight: 1.15,
              letterSpacing: "-0.03em",
              marginBottom: 20,
            }}
          >
            A secure AI career platform <br />
            designed for <span className="gradient-text">enterprise workflows</span>
          </h1>

          {/* Subtitle */}
          <p
            style={{
              fontSize: 18,
              color: "rgba(148, 163, 184, 0.85)",
              maxWidth: 720,
              margin: "0 auto 40px",
              lineHeight: 1.6,
              fontWeight: 400,
            }}
          >
            real-time analytics, ATS scanner, AI resume editor, and voice mock interview—built to streamline your entire job application lifecycle.
          </p>



          {/* Bottom Features Badge Row */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 32, fontSize: 13, color: "rgba(148, 163, 184, 0.7)" }}>
            <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#10b981" }} />
              Secure
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#06b6d4" }} />
              Real-Time ATS Analytics
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#7c3aed" }} />
              Cloud-Based & Instant AI
            </span>
          </div>
        </div>
      </section>

      {/* 3. HERO SECTION 2: LIGHT MOCKUP SHOWCASE (matching Screenshot 2) */}
      <section
        id="trusted"
        style={{
          padding: "80px 40px",
          background: "linear-gradient(180deg, #0d0d2e 0%, #07071a 100%)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
        }}
      >
        <div
          style={{
            maxWidth: 1240,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "1fr 1.1fr",
            gap: 50,
            alignItems: "center",
          }}
        >
          {/* Left Text Column */}
          <div>
            <h2
              style={{
                fontSize: 44,
                fontWeight: 800,
                color: "#ffffff",
                lineHeight: 1.15,
                letterSpacing: "-0.02em",
                marginBottom: 20,
              }}
            >
              The Future of <br />
              <span style={{ color: "#06b6d4" }}>Career & Resume AI</span> <br />
              For Modern Job Seekers
            </h2>
            <p
              style={{
                fontSize: 16,
                color: "rgba(148, 163, 184, 0.85)",
                lineHeight: 1.6,
                marginBottom: 28,
              }}
            >
              Upload resumes, match job descriptions, analyze ATS compatibility, rewrite sections with AI, practice mock interviews, and view analytics from one intelligent career platform.
            </p>

            <div style={{ fontSize: 13, fontWeight: 600, color: "#a78bfa", marginBottom: 20 }}>
              Built for candidates, career switchers, SMEs, and enterprise recruiters.
            </div>

            {/* Quick feature tags grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {[

                "✓ Job Description Match",
                "✓ ATS Keyword Diagnostic",
                "✓ Live AI Resume Rewriter",
                "✓ Voice Mock Interview",
                "✓ Exportable PDF Reports",
              ].map((feat, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: "10px 14px",
                    borderRadius: 10,
                    background: "rgba(255, 255, 255, 0.04)",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    fontSize: 13,
                    color: "rgba(226, 232, 240, 0.9)",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <span style={{ color: "#06b6d4", fontWeight: 700 }}>{feat.slice(0, 1)}</span>
                  <span>{feat.slice(2)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Simulated White Dashboard Preview Card (Matching Screenshot 2) */}
          <div
            style={{
              background: "#ffffff",
              borderRadius: 24,
              padding: 24,
              boxShadow: "0 25px 60px -15px rgba(0, 0, 0, 0.5), 0 0 40px rgba(6, 182, 212, 0.2)",
              color: "#1e293b",
              fontFamily: "Outfit, sans-serif",
            }}
          >
            {/* Top Bar inside card mockup */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, paddingBottom: 12, borderBottom: "1px solid #e2e8f0" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: "#06b6d4", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 14 }}>
                  JP
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: "#0f172a" }}>JobPrep AI Dashboard</div>
                  <div style={{ fontSize: 11, color: "#64748b" }}>Welcome Back Arjun 👋</div>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 11, background: "#f1f5f9", padding: "4px 10px", borderRadius: 6, color: "#475569", fontWeight: 600 }}>
                  📅 Sep 05, 2026
                </span>
                <button
                  style={{ background: "#7c3aed", color: "white", border: "none", padding: "5px 12px", borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer" }}
                  onClick={() => onNavigateToApp("dashboard")}
                >
                  Open App
                </button>
              </div>
            </div>

            {/* Metric Boxes inside preview */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 16 }}>
              <div style={{ background: "#f8fafc", padding: 14, borderRadius: 12, border: "1px solid #e2e8f0" }}>
                <div style={{ fontSize: 11, color: "#64748b", fontWeight: 600 }}>Total Resumes</div>
                <div style={{ fontSize: 20, fontWeight: 800, color: "#0f172a" }}>1,248</div>
              </div>
              <div style={{ background: "#f8fafc", padding: 14, borderRadius: 12, border: "1px solid #e2e8f0" }}>
                <div style={{ fontSize: 11, color: "#64748b", fontWeight: 600 }}>ATS Match Score</div>
                <div style={{ fontSize: 20, fontWeight: 800, color: "#7c3aed" }}>98.6%</div>
              </div>
              <div style={{ background: "#f8fafc", padding: 14, borderRadius: 12, border: "1px solid #e2e8f0" }}>
                <div style={{ fontSize: 11, color: "#64748b", fontWeight: 600 }}>Mock Interview</div>
                <div style={{ fontSize: 20, fontWeight: 800, color: "#10b981" }}>92% Pass</div>
              </div>
            </div>

            {/* Charts preview */}
            <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 12 }}>
              {/* Analytics bar graph */}
              <div style={{ background: "#f8fafc", padding: 16, borderRadius: 14, border: "1px solid #e2e8f0" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, fontWeight: 700, color: "#0f172a", marginBottom: 12 }}>
                  <span>Skill Match Growth</span>
                  <span style={{ color: "#64748b", fontWeight: 500 }}>30 Days</span>
                </div>
                <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 75, paddingBottom: 4 }}>
                  {[45, 55, 62, 70, 68, 85, 92, 98].map((h, i) => (
                    <div
                      key={i}
                      style={{
                        flex: 1,
                        height: `${h}%`,
                        background: "linear-gradient(180deg, #06b6d4, #3b82f6)",
                        borderRadius: "4px 4px 0 0",
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Readiness Donut chart */}
              <div style={{ background: "#f8fafc", padding: 16, borderRadius: 14, border: "1px solid #e2e8f0", textAlign: "center" }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#0f172a", marginBottom: 8 }}>Readiness</div>
                <div style={{ position: "relative", width: 70, height: 70, margin: "0 auto 6px" }}>
                  <svg viewBox="0 0 36 36" style={{ width: "100%", height: "100%", transform: "rotate(-90deg)" }}>
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#e2e8f0"
                      strokeWidth="3.8"
                    />
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#06b6d4"
                      strokeWidth="3.8"
                      strokeDasharray="92, 100"
                    />
                  </svg>
                  <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, color: "#0f172a" }}>
                    98%
                  </div>
                </div>
                <div style={{ fontSize: 10, color: "#10b981", fontWeight: 700 }}>Ready for Interview</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. ABOUT SECTION (matching Screenshot 3) */}
      <section
        id="about"
        style={{
          padding: "80px 40px",
          background: "#07071a",
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
        }}
      >
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.3fr", gap: 30, alignItems: "stretch" }}>
            {/* Left Big Card (matching Screenshot 3 layout) */}
            <div
              className="glass"
              style={{
                padding: 36,
                borderRadius: 20,
                background: "rgba(255, 255, 255, 0.04)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <div style={{ fontSize: 13, fontWeight: 700, color: "#06b6d4", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                About JobPrep AI
              </div>
              <h3 style={{ fontSize: 32, fontWeight: 800, color: "white", lineHeight: 1.2, marginBottom: 16 }}>
                Built for candidate & College students that move fast
              </h3>
              <p style={{ fontSize: 15, color: "rgba(148, 163, 184, 0.85)", lineHeight: 1.6, marginBottom: 24 }}>
                JobPrep AI is an enterprise-grade Career & Resume Management System that streamlines job matching, document optimization, ATS keyword tracking, mock interviews, reporting, and organizational readiness.
              </p>

              <div style={{ display: "flex", gap: 12 }}>
                {["Paperless Workflows", "Real-Time Analytics"].map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: "8px 14px",
                      borderRadius: 10,
                      background: "rgba(255, 255, 255, 0.06)",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      fontSize: 12,
                      fontWeight: 600,
                      color: "white",
                    }}
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* Right 4 Grid Cards (matching Screenshot 3) */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              {[
                { badge: "● Match", title: "Job & Resume Matching", desc: "Upload candidate CVs and target job specs to get instant alignment percentage and missing skill insights." },
                { badge: "● Diagnostic", title: "ATS Keyword Diagnostics", desc: "Check parser compatibility, formatting score, and keyword density before submitting to employers." },
                { badge: "● Editor", title: "Live AI Resume Editor", desc: "Rewrite bullet points, format sections, and update scores dynamically with built-in AI assistant." },
                { badge: "● Reports", title: "Reports & Exports", desc: "Comprehensive candidate analysis, historical score tracking, and client export ready in one click." },
              ].map((card, i) => (
                <div
                  key={i}
                  className="glass glass-hover"
                  style={{
                    padding: 24,
                    borderRadius: 16,
                    background: "rgba(255, 255, 255, 0.03)",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                  }}
                >
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: "#06b6d4",
                      background: "rgba(6, 182, 212, 0.12)",
                      padding: "4px 10px",
                      borderRadius: 6,
                      display: "inline-block",
                      marginBottom: 12,
                    }}
                  >
                    {card.badge}
                  </span>
                  <h4 style={{ fontSize: 18, fontWeight: 700, color: "white", marginBottom: 8 }}>{card.title}</h4>
                  <p style={{ fontSize: 13, color: "rgba(148, 163, 184, 0.75)", lineHeight: 1.5 }}>{card.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. CORE MODULES SECTION (matching Screenshot 4) */}
      <section
        id="modules"
        style={{
          padding: "80px 40px",
          background: "linear-gradient(180deg, #07071a 0%, #0d0d2b 100%)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
        }}
      >
        <div style={{ maxWidth: 1240, margin: "0 auto", textAlign: "center" }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#06b6d4", marginBottom: 8, letterSpacing: "0.08em", textTransform: "uppercase" }}>
            Core Modules
          </div>
          <h2 style={{ fontSize: 40, fontWeight: 800, color: "white", marginBottom: 12 }}>
            Everything you need to run your career—end to end
          </h2>
          <p style={{ fontSize: 16, color: "rgba(148, 163, 184, 0.8)", maxWidth: 650, margin: "0 auto 50px" }}>
            Premium AI workflows for candidate profiles, resume editing, ATS checks, interview prep, mock interviews, and analytics.
          </p>

          {/* 6 Grid Cards (White Glass Cards matching Screenshot 4) */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
            {[
              { id: "dashboard", icon: "⊞", title: "Dashboard & KPIs", desc: "Role-aware insights, progress tracking & overall readiness KPIs.", color: "#7c3aed" },
              { id: "ai-analysis", icon: "📈", title: "AI Analysis & Gap Diagnosis", desc: "Charts, trends, missing skills diagnostic, and severity breakdown.", color: "#06b6d4" },
              { id: "job-resume", icon: "👥", title: "Job & Resume Management", desc: "Upload resumes, match job descriptions, and store target roles.", color: "#10b981" },
              { id: "ats-analysis", icon: "📤", title: "ATS Scanner & Export", desc: "Parse rate diagnostics, keyword density & CSV/PDF reporting.", color: "#f59e0b" },
              { id: "resume-editor", icon: "✎", title: "Live Resume Editor", desc: "Split-screen editor, inline AI rewrite, and real-time score updates.", color: "#ec4899" },
              { id: "mock-interview", icon: "📄", title: "Voice Mock Interview", desc: "Voice recording, timer, instant STAR feedback, and score analysis.", color: "#8b5cf6" },
            ].map((module) => (
              <div
                key={module.id}
                onClick={() => onNavigateToApp(module.id as Screen)}
                style={{
                  background: "#ffffff",
                  borderRadius: 16,
                  padding: 28,
                  textAlign: "left",
                  color: "#0f172a",
                  cursor: "pointer",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow = "0 20px 40px rgba(6, 182, 212, 0.25)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "none";
                  e.currentTarget.style.boxShadow = "0 10px 30px rgba(0,0,0,0.3)";
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    background: "rgba(124, 58, 237, 0.08)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 22,
                    marginBottom: 16,
                    color: module.color,
                  }}
                >
                  {module.icon}
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: "#0f172a", marginBottom: 8 }}>{module.title}</h3>
                <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.5 }}>{module.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>



      {/* 7. WORKFLOW / STEP-BY-STEP SECTION */}
      <section
        id="workflow"
        style={{
          padding: "80px 40px",
          background: "linear-gradient(180deg, #0d0d2b 0%, #07071a 100%)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
        }}
      >
        <div style={{ maxWidth: 1100, margin: "0 auto", textAlign: "center" }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: "#06b6d4", letterSpacing: "0.1em", textTransform: "uppercase" }}>
            Simple Workflow
          </span>
          <h2 style={{ fontSize: 36, fontWeight: 800, color: "white", marginTop: 6, marginBottom: 50 }}>
            4 Simple Steps to Land Your Next Offer
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }}>
            {[
              { num: "01", title: "Upload & Input", desc: "Upload your CV and paste your target Job Description." },
              { num: "02", title: "AI Analysis", desc: "Run ATS check and view missing skill gaps instantly." },
              { num: "03", title: "Optimize CV", desc: "Use the live AI editor to refine bullets & boost match score." },
              { num: "04", title: "Mock Interview", desc: "Practice voice questions & get real-time confidence feedback." },
            ].map((step, idx) => (
              <div
                key={idx}
                className="glass"
                style={{
                  padding: 24,
                  borderRadius: 16,
                  textAlign: "left",
                  background: "rgba(255, 255, 255, 0.03)",
                  position: "relative",
                }}
              >
                <div style={{ fontSize: 32, fontWeight: 800, color: "rgba(6, 182, 212, 0.4)", fontFamily: "JetBrains Mono", marginBottom: 12 }}>
                  {step.num}
                </div>
                <h4 style={{ fontSize: 16, fontWeight: 700, color: "white", marginBottom: 6 }}>{step.title}</h4>
                <p style={{ fontSize: 12, color: "rgba(148, 163, 184, 0.7)", lineHeight: 1.5 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>



      {/* 8. MEMBERSHIP PLANS / PRICING SECTION */}
      <section
        id="pricing"
        style={{
          padding: "90px 40px",
          background: "radial-gradient(ellipse 80% 50% at 50% 30%, rgba(124, 58, 237, 0.15) 0%, transparent 70%), linear-gradient(180deg, #07071a 0%, #0d0d2b 100%)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
          position: "relative",
        }}
      >
        <div style={{ maxWidth: 1240, margin: "0 auto", textAlign: "center" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 16px",
              borderRadius: 999,
              background: "rgba(6, 182, 212, 0.12)",
              border: "1px solid rgba(6, 182, 212, 0.3)",
              fontSize: 12,
              fontWeight: 700,
              color: "#06b6d4",
              marginBottom: 16,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            <span>💎</span> Membership Plans
          </div>
          <h2 style={{ fontSize: 40, fontWeight: 800, color: "white", marginBottom: 12, letterSpacing: "-0.02em" }}>
            Choose the Right Plan for Your Career Success
          </h2>
          <p style={{ fontSize: 16, color: "rgba(148, 163, 184, 0.8)", maxWidth: 680, margin: "0 auto 50px", lineHeight: 1.6 }}>
            Transparent pricing with no hidden fees. Flexible plans for students, job seekers, and active interview preparation.
          </p>

          {/* Pricing Cards Grid (4 Plans) */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 24, alignItems: "stretch" }}>
            {[
              {
                id: "plan-monthly",
                name: "Basic",
                badge: "1 Month Access",
                priceINR: 499,
                period: "/ 1 month",
                moEquivalent: "₹499/mo",
                mockLimit: "10 AI Interviews",
                atsLimit: "25 Resume Scans",
                popular: false,
                color: "#94a3b8",
                features: [
                  "10 AI Mock Interviews per month",
                  "25 ATS Resume Analysis scans",
                  "Standard AI Feedback & Score",
                  "Basic Career Dashboard",
                  "Email Support",
                ],
                cta: "Get Basic Plan",
              },
              {
                id: "plan-quarterly",
                name: "Plus",
                badge: "3 Months Access",
                priceINR: 1299,
                period: "/ 3 months",
                moEquivalent: "₹433/mo",
                mockLimit: "35 AI Interviews",
                atsLimit: "75 Resume Scans",
                popular: false,
                color: "#06b6d4",
                features: [
                  "35 AI Mock Interviews (3 Months)",
                  "75 ATS Resume Scans",
                  "Deep Detailed AI Audio Feedback",
                  "Resume PDF Exporter & Editor",
                  "Priority Chat Support",
                ],
                cta: "Get Plus Plan",
              },
              {
                id: "plan-halfyearly",
                name: "Pro",
                badge: "6 Months Access",
                tag: "🔥 MOST POPULAR",
                priceINR: 2299,
                period: "/ 6 months",
                moEquivalent: "₹383/mo",
                mockLimit: "Unlimited Interviews",
                atsLimit: "Unlimited Resume Scans",
                popular: true,
                color: "#7c3aed",
                features: [
                  "Unlimited AI Mock Interviews",
                  "Unlimited ATS Scans & Resume Tailoring",
                  "Company-Specific Interview Simulations (Google, TCS, Infosys)",
                  "Live Speech Speed & Filler Word AI Analysis",
                  "Export PDF Reports with Custom Branding",
                  "1-on-1 AI Resume Optimization Assistant",
                ],
                cta: "Upgrade to Pro",
              },
              {
                id: "plan-annual",
                name: "Elite VIP",
                badge: "1 Year Access",
                tag: "👑 BEST VALUE",
                priceINR: 3999,
                period: "/ 1 year",
                moEquivalent: "₹333/mo",
                mockLimit: "Unlimited + VIP Priority",
                atsLimit: "Unlimited + VIP Priority",
                popular: false,
                isElite: true,
                color: "#f59e0b",
                features: [
                  "All Pro Plan Features Included",
                  "VIP Priority Queue for AI Speech Processing",
                  "Unlimited Mock Interviews & Revisions for 365 Days",
                  "Job Application Tracker & Referral Assistant",
                  "Dedicated Placement & Interview Consultation",
                  "Certificate of Job Readiness",
                ],
                cta: "Get Elite VIP",
              },
            ].map((plan) => (
              <div
                key={plan.id}
                style={{
                  background: plan.popular
                    ? "linear-gradient(180deg, rgba(124, 58, 237, 0.18) 0%, rgba(15, 23, 42, 0.95) 100%)"
                    : plan.isElite
                    ? "linear-gradient(180deg, rgba(245, 158, 11, 0.12) 0%, rgba(15, 23, 42, 0.95) 100%)"
                    : "rgba(255, 255, 255, 0.03)",
                  borderRadius: 20,
                  padding: 28,
                  textAlign: "left",
                  border: plan.popular
                    ? "2px solid #7c3aed"
                    : plan.isElite
                    ? "1px solid rgba(245, 158, 11, 0.5)"
                    : "1px solid rgba(255, 255, 255, 0.08)",
                  boxShadow: plan.popular
                    ? "0 20px 40px rgba(124, 58, 237, 0.3)"
                    : "0 10px 30px rgba(0, 0, 0, 0.3)",
                  position: "relative",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-6px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "none";
                }}
              >
                <div>
                  {/* Tag Header if Popular / Elite */}
                  {plan.tag && (
                    <div
                      style={{
                        position: "absolute",
                        top: -14,
                        right: 20,
                        background: plan.popular
                          ? "linear-gradient(135deg, #7c3aed, #ec4899)"
                          : "linear-gradient(135deg, #f59e0b, #d97706)",
                        color: "white",
                        fontSize: 10,
                        fontWeight: 800,
                        padding: "4px 12px",
                        borderRadius: 999,
                        letterSpacing: "0.05em",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                      }}
                    >
                      {plan.tag}
                    </div>
                  )}

                  {/* Plan Name & Badge */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                    <h3 style={{ fontSize: 22, fontWeight: 800, color: "white" }}>{plan.name}</h3>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 600,
                        color: plan.color,
                        background: "rgba(255, 255, 255, 0.05)",
                        padding: "4px 10px",
                        borderRadius: 8,
                        border: "1px solid rgba(255, 255, 255, 0.08)",
                      }}
                    >
                      {plan.badge}
                    </span>
                  </div>

                  {/* Price Display */}
                  <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 4 }}>
                    <span style={{ fontSize: 36, fontWeight: 800, color: "white", fontFamily: "JetBrains Mono" }}>
                      ₹{plan.priceINR.toLocaleString("en-IN")}
                    </span>
                    <span style={{ fontSize: 13, color: "rgba(148, 163, 184, 0.7)" }}>{plan.period}</span>
                  </div>
                  <div style={{ fontSize: 12, color: "#06b6d4", fontWeight: 600, marginBottom: 20 }}>
                    Equivalent to ~{plan.moEquivalent}
                  </div>

                  {/* Usage limits pill box */}
                  <div
                    style={{
                      background: "rgba(0, 0, 0, 0.25)",
                      borderRadius: 10,
                      padding: "10px 14px",
                      marginBottom: 20,
                      border: "1px solid rgba(255, 255, 255, 0.05)",
                      fontSize: 12,
                      color: "rgba(226, 232, 240, 0.9)",
                      display: "flex",
                      flexDirection: "column",
                      gap: 4,
                    }}
                  >
                    <div>🎤 <strong>Mock:</strong> {plan.mockLimit}</div>
                    <div>📊 <strong>ATS:</strong> {plan.atsLimit}</div>
                  </div>

                  {/* Divider */}
                  <div style={{ height: 1, background: "rgba(255, 255, 255, 0.08)", marginBottom: 20 }} />

                  {/* Feature Checklist */}
                  <ul style={{ listStyle: "none", padding: 0, margin: "0 0 28px", display: "flex", flexDirection: "column", gap: 10 }}>
                    {plan.features.map((feat, idx) => (
                      <li key={idx} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 13, color: "rgba(226, 232, 240, 0.85)", lineHeight: 1.4 }}>
                        <span style={{ color: plan.color, fontWeight: 800, fontSize: 14 }}>✓</span>
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Action CTA Button */}
                <button
                  onClick={() => onNavigateToLogin("register")}
                  style={{
                    width: "100%",
                    padding: "12px 18px",
                    borderRadius: 10,
                    fontWeight: 700,
                    fontSize: 14,
                    cursor: "pointer",
                    border: "none",
                    transition: "all 0.2s ease",
                    background: plan.popular
                      ? "linear-gradient(135deg, #7c3aed, #06b6d4)"
                      : plan.isElite
                      ? "linear-gradient(135deg, #f59e0b, #d97706)"
                      : "rgba(255, 255, 255, 0.08)",
                    color: "white",
                    boxShadow: plan.popular ? "0 0 20px rgba(124, 58, 237, 0.4)" : "none",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.opacity = "0.9";
                    e.currentTarget.style.transform = "scale(1.02)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.opacity = "1";
                    e.currentTarget.style.transform = "scale(1)";
                  }}
                >
                  {plan.cta} →
                </button>
              </div>
            ))}
          </div>

          {/* Guarantee / Security badges */}
          <div
            style={{
              marginTop: 50,
              padding: "16px 24px",
              borderRadius: 12,
              background: "rgba(255, 255, 255, 0.02)",
              border: "1px solid rgba(255, 255, 255, 0.06)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 36,
              flexWrap: "wrap",
              fontSize: 13,
              color: "rgba(148, 163, 184, 0.75)",
            }}
          >
            <span>🔒 256-bit SSL Encrypted Payment</span>
            <span>⚡ Instant Membership Activation</span>
            <span>💳 UPI, Credit/Debit Cards, NetBanking</span>
            <span>💬 24/7 Priority Support</span>
          </div>
        </div>
      </section>



      {/* 10. COMPREHENSIVE FOOTER */}
      <footer
        style={{
          background: "#04040f",
          borderTop: "1px solid rgba(255, 255, 255, 0.08)",
          padding: "32px 40px 18px",
          fontSize: 12,
          color: "rgba(148, 163, 184, 0.7)",
        }}
      >
        <div
          style={{
            maxWidth: 1240,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "1.8fr 1fr 1fr 1fr",
            gap: 30,
            marginBottom: 24,
          }}
        >
          {/* Logo & Description Column */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 6,
                  background: "linear-gradient(135deg, #7c3aed, #06b6d4)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 12,
                  fontWeight: 800,
                  color: "white",
                }}
              >
                JP
              </div>
              <div style={{ fontWeight: 800, fontSize: 15, color: "white" }}>
                JobPrep <span style={{ color: "#06b6d4" }}>AI</span>
              </div>
            </div>
            <p style={{ fontSize: 12, color: "rgba(148, 163, 184, 0.65)", lineHeight: 1.5, maxWidth: 280, marginBottom: 10 }}>
              One platform for job seekers, resume analysis, ATS scoring, AI interview practice, and career analytics.
            </p>
            <div style={{ fontSize: 11, color: "rgba(148, 163, 184, 0.5)" }}>
              Built for modern professionals & HR teams.
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontSize: 13, fontWeight: 700, color: "white", marginBottom: 10 }}>Quick Links</h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 6 }}>
              {["Dashboard", "Job & Resume", "AI Analysis", "ATS Diagnostic", "Mock Interview", "Reports"].map((item, idx) => (
                <li key={idx}>
                  <button
                    onClick={() => onNavigateToApp(item.toLowerCase().replace(/ & /g, "-").replace(/ /g, "-") as any)}
                    style={{ background: "none", border: "none", color: "rgba(148, 163, 184, 0.7)", cursor: "pointer", padding: 0, fontSize: 12 }}
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 style={{ fontSize: 13, fontWeight: 700, color: "white", marginBottom: 10 }}>Resources</h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 6 }}>
              {["Privacy Policy", "Terms of Service", "Contact Support", "Documentation", "API Access"].map((item, idx) => (
                <li key={idx}>
                  <a href="#" style={{ color: "rgba(148, 163, 184, 0.7)", textDecoration: "none", fontSize: 12 }}>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h4 style={{ fontSize: 13, fontWeight: 700, color: "white", marginBottom: 10 }}>Connect & Social</h4>
            <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
              {["🌐", "🐙", "💼", "💬"].map((icon, i) => (
                <a
                  key={i}
                  href="#"
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 6,
                    background: "rgba(255, 255, 255, 0.05)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    textDecoration: "none",
                    fontSize: 13,
                  }}
                >
                  {icon}
                </a>
              ))}
            </div>
            <div style={{ fontSize: 11, color: "rgba(148, 163, 184, 0.5)" }}>
              Status: <span style={{ color: "#10b981", fontWeight: 600 }}>● All Systems Operational</span>
            </div>
          </div>
        </div>

        {/* Copyright Bar */}
        <div
          style={{
            maxWidth: 1240,
            margin: "0 auto",
            paddingTop: 14,
            borderTop: "1px solid rgba(255, 255, 255, 0.05)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 11,
            color: "rgba(148, 163, 184, 0.5)",
          }}
        >
          <div>© 2026 JobPrep AI. All rights reserved.</div>
          <div style={{ display: "flex", gap: 16 }}>
            <a href="#" style={{ color: "rgba(148, 163, 184, 0.5)", textDecoration: "none" }}>Privacy</a>
            <a href="#" style={{ color: "rgba(148, 163, 184, 0.5)", textDecoration: "none" }}>Terms</a>
            <a href="#" style={{ color: "rgba(148, 163, 184, 0.5)", textDecoration: "none" }}>Cookies</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
