import React, { useState } from "react";

export interface AiProvider {
  provider_name_id: string;
  name: string;
}

export interface ModelNameItem {
  model_name_id: string;
  name: string;
  provider_id: string;
}

export interface AiFeatureType {
  ai_feature_type_id: string;
  name: "Resume Analysis" | "ATS Scan" | "Mock Interview" | "Interview Prep";
  description: string;
  current_model: string;
  current_provider: string;
}

export interface AiModelRecord {
  id: string;
  model_name: string;
  provider: string;
  created_at: string;
  feature_type_name: string;
}

const INITIAL_PROVIDERS: AiProvider[] = [
  { provider_name_id: "prov-u101-4a1b-9c2d", name: "Google" },
  { provider_name_id: "prov-u102-3b2c-8d1e", name: "OpenAI" },
  { provider_name_id: "prov-u103-7c4d-6e5f", name: "Anthropic" },
];

const INITIAL_MODEL_NAMES: ModelNameItem[] = [
  { model_name_id: "mn-101", name: "Gemini 1.5 Pro", provider_id: "prov-u101-4a1b-9c2d" },
  { model_name_id: "mn-102", name: "Gemini 1.5 Flash", provider_id: "prov-u101-4a1b-9c2d" },
  { model_name_id: "mn-103", name: "GPT-4o", provider_id: "prov-u102-3b2c-8d1e" },
  { model_name_id: "mn-104", name: "Claude 3.5 Sonnet", provider_id: "prov-u103-7c4d-6e5f" },
];

const INITIAL_FEATURE_TYPES: AiFeatureType[] = [
  {
    ai_feature_type_id: "ft-801a-4c91",
    name: "Mock Interview",
    description: "Real-time speech evaluation, audio feedback, and candidate score analysis",
    current_model: "Gemini 1.5 Pro",
    current_provider: "Google",
  },
  {
    ai_feature_type_id: "ft-802b-5d92",
    name: "ATS Scan",
    description: "High-speed resume parsing, keyword extraction, and match scoring",
    current_model: "Gemini 1.5 Flash",
    current_provider: "Google",
  },
  {
    ai_feature_type_id: "ft-803c-6e93",
    name: "Resume Analysis",
    description: "Deep structured resume feedback, bullet optimization, and formatting suggestions",
    current_model: "GPT-4o",
    current_provider: "OpenAI",
  },
  {
    ai_feature_type_id: "ft-804d-7f94",
    name: "Interview Prep",
    description: "Custom role-based interview question generation and technical prep cards",
    current_model: "Claude 3.5 Sonnet",
    current_provider: "Anthropic",
  },
];

const INITIAL_AI_MODELS: AiModelRecord[] = [
  {
    id: "9b1deb4d-3b7d-4b69-912e-123456789abc",
    model_name: "Gemini 1.5 Pro",
    provider: "Google",
    feature_type_name: "Mock Interview",
    created_at: "2026-08-10 14:30:00",
  },
  {
    id: "4c2eeb5e-4c8e-5c70-a23f-234567890bcd",
    model_name: "Gemini 1.5 Flash",
    provider: "Google",
    feature_type_name: "ATS Scan",
    created_at: "2026-08-12 11:15:00",
  },
  {
    id: "1a3ffc6f-5d9f-6d81-b340-345678901cde",
    model_name: "GPT-4o",
    provider: "OpenAI",
    feature_type_name: "Resume Analysis",
    created_at: "2026-08-15 09:45:00",
  },
  {
    id: "8d400d70-6ea0-7e92-c451-456789012def",
    model_name: "Claude 3.5 Sonnet",
    provider: "Anthropic",
    feature_type_name: "Interview Prep",
    created_at: "2026-08-20 16:20:00",
  },
];

