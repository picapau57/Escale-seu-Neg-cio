export type Language = "pt-BR" | "en" | "es";

export type PlanId = "free" | "starter" | "professional" | "business" | "enterprise";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  plan: PlanId;
  billingCycle: "monthly" | "annual";
  creditsUsed: number;
  creditsLimit: number;
  avatarUrl?: string;
  isTwoFactorEnabled: boolean;
  emailVerified: boolean;
  referralCode: string;
  affiliateEarnings: number;
  joinedAt: string;
}

export interface Plan {
  id: PlanId;
  nameKey: string;
  priceMonthlyBRL: number;
  priceAnnualBRL: number;
  priceMonthlyUSD: number;
  priceAnnualUSD: number;
  creditsLimit: number;
  popular?: boolean;
  features: string[];
}

export interface AITool {
  id: string;
  name: Record<Language, string>;
  description: Record<Language, string>;
  category: string;
  iconName: string;
  popular?: boolean;
  isPremium?: boolean;
  inputs: {
    id: string;
    label: Record<Language, string>;
    type: "text" | "textarea" | "select" | "number";
    placeholder?: Record<Language, string>;
    options?: { value: string; label: Record<Language, string> }[];
  }[];
  systemPrompt?: string;
}

export interface MarketplaceItem {
  id: string;
  title: Record<Language, string>;
  description: Record<Language, string>;
  type: "prompt" | "template" | "ebook" | "marketing" | "course";
  priceBRL: number;
  priceUSD: number;
  rating: number;
  salesCount: number;
  sellerName: string;
  badge?: string;
  coverImage: string;
  fileFormat: string;
  contentPreview?: string;
}

export interface PixTransaction {
  id: string;
  planId: PlanId;
  planName: string;
  amountBRL: number;
  userEmail: string;
  billingCycle: "monthly" | "annual";
  status: "pending" | "approved" | "expired";
  pixCopyPaste: string;
  createdAt: string;
  expiresAt: string;
  paidAt?: string;
}

export interface SupportTicket {
  id: string;
  userName: string;
  userEmail: string;
  subject: string;
  status: "open" | "in_progress" | "resolved";
  priority: "low" | "medium" | "high";
  message: string;
  createdAt: string;
  replies: { sender: string; text: string; time: string }[];
}

export interface Coupon {
  code: string;
  discountPercent: number;
  validUntil: string;
  usageCount: number;
  maxUsage: number;
  active: boolean;
}

export interface AdminMetrics {
  liveUsers: number;
  todayRevenue: number;
  weeklyRevenue: number;
  monthlyRevenue: number;
  annualRevenue: number;
  totalUsers: number;
  activeSubscriptions: number;
  canceledPlans: number;
  conversionRate: number;
  avgSessionTime: string;
}
