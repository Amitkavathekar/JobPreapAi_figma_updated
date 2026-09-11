import { useState } from 'react';

interface LoginProps {
  onLogin: (role: "user" | "admin") => void;
  onBackToLanding?: () => void;
  initialTab?: "login" | "register";
}

export default function Login({
  onLogin,
  onBackToLanding,
  initialTab = "login",
}: LoginProps) {
  const [tab, setTab] = useState<"login" | "register">(initialTab);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLoginRole = () => {
    const isAdmin = email.trim().toLowerCase() === "admin@gmail.com" || email.trim().toLowerCase().startsWith("admin");
    const role: "user" | "admin" = isAdmin ? "admin" : "user";
    
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLogin(role);
    }, 800);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleLoginRole();
  };

  return (
    <div
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
      className="mesh-bg"
    >
      {onBackToLanding && (
        <button
          onClick={onBackToLanding}
          style={{
            position: 'absolute',
            top: 24,
            left: 24,
            background: 'rgba(255, 255, 255, 0.06)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            color: 'white',
            padding: '8px 16px',
            borderRadius: 8,
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            zIndex: 10,
          }}
        >
          ← Back to Landing Page
        </button>
      )}

      {/* Decorative orbs */}
      <div
        style={{
          position: 'absolute',
          top: -100,
          left: -100,
          width: 400,
          height: 400,
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(124,58,237,0.2) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: -80,
          right: -80,
          width: 350,
          height: 350,
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(6,182,212,0.18) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div
        className="fade-in"
        style={{ width: '100%', maxWidth: 440, padding: '0 20px' }}
      >
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div
            className="gradient-text"
            style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.02em' }}
          >
            JobPrep AI
          </div>
          <div
            style={{
              color: 'rgba(148,163,184,0.7)',
              fontSize: 14,
              marginTop: 4,
            }}
          >
            AI-Powered Career Intelligence Platform
          </div>
        </div>

        {/* Card */}
        <div className="glass" style={{ padding: 32 }}>
          {/* Tabs */}
          <div
            style={{
              display: 'flex',
              gap: 4,
              marginBottom: 28,
              background: 'rgba(255,255,255,0.04)',
              borderRadius: 10,
              padding: 4,
            }}
          >
            {(['login', 'register'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                style={{
                  flex: 1,
                  padding: '8px 0',
                  borderRadius: 8,
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: 'Outfit',
                  fontWeight: 600,
                  fontSize: 14,
                  transition: 'all 0.2s',
                  background:
                    tab === t
                      ? 'linear-gradient(135deg, #7c3aed, #06b6d4)'
                      : 'transparent',
                  color: tab === t ? 'white' : 'rgba(148,163,184,0.7)',
                }}
              >
                {t === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            ))}
          </div>

          <form
            onSubmit={handleSubmit}
            style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
          >
            {tab === 'register' && (
              <div>
                <label
                  style={{
                    fontSize: 13,
                    fontWeight: 500,
                    color: 'rgba(148,163,184,0.8)',
                    display: 'block',
                    marginBottom: 6,
                  }}
                >
                  Full Name
                </label>
                <input
                  className="glass-input"
                  type="text"
                  placeholder="Arjun Kumar"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required={tab === 'register'}
                />
              </div>
            )}
            <div>
              <label
                style={{
                  fontSize: 13,
                  fontWeight: 500,
                  color: 'rgba(148,163,184,0.8)',
                  display: 'block',
                  marginBottom: 6,
                }}
              >
                Email Address
              </label>
              <input
                className="glass-input"
                type="email"
                placeholder="arjun@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label
                style={{
                  fontSize: 13,
                  fontWeight: 500,
                  color: 'rgba(148,163,184,0.8)',
                  display: 'block',
                  marginBottom: 6,
                }}
              >
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  className="glass-input"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ width: '100%', paddingRight: 40 }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: 10,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: 'rgba(148,163,184,0.8)',
                    cursor: 'pointer',
                    fontSize: 14,
                    padding: 4,
                  }}
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>
            {tab === 'register' && (
              <div>
                <label
                  style={{
                    fontSize: 13,
                    fontWeight: 500,
                    color: 'rgba(148,163,184,0.8)',
                    display: 'block',
                    marginBottom: 6,
                  }}
                >
                  Confirm Password
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    className="glass-input"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    style={{ width: '100%', paddingRight: 40 }}
                    required={tab === 'register'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={{
                      position: 'absolute',
                      right: 10,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: 'rgba(148,163,184,0.8)',
                      cursor: 'pointer',
                      fontSize: 14,
                      padding: 4,
                    }}
                    title={showConfirmPassword ? 'Hide password' : 'Show password'}
                  >
                    {showConfirmPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>
            )}
            {tab === 'login' && (
              <div style={{ textAlign: 'right' }}>
                <span
                  style={{ fontSize: 13, color: '#a78bfa', cursor: 'pointer' }}
                >
                  Forgot password?
                </span>
              </div>
            )}

            <button
              type="submit"
              className="btn-primary"
              style={{
                padding: '13px 0',
                fontSize: 15,
                marginTop: 4,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
              }}
              disabled={loading}
            >
              {loading ? (
                <span
                  style={{
                    display: 'inline-block',
                    width: 18,
                    height: 18,
                    border: '2px solid rgba(255,255,255,0.3)',
                    borderTopColor: 'white',
                    borderRadius: '50%',
                    animation: 'spin-slow 0.8s linear infinite',
                  }}
                />
              ) : tab === 'login' ? (
                'Sign In →'
              ) : (
                'Create Account →'
              )}
            </button>
          </form>

          {tab === 'login' && (
            <div style={{ marginTop: 24, textAlign: 'center' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  marginBottom: 16,
                }}
              >
                <div className="glass-divider" style={{ flex: 1 }} />
                <span style={{ fontSize: 12, color: 'rgba(148,163,184,0.4)' }}>
                  or continue with
                </span>
                <div className="glass-divider" style={{ flex: 1 }} />
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                {['Google', 'GitHub', 'LinkedIn'].map((p) => (
                  <button
                    key={p}
                    className="btn-ghost"
                    style={{ flex: 1, padding: '9px 0', fontSize: 12 }}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div
          style={{
            textAlign: 'center',
            marginTop: 20,
            fontSize: 12,
            color: 'rgba(148,163,184,0.4)',
          }}
        >
          Secure authentication
        </div>
      </div>
    </div>
  );
}
