export type Screen =
  | "landing"
  | "login"
  | "dashboard"
  | "profile"
  | "job-resume"
  | "ai-analysis"
  | "resume-editor"
  | "ats-analysis"
  | "interview-prep"
  | "mock-interview"
  | "reports"
  | "admin";

export type AdminScreen =
  | "admin-dashboard"
  | "admin-membership"
  | "admin-coupons"
  | "admin-users"
  | "admin-ai-models"
  | "admin-settings"
  | "admin-notifications"
  | "admin-activity-log";

export interface Coupon {
  id: string;
  code: string;
  discountType: "Percentage" | "Flat Amount";
  discountValue: number;
  applicablePlans: string[];
  usageLimit: number;
  timesUsed: number;
  expiryDate: string;
  status: "Active" | "Expired" | "Draft";
}

export interface AdminPermissions {
  plans: { view: boolean; edit: boolean };
  users: { view: boolean; edit: boolean };
  content: { view: boolean; edit: boolean };
  settings: { view: boolean; edit: boolean };
  financials: { view: boolean; edit: boolean };
}

export interface AdminMember {
  id: string;
  name: string;
  email: string;
  role: "Super Admin" | "Support" | "Content Manager";
  lastActive: string;
  avatarUrl?: string;
  permissions: AdminPermissions;
}

export interface ActivityLogItem {
  id: string;
  adminName: string;
  adminRole: string;
  action: string;
  target: string;
  type: "Pricing" | "User Action" | "Coupon" | "Settings" | "Content";
  timestamp: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  plan: string;
  planExpiry?: string;
  status: "Active" | "Suspended" | "Expired";
  joined: string;
  spent: string;
  phone?: string;
  location?: string;
  mockCount?: number;
  atsCount?: number;
}

export interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  password_hash: string;
  professional_title: string;
  bio: string;
  avatar_url: string;
  language: string;
  timezone: string;
  is_2fa_enabled: boolean;

  // Contact & Social Links (from USER table)
  phone_no?: string;
  location?: string;
  portfolio_url?: string;
  github?: string;
  linkedin?: string;

  // Education Degree (from education_degree table)
  degree?: string;
  institution?: string;
  field_of_study?: string;
  start_year?: string | number;
  end_year?: string | number;

  created_at: string;
  updated_at: string;
}



