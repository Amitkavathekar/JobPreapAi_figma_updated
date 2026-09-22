import { useState } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import {
  DEFAULT_COUPONS,
  getStoredCoupons,
  saveStoredCoupons,
} from '../services/couponService';
import { ActivityLogItem, AdminScreen, AdminUser, Coupon } from '../types';

// Import modular sub-components
import ActivityLogScreen from '../components/admin/ActivityLogScreen';
import AiModelsScreen from '../components/admin/AiModelsScreen';
import ConfirmationModal from '../components/admin/ConfirmationModal';
import CouponModal from '../components/admin/CouponModal';
import EmptyState from '../components/admin/EmptyState';
import NotificationSettingsScreen from '../components/admin/NotificationSettingsScreen';
import PlanModal, { PlanData } from '../components/admin/PlanModal';
import SupportTicketsScreen from '../components/admin/SupportTicketsScreen';
import UserDetailView from '../components/admin/UserDetailView';

interface AdminPanelProps {
  onLogout: () => void;
}

const INITIAL_PLANS: PlanData[] = [
  {
    id: 'plan-monthly',
    name: 'Basic',
    duration: '1 Month',
    months: 1,
    priceINR: 499,
    originalPriceINR: 499,
    mockLimit: '10 Interviews / mo',
    atsLimit: '25 Resume Scans / mo',
    status: 'Active',
    subscribersCount: 342,
    features: [
      '10 AI Mock Interviews per month',
      '25 ATS Resume Analysis scans',
      'Standard AI Feedback & Score',
      'Basic Access',
      'Email Support',
    ],
  },
  {
    id: 'plan-quarterly',
    name: 'Plus',
    duration: '3 Months',
    months: 3,
    priceINR: 1299,
    originalPriceINR: 1299,
    mockLimit: '35 Interviews / qtr',
    atsLimit: '75 Resume Scans / qtr',
    status: 'Active',
    subscribersCount: 856,
    features: [
      '35 AI Mock Interviews (3 Months)',
      '75 ATS Resume Scans',
      'Deep Detailed AI Audio/Video Feedback',
      'Resume PDF Exporter & Editor',
      'Priority Chat Support',
    ],
  },
  {
    id: 'plan-halfyearly',
    name: 'Pro',
    duration: '6 Months',
    months: 6,
    priceINR: 2299,
    originalPriceINR: 2299,
    mockLimit: 'Unlimited Mock Interviews',
    atsLimit: 'Unlimited Resume Scans',
    status: 'Active',
    subscribersCount: 1420,
    features: [
      'Unlimited AI Mock Interviews',
      'Unlimited ATS Scans & Resume Tailoring',
      'Company-Specific Interview Simulations (Google, TCS, Infosys)',
      'Live Speech Speed & Filler Word AI Analysis',
      'Export PDF Reports with Custom Branding',
      '1-on-1 AI Resume Optimization Assistant',
    ],
  },
  {
    id: 'plan-annual',
    name: 'Elite',
    duration: '1 Year',
    months: 12,
    priceINR: 3999,
    originalPriceINR: 3999,
    mockLimit: 'Unlimited + VIP Priority',
    atsLimit: 'Unlimited + VIP Priority',
    status: 'Active',
    subscribersCount: 680,
    features: [
      'All Pro Plan Features Included',
      'VIP Priority Queue for AI Speech Processing',
      'Unlimited Mock Interviews & Resume Revisions for 365 Days',
      'Job Application Tracker & Referral Assistant',
      'Dedicated Placement & Interview Consultation',
      'Certificate of Job Readiness',
    ],
  },
];

const INITIAL_COUPONS: Coupon[] = [
  {
    id: 'cpn_1',
    code: 'FESTIVE25',
    discountType: 'Percentage',
    discountValue: 25,
    applicablePlans: ['All Plans'],
    usageLimit: 500,
    timesUsed: 412,
    expiryDate: '2026-12-31',
    status: 'Active',
  },
  {
    id: 'cpn_2',
    code: 'STUDENT50',
    discountType: 'Percentage',
    discountValue: 50,
    applicablePlans: ['Pro', 'Elite'],
    usageLimit: 1000,
    timesUsed: 890,
    expiryDate: '2026-10-15',
    status: 'Active',
  },
  {
    id: 'cpn_3',
    code: 'MOCKPRO20',
    discountType: 'Percentage',
    discountValue: 20,
    applicablePlans: ['Pro'],
    usageLimit: 400,
    timesUsed: 265,
    expiryDate: '2026-11-30',
    status: 'Active',
  },
  {
    id: 'cpn_4',
    code: 'RESUME100',
    discountType: 'Flat Amount',
    discountValue: 100,
    applicablePlans: ['Basic', 'Plus'],
    usageLimit: 600,
    timesUsed: 520,
    expiryDate: '2026-11-15',
    status: 'Active',
  },
  {
    id: 'cpn_5',
    code: 'GOOGLEPREP',
    discountType: 'Percentage',
    discountValue: 30,
    applicablePlans: ['Elite'],
    usageLimit: 300,
    timesUsed: 188,
    expiryDate: '2026-12-25',
    status: 'Active',
  },
  {
    id: 'cpn_6',
    code: 'NEWCANDIDATE',
    discountType: 'Percentage',
    discountValue: 15,
    applicablePlans: ['All Plans'],
    usageLimit: 1500,
    timesUsed: 940,
    expiryDate: '2027-01-31',
    status: 'Active',
  },
  {
    id: 'cpn_7',
    code: 'EARLYBIRD',
    discountType: 'Flat Amount',
    discountValue: 300,
    applicablePlans: ['Basic', 'Plus'],
    usageLimit: 200,
    timesUsed: 200,
    expiryDate: '2026-08-30',
    status: 'Expired',
  },
  {
    id: 'cpn_8',
    code: 'DIWALI500',
    discountType: 'Flat Amount',
    discountValue: 500,
    applicablePlans: ['Elite'],
    usageLimit: 250,
    timesUsed: 250,
    expiryDate: '2026-09-01',
    status: 'Expired',
  },
];

const INITIAL_USERS: AdminUser[] = [
  // --- Joined in Last 7 Days (2026-09-14 to 2026-09-21) ---
  {
    id: 'usr_107',
    name: 'Rohan Verma',
    email: 'rohan.v@gmail.com',
    plan: 'Pro',
    planExpiry: '2027-03-18',
    status: 'Active',
    joined: '2026-09-18',
    spent: '₹2,299',
    phone: '+91 98111 22334',
    location: 'Delhi, DL',
    mockCount: 14,
    atsCount: 28,
  },
  {
    id: 'usr_108',
    name: 'Ananya Roy',
    email: 'ananya.r@gmail.com',
    plan: 'Basic',
    planExpiry: '2026-10-20',
    status: 'Active',
    joined: '2026-09-20',
    spent: '₹499',
    phone: '+91 97222 33445',
    location: 'Kolkata, WB',
    mockCount: 4,
    atsCount: 7,
  },
  {
    id: 'usr_113',
    name: 'Devendra Joshi',
    email: 'devendra.j@outlook.com',
    plan: 'Elite',
    planExpiry: '2027-09-21',
    status: 'Active',
    joined: '2026-09-21',
    spent: '₹3,999',
    phone: '+91 98234 56789',
    location: 'Bengaluru, KA',
    mockCount: 6,
    atsCount: 18,
  },
  {
    id: 'usr_114',
    name: 'Aditya Sen',
    email: 'aditya.sen@gmail.com',
    plan: 'Plus',
    planExpiry: '2026-12-19',
    status: 'Active',
    joined: '2026-09-19',
    spent: '₹1,299',
    phone: '+91 98765 43219',
    location: 'Noida, UP',
    mockCount: 11,
    atsCount: 23,
  },
  {
    id: 'usr_115',
    name: 'Tanvi Shinde',
    email: 'tanvi.s@gmail.com',
    plan: 'Pro',
    planExpiry: '2027-03-17',
    status: 'Active',
    joined: '2026-09-17',
    spent: '₹2,299',
    phone: '+91 98190 87654',
    location: 'Pune, MH',
    mockCount: 16,
    atsCount: 35,
  },
  {
    id: 'usr_116',
    name: 'Manish Pandey',
    email: 'manish.p@yahoo.com',
    plan: 'Basic',
    planExpiry: '2026-10-16',
    status: 'Active',
    joined: '2026-09-16',
    spent: '₹499',
    phone: '+91 97654 32109',
    location: 'Indore, MP',
    mockCount: 3,
    atsCount: 8,
  },
  {
    id: 'usr_117',
    name: 'Simran Kaur',
    email: 'simran.k@gmail.com',
    plan: 'None',
    planExpiry: 'Free Tier',
    status: 'Active',
    joined: '2026-09-15',
    spent: '₹0',
    phone: '+91 98450 12345',
    location: 'Chandigarh, PB',
    mockCount: 1,
    atsCount: 2,
  },
  {
    id: 'usr_118',
    name: 'Varun Nair',
    email: 'varun.nair@tech.co',
    plan: 'Plus',
    planExpiry: '2026-12-14',
    status: 'Active',
    joined: '2026-09-14',
    spent: '₹1,299',
    phone: '+91 99401 23456',
    location: 'Kochi, KL',
    mockCount: 9,
    atsCount: 19,
  },

  // --- Joined in Last 30 Days (2026-08-22 to 2026-09-13) ---
  {
    id: 'usr_105',
    name: 'Vikram Mehta',
    email: 'v.mehta@techcorp.io',
    plan: 'Basic',
    planExpiry: '2026-10-01',
    status: 'Active',
    joined: '2026-09-01',
    spent: '₹499',
    phone: '+91 99887 76655',
    location: 'Hyderabad, TS',
    mockCount: 5,
    atsCount: 14,
  },
  {
    id: 'usr_106',
    name: 'Aarti Kulkarni',
    email: 'aarti.k@gmail.com',
    plan: 'Pro',
    planExpiry: '2027-02-28',
    status: 'Active',
    joined: '2026-08-28',
    spent: '₹2,299',
    phone: '+91 94220 33445',
    location: 'Thane, MH',
    mockCount: 19,
    atsCount: 38,
  },
  {
    id: 'usr_109',
    name: 'Karan Joshi',
    email: 'karan.j@tech.com',
    plan: 'Plus',
    planExpiry: '2026-11-25',
    status: 'Active',
    joined: '2026-08-25',
    spent: '₹1,299',
    phone: '+91 96333 44556',
    location: 'Ahmedabad, GJ',
    mockCount: 15,
    atsCount: 22,
  },
  {
    id: 'usr_119',
    name: 'Ritika Basu',
    email: 'ritika.basu@gmail.com',
    plan: 'Pro',
    planExpiry: '2027-03-10',
    status: 'Active',
    joined: '2026-09-10',
    spent: '₹2,299',
    phone: '+91 98310 98765',
    location: 'Kolkata, WB',
    mockCount: 21,
    atsCount: 44,
  },
  {
    id: 'usr_120',
    name: 'Kavita Rao',
    email: 'kavita.rao@outlook.com',
    plan: 'Elite',
    planExpiry: '2027-09-05',
    status: 'Active',
    joined: '2026-09-05',
    spent: '₹3,999',
    phone: '+91 98860 11223',
    location: 'Bengaluru, KA',
    mockCount: 38,
    atsCount: 82,
  },
  {
    id: 'usr_121',
    name: 'Nikhil Chawla',
    email: 'nikhil.c@gmail.com',
    plan: 'Basic',
    planExpiry: '2026-09-30',
    status: 'Active',
    joined: '2026-08-30',
    spent: '₹499',
    phone: '+91 98100 55443',
    location: 'Gurgaon, HR',
    mockCount: 4,
    atsCount: 10,
  },
  {
    id: 'usr_122',
    name: 'Deepak Choudhary',
    email: 'deepak.c@yahoo.com',
    plan: 'None',
    planExpiry: 'Free Tier',
    status: 'Active',
    joined: '2026-08-26',
    spent: '₹0',
    phone: '+91 97180 66778',
    location: 'Jaipur, RJ',
    mockCount: 2,
    atsCount: 3,
  },

  // --- Joined in Last 6 Months (2026-03-25 to 2026-08-21) ---
  {
    id: 'usr_101',
    name: 'Rahul Sharma',
    email: 'rahul.s@gmail.com',
    plan: 'Pro',
    planExpiry: '2027-02-12',
    status: 'Active',
    joined: '2026-08-12',
    spent: '₹2,299',
    phone: '+91 98201 12345',
    location: 'Mumbai, MH',
    mockCount: 27,
    atsCount: 52,
  },
  {
    id: 'usr_102',
    name: 'Priya Patil',
    email: 'priya.patil@outlook.com',
    plan: 'Elite',
    planExpiry: '2027-07-04',
    status: 'Active',
    joined: '2026-07-04',
    spent: '₹3,999',
    phone: '+91 97110 54321',
    location: 'Pune, MH',
    mockCount: 54,
    atsCount: 110,
  },
  {
    id: 'usr_103',
    name: 'Amit Kavathekar',
    email: 'amit.k@jobprep.ai',
    plan: 'Elite',
    planExpiry: 'Lifetime VIP',
    status: 'Active',
    joined: '2026-05-01',
    spent: '₹0',
    phone: '+91 98900 00000',
    location: 'Bangalore, KA',
    mockCount: 120,
    atsCount: 200,
  },
  {
    id: 'usr_104',
    name: 'Sneha Deshmukh',
    email: 'sneha.d@yahoo.com',
    plan: 'Plus',
    planExpiry: '2026-08-10 (Expired)',
    status: 'Expired',
    joined: '2026-05-10',
    spent: '₹1,299',
    phone: '+91 96500 11223',
    location: 'Nagpur, MH',
    mockCount: 8,
    atsCount: 15,
  },
  {
    id: 'usr_110',
    name: 'Neha Kapoor',
    email: 'neha.k@hotmail.com',
    plan: 'Basic',
    planExpiry: '2026-06-15 (Expired)',
    status: 'Expired',
    joined: '2026-05-15',
    spent: '₹499',
    phone: '+91 95444 55667',
    location: 'Chandigarh, PB',
    mockCount: 6,
    atsCount: 11,
  },
  {
    id: 'usr_123',
    name: 'Gaurav Singhania',
    email: 'gaurav.s@techcorp.in',
    plan: 'Pro',
    planExpiry: '2027-01-15',
    status: 'Active',
    joined: '2026-07-15',
    spent: '₹2,299',
    phone: '+91 98211 44556',
    location: 'Mumbai, MH',
    mockCount: 24,
    atsCount: 46,
  },
  {
    id: 'usr_124',
    name: 'Meera Krishnan',
    email: 'meera.k@gmail.com',
    plan: 'Elite',
    planExpiry: '2027-06-20',
    status: 'Active',
    joined: '2026-06-20',
    spent: '₹3,999',
    phone: '+91 94440 12399',
    location: 'Chennai, TN',
    mockCount: 46,
    atsCount: 94,
  },
  {
    id: 'usr_125',
    name: 'Anand Verma',
    email: 'anand.v@crawler.ai',
    plan: 'Plus',
    planExpiry: 'Suspended',
    status: 'Suspended',
    joined: '2026-06-02',
    spent: '₹1,299',
    phone: '+91 99112 33445',
    location: 'Delhi, DL',
    mockCount: 2,
    atsCount: 5,
  },
  {
    id: 'usr_126',
    name: 'Suresh Pillai',
    email: 'suresh.p@yahoo.com',
    plan: 'Basic',
    planExpiry: '2026-05-18 (Expired)',
    status: 'Expired',
    joined: '2026-04-18',
    spent: '₹499',
    phone: '+91 98470 55667',
    location: 'Thiruvananthapuram, KL',
    mockCount: 5,
    atsCount: 9,
  },
  {
    id: 'usr_127',
    name: 'Bhavna Jain',
    email: 'bhavna.jain@gmail.com',
    plan: 'Pro',
    planExpiry: '2026-10-05',
    status: 'Active',
    joined: '2026-04-05',
    spent: '₹2,299',
    phone: '+91 98290 77889',
    location: 'Ahmedabad, GJ',
    mockCount: 31,
    atsCount: 58,
  },

  // --- Joined in Last 1 Year & Earlier (2025-05-01 to 2026-03-24) ---
  {
    id: 'usr_111',
    name: 'Siddharth Malhotra',
    email: 'siddharth.m@gmail.com',
    plan: 'Elite',
    planExpiry: '2026-11-10',
    status: 'Active',
    joined: '2025-11-10',
    spent: '₹3,999',
    phone: '+91 94555 66778',
    location: 'Jaipur, RJ',
    mockCount: 52,
    atsCount: 88,
  },
  {
    id: 'usr_112',
    name: 'Pooja Hegde',
    email: 'pooja.h@yahoo.com',
    plan: 'Plus',
    planExpiry: '2025-12-05 (Expired)',
    status: 'Expired',
    joined: '2025-09-05',
    spent: '₹1,299',
    phone: '+91 93666 77889',
    location: 'Chennai, TN',
    mockCount: 9,
    atsCount: 18,
  },
  {
    id: 'usr_128',
    name: 'Tushar Agrawal',
    email: 'tushar.a@gmail.com',
    plan: 'Pro',
    planExpiry: '2026-06-01',
    status: 'Active',
    joined: '2025-12-01',
    spent: '₹4,598',
    phone: '+91 98390 12345',
    location: 'Lucknow, UP',
    mockCount: 36,
    atsCount: 65,
  },
  {
    id: 'usr_129',
    name: 'Farhan Khan',
    email: 'farhan.k@outlook.com',
    plan: 'Plus',
    planExpiry: '2026-01-18 (Expired)',
    status: 'Expired',
    joined: '2025-10-18',
    spent: '₹1,299',
    phone: '+91 98260 23456',
    location: 'Bhopal, MP',
    mockCount: 7,
    atsCount: 12,
  },
  {
    id: 'usr_130',
    name: 'Pallavi Sengupta',
    email: 'pallavi.s@gmail.com',
    plan: 'Basic',
    planExpiry: '2025-09-14 (Expired)',
    status: 'Expired',
    joined: '2025-08-14',
    spent: '₹499',
    phone: '+91 98300 45678',
    location: 'Kolkata, WB',
    mockCount: 3,
    atsCount: 6,
  },
  {
    id: 'usr_131',
    name: 'Harshil Bhatt',
    email: 'harshil.b@gmail.com',
    plan: 'None',
    planExpiry: 'Free Tier',
    status: 'Active',
    joined: '2025-06-25',
    spent: '₹0',
    phone: '+91 98790 98765',
    location: 'Surat, GJ',
    mockCount: 2,
    atsCount: 4,
  },
  {
    id: 'usr_132',
    name: 'Abhishek Das',
    email: 'abhishek.das@spammail.com',
    plan: 'Elite',
    planExpiry: 'Suspended',
    status: 'Suspended',
    joined: '2025-05-12',
    spent: '₹3,999',
    phone: '+91 98311 99887',
    location: 'Guwahati, AS',
    mockCount: 15,
    atsCount: 25,
  },
];

