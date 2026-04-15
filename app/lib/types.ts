export type UserRole = "donor" | "ngo" | "admin";

export type DonationStatus = "pending" | "accepted" | "collected" | "completed" | "cancelled";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  organizationType?: string;
  address?: string;
}

export interface Donation {
  id: string;
  donorId: string;
  ngoId?: string;
  foodType: string;
  quantity: number;
  unit: string;
  pickupLocation: string;
  availability: string;
  notes?: string;
  status: DonationStatus;
  createdAt: string;
}
