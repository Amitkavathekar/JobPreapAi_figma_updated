import React, { useState, useEffect } from "react";
import { PlanData } from "../types";

interface RazorpayCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: PlanData | null;
  onSuccess: (plan: PlanData) => void;
}

type PaymentTab = "recommended" | "upi" | "cards" | "netbanking" | "emi" | "wallets";

export default function RazorpayCheckoutModal({
  isOpen,
  onClose,
  plan,
  onSuccess,
}: RazorpayCheckoutModalProps) {
  const [activeTab, setActiveTab] = useState<PaymentTab>("recommended");
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
      setActiveTab("recommended");
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
        background: "rgba(10, 10, 25, 0.82)",
        backdropFilter: "blur(12px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 820,
          background: "#ffffff",
          borderRadius: 16,
          boxShadow: "0 25px 60px rgba(0,0,0,0.5)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          maxHeight: "90vh",
          fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
          color: "#1e293b",
        }}
      >
        {/* Top Razorpay Header Bar */}
        <div
          style={{
            background: "linear-gradient(135deg, #02042b, #0c1842)",
            padding: "16px 24px",
            color: "white",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                background: "#2563eb",
                color: "white",
                padding: "6px 12px",
                borderRadius: 8,
                fontWeight: 900,
                fontSize: 14,
                letterSpacing: "-0.02em",
              }}
            >
              Razorpay
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, display: "flex", alignItems: "center", gap: 8 }}>
                JobPrepAI Premium Subscription
                <span
                  style={{
                    background: "rgba(37, 99, 235, 0.25)",
                    border: "1px solid #3b82f6",
                    color: "#93c5fd",
                    fontSize: 10,
                    padding: "2px 8px",
                    borderRadius: 12,
                    fontWeight: 700,
                  }}
                >
                  256-Bit SSL
                </span>
              </div>
              <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>
                Subscribing to <strong style={{ color: "#38bdf8" }}>{plan.name} ({plan.duration})</strong> — Amount Payable: <strong style={{ color: "#34d399", fontSize: 13 }}>₹{plan.priceINR}</strong>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: "rgba(255,255,255,0.1)",
              border: "none",
              color: "white",
              fontSize: 18,
              width: 32,
              height: 32,
              borderRadius: "50%",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ✕
          </button>
        </div>

        {/* Modal Body / Payment Modes */}
        {paymentState === "processing" ? (
          <div style={{ padding: 60, textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
            <div
              style={{
                width: 64,
                height: 64,
                border: "5px solid #e2e8f0",
                borderTopColor: "#2563eb",
                borderRadius: "50%",
                animation: "spin 1s infinite linear",
              }}
            />
            <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
            <div>
              <h3 style={{ margin: 0, fontSize: 20, color: "#0f172a", fontWeight: 800 }}>Processing Payment of ₹{plan.priceINR}...</h3>
              <p style={{ margin: "6px 0 0", fontSize: 13, color: "#64748b" }}>Contacting bank and Razorpay gateway. Please do not close or refresh this page.</p>
            </div>
          </div>
        ) : paymentState === "success" ? (
          <div style={{ padding: 60, textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
            <div style={{ width: 72, height: 72, background: "#dcfce7", color: "#16a34a", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, fontWeight: 900 }}>
              ✓
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: 22, color: "#15803d", fontWeight: 800 }}>Payment Successful!</h3>
              <p style={{ margin: "6px 0 0", fontSize: 14, color: "#334155" }}>
                You have successfully subscribed to <strong>{plan.name}</strong>!
              </p>
              <div style={{ fontSize: 12, color: "#64748b", marginTop: 8, fontFamily: "monospace" }}>
                Payment ID: pay_{Math.random().toString(36).substring(2, 10).toUpperCase()}
              </div>
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", flex: 1, minHeight: 460, overflow: "hidden" }}>
            {/* Left Options Navigation List */}
            <div
              style={{
                width: "36%",
                background: "#f8fafc",
                borderRight: "1px solid #e2e8f0",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {[
                { id: "recommended", label: "Recommended", price: `₹${plan.priceINR}`, icon: "⭐" },
                { id: "upi", label: "UPI", price: `₹${plan.priceINR}`, icon: "📱", badge: "Fastest" },
                { id: "cards", label: "Cards", price: `₹${plan.priceINR}`, icon: "💳" },
                { id: "netbanking", label: "Netbanking", price: `₹${plan.priceINR}`, icon: "🏦" },
                { id: "emi", label: "EMI Options", price: `Save ₹2,999`, icon: "📅" },
                { id: "wallets", label: "Wallets", price: `₹${plan.priceINR}`, icon: "👛" },
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
                      padding: "16px 20px",
                      border: "none",
                      borderLeft: isActive ? "4px solid #2563eb" : "4px solid transparent",
                      background: isActive ? "#ffffff" : "transparent",
                      cursor: "pointer",
                      textAlign: "left",
                      transition: "all 0.15s ease",
                      borderBottom: "1px solid #f1f5f9",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ fontSize: 16 }}>{tab.icon}</span>
                      <span style={{ fontSize: 13, fontWeight: isActive ? 700 : 500, color: isActive ? "#0f172a" : "#475569" }}>
                        {tab.label}
                      </span>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: isActive ? "#2563eb" : "#64748b" }}>
                        {tab.price}
                      </span>
                      {tab.badge && (
                        <div style={{ fontSize: 9, background: "#dcfce7", color: "#15803d", padding: "1px 6px", borderRadius: 4, fontWeight: 800, marginTop: 2 }}>
                          {tab.badge}
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Right Main Payment Tab View */}
            <div style={{ width: "64%", padding: 24, overflowY: "auto", display: "flex", flexDirection: "column", gap: 20 }}>
              {/* Payment Offers Banner */}
              <div
                style={{
                  background: "#f0fdf4",
                  border: "1px solid #bbf7d0",
                  borderRadius: 12,
                  padding: "10px 14px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  fontSize: 12,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ background: "#16a34a", color: "white", padding: "2px 6px", borderRadius: 6, fontSize: 10, fontWeight: 800 }}>OFFER</span>
                  <span style={{ color: "#166534", fontWeight: 600 }}>Get up to ₹350 instant cashback via PhonePe & GPay</span>
                </div>
                <span style={{ color: "#2563eb", fontWeight: 700, cursor: "pointer" }}>View All</span>
              </div>

              {(activeTab === "recommended" || activeTab === "upi") && (
                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                  {/* Scan to Pay QR Section */}
                  <div
                    style={{
                      border: "1px solid #e2e8f0",
                      borderRadius: 14,
                      padding: 16,
                      background: "#ffffff",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                    }}
                  >
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#334155", marginBottom: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span>Scan QR to Pay with any UPI App</span>
                      <span style={{ fontSize: 11, color: "#dc2626", fontWeight: 700, background: "#fef2f2", padding: "2px 8px", borderRadius: 8 }}>
                        Valid for {formatTimer(timerSeconds)} mins
                      </span>
                    </div>

                    <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
                      {/* Dynamic QR Code Box */}
                      <div
                        style={{
                          width: 130,
                          height: 130,
                          padding: 8,
                          border: "2px solid #2563eb",
                          borderRadius: 12,
                          background: "#ffffff",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <img
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=upi://pay?pa=jobprepai@razorpay%26pn=JobPrepAI%26am=${plan.priceINR}%26cu=INR`}
                          alt="Razorpay UPI QR Code"
                          style={{ width: "100%", height: "100%", borderRadius: 6 }}
                        />
                      </div>

                      <div style={{ display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
                        <div style={{ fontSize: 12, color: "#475569" }}>
                          Open <strong>Google Pay, PhonePe, Paytm, BHIM</strong> or any banking UPI app to scan and complete payment.
                        </div>

                        {/* Supported App Badges */}
                        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                          <span style={{ background: "#f1f5f9", padding: "4px 8px", borderRadius: 6, fontSize: 11, fontWeight: 700, color: "#4285f4" }}>Google Pay</span>
                          <span style={{ background: "#f1f5f9", padding: "4px 8px", borderRadius: 6, fontSize: 11, fontWeight: 700, color: "#5f259f" }}>PhonePe</span>
                          <span style={{ background: "#f1f5f9", padding: "4px 8px", borderRadius: 6, fontSize: 11, fontWeight: 700, color: "#00b9f1" }}>Paytm</span>
                          <span style={{ background: "#f1f5f9", padding: "4px 8px", borderRadius: 6, fontSize: 11, fontWeight: 700, color: "#e65100" }}>BHIM UPI</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Or Enter UPI ID / VPA */}
                  <form onSubmit={handleUpiSubmit} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    <label style={{ fontSize: 13, fontWeight: 700, color: "#334155" }}>
                      Pay via UPI ID / Mobile Number:
                    </label>
                    <div style={{ display: "flex", gap: 8 }}>
                      <input
                        type="text"
                        placeholder="e.g. mobile@paytm or name@ybl"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        style={{
                          flex: 1,
                          padding: "12px 14px",
                          border: upiError ? "1px solid #ef4444" : "1px solid #cbd5e1",
                          borderRadius: 8,
                          fontSize: 13,
                          outline: "none",
                        }}
                      />
                      <button
                        type="submit"
                        style={{
                          padding: "12px 20px",
                          background: "#2563eb",
                          color: "white",
                          border: "none",
                          borderRadius: 8,
                          fontWeight: 700,
                          fontSize: 13,
                          cursor: "pointer",
                          whiteSpace: "nowrap",
                        }}
                      >
                        Verify & Pay ₹{plan.priceINR}
                      </button>
                    </div>
                    {upiError && <div style={{ fontSize: 11, color: "#dc2626" }}>{upiError}</div>}
                  </form>
                </div>
              )}

              {activeTab === "cards" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#334155" }}>
                    Enter Credit or Debit Card Details:
                  </div>

                  <div>
                    <label style={{ fontSize: 11, fontWeight: 600, color: "#64748b" }}>CARD NUMBER</label>
                    <input
                      type="text"
                      placeholder="4532 •••• •••• 8901"
                      maxLength={19}
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      style={{ width: "100%", padding: 11, marginTop: 4, border: "1px solid #cbd5e1", borderRadius: 8, fontSize: 13, outline: "none" }}
                    />
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <div>
                      <label style={{ fontSize: 11, fontWeight: 600, color: "#64748b" }}>EXPIRY (MM/YY)</label>
                      <input
                        type="text"
                        placeholder="MM / YY"
                        maxLength={5}
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        style={{ width: "100%", padding: 11, marginTop: 4, border: "1px solid #cbd5e1", borderRadius: 8, fontSize: 13, outline: "none" }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: 11, fontWeight: 600, color: "#64748b" }}>CVV</label>
                      <input
                        type="password"
                        placeholder="123"
                        maxLength={4}
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        style={{ width: "100%", padding: 11, marginTop: 4, border: "1px solid #cbd5e1", borderRadius: 8, fontSize: 13, outline: "none" }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: 11, fontWeight: 600, color: "#64748b" }}>NAME ON CARD</label>
                    <input
                      type="text"
                      placeholder="Name as printed on card"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      style={{ width: "100%", padding: 11, marginTop: 4, border: "1px solid #cbd5e1", borderRadius: 8, fontSize: 13, outline: "none" }}
                    />
                  </div>

                  <button
                    onClick={handlePay}
                    style={{
                      width: "100%",
                      padding: 13,
                      background: "#2563eb",
                      color: "white",
                      border: "none",
                      borderRadius: 8,
                      fontWeight: 700,
                      fontSize: 14,
                      cursor: "pointer",
                      marginTop: 8,
                    }}
                  >
                    Pay ₹{plan.priceINR} Securely 🔒
                  </button>
                </div>
              )}

              {activeTab === "netbanking" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#334155" }}>
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
                          padding: "12px 8px",
                          border: selectedBank === bank ? "2px solid #2563eb" : "1px solid #e2e8f0",
                          borderRadius: 8,
                          background: selectedBank === bank ? "#eff6ff" : "#f8fafc",
                          fontSize: 12,
                          fontWeight: 600,
                          color: "#1e293b",
                          cursor: "pointer",
                          textAlign: "center",
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
                      background: "#2563eb",
                      color: "white",
                      border: "none",
                      borderRadius: 8,
                      fontWeight: 700,
                      fontSize: 14,
                      cursor: "pointer",
                      marginTop: 10,
                    }}
                  >
                    Proceed to Bank Payment →
                  </button>
                </div>
              )}

              {(activeTab === "emi" || activeTab === "wallets") && (
                <div style={{ display: "flex", flexDirection: "column", gap: 14, textAlign: "center", padding: 20 }}>
                  <div style={{ fontSize: 32 }}>👛</div>
                  <h4 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>Wallets & No-Cost EMI Options Available</h4>
                  <p style={{ margin: 0, fontSize: 12, color: "#64748b" }}>
                    Pay securely using Paytm Wallet, Mobikwik, Amazon Pay Balance, or 3/6 Months Credit Card EMI.
                  </p>
                  <button
                    onClick={handlePay}
                    style={{
                      padding: "12px 24px",
                      background: "#2563eb",
                      color: "white",
                      border: "none",
                      borderRadius: 8,
                      fontWeight: 700,
                      fontSize: 13,
                      cursor: "pointer",
                      margin: "10px auto 0",
                    }}
                  >
                    Pay ₹{plan.priceINR} via Selected Wallet
                  </button>
                </div>
              )}

              {/* Bottom Guarantee */}
              <div style={{ borderTop: "1px solid #f1f5f9", paddingTop: 14, display: "flex", justifyContent: "space-between", fontSize: 11, color: "#94a3b8" }}>
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