const INITIAL_ACTIVITY_LOGS: ActivityLogItem[] = [
  {
    id: 'log_1',
    adminName: 'Amit Kavathekar',
    adminRole: 'Admin',
    action: 'Changed price of Pro Plan from ₹2,499 to ₹2,299',
    target: 'Pro',
    type: 'Pricing',
    timestamp: '10 mins ago',
  },
  {
    id: 'log_2',
    adminName: 'Amit Kavathekar',
    adminRole: 'Admin',
    action:
      'Issued ₹499 refund to candidate Vikram Mehta following double payment',
    target: 'Vikram Mehta',
    type: 'User Action',
    timestamp: '1 hour ago',
  },
  {
    id: 'log_3',
    adminName: 'Amit Kavathekar',
    adminRole: 'Admin',
    action: 'Created promotional coupon FESTIVE25 (25% off all tiers)',
    target: 'FESTIVE25',
    type: 'Coupon',
    timestamp: '3 hours ago',
  },
  {
    id: 'log_4',
    adminName: 'Amit Kavathekar',
    adminRole: 'Admin',
    action:
      'Added 45 new technical interview questions for Google & Microsoft frontend roles',
    target: 'Interview Prep Question Bank',
    type: 'Content',
    timestamp: '5 hours ago',
  },
  {
    id: 'log_5',
    adminName: 'Amit Kavathekar',
    adminRole: 'Admin',
    action: 'Suspended user account for suspicious automated crawling activity',
    target: 'Anand Verma',
    type: 'User Action',
    timestamp: 'Yesterday',
  },
  {
    id: 'log_6',
    adminName: 'Amit Kavathekar',
    adminRole: 'Admin',
    action: 'Increased redemptions usage limit for STUDENT50 coupon to 1,000',
    target: 'STUDENT50',
    type: 'Coupon',
    timestamp: 'Yesterday',
  },
  {
    id: 'log_7',
    adminName: 'Amit Kavathekar',
    adminRole: 'Admin',
    action:
      'Updated 2026 trending keywords in ATS scoring dictionary (Kubernetes, Next.js 15, LangChain)',
    target: 'ATS Resume Analyzer',
    type: 'Content',
    timestamp: '1 day ago',
  },
  {
    id: 'log_8',
    adminName: 'Amit Kavathekar',
    adminRole: 'Admin',
    action:
      'Updated Razorpay & Stripe Gateway live production webhook credentials',
    target: 'Payment Gateways',
    type: 'Settings',
    timestamp: '2 days ago',
  },
  {
    id: 'log_9',
    adminName: 'Amit Kavathekar',
    adminRole: 'Admin',
    action:
      'Switched default Mock Interview voice analysis AI engine to Gemini 1.5 Pro',
    target: 'AI Models',
    type: 'Settings',
    timestamp: '3 days ago',
  },
  {
    id: 'log_10',
    adminName: 'Amit Kavathekar',
    adminRole: 'Admin',
    action:
      'Added 6 new STAR behavioral interview evaluation rubrics for leadership roles',
    target: 'Mock Interview Rubrics',
    type: 'Content',
    timestamp: '3 days ago',
  },
  {
    id: 'log_11',
    adminName: 'Amit Kavathekar',
    adminRole: 'Admin',
    action:
      'Published company-simulation coupon GOOGLEPREP (30% off Elite plan)',
    target: 'GOOGLEPREP',
    type: 'Coupon',
    timestamp: '4 days ago',
  },
  {
    id: 'log_12',
    adminName: 'Amit Kavathekar',
    adminRole: 'Admin',
    action:
      'Configured SendGrid transactional email SMTP relay for GST invoice delivery',
    target: 'Email Service',
    type: 'Settings',
    timestamp: '4 days ago',
  },
  {
    id: 'log_13',
    adminName: 'Amit Kavathekar',
    adminRole: 'Admin',
    action:
      'Updated Elite annual subscription price to ₹3,999 with VIP priority access',
    target: 'Elite',
    type: 'Pricing',
    timestamp: '5 days ago',
  },
  {
    id: 'log_14',
    adminName: 'Amit Kavathekar',
    adminRole: 'Admin',
    action:
      'Published updated FAQ guide on microphone permissions for Web Speech API',
    target: 'Support Knowledge Base',
    type: 'Content',
    timestamp: '5 days ago',
  },
  {
    id: 'log_15',
    adminName: 'Amit Kavathekar',
    adminRole: 'Admin',
    action:
      'Updated ATS scoring keyword match tolerance threshold from 70% to 75%',
    target: 'ATS Engine',
    type: 'Settings',
    timestamp: '6 days ago',
  },
  {
    id: 'log_16',
    adminName: 'Amit Kavathekar',
    adminRole: 'Admin',
    action:
      'Reactivated suspended account for Sneha Deshmukh following 2FA verification',
    target: 'Sneha Deshmukh',
    type: 'User Action',
    timestamp: '1 week ago',
  },
  {
    id: 'log_17',
    adminName: 'Amit Kavathekar',
    adminRole: 'Admin',
    action:
      'Marked promotional code EARLYBIRD as Expired after reaching 200 redemptions',
    target: 'EARLYBIRD',
    type: 'Coupon',
    timestamp: '1 week ago',
  },
  {
    id: 'log_18',
    adminName: 'Amit Kavathekar',
    adminRole: 'Admin',
    action: 'Manually granted Elite VIP access to hackathon winner',
    target: 'Devendra Joshi',
    type: 'User Action',
    timestamp: '1 week ago',
  },
];

interface MembershipPlanCardProps {
  plan: PlanData;
  coupons: Coupon[];
  onToggleStatus: (plan: PlanData) => void;
  onEditPlan: (plan: PlanData) => void;
}

