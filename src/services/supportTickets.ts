import { SupportTicket } from "../types";

const STORAGE_KEY = "jobprep_support_tickets";

export const INITIAL_TICKETS: SupportTicket[] = [
  {
    id: "TICK-1001",
    userId: "usr_9f83a21e-4b91-4c12-921a-7b3281ef09a1",
    userName: "Arjun Kumar",
    userEmail: "arjun.kumar@gmail.com",
    category: "Resume AI",
    subject: "ATS Score calculation formula clarification",
    description: "I noticed my ATS score changed from 78% to 85% after editing skills. Could you clarify how keyword density is weighted vs format structure?",
    priority: "Medium",
    status: "In Progress",
    createdAt: "2026-09-10T10:15:00Z",
    updatedAt: "2026-09-10T14:20:00Z",
    adminResponse: "Hi Arjun! Our AI analyzes 3 dimensions: 1) Hard Skill Match (40%), 2) Action Verb & Impact Metrics (30%), 3) Formatting & Section Layout (30%). Editing relevant skills boosted your Hard Skill Match grade directly.",
    responseAt: "2026-09-10T14:20:00Z",
  },
  {
    id: "TICK-1002",
    userId: "usr_101",
    userName: "Rahul Sharma",
    userEmail: "rahul.s@gmail.com",
    category: "Billing & Payment",
    subject: "Payment debited twice during Pro plan upgrade",
    description: "I upgraded to Pro plan yesterday via UPI (Txn ID: UPI9012847). My bank statement shows ₹2,299 debited twice. Please issue a refund for the duplicate transaction.",
    priority: "Urgent",
    status: "Open",
    createdAt: "2026-09-11T08:30:00Z",
    updatedAt: "2026-09-11T08:30:00Z",
  },
  {
    id: "TICK-1003",
    userId: "usr_104",
    userName: "Sneha Deshmukh",
    userEmail: "sneha.d@yahoo.com",
    category: "Technical Issue",
    subject: "Microphone permission error during Firefox AI Mock Interview",
    description: "When starting Mock Interview on Firefox 128, the voice recorder shows 'Microphone access denied' even though browser permissions are enabled.",
    priority: "Low",
    status: "Resolved",
    createdAt: "2026-09-08T11:00:00Z",
    updatedAt: "2026-09-08T16:45:00Z",
    adminResponse: "Hello Sneha! This issue was resolved by adjusting Firefox's default input source selection in `about:preferences#privacy`. If you face this again, try switching to Chrome or updating Firefox audio drivers.",
    responseAt: "2026-09-08T16:45:00Z",
  },
  {
    id: "TICK-1004",
    userId: "usr_102",
    userName: "Priya Patil",
    userEmail: "priya.patil@outlook.com",
    category: "Mock Interview",
    subject: "Request for specialized Data Science & ML interview questions",
    description: "Can we get company-specific questions for Senior Data Scientist role at Google and Amazon (LLM finetuning, PyTorch, system design)?",
    priority: "High",
    status: "Open",
    createdAt: "2026-09-11T12:00:00Z",
    updatedAt: "2026-09-11T12:00:00Z",
  },
];

export function getStoredTickets(): SupportTicket[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_TICKETS));
      return INITIAL_TICKETS;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error("Failed to parse stored tickets", err);
    return INITIAL_TICKETS;
  }
}

export function saveTickets(tickets: SupportTicket[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets));
    // Dispatch custom window event so other open hooks/components update instantly
    window.dispatchEvent(new Event("support_tickets_updated"));
  } catch (err) {
    console.error("Failed to save tickets", err);
  }
}

export function createNewTicket(
  user: { id: string; name: string; email: string },
  data: {
    category: SupportTicket["category"];
    subject: string;
    description: string;
    priority: SupportTicket["priority"];
  }
): SupportTicket {
  const tickets = getStoredTickets();
  const nextNum = 1000 + tickets.length + 1;
  const newTicket: SupportTicket = {
    id: `TICK-${nextNum}`,
    userId: user.id,
    userName: user.name,
    userEmail: user.email,
    category: data.category,
    subject: data.subject,
    description: data.description,
    priority: data.priority,
    status: "Open",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const updated = [newTicket, ...tickets];
  saveTickets(updated);
  return newTicket;
}

export function updateTicketStatus(
  ticketId: string,
  newStatus: SupportTicket["status"],
  adminResponse?: string
): SupportTicket[] {
  const tickets = getStoredTickets();
  const updated = tickets.map((t) => {
    if (t.id === ticketId) {
      const now = new Date().toISOString();
      return {
        ...t,
        status: newStatus,
        updatedAt: now,
        ...(adminResponse !== undefined && {
          adminResponse: adminResponse,
          responseAt: now,
        }),
      };
    }
    return t;
  });
  saveTickets(updated);
  return updated;
}
