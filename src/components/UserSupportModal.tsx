import React, { useState, useEffect, useRef } from "react";
import { UserProfile, SupportTicket } from "../types";
import {
  getStoredTickets,
  createNewTicket,
} from "../services/supportTickets";

interface UserSupportModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
}

interface FAQItem {
  id: number;
  question: string;
  answer: string;
  category: "ATS & Resume" | "Mock Interview" | "Billing & Plans" | "Technical Issue" | "Account & Privacy" | "Support";
}

const FAQ_LIST: FAQItem[] = [
  {
    id: 1,
    question: "How does ATS Resume Scoring work?",
    answer: "Our AI parses your resume text and compares formatting, skill keyword density, experience metrics, and section structure against your target Job Description to calculate an exact match percentage score out of 100.",
    category: "ATS & Resume",
  },
  {
    id: 2,
    question: "How many free practice questions or scans do I get?",
    answer: "Free tier candidates can view 2 practice questions per interview and run basic ATS scans. Upgrading to Pro or Elite unlocks unlimited questions, company-specific mock interviews, and live voice speech analysis.",
    category: "Billing & Plans",
  },
  {
    id: 3,
    question: "What is STAR feedback in Voice Mock Interview?",
    answer: "STAR stands for Situation, Task, Action, and Result. Our AI audio analyzer breaks down your spoken answers to check if you clearly covered the context, your specific technical role, and quantitative outcomes.",
    category: "Mock Interview",
  },
  {
    id: 4,
    question: "How do I upgrade or manage my membership plan?",
    answer: "Click the 'Upgrade' button in the top navigation or profile tab to choose between Basic (₹499), Plus (₹1,299), Pro (₹2,299), and Elite (₹3,999) plans with instant activation via UPI or cards.",
    category: "Billing & Plans",
  },
  {
    id: 5,
    question: "Can I export my optimized resume to PDF format?",
    answer: "Yes! The Live Resume Editor provides 1-click ATS-compliant PDF export with preserved formatting, bullet highlights, and clean typography.",
    category: "ATS & Resume",
  },
  {
    id: 6,
    question: "What should I do if my microphone isn't capturing voice in Mock Interview?",
    answer: "Ensure browser microphone permissions are allowed (check site permissions in your address bar). Use Google Chrome or Microsoft Edge for best Web Speech API support and verify that your microphone input device is selected.",
    category: "Technical Issue",
  },
  {
    id: 7,
    question: "How do I target specific companies like Google, TCS, or Infosys?",
    answer: "Go to Interview Prep & Question Bank or Voice Mock Interview, and filter by Company Tags (Google, TCS, Amazon, Microsoft, Infosys) to get company-specific past questions and evaluation rubrics.",
    category: "Mock Interview",
  },
  {
    id: 8,
    question: "What payment methods are supported for plan upgrades?",
    answer: "We support UPI (Google Pay, PhonePe, Paytm, BHIM), Credit & Debit Cards (Visa, Mastercard, RuPay), Net Banking, and Wallets through 256-bit SSL encrypted Razorpay checkout.",
    category: "Billing & Plans",
  },
  {
    id: 9,
    question: "How long does it take for support tickets to be resolved?",
    answer: "Urgent & High priority tickets receive responses from our support engineers within 1–2 hours. Medium and Low priority queries are resolved within 24 hours.",
    category: "Support",
  },
  {
    id: 10,
    question: "Can I store multiple resume versions for different roles?",
    answer: "Yes! Under 'Job & Resume Management', you can upload and save multiple versions of your CV tailored for different job profiles (e.g. Frontend Developer, Fullstack Engineer, Data Analyst).",
    category: "ATS & Resume",
  },
  {
    id: 11,
    question: "How does speech speed and filler word detection work?",
    answer: "During Voice Mock Interview, our AI audio engine computes your Words Per Minute (WPM), voice pauses, and detects filler words like 'um', 'ah', 'like', and 'you know' to score your communication confidence.",
    category: "Technical Issue",
  },
  {
    id: 12,
    question: "What happens after my subscription plan expires?",
    answer: "Your account automatically transitions to the standard plan. All your generated report cards, uploaded resumes, and interview history remain permanently stored in your account.",
    category: "Billing & Plans",
  },
  {
    id: 13,
    question: "Is my personal resume data private and confidential?",
    answer: "Absolutely. We use enterprise 256-bit encryption. Your personal resume information, contact details, and voice recordings are never shared, sold, or exposed to third parties.",
    category: "Account & Privacy",
  },
  {
    id: 14,
    question: "How do coupons or promo discount codes work?",
    answer: "During checkout in the Upgrade modal, enter your active promo code (e.g. WELCOME50 or PRO200) to apply instant percentage or flat discounts on your selected plan.",
    category: "Billing & Plans",
  },
  {
    id: 15,
    question: "How can I submit feature requests or report a system bug?",
    answer: "You can use the 'Raise Query' section in this Help & Support center to select 'Bug Report' or 'Feature Request', and our engineering team will evaluate it promptly.",
    category: "Support",
  },
];