function MembershipPlanCard({
  plan,
  coupons,
  onToggleStatus,
  onEditPlan,
}: MembershipPlanCardProps) {
  const [couponCode, setCouponCode] = useState('');
  const [testResult, setTestResult] = useState<{
    valid: boolean;
    discountText: string;
    finalPrice: number;
  } | null>(null);

  const handleCheckCoupon = () => {
    const clean = couponCode.trim().toUpperCase();
    if (!clean) {
      setTestResult(null);
      return;
    }

    const targetCoupon: Coupon | undefined =
      coupons.find((c) => c.code.toUpperCase() === clean) ||
      DEFAULT_COUPONS.find((c) => c.code.toUpperCase() === clean);

    if (!targetCoupon) {
      setTestResult({
        valid: false,
        discountText: `✕ Invalid coupon code "${clean}"`,
        finalPrice: plan.priceINR,
      });
      return;
    }

    // Check if coupon is applicable to THIS particular membership plan card
    const isApplicable =
      targetCoupon.applicablePlans.includes('All Plans') ||
      targetCoupon.applicablePlans.includes('All') ||
      targetCoupon.applicablePlans.some(
        (ap) =>
          ap.toLowerCase().includes(plan.name.toLowerCase()) ||
          plan.name.toLowerCase().includes(ap.toLowerCase())
      );

    if (!isApplicable) {
      setTestResult({
        valid: false,
        discountText: `⚠️ Warning: Coupon ${targetCoupon.code} is NOT eligible for ${plan.name} plan. (Applicable only to: ${targetCoupon.applicablePlans.join(', ')})`,
        finalPrice: plan.priceINR,
      });
      return;
    }

    if (targetCoupon.status === 'Expired') {
      setTestResult({
        valid: false,
        discountText: `⚠️ Coupon ${targetCoupon.code} is Expired!`,
        finalPrice: plan.priceINR,
      });
      return;
    }

    let finalPrice = plan.priceINR;
    if (targetCoupon.discountType === 'Percentage') {
      finalPrice = Math.round(
        plan.priceINR * (1 - targetCoupon.discountValue / 100)
      );
    } else {
      finalPrice = Math.max(0, plan.priceINR - targetCoupon.discountValue);
    }

    setTestResult({
      valid: true,
      discountText: `✓ ${targetCoupon.code} Workable! (${targetCoupon.discountType === 'Percentage' ? `${targetCoupon.discountValue}% OFF` : `₹${targetCoupon.discountValue} OFF`})`,
      finalPrice,
    });
  };

  return (
    <div
      className="glass-card"
      style={{
        padding: 22,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        border: '1px solid rgba(255,255,255,0.08)',
        background: 'rgba(255,255,255,0.02)',
      }}
    >
      <div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              fontFamily: 'JetBrains Mono',
              color: '#ec4899',
              textTransform: 'uppercase',
            }}
          >
            {plan.duration} ({plan.months} Month{plan.months > 1 ? 's' : ''})
          </span>
          <span
            style={{
              fontSize: 11,
              padding: '2px 8px',
              borderRadius: 4,
              background:
                plan.status === 'Active'
                  ? 'rgba(16, 185, 129, 0.15)'
                  : 'rgba(239, 68, 68, 0.15)',
              color: plan.status === 'Active' ? '#34d399' : '#f87171',
              fontWeight: 600,
            }}
          >
            ● {plan.status}
          </span>
        </div>

        <h4
          style={{
            fontSize: 20,
            fontWeight: 800,
            color: 'white',
            margin: '8px 0 4px',
          }}
        >
          {plan.name}
        </h4>

        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            gap: 8,
            margin: '10px 0 14px',
          }}
        >
          <span style={{ fontSize: 28, fontWeight: 800, color: '#ffffff' }}>
            ₹{testResult?.valid ? testResult.finalPrice : plan.priceINR}
          </span>
          {testResult?.valid && (
            <span style={{ fontSize: 12, color: '#34d399', fontWeight: 700 }}>
              (Original ₹{plan.priceINR})
            </span>
          )}
          <span style={{ fontSize: 11, color: '#94a3b8' }}>/ total</span>
        </div>

        <ul
          style={{
            paddingLeft: 16,
            margin: '0 0 16px',
            fontSize: 12,
            color: '#cbd5e1',
            display: 'flex',
            flexDirection: 'column',
            gap: 6,
          }}
        >
          {plan.features.map((feat, idx) => (
            <li key={idx}>{feat}</li>
          ))}
        </ul>

        {/* TEST COUPON CODE (ADMIN CHECK) Inside This Particular Card */}
        <div
          style={{
            background: 'rgba(255,255,255,0.03)',
            padding: 12,
            borderRadius: 10,
            border: '1px solid rgba(255,255,255,0.08)',
            marginBottom: 14,
          }}
        >
          <div style={{ display: 'flex', gap: 6 }}>
            <input
              type="text"
              value={couponCode}
              onChange={(e) => {
                setCouponCode(e.target.value.toUpperCase());
                setTestResult(null);
              }}
              placeholder="Enter code (e.g. FESTIVE25)"
              className="glass-input"
              style={{ padding: '6px 8px', fontSize: 11, flex: 1 }}
            />
            <button
              type="button"
              onClick={handleCheckCoupon}
              style={{
                background: 'rgba(16, 185, 129, 0.2)',
                border: '1px solid #10b981',
                color: '#34d399',
                padding: '6px 10px',
                borderRadius: 6,
                cursor: 'pointer',
                fontWeight: 700,
                fontSize: 11,
                whiteSpace: 'nowrap',
              }}
            >
              Check Coupon
            </button>
          </div>

          {testResult && (
            <div
              style={{
                marginTop: 6,
                fontSize: 11,
                fontWeight: 600,
                color: testResult.valid
                  ? '#34d399'
                  : testResult.discountText.includes('⚠️')
                    ? '#fbbf24'
                    : '#f87171',
                background: testResult.valid
                  ? 'rgba(16, 185, 129, 0.1)'
                  : testResult.discountText.includes('⚠️')
                    ? 'rgba(245, 158, 11, 0.12)'
                    : 'rgba(239, 68, 68, 0.1)',
                border: testResult.valid
                  ? '1px solid rgba(16, 185, 129, 0.3)'
                  : testResult.discountText.includes('⚠️')
                    ? '1px solid rgba(245, 158, 11, 0.35)'
                    : '1px solid rgba(239, 68, 68, 0.3)',
                padding: '6px 8px',
                borderRadius: 6,
                lineHeight: 1.4,
              }}
            >
              {testResult.discountText}
            </div>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
        <button
          onClick={() => onToggleStatus(plan)}
          style={{
            flex: 1,
            padding: '8px 12px',
            borderRadius: 6,
            fontSize: 12,
            border: '1px solid rgba(255,255,255,0.1)',
            background: 'rgba(255,255,255,0.05)',
            color: plan.status === 'Active' ? '#f87171' : '#34d399',
            cursor: 'pointer',
            fontWeight: 600,
          }}
        >
          {plan.status === 'Active' ? 'Pause Plan' : 'Activate Plan'}
        </button>
        <button
          onClick={() => onEditPlan(plan)}
          style={{
            padding: '8px 14px',
            borderRadius: 6,
            fontSize: 12,
            border: '1px solid rgba(236,72,153,0.3)',
            background: 'rgba(236,72,153,0.15)',
            color: '#f472b6',
            cursor: 'pointer',
            fontWeight: 600,
          }}
        >
          Edit Plan
        </button>
      </div>
    </div>
  );
}

