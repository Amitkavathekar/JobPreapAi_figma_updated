import React, { useState } from 'react';

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
  name: 'Resume Analysis' | 'ATS Scan' | 'Mock Interview' | 'Interview Prep';
  description: string;
  current_model: string;
  current_provider: string;
  icon: string;
  color: string;
}

const INITIAL_PROVIDERS: AiProvider[] = [
  { provider_name_id: 'prov-u101-4a1b-9c2d', name: 'Google' },
  { provider_name_id: 'prov-u102-3b2c-8d1e', name: 'OpenAI' },
  { provider_name_id: 'prov-u103-7c4d-6e5f', name: 'Anthropic' },
  { provider_name_id: 'prov-u104-8d5e-7f6a', name: 'Meta AI' },
  { provider_name_id: 'prov-u105-9e6f-8a7b', name: 'Mistral AI' },
];

const INITIAL_MODEL_NAMES: ModelNameItem[] = [
  {
    model_name_id: 'mn-101',
    name: 'Gemini 1.5 Pro',
    provider_id: 'prov-u101-4a1b-9c2d',
  },
  {
    model_name_id: 'mn-102',
    name: 'Gemini 1.5 Flash',
    provider_id: 'prov-u101-4a1b-9c2d',
  },
  {
    model_name_id: 'mn-103',
    name: 'Gemini 2.0 Flash',
    provider_id: 'prov-u101-4a1b-9c2d',
  },
  {
    model_name_id: 'mn-104',
    name: 'GPT-4o',
    provider_id: 'prov-u102-3b2c-8d1e',
  },
  {
    model_name_id: 'mn-105',
    name: 'GPT-4o-mini',
    provider_id: 'prov-u102-3b2c-8d1e',
  },
  {
    model_name_id: 'mn-106',
    name: 'Whisper Large v3 (Audio)',
    provider_id: 'prov-u102-3b2c-8d1e',
  },
  {
    model_name_id: 'mn-107',
    name: 'Claude 3.5 Sonnet',
    provider_id: 'prov-u103-7c4d-6e5f',
  },
  {
    model_name_id: 'mn-108',
    name: 'Claude 3.5 Haiku',
    provider_id: 'prov-u103-7c4d-6e5f',
  },
  {
    model_name_id: 'mn-109',
    name: 'Llama 3.3 70B',
    provider_id: 'prov-u104-8d5e-7f6a',
  },
  {
    model_name_id: 'mn-110',
    name: 'Mistral Large 2',
    provider_id: 'prov-u105-9e6f-8a7b',
  },
];

const INITIAL_FEATURE_TYPES: AiFeatureType[] = [
  {
    ai_feature_type_id: 'ft-801a-4c91',
    name: 'Mock Interview',
    description:
      'Real-time speech evaluation, audio feedback, and candidate score analysis.',
    current_model: 'Gemini 1.5 Pro',
    current_provider: 'Google',
    icon: '🎙️',
    color: '#ec4899',
  },
  {
    ai_feature_type_id: 'ft-802b-5d92',
    name: 'ATS Scan',
    description:
      'High-speed resume parsing, keyword extraction, and match scoring engine.',
    current_model: 'Gemini 1.5 Flash',
    current_provider: 'Google',
    icon: '🎯',
    color: '#06b6d4',
  },
  {
    ai_feature_type_id: 'ft-803c-6e93',
    name: 'Resume Analysis',
    description:
      'Deep structured resume feedback, bullet optimization, and formatting suggestions.',
    current_model: 'GPT-4o',
    current_provider: 'OpenAI',
    icon: '📄',
    color: '#7c3aed',
  },
  {
    ai_feature_type_id: 'ft-804d-7f94',
    name: 'Interview Prep',
    description:
      'Custom role-based interview question generation and technical prep cards.',
    current_model: 'Claude 3.5 Sonnet',
    current_provider: 'Anthropic',
    icon: '💡',
    color: '#f59e0b',
  },
];

