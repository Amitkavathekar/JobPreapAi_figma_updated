import React from "react";

interface EmptyStateProps {
  icon: string;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "48px 24px",
        textAlign: "center",
      }}
    >
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: "50%",
          background: "rgba(255, 255, 255, 0.04)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 28,
          marginBottom: 16,
          boxShadow: "0 0 20px rgba(0,0,0,0.3)",
        }}
      >
        {icon}
      </div>

      <h4 style={{ fontSize: 18, fontWeight: 700, color: "white", margin: "0 0 6px" }}>{title}</h4>
      <p style={{ fontSize: 13, color: "#94a3b8", maxWidth: 360, margin: "0 0 20px", lineHeight: 1.5 }}>
        {description}
      </p>

      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="btn-primary"
          style={{
            padding: "8px 20px",
            fontSize: 13,
            borderRadius: 8,
            background: "linear-gradient(135deg, #ec4899, #7c3aed)",
          }}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
