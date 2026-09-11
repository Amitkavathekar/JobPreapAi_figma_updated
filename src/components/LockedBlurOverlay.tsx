import React, { useState } from "react";

interface LockedBlurOverlayProps {
  isLocked: boolean;
  onOpenUpgradeModal?: () => void;
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
  customText?: string;
}

export default function LockedBlurOverlay({
  isLocked,
  onOpenUpgradeModal,
  children,
  style,
  className,
  customText,
}: LockedBlurOverlayProps) {
  const [isHovered, setIsHovered] = useState(false);

  if (!isLocked) {
    return <>{children}</>;
  }

  return (
    <div
      className={`locked-blur-container ${className || ""}`}
      style={{
        position: "relative",
        borderRadius: 10,
        overflow: "hidden",
        cursor: "pointer",
        transition: "all 0.2s ease",
        ...style,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onOpenUpgradeModal}
    >
      {/* Underlying content visibly blurred/dimmed */}
      <div
        style={{
          filter: "blur(4px)",
          opacity: 0.45,
          pointerEvents: "none",
          userSelect: "none",
          transition: "filter 0.2s ease, opacity 0.2s ease",
        }}
      >
        {children}
      </div>

      {/* Theme-aligned Glass Overlay centered horizontally & vertically on top of locked section */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 20,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "8px 12px",
          background: "rgba(10, 10, 30, 0.45)",
          backdropFilter: "blur(3px)",
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "8px 18px",
            borderRadius: 10,
            background: "linear-gradient(135deg, rgba(20, 15, 45, 0.95), rgba(12, 10, 30, 0.95))",
            backdropFilter: "blur(12px)",
            border: isHovered
              ? "1px solid rgba(6, 182, 212, 0.8)"
              : "1px solid rgba(124, 58, 237, 0.55)",
            boxShadow: isHovered
              ? "0 8px 25px rgba(0, 0, 0, 0.8), 0 0 20px rgba(124, 58, 237, 0.5)"
              : "0 6px 20px rgba(0, 0, 0, 0.6), 0 0 14px rgba(124, 58, 237, 0.25)",
            color: "#e2e8f0",
            fontSize: 12,
            fontWeight: 500,
            fontFamily: "Outfit, -apple-system, sans-serif",
            letterSpacing: "0.01em",
            maxWidth: "92%",
            textAlign: "center",
            transform: isHovered ? "scale(1.02)" : "scale(1)",
            transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          <span style={{ fontSize: 14, flexShrink: 0 }}>🔒</span>
          <span>
            <span style={{ color: "#a78bfa", fontWeight: 700 }}>
              Upgrade Membership Plan
            </span>{" "}
            {customText || "to view this point"}
          </span>
        </div>
      </div>
    </div>
  );
}