export default function AdminPanel({ onLogout }: AdminPanelProps) {
  const [activeAdminScreen, setActiveAdminScreen] =
    useState<AdminScreen>('admin-dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Global Dashboard Date Filter State
  const [dashboardDateFilter, setDashboardDateFilter] = useState<
    '1 Week' | '1 Month' | '6 Months' | '1 Year' | 'All Time' | 'Custom'
  >('All Time');
  const [customStartDate, setCustomStartDate] = useState('2026-09-01');
  const [customEndDate, setCustomEndDate] = useState('2026-09-21');

  // Dashboard Embedded Table Filters
  const [dashboardTablePage, setDashboardTablePage] = useState(1);

  // KPI Popup Modal State
  const [activeKpiModal, setActiveKpiModal] = useState<{
    type: 'total' | 'active' | 'unsubscribed' | 'interviews';
    title: string;
  } | null>(null);
  const [kpiModalPage, setKpiModalPage] = useState(1);

  // Plan Distribution Pie Hover State
  const [hoveredPlanPie, setHoveredPlanPie] = useState<{
    name: string;
    count: number;
    pct: string;
    revenue: string;
    color: string;
  } | null>(null);

  // Core Data States
  const [plans, setPlans] = useState<PlanData[]>(INITIAL_PLANS);
  const [coupons, setCoupons] = useState<Coupon[]>(getStoredCoupons);
  const [users, setUsers] = useState<AdminUser[]>(INITIAL_USERS);
  const [activityLogs, setActivityLogs] = useState<ActivityLogItem[]>(
    INITIAL_ACTIVITY_LOGS
  );

  // Filter Users based on Global Dashboard Date Filter
  const getFilteredDashboardUsers = () => {
    if (dashboardDateFilter === 'All Time') return users;
    if (dashboardDateFilter === 'Custom') {
      const start = new Date(customStartDate);
      const end = new Date(customEndDate);
      end.setHours(23, 59, 59, 999);
      return users.filter((u) => {
        if (!u.joined) return true;
        const jDate = new Date(u.joined);
        return jDate >= start && jDate <= end;
      });
    }
    const now = new Date('2026-09-21');
    let cutoffDays = 365;
    if (dashboardDateFilter === '1 Week') cutoffDays = 7;
    else if (dashboardDateFilter === '1 Month') cutoffDays = 30;
    else if (dashboardDateFilter === '6 Months') cutoffDays = 180;
    else if (dashboardDateFilter === '1 Year') cutoffDays = 365;

    return users.filter((u) => {
      if (!u.joined) return true;
      const joinedDate = new Date(u.joined);
      const diffTime = Math.abs(now.getTime() - joinedDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= cutoffDays;
    });
  };

  const dashboardFilteredUsers = getFilteredDashboardUsers();

  // User Directory Filters & Detail View State
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [userPlanFilter, setUserPlanFilter] = useState('All');
  const [userStatusFilter, setUserStatusFilter] = useState('All');
  const [userCurrentPage, setUserCurrentPage] = useState(1);
  const [selectedUserDetail, setSelectedUserDetail] =
    useState<AdminUser | null>(null);

  // Modals Visibility States
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<PlanData | null>(null);

  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);

  // Notification Toast State
  const [notification, setNotification] = useState<string | null>(null);

  // Confirmation Modal State
  const [confirmation, setConfirmation] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    consequenceWarning?: string;
    confirmLabel?: string;
    onConfirm: () => void;
    isDanger?: boolean;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const addAuditLog = (
    action: string,
    target: string,
    type: ActivityLogItem['type']
  ) => {
    const newLog: ActivityLogItem = {
      id: `log_${Date.now()}`,
      adminName: 'Amit Kavathekar',
      adminRole: 'Admin',
      action,
      target,
      type,
      timestamp: 'Just now',
    };
    setActivityLogs((prev) => [newLog, ...prev]);
  };

  const handleViewPlanSubscribers = (planName: string) => {
    setUserPlanFilter(planName);
    setUserCurrentPage(1);
    setSelectedUserDetail(null);
    setActiveAdminScreen('admin-users');
    showNotification(`Showing subscribers for plan: ${planName}`);
  };

  // Logout Confirmation Handler
  const promptLogout = () => {
    setConfirmation({
      isOpen: true,
      title: 'Confirm Admin Sign Out',
      message:
        'Are you sure you want to sign out of the JobPrepAI Super Admin Panel?',
      consequenceWarning: 'Your active admin session will be closed securely.',
      confirmLabel: 'Sign Out',
      isDanger: true,
      onConfirm: () => {
        onLogout();
      },
    });
  };

  // Plan Handlers
  const handleSavePlan = (plan: PlanData) => {
    setPlans((prev) => {
      const idx = prev.findIndex((p) => p.id === plan.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = plan;
        return next;
      }
      return [...prev, plan];
    });
    showNotification(`Plan "${plan.name}" saved!`);
    addAuditLog(`Saved plan ${plan.name}`, plan.name, 'Pricing');
  };

  const promptTogglePlanStatus = (plan: PlanData) => {
    const nextStatus = plan.status === 'Active' ? 'Draft' : 'Active';
    setConfirmation({
      isOpen: true,
      title: `${nextStatus === 'Draft' ? 'Pause / Archive' : 'Activate'} ${plan.name}?`,
      message: `Are you sure you want to change the status of ${plan.name} to ${nextStatus}?`,
      consequenceWarning: `${plan.subscribersCount} active subscribers are currently on this plan.`,
      confirmLabel: `${nextStatus === 'Draft' ? 'Pause Plan' : 'Activate Plan'}`,
      isDanger: nextStatus === 'Draft',
      onConfirm: () => {
        setPlans((prev) =>
          prev.map((p) => (p.id === plan.id ? { ...p, status: nextStatus } : p))
        );
        showNotification(`Plan ${plan.name} status set to ${nextStatus}`);
        addAuditLog(
          `Set status of ${plan.name} to ${nextStatus}`,
          plan.name,
          'Pricing'
        );
      },
    });
  };

  // Coupon Handlers
  const handleSaveCoupon = (coupon: Coupon) => {
    setCoupons((prev) => {
      const idx = prev.findIndex((c) => c.id === coupon.id);
      let updated: Coupon[];
      if (idx >= 0) {
        updated = [...prev];
        updated[idx] = coupon;
      } else {
        updated = [...prev, coupon];
      }
      saveStoredCoupons(updated);
      return updated;
    });
    showNotification(`Coupon ${coupon.code} saved successfully!`);
    addAuditLog(`Saved coupon ${coupon.code}`, coupon.code, 'Coupon');
  };

  const promptDeleteCoupon = (coupon: Coupon) => {
    setConfirmation({
      isOpen: true,
      title: `Delete Coupon ${coupon.code}?`,
      message: `Are you sure you want to remove coupon ${coupon.code}?`,
      consequenceWarning: `${coupon.timesUsed} candidates have already redeemed this code.`,
      confirmLabel: 'Delete Coupon',
      isDanger: true,
      onConfirm: () => {
        setCoupons((prev) => {
          const updated = prev.filter((c) => c.id !== coupon.id);
          saveStoredCoupons(updated);
          return updated;
        });
        showNotification(`Coupon ${coupon.code} deleted`);
        addAuditLog(`Deleted coupon ${coupon.code}`, coupon.code, 'Coupon');
      },
    });
  };

  // User Action Handlers
  const promptSuspendUser = (user: AdminUser) => {
    const isSuspending = user.status !== 'Suspended';
    setConfirmation({
      isOpen: true,
      title: `${isSuspending ? 'Suspend' : 'Unsuspend'} User ${user.name}?`,
      message: `Are you sure you want to ${isSuspending ? 'suspend' : 'unsuspend'} candidate ${user.name} (${user.email})?`,
      consequenceWarning: isSuspending
        ? 'This user will immediately lose access to mock interviews & ATS resume scans.'
        : undefined,
      confirmLabel: isSuspending ? 'Suspend User' : 'Unsuspend User',
      isDanger: isSuspending,
      onConfirm: () => {
        const nextStatus = isSuspending ? 'Suspended' : 'Active';
        setUsers((prev) =>
          prev.map((u) => (u.id === user.id ? { ...u, status: nextStatus } : u))
        );
        if (selectedUserDetail && selectedUserDetail.id === user.id) {
          setSelectedUserDetail({ ...selectedUserDetail, status: nextStatus });
        }
        showNotification(
          `User ${user.name} ${isSuspending ? 'suspended' : 'reactivated'}`
        );
        addAuditLog(
          `${isSuspending ? 'Suspended' : 'Un-suspended'} user ${user.name}`,
          user.id,
          'User Action'
        );
      },
    });
  };

  // Filtered Users computation
  const filteredUsers = users.filter((usr) => {
    const matchesSearch =
      usr.name.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
      usr.email.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
      usr.id.toLowerCase().includes(userSearchQuery.toLowerCase());

    const matchesPlan = userPlanFilter === 'All' || usr.plan === userPlanFilter;
    const matchesStatus =
      userStatusFilter === 'All' || usr.status === userStatusFilter;

    return matchesSearch && matchesPlan && matchesStatus;
  });

  const pageSize = 5;
  const totalUserPages = Math.ceil(filteredUsers.length / pageSize) || 1;
  const paginatedUsers = filteredUsers.slice(
    (userCurrentPage - 1) * pageSize,
    userCurrentPage * pageSize
  );

  return (
    <div
      className="mesh-bg"
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* Admin Mobile Top Header */}
      <div
        className="mobile-header"
        style={{
          display: 'none',
          padding: '12px 16px',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          background: 'rgba(10,10,28,0.95)',
          backdropFilter: 'blur(12px)',
          alignItems: 'center',
          justifyContent: 'space-between',
          zIndex: 40,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button
            onClick={() => setSidebarOpen((o) => !o)}
            style={{
              padding: '6px 10px',
              borderRadius: 8,
              border: '1px solid rgba(255,255,255,0.12)',
              background: 'rgba(255,255,255,0.06)',
              color: 'white',
              fontSize: 16,
              cursor: 'pointer',
            }}
          >
            ☰
          </button>
          <div style={{ fontSize: 14, fontWeight: 800, color: 'white' }}>
            Admin <span style={{ color: '#ec4899' }}>Portal</span>
          </div>
        </div>
        <button
          onClick={promptLogout}
          style={{
            fontSize: 11,
            color: '#f87171',
            background: 'rgba(239,68,68,0.1)',
            border: '1px solid rgba(239,68,68,0.2)',
            padding: '4px 8px',
            borderRadius: 6,
            cursor: 'pointer',
          }}
        >
          Sign Out
        </button>
      </div>

      <div
        style={{
          flex: 1,
          display: 'flex',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {/* Admin Left Sidebar */}
        <AdminSidebar
          active={activeAdminScreen}
          onNavigate={(s) => {
            setActiveAdminScreen(s);
            setSelectedUserDetail(null);
            if (window.innerWidth < 768) {
              setSidebarOpen(false);
            }
          }}
          onLogout={promptLogout}
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen((o) => !o)}
        />

        {/* Main Admin Content Container */}
        <main
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '14px 24px',
            color: '#e2e8f0',
          }}
        >
          {/* Notification Toast (Centered Top) */}
          {notification && (
            <div
              style={{
                position: 'fixed',
                top: 20,
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 1100,
                background: 'rgba(236, 72, 153, 0.25)',
                border: '1px solid #ec4899',
                color: '#f472b6',
                padding: '10px 20px',
                borderRadius: 12,
                fontSize: 13,
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                backdropFilter: 'blur(14px)',
                boxShadow:
                  '0 8px 30px rgba(0,0,0,0.8), 0 0 24px rgba(236,72,153,0.3)',
              }}
            >
              <span>✓</span>
              <span>{notification}</span>
            </div>
          )}

          {/* Clean Top Header */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: 10,
              marginBottom: 16,
              flexWrap: 'wrap',
              gap: 12,
            }}
          >
            <div>
              <h1
                style={{
                  fontSize: 22,
                  fontWeight: 800,
                  color: 'white',
                  margin: 0,
                  lineHeight: 1.2,
                }}
              >
                JobPrep<span className="gradient-text">AI</span> Admin Module
              </h1>
              <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>
                Real-time subscription & candidate activity metrics
              </div>
            </div>

            {/* Global Date Filter for Dashboard */}
            {activeAdminScreen === 'admin-dashboard' && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  flexWrap: 'wrap',
                  background: 'rgba(255,255,255,0.03)',
                  padding: '6px 12px',
                  borderRadius: 12,
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
              >
                <span
                  style={{
                    fontSize: 11,
                    color: '#cbd5e1',
                    fontWeight: 700,
                    fontFamily: 'JetBrains Mono',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  📅 Timeframe:
                </span>
                <div
                  style={{
                    display: 'flex',
                    background: 'rgba(0,0,0,0.3)',
                    padding: 3,
                    borderRadius: 8,
                    gap: 4,
                    flexWrap: 'wrap',
                  }}
                >
                  {(
                    [
                      '1 Week',
                      '1 Month',
                      '6 Months',
                      '1 Year',
                      'All Time',
                      'Custom',
                    ] as const
                  ).map((filterOpt) => (
                    <button
                      key={filterOpt}
                      onClick={() => {
                        setDashboardDateFilter(filterOpt);
                        showNotification(
                          `Dashboard filter updated: ${filterOpt}`
                        );
                      }}
                      style={{
                        padding: '5px 12px',
                        borderRadius: 6,
                        fontSize: 11,
                        fontWeight: 700,
                        cursor: 'pointer',
                        border: 'none',
                        transition: 'all 0.2s ease',
                        background:
                          dashboardDateFilter === filterOpt
                            ? 'linear-gradient(135deg, #ec4899, #8b5cf6)'
                            : 'transparent',
                        color:
                          dashboardDateFilter === filterOpt
                            ? 'white'
                            : '#94a3b8',
                        boxShadow:
                          dashboardDateFilter === filterOpt
                            ? '0 2px 8px rgba(236,72,153,0.4)'
                            : 'none',
                      }}
                    >
                      {filterOpt}
                    </button>
                  ))}
                </div>

                {dashboardDateFilter === 'Custom' && (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      background: 'rgba(255,255,255,0.05)',
                      padding: '4px 8px',
                      borderRadius: 8,
                      border: '1px solid rgba(236,72,153,0.3)',
                    }}
                  >
                    <span
                      style={{
                        fontSize: 10,
                        color: '#cbd5e1',
                        fontWeight: 700,
                      }}
                    >
                      From:
                    </span>
                    <input
                      type="date"
                      value={customStartDate}
                      onChange={(e) => setCustomStartDate(e.target.value)}
                      style={{
                        background: 'rgba(0,0,0,0.4)',
                        border: '1px solid rgba(255,255,255,0.15)',
                        color: 'white',
                        borderRadius: 4,
                        padding: '2px 6px',
                        fontSize: 11,
                        fontFamily: 'JetBrains Mono',
                      }}
                    />
                    <span
                      style={{
                        fontSize: 10,
                        color: '#cbd5e1',
                        fontWeight: 700,
                      }}
                    >
                      To:
                    </span>
                    <input
                      type="date"
                      value={customEndDate}
                      onChange={(e) => setCustomEndDate(e.target.value)}
                      style={{
                        background: 'rgba(0,0,0,0.4)',
                        border: '1px solid rgba(255,255,255,0.15)',
                        color: 'white',
                        borderRadius: 4,
                        padding: '2px 6px',
                        fontSize: 11,
                        fontFamily: 'JetBrains Mono',
                      }}
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 1. OVERVIEW: ADMIN DASHBOARD */}
          {activeAdminScreen === 'admin-dashboard' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {/* KPI Metrics Widgets (4 Dynamic Cards) */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: 14,
                  marginTop: 4,
                }}
              >
                {/* 1. Total Users */}
                <div
                  className="glass-card"
                  onClick={() => {
                    setActiveKpiModal({
                      type: 'total',
                      title: 'Total Registered Candidates Directory',
                    });
                    setKpiModalPage(1);
                  }}
                  title="Click to view all registered candidate records"
                  style={{
                    padding: '14px 16px',
                    borderLeft: '4px solid #10b981',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.transform = 'translateY(-3px)')
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.transform = 'translateY(0)')
                  }
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <div
                      style={{
                        fontSize: 10,
                        color: '#94a3b8',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        fontFamily: 'JetBrains Mono',
                      }}
                    >
                      Total Users
                    </div>
                    <span
                      style={{
                        fontSize: 10,
                        color: '#34d399',
                        fontWeight: 700,
                        background: 'rgba(16, 185, 129, 0.12)',
                        padding: '2px 6px',
                        borderRadius: 4,
                      }}
                    >
                      👥 VIEW LIST
                    </span>
                  </div>
                  <div
                    style={{
                      fontSize: 24,
                      fontWeight: 800,
                      color: '#10b981',
                      marginTop: 4,
                    }}
                  >
                    {dashboardFilteredUsers.length}
                  </div>
                  <div style={{ fontSize: 10, color: '#34d399', marginTop: 2 }}>
                    Registered candidates ({dashboardDateFilter})
                  </div>
                </div>

                {/* 2. Active Plan Members */}
                <div
                  className="glass-card"
                  onClick={() => {
                    setActiveKpiModal({
                      type: 'active',
                      title: 'Active Plan Members Directory',
                    });
                    setKpiModalPage(1);
                  }}
                  title="Click to view active plan members"
                  style={{
                    padding: '14px 16px',
                    borderLeft: '4px solid #06b6d4',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.transform = 'translateY(-3px)')
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.transform = 'translateY(0)')
                  }
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <div
                      style={{
                        fontSize: 10,
                        color: '#94a3b8',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        fontFamily: 'JetBrains Mono',
                      }}
                    >
                      Active Plan Members
                    </div>
                    <span
                      style={{
                        fontSize: 10,
                        color: '#06b6d4',
                        fontWeight: 700,
                        background: 'rgba(6, 182, 212, 0.12)',
                        padding: '2px 6px',
                        borderRadius: 4,
                      }}
                    >
                      ⚡ VIEW ACTIVE
                    </span>
                  </div>
                  <div
                    style={{
                      fontSize: 24,
                      fontWeight: 800,
                      color: '#06b6d4',
                      marginTop: 4,
                    }}
                  >
                    {
                      dashboardFilteredUsers.filter(
                        (u) => u.status === 'Active' && u.plan !== 'None'
                      ).length
                    }
                  </div>
                  <div style={{ fontSize: 10, color: '#67e8f9', marginTop: 2 }}>
                    Basic, Plus, Pro & Elite members
                  </div>
                </div>

                {/* 3. Non-Plan Members */}
                <div
                  className="glass-card"
                  onClick={() => {
                    setActiveKpiModal({
                      type: 'unsubscribed',
                      title: 'Non-Plan & Expired Members Directory',
                    });
                    setKpiModalPage(1);
                  }}
                  title="Click to view non-plan and expired members"
                  style={{
                    padding: '14px 16px',
                    borderLeft: '4px solid #ec4899',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.transform = 'translateY(-3px)')
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.transform = 'translateY(0)')
                  }
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <div
                      style={{
                        fontSize: 10,
                        color: '#94a3b8',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        fontFamily: 'JetBrains Mono',
                      }}
                    >
                      Non-Plan Members
                    </div>
                    <span
                      style={{
                        fontSize: 10,
                        color: '#f472b6',
                        fontWeight: 700,
                        background: 'rgba(236, 72, 153, 0.12)',
                        padding: '2px 6px',
                        borderRadius: 4,
                      }}
                    >
                      ⚠️ VIEW LIST
                    </span>
                  </div>
                  <div
                    style={{
                      fontSize: 24,
                      fontWeight: 800,
                      color: '#ec4899',
                      marginTop: 4,
                    }}
                  >
                    {
                      dashboardFilteredUsers.filter(
                        (u) => u.status === 'Expired' || u.plan === 'None'
                      ).length
                    }
                  </div>
                  <div style={{ fontSize: 10, color: '#f472b6', marginTop: 2 }}>
                    Expired & free candidates
                  </div>
                </div>

                {/* 4. Completed Mock Interviews */}
                <div
                  className="glass-card"
                  onClick={() => {
                    setActiveKpiModal({
                      type: 'interviews',
                      title: 'Completed Mock Interviews Candidates Log',
                    });
                    setKpiModalPage(1);
                  }}
                  title="Click to view candidate mock interview records"
                  style={{
                    padding: '14px 16px',
                    borderLeft: '4px solid #f59e0b',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.transform = 'translateY(-3px)')
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.transform = 'translateY(0)')
                  }
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <div
                      style={{
                        fontSize: 10,
                        color: '#94a3b8',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        fontFamily: 'JetBrains Mono',
                      }}
                    >
                      Completed Mock Interviews
                    </div>
                    <span
                      style={{
                        fontSize: 10,
                        color: '#fbbf24',
                        fontWeight: 700,
                        background: 'rgba(245, 158, 11, 0.12)',
                        padding: '2px 6px',
                        borderRadius: 4,
                      }}
                    >
                      🎯 VIEW LOGS
                    </span>
                  </div>
                  <div
                    style={{
                      fontSize: 24,
                      fontWeight: 800,
                      color: '#f59e0b',
                      marginTop: 4,
                    }}
                  >
                    {dashboardFilteredUsers.reduce(
                      (sum, u) => sum + (u.mockCount || 0),
                      0
                    )}
                  </div>
                  <div style={{ fontSize: 10, color: '#fbbf24', marginTop: 2 }}>
                    AI Mock sessions ({dashboardDateFilter})
                  </div>
                </div>
              </div>

              {/* Main Chart + Subscription Plan Distribution (65% / 35% Layout) */}
              <div
                style={{
                  display: 'flex',
                  gap: 14,
                  width: '100%',
                  flexWrap: 'wrap',
                  marginTop: 14,
                }}
              >
                {/* Revenue Growth Bar Chart (65% WIDTH) */}
                <div
                  className="glass-card"
                  style={{
                    flex: '1 1 calc(65% - 7px)',
                    width: 'calc(65% - 7px)',
                    minWidth: 320,
                    padding: '18px 20px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    minHeight: 380,
                  }}
                >
                  <div>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: 14,
                      }}
                    >
                      <div>
                        <h3
                          style={{
                            margin: 0,
                            fontSize: 16,
                            color: 'white',
                            fontWeight: 700,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                          }}
                        >
                          <span>📈</span> Revenue Growth (₹)
                        </h3>
                        <div
                          style={{
                            fontSize: 12,
                            color: '#94a3b8',
                            marginTop: 2,
                          }}
                        >
                          Revenue performance for selected timeframe (
                          {dashboardDateFilter})
                        </div>
                      </div>
                      <span
                        style={{
                          fontSize: 11,
                          background: 'rgba(236,72,153,0.15)',
                          border: '1px solid rgba(236,72,153,0.3)',
                          color: '#f472b6',
                          padding: '3px 10px',
                          borderRadius: 4,
                          fontFamily: 'JetBrains Mono',
                          fontWeight: 700,
                        }}
                      >
                        +42% YoY Growth
                      </span>
                    </div>

                    {/* Height 280px Dynamic Bar Chart */}
                    <div
                      style={{
                        height: 280,
                        display: 'flex',
                        alignItems: 'flex-end',
                        gap: 16,
                        padding: '14px 10px 8px',
                        borderBottom: '1px solid rgba(255,255,255,0.08)',
                      }}
                    >
                      {(() => {
                        let bars = [
                          { month: 'Apr', val: 180, rev: '₹1.80L' },
                          { month: 'May', val: 240, rev: '₹2.40L' },
                          { month: 'Jun', val: 310, rev: '₹3.10L' },
                          { month: 'Jul', val: 390, rev: '₹3.90L' },
                          { month: 'Aug', val: 420, rev: '₹4.20L' },
                          {
                            month: 'Sep',
                            val: 487,
                            rev: '₹4.87L',
                            active: true,
                          },
                        ];
                        if (dashboardDateFilter === '1 Week') {
                          bars = [
                            { month: 'Mon', val: 45, rev: '₹45K' },
                            { month: 'Tue', val: 60, rev: '₹60K' },
                            { month: 'Wed', val: 82, rev: '₹82K' },
                            { month: 'Thu', val: 110, rev: '₹1.1L' },
                            { month: 'Fri', val: 135, rev: '₹1.35L' },
                            { month: 'Sat', val: 150, rev: '₹1.5L' },
                            {
                              month: 'Sun',
                              val: 185,
                              rev: '₹1.85L',
                              active: true,
                            },
                          ];
                        } else if (dashboardDateFilter === '1 Month') {
                          bars = [
                            { month: 'Wk 1', val: 120, rev: '₹1.2L' },
                            { month: 'Wk 2', val: 155, rev: '₹1.55L' },
                            { month: 'Wk 3', val: 190, rev: '₹1.9L' },
                            {
                              month: 'Wk 4',
                              val: 240,
                              rev: '₹2.4L',
                              active: true,
                            },
                          ];
                        } else if (dashboardDateFilter === '1 Year') {
                          bars = [
                            { month: 'Oct', val: 140, rev: '₹1.4L' },
                            { month: 'Nov', val: 170, rev: '₹1.7L' },
                            { month: 'Dec', val: 210, rev: '₹2.1L' },
                            { month: 'Jan', val: 250, rev: '₹2.5L' },
                            { month: 'Feb', val: 290, rev: '₹2.9L' },
                            { month: 'Mar', val: 330, rev: '₹3.3L' },
                            { month: 'Apr', val: 370, rev: '₹3.7L' },
                            { month: 'May', val: 410, rev: '₹4.1L' },
                            { month: 'Jun', val: 440, rev: '₹4.4L' },
                            { month: 'Jul', val: 460, rev: '₹4.6L' },
                            { month: 'Aug', val: 480, rev: '₹4.8L' },
                            {
                              month: 'Sep',
                              val: 510,
                              rev: '₹5.1L',
                              active: true,
                            },
                          ];
                        } else if (dashboardDateFilter === 'Custom') {
                          bars = [
                            { month: 'Start', val: 160, rev: '₹1.6L' },
                            { month: 'Mid 1', val: 280, rev: '₹2.8L' },
                            { month: 'Mid 2', val: 390, rev: '₹3.9L' },
                            {
                              month: 'End',
                              val: 470,
                              rev: '₹4.7L',
                              active: true,
                            },
                          ];
                        }
                        const maxVal = Math.max(...bars.map((b) => b.val)) || 1;
                        return bars.map((b, i) => (
                          <div
                            key={i}
                            style={{
                              flex: 1,
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              gap: 6,
                              height: '100%',
                              justifyContent: 'flex-end',
                            }}
                          >
                            <span
                              style={{
                                fontSize: 11,
                                color: b.active ? '#ec4899' : '#cbd5e1',
                                fontWeight: b.active ? 800 : 600,
                                fontFamily: 'JetBrains Mono',
                              }}
                            >
                              {b.rev}
                            </span>
                            <div
                              style={{
                                width: '100%',
                                maxWidth: 48,
                                height: `${(b.val / maxVal) * 100}%`,
                                background: b.active
                                  ? 'linear-gradient(180deg, #ec4899, #7c3aed)'
                                  : 'rgba(255, 255, 255, 0.12)',
                                borderRadius: '8px 8px 0 0',
                                boxShadow: b.active
                                  ? '0 0 16px rgba(236, 72, 153, 0.45)'
                                  : 'none',
                                transition: 'height 0.5s ease',
                              }}
                            />
                            <span
                              style={{
                                fontSize: 11,
                                color: b.active ? 'white' : '#94a3b8',
                                fontWeight: b.active ? 700 : 500,
                              }}
                            >
                              {b.month}
                            </span>
                          </div>
                        ));
                      })()}
                    </div>
                  </div>

                  {/* Revenue Growth Summary Footer */}
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginTop: 12,
                      paddingTop: 8,
                      fontSize: 12,
                      color: '#94a3b8',
                    }}
                  >
                    <div>
                      Filtered Candidates:{' '}
                      <strong style={{ color: 'white' }}>
                        {dashboardFilteredUsers.length}
                      </strong>
                    </div>
                    <div>
                      Active Subscribers:{' '}
                      <strong style={{ color: '#34d399' }}>
                        {
                          dashboardFilteredUsers.filter(
                            (u) => u.status === 'Active' && u.plan !== 'None'
                          ).length
                        }
                      </strong>
                    </div>
                    <div>
                      Timeframe:{' '}
                      <strong style={{ color: '#ec4899' }}>
                        {dashboardDateFilter}
                      </strong>
                    </div>
                  </div>
                </div>

                {/* Subscription Plan Distribution (Donut Pie Chart) (35% WIDTH) */}
                {(() => {
                  const bCount = dashboardFilteredUsers.filter(
                    (u) => u.plan === 'Basic'
                  ).length;
                  const plCount = dashboardFilteredUsers.filter(
                    (u) => u.plan === 'Plus'
                  ).length;
                  const prCount = dashboardFilteredUsers.filter(
                    (u) => u.plan === 'Pro'
                  ).length;
                  const eCount = dashboardFilteredUsers.filter(
                    (u) => u.plan === 'Elite'
                  ).length;
                  const totalSub = bCount + plCount + prCount + eCount || 1;

                  const bPct = Math.round((bCount / totalSub) * 100);
                  const plPct = Math.round((plCount / totalSub) * 100);
                  const prPct = Math.round((prCount / totalSub) * 100);
                  const ePct = Math.max(0, 100 - (bPct + plPct + prPct));

                  const bRev = bCount * 499;
                  const plRev = plCount * 1299;
                  const prRev = prCount * 2299;
                  const eRev = eCount * 3999;
                  const totRev = bRev + plRev + prRev + eRev;

                  const circ = 314.159; // 2 * pi * 50
                  const bDash = (bPct / 100) * circ;
                  const plDash = (plPct / 100) * circ;
                  const prDash = (prPct / 100) * circ;
                  const eDash = (ePct / 100) * circ;

                  const bOff = 0;
                  const plOff = -bDash;
                  const prOff = -(bDash + plDash);
                  const eOff = -(bDash + plDash + prDash);

                  return (
                    <div
                      className="glass-card"
                      style={{
                        flex: '1 1 calc(35% - 7px)',
                        width: 'calc(35% - 7px)',
                        minWidth: 260,
                        padding: '20px 22px',
                        display: 'flex',
                        flexDirection: 'column',
                        minHeight: 380,
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}
                      >
                        <div>
                          <h3
                            style={{
                              margin: 0,
                              fontSize: 15,
                              color: 'white',
                              fontWeight: 700,
                              display: 'flex',
                              alignItems: 'center',
                              gap: 6,
                            }}
                          >
                            <span>📊</span> Subscription Plan Distribution
                          </h3>
                          <div
                            style={{
                              fontSize: 11,
                              color: '#94a3b8',
                              marginTop: 2,
                            }}
                          >
                            Breakdown by Basic, Plus, Pro & Elite
                          </div>
                        </div>
                        <span
                          style={{
                            fontSize: 10,
                            background: 'rgba(236, 72, 153, 0.15)',
                            border: '1px solid rgba(236, 72, 153, 0.3)',
                            color: '#f472b6',
                            padding: '3px 8px',
                            borderRadius: 10,
                            fontWeight: 700,
                            fontFamily: 'JetBrains Mono',
                          }}
                        >
                          {totalSub} USERS
                        </span>
                      </div>

                      {/* Centered SVG Donut Chart */}
                      <div
                        style={{
                          flex: 1,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          position: 'relative',
                          padding: '16px 0',
                        }}
                      >
                        <svg
                          width="220"
                          height="220"
                          viewBox="0 0 140 140"
                          style={{
                            transform: 'rotate(-90deg)',
                            filter: 'drop-shadow(0 0 16px rgba(0,0,0,0.5))',
                          }}
                        >
                          <defs>
                            <linearGradient
                              id="grad-basic"
                              x1="0%"
                              y1="0%"
                              x2="100%"
                              y2="100%"
                            >
                              <stop offset="0%" stopColor="#38bdf8" />
                              <stop offset="100%" stopColor="#0284c7" />
                            </linearGradient>
                            <linearGradient
                              id="grad-plus"
                              x1="0%"
                              y1="0%"
                              x2="100%"
                              y2="100%"
                            >
                              <stop offset="0%" stopColor="#a855f7" />
                              <stop offset="100%" stopColor="#7e22ce" />
                            </linearGradient>
                            <linearGradient
                              id="grad-pro"
                              x1="0%"
                              y1="0%"
                              x2="100%"
                              y2="100%"
                            >
                              <stop offset="0%" stopColor="#ec4899" />
                              <stop offset="100%" stopColor="#be185d" />
                            </linearGradient>
                            <linearGradient
                              id="grad-elite"
                              x1="0%"
                              y1="0%"
                              x2="100%"
                              y2="100%"
                            >
                              <stop offset="0%" stopColor="#f59e0b" />
                              <stop offset="100%" stopColor="#d97706" />
                            </linearGradient>
                          </defs>

                          {/* Track */}
                          <circle
                            cx="70"
                            cy="70"
                            r="50"
                            fill="transparent"
                            stroke="rgba(255,255,255,0.05)"
                            strokeWidth="18"
                          />

                          {/* Basic Plan Arc */}
                          <circle
                            cx="70"
                            cy="70"
                            r="50"
                            fill="transparent"
                            stroke="url(#grad-basic)"
                            strokeWidth="18"
                            strokeDasharray={`${bDash} ${circ - bDash}`}
                            strokeDashoffset={bOff}
                            onMouseEnter={() =>
                              setHoveredPlanPie({
                                name: 'Basic Plan',
                                count: bCount,
                                pct: `${bPct}%`,
                                revenue: `₹${bRev.toLocaleString()}`,
                                color: '#38bdf8',
                              })
                            }
                            onMouseLeave={() => setHoveredPlanPie(null)}
                            style={{
                              transition: 'all 0.3s ease',
                              cursor: 'pointer',
                            }}
                          />

                          {/* Plus Plan Arc */}
                          <circle
                            cx="70"
                            cy="70"
                            r="50"
                            fill="transparent"
                            stroke="url(#grad-plus)"
                            strokeWidth="18"
                            strokeDasharray={`${plDash} ${circ - plDash}`}
                            strokeDashoffset={plOff}
                            onMouseEnter={() =>
                              setHoveredPlanPie({
                                name: 'Plus Plan',
                                count: plCount,
                                pct: `${plPct}%`,
                                revenue: `₹${plRev.toLocaleString()}`,
                                color: '#c084fc',
                              })
                            }
                            onMouseLeave={() => setHoveredPlanPie(null)}
                            style={{
                              transition: 'all 0.3s ease',
                              cursor: 'pointer',
                            }}
                          />

                          {/* Pro Plan Arc */}
                          <circle
                            cx="70"
                            cy="70"
                            r="50"
                            fill="transparent"
                            stroke="url(#grad-pro)"
                            strokeWidth="18"
                            strokeDasharray={`${prDash} ${circ - prDash}`}
                            strokeDashoffset={prOff}
                            onMouseEnter={() =>
                              setHoveredPlanPie({
                                name: 'Pro Plan',
                                count: prCount,
                                pct: `${prPct}%`,
                                revenue: `₹${prRev.toLocaleString()}`,
                                color: '#ec4899',
                              })
                            }
                            onMouseLeave={() => setHoveredPlanPie(null)}
                            style={{
                              transition: 'all 0.3s ease',
                              cursor: 'pointer',
                            }}
                          />

                          {/* Elite Plan Arc */}
                          <circle
                            cx="70"
                            cy="70"
                            r="50"
                            fill="transparent"
                            stroke="url(#grad-elite)"
                            strokeWidth="18"
                            strokeDasharray={`${eDash} ${circ - eDash}`}
                            strokeDashoffset={eOff}
                            onMouseEnter={() =>
                              setHoveredPlanPie({
                                name: 'Elite Plan',
                                count: eCount,
                                pct: `${ePct}%`,
                                revenue: `₹${eRev.toLocaleString()}`,
                                color: '#f59e0b',
                              })
                            }
                            onMouseLeave={() => setHoveredPlanPie(null)}
                            style={{
                              transition: 'all 0.3s ease',
                              cursor: 'pointer',
                            }}
                          />
                        </svg>

                        {/* Donut Center Info */}
                        <div
                          style={{
                            position: 'absolute',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            textAlign: 'center',
                            pointerEvents: 'none',
                            width: 130,
                          }}
                        >
                          {hoveredPlanPie ? (
                            <>
                              <span
                                style={{
                                  fontSize: 24,
                                  fontWeight: 900,
                                  color: hoveredPlanPie.color,
                                  fontFamily: 'JetBrains Mono',
                                  lineHeight: 1,
                                }}
                              >
                                {hoveredPlanPie.pct}
                              </span>
                              <span
                                style={{
                                  fontSize: 13,
                                  fontWeight: 800,
                                  color: 'white',
                                  fontFamily: 'JetBrains Mono',
                                  marginTop: 4,
                                }}
                              >
                                {hoveredPlanPie.count} Subs (
                                {hoveredPlanPie.revenue})
                              </span>
                              <span
                                style={{
                                  fontSize: 10,
                                  color: '#94a3b8',
                                  fontWeight: 700,
                                  textTransform: 'uppercase',
                                  letterSpacing: '0.03em',
                                  marginTop: 2,
                                }}
                              >
                                {hoveredPlanPie.name}
                              </span>
                            </>
                          ) : (
                            <>
                              <span
                                style={{
                                  fontSize: 22,
                                  fontWeight: 900,
                                  color: 'white',
                                  fontFamily: 'JetBrains Mono',
                                  lineHeight: 1,
                                }}
                              >
                                ₹{totRev.toLocaleString()}
                              </span>
                              <span
                                style={{
                                  fontSize: 10,
                                  color: '#94a3b8',
                                  textTransform: 'uppercase',
                                  letterSpacing: '0.05em',
                                  marginTop: 4,
                                  fontWeight: 700,
                                }}
                              >
                                Plan Revenue
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Plan Distribution Legend */}
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: '1fr 1fr',
                          gap: '8px 12px',
                          marginTop: 6,
                          paddingTop: 10,
                          borderTop: '1px solid rgba(255,255,255,0.08)',
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 6,
                            fontSize: 11,
                          }}
                        >
                          <span
                            style={{
                              width: 8,
                              height: 8,
                              borderRadius: '50%',
                              background: '#38bdf8',
                              display: 'inline-block',
                            }}
                          ></span>
                          <span style={{ color: '#cbd5e1' }}>Basic:</span>
                          <strong
                            style={{ color: '#38bdf8', marginLeft: 'auto' }}
                          >
                            {bPct}% ({bCount})
                          </strong>
                        </div>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 6,
                            fontSize: 11,
                          }}
                        >
                          <span
                            style={{
                              width: 8,
                              height: 8,
                              borderRadius: '50%',
                              background: '#a855f7',
                              display: 'inline-block',
                            }}
                          ></span>
                          <span style={{ color: '#cbd5e1' }}>Plus:</span>
                          <strong
                            style={{ color: '#c084fc', marginLeft: 'auto' }}
                          >
                            {plPct}% ({plCount})
                          </strong>
                        </div>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 6,
                            fontSize: 11,
                          }}
                        >
                          <span
                            style={{
                              width: 8,
                              height: 8,
                              borderRadius: '50%',
                              background: '#ec4899',
                              display: 'inline-block',
                            }}
                          ></span>
                          <span style={{ color: '#cbd5e1' }}>Pro:</span>
                          <strong
                            style={{ color: '#ec4899', marginLeft: 'auto' }}
                          >
                            {prPct}% ({prCount})
                          </strong>
                        </div>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 6,
                            fontSize: 11,
                          }}
                        >
                          <span
                            style={{
                              width: 8,
                              height: 8,
                              borderRadius: '50%',
                              background: '#f59e0b',
                              display: 'inline-block',
                            }}
                          ></span>
                          <span style={{ color: '#cbd5e1' }}>Elite:</span>
                          <strong
                            style={{ color: '#f59e0b', marginLeft: 'auto' }}
                          >
                            {ePct}% ({eCount})
                          </strong>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* FILTERED CANDIDATE DIRECTORY TABLE EMBEDDED DIRECTLY ON DASHBOARD */}
              <div
                className="glass-card"
                style={{ padding: '20px 22px', marginTop: 6 }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 16,
                    flexWrap: 'wrap',
                    gap: 12,
                  }}
                >
                  <div>
                    <h3
                      style={{
                        margin: 0,
                        fontSize: 17,
                        color: 'white',
                        fontWeight: 800,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                      }}
                    >
                      <span>👥</span> Candidates Directory (
                      {dashboardDateFilter})
                    </h3>
                    <div
                      style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}
                    >
                      Live candidate breakdown filtered by{' '}
                      <strong style={{ color: '#ec4899' }}>
                        {dashboardDateFilter}
                      </strong>
                    </div>
                  </div>
                </div>

                {/* Embedded Candidate Table */}
                {(() => {
                  const filteredTableUsers = dashboardFilteredUsers;
                  const tablePageSize = 5;
                  const totalPages =
                    Math.ceil(filteredTableUsers.length / tablePageSize) || 1;
                  const paginatedList = filteredTableUsers.slice(
                    (dashboardTablePage - 1) * tablePageSize,
                    dashboardTablePage * tablePageSize
                  );

                  if (filteredTableUsers.length === 0) {
                    return (
                      <div
                        style={{
                          padding: '30px',
                          textAlign: 'center',
                          color: '#94a3b8',
                        }}
                      >
                        <div style={{ fontSize: 28, marginBottom: 6 }}>🔍</div>
                        <div
                          style={{
                            fontSize: 14,
                            fontWeight: 700,
                            color: 'white',
                          }}
                        >
                          No Candidates Found
                        </div>
                        <div style={{ fontSize: 12, marginTop: 4 }}>
                          No candidates match search criteria within{' '}
                          {dashboardDateFilter}.
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div>
                      <div style={{ overflowX: 'auto' }}>
                        <table
                          style={{
                            width: '100%',
                            borderCollapse: 'collapse',
                            textAlign: 'left',
                          }}
                        >
                          <thead>
                            <tr
                              style={{
                                borderBottom: '1px solid rgba(255,255,255,0.1)',
                                color: '#94a3b8',
                                fontSize: 11,
                                fontFamily: 'JetBrains Mono',
                                textTransform: 'uppercase',
                              }}
                            >
                              <th style={{ padding: '10px 12px' }}>
                                Candidate
                              </th>
                              <th style={{ padding: '10px 12px' }}>
                                Active Plan
                              </th>
                              <th style={{ padding: '10px 12px' }}>
                                Plan Expiry
                              </th>
                              <th style={{ padding: '10px 12px' }}>Status</th>
                              <th style={{ padding: '10px 12px' }}>
                                Joined Date
                              </th>
                              <th style={{ padding: '10px 12px' }}>
                                Total Spent
                              </th>
                              <th style={{ padding: '10px 12px' }}>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {paginatedList.map((usr) => (
                              <tr
                                key={usr.id}
                                style={{
                                  borderBottom:
                                    '1px solid rgba(255,255,255,0.05)',
                                }}
                              >
                                <td style={{ padding: '12px 12px' }}>
                                  <div
                                    style={{
                                      fontWeight: 700,
                                      color: 'white',
                                      fontSize: 13,
                                    }}
                                  >
                                    {usr.name}
                                  </div>
                                  <div
                                    style={{ fontSize: 11, color: '#94a3b8' }}
                                  >
                                    {usr.email}
                                  </div>
                                </td>
                                <td style={{ padding: '12px 12px' }}>
                                  <span
                                    style={{
                                      fontSize: 12,
                                      fontWeight: 800,
                                      color:
                                        usr.plan === 'Pro'
                                          ? '#ec4899'
                                          : usr.plan === 'Elite'
                                            ? '#e879f9'
                                            : usr.plan === 'Plus'
                                              ? '#c084fc'
                                              : usr.plan === 'Basic'
                                                ? '#38bdf8'
                                                : '#94a3b8',
                                    }}
                                  >
                                    {usr.plan}
                                  </span>
                                </td>
                                <td style={{ padding: '12px 12px' }}>
                                  <span
                                    style={{
                                      fontSize: 11,
                                      fontFamily: 'JetBrains Mono',
                                      fontWeight: 700,
                                      color: usr.planExpiry?.includes('VIP')
                                        ? '#eab308'
                                        : usr.planExpiry?.includes('Expired')
                                          ? '#f87171'
                                          : '#f59e0b',
                                    }}
                                  >
                                    {usr.planExpiry || 'N/A'}
                                  </span>
                                </td>
                                <td style={{ padding: '12px 12px' }}>
                                  <span
                                    style={{
                                      fontSize: 11,
                                      padding: '2px 8px',
                                      borderRadius: 6,
                                      fontWeight: 700,
                                      background:
                                        usr.status === 'Active'
                                          ? 'rgba(16, 185, 129, 0.15)'
                                          : usr.status === 'Expired'
                                            ? 'rgba(239, 68, 68, 0.15)'
                                            : 'rgba(245, 158, 11, 0.15)',
                                      color:
                                        usr.status === 'Active'
                                          ? '#34d399'
                                          : usr.status === 'Expired'
                                            ? '#f87171'
                                            : '#fbbf24',
                                    }}
                                  >
                                    ● {usr.status}
                                  </span>
                                </td>
                                <td
                                  style={{
                                    padding: '12px 12px',
                                    fontSize: 12,
                                    color: '#cbd5e1',
                                    fontFamily: 'JetBrains Mono',
                                  }}
                                >
                                  {usr.joined}
                                </td>
                                <td
                                  style={{
                                    padding: '12px 12px',
                                    fontSize: 13,
                                    fontWeight: 800,
                                    color: 'white',
                                    fontFamily: 'JetBrains Mono',
                                  }}
                                >
                                  {usr.spent}
                                </td>
                                <td style={{ padding: '12px 12px' }}>
                                  <button
                                    onClick={() => {
                                      setSelectedUserDetail(usr);
                                      setActiveAdminScreen('admin-users');
                                    }}
                                    style={{
                                      padding: '5px 12px',
                                      borderRadius: 6,
                                      fontSize: 11,
                                      fontWeight: 700,
                                      border: '1px solid rgba(236,72,153,0.35)',
                                      background: 'rgba(236,72,153,0.12)',
                                      color: '#f472b6',
                                      cursor: 'pointer',
                                    }}
                                  >
                                    Manage
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginTop: 14,
                          paddingTop: 10,
                          borderTop: '1px solid rgba(255,255,255,0.08)',
                        }}
                      >
                        <div style={{ fontSize: 11, color: '#94a3b8' }}>
                          Showing Page {dashboardTablePage} of {totalPages} (
                          {filteredTableUsers.length} candidates)
                        </div>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button
                            disabled={dashboardTablePage <= 1}
                            onClick={() =>
                              setDashboardTablePage((p) => Math.max(1, p - 1))
                            }
                            style={{
                              padding: '4px 10px',
                              borderRadius: 6,
                              fontSize: 11,
                              fontWeight: 700,
                              border: '1px solid rgba(255,255,255,0.12)',
                              background: 'rgba(255,255,255,0.05)',
                              color:
                                dashboardTablePage <= 1 ? '#64748b' : 'white',
                              cursor:
                                dashboardTablePage <= 1
                                  ? 'not-allowed'
                                  : 'pointer',
                            }}
                          >
                            Previous
                          </button>
                          <button
                            disabled={dashboardTablePage >= totalPages}
                            onClick={() =>
                              setDashboardTablePage((p) =>
                                Math.min(totalPages, p + 1)
                              )
                            }
                            style={{
                              padding: '4px 10px',
                              borderRadius: 6,
                              fontSize: 11,
                              fontWeight: 700,
                              border: '1px solid rgba(255,255,255,0.12)',
                              background: 'rgba(255,255,255,0.05)',
                              color:
                                dashboardTablePage >= totalPages
                                  ? '#64748b'
                                  : 'white',
                              cursor:
                                dashboardTablePage >= totalPages
                                  ? 'not-allowed'
                                  : 'pointer',
                            }}
                          >
                            Next
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          )}

          {/* 2. MONETIZATION: MEMBERSHIP PLANS SCREEN */}
          {activeAdminScreen === 'admin-membership' && (
            <div>
              {/* 4 Financial Analytics Cards embedded directly above Membership Plans */}
              <div style={{ marginBottom: 24 }}>
                <h4
                  style={{
                    margin: '0 0 12px',
                    fontSize: 14,
                    fontWeight: 700,
                    color: '#ec4899',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    fontFamily: 'JetBrains Mono',
                  }}
                >
                  📊 Financial Analytics & Plan Revenue Overview
                </h4>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                    gap: 16,
                  }}
                >
                  {/* 1 Month Plan KPI Card */}
                  <div
                    className="glass-card"
                    onClick={() => handleViewPlanSubscribers('Basic')}
                    title="Click to view candidates subscribed to Basic Plan"
                    style={{
                      padding: 18,
                      borderLeft: '4px solid #38bdf8',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.transform = 'translateY(-3px)')
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.transform = 'translateY(0)')
                    }
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <div style={{ fontSize: 12, color: '#94a3b8' }}>
                        1 Month (Basic)
                      </div>
                      <span
                        style={{
                          fontSize: 10,
                          color: '#38bdf8',
                          fontWeight: 700,
                          background: 'rgba(56, 189, 248, 0.12)',
                          padding: '2px 6px',
                          borderRadius: 4,
                        }}
                      >
                        👥 VIEW USERS
                      </span>
                    </div>
                    <div
                      style={{
                        fontSize: 22,
                        fontWeight: 800,
                        color: 'white',
                        marginTop: 4,
                      }}
                    >
                      ₹1,70,658
                    </div>
                    <div
                      style={{ fontSize: 11, color: '#38bdf8', marginTop: 2 }}
                    >
                      342 Active Subscribers →
                    </div>
                  </div>

                  {/* 3 Months Plan KPI Card */}
                  <div
                    className="glass-card"
                    onClick={() => handleViewPlanSubscribers('Plus')}
                    title="Click to view candidates subscribed to Plus Plan"
                    style={{
                      padding: 18,
                      borderLeft: '4px solid #a855f7',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.transform = 'translateY(-3px)')
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.transform = 'translateY(0)')
                    }
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <div style={{ fontSize: 12, color: '#94a3b8' }}>
                        3 Months (Plus)
                      </div>
                      <span
                        style={{
                          fontSize: 10,
                          color: '#c084fc',
                          fontWeight: 700,
                          background: 'rgba(168, 85, 247, 0.12)',
                          padding: '2px 6px',
                          borderRadius: 4,
                        }}
                      >
                        👥 VIEW USERS
                      </span>
                    </div>
                    <div
                      style={{
                        fontSize: 22,
                        fontWeight: 800,
                        color: 'white',
                        marginTop: 4,
                      }}
                    >
                      ₹11,11,944
                    </div>
                    <div
                      style={{ fontSize: 11, color: '#c084fc', marginTop: 2 }}
                    >
                      856 Active Subscribers →
                    </div>
                  </div>

                  {/* 6 Months Plan KPI Card */}
                  <div
                    className="glass-card"
                    onClick={() => handleViewPlanSubscribers('Pro')}
                    title="Click to view candidates subscribed to Pro Plan"
                    style={{
                      padding: 18,
                      borderLeft: '4px solid #ec4899',
                      background: 'rgba(236,72,153,0.08)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.transform = 'translateY(-3px)')
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.transform = 'translateY(0)')
                    }
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <div
                        style={{
                          fontSize: 12,
                          color: '#f472b6',
                          fontWeight: 700,
                        }}
                      >
                        6 Months (Pro)
                      </div>
                      <span
                        style={{
                          fontSize: 10,
                          color: '#ec4899',
                          fontWeight: 700,
                          background: 'rgba(236, 72, 153, 0.2)',
                          padding: '2px 6px',
                          borderRadius: 4,
                        }}
                      >
                        👥 VIEW USERS
                      </span>
                    </div>
                    <div
                      style={{
                        fontSize: 22,
                        fontWeight: 800,
                        color: 'white',
                        marginTop: 4,
                      }}
                    >
                      ₹32,64,580
                    </div>
                    <div
                      style={{ fontSize: 11, color: '#f472b6', marginTop: 2 }}
                    >
                      1,420 Active Subscribers (43% volume) →
                    </div>
                  </div>

                  {/* 1 Year Plan KPI Card */}
                  <div
                    className="glass-card"
                    onClick={() => handleViewPlanSubscribers('Elite')}
                    title="Click to view candidates subscribed to Elite Plan"
                    style={{
                      padding: 18,
                      borderLeft: '4px solid #34d399',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.transform = 'translateY(-3px)')
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.transform = 'translateY(0)')
                    }
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <div style={{ fontSize: 12, color: '#94a3b8' }}>
                        1 Year (Elite)
                      </div>
                      <span
                        style={{
                          fontSize: 10,
                          color: '#34d399',
                          fontWeight: 700,
                          background: 'rgba(52, 211, 153, 0.12)',
                          padding: '2px 6px',
                          borderRadius: 4,
                        }}
                      >
                        👥 VIEW USERS
                      </span>
                    </div>
                    <div
                      style={{
                        fontSize: 22,
                        fontWeight: 800,
                        color: 'white',
                        marginTop: 4,
                      }}
                    >
                      ₹27,19,320
                    </div>
                    <div
                      style={{ fontSize: 11, color: '#34d399', marginTop: 2 }}
                    >
                      680 Active Subscribers (High LTV) →
                    </div>
                  </div>
                </div>
              </div>

              {/* Membership Plans List Header */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 18,
                  flexWrap: 'wrap',
                  gap: 12,
                }}
              >
                <div>
                  <h3
                    style={{
                      margin: 0,
                      fontSize: 18,
                      fontWeight: 700,
                      color: 'white',
                    }}
                  >
                    Membership & Subscription Tiers
                  </h3>
                </div>
                <button
                  className="btn-primary"
                  onClick={() => {
                    setEditingPlan(null);
                    setIsPlanModalOpen(true);
                  }}
                  style={{
                    fontSize: 12,
                    padding: '8px 16px',
                    borderRadius: 8,
                    background: 'linear-gradient(135deg, #ec4899, #7c3aed)',
                  }}
                >
                  + Add New Plan
                </button>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                  gap: 20,
                }}
              >
                {plans.map((plan) => (
                  <MembershipPlanCard
                    key={plan.id}
                    plan={plan}
                    coupons={coupons}
                    onToggleStatus={promptTogglePlanStatus}
                    onEditPlan={(p) => {
                      setEditingPlan(p);
                      setIsPlanModalOpen(true);
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* 3. MONETIZATION: COUPONS SCREEN */}
          {activeAdminScreen === 'admin-coupons' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: 12,
                }}
              >
                <div>
                  <h3
                    style={{
                      margin: 0,
                      fontSize: 18,
                      fontWeight: 800,
                      color: 'white',
                    }}
                  >
                    🏷 Coupon Codes & Promotional Discounts
                  </h3>
                  <p
                    style={{
                      margin: '4px 0 0',
                      fontSize: 12,
                      color: '#94a3b8',
                    }}
                  >
                    Create and manage percentage or flat-discount promotional
                    codes
                  </p>
                </div>
                <button
                  className="btn-primary"
                  onClick={() => {
                    setEditingCoupon(null);
                    setIsCouponModalOpen(true);
                  }}
                  style={{
                    fontSize: 12,
                    padding: '8px 16px',
                    borderRadius: 8,
                    background: 'linear-gradient(135deg, #ec4899, #7c3aed)',
                  }}
                >
                  + Create Coupon
                </button>
              </div>

              <div className="glass-card" style={{ padding: 22 }}>
                {coupons.length === 0 ? (
                  <EmptyState
                    icon="🏷"
                    title="No Coupons Found"
                    description="You haven't created any promotional discount coupon codes yet."
                    actionLabel="+ Create Coupon"
                    onAction={() => {
                      setEditingCoupon(null);
                      setIsCouponModalOpen(true);
                    }}
                  />
                ) : (
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns:
                        'repeat(auto-fit, minmax(260px, 1fr))',
                      gap: 16,
                    }}
                  >
                    {coupons.map((c) => (
                      <div
                        key={c.id}
                        style={{
                          background: 'rgba(255,255,255,0.03)',
                          padding: 16,
                          borderRadius: 12,
                          border: '1px solid rgba(255,255,255,0.08)',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                        }}
                      >
                        <div>
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                            }}
                          >
                            <span
                              style={{
                                fontWeight: 800,
                                fontFamily: 'JetBrains Mono',
                                fontSize: 16,
                                color: '#ec4899',
                                letterSpacing: '0.05em',
                              }}
                            >
                              {c.code}
                            </span>
                            <span
                              style={{
                                fontSize: 11,
                                padding: '2px 8px',
                                borderRadius: 4,
                                background:
                                  c.status === 'Active'
                                    ? 'rgba(16,185,129,0.15)'
                                    : 'rgba(239,68,68,0.15)',
                                color:
                                  c.status === 'Active' ? '#34d399' : '#f87171',
                              }}
                            >
                              ● {c.status}
                            </span>
                          </div>

                          <div
                            style={{
                              fontSize: 20,
                              fontWeight: 800,
                              color: 'white',
                              marginTop: 8,
                            }}
                          >
                            {c.discountType === 'Percentage'
                              ? `${c.discountValue}% OFF`
                              : `₹${c.discountValue} OFF`}
                          </div>

                          <div
                            style={{
                              fontSize: 12,
                              color: '#cbd5e1',
                              marginTop: 6,
                            }}
                          >
                            <strong>Applicable:</strong>{' '}
                            {c.applicablePlans.join(', ')}
                          </div>

                          <div
                            style={{
                              fontSize: 11,
                              color: '#94a3b8',
                              marginTop: 4,
                            }}
                          >
                            Usage Limit:{' '}
                            <span style={{ color: '#06b6d4', fontWeight: 700 }}>
                              {c.usageLimit}
                            </span>{' '}
                            times use
                          </div>

                          <div
                            style={{
                              fontSize: 11,
                              color: '#64748b',
                              marginTop: 2,
                              fontFamily: 'JetBrains Mono',
                            }}
                          >
                            Expires: {c.expiryDate}
                          </div>
                        </div>

                        <div
                          style={{
                            display: 'flex',
                            gap: 8,
                            marginTop: 14,
                            borderTop: '1px solid rgba(255,255,255,0.06)',
                            paddingTop: 10,
                          }}
                        >
                          <button
                            onClick={() => {
                              setEditingCoupon(c);
                              setIsCouponModalOpen(true);
                            }}
                            style={{
                              flex: 1,
                              padding: '6px',
                              borderRadius: 6,
                              fontSize: 11,
                              background: 'rgba(255,255,255,0.06)',
                              border: '1px solid rgba(255,255,255,0.1)',
                              color: 'white',
                              cursor: 'pointer',
                            }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => promptDeleteCoupon(c)}
                            style={{
                              padding: '6px 12px',
                              borderRadius: 6,
                              fontSize: 11,
                              background: 'rgba(239,68,68,0.15)',
                              border: '1px solid rgba(239,68,68,0.3)',
                              color: '#f87171',
                              cursor: 'pointer',
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 4. USERS: USER DIRECTORY & USER DETAIL VIEW */}
          {activeAdminScreen === 'admin-users' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {selectedUserDetail ? (
                <UserDetailView
                  user={selectedUserDetail}
                  onBack={() => setSelectedUserDetail(null)}
                  onSuspend={promptSuspendUser}
                  onChangePlan={(usr, newPlan) => {
                    setUsers((prev) =>
                      prev.map((u) =>
                        u.id === usr.id ? { ...u, plan: newPlan } : u
                      )
                    );
                    setSelectedUserDetail({
                      ...selectedUserDetail,
                      plan: newPlan,
                    });
                    showNotification(`Plan updated to ${newPlan}`);
                    addAuditLog(
                      `Changed plan of ${usr.name} to ${newPlan}`,
                      usr.id,
                      'User Action'
                    );
                  }}
                  onIssueRefund={(usr, amt) => {
                    showNotification(`Refund of ${amt} issued to ${usr.name}`);
                    addAuditLog(
                      `Issued refund of ${amt} to ${usr.name}`,
                      usr.id,
                      'User Action'
                    );
                  }}
                  onResetPassword={(usr) => {
                    showNotification(
                      `Password reset link emailed to ${usr.email}`
                    );
                    addAuditLog(
                      `Reset password for ${usr.name}`,
                      usr.id,
                      'User Action'
                    );
                  }}
                />
              ) : (
                <div className="glass-card" style={{ padding: 22 }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: 16,
                      flexWrap: 'wrap',
                      gap: 12,
                    }}
                  >
                    <div>
                      <h3 style={{ margin: 0, fontSize: 18, color: 'white' }}>
                        Registered Candidates Directory
                      </h3>
                      <p
                        style={{
                          margin: '2px 0 0',
                          fontSize: 12,
                          color: '#94a3b8',
                        }}
                      >
                        Search, filter, and manage candidate accounts
                      </p>
                    </div>

                    <input
                      type="text"
                      placeholder="Search candidate name or email..."
                      value={userSearchQuery}
                      onChange={(e) => {
                        setUserSearchQuery(e.target.value);
                        setUserCurrentPage(1);
                      }}
                      className="glass-input"
                      style={{ padding: '8px 14px', fontSize: 13, width: 240 }}
                    />
                  </div>

                  {/* Filter Controls Bar */}
                  <div
                    style={{
                      display: 'flex',
                      gap: 12,
                      flexWrap: 'wrap',
                      marginBottom: 16,
                      background: 'rgba(255,255,255,0.03)',
                      padding: 12,
                      borderRadius: 10,
                    }}
                  >
                    <div
                      style={{ display: 'flex', alignItems: 'center', gap: 6 }}
                    >
                      <label
                        style={{
                          fontSize: 11,
                          color: '#94a3b8',
                          textTransform: 'uppercase',
                        }}
                      >
                        Plan:
                      </label>
                      <select
                        value={userPlanFilter}
                        onChange={(e) => {
                          setUserPlanFilter(e.target.value);
                          setUserCurrentPage(1);
                        }}
                        style={{
                          background: 'rgba(255,255,255,0.06)',
                          border: '1px solid rgba(255,255,255,0.12)',
                          color: 'white',
                          padding: '6px 10px',
                          borderRadius: 6,
                          fontSize: 12,
                        }}
                      >
                        <option value="All">All Plans</option>
                        <option value="Basic">Basic (1 Month)</option>
                        <option value="Plus">Plus (3 Months)</option>
                        <option value="Pro">Pro (6 Months)</option>
                        <option value="Elite">Elite (1 Year)</option>
                      </select>
                    </div>

                    <div
                      style={{ display: 'flex', alignItems: 'center', gap: 6 }}
                    >
                      <label
                        style={{
                          fontSize: 11,
                          color: '#94a3b8',
                          textTransform: 'uppercase',
                        }}
                      >
                        Status:
                      </label>
                      <select
                        value={userStatusFilter}
                        onChange={(e) => {
                          setUserStatusFilter(e.target.value);
                          setUserCurrentPage(1);
                        }}
                        style={{
                          background: 'rgba(255,255,255,0.06)',
                          border: '1px solid rgba(255,255,255,0.12)',
                          color: 'white',
                          padding: '6px 10px',
                          borderRadius: 6,
                          fontSize: 12,
                        }}
                      >
                        <option value="All">All Statuses</option>
                        <option value="Active">Active</option>
                        <option value="Suspended">Suspended</option>
                        <option value="Expired">Expired</option>
                      </select>
                    </div>

                    {(userSearchQuery ||
                      userPlanFilter !== 'All' ||
                      userStatusFilter !== 'All') && (
                      <button
                        onClick={() => {
                          setUserSearchQuery('');
                          setUserPlanFilter('All');
                          setUserStatusFilter('All');
                          setUserCurrentPage(1);
                        }}
                        style={{
                          fontSize: 11,
                          background: 'none',
                          border: 'none',
                          color: '#ec4899',
                          cursor: 'pointer',
                          textDecoration: 'underline',
                        }}
                      >
                        Reset Filters
                      </button>
                    )}
                  </div>

                  {paginatedUsers.length === 0 ? (
                    <EmptyState
                      icon="🔍"
                      title="No Candidates Found"
                      description="No candidates match your current search query or active filter criteria."
                      actionLabel="Reset Search & Filters"
                      onAction={() => {
                        setUserSearchQuery('');
                        setUserPlanFilter('All');
                        setUserStatusFilter('All');
                        setUserCurrentPage(1);
                      }}
                    />
                  ) : (
                    <>
                      <div style={{ overflowX: 'auto' }}>
                        <table
                          style={{
                            width: '100%',
                            borderCollapse: 'collapse',
                            fontSize: 13,
                            textAlign: 'left',
                          }}
                        >
                          <thead>
                            <tr
                              style={{
                                borderBottom: '1px solid rgba(255,255,255,0.1)',
                                color: '#94a3b8',
                              }}
                            >
                              <th style={{ padding: 10 }}>Candidate</th>
                              <th style={{ padding: 10 }}>Active Plan</th>
                              <th style={{ padding: 10 }}>Plan Expiry</th>
                              <th style={{ padding: 10 }}>Status</th>
                              <th style={{ padding: 10 }}>Joined Date</th>
                              <th style={{ padding: 10 }}>Total Spent</th>
                              <th style={{ padding: 10 }}>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {paginatedUsers.map((usr) => (
                              <tr
                                key={usr.id}
                                style={{
                                  borderBottom:
                                    '1px solid rgba(255,255,255,0.04)',
                                }}
                              >
                                <td style={{ padding: 10 }}>
                                  <div
                                    style={{ fontWeight: 600, color: 'white' }}
                                  >
                                    {usr.name}
                                  </div>
                                  <div
                                    style={{ fontSize: 11, color: '#64748b' }}
                                  >
                                    {usr.email}
                                  </div>
                                </td>
                                <td
                                  style={{
                                    padding: 10,
                                    color: '#ec4899',
                                    fontWeight: 600,
                                  }}
                                >
                                  {usr.plan}
                                </td>
                                <td
                                  style={{
                                    padding: 10,
                                    color: '#fde047',
                                    fontFamily: 'JetBrains Mono',
                                    fontSize: 12,
                                  }}
                                >
                                  {usr.planExpiry || '2027-02-12'}
                                </td>
                                <td style={{ padding: 10 }}>
                                  <span
                                    style={{
                                      padding: '2px 8px',
                                      borderRadius: 4,
                                      fontSize: 11,
                                      background:
                                        usr.status === 'Active'
                                          ? 'rgba(16, 185, 129, 0.15)'
                                          : 'rgba(239,68,68,0.15)',
                                      color:
                                        usr.status === 'Active'
                                          ? '#34d399'
                                          : '#f87171',
                                    }}
                                  >
                                    {usr.status}
                                  </span>
                                </td>
                                <td style={{ padding: 10, color: '#94a3b8' }}>
                                  {usr.joined}
                                </td>
                                <td
                                  style={{
                                    padding: 10,
                                    fontWeight: 700,
                                    color: 'white',
                                  }}
                                >
                                  {usr.spent}
                                </td>
                                <td style={{ padding: 10 }}>
                                  <button
                                    onClick={() => setSelectedUserDetail(usr)}
                                    style={{
                                      padding: '4px 12px',
                                      fontSize: 11,
                                      borderRadius: 6,
                                      background: 'rgba(236, 72, 153, 0.15)',
                                      border:
                                        '1px solid rgba(236, 72, 153, 0.3)',
                                      color: '#f472b6',
                                      cursor: 'pointer',
                                      fontWeight: 600,
                                    }}
                                  >
                                    Manage
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* Pagination Controls */}
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginTop: 18,
                          borderTop: '1px solid rgba(255,255,255,0.06)',
                          paddingTop: 12,
                        }}
                      >
                        <span style={{ fontSize: 12, color: '#94a3b8' }}>
                          Showing Page {userCurrentPage} of {totalUserPages} (
                          {filteredUsers.length} total candidates)
                        </span>

                        <div style={{ display: 'flex', gap: 8 }}>
                          <button
                            disabled={userCurrentPage === 1}
                            onClick={() =>
                              setUserCurrentPage((p) => Math.max(1, p - 1))
                            }
                            className="btn-ghost"
                            style={{
                              padding: '4px 12px',
                              fontSize: 12,
                              opacity: userCurrentPage === 1 ? 0.4 : 1,
                            }}
                          >
                            Previous
                          </button>
                          <button
                            disabled={userCurrentPage >= totalUserPages}
                            onClick={() =>
                              setUserCurrentPage((p) =>
                                Math.min(totalUserPages, p + 1)
                              )
                            }
                            className="btn-ghost"
                            style={{
                              padding: '4px 12px',
                              fontSize: 12,
                              opacity:
                                userCurrentPage >= totalUserPages ? 0.4 : 1,
                            }}
                          >
                            Next
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          )}

          {/* 4.5 USERS: STANDALONE SUPPORT TICKETS SCREEN */}
          {activeAdminScreen === 'admin-support' && <SupportTicketsScreen />}

          {/* 5. SYSTEM: AI TOKENS & MODELS (ERD SCHEMA BASED) */}
          {activeAdminScreen === 'admin-ai-models' && <AiModelsScreen />}

          {/* 7. SYSTEM: NOTIFICATIONS SETTINGS */}
          {activeAdminScreen === 'admin-notifications' && (
            <NotificationSettingsScreen />
          )}

          {/* 8. SYSTEM: ACTIVITY LOG SCREEN */}
          {activeAdminScreen === 'admin-activity-log' && (
            <ActivityLogScreen logs={activityLogs} />
          )}
        </main>
      </div>

      {/* PLAN MODAL WITH LIVE PREVIEW */}
      {isPlanModalOpen && (
        <PlanModal
          isOpen={isPlanModalOpen}
          initialData={editingPlan}
          onClose={() => setIsPlanModalOpen(false)}
          onSave={handleSavePlan}
        />
      )}

      {/* COUPON MODAL */}
      {isCouponModalOpen && (
        <CouponModal
          isOpen={isCouponModalOpen}
          initialData={editingCoupon}
          onClose={() => setIsCouponModalOpen(false)}
          onSave={handleSaveCoupon}
        />
      )}

      {/* KPI METRICS CANDIDATE DIRECTORY POPUP MODAL */}
      {activeKpiModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1000,
            background: 'rgba(10, 10, 28, 0.88)',
            backdropFilter: 'blur(14px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20,
          }}
          onClick={() => setActiveKpiModal(null)}
        >
          <div
            className="glass-card"
            style={{
              width: '100%',
              maxWidth: 1050,
              maxHeight: '85vh',
              display: 'flex',
              flexDirection: 'column',
              borderRadius: 16,
              border: '1px solid rgba(236,72,153,0.3)',
              boxShadow:
                '0 20px 50px rgba(0,0,0,0.8), 0 0 30px rgba(236,72,153,0.15)',
              overflow: 'hidden',
              background: 'rgba(15, 15, 35, 0.95)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: '18px 24px',
                borderBottom: '1px solid rgba(255,255,255,0.08)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: 'rgba(255,255,255,0.02)',
              }}
            >
              <div>
                <h3
                  style={{
                    margin: 0,
                    fontSize: 18,
                    color: 'white',
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                  }}
                >
                  <span>📋</span> {activeKpiModal.title}
                </h3>
                <div
                  style={{
                    fontSize: 12,
                    color: '#94a3b8',
                    marginTop: 3,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  <span>Filtered by:</span>
                  <span
                    style={{
                      color: '#ec4899',
                      fontWeight: 700,
                      background: 'rgba(236,72,153,0.15)',
                      padding: '2px 8px',
                      borderRadius: 4,
                      fontFamily: 'JetBrains Mono',
                    }}
                  >
                    {dashboardDateFilter}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setActiveKpiModal(null)}
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  color: '#94a3b8',
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  cursor: 'pointer',
                  fontSize: 16,
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                ✕
              </button>
            </div>

            {/* Candidate Table Content */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px' }}>
              {(() => {
                let modalUsers = dashboardFilteredUsers;
                if (activeKpiModal.type === 'active') {
                  modalUsers = dashboardFilteredUsers.filter(
                    (u) => u.status === 'Active' && u.plan !== 'None'
                  );
                } else if (activeKpiModal.type === 'unsubscribed') {
                  modalUsers = dashboardFilteredUsers.filter(
                    (u) => u.status === 'Expired' || u.plan === 'None'
                  );
                } else if (activeKpiModal.type === 'interviews') {
                  modalUsers = dashboardFilteredUsers.filter(
                    (u) => (u.mockCount || 0) > 0
                  );
                }

                const kpiPageSize = 5;
                const totalPages =
                  Math.ceil(modalUsers.length / kpiPageSize) || 1;
                const paginatedList = modalUsers.slice(
                  (kpiModalPage - 1) * kpiPageSize,
                  kpiModalPage * kpiPageSize
                );

                if (modalUsers.length === 0) {
                  return (
                    <div
                      style={{
                        padding: '40px 20px',
                        textAlign: 'center',
                        color: '#94a3b8',
                      }}
                    >
                      <div style={{ fontSize: 32, marginBottom: 8 }}>🔍</div>
                      <div
                        style={{
                          fontSize: 15,
                          fontWeight: 700,
                          color: 'white',
                        }}
                      >
                        No Candidates Found
                      </div>
                      <div style={{ fontSize: 12, marginTop: 4 }}>
                        No candidates match this criteria within{' '}
                        {dashboardDateFilter}.
                      </div>
                    </div>
                  );
                }

                return (
                  <div>
                    <div style={{ overflowX: 'auto' }}>
                      <table
                        style={{
                          width: '100%',
                          borderCollapse: 'collapse',
                          textAlign: 'left',
                        }}
                      >
                        <thead>
                          <tr
                            style={{
                              borderBottom: '1px solid rgba(255,255,255,0.1)',
                              color: '#94a3b8',
                              fontSize: 11,
                              fontFamily: 'JetBrains Mono',
                              textTransform: 'uppercase',
                            }}
                          >
                            <th style={{ padding: '12px 14px' }}>Candidate</th>
                            <th style={{ padding: '12px 14px' }}>
                              Active Plan
                            </th>
                            <th style={{ padding: '12px 14px' }}>
                              Plan Expiry
                            </th>
                            <th style={{ padding: '12px 14px' }}>Status</th>
                            <th style={{ padding: '12px 14px' }}>
                              Joined Date
                            </th>
                            <th style={{ padding: '12px 14px' }}>
                              Total Spent
                            </th>
                            <th style={{ padding: '12px 14px' }}>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {paginatedList.map((usr) => (
                            <tr
                              key={usr.id}
                              style={{
                                borderBottom:
                                  '1px solid rgba(255,255,255,0.05)',
                              }}
                            >
                              <td style={{ padding: '14px 14px' }}>
                                <div
                                  style={{
                                    fontWeight: 700,
                                    color: 'white',
                                    fontSize: 14,
                                  }}
                                >
                                  {usr.name}
                                </div>
                                <div style={{ fontSize: 11, color: '#94a3b8' }}>
                                  {usr.email}
                                </div>
                              </td>

                              <td style={{ padding: '14px 14px' }}>
                                <span
                                  style={{
                                    fontSize: 12,
                                    fontWeight: 800,
                                    color:
                                      usr.plan === 'Pro'
                                        ? '#ec4899'
                                        : usr.plan === 'Elite'
                                          ? '#e879f9'
                                          : usr.plan === 'Plus'
                                            ? '#c084fc'
                                            : usr.plan === 'Basic'
                                              ? '#38bdf8'
                                              : '#94a3b8',
                                  }}
                                >
                                  {usr.plan}
                                </span>
                              </td>

                              <td style={{ padding: '14px 14px' }}>
                                <span
                                  style={{
                                    fontSize: 12,
                                    fontFamily: 'JetBrains Mono',
                                    fontWeight: 700,
                                    color: usr.planExpiry?.includes('VIP')
                                      ? '#eab308'
                                      : usr.planExpiry?.includes('Expired')
                                        ? '#f87171'
                                        : '#f59e0b',
                                  }}
                                >
                                  {usr.planExpiry || 'N/A'}
                                </span>
                              </td>

                              <td style={{ padding: '14px 14px' }}>
                                <span
                                  style={{
                                    fontSize: 11,
                                    padding: '3px 10px',
                                    borderRadius: 6,
                                    fontWeight: 700,
                                    background:
                                      usr.status === 'Active'
                                        ? 'rgba(16, 185, 129, 0.15)'
                                        : usr.status === 'Expired'
                                          ? 'rgba(239, 68, 68, 0.15)'
                                          : 'rgba(245, 158, 11, 0.15)',
                                    color:
                                      usr.status === 'Active'
                                        ? '#34d399'
                                        : usr.status === 'Expired'
                                          ? '#f87171'
                                          : '#fbbf24',
                                  }}
                                >
                                  ● {usr.status}
                                </span>
                              </td>

                              <td
                                style={{
                                  padding: '14px 14px',
                                  fontSize: 12,
                                  color: '#cbd5e1',
                                  fontFamily: 'JetBrains Mono',
                                }}
                              >
                                {usr.joined}
                              </td>

                              <td
                                style={{
                                  padding: '14px 14px',
                                  fontSize: 13,
                                  fontWeight: 800,
                                  color: 'white',
                                  fontFamily: 'JetBrains Mono',
                                }}
                              >
                                {usr.spent}
                              </td>

                              <td style={{ padding: '14px 14px' }}>
                                <button
                                  onClick={() => {
                                    setSelectedUserDetail(usr);
                                    setActiveAdminScreen('admin-users');
                                    setActiveKpiModal(null);
                                  }}
                                  style={{
                                    padding: '6px 14px',
                                    borderRadius: 6,
                                    fontSize: 12,
                                    fontWeight: 700,
                                    border: '1px solid rgba(236,72,153,0.35)',
                                    background: 'rgba(236,72,153,0.12)',
                                    color: '#f472b6',
                                    cursor: 'pointer',
                                  }}
                                >
                                  Manage
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Modal Pagination Footer */}
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginTop: 20,
                        paddingTop: 14,
                        borderTop: '1px solid rgba(255,255,255,0.08)',
                      }}
                    >
                      <div style={{ fontSize: 12, color: '#94a3b8' }}>
                        Showing Page {kpiModalPage} of {totalPages} (
                        {modalUsers.length} total candidates)
                      </div>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button
                          disabled={kpiModalPage <= 1}
                          onClick={() =>
                            setKpiModalPage((p) => Math.max(1, p - 1))
                          }
                          style={{
                            padding: '6px 14px',
                            borderRadius: 6,
                            fontSize: 12,
                            fontWeight: 700,
                            border: '1px solid rgba(255,255,255,0.12)',
                            background: 'rgba(255,255,255,0.05)',
                            color: kpiModalPage <= 1 ? '#64748b' : 'white',
                            cursor:
                              kpiModalPage <= 1 ? 'not-allowed' : 'pointer',
                          }}
                        >
                          Previous
                        </button>
                        <button
                          disabled={kpiModalPage >= totalPages}
                          onClick={() =>
                            setKpiModalPage((p) => Math.min(totalPages, p + 1))
                          }
                          style={{
                            padding: '6px 14px',
                            borderRadius: 6,
                            fontSize: 12,
                            fontWeight: 700,
                            border: '1px solid rgba(255,255,255,0.12)',
                            background: 'rgba(255,255,255,0.05)',
                            color:
                              kpiModalPage >= totalPages ? '#64748b' : 'white',
                            cursor:
                              kpiModalPage >= totalPages
                                ? 'not-allowed'
                                : 'pointer',
                          }}
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* CONFIRMATION POPUP DIALOG */}
      {confirmation.isOpen && (
        <ConfirmationModal
          isOpen={confirmation.isOpen}
          title={confirmation.title}
          message={confirmation.message}
          consequenceWarning={confirmation.consequenceWarning}
          confirmLabel={confirmation.confirmLabel}
          isDanger={confirmation.isDanger}
          onConfirm={confirmation.onConfirm}
          onClose={() => setConfirmation({ ...confirmation, isOpen: false })}
        />
      )}
    </div>
  );
}
