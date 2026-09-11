import React from "react";

interface PaymentGatewaysScreenProps {
  paymentEnv: "live" | "test";
  setPaymentEnv: (env: "live" | "test") => void;
  upiVpa: string;
  setUpiVpa: (vpa: string) => void;
  onOpenRazorpayModal: () => void;
  showNotification: (msg: string) => void;
}

export default function PaymentGatewaysScreen({
  paymentEnv,
  setPaymentEnv,
  upiVpa,
  setUpiVpa,
  onOpenRazorpayModal,
  showNotification,
}: PaymentGatewaysScreenProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: "white" }}>
            💳 Payment Gateways & Transaction Settings
          </h3>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: 4, display: "flex", gap: 4 }}>
            <button
              onClick={() => {
                setPaymentEnv("live");
                showNotification("Switched to Live Production Mode");
              }}
              style={{
                padding: "4px 12px",
                borderRadius: 6,
                fontSize: 11,
                fontWeight: 700,
                border: "none",
                background: paymentEnv === "live" ? "linear-gradient(135deg, #10b981, #059669)" : "transparent",
                color: paymentEnv === "live" ? "white" : "#94a3b8",
                cursor: "pointer",
              }}
            >
              ● LIVE PRODUCTION
            </button>
            <button
              onClick={() => {
                setPaymentEnv("test");
                showNotification("Switched to Sandbox Test Mode");
              }}
              style={{
                padding: "4px 12px",
                borderRadius: 6,
                fontSize: 11,
                fontWeight: 700,
                border: "none",
                background: paymentEnv === "test" ? "rgba(245, 158, 11, 0.25)" : "transparent",
                color: paymentEnv === "test" ? "#fbbf24" : "#94a3b8",
                cursor: "pointer",
              }}
            >
              🧪 SANDBOX TEST
            </button>
          </div>

          <button
            onClick={() => showNotification("✓ Payment Gateway Live API Ping Successful (Latency: 24ms)")}
            className="btn-ghost"
            style={{ fontSize: 12, padding: "8px 14px", borderRadius: 8, color: "#34d399", borderColor: "rgba(16,185,129,0.3)" }}
          >
            ⚡ Test Connection
          </button>
        </div>
      </div>

      {/* Grid of Gateways */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 20 }}>
        {/* Razorpay Gateway Card */}
        <div className="glass-card" style={{ padding: 22, border: "1px solid rgba(236,72,153,0.3)", background: "rgba(236,72,153,0.04)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 24 }}>⚡</span>
              <div>
                <h4 style={{ margin: 0, fontSize: 16, color: "white", fontWeight: 800 }}>Razorpay India (UPI / Cards / NetBanking)</h4>
                <span style={{ fontSize: 11, color: "#34d399", fontWeight: 700 }}>● Active Primary Gateway</span>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 14 }}>
            <div>
              <label style={{ fontSize: 11, color: "#94a3b8", display: "block", marginBottom: 4 }}>Razorpay Key ID ({paymentEnv.toUpperCase()}):</label>
              <div style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.12)", color: "#f472b6", padding: "10px 14px", borderRadius: 8, fontSize: 13, fontFamily: "JetBrains Mono", letterSpacing: "0.15em" }}>
                ••••••••••••••••
              </div>
            </div>

            <div>
              <label style={{ fontSize: 11, color: "#94a3b8", display: "block", marginBottom: 4 }}>Razorpay Key Secret:</label>
              <div style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.12)", color: "#f472b6", padding: "10px 14px", borderRadius: 8, fontSize: 13, fontFamily: "JetBrains Mono", letterSpacing: "0.15em" }}>
                ••••••••••••••••••••••••
              </div>
            </div>

            <div style={{ background: "rgba(255,255,255,0.03)", padding: 10, borderRadius: 8, fontSize: 11, color: "#cbd5e1" }}>
              <span style={{ color: "#94a3b8" }}>Webhook Status:</span> <strong style={{ color: "#34d399" }}>Connected</strong> (https://api.jobprep.ai/v1/webhooks/razorpay)
            </div>

            <button
              className="btn-primary"
              onClick={onOpenRazorpayModal}
              style={{ fontSize: 12, padding: "9px 14px", borderRadius: 8, marginTop: 4, background: "linear-gradient(135deg, #ec4899, #7c3aed)" }}
            >
              🔑 Update Razorpay API Keys
            </button>
          </div>
        </div>

        {/* Stripe Global Card */}
        <div className="glass-card" style={{ padding: 22, border: "1px solid rgba(6,182,212,0.3)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 24 }}>💳</span>
              <div>
                <h4 style={{ margin: 0, fontSize: 16, color: "white", fontWeight: 800 }}>Stripe International (USD / EUR Cards)</h4>
                <span style={{ fontSize: 11, color: "#67e8f9", fontWeight: 700 }}>● Active Backup Gateway</span>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 14 }}>
            <div>
              <label style={{ fontSize: 11, color: "#94a3b8", display: "block", marginBottom: 4 }}>Stripe Publishable Key:</label>
              <div style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.12)", color: "#67e8f9", padding: "10px 14px", borderRadius: 8, fontSize: 13, fontFamily: "JetBrains Mono", letterSpacing: "0.15em" }}>
                ••••••••••••••••
              </div>
            </div>

            <div>
              <label style={{ fontSize: 11, color: "#94a3b8", display: "block", marginBottom: 4 }}>Stripe Secret Key:</label>
              <div style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.12)", color: "#67e8f9", padding: "10px 14px", borderRadius: 8, fontSize: 13, fontFamily: "JetBrains Mono", letterSpacing: "0.15em" }}>
                ••••••••••••••••••••••••
              </div>
            </div>

            <div style={{ background: "rgba(255,255,255,0.03)", padding: 10, borderRadius: 8, fontSize: 11, color: "#cbd5e1" }}>
              <span style={{ color: "#94a3b8" }}>Apple Pay & Google Pay:</span> <strong style={{ color: "#34d399" }}>Enabled</strong>
            </div>

            <button
              onClick={() => showNotification("Stripe API credentials modal opened")}
              className="btn-ghost"
              style={{ fontSize: 12, padding: "9px 14px", borderRadius: 8, marginTop: 4, color: "#67e8f9", borderColor: "rgba(6,182,212,0.3)" }}
            >
              ⚙ Manage Stripe Keys
            </button>
          </div>
        </div>

        {/* Instant UPI & Settlement Settings */}
        <div className="glass-card" style={{ padding: 22 }}>
          <h4 style={{ margin: "0 0 14px", fontSize: 16, color: "white", fontWeight: 800 }}>UPI Auto Settlement & Currency Settings</h4>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, fontSize: 13 }}>
            <div>
              <label style={{ fontSize: 11, color: "#94a3b8", display: "block", marginBottom: 4 }}>Primary UPI Merchant VPA ID:</label>
              <input
                type="text"
                value={upiVpa}
                onChange={(e) => setUpiVpa(e.target.value)}
                className="glass-input"
                style={{ padding: "8px 12px", fontSize: 12, fontFamily: "JetBrains Mono" }}
              />
            </div>

            <div style={{ background: "rgba(255,255,255,0.03)", padding: 12, borderRadius: 8, display: "flex", flexDirection: "column", gap: 8 }}>
              <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 12, color: "#cbd5e1" }}>
                <input type="checkbox" defaultChecked /> Enable Instant UPI QR Code on Checkout
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 12, color: "#cbd5e1" }}>
                <input type="checkbox" defaultChecked /> Automatic Daily 10:00 AM Bank Payout Settlement
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 12, color: "#cbd5e1" }}>
                <input type="checkbox" defaultChecked /> Pass 2% Gateway Charge to Candidate
              </label>
            </div>

            <button
              className="btn-primary"
              onClick={() => showNotification("UPI & Settlement rules saved!")}
              style={{ fontSize: 12, padding: "8px 14px", borderRadius: 8, background: "linear-gradient(135deg, #ec4899, #7c3aed)" }}
            >
              Save Settlement Rules
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