function MessageFeedbackSection({
  isLastBotMsg,
  feedbackState,
  onSatisfied,
  onNotSatisfied,
}: {
  isLastBotMsg: boolean;
  feedbackState?: 'satisfied' | 'not_satisfied';
  onSatisfied: () => void;
  onNotSatisfied: () => void;
}) {
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    if (feedbackState || !isLastBotMsg) return;
    const timer = setTimeout(() => {
      setIsRevealed(true);
    }, 15000);
    return () => clearTimeout(timer);
  }, [feedbackState, isLastBotMsg]);

  if (feedbackState === 'satisfied') {
    return (
      <span style={{ fontSize: 11, color: '#34d399', fontWeight: 600 }}>
        ✓ Satisfied with answer
      </span>
    );
  }

  if (feedbackState === 'not_satisfied') {
    return (
      <span style={{ fontSize: 11, color: '#f87171', fontWeight: 600 }}>
        ✕ Ticket form unlocked below
      </span>
    );
  }

  if (!isLastBotMsg || !isRevealed) {
    return null;
  }

  return (
    <>
      <span style={{ fontSize: 11, color: '#94a3b8' }}>Satisfied?</span>
      <button
        onClick={onSatisfied}
        style={{
          padding: '2px 8px',
          borderRadius: 4,
          background: 'rgba(16, 185, 129, 0.15)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          color: '#34d399',
          fontSize: 11,
          cursor: 'pointer',
          transition: 'all 0.2s ease',
        }}
      >
        👍 Yes
      </button>
      <button
        onClick={onNotSatisfied}
        style={{
          padding: '2px 8px',
          borderRadius: 4,
          background: 'rgba(239, 68, 68, 0.15)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          color: '#f87171',
          fontSize: 11,
          cursor: 'pointer',
          transition: 'all 0.2s ease',
        }}
      >
        👎 No, Raise Query →
      </button>
    </>
  );
}

