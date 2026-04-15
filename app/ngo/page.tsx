"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchDonations, fetchStats, updateDonation, fetchUsers, updateUser } from "@/app/lib/api";
import type { Donation, User } from "@/app/lib/types";

function formatDate(dateString: string) {
  return new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short" }).format(new Date(dateString));
}

export default function NGODashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [acceptedDonations, setAcceptedDonations] = useState<Donation[]>([]);
  const [completedDonations, setCompletedDonations] = useState<Donation[]>([]);
  const [stats, setStats] = useState({ totalDonations: 0, pendingDonations: 0, acceptedDonations: 0, completedDonations: 0 });
  const [profileForm, setProfileForm] = useState({ name: "", email: "", phone: "", organizationType: "", address: "" });
  const [editingProfile, setEditingProfile] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("foodbridge_session");
    if (!stored) {
      router.push("/login");
      return;
    }
    const currentUser = JSON.parse(stored) as User;
    if (currentUser.role !== "ngo") {
      router.push("/");
      return;
    }
    setUser(currentUser);
  }, [router]);

  useEffect(() => {
    if (!user) return;
    const currentUser = user;

    async function load() {
      setLoading(true);
      try {
        const [pendingResponse, acceptedResponse, completedResponse, statsResponse] = await Promise.all([
          fetchDonations({ status: "pending" }),
          fetchDonations({ ngoId: currentUser.id, status: "accepted" }),
          fetchDonations({ ngoId: currentUser.id, status: "completed" }),
          fetchStats(currentUser.id, currentUser.role)
        ]);
        setDonations(pendingResponse.donations);
        setAcceptedDonations(acceptedResponse.donations);
        setCompletedDonations(completedResponse.donations);
        setStats(statsResponse);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to load NGO data");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [user]);

  async function acceptDonation(donationId: string) {
    setError(null);
    setLoading(true);
    try {
      await updateDonation(donationId, { status: "accepted", ngoId: user?.id });
      const [pendingResponse, acceptedResponse, completedResponse, statsResponse] = await Promise.all([
        fetchDonations({ status: "pending" }),
        fetchDonations({ ngoId: user!.id, status: "accepted" }),
        fetchDonations({ ngoId: user!.id, status: "completed" }),
        fetchStats(user!.id, user!.role)
      ]);
      setDonations(pendingResponse.donations);
      setAcceptedDonations(acceptedResponse.donations);
      setCompletedDonations(completedResponse.donations);
      setStats(statsResponse);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update donation");
    } finally {
      setLoading(false);
    }
  }

  async function completeDonation(donationId: string) {
    setError(null);
    setLoading(true);
    try {
      await updateDonation(donationId, { status: "completed", ngoId: user?.id });
      const [pendingResponse, acceptedResponse, completedResponse, statsResponse] = await Promise.all([
        fetchDonations({ status: "pending" }),
        fetchDonations({ ngoId: user!.id, status: "accepted" }),
        fetchDonations({ ngoId: user!.id, status: "completed" }),
        fetchStats(user!.id, user!.role)
      ]);
      setDonations(pendingResponse.donations);
      setAcceptedDonations(acceptedResponse.donations);
      setCompletedDonations(completedResponse.donations);
      setStats(statsResponse);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to complete donation");
    } finally {
      setLoading(false);
    }
  }

  async function updateProfile() {
    if (!user) return;
    setError(null);
    setLoading(true);
    try {
      await updateUser(user.id, profileForm);
      setUser({ ...user, ...profileForm });
      setEditingProfile(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update profile");
    } finally {
      setLoading(false);
    }
  }

  function startEditingProfile() {
    if (!user) return;
    setProfileForm({
      name: user.name,
      email: user.email,
      phone: user.phone || "",
      organizationType: user.organizationType || "",
      address: user.address || "",
    });
    setEditingProfile(true);
  }

  function logout() {
    localStorage.removeItem("foodbridge_session");
    router.push("/login");
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10 text-slate-900 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 rounded-3xl bg-white p-8 shadow-lg shadow-slate-200/60 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-600">NGO dashboard</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight">Welcome back, {user?.name}</h1>
            <p className="mt-2 text-sm text-slate-600">Accept donations, track deliveries, and manage your social impact.</p>
          </div>
          <button onClick={logout} className="inline-flex items-center justify-center rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-700">
            Logout
          </button>
        </div>
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <section className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-sm text-slate-500">Pending donations</p>
                <p className="mt-4 text-4xl font-semibold text-slate-900">{stats.pendingDonations}</p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-sm text-slate-500">Accepted</p>
                <p className="mt-4 text-4xl font-semibold text-slate-900">{stats.acceptedDonations}</p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-sm text-slate-500">Completed</p>
                <p className="mt-4 text-4xl font-semibold text-slate-900">{stats.completedDonations}</p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-sm text-slate-500">Total donations</p>
                <p className="mt-4 text-4xl font-semibold text-slate-900">{stats.totalDonations}</p>
              </div>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold">Donation queue</h2>
                  <p className="mt-1 text-sm text-slate-600">Review pending donation pickups and assign them.</p>
                </div>
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700">Connected API</span>
              </div>
              {error ? <p className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}
              <div className="mt-6 space-y-4">
                {donations.length === 0 ? (
                  <p className="text-sm text-slate-600">There are no pending donations right now.</p>
                ) : (
                  donations.map((donation) => (
                    <div key={donation.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{donation.foodType}</p>
                          <p className="text-sm text-slate-600">{donation.quantity} {donation.unit}</p>
                          <p className="mt-2 text-sm text-slate-600">Pickup at {donation.pickupLocation}</p>
                          <p className="mt-1 text-sm text-slate-500">Posted {formatDate(donation.createdAt)}</p>
                        </div>
                        <div className="flex flex-wrap gap-3">
                          <button onClick={() => acceptDonation(donation.id)} className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700">
                            Accept
                          </button>
                          <button onClick={() => completeDonation(donation.id)} className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700">
                            Mark complete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold">My accepted donations</h2>
                  <p className="mt-1 text-sm text-slate-600">Track donations you've accepted for pickup.</p>
                </div>
                <span className="rounded-full bg-sky-100 px-3 py-1 text-sm font-semibold text-sky-700">{acceptedDonations.length} active</span>
              </div>
              <div className="mt-6 space-y-4">
                {acceptedDonations.length === 0 ? (
                  <p className="text-sm text-slate-600">No accepted donations yet.</p>
                ) : (
                  acceptedDonations.map((donation) => (
                    <div key={donation.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{donation.foodType}</p>
                          <p className="text-sm text-slate-600">{donation.quantity} {donation.unit}</p>
                          <p className="mt-2 text-sm text-slate-600">Pickup at {donation.pickupLocation}</p>
                          <p className="mt-1 text-sm text-slate-500">Accepted {formatDate(donation.createdAt)}</p>
                        </div>
                        <button onClick={() => completeDonation(donation.id)} className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700">
                          Mark complete
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold">Completed donations</h2>
                  <p className="mt-1 text-sm text-slate-600">View donations you've successfully completed.</p>
                </div>
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700">{completedDonations.length} completed</span>
              </div>
              <div className="mt-6 space-y-4">
                {completedDonations.length === 0 ? (
                  <p className="text-sm text-slate-600">No completed donations yet.</p>
                ) : (
                  completedDonations.slice(0, 5).map((donation) => (
                    <div key={donation.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{donation.foodType}</p>
                        <p className="text-sm text-slate-600">{donation.quantity} {donation.unit}</p>
                        <p className="mt-2 text-sm text-slate-600">Pickup at {donation.pickupLocation}</p>
                        <p className="mt-1 text-sm text-slate-500">Completed {formatDate(donation.createdAt)}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </section>

          <aside className="space-y-6">
            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-xl font-semibold">Organization profile</h2>
                {!editingProfile && (
                  <button onClick={startEditingProfile} className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700">
                    Edit
                  </button>
                )}
              </div>
              {editingProfile ? (
                <div className="mt-6 space-y-4">
                  <label className="block">
                    <span className="text-sm font-medium text-slate-700">Organization name</span>
                    <input type="text" value={profileForm.name} onChange={(e) => setProfileForm(prev => ({ ...prev, name: e.target.value }))} className="mt-1 block w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-base outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition" />
                  </label>
                  <label className="block">
                    <span className="text-sm font-medium text-slate-700">Email</span>
                    <input type="email" value={profileForm.email} onChange={(e) => setProfileForm(prev => ({ ...prev, email: e.target.value }))} className="mt-1 block w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-base outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition" />
                  </label>
                  <label className="block">
                    <span className="text-sm font-medium text-slate-700">Phone</span>
                    <input type="tel" value={profileForm.phone} onChange={(e) => setProfileForm(prev => ({ ...prev, phone: e.target.value }))} className="mt-1 block w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-base outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition" />
                  </label>
                  <label className="block">
                    <span className="text-sm font-medium text-slate-700">Organization type</span>
                    <select value={profileForm.organizationType} onChange={(e) => setProfileForm(prev => ({ ...prev, organizationType: e.target.value }))} className="mt-1 block w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-base outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition">
                      <option value="">Select type</option>
                      <option>Shelter</option>
                      <option>Food Bank</option>
                      <option>Community Center</option>
                      <option>School</option>
                      <option>Church</option>
                      <option>Other</option>
                    </select>
                  </label>
                  <label className="block">
                    <span className="text-sm font-medium text-slate-700">Address</span>
                    <textarea value={profileForm.address} onChange={(e) => setProfileForm(prev => ({ ...prev, address: e.target.value }))} rows={3} className="mt-1 block w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-base outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition" />
                  </label>
                  <div className="flex gap-3">
                    <button onClick={updateProfile} disabled={loading} className="rounded-full bg-emerald-600 px-6 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:bg-emerald-400">
                      {loading ? "Saving..." : "Save changes"}
                    </button>
                    <button onClick={() => setEditingProfile(false)} className="rounded-full bg-slate-200 px-6 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-300">
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mt-6 space-y-4">
                  <div>
                    <p className="text-sm text-slate-500">Organization name</p>
                    <p className="text-base font-medium text-slate-900">{user?.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Email</p>
                    <p className="text-base font-medium text-slate-900">{user?.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Phone</p>
                    <p className="text-base font-medium text-slate-900">{user?.phone || "Not provided"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Organization type</p>
                    <p className="text-base font-medium text-slate-900">{user?.organizationType || "Not specified"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Address</p>
                    <p className="text-base font-medium text-slate-900">{user?.address || "Not provided"}</p>
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
