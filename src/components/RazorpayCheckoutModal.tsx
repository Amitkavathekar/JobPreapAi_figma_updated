import React, { useState, useEffect } from "react";
import { PlanData } from "../types";

interface RazorpayCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: PlanData | null;
  onSuccess: (plan: PlanData) => void;
}

type PaymentTab = "upi" | "cards" | "netbanking" | "wallets" | "paylater";

export default function RazorpayCheckoutModal({
  isOpen,
  onClose,
  plan,
  onSuccess,
}: RazorpayCheckoutModalProps) {
  const [activeTab, setActiveTab] = useState<PaymentTab>("upi");
  const [upiId, setUpiId] = useState("");
  const [upiError, setUpiError] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [cardName, setCardName] = useState("");
  const [selectedBank, setSelectedBank] = useState("");

  const [paymentState, setPaymentState] = useState<"idle" | "processing" | "success">("idle");
  const [timerSeconds, setTimerSeconds] = useState(720); // 12 mins

  // Countdown timer for QR code validity
  useEffect(() => {
    if (!isOpen || paymentState !== "idle") return;
    const interval = setInterval(() => {
      setTimerSeconds((prev) => (prev > 0 ? prev - 1 : 720));
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen, paymentState]);

  // Reset modal state on open
  useEffect(() => {
    if (isOpen) {
      setPaymentState("idle");
      setActiveTab("upi");
      setUpiId("");
      setUpiError("");
      setTimerSeconds(720);
    }
  }, [isOpen]);

  if (!isOpen || !plan) return null;

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const handlePay = () => {
    setPaymentState("processing");
    setTimeout(() => {
      setPaymentState("success");
      setTimeout(() => {
        onSuccess(plan);
        onClose();
      }, 1800);
    }, 2000);
  };

  const handleUpiSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!upiId || !upiId.includes("@")) {
      setUpiError("Please enter a valid UPI ID (e.g. name@upi or 9876543210@paytm)");
      return;
    }
    setUpiError("");
    handlePay();
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1100,
        background: "rgba(5, 5, 18, 0.88)",
        backdropFilter: "blur(16px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 840,
          background: "rgba(13, 13, 34, 0.96)",
          borderRadius: 20,
          border: "1px solid rgba(236, 72, 153, 0.35)",
          boxShadow: "0 25px 70px rgba(0,0,0,0.8), 0 0 50px rgba(236, 72, 153, 0.15)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          maxHeight: "92vh",
          fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
          color: "#ffffff",
        }}
      >
        {/* Top Header Bar */}
        <div
          style={{
            background: "linear-gradient(135deg, rgba(236, 72, 153, 0.18), rgba(139, 92, 246, 0.18))",
            padding: "16px 24px",
            color: "white",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div
              style={{
                background: "linear-gradient(135deg, #ec4899, #8b5cf6)",
                color: "white",
                padding: "6px 14px",
                borderRadius: 8,
                fontWeight: 900,
                fontSize: 14,
                letterSpacing: "-0.02em",
                boxShadow: "0 2px 10px rgba(236, 72, 153, 0.4)",
              }}
            >
              Razorpay
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 800, display: "flex", alignItems: "center", gap: 10 }}>
                JobPrepAI Premium Subscription
                <span
                  style={{
                    background: "rgba(56, 189, 248, 0.18)",
                    border: "1px solid rgba(56, 189, 248, 0.4)",
                    color: "#38bdf8",
                    fontSize: 10,
                    padding: "2px 8px",
                    borderRadius: 12,
                    fontWeight: 700,
                    fontFamily: "JetBrains Mono",
                  }}
                >
                  256-BIT SSL SECURE
                </span>
              </div>
              <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 3 }}>
                Subscribing to <strong style={{ color: "#ec4899" }}>{plan.name} ({plan.duration})</strong> — Amount Payable: <strong style={{ color: "#34d399", fontSize: 13 }}>₹{plan.priceINR}</strong>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.15)",
              color: "white",
              fontSize: 18,
              width: 34,
              height: 34,
              borderRadius: "50%",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(244, 63, 94, 0.3)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.08)")}
          >
            ✕
          </button>
        </div>

        {/* Modal Body / Payment Modes */}
        {paymentState === "processing" ? (
          <div style={{ padding: "70px 40px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
            <div
              style={{
                width: 64,
                height: 64,
                border: "5px solid rgba(255,255,255,0.1)",
                borderTopColor: "#ec4899",
                borderRadius: "50%",
                animation: "spin 1s infinite linear",
                boxShadow: "0 0 20px rgba(236, 72, 153, 0.4)",
              }}
            />
            <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
            <div>
              <h3 style={{ margin: 0, fontSize: 20, color: "white", fontWeight: 800 }}>Processing Payment of ₹{plan.priceINR}...</h3>
              <p style={{ margin: "8px 0 0", fontSize: 13, color: "#94a3b8" }}>Connecting to Razorpay Bank Gateway. Please do not close or refresh this window.</p>
            </div>
          </div>
        ) : paymentState === "success" ? (
          <div style={{ padding: "70px 40px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
            <div style={{ width: 72, height: 72, background: "rgba(52, 211, 153, 0.2)", border: "2px solid #34d399", color: "#34d399", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, fontWeight: 900, boxShadow: "0 0 30px rgba(52, 211, 153, 0.4)" }}>
              ✓
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: 22, color: "#34d399", fontWeight: 800 }}>Payment Successful!</h3>
              <p style={{ margin: "8px 0 0", fontSize: 14, color: "#cbd5e1" }}>
                You have successfully unlocked <strong style={{ color: "#ec4899" }}>{plan.name}</strong>!
              </p>
              <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 10, fontFamily: "JetBrains Mono", background: "rgba(255,255,255,0.05)", padding: "6px 14px", borderRadius: 8, display: "inline-block" }}>
                Razorpay Payment ID: pay_{Math.random().toString(36).substring(2, 10).toUpperCase()}
              </div>
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", flex: 1, minHeight: 460, overflow: "hidden" }}>
            {/* Left Options Navigation List */}
            <div
              style={{
                width: "35%",
                background: "rgba(10, 10, 26, 0.8)",
                borderRight: "1px solid rgba(255, 255, 255, 0.08)",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {[
                { id: "upi", label: "UPI (Apps & QR)", price: `₹${plan.priceINR}`, icon: "📱", badge: "Fastest" },
                { id: "cards", label: "Credit & Debit Cards", price: `₹${plan.priceINR}`, icon: "💳" },
                { id: "netbanking", label: "Netbanking", price: `₹${plan.priceINR}`, icon: "🏦" },
                { id: "wallets", label: "Wallets", price: `₹${plan.priceINR}`, icon: "👛" },
                { id: "paylater", label: "Pay Later", price: `₹${plan.priceINR}`, icon: "⏱️", badge: "Credit" },
              ].map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as PaymentTab)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "18px 20px",
                      border: "none",
                      borderLeft: isActive ? "4px solid #ec4899" : "4px solid transparent",
                      background: isActive ? "linear-gradient(90deg, rgba(236, 72, 153, 0.2), rgba(139, 92, 246, 0.1))" : "transparent",
                      cursor: "pointer",
                      textAlign: "left",
                      transition: "all 0.2s ease",
                      borderBottom: "1px solid rgba(255,255,255,0.05)",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <span style={{ fontSize: 18 }}>{tab.icon}</span>
                      <span style={{ fontSize: 13, fontWeight: isActive ? 700 : 500, color: isActive ? "#ffffff" : "#94a3b8" }}>
                        {tab.label}
                      </span>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: isActive ? "#ec4899" : "#64748b", fontFamily: "JetBrains Mono" }}>
                        {tab.price}
                      </span>
                      {tab.badge && (
                        <div style={{ fontSize: 9, background: "rgba(52, 211, 153, 0.2)", color: "#34d399", padding: "1px 6px", borderRadius: 4, fontWeight: 800, marginTop: 2, fontFamily: "JetBrains Mono" }}>
                          {tab.badge}
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Right Main Payment Tab View */}
            <div style={{ width: "65%", padding: 24, overflowY: "auto", display: "flex", flexDirection: "column", gap: 20, background: "rgba(15, 15, 36, 0.4)" }}>
              {activeTab === "upi" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                  {/* Scan to Pay QR Section */}
                  <div
                    style={{
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: 14,
                      padding: 18,
                      background: "rgba(255,255,255,0.03)",
                      boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
                    }}
                  >
                    <div style={{ fontSize: 13, fontWeight: 700, color: "white", marginBottom: 14, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span>Scan QR Code with any UPI App</span>
                      <span style={{ fontSize: 11, color: "#fb7185", fontWeight: 700, background: "rgba(244, 63, 94, 0.15)", border: "1px solid rgba(244, 63, 94, 0.3)", padding: "2px 8px", borderRadius: 8, fontFamily: "JetBrains Mono" }}>
                        Valid for {formatTimer(timerSeconds)} mins
                      </span>
                    </div>

                    <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
                      {/* Dynamic QR Code Box */}
                      <div
                        style={{
                          width: 135,
                          height: 135,
                          padding: 8,
                          border: "2px solid #ec4899",
                          borderRadius: 12,
                          background: "#ffffff",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          boxShadow: "0 0 20px rgba(236, 72, 153, 0.25)",
                        }}
                      >
                        <img
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=upi://pay?pa=jobprepai@razorpay%26pn=JobPrepAI%26am=${plan.priceINR}%26cu=INR`}
                          alt="Razorpay UPI QR Code"
                          style={{ width: "100%", height: "100%", borderRadius: 6 }}
                        />
                      </div>

                      <div style={{ display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
                        <div style={{ fontSize: 12, color: "#cbd5e1" }}>
                          Open <strong>Google Pay, PhonePe, Paytm, BHIM</strong> or any banking app to scan and complete payment.
                        </div>

                        {/* Supported App Badges */}
                        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                          <span style={{ background: "rgba(66, 133, 244, 0.15)", border: "1px solid rgba(66, 133, 244, 0.3)", padding: "4px 8px", borderRadius: 6, fontSize: 11, fontWeight: 700, color: "#60a5fa" }}>Google Pay</span>
                          <span style={{ background: "rgba(139, 92, 246, 0.15)", border: "1px solid rgba(139, 92, 246, 0.3)", padding: "4px 8px", borderRadius: 6, fontSize: 11, fontWeight: 700, color: "#c084fc" }}>PhonePe</span>
                          <span style={{ background: "rgba(56, 189, 248, 0.15)", border: "1px solid rgba(56, 189, 248, 0.3)", padding: "4px 8px", borderRadius: 6, fontSize: 11, fontWeight: 700, color: "#38bdf8" }}>Paytm</span>
                          <span style={{ background: "rgba(245, 158, 11, 0.15)", border: "1px solid rgba(245, 158, 11, 0.3)", padding: "4px 8px", borderRadius: 6, fontSize: 11, fontWeight: 700, color: "#fbbf24" }}>BHIM UPI</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Or Enter UPI ID / VPA */}
                  <form onSubmit={handleUpiSubmit} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    <label style={{ fontSize: 13, fontWeight: 700, color: "white" }}>
                      Or Pay via UPI ID / Mobile Number:
                    </label>
                    <div style={{ display: "flex", gap: 8 }}>
                      <input
                        type="text"
                        placeholder="e.g. mobile@paytm or name@ybl"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        className="glass-input"
                        style={{
                          flex: 1,
                          padding: "12px 14px",
                          border: upiError ? "1px solid #ef4444" : "1px solid rgba(255,255,255,0.15)",
                          background: "rgba(255,255,255,0.06)",
                          color: "white",
                          borderRadius: 10,
                          fontSize: 13,
                          outline: "none",
                        }}
                      />
                      <button
                        type="submit"
                        className="btn-primary"
                        style={{
                          padding: "12px 22px",
                          background: "linear-gradient(135deg, #ec4899, #7c3aed)",
                          color: "white",
                          border: "none",
                          borderRadius: 10,
                          fontWeight: 700,
                          fontSize: 13,
                          cursor: "pointer",
                          whiteSpace: "nowrap",
                          boxShadow: "0 4px 15px rgba(236, 72, 153, 0.3)",
                        }}
                      >
                        Verify & Pay ₹{plan.priceINR}
                      </button>
                    </div>
                    {upiError && <div style={{ fontSize: 11, color: "#f87171" }}>{upiError}</div>}
                  </form>
                </div>
              )}

              {activeTab === "cards" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "white" }}>
                    Enter Credit or Debit Card Details:
                  </div>

                  <div>
                    <label style={{ fontSize: 11, fontWeight: 600, color: "#94a3b8" }}>CARD NUMBER</label>
                    <input
                      type="text"
                      placeholder="4532 •••• •••• 8901"
                      maxLength={19}
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      style={{ width: "100%", padding: 11, marginTop: 4, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.15)", color: "white", borderRadius: 8, fontSize: 13, outline: "none" }}
                    />
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <div>
                      <label style={{ fontSize: 11, fontWeight: 600, color: "#94a3b8" }}>EXPIRY (MM/YY)</label>
                      <input
                        type="text"
                        placeholder="MM / YY"
                        maxLength={5}
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        style={{ width: "100%", padding: 11, marginTop: 4, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.15)", color: "white", borderRadius: 8, fontSize: 13, outline: "none" }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: 11, fontWeight: 600, color: "#94a3b8" }}>CVV</label>
                      <input
                        type="password"
                        placeholder="123"
                        maxLength={4}
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        style={{ width: "100%", padding: 11, marginTop: 4, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.15)", color: "white", borderRadius: 8, fontSize: 13, outline: "none" }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: 11, fontWeight: 600, color: "#94a3b8" }}>NAME ON CARD</label>
                    <input
                      type="text"
                      placeholder="Name as printed on card"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      style={{ width: "100%", padding: 11, marginTop: 4, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.15)", color: "white", borderRadius: 8, fontSize: 13, outline: "none" }}
                    />
                  </div>

                  <button
                    onClick={handlePay}
                    style={{
                      width: "100%",
                      padding: 13,
                      background: "linear-gradient(135deg, #ec4899, #7c3aed)",
                      color: "white",
                      border: "none",
                      borderRadius: 10,
                      fontWeight: 800,
                      fontSize: 14,
                      cursor: "pointer",
                      marginTop: 8,
                      boxShadow: "0 4px 15px rgba(236, 72, 153, 0.3)",
                    }}
                  >
                    Pay ₹{plan.priceINR} Securely 🔒
                  </button>
                </div>
              )}

              {activeTab === "netbanking" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "white" }}>
                    Select Popular Indian Banks:
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
                    {["HDFC Bank", "ICICI Bank", "State Bank of India", "Axis Bank", "Kotak Bank", "Punjab National Bank"].map((bank) => (
                      <button
                        key={bank}
                        onClick={() => {
                          setSelectedBank(bank);
                          handlePay();
                        }}
                        style={{
                          padding: "14px 10px",
                          border: selectedBank === bank ? "2px solid #ec4899" : "1px solid rgba(255,255,255,0.1)",
                          borderRadius: 10,
                          background: selectedBank === bank ? "rgba(236,72,153,0.15)" : "rgba(255,255,255,0.04)",
                          fontSize: 12,
                          fontWeight: 600,
                          color: "white",
                          cursor: "pointer",
                          textAlign: "center",
                          transition: "all 0.2s ease",
                        }}
                      >
                        {bank}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={handlePay}
                    style={{
                      width: "100%",
                      padding: 13,
                      background: "linear-gradient(135deg, #ec4899, #7c3aed)",
                      color: "white",
                      border: "none",
                      borderRadius: 10,
                      fontWeight: 800,
                      fontSize: 14,
                      cursor: "pointer",
                      marginTop: 10,
                      boxShadow: "0 4px 15px rgba(236, 72, 153, 0.3)",
                    }}
                  >
                    Proceed to Bank Payment →
                  </button>
                </div>
              )}

              {activeTab === "wallets" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 14, textAlign: "center", padding: 20 }}>
                  <div style={{ fontSize: 36 }}>👛</div>
                  <h4 style={{ margin: 0, fontSize: 17, fontWeight: 800, color: "white" }}>Digital Wallets Available</h4>
                  <p style={{ margin: 0, fontSize: 13, color: "#94a3b8" }}>
                    Pay securely using Paytm Wallet, PhonePe Wallet, Mobikwik, or Amazon Pay Balance.
                  </p>
                  <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap", marginTop: 6 }}>
                    {["Paytm Wallet", "PhonePe Wallet", "Mobikwik", "Amazon Pay"].map((w) => (
                      <span key={w} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", padding: "6px 12px", borderRadius: 8, fontSize: 12, fontWeight: 600 }}>
                        {w}
                      </span>
                    ))}
                  </div>
                  <button
                    onClick={handlePay}
                    style={{
                      padding: "12px 28px",
                      background: "linear-gradient(135deg, #ec4899, #7c3aed)",
                      color: "white",
                      border: "none",
                      borderRadius: 10,
                      fontWeight: 800,
                      fontSize: 14,
                      cursor: "pointer",
                      margin: "12px auto 0",
                      boxShadow: "0 4px 15px rgba(236, 72, 153, 0.3)",
                    }}
                  >
                    Pay ₹{plan.priceINR} via Selected Wallet
                  </button>
                </div>
              )}

              {activeTab === "paylater" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 14, textAlign: "center", padding: 20 }}>
                  <div style={{ fontSize: 36 }}>⏱️</div>
                  <h4 style={{ margin: 0, fontSize: 17, fontWeight: 800, color: "white" }}>Pay Later Options Available</h4>
                  <p style={{ margin: 0, fontSize: 13, color: "#94a3b8" }}>
                    Get instant credit and pay next month with 0% extra interest via LazyPay, Simpl, ICICI PayLater, or FlexiPay.
                  </p>
                  <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap", marginTop: 6 }}>
                    {["LazyPay", "Simpl", "ICICI PayLater", "FlexiPay"].map((pl) => (
                      <span key={pl} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", padding: "6px 12px", borderRadius: 8, fontSize: 12, fontWeight: 600 }}>
                        {pl}
                      </span>
                    ))}
                  </div>
                  <button
                    onClick={handlePay}
                    style={{
                      padding: "12px 28px",
                      background: "linear-gradient(135deg, #ec4899, #7c3aed)",
                      color: "white",
                      border: "none",
                      borderRadius: 10,
                      fontWeight: 800,
                      fontSize: 14,
                      cursor: "pointer",
                      margin: "12px auto 0",
                      boxShadow: "0 4px 15px rgba(236, 72, 153, 0.3)",
                    }}
                  >
                    Proceed with Pay Later →
                  </button>
                </div>
              )}

              {/* Bottom Guarantee */}
              <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 14, display: "flex", justifyContent: "space-between", fontSize: 11, color: "#94a3b8" }}>
                <span>🔒 Powered by Razorpay 256-Bit SSL</span>
                <span>⚡ Instant Membership Activation</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
