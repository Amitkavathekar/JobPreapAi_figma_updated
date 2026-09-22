import { SupportTicket } from '../types';

const STORAGE_KEY = 'jobprep_support_tickets';

export const INITIAL_TICKETS: SupportTicket[] = [
  {
    id: 'TICK-1001',
    userId: 'usr_9f83a21e-4b91-4c12-921a-7b3281ef09a1',
    userName: 'Arjun Kumar',
    userEmail: 'arjun.kumar@gmail.com',
    category: 'Resume AI',
    subject: 'ATS Score calculation formula clarification',
    description:
      'I noticed my ATS score changed from 78% to 85% after editing skills. Could you clarify how keyword density is weighted vs format structure?',
    priority: 'Medium',
    status: 'In Progress',
    createdAt: '2026-09-18T10:15:00Z',
    updatedAt: '2026-09-18T14:20:00Z',
    adminResponse:
      'Hi Arjun! Our AI analyzes 3 dimensions: 1) Hard Skill Match (40%), 2) Action Verb & Impact Metrics (30%), 3) Formatting & Section Layout (30%). Editing relevant skills boosted your Hard Skill Match grade directly.',
    responseAt: '2026-09-18T14:20:00Z',
  },
  {
    id: 'TICK-1002',
    userId: 'usr_101',
    userName: 'Rahul Sharma',
    userEmail: 'rahul.s@gmail.com',
    category: 'Billing & Payment',
    subject: 'Payment debited twice during Pro plan upgrade via UPI',
    description:
      'I upgraded to Pro plan yesterday via UPI (Txn ID: UPI9012847). My bank statement shows ₹2,299 debited twice. Please issue a refund for the duplicate transaction.',
    priority: 'Urgent',
    status: 'Open',
    createdAt: '2026-09-20T08:30:00Z',
    updatedAt: '2026-09-20T08:30:00Z',
  },
  {
    id: 'TICK-1003',
    userId: 'usr_104',
    userName: 'Sneha Deshmukh',
    userEmail: 'sneha.d@yahoo.com',
    category: 'Technical Issue',
    subject: 'Microphone permission error during Firefox AI Mock Interview',
    description:
      "When starting Mock Interview on Firefox 128, the voice recorder shows 'Microphone access denied' even though browser permissions are enabled.",
    priority: 'Low',
    status: 'Resolved',
    createdAt: '2026-09-15T11:00:00Z',
    updatedAt: '2026-09-15T16:45:00Z',
    adminResponse:
      "Hello Sneha! This issue was resolved by adjusting Firefox's default input source selection in about:preferences#privacy. If you face this again, try Chrome or update your audio drivers.",
    responseAt: '2026-09-15T16:45:00Z',
  },
  {
    id: 'TICK-1004',
    userId: 'usr_102',
    userName: 'Priya Patil',
    userEmail: 'priya.patil@outlook.com',
    category: 'Mock Interview',
    subject: 'Request for specialized Data Science & ML interview questions',
    description:
      'Can we get company-specific questions for Senior Data Scientist role at Google and Amazon (LLM finetuning, PyTorch, system design)?',
    priority: 'High',
    status: 'Open',
    createdAt: '2026-09-19T12:00:00Z',
    updatedAt: '2026-09-19T12:00:00Z',
  },
  {
    id: 'TICK-1005',
    userId: 'usr_109',
    userName: 'Karan Joshi',
    userEmail: 'karan.j@tech.com',
    category: 'Resume AI',
    subject:
      'Resume PDF export formatting wraps bullet points onto second page',
    description:
      'In the Live Resume Editor, when downloading ATS PDF with 4 work experiences, the last 2 bullets wrap awkwardly onto a blank second page. Need compact single-page layout.',
    priority: 'Medium',
    status: 'In Progress',
    createdAt: '2026-09-17T09:40:00Z',
    updatedAt: '2026-09-17T11:15:00Z',
    adminResponse:
      'We are adjusting CSS print page-break rules in the upcoming v2.4 PDF renderer to automatically compress padding when content is 1.1 pages.',
    responseAt: '2026-09-17T11:15:00Z',
  },
  {
    id: 'TICK-1006',
    userId: 'usr_111',
    userName: 'Siddharth Malhotra',
    userEmail: 'siddharth.m@gmail.com',
    category: 'Mock Interview',
    subject:
      'Live speech speed meter showing too fast even at normal conversational pace',
    description:
      'During technical mock interview question 3, speech rate indicator turned amber (175 WPM) although I was speaking at a standard cadence. Can the threshold be calibrated?',
    priority: 'Low',
    status: 'Resolved',
    createdAt: '2026-09-12T15:20:00Z',
    updatedAt: '2026-09-13T10:00:00Z',
    adminResponse:
      "Hi Siddharth, our audio processor now normalizes pauses longer than 400ms so pauses between sentences don't artificially spike your calculated words-per-minute score.",
    responseAt: '2026-09-13T10:00:00Z',
  },
  {
    id: 'TICK-1007',
    userId: 'usr_106',
    userName: 'Aarti Kulkarni',
    userEmail: 'aarti.k@gmail.com',
    category: 'Billing & Payment',
    subject:
      'GST Tax Invoice receipt not generated for annual Elite membership',
    description:
      'I subscribed to the 1-Year Elite plan (₹3,999) for corporate reimbursement. Need an official GST tax invoice with company GSTIN.',
    priority: 'Medium',
    status: 'Resolved',
    createdAt: '2026-09-14T14:10:00Z',
    updatedAt: '2026-09-14T17:30:00Z',
    adminResponse:
      'GST invoice INV-2026-8819 with your tax details has been sent to aarti.k@gmail.com. You can also view it in candidate billing portal.',
    responseAt: '2026-09-14T17:30:00Z',
  },
  {
    id: 'TICK-1008',
    userId: 'usr_107',
    userName: 'Rohan Verma',
    userEmail: 'rohan.v@gmail.com',
    category: 'Technical Issue',
    subject: 'Audio playback waveform stuttering on mobile Chrome browser',
    description:
      'When reviewing my recorded voice mock interview playback on Android Chrome, the visual audio waveform stutters intermittently.',
    priority: 'High',
    status: 'Open',
    createdAt: '2026-09-21T07:15:00Z',
    updatedAt: '2026-09-21T07:15:00Z',
  },
  {
    id: 'TICK-1009',
    userId: 'usr_115',
    userName: 'Tanvi Shinde',
    userEmail: 'tanvi.s@gmail.com',
    category: 'Mock Interview',
    subject:
      'Company-specific interview simulation for TCS Digital & Prime roles',
    description:
      'Could you please add the latest 2026 TCS Prime coding & technical interview questions covering DSA and cloud fundamentals?',
    priority: 'Medium',
    status: 'Open',
    createdAt: '2026-09-19T16:45:00Z',
    updatedAt: '2026-09-19T16:45:00Z',
  },
  {
    id: 'TICK-1010',
    userId: 'usr_112',
    userName: 'Pooja Hegde',
    userEmail: 'pooja.h@yahoo.com',
    category: 'Resume AI',
    subject: 'ATS scanner missing framework synonyms (React.js vs ReactJS)',
    description:
      "My resume contains 'ReactJS' and 'Node.js', but the ATS scan flagged them as missing because JD wrote 'React' and 'NodeJS'.",
    priority: 'Low',
    status: 'Resolved',
    createdAt: '2026-09-10T11:30:00Z',
    updatedAt: '2026-09-11T09:15:00Z',
    adminResponse:
      'We have updated our tech skill ontology synonym mapper so React, React.js, and ReactJS are now treated as identical 100% keyword matches.',
    responseAt: '2026-09-11T09:15:00Z',
  },
  {
    id: 'TICK-1011',
    userId: 'usr_114',
    userName: 'Aditya Sen',
    userEmail: 'aditya.sen@gmail.com',
    category: 'Billing & Payment',
    subject: 'Applied coupon STUDENT50 but discount not reflected on checkout',
    description:
      'I tried applying code STUDENT50 for Plus 3-Month plan, but error said coupon is not applicable.',
    priority: 'Medium',
    status: 'Closed',
    createdAt: '2026-09-16T13:00:00Z',
    updatedAt: '2026-09-16T14:10:00Z',
    adminResponse:
      'Hi Aditya, the STUDENT50 coupon is exclusive to Pro (6 Months) and Elite (1 Year) tiers. For the Plus plan, you can use coupon code RESUME100 for a direct discount!',
    responseAt: '2026-09-16T14:10:00Z',
  },
  {
    id: 'TICK-1012',
    userId: 'usr_105',
    userName: 'Vikram Mehta',
    userEmail: 'v.mehta@techcorp.io',
    category: 'Account & Other',
    subject:
      'Request to change registered candidate email without losing interview history',
    description:
      'I am changing my corporate email v.mehta@techcorp.io to personal vikram.mehta99@gmail.com. Please transfer my active Basic plan and 9 ATS scan reports.',
    priority: 'Low',
    status: 'In Progress',
    createdAt: '2026-09-18T18:00:00Z',
    updatedAt: '2026-09-19T10:30:00Z',
  },
];

export function getStoredTickets(): SupportTicket[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_TICKETS));
      return INITIAL_TICKETS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length >= INITIAL_TICKETS.length) {
      return parsed;
    }
    // Refresh with full dummy tickets dataset
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_TICKETS));
    return INITIAL_TICKETS;
  } catch (err) {
    console.error('Failed to parse stored tickets', err);
    return INITIAL_TICKETS;
  }
}

export function saveTickets(tickets: SupportTicket[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets));
    // Dispatch custom window event so other open hooks/components update instantly
    window.dispatchEvent(new Event('support_tickets_updated'));
  } catch (err) {
    console.error('Failed to save tickets', err);
  }
}

export function createNewTicket(
  user: { id: string; name: string; email: string },
  data: {
    category: SupportTicket['category'];
    subject: string;
    description: string;
    priority: SupportTicket['priority'];
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
    status: 'Open',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const updated = [newTicket, ...tickets];
  saveTickets(updated);
  return newTicket;
}

export function updateTicketStatus(
  ticketId: string,
  newStatus: SupportTicket['status'],
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
