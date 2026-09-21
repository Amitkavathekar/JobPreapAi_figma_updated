import { useEffect, useRef, useState } from 'react';
import { Screen, SupportTicket } from '../types';
import { createNewTicket } from '../services/supportTickets';

interface MockInterviewProps {
  onNavigate: (s: Screen) => void;
  onComplete: () => void;
  hasActiveSubscription?: boolean;
  onOpenUpgradeModal?: () => void;
  isStep2Enabled?: boolean;
}

export type InterviewType =
  | 'all-50'
  | 'theory'
  | 'system-design'
  | 'technical'
  | 'output-based'
  | 'behavioral';

interface InterviewTypeOption {
  id: InterviewType;
  title: string;
  badge: string;
  icon: string;
  color: string;
  desc: string;
  questionsCount: string;
}

const interviewTypeOptions: InterviewTypeOption[] = [
  {
    id: 'all-50',
    title: '50-Question Master Interview',
    badge: '50 Qs Interactive',
    icon: '⚡',
    color: '#ec4899',
    desc: 'Complete 50-question end-to-end interactive mock interview across theory, architecture, coding, output snippets & STAR.',
    questionsCount: '50 Master Questions',
  },
  {
    id: 'theory',
    title: 'Theory & Core Concepts',
    badge: 'Fundamentals',
    icon: '📖',
    color: '#7c3aed',
    desc: 'Language specs, React internals, event loop, closures, and browser mechanics.',
    questionsCount: '10 Core Questions',
  },
  {
    id: 'system-design',
    title: 'System Design & Architecture',
    badge: 'High-Level',
    icon: '◈',
    color: '#06b6d4',
    desc: 'Scalability, micro-frontends, state synchronization, caching & real-time architecture.',
    questionsCount: '10 Design Scenarios',
  },
  {
    id: 'technical',
    title: 'Technical & Coding',
    badge: 'Practical',
    icon: '💻',
    color: '#10b981',
    desc: 'Hands-on coding algorithms, custom hook implementations, and state patterns.',
    questionsCount: '10 Coding Problems',
  },
  {
    id: 'output-based',
    title: 'Output-Based & Snippets',
    badge: 'Code Analysis',
    icon: '🧩',
    color: '#f59e0b',
    desc: 'Predict console outputs, identify memory leaks, hoisting bugs, and async execution order.',
    questionsCount: '10 Snippet Audits',
  },
  {
    id: 'behavioral',
    title: 'Behavioral & Situational',
    badge: 'STAR Method',
    icon: '🗣️',
    color: '#a855f7',
    desc: 'Conflict resolution, engineering trade-offs, tight deadlines, and team leadership.',
    questionsCount: '10 STAR Scenarios',
  },
];

interface QuestionData {
  id: number;
  category: string;
  q: string;
  codeSnippet?: string;
  hint?: string;
}

const theoryQuestions: QuestionData[] = [
  {
    id: 1,
    category: 'Theory & Core Concepts',
    q: "Explain React's Reconciliation algorithm and how the Fiber architecture enables concurrent rendering without blocking the UI thread.",
    hint: 'Mention work units, priority scheduler (Scheduler package), frame budget (5ms), and async double-buffering linked list.',
  },
  {
    id: 2,
    category: 'Theory & Core Concepts',
    q: 'How does the JavaScript Event Loop handle Microtasks (Promises/MutationObserver) vs Macrotasks (setTimeout/requestAnimationFrame)?',
    hint: 'Detail call stack emptying, microtask queue drain before next macrotask execution.',
  },
  {
    id: 3,
    category: 'Theory & Core Concepts',
    q: 'What is the difference between shallow rendering, deep comparison, and memoization in React (useMemo, React.memo, useCallback)?',
    hint: 'Discuss object referential equality vs primitive comparison and re-render prevention strategies.',
  },
  {
    id: 4,
    category: 'Theory & Core Concepts',
    q: 'Explain how browser critical rendering path processes HTML parser, CSSOM construction, render tree calculation, layout, and paint.',
    hint: 'Highlight render-blocking CSS vs parser-blocking JS scripts and layout thrashing.',
  },
  {
    id: 5,
    category: 'Theory & Core Concepts',
    q: 'What are JavaScript Closures, Lexical Scope, and the Temporal Dead Zone (TDZ) with let and const?',
    hint: 'Explain variable hoisting, lexical environment references, and TDZ runtime errors.',
  },
  {
    id: 6,
    category: 'Theory & Core Concepts',
    q: 'Explain prototypal inheritance in JavaScript and how __proto__ differs from prototype.',
    hint: 'Prototype property on constructor functions vs internal [[Prototype]] link on object instances.',
  },
  {
    id: 7,
    category: 'Theory & Core Concepts',
    q: 'How does React 18 useTransition and useDeferredValue differ from standard debouncing and throttling?',
    hint: 'Concurrent interruptible rendering vs fixed time delay timeouts.',
  },
  {
    id: 8,
    category: 'Theory & Core Concepts',
    q: 'Explain the difference between SSR, SSG, ISR, and CSR in modern web frameworks.',
    hint: 'TTFB, hydration cost, build time pre-rendering, and stale-while-revalidate background re-generation.',
  },
  {
    id: 9,
    category: 'Theory & Core Concepts',
    q: 'How does HTTP/2 multiplexing and HTTP/3 QUIC protocol improve web application latency compared to HTTP/1.1 connection head-of-line blocking?',
    hint: 'Binary framing, single TCP connection multiplexing, and UDP-based QUIC connection migration.',
  },
  {
    id: 10,
    category: 'Theory & Core Concepts',
    q: 'Explain Cross-Origin Resource Sharing (CORS), preflight requests (OPTIONS), and security headers.',
    hint: 'Simple requests vs preflight triggers (custom headers, non-standard content-types).',
  },
];

const systemDesignQuestions: QuestionData[] = [
  {
    id: 11,
    category: 'System Design & Architecture',
    q: 'Design the frontend architecture for a real-time collaborative document editor like Notion. How do you handle conflict resolution, offline storage, and dynamic cursor positions?',
    hint: 'Focus on CRDTs (Yjs/Automerge), WebSocket delta streaming, Web Workers, and IndexedDB.',
  },
  {
    id: 12,
    category: 'System Design & Architecture',
    q: 'How would you architect a global Micro-Frontend (MFE) solution for an enterprise SaaS platform with 50+ independent engineering teams?',
    hint: 'Address Webpack 5 Module Federation, shared design system singletons, CI/CD edge deployment.',
  },
  {
    id: 13,
    category: 'System Design & Architecture',
    q: 'Architect an automated error tracking & performance analytics SDK (like Sentry) that operates efficiently inside consumer browsers without impacting page load.',
    hint: 'Discuss global error listeners, stacktrace parsing, batched request beacons (navigator.sendBeacon), and memory overhead limits.',
  },
  {
    id: 14,
    category: 'System Design & Architecture',
    q: 'How do you design a scalable state management architecture for a large web application using Redux Toolkit / Zustand with normalized state structures?',
    hint: 'Discuss createEntityAdapter, atomic selectors, avoiding deep state nesting, and middleware side-effects.',
  },
  {
    id: 15,
    category: 'System Design & Architecture',
    q: 'Architect a real-time notification system handling 1 million concurrent WebSocket connections with fallback mechanisms.',
    hint: 'Pub/Sub message broker (Redis/Kafka), horizontal socket servers, sticky sessions, and Server-Sent Events (SSE) fallback.',
  },
  {
    id: 16,
    category: 'System Design & Architecture',
    q: 'How would you design a client-side API caching layer with automatic cache invalidation, deduplication, and optimistic UI updates?',
    hint: 'Stale-While-Revalidate pattern, mutation rollback handlers, normalized query keys, and persistent storage.',
  },
  {
    id: 17,
    category: 'System Design & Architecture',
    q: 'Design a dynamic Video Streaming Web App like Netflix. How do you handle Adaptive Bitrate Streaming (HLS/DASH), chunk pre-fetching, and DRM authentication?',
    hint: 'Media Source Extensions (MSE), HLS playlist manifests (.m3u8), video buffer thresholding, and EME license keys.',
  },
  {
    id: 18,
    category: 'System Design & Architecture',
    q: 'How do you design a high-throughput logging & monitoring pipeline using Kafka, Elasticsearch, and Grafana for distributed microservices?',
    hint: 'Log aggregation agents (FluentBit), partition keys, index lifecycle management (ILM), and alerting thresholds.',
  },
  {
    id: 19,
    category: 'System Design & Architecture',
    q: 'Design a Rate Limiter system at the API Gateway level using Token Bucket or Leaky Bucket algorithms in Redis.',
    hint: 'Sliding window counter vs token bucket, atomic Lua scripts in Redis, and HTTP 429 Too Many Requests response headers.',
  },
  {
    id: 20,
    category: 'System Design & Architecture',
    q: 'Architect a global CDN asset delivery pipeline for dynamic web applications with cache-busting hashing and edge compute.',
    hint: 'Immutable content hash filenames, Cloudflare/CloudFront edge workers, origin shield, and cache-control headers.',
  },
];

const technicalQuestions: QuestionData[] = [
  {
    id: 21,
    category: 'Technical & Coding',
    q: 'Implement a custom React hook useDebounce<T>(value: T, delay: number): T that guarantees zero unnecessary re-renders.',
    codeSnippet: `function useDebounce<T>(value: T, delay: number): T {\n  // Implementation logic here\n}`,
    hint: 'Use useEffect with cleanup return function clearing the timeout handler.',
  },
  {
    id: 22,
    category: 'Technical & Coding',
    q: 'Write a high-performance deep clone function deepClone(obj) in TypeScript handling circular references without JSON.parse.',
    hint: 'Handle circular references with WeakMap, Date instances, RegExp, and Symbol keys.',
  },
  {
    id: 23,
    category: 'Technical & Coding',
    q: 'Implement a custom Virtualized List component (VirtualList) that can smoothly render 100,000 items at 60fps.',
    hint: 'Calculate visible window start/end indices based on scrollTop and fixed item height.',
  },
  {
    id: 24,
    category: 'Technical & Coding',
    q: 'Write an LRU (Least Recently Used) Cache class in TypeScript with get and put operations in O(1) time complexity.',
    hint: 'Use Map preserving insertion order or Doubly Linked List + Hash Map structure.',
  },
  {
    id: 25,
    category: 'Technical & Coding',
    q: 'Implement a custom Promise.allSettled polyfill in JavaScript without using built-in Promise.allSettled.',
    hint: 'Map array of promises with .then and .catch transforming results to { status, value/reason } objects.',
  },
  {
    id: 26,
    category: 'Technical & Coding',
    q: 'Write a function to flatten a deeply nested array/object structure recursively and iteratively without memory leaks.',
    hint: 'Handle depth parameter, circular references, and array push optimization.',
  },
  {
    id: 27,
    category: 'Technical & Coding',
    q: 'Implement an EventEmitter pattern class in TypeScript with on, off, once, and emit methods.',
    hint: 'Map event names to arrays of callback functions; handle once by wrapping callbacks.',
  },
  {
    id: 28,
    category: 'Technical & Coding',
    q: 'Write a function debounceImmediate(fn, delay) that executes immediately on the first call and debounces subsequent calls.',
    hint: 'Maintain trailing timer reference and immediate execution flag.',
  },
  {
    id: 29,
    category: 'Technical & Coding',
    q: 'Implement an async task queue runner (TaskRunner(concurrency)) that executes async tasks with a limit on concurrent executing promises.',
    hint: 'Maintain pending queue array, running counter, and trigger next task on task resolution.',
  },
  {
    id: 30,
    category: 'Technical & Coding',
    q: 'Write a function to detect memory leaks and un-cleaned subscriptions in custom React hooks.',
    hint: 'WeakRef tracking, cleanup function verifications, and unmounted state updates warning.',
  },
];

