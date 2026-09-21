import { Coupon } from "../types";

export const DEFAULT_COUPONS: Coupon[] = [
  {
    id: "cpn_1",
    code: "FESTIVE25",
    discountType: "Percentage",
    discountValue: 25,
    applicablePlans: ["All Plans"],
    usageLimit: 500,
    timesUsed: 412,
    expiryDate: "2026-12-31",
    status: "Active",
  },
  {
    id: "cpn_2",
    code: "STUDENT50",
    discountType: "Percentage",
    discountValue: 50,
    applicablePlans: ["Pro", "Elite"],
    usageLimit: 1000,
    timesUsed: 890,
    expiryDate: "2026-10-15",
    status: "Active",
  },
  {
    id: "cpn_3",
    code: "EARLYBIRD",
    discountType: "Flat Amount",
    discountValue: 300,
    applicablePlans: ["Basic", "Plus"],
    usageLimit: 200,
    timesUsed: 200,
    expiryDate: "2026-08-30",
    status: "Expired",
  },
];

const STORAGE_KEY = "jobprep_coupons_v1";

export function getStoredCoupons(): Coupon[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_COUPONS));
      return DEFAULT_COUPONS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return DEFAULT_COUPONS;
  } catch {
    return DEFAULT_COUPONS;
  }
}

export function saveStoredCoupons(coupons: Coupon[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(coupons));
  } catch (err) {
    console.error("Failed to save coupons to localStorage", err);
  }
}

export function isCouponApplicableToPlan(coupon: Coupon, planName: string): boolean {
  if (!coupon || !coupon.applicablePlans || coupon.applicablePlans.length === 0) return false;
  return coupon.applicablePlans.some((ap) => {
    const target = ap.trim().toLowerCase();
    const current = planName.trim().toLowerCase();
    return (
      target === "all" ||
      target === "all plans" ||
      target.includes(current) ||
      current.includes(target)
    );
  });
}

export function calculateCouponPrice(price: number, coupon: Coupon): number {
  if (coupon.discountType === "Percentage") {
    return Math.round(price * (1 - coupon.discountValue / 100));
  } else {
    return Math.max(0, price - coupon.discountValue);
  }
}