export default function UserSupportModal({
  isOpen,
  onClose,
  userProfile,
}: UserSupportModalProps) {
  // FAQ progressive state
  const [faqSearch, setFaqSearch] = useState("");
  const [expandedFaqId, setExpandedFaqId] = useState<number | null>(1);
  const [faqSatisfaction, setFaqSatisfaction] = useState<"none" | "satisfied" | "not_satisfied">("none");

  // AI Chatbot progressive state
  const [aiSatisfaction, setAiSatisfaction] = useState<"none" | "satisfied" | "not_satisfied">("none");
  const [chatMessages, setChatMessages] = useState<Array<{ id: string; sender: "bot" | "user"; text: string; time: string }>>([
    {
      id: "welcome-1",
      sender: "bot",
      text: `Hello ${userProfile.full_name || "Candidate"}! 👋 I'm your JobPrep AI Support Assistant. Since the FAQs didn't resolve your issue, please tell me what you need help with!`,
      time: "Just now",
    },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isBotTyping, setIsBotTyping] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement | null>(null);
  const aiSectionRef = useRef<HTMLDivElement | null>(null);
  const raiseSectionRef = useRef<HTMLDivElement | null>(null);

  // Ticket Form state
  const [category, setCategory] = useState<SupportTicket["category"]>("Technical Issue");
  const [priority, setPriority] = useState<SupportTicket["priority"]>("Medium");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  // Load candidate's tickets
  const loadUserTickets = () => {
    const all = getStoredTickets();
    const myTickets = all.filter(
      (t) =>
        t.userId === userProfile.id ||
        t.userEmail.toLowerCase() === userProfile.email.toLowerCase()
    );
    setTickets(myTickets);
  };

  useEffect(() => {
    if (isOpen) {
      loadUserTickets();
      setSuccessMsg("");
      setFaqSatisfaction("none");
      setAiSatisfaction("none");
      setShowHistory(false);
    }
  }, [isOpen, userProfile.id, userProfile.email]);

  useEffect(() => {
    const handleUpdate = () => loadUserTickets();
    window.addEventListener("support_tickets_updated", handleUpdate);
    return () => window.removeEventListener("support_tickets_updated", handleUpdate);
  }, []);

  const [modalMsgFeedback, setModalMsgFeedback] = useState<Record<string, 'satisfied' | 'not_satisfied'>>({});
  const [submittedTicketObj, setSubmittedTicketObj] = useState<SupportTicket | null>(null);

  useEffect(() => {
    if (faqSatisfaction === "not_satisfied") {
      setTimeout(() => {
        aiSectionRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [faqSatisfaction]);

  useEffect(() => {
    if (aiSatisfaction === "not_satisfied") {
      setTimeout(() => {
        raiseSectionRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [aiSatisfaction]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, isBotTyping]);

  if (!isOpen) return null;

  // FAQ list
  const filteredFaqs = FAQ_LIST;

  // Chatbot logic
  const handleSendChatMessage = (textToSend?: string) => {
    const query = (textToSend || chatInput).trim();
    if (!query) return;

    const userMsg = {
      id: "msg-" + Date.now(),
      sender: "user" as const,
      text: query,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setChatInput("");
    setIsBotTyping(true);

    setTimeout(() => {
      let botReply = "I understand your issue! If you'd like our technical team to look into your specific account details, you can use the 'Raise Support Ticket' form below.";
      const q = query.toLowerCase();

      if (q.includes("ats") || q.includes("score") || q.includes("match")) {
        botReply = "Your ATS match score is computed by comparing your resume text against target Job Description keywords, formatting structure, and section metrics. Use the Live Resume Editor to add missing keywords for an instant score boost!";
      } else if (q.includes("mock") || q.includes("voice") || q.includes("audio") || q.includes("mic")) {
        botReply = "For Voice Mock Interviews: Ensure browser microphone permissions are enabled, use Google Chrome or Edge, and speak clearly. Our AI evaluates your STAR structure (Situation, Task, Action, Result) and speech clarity.";
      } else if (q.includes("plan") || q.includes("upgrade") || q.includes("payment") || q.includes("price") || q.includes("refund")) {
        botReply = "We offer Basic (₹499), Plus (₹1,299), Pro (₹2,299), and Elite (₹3,999) plans with instant activation via UPI, Debit/Credit Cards, and NetBanking via 256-bit SSL Razorpay checkout.";
      } else if (q.includes("pdf") || q.includes("export") || q.includes("download")) {
        botReply = "You can export your resume to ATS-friendly PDF anytime from the Live Resume Editor. Simply click the 'Export PDF' button at the top right of the editor screen.";
      } else if (q.includes("ticket") || q.includes("human") || q.includes("contact") || q.includes("admin")) {
        botReply = "I can transfer you directly to our human support queue! Scroll down to 'Step 3: Raise Support Ticket' to submit your issue directly to our engineers.";
      }

      const botMsg = {
        id: "msg-bot-" + Date.now(),
        sender: "bot" as const,
        text: botReply,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setChatMessages((prev) => [...prev, botMsg]);
      setIsBotTyping(false);
    }, 700);
  };

  // Submit Ticket Logic
  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !description.trim()) return;

    setSubmitting(true);
    setTimeout(() => {
      const created = createNewTicket(
        {
          id: userProfile.id,
          name: userProfile.full_name,
          email: userProfile.email,
        },
        {
          category,
          subject: subject.trim(),
          description: description.trim(),
          priority,
        }
      );

      setSubmittedTicketObj(created);
      setSubmitting(false);
      setSuccessMsg(`Your support query (${created.id}) has been submitted successfully! SLA: 2 hours.`);
      setSubject("");
      setDescription("");
      loadUserTickets();
    }, 400);
  };

  const getStatusBadge = (status: SupportTicket["status"]) => {
    switch (status) {
      case "Open":
        return { bg: "rgba(245, 158, 11, 0.15)", border: "rgba(245, 158, 11, 0.3)", color: "#fbbf24", label: "Open" };
      case "In Progress":
        return { bg: "rgba(6, 182, 212, 0.15)", border: "rgba(6, 182, 212, 0.3)", color: "#38bdf8", label: "In Progress" };
      case "Resolved":
        return { bg: "rgba(16, 185, 129, 0.15)", border: "rgba(16, 185, 129, 0.3)", color: "#34d399", label: "✓ Resolved" };
      case "Closed":
        return { bg: "rgba(148, 163, 184, 0.15)", border: "rgba(148, 163, 184, 0.3)", color: "#94a3b8", label: "Closed" };
    }
  };

  const getPriorityBadge = (p: SupportTicket["priority"]) => {
    switch (p) {
      case "Urgent":
        return { color: "#ef4444", bg: "rgba(239, 68, 68, 0.15)" };
      case "High":
        return { color: "#f97316", bg: "rgba(249, 115, 22, 0.15)" };
      case "Medium":
        return { color: "#eab308", bg: "rgba(234, 179, 8, 0.15)" };
      case "Low":
        return { color: "#10b981", bg: "rgba(16, 185, 129, 0.15)" };
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(3, 7, 18, 0.75)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        padding: "16px",
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 720,
          height: "90vh",
          maxHeight: 780,
          background: "linear-gradient(145deg, rgba(17, 24, 39, 0.95), rgba(10, 10, 26, 0.98))",
          border: "1px solid rgba(124, 58, 237, 0.3)",
          borderRadius: 20,
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 30px rgba(124, 58, 237, 0.2)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          color: "#f8fafc",
          animation: "modalFadeIn 0.25s ease-out",
        }}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: "18px 24px",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "rgba(255,255,255,0.02)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: 12,
                background: "linear-gradient(135deg, #7c3aed, #06b6d4)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 20,
                boxShadow: "0 0 15px rgba(124, 58, 237, 0.4)",
              }}
            >
              🎧
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "white" }}>
                Help & Support Center
              </h3>
              <p style={{ margin: 0, fontSize: 12, color: "rgba(148,163,184,0.7)" }}>
                Scroll down FAQs → AI Chatbot Assistant → Raise Priority Ticket
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              border: "1px solid rgba(255,255,255,0.1)",
              background: "rgba(255,255,255,0.05)",
              color: "#94a3b8",
              cursor: "pointer",
              fontSize: 16,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.2s",
            }}
          >
            ✕
          </button>
        </div>

        {/* Modal Main Mode 1-Style Chat Window */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
          {/* Main Chat Stream Container */}
          <div
            style={{
              flex: 1,
              padding: '20px 22px',
              display: 'flex',
              flexDirection: 'column',
              gap: 18,
              background: 'rgba(7,7,26,0.3)',
              overflowY: 'auto',
            }}
          >
            {/* 1. INITIAL FAQ BOT CHAT BUBBLE */}
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 15,
                  flexShrink: 0,
                  marginTop: 2,
                  fontWeight: 700,
                  color: 'white',
                }}
              >
                🤖
              </div>

              <div style={{ maxWidth: '90%', flex: 1 }}>
                <div
                  style={{
                    fontSize: 10,
                    fontFamily: 'JetBrains Mono',
                    color: '#a78bfa',
                    marginBottom: 4,
                    fontWeight: 700,
                  }}
                >
                  AI ASSISTANT · HELP CENTER
                </div>

                <div
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '14px 14px 14px 2px',
                    padding: '16px 18px',
                    color: 'white',
                    fontSize: 13.5,
                    lineHeight: 1.6,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 14,
                  }}
                >
                  <div>
                    👋 Welcome to <strong>JobPrepAI Help & Support</strong>! Browse our 15 Frequently Asked Questions below. If you need further help, click <strong>"No, Talk to AI Assistant"</strong> or ask any question directly in the chat input below!
                  </div>

                  {/* 15 FAQs Accordion List */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {filteredFaqs.map((faq) => {
                      const isExpanded = expandedFaqId === faq.id;
                      return (
                        <div
                          key={faq.id}
                          style={{
                            borderRadius: 10,
                            background: isExpanded ? 'rgba(124, 58, 237, 0.15)' : 'rgba(255, 255, 255, 0.06)',
                            border: isExpanded ? '1px solid rgba(124, 58, 237, 0.4)' : '1px solid rgba(255, 255, 255, 0.12)',
                            overflow: 'hidden',
                            transition: 'all 0.2s ease',
                          }}
                        >
                          <button
                            onClick={() => setExpandedFaqId(isExpanded ? null : faq.id)}
                            style={{
                              width: '100%',
                              padding: '12px 16px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              background: 'none',
                              border: 'none',
                              color: 'white',
                              textAlign: 'left',
                              cursor: 'pointer',
                              fontSize: 13,
                              fontWeight: 600,
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                              <span style={{ fontSize: 11, padding: '3px 8px', borderRadius: 6, background: 'rgba(6, 182, 212, 0.2)', color: '#22d3ee', fontFamily: 'JetBrains Mono', fontWeight: 700 }}>
                                #{faq.id}
                              </span>
                              <span style={{ color: 'white' }}>{faq.question}</span>
                            </div>
                            <span style={{ color: '#c4b5fd', fontSize: 12, marginLeft: 10 }}>
                              {isExpanded ? '▲' : '▼'}
                            </span>
                          </button>

                          {isExpanded && (
                            <div style={{ padding: '0 16px 14px', fontSize: 12.5, color: 'rgba(226, 232, 240, 0.9)', lineHeight: 1.5, borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: 10 }}>
                              <div>{faq.answer}</div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* FAQ SATISFACTION CHECK BOX AT THE END OF FAQs */}
                  <div
                    style={{
                      marginTop: 10,
                      padding: '14px 16px',
                      borderRadius: 12,
                      background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.12), rgba(6, 182, 212, 0.12))',
                      border: '1px solid rgba(124, 58, 237, 0.3)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 10,
                    }}
                  >
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'white' }}>
                      🤔 Did these 15 FAQs resolve your query?
                    </div>

                    {faqSatisfaction === 'satisfied' ? (
                      <div style={{ padding: '10px 14px', borderRadius: 10, background: 'rgba(16, 185, 129, 0.2)', border: '1px solid rgba(16, 185, 129, 0.4)', color: '#34d399', fontSize: 13, fontWeight: 600 }}>
                        🎉 Awesome! We are glad we could help. Happy job preparation! 🚀
                      </div>
                    ) : faqSatisfaction === 'not_satisfied' ? (
                      <div style={{ padding: '10px 14px', borderRadius: 10, background: 'rgba(124, 58, 237, 0.15)', border: '1px solid rgba(124, 58, 237, 0.35)', color: '#c4b5fd', fontSize: 12.5, fontWeight: 600 }}>
                        🤖 AI Support Assistant Activated Below 👇
                      </div>
                    ) : (
                      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                        <button
                          onClick={() => setFaqSatisfaction('satisfied')}
                          style={{ padding: '8px 16px', borderRadius: 8, background: 'rgba(16, 185, 129, 0.2)', border: '1px solid rgba(16, 185, 129, 0.4)', color: '#34d399', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
                        >
                          👍 Yes, I'm Satisfied
                        </button>
                        <button
                          onClick={() => setFaqSatisfaction('not_satisfied')}
                          style={{ padding: '8px 16px', borderRadius: 8, background: 'linear-gradient(135deg, #7c3aed, #06b6d4)', border: 'none', color: 'white', fontSize: 12, fontWeight: 700, cursor: 'pointer', boxShadow: '0 0 15px rgba(124, 58, 237, 0.4)' }}
                        >
                          👎 No, Talk to AI Assistant →
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* 2. CHAT MESSAGES STREAM (REVEALED WHEN FAQ NOT SATISFIED) */}
            {faqSatisfaction === 'not_satisfied' && (() => {
              const lastBotMsgId = [...chatMessages].reverse().find((m) => m.sender === 'bot')?.id;
              return chatMessages.map((msg) => {
                const isUser = msg.sender === 'user';
                const isLastBotMsg = msg.id === lastBotMsgId;
                return (
                  <div key={msg.id} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', flexDirection: isUser ? 'row-reverse' : 'row' }}>
                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: isUser ? 'linear-gradient(135deg, #06b6d4, #10b981)' : 'linear-gradient(135deg, #7c3aed, #06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, flexShrink: 0, marginTop: 2, fontWeight: 700, color: 'white' }}>
                      {isUser ? 'AK' : '🤖'}
                    </div>

                    <div style={{ maxWidth: '82%' }}>
                      <div style={{ fontSize: 10, fontFamily: 'JetBrains Mono', color: isUser ? '#67e8f9' : '#a78bfa', marginBottom: 4, fontWeight: 700, textAlign: isUser ? 'right' : 'left' }}>
                        {isUser ? 'YOU' : 'AI ASSISTANT'} · {msg.time}
                      </div>

                      <div style={{ background: isUser ? 'rgba(6,182,212,0.15)' : 'rgba(255,255,255,0.05)', border: isUser ? '1px solid rgba(6,182,212,0.3)' : '1px solid rgba(255,255,255,0.1)', borderRadius: isUser ? '14px 14px 2px 14px' : '14px 14px 14px 2px', padding: '14px 18px', color: 'white', fontSize: 13.5, lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                        <div>{msg.text}</div>

                        {!isUser && (
                          <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
                            <MessageFeedbackSection
                              isLastBotMsg={isLastBotMsg}
                              feedbackState={modalMsgFeedback[msg.id]}
                              onSatisfied={() => setModalMsgFeedback((prev) => ({ ...prev, [msg.id]: 'satisfied' }))}
                              onNotSatisfied={() => {
                                setModalMsgFeedback((prev) => ({ ...prev, [msg.id]: 'not_satisfied' }));
                                setAiSatisfaction('not_satisfied');
                              }}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              });
            })()}

            {isBotTyping && (
              <div style={{ display: 'flex', gap: 10, alignItems: 'center', color: '#06b6d4', fontSize: 12 }}>
                <span>🤖</span> AI Assistant is typing response...
              </div>
            )}

            {/* 3. PRIORITY SUPPORT TICKET FORM (UNLOCKED IN CHAT STREAM WHEN AI NOT SATISFIED) */}
            {aiSatisfaction === 'not_satisfied' && (
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, #f59e0b, #ef4444)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, flexShrink: 0, marginTop: 2, fontWeight: 700, color: 'white' }}>
                  🎫
                </div>

                <div style={{ maxWidth: '85%', width: '100%' }}>
                  <div style={{ fontSize: 10, fontFamily: 'JetBrains Mono', color: '#f59e0b', marginBottom: 4, fontWeight: 700 }}>
                    PRIORITY SUPPORT TICKET FORM
                  </div>

                  {!submittedTicketObj ? (
                    <div style={{ background: 'rgba(245, 158, 11, 0.08)', border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: '14px', padding: '18px', color: 'white' }}>
                      {successMsg && (
                        <div style={{ marginBottom: 12, padding: '10px 14px', borderRadius: 10, background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.4)', color: '#34d399', fontSize: 12.5, fontWeight: 600 }}>
                          ✓ {successMsg}
                        </div>
                      )}

                      <form onSubmit={handleSubmitTicket} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                        {/* Row 1: Issue Category & Priority Level */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 14 }} className="stack-on-mobile">
                          <div>
                            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#cbd5e1', marginBottom: 6 }}>
                              Issue Category
                            </label>
                            <select
                              value={category}
                              onChange={(e) => setCategory(e.target.value as any)}
                              style={{
                                width: '100%',
                                padding: '9px 12px',
                                borderRadius: 8,
                                background: '#0f172a',
                                border: '1px solid rgba(255, 255, 255, 0.15)',
                                color: 'white',
                                fontSize: 12.5,
                                outline: 'none',
                                cursor: 'pointer',
                              }}
                            >
                              <option value="Technical Issue">Technical Issue</option>
                              <option value="Billing & Payment">Billing & Payment</option>
                              <option value="Resume AI / ATS">Resume AI / ATS</option>
                              <option value="Mock Interview">Mock Interview</option>
                              <option value="Account & Other">Account & Other</option>
                            </select>
                          </div>

                          <div>
                            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#cbd5e1', marginBottom: 6 }}>
                              Priority Level
                            </label>
                            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                              {(['Low', 'Medium', 'High', 'Urgent'] as const).map((p) => {
                                const isSelected = priority === p;
                                return (
                                  <button
                                    key={p}
                                    type="button"
                                    onClick={() => setPriority(p)}
                                    style={{
                                      flex: 1,
                                      padding: '7px 0',
                                      textAlign: 'center',
                                      borderRadius: 6,
                                      fontSize: 11.5,
                                      fontWeight: isSelected ? 700 : 500,
                                      background: isSelected
                                        ? p === 'Urgent' ? 'rgba(239, 68, 68, 0.2)' : p === 'High' ? 'rgba(249, 115, 22, 0.2)' : p === 'Medium' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(16, 185, 129, 0.2)'
                                        : 'rgba(255, 255, 255, 0.05)',
                                      border: isSelected
                                        ? p === 'Urgent' ? '1px solid #ef4444' : p === 'High' ? '1px solid #f97316' : p === 'Medium' ? '1px solid #f59e0b' : '1px solid #10b981'
                                        : '1px solid rgba(255, 255, 255, 0.15)',
                                      color: isSelected
                                        ? p === 'Urgent' ? '#f87171' : p === 'High' ? '#fb923c' : p === 'Medium' ? '#fbbf24' : '#34d399'
                                        : '#94a3b8',
                                      cursor: 'pointer',
                                      transition: 'all 0.15s ease',
                                    }}
                                  >
                                    {p}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        </div>

                        {/* Row 2: Subject / Summary */}
                        <div>
                          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#cbd5e1', marginBottom: 6 }}>
                            Subject / Summary
                          </label>
                          <input
                            type="text"
                            required
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            placeholder="e.g. ATS scan stuck at 90% or Refund query"
                            style={{
                              width: '100%',
                              padding: '9px 12px',
                              borderRadius: 8,
                              background: 'rgba(255, 255, 255, 0.05)',
                              border: '1px solid rgba(255, 255, 255, 0.15)',
                              color: 'white',
                              fontSize: 12.5,
                              outline: 'none',
                            }}
                          />
                        </div>

                        {/* Row 3: Detailed Description of Problem */}
                        <div>
                          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#cbd5e1', marginBottom: 6 }}>
                            Detailed Description of Problem
                          </label>
                          <textarea
                            required
                            rows={3}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Describe what happened, error messages, or details of your request..."
                            style={{
                              width: '100%',
                              padding: '10px 12px',
                              borderRadius: 8,
                              background: 'rgba(255, 255, 255, 0.05)',
                              border: '1px solid rgba(255, 255, 255, 0.15)',
                              color: 'white',
                              fontSize: 12.5,
                              outline: 'none',
                              resize: 'vertical',
                              fontFamily: 'inherit',
                            }}
                          />
                        </div>

                        {/* Row 4: Submitting user info line & Priority SLA */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 11.5, color: '#94a3b8' }}>
                          <div>
                            Submitting as: <strong style={{ color: 'white' }}>{userProfile.full_name || 'Candidate'}</strong> ({userProfile.email})
                          </div>
                          <div style={{ color: '#06b6d4', fontWeight: 600 }}>
                            • Priority SLA – 2 hrs
                          </div>
                        </div>

                        {/* Row 5: Submit Button */}
                        <button
                          type="submit"
                          style={{
                            width: '100%',
                            padding: '12px 20px',
                            borderRadius: 10,
                            background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
                            border: 'none',
                            color: 'white',
                            fontSize: 13.5,
                            fontWeight: 700,
                            cursor: 'pointer',
                          }}
                        >
                          🚀 Submit Support Ticket
                        </button>
                      </form>
                    </div>
                  ) : (
                    /* SUBMITTED QUERY DISPLAY CARD (FORM TURNS OFF AFTER SUBMISSION) */
                    <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                      <div style={{ maxWidth: '100%', width: '100%' }}>
                        <div
                          style={{
                            fontSize: 10,
                            fontFamily: 'JetBrains Mono',
                            color: '#34d399',
                            marginBottom: 4,
                            fontWeight: 700,
                          }}
                        >
                          YOUR SUBMITTED PRIORITY QUERY
                        </div>

                        <div
                          style={{
                            background: 'rgba(16, 185, 129, 0.08)',
                            border: '1px solid rgba(16, 185, 129, 0.3)',
                            borderRadius: '14px',
                            padding: '16px 18px',
                            color: 'white',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8, flexWrap: 'wrap', gap: 6 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <span style={{ fontSize: 13, fontWeight: 700, color: '#34d399' }}>{submittedTicketObj.id}</span>
                              <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 4, background: 'rgba(6, 182, 212, 0.2)', color: '#38bdf8', border: '1px solid rgba(6, 182, 212, 0.4)' }}>
                                {submittedTicketObj.category}
                              </span>
                              <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 4, background: 'rgba(245, 158, 11, 0.2)', color: '#fbbf24', border: '1px solid rgba(245, 158, 11, 0.4)' }}>
                                Priority: {submittedTicketObj.priority}
                              </span>
                            </div>
                            <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 4, background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', fontWeight: 600 }}>
                              ● Open (SLA: 2 hrs)
                            </span>
                          </div>

                          <div style={{ fontSize: 14, fontWeight: 700, color: 'white', marginBottom: 6 }}>
                            {submittedTicketObj.subject}
                          </div>

                          <div style={{ fontSize: 12.5, color: '#cbd5e1', lineHeight: 1.5, whiteSpace: 'pre-wrap', marginBottom: 12 }}>
                            {submittedTicketObj.description}
                          </div>

                          <div style={{ paddingTop: 10, borderTop: '1px solid rgba(255, 255, 255, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 11, color: '#94a3b8' }}>
                            <span>Submitted on: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            <button
                              onClick={() => setSubmittedTicketObj(null)}
                              style={{ background: 'none', border: 'none', color: '#06b6d4', fontSize: 11, cursor: 'pointer', textDecoration: 'underline' }}
                            >
                              + Submit Another Ticket
                            </button>
                          </div>

                          {/* AI System Acknowledgement Reply */}
                          <div style={{ marginTop: 12, padding: '10px 14px', borderRadius: 8, background: 'rgba(124, 58, 237, 0.15)', border: '1px solid rgba(124, 58, 237, 0.3)', fontSize: 12, color: '#c4b5fd', lineHeight: 1.5 }}>
                            🤖 <strong>AI Support System:</strong> Your query has been logged under ID <strong>{submittedTicketObj.id}</strong>. Our senior engineers have been notified and will review your issue within 2 hours.
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                    </div>
                  </div>
                )}

            <div ref={chatBottomRef} />
          </div>

          {/* 4. FIXED CHAT INPUT BAR AT THE BOTTOM OF MODAL CHAT WINDOW */}
          <div style={{ padding: '14px 22px', background: 'rgba(15, 23, 42, 0.8)', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', gap: 12, alignItems: 'center' }}>
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  if (faqSatisfaction === 'none') setFaqSatisfaction('not_satisfied');
                  handleSendChatMessage();
                }
              }}
              style={{ flex: 1, padding: '12px 16px', borderRadius: 10, background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.15)', color: 'white', fontSize: 13, outline: 'none' }}
            />
            <button
              onClick={() => {
                if (faqSatisfaction === 'none') setFaqSatisfaction('not_satisfied');
                handleSendChatMessage();
              }}
              style={{ padding: '12px 20px', borderRadius: 10, background: 'linear-gradient(135deg, #7c3aed, #06b6d4)', border: 'none', color: 'white', fontWeight: 700, fontSize: 13, cursor: 'pointer', boxShadow: '0 0 15px rgba(124, 58, 237, 0.4)' }}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