const outputQuestions: QuestionData[] = [
  {
    id: 31,
    category: 'Output-Based & Snippets',
    q: 'What will be printed to the console in what exact sequence? Explain why.',
    codeSnippet: `console.log('1');\nsetTimeout(() => {\n  console.log('2');\n}, 0);\nPromise.resolve().then(() => {\n  console.log('3');\n}).then(() => {\n  console.log('4');\n});\nconsole.log('5');`,
    hint: 'Synchronous code runs first (1, 5), microtasks run next (3, 4), macrotasks last (2).',
  },
  {
    id: 32,
    category: 'Output-Based & Snippets',
    q: 'What does the following React code render when the button is clicked twice? Explain the state batching behavior.',
    codeSnippet: `function Counter() {\n  const [count, setCount] = useState(0);\n  const handleClick = () => {\n    setCount(count + 1);\n    setCount((prev) => prev + 2);\n    setCount(count + 5);\n  };\n  return <button onClick={handleClick}>Count: {count}</button>;\n}`,
    hint: 'The last direct state setter overrides prior direct setters; updater functions read intermediate queue values.',
  },
  {
    id: 33,
    category: 'Output-Based & Snippets',
    q: 'Identify the bug or output in this JavaScript closure & var scope snippet:',
    codeSnippet: `for (var i = 0; i < 3; i++) {\n  setTimeout(() => {\n    console.log(i);\n  }, 100);\n}\nfor (let j = 0; j < 3; j++) {\n  setTimeout(() => {\n    console.log(j);\n  }, 100);\n}`,
    hint: 'var is function-scoped (prints 3 3 3), let is block-scoped (prints 0 1 2).',
  },
  {
    id: 34,
    category: 'Output-Based & Snippets',
    q: 'What is the output of typeof null, typeof NaN, [1,2,3] + [4,5,6], and [] == ![] in JavaScript?',
    hint: "null -> 'object', NaN -> 'number', array addition coerces both to strings: '1,2,34,5,6', [] == ![] is true.",
  },
  {
    id: 35,
    category: 'Output-Based & Snippets',
    q: 'What is the output of this arrow function this binding snippet?',
    codeSnippet: `const obj = {\n  name: 'JobPrepAI',\n  getNameArrow: () => this.name,\n  getNameFunc() { return this.name; }\n};\nconsole.log(obj.getNameArrow());\nconsole.log(obj.getNameFunc());`,
    hint: 'Arrow functions inherit this lexically from enclosing scope, regular methods bind to obj.',
  },
  {
    id: 36,
    category: 'Output-Based & Snippets',
    q: 'What happens when delete operator is called on var x = 10;, let y = 20;, and const obj = { z: 30 }; delete obj.z;?',
    hint: 'delete fails on non-configurable variable declarations (var/let), returns true and deletes configurable object properties.',
  },
  {
    id: 37,
    category: 'Output-Based & Snippets',
    q: 'Trace the output of try-catch variable scoping in this code snippet:',
    codeSnippet: `(function() {\n  try {\n    throw new Error();\n  } catch (x) {\n    var x = 1, y = 2;\n    console.log(x);\n  }\n  console.log(x);\n  console.log(y);\n})();`,
    hint: 'catch (x) creates block-scoped parameter x (prints 1), var x hoists to function scope as undefined, var y hoists as 2 (prints 1, undefined, 2).',
  },
  {
    id: 38,
    category: 'Output-Based & Snippets',
    q: "What does console.log(1 + '2' + 3); vs console.log(1 + +'2' + 3); output?",
    hint: "String concatenation gives '123', unary plus converts '2' to number giving 1 + 2 + 3 = 6.",
  },
  {
    id: 39,
    category: 'Output-Based & Snippets',
    q: 'Predict the execution behavior of this useEffect memory leak snippet:',
    codeSnippet: `useEffect(() => {\n  const id = setInterval(() => console.log('tick'), 1000);\n}, []);`,
    hint: 'Missing cleanup function return () => clearInterval(id) causes interval to keep running after unmount.',
  },
  {
    id: 40,
    category: 'Output-Based & Snippets',
    q: 'What is the console output sequence of this async/await code snippet?',
    codeSnippet: `async function foo() {\n  console.log('A');\n  await null;\n  console.log('B');\n}\nfoo();\nconsole.log('C');`,
    hint: "Outputs 'A', then 'C' (await yields execution to main thread), then 'B' (microtask tick).",
  },
];

const behavioralQuestions: QuestionData[] = [
  {
    id: 41,
    category: 'Behavioral & Situational',
    q: 'Tell me about a time you had to make a critical technical trade-off under severe deadline pressure. What was the situation, what trade-off did you choose, and how did you mitigate technical debt?',
    hint: 'Use STAR: Situation, Task, Action, and Quantified Business Result.',
  },
  {
    id: 42,
    category: 'Behavioral & Situational',
    q: 'Describe a scenario where you strongly disagreed with a Principal Architect or Product Manager regarding product scope or system design. How did you resolve the conflict?',
    hint: 'Focus on empirical benchmarks, collaborative communication, and customer impact.',
  },
  {
    id: 43,
    category: 'Behavioral & Situational',
    q: 'Give an example of a production outage or critical bug caused by code deployed by your team. How did you handle emergency incident response and post-mortem review?',
    hint: 'Discuss blameless post-mortem, immediate rollback, root cause analysis, and preventative integration tests.',
  },
  {
    id: 44,
    category: 'Behavioral & Situational',
    q: 'How do you mentor junior developers and foster high code quality standards across a distributed engineering team?',
    hint: 'Mention code review checklists, pair programming sessions, design RFC processes, and automated linters.',
  },
  {
    id: 45,
    category: 'Behavioral & Situational',
    q: 'Describe a situation where you inherited a complex legacy project with zero documentation. How did you document and refactor it safely?',
    hint: 'Characterization tests, incremental strangler fig pattern, and updating architectural diagrams.',
  },
  {
    id: 46,
    category: 'Behavioral & Situational',
    q: 'Tell me about a time when feature requirements changed drastically 24 hours before release. How did you pivot?',
    hint: 'Prioritizing core MVP functionality, dynamic feature flags, and transparent team communication.',
  },
  {
    id: 47,
    category: 'Behavioral & Situational',
    q: 'Give an example of how you used web vitals data (LCP, INP, CLS) to justify technical debt cleanup to executive stakeholders.',
    hint: 'Linking performance metrics directly to conversion rate, SEO ranking, and bounce rate reduction.',
  },
  {
    id: 48,
    category: 'Behavioral & Situational',
    q: 'How do you handle cross-functional friction between Frontend and Backend teams regarding API contracts and timelines?',
    hint: 'OpenAPI / Swagger schema-first design, mock API endpoints, and joint contract reviews.',
  },
  {
    id: 49,
    category: 'Behavioral & Situational',
    q: 'Tell me about a time when you received tough feedback during code review. How did you respond?',
    hint: 'Active listening, detached professional perspective, learning mindset, and implementing suggestions.',
  },
  {
    id: 50,
    category: 'Behavioral & Situational',
    q: 'What is your strategy for continuous technical growth and evaluating emerging AI tools in your daily workflow?',
    hint: 'Building proof-of-concepts, reading engineering blogs, benchmarking AI coding tools, and sharing learnings with team.',
  },
];

const allFiftyQuestions: QuestionData[] = [
  ...theoryQuestions,
  ...systemDesignQuestions,
  ...technicalQuestions,
  ...outputQuestions,
  ...behavioralQuestions,
].map((q, idx) => ({ ...q, id: idx + 1 }));

const questionSets: Record<InterviewType, QuestionData[]> = {
  'all-50': allFiftyQuestions,
  theory: theoryQuestions,
  'system-design': systemDesignQuestions,
  technical: technicalQuestions,
  'output-based': outputQuestions,
  behavioral: behavioralQuestions,
};

const aiFeedbackPresets: Record<
  InterviewType,
  { aspect: string; score: number; note: string }[]
> = {
  'all-50': [
    {
      aspect: 'Comprehensive Competency',
      score: 92,
      note: 'Outstanding endurance and depth across all 50 full-stack and architectural domains.',
    },
    {
      aspect: 'System Architecture',
      score: 89,
      note: 'Strong proficiency in CRDTs, WebSockets, and client-side performance optimization.',
    },
    {
      aspect: 'Coding & Output Logic',
      score: 94,
      note: 'Precise understanding of event loop microtasks, closures, and custom hook patterns.',
    },
    {
      aspect: 'STAR Delivery',
      score: 90,
      note: 'Clear business impact metrics and blameless incident response framing.',
    },
  ],
  theory: [
    {
      aspect: 'Theoretical Accuracy',
      score: 88,
      note: 'Deep understanding of React Fiber linked-list reconciliation and browser paint cycles.',
    },
    {
      aspect: 'Terminology Precision',
      score: 84,
      note: 'Correctly used terms like referential integrity, microtask queue, and layout thrashing.',
    },
    {
      aspect: 'Structure & Clarity',
      score: 80,
      note: 'Clear explanation steps, but could give a quick code snippet example for clarity.',
    },
    {
      aspect: 'Confidence',
      score: 85,
      note: 'Articulate and confident delivery with zero hesitation on core concepts.',
    },
  ],
  'system-design': [
    {
      aspect: 'Architectural Breadth',
      score: 91,
      note: 'Great coverage of CRDT conflict resolution, WebSocket streaming, and client-side caching.',
    },
    {
      aspect: 'Scalability & Resilience',
      score: 86,
      note: 'Thoughtfully addressed offline sync with IndexedDB and Web Worker background threading.',
    },
    {
      aspect: 'Trade-off Analysis',
      score: 82,
      note: 'Weighed CRDT memory overhead vs Operational Transformation server central locking well.',
    },
    {
      aspect: 'Communication',
      score: 88,
      note: 'Used clear 4-layer architectural abstraction breakdown.',
    },
  ],
  technical: [
    {
      aspect: 'Code Correctness',
      score: 85,
      note: 'Clean logic handling cleanup functions and unmounting edge cases in custom hooks.',
    },
    {
      aspect: 'Edge Case Handling',
      score: 79,
      note: 'Considered memory leak prevention, but missed checking for null/undefined object parameters.',
    },
    {
      aspect: 'Time & Space Complexity',
      score: 89,
      note: 'O(1) lookups using Map/Set structure accurately identified and applied.',
    },
    {
      aspect: 'Code Quality & Cleanliness',
      score: 87,
      note: 'Followed modern TypeScript strict types and idiomatic React hook conventions.',
    },
  ],
  'output-based': [
    {
      aspect: 'Output Accuracy',
      score: 95,
      note: 'Spot-on console sequence output predictions for event loop and async microtasks.',
    },
    {
      aspect: 'Scope & Closure Mastery',
      score: 90,
      note: 'Accurately explained function block-scoping differences between var and let.',
    },
    {
      aspect: 'React State Batching',
      score: 86,
      note: 'Understood updater functions vs direct state overrides in React 18 automatic batching.',
    },
    {
      aspect: 'Explanation Rigor',
      score: 88,
      note: 'Clear step-by-step trace of call stack execution order.',
    },
  ],
  behavioral: [
    {
      aspect: 'STAR Method Alignment',
      score: 92,
      note: 'Perfect breakdown of Situation, Task, Action, and Quantified Business Impact.',
    },
    {
      aspect: 'Leadership & Collaboration',
      score: 87,
      note: 'Showcased data-driven persuasion instead of emotional confrontation.',
    },
    {
      aspect: 'Business & ROI Impact',
      score: 84,
      note: 'Quantified performance gains in terms of LCP reduction and revenue recovery.',
    },
    {
      aspect: 'Delivery & Tone',
      score: 89,
      note: 'Professional, humble, and persuasive tone throughout responses.',
    },
  ],
};

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  time: string;
  bulletItems?: string[];
  typeCard?: boolean;
  configCard?: boolean;
  readyCard?: boolean;
  nextQuestionCard?: boolean;
  completeCard?: boolean;
  upgradeCard?: boolean;
  nextQNum?: number;
}

const quickPromptChips = [
  '⚡ JavaScript basic concepts',
  '🎯 Interview questions (2.5+ Years Exp)',
  '🧩 Array methods (map, filter, reduce)',
  '📝 Output-based code programs',
  '🗣 STAR method & behavioral guidance',
  '🛠 Code explain / bug fix simulator',
];