export default function AiModelsScreen() {
  const [providers] = useState<AiProvider[]>(INITIAL_PROVIDERS);
  const [modelNames] = useState<ModelNameItem[]>(INITIAL_MODEL_NAMES);
  const [featureTypes, setFeatureTypes] = useState<AiFeatureType[]>(INITIAL_FEATURE_TYPES);
  const [aiModels, setAiModels] = useState<AiModelRecord[]>(INITIAL_AI_MODELS);

  // Modal State for adding new AI Model
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newModelName, setNewModelName] = useState("GPT-4o");
  const [newProvider, setNewProvider] = useState("OpenAI");
  const [newFeatureType, setNewFeatureType] = useState<AiFeatureType["name"]>("Resume Analysis");

  // Notification Toast
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleUpdateFeatureModel = (featureId: string, modelName: string, providerName: string) => {
    setFeatureTypes((prev) =>
      prev.map((ft) =>
        ft.ai_feature_type_id === featureId
          ? { ...ft, current_model: modelName, current_provider: providerName }
          : ft
      )
    );

    showToast("AI Model Router Updated Successfully!");
  };

  const handleRegisterModel = (e: React.FormEvent) => {
    e.preventDefault();
    const newRecord: AiModelRecord = {
      id: `${Math.random().toString(36).substring(2, 10)}-${Math.random().toString(36).substring(2, 6)}-4b69-912e-${Date.now()}`,
      model_name: newModelName,
      provider: newProvider,
      feature_type_name: newFeatureType,
      created_at: new Date().toISOString().replace("T", " ").substring(0, 19),
    };

    setAiModels([newRecord, ...aiModels]);
    
    // Also update feature type mapping if applicable
    setFeatureTypes((prev) =>
      prev.map((ft) =>
        ft.name === newFeatureType
          ? { ...ft, current_model: newModelName, current_provider: newProvider }
          : ft
      )
    );

    setIsAddModalOpen(false);
    showToast(`New AI Model ${newModelName} registered!`);
  };

  // Pagination state for master table
  const [tablePage, setTablePage] = useState(1);
  const tablePageSize = 5;
  const totalTablePages = Math.ceil(aiModels.length / tablePageSize) || 1;
  const paginatedAiModels = aiModels.slice((tablePage - 1) * tablePageSize, tablePage * tablePageSize);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
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
      <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <button
          className="btn-primary"
          onClick={() => setIsAddModalOpen(true)}
          style={{ fontSize: 12, padding: "8px 16px", borderRadius: 8, background: "linear-gradient(135deg, #ec4899, #7c3aed)" }}
        >
          + Register New AI Model
        </button>
      </div>



      {/* 1. AI FEATURE TYPES MAPPING (ai_feature_type table) */}
      <div>
        <h4 style={{ margin: "0 0 12px", fontSize: 15, fontWeight: 700, color: "white", display: "flex", alignItems: "center", gap: 8 }}>
          <span>⚡</span> AI Feature Type Model Router (ai_feature_type)
        </h4>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
          {featureTypes.map((ft) => (
            <div
              key={ft.ai_feature_type_id}
              className="glass-card"
              style={{
                padding: 18,
                borderRadius: 14,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                border: "1px solid rgba(255,255,255,0.1)",
                background: "rgba(255,255,255,0.03)",
              }}
            >
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <span style={{ fontSize: 14, fontWeight: 800, color: "#ec4899" }}>{ft.name}</span>
                </div>
              </div>

              <div style={{ background: "rgba(0,0,0,0.3)", padding: 12, borderRadius: 10, display: "flex", flexDirection: "column", gap: 8 }}>
                <div>
                  <label style={{ fontSize: 10, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 700 }}>
                    Provider (provider_name):
                  </label>
                  <select
                    value={ft.current_provider}
                    onChange={(e) => {
                      const newProv = e.target.value;
                      const matchingModel = modelNames.find((m) => {
                        const provObj = providers.find((p) => p.name === newProv);
                        return m.provider_id === provObj?.provider_name_id;
                      });
                      handleUpdateFeatureModel(ft.ai_feature_type_id, matchingModel?.name || ft.current_model, newProv);
                    }}
                    style={{
                      width: "100%",
                      marginTop: 4,
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.12)",
                      color: "white",
                      padding: "6px 10px",
                      borderRadius: 6,
                      fontSize: 12,
                    }}
                  >
                    {providers.map((p) => (
                      <option key={p.provider_name_id} value={p.name}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: 10, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 700 }}>
                    Model Name (model_name):
                  </label>
                  <select
                    value={ft.current_model}
                    onChange={(e) => handleUpdateFeatureModel(ft.ai_feature_type_id, e.target.value, ft.current_provider)}
                    style={{
                      width: "100%",
                      marginTop: 4,
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.12)",
                      color: "white",
                      padding: "6px 10px",
                      borderRadius: 6,
                      fontSize: 12,
                    }}
                  >
                    {modelNames.map((m) => (
                      <option key={m.model_name_id} value={m.name}>
                        {m.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. AI MODEL REGISTRY TABLE (ai_model table) */}
      <div className="glass-card" style={{ padding: 22 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div>
            <h4 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: "white" }}>
              🗄 Registered AI Models Master Table (ai_model)
            </h4>
          </div>

          <span style={{ fontSize: 11, fontFamily: "JetBrains Mono", color: "#34d399", background: "rgba(52, 211, 153, 0.12)", padding: "4px 10px", borderRadius: 6 }}>
            {aiModels.length} Active Records
          </span>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, textAlign: "left" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.1)", color: "#94a3b8" }}>
                <th style={{ padding: 12 }}>Model Name (model_name)</th>
                <th style={{ padding: 12 }}>Provider (provider)</th>
                <th style={{ padding: 12 }}>Mapped Feature Type</th>
                <th style={{ padding: 12 }}>Created At (timestamp)</th>
              </tr>
            </thead>
            <tbody>
              {paginatedAiModels.map((m) => (
                <tr key={m.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                  <td style={{ padding: 12, fontWeight: 700, color: "white" }}>
                    {m.model_name}
                  </td>
                  <td style={{ padding: 12 }}>
                    <span
                      style={{
                        padding: "2px 8px",
                        borderRadius: 4,
                        fontSize: 11,
                        fontWeight: 700,
                        background:
                          m.provider === "Google"
                            ? "rgba(52, 211, 153, 0.15)"
                            : m.provider === "OpenAI"
                            ? "rgba(6, 182, 212, 0.15)"
                            : "rgba(168, 85, 247, 0.15)",
                        color:
                          m.provider === "Google"
                            ? "#34d399"
                            : m.provider === "OpenAI"
                            ? "#67e8f9"
                            : "#c084fc",
                      }}
                    >
                      {m.provider}
                    </span>
                  </td>
                  <td style={{ padding: 12, color: "#ec4899", fontWeight: 600 }}>
                    {m.feature_type_name}
                  </td>
                  <td style={{ padding: 12, fontFamily: "JetBrains Mono", color: "#64748b", fontSize: 12 }}>
                    {m.created_at}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 18, borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 12 }}>
          <span style={{ fontSize: 12, color: "#94a3b8" }}>
            Showing Page {tablePage} of {totalTablePages} ({aiModels.length} total records)
          </span>

          <div style={{ display: "flex", gap: 8 }}>
            <button
              disabled={tablePage === 1}
              onClick={() => setTablePage((p) => Math.max(1, p - 1))}
              className="btn-ghost"
              style={{ padding: "4px 12px", fontSize: 12, opacity: tablePage === 1 ? 0.4 : 1, cursor: tablePage === 1 ? "not-allowed" : "pointer" }}
            >
              Previous
            </button>
            <button
              disabled={tablePage >= totalTablePages}
              onClick={() => setTablePage((p) => Math.min(totalTablePages, p + 1))}
              className="btn-ghost"
              style={{ padding: "4px 12px", fontSize: 12, opacity: tablePage >= totalTablePages ? 0.4 : 1, cursor: tablePage >= totalTablePages ? "not-allowed" : "pointer" }}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* 3. REGISTER NEW AI MODEL MODAL */}
      {isAddModalOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 999,
            background: "rgba(5, 5, 16, 0.8)",
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
              maxWidth: 480,
              borderRadius: 16,
              background: "rgba(13, 13, 35, 0.95)",
              border: "1px solid rgba(255,255,255,0.15)",
              padding: 24,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h3 style={{ margin: 0, fontSize: 18, color: "white" }}>Register New AI Model (ai_model)</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                style={{ background: "none", border: "none", color: "#94a3b8", fontSize: 16, cursor: "pointer" }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleRegisterModel} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase" }}>
                  Provider Name:
                </label>
                <input
                  type="text"
                  required
                  value={newProvider}
                  onChange={(e) => setNewProvider(e.target.value)}
                  placeholder="e.g. OpenAI, Google, Anthropic"
                  className="glass-input"
                  style={{
                    width: "100%",
                    marginTop: 4,
                    padding: "8px 12px",
                    fontSize: 13,
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase" }}>
                  Model Name:
                </label>
                <input
                  type="text"
                  required
                  value={newModelName}
                  onChange={(e) => setNewModelName(e.target.value)}
                  placeholder="e.g. GPT-4o, Gemini 1.5 Pro, Claude 3.5"
                  className="glass-input"
                  style={{
                    width: "100%",
                    marginTop: 4,
                    padding: "8px 12px",
                    fontSize: 13,
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase" }}>
                  Target Feature Type (ai_feature_type):
                </label>
                <select
                  value={newFeatureType}
                  onChange={(e) => setNewFeatureType(e.target.value as any)}
                  style={{
                    width: "100%",
                    marginTop: 4,
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    color: "white",
                    padding: "8px 12px",
                    borderRadius: 8,
                    fontSize: 13,
                  }}
                >
                  <option value="Resume Analysis">Resume Analysis</option>
                  <option value="ATS Scan">ATS Scan</option>
                  <option value="Mock Interview">Mock Interview</option>
                  <option value="Interview Prep">Interview Prep</option>
                </select>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 14 }}>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="btn-ghost"
                  style={{ padding: "8px 16px", fontSize: 12, borderRadius: 8 }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  style={{ padding: "8px 18px", fontSize: 12, borderRadius: 8, background: "linear-gradient(135deg, #ec4899, #7c3aed)" }}
                >
                  Register Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