export default function AiModelsScreen() {
  const [providers] = useState<AiProvider[]>(INITIAL_PROVIDERS);
  const [modelNames] = useState<ModelNameItem[]>(INITIAL_MODEL_NAMES);
  const [featureTypes, setFeatureTypes] = useState<AiFeatureType[]>(
    INITIAL_FEATURE_TYPES
  );

  // Modal State for adding new AI Model
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newModelName, setNewModelName] = useState('GPT-4o');
  const [newProvider, setNewProvider] = useState('OpenAI');
  const [newFeatureType, setNewFeatureType] =
    useState<AiFeatureType['name']>('Resume Analysis');

  // Notification Toast
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleUpdateFeatureModel = (
    featureId: string,
    modelName: string,
    providerName: string
  ) => {
    setFeatureTypes((prev) =>
      prev.map((ft) =>
        ft.ai_feature_type_id === featureId
          ? { ...ft, current_model: modelName, current_provider: providerName }
          : ft
      )
    );
    showToast('AI Model Router Updated Successfully!');
  };

  const handleRegisterModel = (e: React.FormEvent) => {
    e.preventDefault();
    setFeatureTypes((prev) =>
      prev.map((ft) =>
        ft.name === newFeatureType
          ? {
              ...ft,
              current_model: newModelName,
              current_provider: newProvider,
            }
          : ft
      )
    );
    setIsAddModalOpen(false);
    showToast(`New AI Model ${newModelName} registered & mapped!`);
  };

  return (
    <div
      style={{
        width: '100%',
        maxWidth: 1100,
        margin: '0 auto',
        padding: '10px 0 40px',
        display: 'flex',
        flexDirection: 'column',
        gap: 24,
        justifyContent: 'center',
        minHeight: '75vh',
      }}
    >
      {/* Toast Notification */}
      {toastMsg && (
        <div
          style={{
            position: 'fixed',
            top: 20,
            right: 20,
            zIndex: 1100,
            background: 'rgba(16, 185, 129, 0.25)',
            border: '1px solid #10b981',
            color: '#34d399',
            padding: '10px 18px',
            borderRadius: 12,
            fontSize: 13,
            fontWeight: 700,
            backdropFilter: 'blur(12px)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
          }}
        >
          ✓ {toastMsg}
        </div>
      )}

      {/* Screen Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 16,
        }}
      >
        <div>
          <h2
            style={{
              fontSize: 24,
              fontWeight: 800,
              color: 'white',
              margin: 0,
              letterSpacing: '-0.02em',
            }}
          >
            🤖 AI Tokens & <span className="gradient-text">Models Router</span>
          </h2>
          <p
            style={{
              color: 'rgba(148, 163, 184, 0.7)',
              fontSize: 13,
              margin: '4px 0 0',
            }}
          >
            Configure and route primary AI models across core application
            features in real-time.
          </p>
        </div>
        <button
          className="btn-primary"
          onClick={() => setIsAddModalOpen(true)}
          style={{
            fontSize: 13,
            padding: '10px 20px',
            borderRadius: 12,
            background: 'linear-gradient(135deg, #ec4899, #7c3aed)',
            fontWeight: 700,
            boxShadow: '0 4px 15px rgba(236,72,153,0.3)',
          }}
        >
          + Register New AI Model
        </button>
      </div>

      {/* CENTERED 2x2 GRID OF 4 FEATURE UI CARDS */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 22,
          marginTop: 8,
        }}
      >
        {featureTypes.map((ft) => (
          <div
            key={ft.ai_feature_type_id}
            className="glass glass-hover"
            style={{
              padding: '24px 26px',
              borderRadius: 20,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: 20,
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.1)',
              boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
              transition: 'all 0.25s ease',
            }}
          >
            {/* Top Section */}
            <div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 14,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 14,
                      background: `${ft.color}22`,
                      border: `1px solid ${ft.color}55`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 22,
                    }}
                  >
                    {ft.icon}
                  </div>
                  <div>
                    <h3
                      style={{
                        fontSize: 18,
                        fontWeight: 800,
                        color: 'white',
                        margin: 0,
                      }}
                    >
                      {ft.name}
                    </h3>
                    <span
                      style={{
                        fontSize: 11,
                        fontFamily: 'JetBrains Mono',
                        color: ft.color,
                        fontWeight: 600,
                      }}
                    >
                      ai_feature_type
                    </span>
                  </div>
                </div>
                <span
                  style={{
                    background: 'rgba(16, 185, 129, 0.15)',
                    color: '#34d399',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    padding: '4px 10px',
                    borderRadius: 20,
                    fontSize: 11,
                    fontWeight: 700,
                  }}
                >
                  ● Active Router
                </span>
              </div>

              <p
                style={{
                  fontSize: 13,
                  color: 'rgba(148, 163, 184, 0.8)',
                  margin: 0,
                  lineHeight: 1.5,
                }}
              >
                {ft.description}
              </p>
            </div>

            {/* Selector Controls Box */}
            <div
              style={{
                background: 'rgba(7, 7, 26, 0.6)',
                padding: '16px 18px',
                borderRadius: 14,
                border: '1px solid rgba(255,255,255,0.06)',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 14,
              }}
            >
              <div>
                <label
                  style={{
                    fontSize: 11,
                    color: 'rgba(148,163,184,0.7)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    fontWeight: 700,
                    display: 'block',
                    marginBottom: 6,
                  }}
                >
                  🏢 Provider:
                </label>
                <select
                  value={ft.current_provider}
                  onChange={(e) => {
                    const newProv = e.target.value;
                    const matchingModel = modelNames.find((m) => {
                      const provObj = providers.find((p) => p.name === newProv);
                      return m.provider_id === provObj?.provider_name_id;
                    });
                    handleUpdateFeatureModel(
                      ft.ai_feature_type_id,
                      matchingModel?.name || ft.current_model,
                      newProv
                    );
                  }}
                  style={{
                    width: '100%',
                    background: '#0d0d2b',
                    border: '1px solid rgba(255,255,255,0.15)',
                    color: 'white',
                    padding: '8px 12px',
                    borderRadius: 8,
                    fontSize: 13,
                    fontWeight: 600,
                    outline: 'none',
                    cursor: 'pointer',
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
                <label
                  style={{
                    fontSize: 11,
                    color: 'rgba(148,163,184,0.7)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    fontWeight: 700,
                    display: 'block',
                    marginBottom: 6,
                  }}
                >
                  🤖 AI Model:
                </label>
                <select
                  value={ft.current_model}
                  onChange={(e) =>
                    handleUpdateFeatureModel(
                      ft.ai_feature_type_id,
                      e.target.value,
                      ft.current_provider
                    )
                  }
                  style={{
                    width: '100%',
                    background: '#0d0d2b',
                    border: '1px solid rgba(255,255,255,0.15)',
                    color: 'white',
                    padding: '8px 12px',
                    borderRadius: 8,
                    fontSize: 13,
                    fontWeight: 600,
                    outline: 'none',
                    cursor: 'pointer',
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

      {/* Register Model Modal */}
      {isAddModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 999,
            background: 'rgba(5, 5, 16, 0.8)',
            backdropFilter: 'blur(12px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20,
          }}
        >
          <div
            className="glass-card"
            style={{
              width: '100%',
              maxWidth: 480,
              borderRadius: 16,
              background: '#0d0d2b',
              border: '1px solid rgba(255,255,255,0.15)',
              padding: 24,
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 16,
              }}
            >
              <h3
                style={{
                  margin: 0,
                  fontSize: 18,
                  color: 'white',
                  fontWeight: 800,
                }}
              >
                Register New AI Model
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#94a3b8',
                  fontSize: 16,
                  cursor: 'pointer',
                }}
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={handleRegisterModel}
              style={{ display: 'flex', flexDirection: 'column', gap: 14 }}
            >
              <div>
                <label
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: '#94a3b8',
                    textTransform: 'uppercase',
                  }}
                >
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
                    width: '100%',
                    marginTop: 4,
                    padding: '8px 12px',
                    fontSize: 13,
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: '#94a3b8',
                    textTransform: 'uppercase',
                  }}
                >
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
                    width: '100%',
                    marginTop: 4,
                    padding: '8px 12px',
                    fontSize: 13,
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: '#94a3b8',
                    textTransform: 'uppercase',
                  }}
                >
                  Target Feature Type (ai_feature_type):
                </label>
                <select
                  value={newFeatureType}
                  onChange={(e) => setNewFeatureType(e.target.value as any)}
                  style={{
                    width: '100%',
                    marginTop: 4,
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    color: 'white',
                    padding: '8px 12px',
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

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: 10,
                  marginTop: 14,
                }}
              >
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="btn-ghost"
                  style={{ padding: '8px 16px', fontSize: 12, borderRadius: 8 }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  style={{
                    padding: '8px 18px',
                    fontSize: 12,
                    borderRadius: 8,
                    background: 'linear-gradient(135deg, #ec4899, #7c3aed)',
                  }}
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