interface JdPresetOption {
  id: string;
  title: string;
  company: string;
  badge: string;
  icon: string;
  skills: string[];
  questions: {
    id: number;
    question: string;
    hint: string;
    idealAnswer: string;
    strengths: string[];
    gaps: string[];
  }[];
}

const jdPresetOptions: JdPresetOption[] = [
  {
    id: "stripe-fe",
    title: "Senior Frontend Engineer",
    company: "Stripe",
    badge: "Fintech Scale",
    icon: "💳",
    skills: ["React 18", "TypeScript", "GraphQL", "Performance", "WebSockets"],
    questions: [
      {
        id: 1,
        question: "Stripe's payment UI demands LCP < 1.5s globally. How do you optimize React bundle size and eliminate Cumulative Layout Shift (CLS) on dynamic payment elements?",
        hint: "Mention dynamic imports, pre-loading critical assets, skeleton layouts, and CSS containment.",
        idealAnswer: "I implement React.lazy route-based code-splitting, pre-load critical payment SDK scripts using rel='preload', and enforce strict CSS layout containment with skeleton UI primitives to eliminate CLS.",
        strengths: ["Clear LCP optimization strategy", "Correct usage of dynamic imports & asset pre-loading"],
        gaps: ["Could mention Web Workers for off-main-thread state calculation"]
      },
      {
        id: 2,
        question: "The role emphasizes GraphQL subscriptions for live transaction monitoring. How do you handle WebSocket reconnects and state synchronization?",
        hint: "Discuss exponential backoff, IndexedDB offline queuing, and idempotency keys.",
        idealAnswer: "I implement an exponential backoff reconnection strategy with an IndexedDB offline queue. Upon reconnecting, I send delta synchronization requests backed by server-side idempotency keys.",
        strengths: ["Excellent exponential backoff strategy", "Robust offline queue with IndexedDB"],
        gaps: ["Mention GraphQL cache normalization (Apollo/Relay)"]
      },
      {
        id: 3,
        question: "How do you design a high-performance custom hook for real-time form validation without causing unnecessary component re-renders?",
        hint: "Discuss uncontrolled inputs, React Hook Form, and ref-based state tracking.",
        idealAnswer: "I use ref-based tracking with uncontrolled inputs via React Hook Form, triggering re-renders only on validation state changes rather than every keystroke.",
        strengths: ["Efficient ref-based state management", "Eliminates unnecessary render cycles"],
        gaps: ["Add accessibility ARIA live-region notifications"]
      }
    ]
  },
  {
    id: "netflix-be",
    title: "Senior Backend Engineer",
    company: "Netflix",
    badge: "Microservices",
    icon: "🎬",
    skills: ["Go / Node.js", "Kafka", "gRPC", "Distributed Systems", "Redis"],
    questions: [
      {
        id: 1,
        question: "Netflix requires high-availability telemetry streaming for 200M+ users. How do you architect a Kafka consumer group to process telemetry with zero message loss?",
        hint: "Focus on manual offset commits, consumer idempotency, and Dead Letter Queues (DLQ).",
        idealAnswer: "I configure manual offset commits after successful DB persistence, enforce message idempotency using unique playback event IDs, and route unparseable messages to a Dead Letter Queue (DLQ).",
        strengths: ["Solid understanding of Kafka offset management", "Proper Dead Letter Queue architecture"],
        gaps: ["Mention consumer auto-rebalancing strategies"]
      },
      {
        id: 2,
        question: "How do you implement gRPC microservice communication with fallbacks during downstream service latency spikes?",
        hint: "Discuss circuit breakers, dynamic load balancing, and stale cache fallbacks.",
        idealAnswer: "I wrap gRPC calls in Circuit Breakers (e.g. Resilience4j/Hystrix) with dynamic Envoy load balancing, serving fallback responses from Redis stale cache during downstream outages.",
        strengths: ["Great resilience patterns with Circuit Breakers", "Effective fallback strategy using Redis"],
        gaps: ["Could mention gRPC deadline propagation"]
      }
    ]
  },
  {
    id: "deloitte-data",
    title: "Data Analyst & BI Engineer",
    company: "Deloitte",
    badge: "Analytics & SQL",
    icon: "📊",
    skills: ["Advanced SQL", "Python", "Tableau", "Data Modeling", "ETL"],
    questions: [
      {
        id: 1,
        question: "How do you compute a 7-day rolling average user retention metric in SQL without causing performance degradation on terabyte-scale log tables?",
        hint: "Use window functions (AVG OVER), table partitioning, and pre-aggregated materialization.",
        idealAnswer: "I partition raw log tables by event date and apply SQL Window Functions: AVG(active_users) OVER (ORDER BY event_date ROWS BETWEEN 6 PRECEDING AND CURRENT ROW), utilizing materialized views for queries.",
        strengths: ["Correct SQL window function syntax", "Efficient table partitioning strategy"],
        gaps: ["Mention indexed column clustering"]
      }
    ]
  }
];

interface ChatgptHistoryItem {
  id: string;
  title: string;
  date: string;
  messageCount: number;
  messages: { id: string; sender: 'user' | 'bot'; text: string; imageUrl?: string; imageName?: string; time: string }[];
}

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

