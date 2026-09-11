import React from "react";

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  consequenceWarning?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDanger?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export default function ConfirmationModal({
  isOpen,
  title,
  message,
  consequenceWarning,
  confirmLabel = "Confirm Action",
  cancelLabel = "Cancel",
  isDanger = true,
  onConfirm,
  onClose,
}: ConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        background: "rgba(5, 5, 16, 0.82)",
        backdropFilter: "blur(12px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
    >
      <div
        className="glass-card"
        style={{
          width: "100%",
          maxWidth: 460,
          borderRadius: 16,
          border: isDanger ? "1px solid rgba(239, 68, 68, 0.4)" : "1px solid rgba(245, 158, 11, 0.4)",
          background: "rgba(15, 15, 36, 0.95)",
          boxShadow: "0 20px 50px rgba(0, 0, 0, 0.9)",
          overflow: "hidden",
          padding: 24,
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: "50%",
              background: isDanger ? "rgba(239, 68, 68, 0.15)" : "rgba(245, 158, 11, 0.15)",
              border: isDanger ? "1px solid rgba(239, 68, 68, 0.4)" : "1px solid rgba(245, 158, 11, 0.4)",
              color: isDanger ? "#f87171" : "#fbbf24",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 22,
              flexShrink: 0,
            }}
          >
            ⚠️
          </div>

          <div style={{ flex: 1 }}>
            <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: "white" }}>{title}</h3>
            <p style={{ margin: "8px 0 0", fontSize: 13, color: "#cbd5e1", lineHeight: 1.5 }}>
              {message}
            </p>

            {consequenceWarning && (
              <div
                style={{
                  marginTop: 12,
                  padding: "10px 12px",
                  borderRadius: 8,
                  background: isDanger ? "rgba(239, 68, 68, 0.1)" : "rgba(245, 158, 11, 0.1)",
                  border: isDanger ? "1px solid rgba(239, 68, 68, 0.25)" : "1px solid rgba(245, 158, 11, 0.25)",
                  color: isDanger ? "#fca5a5" : "#fde047",
                  fontSize: 12,
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <span>ℹ</span>
                <span>{consequenceWarning}</span>
              </div>
            )}
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 24 }}>
          <button
            onClick={onClose}
            className="btn-ghost"
            style={{ padding: "8px 16px", fontSize: 13, borderRadius: 8 }}
          >
            {cancelLabel}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            style={{
              padding: "8px 18px",
              fontSize: 13,
              borderRadius: 8,
              border: "none",
              background: isDanger ? "linear-gradient(135deg, #ef4444, #dc2626)" : "linear-gradient(135deg, #f59e0b, #d97706)",
              color: "white",
              fontWeight: 700,
              cursor: "pointer",
              boxShadow: isDanger ? "0 4px 14px rgba(239, 68, 68, 0.4)" : "0 4px 14px rgba(245, 158, 11, 0.4)",
            }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
