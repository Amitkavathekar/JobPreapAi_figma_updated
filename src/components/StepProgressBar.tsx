import { Screen } from "../types";

interface StepProgressBarProps {
  currentStep: number; // 1 to 4
  onNavigate?: (screen: Screen) => void;
}

const steps: { id: number; screen: Screen; title: string }[] = [
  { id: 1, screen: "job-resume", title: "Job & Resume" },
  { id: 2, screen: "ai-analysis", title: "AI Analysis" },
  { id: 3, screen: "resume-editor", title: "Resume Editor" },
  { id: 4, screen: "ats-analysis", title: "ATS Analysis" },
];

export default function StepProgressBar({
  currentStep,
  onNavigate,
}: StepProgressBarProps) {
  return (
    <div
      style={{
        width: "100%",
        padding: "16px 24px",
        marginBottom: 24,
        background: "rgba(6, 182, 212, 0.08)",
        border: "1px solid rgba(6, 182, 212, 0.25)",
        borderRadius: 18,
        backdropFilter: "blur(12px)",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "relative",
          maxWidth: 720,
          margin: "0 auto",
        }}
      >
        {steps.map((step, idx) => {
          const isCompleted = step.id < currentStep;
          const isActive = step.id === currentStep;
          const isUpcoming = step.id > currentStep;
          const hasNextLine = idx < steps.length - 1;

          return (
            <div
              key={step.id}
              style={{
                display: "flex",
                flex: 1,
                alignItems: "center",
                position: "relative",
              }}
            >
              {/* Step Circle & Label Wrapper */}
              <div
                onClick={() => onNavigate && onNavigate(step.screen)}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  cursor: onNavigate ? "pointer" : "default",
                  zIndex: 2,
                  position: "relative",
                }}
                title={`Step ${step.id}: ${step.title}`}
              >
                {/* Circle Container */}
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 800,
                    fontSize: 15,
                    fontFamily: "Outfit, sans-serif",
                    transition: "all 0.3s ease",
                    position: "relative",

                    // Completed Step: Filled cyan with white check mark
                    ...(isCompleted && {
                      background: "#06b6d4",
                      color: "#ffffff",
                      boxShadow: "0 0 14px rgba(6, 182, 212, 0.5)",
                      border: "none",
                    }),

                    // Active Step: Filled cyan with double ring / halo outline around circle
                    ...(isActive && {
                      background: "#06b6d4",
                      color: "#ffffff",
                      boxShadow:
                        "0 0 0 4px #06b6d4, 0 0 0 7px rgba(6, 182, 212, 0.35)",
                      border: "none",
                    }),

                    // Upcoming Step: White circle background with blue border and blue text
                    ...(isUpcoming && {
                      background: "#ffffff",
                      color: "#06b6d4",
                      border: "2.5px solid #06b6d4",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                    }),
                  }}
                >
                  {isCompleted ? (
                    <span style={{ fontSize: 18, fontWeight: 900 }}>✓</span>
                  ) : (
                    <span>{step.id}</span>
                  )}
                </div>

                {/* Step Title Label */}
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: isActive ? 700 : 500,
                    marginTop: 8,
                    color: isActive
                      ? "#38bdf8"
                      : isCompleted
                      ? "#e2e8f0"
                      : "rgba(148, 163, 184, 0.6)",
                    textAlign: "center",
                    whiteSpace: "nowrap",
                    fontFamily: "Outfit, sans-serif",
                  }}
                >
                  {step.title}
                </span>
              </div>

              {/* Connecting Line between steps */}
              {hasNextLine && (
                <div
                  style={{
                    flex: 1,
                    height: 3,
                    background:
                      step.id < currentStep
                        ? "#06b6d4"
                        : "rgba(6, 182, 212, 0.25)",
                    margin: "0 10px",
                    marginBottom: 24, // offset for label height centering
                    borderRadius: 2,
                    transition: "background 0.3s ease",
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
