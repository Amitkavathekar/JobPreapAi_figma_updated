import React, { useState } from "react";
// HMR Refresh trigger: 2026-09-18

export interface NotificationSettingItem {
  id: string;
  category: "interview" | "monetization" | "support" | "system";
  title: string;
  description: string;
  enabled: boolean;
  channel: "email" | "website";
}

const INITIAL_SETTINGS: NotificationSettingItem[] = [
  // 1. Monetization & Subscription Alerts
  {
    id: "notif-mon-1",
    category: "monetization",
    title: "Subscription Renewal Alert",
    description: "Send automated expiry notice 3 days prior to membership plan expiration.",
    enabled: true,
    channel: "email",
  },
  {
    id: "notif-mon-4",
    category: "monetization",
    title: "Exclusive Plan Coupon Announcement",
    description: "Notify eligible candidates when special discount coupons are active.",
    enabled: false,
    channel: "website",
  },

  // 2. Support Ticket Alerts
  {
    id: "notif-sup-2",
    category: "support",
    title: "Admin Ticket Response Alert",
    description: "Notify candidate immediately when support team posts a reply.",
    enabled: true,
    channel: "email",
  },

  // 3. System & Security Alerts
  {
    id: "notif-sys-3",
    category: "system",
    title: "System Maintenance Window Alert",
    description: "Broadcast planned system upgrade window to active candidates 24h prior.",
    enabled: true,
    channel: "website",
  },
];

export default function NotificationSettingsScreen() {
  const [settings, setSettings] = useState<NotificationSettingItem[]>(INITIAL_SETTINGS);
  const [activeTab, setActiveTab] = useState<"all" | "interview" | "monetization" | "support" | "system">("all");
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleToggleSetting = (id: string) => {
    setSettings((prev) =>
      prev.map((item) => (item.id === id ? { ...item, enabled: !item.enabled } : item))
    );
    showToast("Notification Setting Updated!");
  };

  const filteredSettings = activeTab === "all"
    ? settings
    : settings.filter((s) => s.category === activeTab);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Toast Notification */}
      {toastMsg && (
        <div
          style={{
            position: "fixed",
            top: 20,
            right: 20,
            zIndex: 1100,
            background: "rgba(16, 185, 129, 0.25)",
            border: "1px solid #10b981",
            color: "#34d399",
            padding: "10px 16px",
            borderRadius: 10,
            fontSize: 12,
            fontWeight: 700,
            backdropFilter: "blur(12px)",
            boxShadow: "0 8px 24px rgba(0,0,0,0.6)",
          }}
        >
          ✓ {toastMsg}
        </div>
      )}

      {/* Screen Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h3 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: "white" }}>

          </h3>
          <p style={{ margin: "4px 0 0", fontSize: 12, color: "#94a3b8" }}>
          </p>
        </div>
      </div>

      {/* CATEGORY FILTER TABS */}
      <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4 }}>
        {[
          { id: "all", label: "All Notifications", icon: "⚡" },
          { id: "monetization", label: "Subscription & Billing", icon: "💳" },
          { id: "support", label: "Support Tickets", icon: "🎧" },
          { id: "system", label: "System & Security", icon: "🛡" },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                padding: "8px 14px",
                borderRadius: 8,
                fontSize: 12,
                fontWeight: isActive ? 700 : 500,
                background: isActive ? "rgba(236, 72, 153, 0.2)" : "rgba(255,255,255,0.04)",
                border: isActive ? "1px solid #ec4899" : "1px solid rgba(255,255,255,0.08)",
                color: isActive ? "#f472b6" : "#cbd5e1",
                cursor: "pointer",
                whiteSpace: "nowrap",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* NOTIFICATION RULES LIST */}
      <div className="glass-card" style={{ padding: 22 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {filteredSettings.map((item) => (
            <div
              key={item.id}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: 14,
                borderRadius: 10,
                background: item.enabled ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.01)",
                border: item.enabled ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(255,255,255,0.04)",
                opacity: item.enabled ? 1 : 0.6,
                gap: 16,
              }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", gap: 12, flex: 1 }}>
                <input
                  type="checkbox"
                  checked={item.enabled}
                  onChange={() => handleToggleSetting(item.id)}
                  style={{ marginTop: 4, width: 16, height: 16, accentColor: "#ec4899", cursor: "pointer" }}
                />
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "white", display: "flex", alignItems: "center", gap: 8 }}>
                    <span>{item.title}</span>
                    <span
                      style={{
                        fontSize: 10,
                        fontFamily: "JetBrains Mono",
                        padding: "2px 6px",
                        borderRadius: 4,
                        textTransform: "uppercase",
                        fontWeight: 700,
                        background:
                          item.category === "interview"
                            ? "rgba(236, 72, 153, 0.15)"
                            : item.category === "monetization"
                              ? "rgba(234, 179, 8, 0.15)"
                              : item.category === "support"
                                ? "rgba(6, 182, 212, 0.15)"
                                : "rgba(168, 85, 247, 0.15)",
                        color:
                          item.category === "interview"
                            ? "#ec4899"
                            : item.category === "monetization"
                              ? "#fde047"
                              : item.category === "support"
                                ? "#67e8f9"
                                : "#c084fc",
                      }}
                    >
                      {item.category}
                    </span>
                  </div>
                  <p style={{ margin: "4px 0 0", fontSize: 12, color: "#94a3b8", lineHeight: 1.4 }}>
                    {item.description}
                  </p>
                </div>
              </div>

              {/* Delivery Channel Badge */}
              <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
                <span style={{ fontSize: 11, color: "#64748b" }}>Channel:</span>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    padding: "3px 8px",
                    borderRadius: 6,
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "white",
                  }}
                >
                  {item.channel === "email" ? "📧 Email" : "🌐 Website User Module Notification"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