export default function MockInterview({
  onNavigate,
  onComplete,
  hasActiveSubscription,
  onOpenUpgradeModal,
  isStep2Enabled = false,
}: MockInterviewProps) {
  const [phase, setPhase] = useState<'setup' | 'interview' | 'feedback'>(
    'setup'
  );

  const [setupMode, setSetupMode] = useState<'preset' | 'jd-qa'>('jd-qa');

  useEffect(() => {
    if (!isStep2Enabled && setupMode === 'preset') {
      setSetupMode('jd-qa');
    }
  }, [isStep2Enabled, setupMode]);

  // State for Mode 2: ChatGPT Chat Assistant with Image Upload support
  const [chatgptInput, setChatgptInput] = useState('');
  const [isChatgptTyping, setIsChatgptTyping] = useState(false);
  const [chatgptImage, setChatgptImage] = useState<string | null>(null);
  const [chatgptImageName, setChatgptImageName] = useState<string | null>(null);
  const chatgptFileInputRef = useRef<HTMLInputElement | null>(null);
  const chatgptBottomRef = useRef<HTMLDivElement | null>(null);

  // Dedicated state for Help & Support FAQ workflow
  const [faqSearchQuery, setFaqSearchQuery] = useState('');
  const [expandedFaqId, setExpandedFaqId] = useState<number | null>(null);
  const [faqSatisfiedState, setFaqSatisfiedState] = useState<'none' | 'satisfied' | 'not_satisfied'>('none');
  const [aiSatisfiedState, setAiSatisfiedState] = useState<'none' | 'satisfied' | 'not_satisfied'>('none');
  const [msgFeedbackState, setMsgFeedbackState] = useState<Record<string, 'satisfied' | 'not_satisfied'>>({});
  const [ticketCategory, setTicketCategory] = useState<'Technical Issue' | 'Billing & Payment' | 'Resume AI / ATS' | 'Mock Interview' | 'Account & Other'>('Technical Issue');
  const [ticketPriority, setTicketPriority] = useState<'Low' | 'Medium' | 'High' | 'Urgent'>('Medium');
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketDesc, setTicketDesc] = useState('');
  const [ticketSuccess, setTicketSuccess] = useState('');
  const [submittedTicketObj, setSubmittedTicketObj] = useState<SupportTicket | null>(null);

  const [chatgptHistory, setChatgptHistory] = useState<ChatgptHistoryItem[]>([
    {
      id: 'hist-1',
      title: 'React Architecture Review',
      date: 'Today, 10:14 AM',
      messageCount: 2,
      messages: [
        {
          id: 'init-msg-1',
          sender: 'user',
          text: 'Hi ChatGPT, I uploaded a screenshot of our React Component State Architecture diagram. Can you review it?',
          imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=700&q=80',
          imageName: 'architecture_flowchart.png',
          time: '10:14 AM',
        },
        {
          id: 'init-msg-2',
          sender: 'bot',
          text: 'I have analyzed your uploaded architecture screenshot! 🖼️\n\n• **Strengths**: Clear unidirectional data flow from parent context to subscriber hooks.\n• **Optimization Point**: The global state triggers re-renders on components that only need static properties. Wrap sub-trees with `React.memo` or use `useSyncExternalStore` for optimized atomic updates.\n• **Security Note**: Ensure auth tokens in local storage are HTTP-only cookie backed.',
          time: '10:15 AM',
        },
      ],
    },
    {
      id: 'hist-2',
      title: 'JS Event Loop & Microtasks',
      date: 'Yesterday, 4:30 PM',
      messageCount: 2,
      messages: [
        {
          id: 'hist2-msg-1',
          sender: 'user',
          text: 'Explain microtask vs macrotask execution order in JavaScript.',
          time: '4:30 PM',
        },
        {
          id: 'hist2-msg-2',
          sender: 'bot',
          text: 'The JavaScript Event Loop executes synchronous stack frames first, then drains the entire Microtask Queue (Promises, queueMicrotask), and finally picks one Macrotask (setTimeout, setInterval).',
          time: '4:31 PM',
        },
      ],
    },
    {
      id: 'hist-3',
      title: 'Scaling 1M WebSockets',
      date: 'Sep 8, 2026',
      messageCount: 2,
      messages: [
        {
          id: 'hist3-msg-1',
          sender: 'user',
          text: 'How do I scale 1 Million WebSocket connections?',
          time: '2:15 PM',
        },
        {
          id: 'hist3-msg-2',
          sender: 'bot',
          text: 'To scale 1M WebSockets: Use Redis Pub/Sub backplane, horizontal Node.js gateway nodes behind NGINX load balancing, keep-alive ping frames, and memory optimized buffers.',
          time: '2:16 PM',
        },
      ],
    },
  ]);

  const [activeHistoryId, setActiveHistoryId] = useState<string>('');
  const [showHistoryDrawer, setShowHistoryDrawer] = useState(false);

  const [chatgptMessages, setChatgptMessages] = useState<
    { id: string; sender: 'user' | 'bot'; text: string; imageUrl?: string; imageName?: string; time: string }[]
  >([]);

  const handleNewChat = () => {
    if (chatgptMessages.some((m) => m.sender === 'user')) {
      const firstUserMsg = chatgptMessages.find((m) => m.sender === 'user')?.text || 'New Conversation';
      const title = firstUserMsg.length > 30 ? firstUserMsg.slice(0, 30) + '...' : firstUserMsg;
      const newHistItem: ChatgptHistoryItem = {
        id: `hist-${Date.now()}`,
        title: title,
        date: 'Just now',
        messageCount: chatgptMessages.length,
        messages: [...chatgptMessages],
      };
      setChatgptHistory((prev) => [newHistItem, ...prev.filter((h) => h.id !== activeHistoryId)]);
    }

    setChatgptMessages([]);
    setChatgptInput('');
    setChatgptImage(null);
    setChatgptImageName(null);
    setActiveHistoryId(`hist-${Date.now()}`);
  };

  const handleSelectHistoryItem = (item: ChatgptHistoryItem) => {
    setChatgptMessages(item.messages);
    setActiveHistoryId(item.id);
    setShowHistoryDrawer(false);
  };

  const handleChatgptImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setChatgptImageName(file.name);
      const reader = new FileReader();
      reader.onload = (evt) => {
        setChatgptImage(evt.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSendChatgpt = (promptText?: string) => {
    const textToSend = (promptText !== undefined ? promptText : chatgptInput).trim();
    const imageToSend = chatgptImage;
    const imageNameToSend = chatgptImageName;

    if (!textToSend && !imageToSend) return;

    setChatgptInput('');
    setChatInputText('');
    setChatgptImage(null);
    setChatgptImageName(null);

    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user' as const,
      text: textToSend,
      imageUrl: imageToSend || undefined,
      imageName: imageNameToSend || undefined,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatgptMessages((prev) => [...prev, userMsg]);
    setIsChatgptTyping(true);

    setTimeout(() => {
      let botAns = `Here is a detailed breakdown regarding your query:\n\n1. **Core Insight**: ${textToSend || 'Analyzing your uploaded image.'}\n2. **Best Practice**: Ensure clean component boundaries, modular service layers, and comprehensive error handling.\n3. **Interview Tip**: Always highlight trade-offs between execution speed and code maintainability.`;

      if (imageToSend) {
        botAns = `🖼️ **Uploaded Image Analysis (${imageNameToSend || 'Image'}):**\n\nI have processed your uploaded image/screenshot!\n• **Syntax & Layout**: Clean design and structure detected.\n• **Key Takeaway**: If this is a UI or code snippet, verify that responsive breakpoints and edge-case error states are covered.\n• **Next Step**: Feel free to ask specific questions about lines or elements in this image!`;
      } else if (textToSend.toLowerCase().includes('event loop') || textToSend.toLowerCase().includes('javascript')) {
        botAns = `The JavaScript Event Loop handles asynchronous execution in single-threaded JS:\n\n• **Call Stack**: Executes synchronous code.\n• **Microtask Queue**: Drains Promises, MutationObservers, and queueMicrotask callbacks first.\n• **Macrotask Queue**: Executes setTimeout, setInterval, and I/O tasks.`;
      }

      const botMsg = {
        id: `bot-${Date.now()}`,
        sender: 'bot' as const,
        text: botAns,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setChatgptMessages((prev) => [...prev, botMsg]);
      setIsChatgptTyping(false);
      setTimeout(() => {
        chatgptBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }, 750);
  };

  const [selectedType, setSelectedType] = useState<InterviewType>('theory');
  const [targetQuestionCount, setTargetQuestionCount] = useState<number>(10);
  const [difficulty, setDifficulty] = useState<
    'Easy' | 'Medium' | 'Hard'
  >('Medium');
  const [selectedMode, setSelectedMode] = useState<'text' | 'voice'>('voice');

  const [chatInputText, setChatInputText] = useState('');
  const [isBotTyping, setIsBotTyping] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement | null>(null);

  // Dynamic Chat Messages state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([

    {
      id: 'msg-2',
      sender: 'bot',
      text: 'Now select your 2. Difficulty & Question Count (Default: 50 Questions):',
      time: 'Just now',
      configCard: true,
    },
    {
      id: 'msg-3',
      sender: 'bot',
      text: 'Your session setup is complete! Click below to launch your interactive interview:',
      time: 'Just now',
      readyCard: true,
    },
  ]);

  const [chatInterviewActive, setChatInterviewActive] = useState(false);
  const [chatQIndex, setChatQIndex] = useState(0);

  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [recording, setRecording] = useState(false);
  const [answer, setAnswer] = useState('');
  const [timer, setTimer] = useState(0);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const rawQuestions = questionSets[selectedType] || questionSets['all-50'];
  const activeQuestions = rawQuestions.slice(0, targetQuestionCount);
  const currentQuestion = activeQuestions[currentQIndex] || activeQuestions[0];
  const selectedOptionInfo = interviewTypeOptions.find(
    (o) => o.id === selectedType
  );

  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isBotTyping]);

  useEffect(() => {
    if (recording) {
      timerRef.current = setInterval(() => setTimer((t) => t + 1), 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [recording]);

  const formatTime = (s: number) =>
    `${Math.floor(s / 60)
      .toString()
      .padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

  const handleStartRecording = () => {
    setRecording(true);
    setTimer(0);
  };
  const handleStopRecording = () => {
    setRecording(false);
  };

  const handleNextQuestion = () => {
    setUserAnswers((prev) => [...prev, answer]);
    setAnswer('');
    setTimer(0);
    setRecording(false);
    if (currentQIndex < activeQuestions.length - 1) {
      setCurrentQIndex((q) => q + 1);
    } else {
      setPhase('feedback');
      onComplete();
    }
  };

  const handleStartChatInterview = () => {
    const questionsToUse = (questionSets[selectedType] || questionSets['all-50']).slice(0, targetQuestionCount);
    const firstQ = questionsToUse[0];
    const nowTime = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });

    const questionMsg: ChatMessage = {
      id: `bot-q-${Date.now()}`,
      sender: 'bot',
      text: `❓ **Question 1 of ${questionsToUse.length}** (${selectedOptionInfo?.title}):\n\n"${firstQ.q}"\n\n• **Category**: ${firstQ.category || selectedOptionInfo?.title}\n• **Key Focus**: ${firstQ.hint || 'Focus on architectural patterns and performance.'}`,
      time: nowTime,
    };

    setChatMessages((prev) => {
      const initialSetupCards = prev.filter((m) => m.configCard || m.readyCard || m.id.startsWith('msg-'));
      return [...initialSetupCards, questionMsg];
    });
    setChatInterviewActive(true);
    setChatQIndex(0);
  };

  const handleNextChatQuestion = () => {
    const questionsToUse = (questionSets[selectedType] || questionSets['all-50']).slice(0, targetQuestionCount);
    const nextIdx = chatQIndex + 1;

    if (!hasActiveSubscription && nextIdx >= 2) {
      onOpenUpgradeModal?.();
      return;
    }

    setChatQIndex(nextIdx);
    const nextQ = questionsToUse[nextIdx];
    const nowTime = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });

    const questionMsg: ChatMessage = {
      id: `bot-q-${Date.now()}`,
      sender: 'bot',
      text: `❓ **Question ${nextIdx + 1} of ${questionsToUse.length}** (${selectedOptionInfo?.title}):\n\n"${nextQ.q}"\n\n• **Category**: ${nextQ.category || selectedOptionInfo?.title}\n• **Key Focus**: ${nextQ.hint || 'Detail step-by-step approach and edge cases.'}`,
      time: nowTime,
    };

    setChatMessages((prev) => [...prev, questionMsg]);
  };

  const handleStartInterview = () => {
    setCurrentQIndex(0);
    setUserAnswers([]);
    setAnswer('');
    setTimer(0);
    setRecording(false);
    setPhase('interview');
  };

  const triggerUserQuery = (userQueryText: string) => {
    const nowTime = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });

    const newUserMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: userQueryText,
      time: nowTime,
    };

    setChatMessages((prev) => [...prev, newUserMsg]);
    setIsBotTyping(true);

    if (chatInterviewActive) {
      setTimeout(() => {
        const questionsToUse = (questionSets[selectedType] || questionSets['all-50']).slice(0, targetQuestionCount);
        const isLast = chatQIndex >= questionsToUse.length - 1;
        const currentQObj = questionsToUse[chatQIndex];
        const score = Math.floor(Math.random() * 10) + 88;

        const evalMsg: ChatMessage = {
          id: `bot-eval-${Date.now()}`,
          sender: 'bot',
          text: `🎯 **AI Match Rating**: **${score}/100**\n\n• **Strengths**: Clear technical response matching Senior expectations.\n• **Improvements**: Can expand further on edge case handling & error boundaries.\n• **Model Key Answer**: "${currentQObj?.hint ? currentQObj.hint : 'I implement atomic state updates, code-splitting with React.lazy, and pre-loading critical assets.'}"`,
          time: nowTime,
        };

        if (!isLast) {
          const nextIdx = chatQIndex + 1;

          if (!hasActiveSubscription && nextIdx >= 2) {
            const upgradeMsg: ChatMessage = {
              id: `bot-upgrade-${Date.now() + 1}`,
              sender: 'bot',
              text: `🔒 **FREE PRACTICE QUESTION LIMIT REACHED (2 / 2 QUESTIONS)**\n\nYou have completed the 2 free practice questions for this ${questionsToUse.length}-Question Master Interview! Upgrade your subscription plan to unlock Question 3 through ${questionsToUse.length}, full AI evaluation, and voice practice.`,
              time: nowTime,
              upgradeCard: true,
            };
            setChatMessages((prev) => [...prev, evalMsg, upgradeMsg]);
          } else {
            setChatQIndex(nextIdx);
            const nextQ = questionsToUse[nextIdx];

            const nextQMsg: ChatMessage = {
              id: `bot-auto-q-${Date.now() + 1}`,
              sender: 'bot',
              text: `❓ **Question ${nextIdx + 1} of ${questionsToUse.length}** (${selectedOptionInfo?.title}):\n\n"${nextQ.q}"\n\n• **Category**: ${nextQ.category || selectedOptionInfo?.title}\n• **Key Focus**: ${nextQ.hint || 'Detail step-by-step approach and edge cases.'}`,
              time: nowTime,
            };

            setChatMessages((prev) => [...prev, evalMsg, nextQMsg]);
          }
        } else {
          const completionMsg: ChatMessage = {
            id: `bot-complete-${Date.now() + 1}`,
            sender: 'bot',
            text: `🎉 **INTERVIEW SESSION COMPLETED!**\n\nGreat job! You answered all ${questionsToUse.length} questions for ${selectedOptionInfo?.title} (${difficulty}). Click below to view your performance report.`,
            time: nowTime,
            completeCard: true,
          };

          setChatMessages((prev) => [...prev, evalMsg, completionMsg]);
        }

        setIsBotTyping(false);
      }, 750);
      return;
    }

    setTimeout(() => {
      let botResponse = '';
      let bulletItems: string[] | undefined = undefined;
      const lower = userQueryText.toLowerCase();

      if (
        lower.includes('javascript basic') ||
        lower.includes('basic concepts')
      ) {
        botResponse =
          '👍 JavaScript basic concepts मध्ये खालील महत्त्वाचे मुद्दे कवर केले जातात:';
        bulletItems = [
          'Variables & Scope: var (function scope) vs let/const (block scope & TDZ)',
          'Closures & Lexical Environment: Function keeping access to outer scope variables',
          'Event Loop & Async: Call Stack -> Microtask Queue (Promises) -> Macrotask Queue (setTimeout)',
          'Prototypes & Inheritance: Prototypal chain, __proto__, Object.create()',
          'This Keyword & Binding: Default, implicit, explicit (call, apply, bind), arrow functions',
        ];
      } else if (
        lower.includes('array methods') ||
        lower.includes('map') ||
        lower.includes('reduce')
      ) {
        botResponse =
          '🧩 Array Methods (map, filter, reduce, sort, includes) Breakdown:';
        bulletItems = [
          'map(): Transforms each element and returns a new array of same length',
          'filter(): Returns new array with elements passing the boolean predicate test',
          'reduce(): Accumulates array items into a single value/object (e.g. sum, grouping)',
          'sort(): In-place sorting (Note: convert numbers to compare function (a, b) => a - b)',
          'includes(): Returns true/false checking primitive element existence',
        ];
      } else if (lower.includes('2.5') || lower.includes('experience')) {
        botResponse =
          '💼 2.5+ Years Experience Interview Preparation Focus Points:';
        bulletItems = [
          'React Core Internals: Fiber reconciliation, custom hooks, state batching',
          'Performance Optimization: LCP, code-splitting (React.lazy), useMemo, memoization',
          'System Architecture: State normalization, API caching (React Query), WebSockets',
          'STAR Behavioral Scenarios: Resolving tech debt, meeting tight deadlines',
        ];
      } else if (lower.includes('star') || lower.includes('behavioral')) {
        botResponse = '🗣 STAR Method Guidance:';
        bulletItems = [
          'Situation (15%): Briefly describe context and core constraint',
          'Task (15%): Specify your direct responsibility',
          'Action (50%): Detail technical decisions YOU executed',
          'Result (20%): Quantify outcome (e.g., LCP improved by 62%, saved $2M+)',
        ];
      } else if (lower.includes('output') || lower.includes('program')) {
        botResponse = '📝 Output-Based Code Analysis Topics:';
        bulletItems = [
          'Event loop execution order (Promises vs setTimeout)',
          'Closures inside loops (var i = 0 vs let i = 0)',
          'React state updater functions vs direct value setters',
          'Coercion quirks (typeof null, [] + {})',
        ];
        setSelectedType('output-based');
      } else {
        botResponse = `Great query regarding "${userQueryText}"! Here are key areas you can practice:`;
        bulletItems = [
          'Practice Theory & Core Concepts round',
          'Solve Output-based Code Snippets',
          'Architect System Design scenarios',
          'Practice Voice Mock Interview with real-time feedback',
        ];
      }

      const newBotMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: botResponse,
        time: nowTime,
        bulletItems,
      };

      setChatMessages((prev) => [...prev, newBotMsg]);
      setIsBotTyping(false);
    }, 600);
  };

  const handleSendMessage = () => {
    if (!chatInputText.trim()) return;
    const query = chatInputText.trim();
    setChatInputText('');
    triggerUserQuery(query);
  };

  // Phase 1: Setup
  if (phase === 'setup') {
    return (
      <div
        className="fade-in page-container"
        style={{ height: '100%', minHeight: 0, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}
      >
        {/* MODE 1: STANDARD PRESET CHATBOT SETUP */}
        {setupMode === 'preset' && (
          <div
            className="glass fade-in"
            style={{
              maxWidth: 1120,
              width: '100%',
              margin: '0 auto',
              borderRadius: 16,
              overflow: 'hidden',
              border: '1px solid rgba(124,58,237,0.35)',
              boxShadow: '0 10px 40px rgba(7,7,26,0.6)',
              display: 'flex',
              flexDirection: 'column',
              minHeight: 580,
              flex: 1,
            }}
          >
            {/* Chatbot Header */}
            <div
              style={{
                padding: '14px 22px',
                background: 'rgba(124,58,237,0.12)',
                borderBottom: '1px solid rgba(255,255,255,0.08)',
                display: 'grid',
                gridTemplateColumns: '1fr auto 1fr',
                alignItems: 'center',
                gap: 16,
                flexShrink: 0,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 20,
                    position: 'relative',
                    flexShrink: 0,
                  }}
                  className="pulse-glow"
                >
                  🤖
                  <span
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      right: 0,
                      width: 10,
                      height: 10,
                      borderRadius: '50%',
                      background: '#10b981',
                      border: '2px solid #07071a',
                    }}
                  />
                </div>
                <div>
                  <div
                    style={{
                      fontSize: 15,
                      fontWeight: 700,
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                    }}
                  >
                    Alex · AI Interview Chatbot Assistant
                    <span
                      style={{
                        fontSize: 10,
                        fontFamily: 'JetBrains Mono',
                        color: '#10b981',
                        background: 'rgba(16,185,129,0.15)',
                        padding: '2px 6px',
                        borderRadius: 4,
                      }}
                    >
                      ONLINE
                    </span>
                  </div>
                </div>
              </div>

              {/* Centered Segmented Mode Toggle Pill */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  background: 'rgba(0,0,0,0.35)',
                  padding: 4,
                  borderRadius: 10,
                  border: '1px solid rgba(255,255,255,0.08)',
                  justifySelf: 'center',
                }}
                className="mobile-hide"
              >
                <button
                  type="button"
                  onClick={() => isStep2Enabled && setSetupMode('preset')}
                  disabled={!isStep2Enabled}
                  title={!isStep2Enabled ? "🔒 Fill Job Description & Upload Resume in Step 1 to unlock Mode 1: Interview" : "Switch to Mode 1"}
                  style={{
                    padding: '6px 16px',
                    borderRadius: 8,
                    border: 'none',
                    background: setupMode === 'preset' ? 'linear-gradient(135deg, #7c3aed, #06b6d4)' : 'transparent',
                    color: setupMode === 'preset' ? 'white' : 'rgba(148,163,184,0.7)',
                    fontWeight: 700,
                    fontSize: 12,
                    cursor: isStep2Enabled ? 'pointer' : 'not-allowed',
                    opacity: isStep2Enabled ? 1 : 0.45,
                    transition: 'all 0.2s ease',
                    fontFamily: 'Outfit',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                  }}
                >
                  🎯 Mode 1: Interview {!isStep2Enabled && '🔒'}
                </button>

                <button
                  type="button"
                  onClick={() => setSetupMode('jd-qa')}
                  style={{
                    padding: '6px 16px',
                    borderRadius: 8,
                    border: 'none',
                    background: setupMode === 'jd-qa' ? 'linear-gradient(135deg, #7c3aed, #06b6d4)' : 'transparent',
                    color: setupMode === 'jd-qa' ? 'white' : 'rgba(148,163,184,0.7)',
                    fontWeight: 700,
                    fontSize: 12,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    fontFamily: 'Outfit',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                  }}
                >
                  🎧 Help & Support
                </button>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 12 }} />
            </div>

            {/* Chatbot Message Stream */}
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
              {chatMessages.map((msg) => {
                const isUser = msg.sender === 'user';
                return (
                  <div
                    key={msg.id}
                    style={{
                      display: 'flex',
                      gap: 12,
                      alignItems: 'flex-start',
                      flexDirection: isUser ? 'row-reverse' : 'row',
                    }}
                  >
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        background: isUser
                          ? 'linear-gradient(135deg, #06b6d4, #10b981)'
                          : 'linear-gradient(135deg, #7c3aed, #06b6d4)',
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
                      {isUser ? 'AK' : '🤖'}
                    </div>

                    <div style={{ maxWidth: '82%' }}>
                      <div
                        style={{
                          fontSize: 10,
                          fontFamily: 'JetBrains Mono',
                          color: isUser ? '#67e8f9' : '#a78bfa',
                          marginBottom: 4,
                          fontWeight: 700,
                          textAlign: isUser ? 'right' : 'left',
                        }}
                      >
                        {isUser ? 'YOU' : 'AI ASSISTANT'} · {msg.time}
                      </div>

                      <div
                        style={{
                          background: isUser
                            ? 'rgba(6,182,212,0.15)'
                            : 'rgba(255,255,255,0.05)',
                          border: isUser
                            ? '1px solid rgba(6,182,212,0.3)'
                            : '1px solid rgba(255,255,255,0.1)',
                          borderRadius: isUser
                            ? '14px 14px 2px 14px'
                            : '14px 14px 14px 2px',
                          padding: '14px 18px',
                          color: 'white',
                          fontSize: 14,
                          lineHeight: 1.6,
                          whiteSpace: 'pre-wrap',
                        }}
                      >
                        <div>{msg.text}</div>

                        {/* Bullet Items inside message (ChatGPT style) */}
                        {msg.bulletItems && msg.bulletItems.length > 0 && (
                          <div
                            style={{
                              marginTop: 10,
                              display: 'flex',
                              flexDirection: 'column',
                              gap: 6,
                            }}
                          >
                            {msg.bulletItems.map((item, idx) => (
                              <div
                                key={idx}
                                onClick={() => triggerUserQuery(item)}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 8,
                                  fontSize: 13,
                                  color: '#67e8f9',
                                  background: 'rgba(6,182,212,0.08)',
                                  padding: '6px 12px',
                                  borderRadius: 8,
                                  border: '1px solid rgba(6,182,212,0.2)',
                                  cursor: 'pointer',
                                  transition: 'all 0.2s ease',
                                }}
                              >
                                <span>•</span>
                                <span style={{ textDecoration: 'underline' }}>
                                  {item}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Embed 1. Select Interview Type Options inside bot message */}
                        {msg.typeCard && (
                          <div style={{ marginTop: 14 }}>
                            <div
                              style={{
                                fontSize: 11,
                                fontFamily: 'JetBrains Mono',
                                color: '#06b6d4',
                                fontWeight: 700,
                                marginBottom: 8,
                              }}
                            >
                              1. SELECT INTERVIEW TYPE:
                            </div>
                            <div
                              style={{
                                display: 'grid',
                                gridTemplateColumns:
                                  'repeat(auto-fit, minmax(200px, 1fr))',
                                gap: 8,
                              }}
                            >
                              {interviewTypeOptions.map((opt) => {
                                const isSel = selectedType === opt.id;
                                return (
                                  <button
                                    key={opt.id}
                                    type="button"
                                    onClick={() => setSelectedType(opt.id)}
                                    style={{
                                      padding: '10px 12px',
                                      borderRadius: 10,
                                      border: isSel
                                        ? `1.5px solid ${opt.color}`
                                        : '1px solid rgba(255,255,255,0.08)',
                                      background: isSel
                                        ? `${opt.color}25`
                                        : 'rgba(255,255,255,0.03)',
                                      color: isSel
                                        ? 'white'
                                        : 'rgba(226,232,240,0.8)',
                                      textAlign: 'left',
                                      cursor: 'pointer',
                                      transition: 'all 0.2s ease',
                                      fontFamily: 'Outfit',
                                    }}
                                  >
                                    <div
                                      style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 6,
                                        fontWeight: 700,
                                        fontSize: 13,
                                      }}
                                    >
                                      <span>{opt.icon}</span>
                                      <span
                                        style={{
                                          color: isSel ? '#67e8f9' : 'white',
                                        }}
                                      >
                                        {opt.title}
                                      </span>
                                    </div>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* Embed 2. Difficulty & Response Mode inside bot message */}
                        {msg.configCard && (
                          <div style={{ marginTop: 14 }}>
                            {/* Uploaded JD Banner */}
                            <div
                              style={{
                                marginBottom: 12,
                                padding: '10px 14px',
                                borderRadius: 10,
                                background:
                                  'linear-gradient(135deg, rgba(6, 182, 212, 0.18), rgba(124, 58, 237, 0.18))',
                                border: '1px solid rgba(6, 182, 212, 0.4)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                flexWrap: 'wrap',
                                gap: 8,
                              }}
                            >
                              <div
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 10,
                                }}
                              >
                                <span style={{ fontSize: 20 }}>📄</span>
                                <div>
                                  <div
                                    style={{
                                      fontSize: 12,
                                      fontWeight: 700,
                                      color: '#67e8f9',
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: 6,
                                    }}
                                  >
                                    <span>TARGET UPLOADED JD:</span>
                                    <span style={{ color: 'white' }}>
                                      Senior Full Stack Engineer (React & Node.js)
                                    </span>
                                  </div>
                                  <div
                                    style={{
                                      fontSize: 11,
                                      color: 'rgba(226, 232, 240, 0.75)',
                                      marginTop: 2,
                                    }}
                                  >
                                    Fintech Scale · 2.5+ Years Exp · Match Score 94% · Key Focus: Frontend Architecture
                                  </div>
                                </div>
                              </div>
                              <span className="tag tag-cyan" style={{ fontSize: 10 }}>
                                ✓ JD Target Sync
                              </span>
                            </div>

                            <div
                              style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr',
                                gap: 14,
                                background: 'rgba(0,0,0,0.25)',
                                padding: 12,
                                borderRadius: 10,
                                border: '1px solid rgba(255,255,255,0.06)',
                              }}
                              className="stack-on-mobile"
                            >
                              <div>
                                <label
                                  style={{
                                    fontSize: 11,
                                    color: '#a78bfa',
                                    display: 'block',
                                    marginBottom: 6,
                                    fontWeight: 700,
                                    fontFamily: 'JetBrains Mono',
                                  }}
                                >
                                  DIFFICULTY LEVEL:
                                </label>
                                <div
                                  style={{
                                    display: 'flex',
                                    gap: 6,
                                    flexWrap: 'wrap',
                                  }}
                                >
                                  {(
                                    ['Easy', 'Medium', 'Hard'] as const
                                  ).map((lvl) => (
                                    <button
                                      key={lvl}
                                      type="button"
                                      onClick={() => setDifficulty(lvl)}
                                      style={{
                                        flex: 1,
                                        minWidth: 70,
                                        padding: '7px 0',
                                        fontSize: 11,
                                        borderRadius: 6,
                                        border:
                                          difficulty === lvl
                                            ? '1.5px solid #7c3aed'
                                            : '1px solid rgba(255,255,255,0.1)',
                                        background:
                                          difficulty === lvl
                                            ? 'rgba(124,58,237,0.3)'
                                            : 'rgba(255,255,255,0.03)',
                                        color:
                                          difficulty === lvl
                                            ? '#c4b5fd'
                                            : 'white',
                                        cursor: 'pointer',
                                        fontWeight: 600,
                                        fontFamily: 'Outfit',
                                      }}
                                    >
                                      {lvl}
                                    </button>
                                  ))}
                                </div>
                              </div>

                              <div>
                                <label
                                  style={{
                                    fontSize: 11,
                                    color: '#ec4899',
                                    display: 'block',
                                    marginBottom: 6,
                                    fontWeight: 700,
                                    fontFamily: 'JetBrains Mono',
                                  }}
                                >
                                  NUMBER OF QUESTIONS:
                                </label>
                                <div
                                  style={{
                                    display: 'flex',
                                    gap: 6,
                                    flexWrap: 'wrap',
                                  }}
                                >
                                  {[5, 10, 25, 50].map((num) => (
                                    <button
                                      key={num}
                                      type="button"
                                      onClick={() => setTargetQuestionCount(num)}
                                      style={{
                                        flex: 1,
                                        minWidth: 45,
                                        padding: '7px 0',
                                        fontSize: 11,
                                        borderRadius: 6,
                                        border:
                                          targetQuestionCount === num
                                            ? '1.5px solid #ec4899'
                                            : '1px solid rgba(255,255,255,0.1)',
                                        background:
                                          targetQuestionCount === num
                                            ? 'rgba(236,72,153,0.3)'
                                            : 'rgba(255,255,255,0.03)',
                                        color:
                                          targetQuestionCount === num
                                            ? '#f472b6'
                                            : 'white',
                                        cursor: 'pointer',
                                        fontWeight: 600,
                                        fontFamily: 'Outfit',
                                      }}
                                    >
                                      {num} Qs {num === 50 ? '🔥' : ''}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Embed Start Interview button inside ready bot message */}
                        {msg.readyCard && (
                          <div style={{ marginTop: 12 }}>
                            <button
                              className="btn-primary"
                              style={{
                                padding: '12px 26px',
                                fontSize: 14,
                                fontWeight: 700,
                                letterSpacing: '0.02em',
                                background:
                                  'linear-gradient(135deg, #ec4899, #7c3aed, #06b6d4)',
                                boxShadow: '0 4px 18px rgba(236, 72, 153, 0.4)',
                              }}
                              onClick={handleStartChatInterview}
                            >
                              🚀 Start {targetQuestionCount}-Question Interactive Interview Now →
                            </button>
                          </div>
                        )}

                        {/* Proceed to Next Question Button in Chat */}
                        {msg.nextQuestionCard && (
                          <div style={{ marginTop: 14 }}>
                            <button
                              className="btn-primary"
                              style={{
                                padding: '10px 22px',
                                fontSize: 13,
                                fontWeight: 700,
                                background:
                                  'linear-gradient(135deg, #10b981, #06b6d4)',
                                boxShadow: '0 4px 14px rgba(16, 185, 129, 0.3)',
                              }}
                              onClick={handleNextChatQuestion}
                            >
                              ➡️ Proceed to Question {msg.nextQNum || 2} →
                            </button>
                          </div>
                        )}

                        {/* Complete Session Button */}
                        {msg.completeCard && (
                          <div style={{ marginTop: 14 }}>
                            <div
                              style={{
                                padding: 12,
                                borderRadius: 10,
                                background: 'rgba(16, 185, 129, 0.12)',
                                border: '1px solid rgba(16, 185, 129, 0.3)',
                                marginBottom: 10,
                                fontSize: 13,
                                color: '#6ee7b7',
                                fontWeight: 600,
                              }}
                            >
                              🎉 Fantastic job! You have completed all questions in this session.
                            </div>
                            <button
                              className="btn-primary"
                              style={{
                                padding: '10px 22px',
                                fontSize: 13,
                                fontWeight: 700,
                                background:
                                  'linear-gradient(135deg, #7c3aed, #ec4899)',
                              }}
                              onClick={() => {
                                onComplete();
                                setPhase('feedback');
                              }}
                            >
                              📊 View Full Performance Report →
                            </button>
                          </div>
                        )}

                        {/* Upgrade Plan Card in Chat */}
                        {msg.upgradeCard && (
                          <div
                            style={{
                              marginTop: 14,
                              padding: 16,
                              borderRadius: 14,
                              background:
                                'linear-gradient(145deg, rgba(124, 58, 237, 0.22), rgba(236, 72, 153, 0.18))',
                              border: '1px solid rgba(124, 58, 237, 0.45)',
                              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
                            }}
                          >
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 10,
                                marginBottom: 8,
                              }}
                            >
                              <span style={{ fontSize: 20 }}>🔒</span>
                              <span
                                style={{
                                  fontSize: 13,
                                  fontWeight: 700,
                                  color: '#f472b6',
                                }}
                              >
                                Master Plan Required for Question 3 to {targetQuestionCount}
                              </span>
                            </div>
                            <p
                              style={{
                                fontSize: 12,
                                color: 'rgba(226, 232, 240, 0.85)',
                                margin: '0 0 14px 0',
                                lineHeight: 1.5,
                              }}
                            >
                              You answered the 2 free practice questions! Upgrade your membership plan to unlock all {targetQuestionCount} questions, complete AI feedback, and full score analysis.
                            </p>
                            <button
                              type="button"
                              className="btn-primary"
                              style={{
                                padding: '10px 20px',
                                fontSize: 13,
                                fontWeight: 700,
                                background:
                                  'linear-gradient(135deg, #7c3aed, #ec4899)',
                                boxShadow: '0 4px 16px rgba(124, 58, 237, 0.5)',
                                borderRadius: 10,
                              }}
                              onClick={onOpenUpgradeModal}
                            >
                              ⚡ Unlock to Upgrade Plan →
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Bot Typing Indicator */}
              {isBotTyping && (
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
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
                    }}
                  >
                    🤖
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      fontFamily: 'JetBrains Mono',
                      color: '#a78bfa',
                      fontStyle: 'italic',
                    }}
                  >
                    Alex is typing answer...
                  </div>
                </div>
              )}
              <div ref={chatBottomRef} />
            </div>

            {/* Quick Suggestions Pills (ChatGPT style) */}
            <div
              style={{
                padding: '8px 16px',
                background: 'rgba(0,0,0,0.2)',
                borderTop: '1px solid rgba(255,255,255,0.06)',
                display: 'flex',
                gap: 8,
                overflowX: 'auto',
                flexShrink: 0,
              }}
            >
              {quickPromptChips.map((chip, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => triggerUserQuery(chip)}
                  style={{
                    padding: '4px 10px',
                    borderRadius: 999,
                    border: '1px solid rgba(124,58,237,0.3)',
                    background: 'rgba(124,58,237,0.1)',
                    color: '#c4b5fd',
                    fontSize: 11,
                    fontWeight: 500,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {chip}
                </button>
              ))}
            </div>

            {/* Chatbot Input Footer Bar */}
            <div
              style={{
                padding: '14px 20px',
                background: 'rgba(255,255,255,0.03)',
                borderTop: '1px solid rgba(255,255,255,0.08)',
                display: 'flex',
                gap: 10,
                alignItems: 'center',
                flexShrink: 0,
              }}
            >
              <input
                className="glass-input"
                placeholder="Ask any interview question (e.g., 'JavaScript basic concepts', 'Array methods')..."
                value={chatInputText}
                onChange={(e) => setChatInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSendMessage();
                  }
                }}
                style={{ flex: 1, fontSize: 13 }}
              />
              <button
                className="btn-primary"
                style={{ padding: '10px 22px', fontSize: 13, flexShrink: 0 }}
                onClick={handleSendMessage}
              >
                Send ↵
              </button>
            </div>
          </div>
        )}

        {/* HELP & SUPPORT SEQUENTIAL WORKFLOW (REPLACING OLD MODE 2 CHATGPT) */}
        {setupMode === 'jd-qa' && (
          <div
            className="glass fade-in"
            style={{
              maxWidth: 1120,
              width: '100%',
              margin: '0 auto',
              borderRadius: 16,
              overflow: 'hidden',
              border: '1px solid rgba(124,58,237,0.35)',
              boxShadow: '0 10px 40px rgba(7, 7, 26, 0.6)',
              display: 'flex',
              flexDirection: 'column',
              minHeight: 600,
              flex: 1,
            }}
          >
            {/* Header Bar */}
            <div
              style={{
                padding: '14px 22px',
                background: 'rgba(124,58,237,0.12)',
                borderBottom: '1px solid rgba(255,255,255,0.08)',
                display: 'grid',
                gridTemplateColumns: '1fr auto 1fr',
                alignItems: 'center',
                gap: 16,
                flexShrink: 0,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 10,
                    background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 20,
                    flexShrink: 0,
                  }}
                >
                  🎧
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: 'white' }}>
                    Help & Support Center
                  </div>
                  <div style={{ fontSize: 11, color: 'rgba(148,163,184,0.7)' }}>
                    Scroll 15 FAQs → AI Assistant → Raise Ticket
                  </div>
                </div>
              </div>

              {/* Mode Toggle Pills */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  background: 'rgba(0,0,0,0.35)',
                  padding: 4,
                  borderRadius: 10,
                  border: '1px solid rgba(255,255,255,0.08)',
                  justifySelf: 'center',
                }}
                className="mobile-hide"
              >
                <button
                  type="button"
                  onClick={() => isStep2Enabled && setSetupMode('preset')}
                  disabled={!isStep2Enabled}
                  title={!isStep2Enabled ? "🔒 Fill Job Description & Upload Resume in Step 1 to unlock Mode 1: Interview" : "Switch to Mode 1"}
                  style={{
                    padding: '6px 16px',
                    borderRadius: 8,
                    border: 'none',
                    background: setupMode === 'preset' ? 'linear-gradient(135deg, #7c3aed, #06b6d4)' : 'transparent',
                    color: setupMode === 'preset' ? 'white' : 'rgba(148,163,184,0.7)',
                    fontWeight: 700,
                    fontSize: 12,
                    cursor: isStep2Enabled ? 'pointer' : 'not-allowed',
                    opacity: isStep2Enabled ? 1 : 0.45,
                    transition: 'all 0.2s ease',
                    fontFamily: 'Outfit',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                  }}
                >
                  🎯 Mode 1: Interview {!isStep2Enabled && '🔒'}
                </button>
                <button
                  type="button"
                  onClick={() => setSetupMode('jd-qa')}
                  style={{
                    padding: '6px 16px',
                    borderRadius: 8,
                    border: 'none',
                    background: setupMode === 'jd-qa' ? 'linear-gradient(135deg, #7c3aed, #06b6d4)' : 'transparent',
                    color: setupMode === 'jd-qa' ? 'white' : 'rgba(148,163,184,0.7)',
                    fontWeight: 700,
                    fontSize: 12,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    fontFamily: 'Outfit',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                  }}
                >
                  🎧 Help & Support
                </button>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 10 }} />
            </div>

            {/* Help & Support Mode 1-Style Chat Window */}
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

                      {/* 15 FAQs List */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {[
                          { id: 1, q: 'How does ATS Resume Scoring work?', a: 'Our AI parses your resume text and compares formatting, skill keyword density, experience metrics, and section structure against your target Job Description to calculate an exact match percentage score out of 100.' },
                          { id: 2, q: 'How many free practice questions or scans do I get?', a: 'Free tier candidates can view 2 practice questions per interview and run basic ATS scans. Upgrading to Pro or Elite unlocks unlimited questions, company-specific mock interviews, and live voice speech analysis.' },
                          { id: 3, q: 'What is STAR feedback in Voice Mock Interview?', a: 'STAR stands for Situation, Task, Action, and Result. Our AI audio analyzer breaks down your spoken answers to check if you clearly covered the context, your specific technical role, and quantitative outcomes.' },
                          { id: 4, q: 'How do I upgrade or manage my membership plan?', a: 'Click the "Upgrade" button in the top navigation or profile tab to choose between Basic (₹499), Plus (₹1,299), Pro (₹2,299), and Elite (₹3,999) plans with instant activation via UPI or cards.' },
                          { id: 5, q: 'Can I export my optimized resume to PDF format?', a: 'Yes! The Live Resume Editor provides 1-click ATS-compliant PDF export with preserved formatting, bullet highlights, and clean typography.' },
                          { id: 6, q: 'What should I do if my microphone isn\'t capturing voice in Mock Interview?', a: 'Ensure browser microphone permissions are allowed (check site permissions in your address bar). Use Google Chrome or Microsoft Edge for best Web Speech API support and verify that your microphone input device is selected.' },
                          { id: 7, q: 'How do I target specific companies like Google, TCS, or Infosys?', a: 'Go to Interview Prep & Question Bank or Voice Mock Interview, and filter by Company Tags (Google, TCS, Amazon, Microsoft, Infosys) to get company-specific past questions and evaluation rubrics.' },
                          { id: 8, q: 'What payment methods are supported for plan upgrades?', a: 'We support UPI (Google Pay, PhonePe, Paytm, BHIM), Credit & Debit Cards (Visa, Mastercard, RuPay), Net Banking, and Wallets through 256-bit SSL encrypted Razorpay checkout.' },
                          { id: 9, q: 'How long does it take for support tickets to be resolved?', a: 'Urgent & High priority tickets receive responses from our support engineers within 1–2 hours. Medium and Low priority queries are resolved within 24 hours.' },
                          { id: 10, q: 'Can I store multiple resume versions for different roles?', a: 'Yes! Under "Job & Resume Management", you can upload and save multiple versions of your CV tailored for different job profiles (e.g. Frontend Developer, Fullstack Engineer, Data Analyst).' },
                          { id: 11, q: 'How does speech speed and filler word detection work?', a: 'During Voice Mock Interview, our AI audio engine computes your Words Per Minute (WPM), voice pauses, and detects filler words like "um", "ah", "like", and "you know" to score your communication confidence.' },
                          { id: 12, q: 'What happens after my subscription plan expires?', a: 'Your account automatically transitions to the standard plan. All your generated report cards, uploaded resumes, and interview history remain permanently stored in your account.' },
                          { id: 13, q: 'Is my personal resume data private and confidential?', a: 'Absolutely. We use enterprise 256-bit encryption. Your personal resume information, contact details, and voice recordings are never shared, sold, or exposed to third parties.' },
                          { id: 14, q: 'How do coupons or promo discount codes work?', a: 'During checkout in the Upgrade modal, enter your active promo code (e.g. WELCOME50 or PRO200) to apply instant percentage or flat discounts on your selected plan.' },
                          { id: 15, q: 'How can I submit feature requests or report a system bug?', a: 'You can use the "Raise Query" section in this Help & Support center to select "Bug Report" or "Feature Request", and our engineering team will evaluate it promptly.' },
                        ]
                          .filter((item) => item.q.toLowerCase().includes(faqSearchQuery.toLowerCase()) || item.a.toLowerCase().includes(faqSearchQuery.toLowerCase()))
                          .map((item) => {
                            const isExpanded = expandedFaqId === item.id;
                            return (
                              <div
                                key={item.id}
                                style={{
                                  borderRadius: 10,
                                  background: isExpanded ? 'rgba(124, 58, 237, 0.15)' : 'rgba(255, 255, 255, 0.06)',
                                  border: isExpanded ? '1px solid rgba(124, 58, 237, 0.4)' : '1px solid rgba(255, 255, 255, 0.12)',
                                  overflow: 'hidden',
                                  transition: 'all 0.2s ease',
                                }}
                              >
                                <button
                                  onClick={() => setExpandedFaqId(isExpanded ? null : item.id)}
                                  style={{
                                    width: '100%',
                                    padding: '12px 16px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    background: 'none',
                                    border: 'none',
                                    color: '#f8fafc',
                                    textAlign: 'left',
                                    cursor: 'pointer',
                                    fontSize: 13,
                                    fontWeight: 600,
                                  }}
                                >
                                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                    <span style={{ fontSize: 11, padding: '3px 8px', borderRadius: 6, background: 'rgba(6, 182, 212, 0.2)', color: '#22d3ee', fontFamily: 'JetBrains Mono', fontWeight: 700 }}>
                                      #{item.id}
                                    </span>
                                    <span style={{ color: 'white' }}>{item.q}</span>
                                  </div>
                                  <span style={{ color: '#c4b5fd', fontSize: 12, marginLeft: 10 }}>
                                    {isExpanded ? '▲' : '▼'}
                                  </span>
                                </button>

                                {isExpanded && (
                                  <div style={{ padding: '0 16px 14px', fontSize: 12.5, color: 'rgba(226, 232, 240, 0.9)', lineHeight: 1.5, borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: 10 }}>
                                    {item.a}
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

                        {faqSatisfiedState === 'satisfied' ? (
                          <div
                            style={{
                              padding: '10px 14px',
                              borderRadius: 10,
                              background: 'rgba(16, 185, 129, 0.2)',
                              border: '1px solid rgba(16, 185, 129, 0.4)',
                              color: '#34d399',
                              fontSize: 13,
                              fontWeight: 600,
                            }}
                          >
                            🎉 Awesome! We are glad we could help. Happy job preparation! 🚀
                          </div>
                        ) : faqSatisfiedState === 'not_satisfied' ? (
                          <div
                            style={{
                              padding: '10px 14px',
                              borderRadius: 10,
                              background: 'rgba(124, 58, 237, 0.15)',
                              border: '1px solid rgba(124, 58, 237, 0.35)',
                              color: '#c4b5fd',
                              fontSize: 12.5,
                              fontWeight: 600,
                            }}
                          >
                            🤖 AI Support Assistant Activated Below 👇
                          </div>
                        ) : (
                          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                            <button
                              onClick={() => setFaqSatisfiedState('satisfied')}
                              style={{
                                padding: '8px 16px',
                                borderRadius: 8,
                                background: 'rgba(16, 185, 129, 0.2)',
                                border: '1px solid rgba(16, 185, 129, 0.4)',
                                color: '#34d399',
                                fontSize: 12,
                                fontWeight: 600,
                                cursor: 'pointer',
                              }}
                            >
                              👍 Yes, I'm Satisfied
                            </button>

                            <button
                              onClick={() => {
                                setFaqSatisfiedState('not_satisfied');
                                if (chatgptMessages.length === 0) {
                                  setChatgptMessages([
                                    {
                                      id: 'init-ai-welcome',
                                      sender: 'bot',
                                      text: "Hello! 👋 I'm your AI Support Assistant. How can I help resolve your query today? Ask any technical, subscription, or interview question below!",
                                      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                                    },
                                  ]);
                                }
                              }}
                              style={{
                                padding: '8px 16px',
                                borderRadius: 8,
                                background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
                                border: 'none',
                                color: 'white',
                                fontSize: 12,
                                fontWeight: 700,
                                cursor: 'pointer',
                                boxShadow: '0 0 15px rgba(124, 58, 237, 0.4)',
                              }}
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
                {faqSatisfiedState === 'not_satisfied' && (() => {
                  const lastBotMsgId = [...chatgptMessages].reverse().find((m) => m.sender === 'bot')?.id;
                  return chatgptMessages.map((msg) => {
                    const isUser = msg.sender === 'user';
                    const isLastBotMsg = msg.id === lastBotMsgId;
                    return (
                      <div
                        key={msg.id}
                        style={{
                          display: 'flex',
                          gap: 12,
                          alignItems: 'flex-start',
                          flexDirection: isUser ? 'row-reverse' : 'row',
                        }}
                      >
                        <div
                          style={{
                            width: 32,
                            height: 32,
                            borderRadius: '50%',
                            background: isUser
                              ? 'linear-gradient(135deg, #06b6d4, #10b981)'
                              : 'linear-gradient(135deg, #7c3aed, #06b6d4)',
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
                          {isUser ? 'AK' : '🤖'}
                        </div>

                        <div style={{ maxWidth: '82%' }}>
                          <div
                            style={{
                              fontSize: 10,
                              fontFamily: 'JetBrains Mono',
                              color: isUser ? '#67e8f9' : '#a78bfa',
                              marginBottom: 4,
                              fontWeight: 700,
                              textAlign: isUser ? 'right' : 'left',
                            }}
                          >
                            {isUser ? 'YOU' : 'AI ASSISTANT'} · {msg.time}
                          </div>

                          <div
                            style={{
                              background: isUser
                                ? 'rgba(6,182,212,0.15)'
                                : 'rgba(255,255,255,0.05)',
                              border: isUser
                                ? '1px solid rgba(6,182,212,0.3)'
                                : '1px solid rgba(255,255,255,0.1)',
                              borderRadius: isUser
                                ? '14px 14px 2px 14px'
                                : '14px 14px 14px 2px',
                              padding: '14px 18px',
                              color: 'white',
                              fontSize: 13.5,
                              lineHeight: 1.6,
                              whiteSpace: 'pre-wrap',
                            }}
                          >
                            <div>{msg.text}</div>

                            {!isUser && (
                              <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
                                <MessageFeedbackSection
                                  isLastBotMsg={isLastBotMsg}
                                  feedbackState={msgFeedbackState[msg.id]}
                                  onSatisfied={() => setMsgFeedbackState((prev) => ({ ...prev, [msg.id]: 'satisfied' }))}
                                  onNotSatisfied={() => {
                                    setMsgFeedbackState((prev) => ({ ...prev, [msg.id]: 'not_satisfied' }));
                                    setAiSatisfiedState('not_satisfied');
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

                {isChatgptTyping && (
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center', color: '#06b6d4', fontSize: 12 }}>
                    <span>🤖</span> AI Assistant is typing response...
                  </div>
                )}

                {/* 3. PRIORITY SUPPORT TICKET FORM (UNLOCKED IN CHAT STREAM WHEN AI NOT SATISFIED) */}
                {aiSatisfiedState === 'not_satisfied' && (
                  <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #f59e0b, #ef4444)',
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
                      🎫
                    </div>

                    <div style={{ maxWidth: '85%', width: '100%' }}>
                      <div
                        style={{
                          fontSize: 10,
                          fontFamily: 'JetBrains Mono',
                          color: '#f59e0b',
                          marginBottom: 4,
                          fontWeight: 700,
                        }}
                      >
                        PRIORITY SUPPORT TICKET FORM
                      </div>

                      {!submittedTicketObj ? (
                        <div
                          style={{
                            background: 'rgba(245, 158, 11, 0.08)',
                            border: '1px solid rgba(245, 158, 11, 0.3)',
                            borderRadius: '14px',
                            padding: '18px',
                            color: 'white',
                          }}
                        >
                          <form
                            onSubmit={(e) => {
                              e.preventDefault();
                              const newTicket = createNewTicket(
                                { id: 'usr_arjun', name: 'Arjun Kumar', email: 'arjun.kumar@gmail.com' },
                                {
                                  category: ticketCategory,
                                  subject: ticketSubject.trim() || 'Priority Support Query',
                                  description: ticketDesc.trim() || 'Details submitted via Help & Support Assistant.',
                                  priority: ticketPriority,
                                }
                              );
                              setSubmittedTicketObj(newTicket);
                              setTicketSuccess(`Support Ticket ${newTicket.id} registered! SLA: 2 hours.`);
                              setTicketSubject('');
                              setTicketDesc('');
                            }}
                            style={{ display: 'flex', flexDirection: 'column', gap: 14 }}
                          >
                            {/* Row 1: Issue Category & Priority Level */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 14 }} className="stack-on-mobile">
                              <div>
                                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#cbd5e1', marginBottom: 6 }}>
                                  Issue Category
                                </label>
                                <select
                                  value={ticketCategory}
                                  onChange={(e) => setTicketCategory(e.target.value as any)}
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
                                    const isSelected = ticketPriority === p;
                                    return (
                                      <button
                                        key={p}
                                        type="button"
                                        onClick={() => setTicketPriority(p)}
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
                                value={ticketSubject}
                                onChange={(e) => setTicketSubject(e.target.value)}
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
                                value={ticketDesc}
                                onChange={(e) => setTicketDesc(e.target.value)}
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
                                Submitting as: <strong style={{ color: 'white' }}>Arjun Kumar</strong> (arjun.kumar@gmail.com)
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
                                boxShadow: '0 4px 15px rgba(124, 58, 237, 0.4)',
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

                <div ref={chatgptBottomRef} />
              </div>

              {/* 4. FIXED CHAT INPUT BAR AT THE BOTTOM OF MODE 2 CHAT WINDOW */}
              <div
                style={{
                  padding: '14px 22px',
                  background: 'rgba(15, 23, 42, 0.8)',
                  borderTop: '1px solid rgba(255,255,255,0.08)',
                  display: 'flex',
                  gap: 12,
                  alignItems: 'center',
                }}
              >
                <input
                  type="text"
                  value={chatInputText}
                  onChange={(e) => setChatInputText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      if (faqSatisfiedState === 'none') setFaqSatisfiedState('not_satisfied');
                      handleSendChatgpt(chatInputText);
                    }
                  }}
                  style={{
                    flex: 1,
                    padding: '12px 16px',
                    borderRadius: 10,
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    color: 'white',
                    fontSize: 13,
                    outline: 'none',
                  }}
                />
                <button
                  onClick={() => {
                    if (faqSatisfiedState === 'none') setFaqSatisfiedState('not_satisfied');
                    handleSendChatgpt(chatInputText);
                  }}
                  style={{
                    padding: '12px 20px',
                    borderRadius: 10,
                    background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
                    border: 'none',
                    color: 'white',
                    fontWeight: 700,
                    fontSize: 13,
                    cursor: 'pointer',
                    boxShadow: '0 0 15px rgba(124, 58, 237, 0.4)',
                  }}
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Phase 2: Live Interview Session
  if (phase === 'interview') {
    if (!hasActiveSubscription && currentQIndex >= 2) {
      return (
        <div className="fade-in page-container" style={{ height: '100%', overflowY: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
          <div
            className="glass-card"
            style={{
              maxWidth: 640,
              width: '100%',
              padding: '36px',
              textAlign: 'center',
              borderRadius: 24,
              border: '1px solid rgba(124, 58, 237, 0.4)',
              background: 'linear-gradient(160deg, rgba(15, 15, 42, 0.95), rgba(7, 7, 26, 0.98))',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.8), 0 0 30px rgba(124, 58, 237, 0.25)',
            }}
          >
            <div style={{ width: 64, height: 64, borderRadius: 20, background: 'rgba(124, 58, 237, 0.2)', border: '1px solid rgba(124, 58, 237, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, margin: '0 auto 18px' }}>
              🔒
            </div>
            <div style={{ fontSize: 11, fontFamily: 'JetBrains Mono', color: '#c4b5fd', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8, fontWeight: 700 }}>
              FREE PRACTICE QUESTION LIMIT REACHED (2 / 2)
            </div>
            <h2 style={{ fontSize: 24, fontWeight: 800, color: 'white', margin: '0 0 12px 0' }}>
              Upgrade Your <span className="gradient-text">Membership Plan</span>
            </h2>
            <p style={{ fontSize: 14, color: 'rgba(148, 163, 184, 0.8)', lineHeight: 1.6, marginBottom: 24 }}>
              You have answered the first 2 practice questions in Mode 1! Upgrade to a membership plan to unlock all 50+ questions, live AI audio feedback, and full score analysis.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                type="button"
                className="btn-primary"
                style={{ padding: '12px 24px', fontSize: 14, borderRadius: 12, background: 'linear-gradient(135deg, #7c3aed, #06b6d4)' }}
                onClick={onOpenUpgradeModal}
              >
                ⚡ Upgrade Subscription Plan Now →
              </button>
              <button
                type="button"
                className="btn-ghost"
                style={{ padding: '12px 20px', fontSize: 13, borderRadius: 12 }}
                onClick={() => setPhase('setup')}
              >
                ← Back to Mode 1 Setup
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div
        className="fade-in page-container"
        style={{ height: '100%', overflowY: 'auto' }}
      >
        {/* Header Bar */}
        <div
          className="stack-on-mobile"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 20,
            gap: 12,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              flexWrap: 'wrap',
            }}
          >
            <span
              style={{
                fontSize: 12,
                fontFamily: 'JetBrains Mono',
                color: selectedOptionInfo?.color || '#7c3aed',
                fontWeight: 700,
                background: `${selectedOptionInfo?.color || '#7c3aed'}20`,
                padding: '4px 10px',
                borderRadius: 6,
                border: `1px solid ${selectedOptionInfo?.color || '#7c3aed'}40`,
              }}
            >
              {selectedOptionInfo?.icon} {selectedOptionInfo?.title}
            </span>
            <span style={{ fontSize: 13, color: 'rgba(148,163,184,0.6)' }}>
              Level: <strong style={{ color: 'white' }}>{difficulty}</strong>
            </span>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              flexWrap: 'wrap',
            }}
          >
            <div
              style={{
                fontFamily: 'JetBrains Mono',
                fontSize: 16,
                color: recording ? '#10b981' : 'rgba(148,163,184,0.5)',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              {recording && (
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: '#10b981',
                    display: 'inline-block',
                  }}
                  className="pulse-glow"
                />
              )}
              {formatTime(timer)}
            </div>

            <span className="tag tag-purple">
              Q{currentQIndex + 1} / {activeQuestions.length}
            </span>
          </div>
        </div>

        {/* Question Box */}
        <div
          className="glass"
          style={{
            padding: '24px',
            marginBottom: 20,
            borderLeft: `4px solid ${selectedOptionInfo?.color || '#7c3aed'}`,
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: 12,
              flexWrap: 'wrap',
              gap: 10,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 20,
                  flexShrink: 0,
                }}
                className={recording ? 'pulse-glow' : ''}
              >
                🤖
              </div>
              <div>
                <div
                  style={{
                    fontSize: 11,
                    fontFamily: 'JetBrains Mono',
                    color: '#a78bfa',
                    fontWeight: 700,
                  }}
                >
                  AI INTERVIEW BOT
                </div>
                <div style={{ fontSize: 13, color: 'rgba(148,163,184,0.6)' }}>
                  Category: {currentQuestion.category}
                </div>
              </div>
            </div>

            {currentQuestion.hint && (
              <div
                style={{
                  fontSize: 11,
                  fontFamily: 'JetBrains Mono',
                  color: '#06b6d4',
                  background: 'rgba(6,182,212,0.1)',
                  padding: '4px 10px',
                  borderRadius: 6,
                  border: '1px solid rgba(6,182,212,0.2)',
                }}
              >
                💡 Hint: {currentQuestion.hint}
              </div>
            )}
          </div>

          <div
            style={{
              fontSize: 16,
              color: 'white',
              lineHeight: 1.6,
              fontWeight: 500,
              marginBottom: currentQuestion.codeSnippet ? 14 : 0,
            }}
          >
            {currentQuestion.q}
          </div>

          {currentQuestion.codeSnippet && (
            <div
              style={{
                marginTop: 12,
                background: '#0d0e1b',
                border: '1px solid rgba(124,58,237,0.3)',
                borderRadius: 10,
                padding: '14px 18px',
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 13,
                color: '#e2e8f0',
                lineHeight: 1.6,
                overflowX: 'auto',
                whiteSpace: 'pre',
              }}
            >
              {currentQuestion.codeSnippet}
            </div>
          )}
        </div>

        {/* Answer Input */}
        <div
          className="glass"
          style={{ padding: '22px 24px', marginBottom: 20 }}
        >
          <div
            className="stack-on-mobile"
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 14,
              gap: 10,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: 'white' }}>
                Your Answer (
                {selectedMode === 'voice' ? 'Voice STT Mode' : 'Text Mode'})
              </span>
            </div>

            <div>
              {!recording ? (
                <button
                  className="btn-primary"
                  style={{
                    padding: '8px 18px',
                    fontSize: 13,
                  }}
                  onClick={handleStartRecording}
                >
                  ● Start{' '}
                  {selectedMode === 'voice' ? 'Voice Recording' : 'Answering'}
                </button>
              ) : (
                <button
                  type="button"
                  style={{
                    padding: '8px 18px',
                    fontSize: 13,
                    borderRadius: 8,
                    border: '1px solid rgba(239,68,68,0.5)',
                    background: 'rgba(239,68,68,0.18)',
                    color: '#fca5a5',
                    cursor: 'pointer',
                  }}
                  onClick={handleStopRecording}
                >
                  ■ Stop Recording
                </button>
              )}
            </div>
          </div>

          <textarea
            className="glass-textarea"
            rows={7}
            placeholder={
              selectedMode === 'voice'
                ? "Click 'Start Voice Recording' and speak your response..."
                : 'Type your code or answer breakdown here...'
            }
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
          />
        </div>

        {/* Footer */}
        <div
          className="stack-on-mobile"
          style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}
        >
          <button
            className="btn-ghost"
            style={{ padding: '10px 20px', fontSize: 13 }}
            onClick={() => {
              if (currentQIndex < activeQuestions.length - 1) {
                setCurrentQIndex((q) => q + 1);
                setAnswer('');
              }
            }}
          >
            Skip Question
          </button>

          <button
            className="btn-primary"
            style={{ padding: '10px 24px', fontSize: 14 }}
            onClick={handleNextQuestion}
          >
            {currentQIndex < activeQuestions.length - 1
              ? 'Next Question →'
              : 'Finish Round & Generate Scorecard →'}
          </button>
        </div>
      </div>
    );
  }

  // Phase 3: Scorecard
  const activeFeedback =
    aiFeedbackPresets[selectedType] || aiFeedbackPresets.theory;
  const avgScore = Math.round(
    activeFeedback.reduce((a, b) => a + b.score, 0) / activeFeedback.length
  );

  return (
    <div
      className="fade-in page-container"
      style={{ height: '100%', overflowY: 'auto' }}
    >
      <div
        className="stack-on-mobile"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: 24,
          gap: 12,
        }}
      >
        <div>
          <div
            style={{
              fontSize: 11,
              fontFamily: 'JetBrains Mono',
              color: '#10b981',
              letterSpacing: '0.08em',
              marginBottom: 4,
              fontWeight: 700,
            }}
          >
            ✓ MOCK SESSION COMPLETED
          </div>
          <h1
            style={{
              fontSize: 26,
              fontWeight: 800,
              color: 'white',
              margin: 0,
              letterSpacing: '-0.02em',
            }}
          >
            AI Performance <span className="gradient-text">Scorecard</span>
          </h1>
        </div>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button
            className="btn-ghost"
            style={{ padding: '9px 16px', fontSize: 13 }}
            onClick={() => setPhase('setup')}
          >
            ← Practice Another Round
          </button>
          <button
            className="btn-primary"
            style={{ padding: '9px 18px', fontSize: 13 }}
            onClick={() => onNavigate('reports')}
          >
            Save Report →
          </button>
        </div>
      </div>

      <div className="grid-responsive-sidebar">
        <div
          className="glass"
          style={{ padding: '28px 20px', textAlign: 'center' }}
        >
          <div
            style={{
              fontSize: 12,
              fontFamily: 'JetBrains Mono',
              color: 'rgba(148,163,184,0.6)',
              marginBottom: 8,
            }}
          >
            OVERALL RATING
          </div>
          <div
            style={{
              fontSize: 56,
              fontWeight: 800,
              color: '#10b981',
              lineHeight: 1,
              marginBottom: 4,
            }}
          >
            {avgScore}
          </div>
          <div
            style={{
              fontSize: 12,
              color: 'rgba(148,163,184,0.4)',
              marginBottom: 16,
            }}
          >
            / 100
          </div>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#10b981' }}>
            Strong Hire Recommendation
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {activeFeedback.map((f) => (
            <div
              key={f.aspect}
              className="glass"
              style={{ padding: '20px 24px' }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: 8,
                }}
              >
                <span style={{ fontSize: 15, fontWeight: 700, color: 'white' }}>
                  {f.aspect}
                </span>
                <span
                  style={{
                    fontSize: 16,
                    fontWeight: 800,
                    color: '#10b981',
                    fontFamily: 'JetBrains Mono',
                  }}
                >
                  {f.score}
                </span>
              </div>
              <div style={{ fontSize: 13, color: 'rgba(226,232,240,0.85)' }}>
                {f.note}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
