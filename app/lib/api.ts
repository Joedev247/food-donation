import type { Donation, User, UserRole } from "./types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Unknown error" }));
    throw new Error(error.message || "API request failed");
  }
  return response.json();
}

export async function login(email: string, password: string): Promise<{ user: User; token: string }> {
  return request<{ user: User; token: string }>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function registerUser(payload: {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  phone?: string;
  organizationType?: string;
  address?: string;
}): Promise<{ user: User }> {
  return request<{ user: User }>("/api/users", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function fetchDonations(query: {
  donorId?: string;
  ngoId?: string;
  status?: string;
} = {}): Promise<{ donations: Donation[] }> {
  const search = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value) search.set(key, value);
  });
  const path = `/api/donations?${search.toString()}`;
  return request<{ donations: Donation[] }>(path);
}

export async function fetchUsers(): Promise<{ users: User[] }> {
  return request<{ users: User[] }>("/api/users");
}

export async function createDonation(payload: {
  donorId: string;
  ngoId?: string;
  foodType: string;
  quantity: number;
  unit: string;
  pickupLocation: string;
  availability: string;
  notes?: string;
}): Promise<{ donation: Donation }> {
  return request<{ donation: Donation }>("/api/donations", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateDonation(id: string, payload: Partial<Donation>): Promise<{ donation: Donation }> {
  return request<{ donation: Donation }>(`/api/donations/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function deleteDonation(id: string): Promise<void> {
  return request<void>(`/api/donations/${id}`, {
    method: "DELETE",
  });
}

export async function updateUser(id: string, payload: Partial<User>): Promise<{ user: User }> {
  return request<{ user: User }>(`/api/users/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function deleteUser(id: string): Promise<void> {
  return request<void>(`/api/users/${id}`, {
    method: "DELETE",
  });
}

export async function fetchStats(userId: string, role: UserRole): Promise<{ totalDonations: number; pendingDonations: number; acceptedDonations: number; completedDonations: number }> {
  const response = await request<{ totalDonations: number; pendingDonations: number; acceptedDonations: number; completedDonations: number }>(`/api/stats?userId=${userId}&role=${role}`);
  return response;
}
