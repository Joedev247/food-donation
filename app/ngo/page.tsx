"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, X, Pencil, Trash, Plus, Clock, CheckCircle, User as UserIcon, Bell, MapPin, Package } from "phosphor-react";
import { fetchDonations, fetchStats, fetchUsers, updateDonation, updateUser } from "@/app/lib/api";
import type { Donation, User, DonationStatus } from "@/app/lib/types";

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
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [donors, setDonors] = useState<User[]>([]);

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
        const [pendingResponse, acceptedResponse, completedResponse, statsResponse, usersResponse] = await Promise.all([
          fetchDonations({ status: "pending" }),
          fetchDonations({ ngoId: currentUser.id, status: "accepted" }),
          fetchDonations({ ngoId: currentUser.id, status: "completed" }),
          fetchStats(currentUser.id, currentUser.role),
          fetchUsers()
        ]);
        setDonations(pendingResponse.donations);
        setAcceptedDonations(acceptedResponse.donations);
        setCompletedDonations(completedResponse.donations);
        setStats(statsResponse);
        setDonors(usersResponse.users.filter(u => u.role === 'donor'));
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
    setShowLogoutConfirm(true);
  }

  function confirmLogout() {
    localStorage.removeItem("foodbridge_session");
    router.push("/login");
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      {(error || success) && (
        <div className="fixed top-4 right-4 z-50">
          {error && (
            <div className="flex items-center gap-2 bg-red-500 px-4 py-2 text-white shadow-lg">
              <X size={20} />
              {error}
            </div>
          )}
          {success && (
            <div className="flex items-center gap-2 bg-emerald-500 px-4 py-2 text-white shadow-lg">
              <Check size={20} />
              {success}
            </div>
          )}
        </div>
      )}

      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white p-6 shadow-lg">
            <h3 className="text-lg font-semibold">Confirm Logout</h3>
            <p className="mt-2 text-sm text-slate-600">Are you sure you want to log out?</p>
            <div className="mt-4 flex gap-3">
              <button onClick={confirmLogout} className="bg-red-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-600">
                Logout
              </button>
              <button onClick={() => setShowLogoutConfirm(false)} className="border border-slate-300 px-4 py-2 text-sm font-semibold transition hover:bg-slate-50">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <section className="relative overflow-hidden bg-slate-950">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1800&q=80')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-slate-950/85" />
        <div className="relative mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
          <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div className="max-w-3xl space-y-6">
              <span className="inline-flex rounded-full bg-emerald-300/15 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-emerald-200 ring-1 ring-emerald-200/20">
                NGO dashboard
              </span>
              <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl lg:text-4xl">
                Welcome back, {user?.name}.
              </h1>
              <p className="max-w-2xl text-sm leading-7 text-slate-200 sm:text-base">
                Accept donations, track collections, and manage pickups—all from one streamlined dashboard designed for NGOs like you.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <button onClick={() => document.getElementById('donation-queue')?.scrollIntoView({ behavior: 'smooth' })} className="inline-flex items-center justify-center bg-emerald-500 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-400">
                  <Plus size={16} className="mr-2" />
                  View donations
                </button>
                <button onClick={() => document.getElementById('accepted-donations')?.scrollIntoView({ behavior: 'smooth' })} className="inline-flex items-center justify-center border border-white/20 bg-white/10 px-6 py-2.5 text-sm font-semibold text-gray-300 transition hover:border-white hover:bg-white/15">
                  Track pickups
                </button>
              </div>
            </div>

            <div className="grid gap-4 border border-white/10 bg-white/10 p-4 shadow-2xl shadow-slate-950/30 backdrop-blur-xl lg:p-5">
              <div className="bg-slate-950/90 p-4">
                <p className="text-xs uppercase tracking-[0.35em] text-emerald-300">Your impact</p>
                <h3 className="mt-3 text-2xl font-semibold text-white">Donation overview</h3>
                <p className="mt-2 text-sm leading-6 text-slate-200/80">
                  Pending requests, active collections, and completed handoffs.
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="bg-white/10 p-4">
                  <p className="text-2xl font-semibold text-white">{stats.pendingDonations}</p>
                  <p className="mt-1 text-xs text-slate-200/80">Pending donations.</p>
                </div>
                <div className="bg-white/10 p-4">
                  <p className="text-2xl font-semibold text-white">{stats.completedDonations}</p>
                  <p className="mt-1 text-xs text-slate-200/80">Successfully completed.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-4">
            <div className="border border-white/10 bg-white/10 p-4 shadow-[0_25px_50px_-30px_rgba(15,23,42,0.9)] backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <Clock size={20} className="text-white" />
                <p className="text-xs text-slate-300">Pending</p>
              </div>
              <p className="mt-2 text-2xl font-semibold text-white">{stats.pendingDonations}</p>
            </div>
            <div className="border border-white/10 bg-white/10 p-4 shadow-[0_25px_50px_-30px_rgba(15,23,42,0.9)] backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <Package size={20} className="text-white" />
                <p className="text-xs text-slate-300">Accepted</p>
              </div>
              <p className="mt-2 text-2xl font-semibold text-white">{stats.acceptedDonations}</p>
            </div>
            <div className="border border-white/10 bg-white/10 p-4 shadow-[0_25px_50px_-30px_rgba(15,23,42,0.9)] backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <CheckCircle size={20} className="text-white" />
                <p className="text-xs text-slate-300">Completed</p>
              </div>
              <p className="mt-2 text-2xl font-semibold text-white">{stats.completedDonations}</p>
            </div>
            <div className="border border-white/10 bg-white/10 p-4 shadow-[0_25px_50px_-30px_rgba(15,23,42,0.9)] backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <Bell size={20} className="text-white" />
                <p className="text-xs text-slate-300">Total received</p>
              </div>
              <p className="mt-2 text-2xl font-semibold text-white">{stats.totalDonations}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-14">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
            <div className="space-y-4">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-emerald-600">Donation management</p>
              <h2 className="text-2xl font-semibold text-slate-900 sm:text-3xl">
                Accept, track, and complete donations.
              </h2>
              <p className="max-w-xl text-sm leading-7 text-slate-600">
                Review pending donations, accept pickups, and mark collections as complete. Everything you need to manage your donations efficiently.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="border border-slate-200 bg-slate-50 p-5 shadow-sm">
                <p className="text-sm uppercase tracking-[0.35em] text-emerald-600">Step 1</p>
                <p className="mt-3 text-base font-semibold text-slate-900">Review pending</p>
              </div>
              <div className="border border-slate-200 bg-slate-50 p-5 shadow-sm">
                <p className="text-sm uppercase tracking-[0.35em] text-emerald-600">Step 2</p>
                <p className="mt-3 text-sm font-semibold text-slate-900">Accept donations</p>
              </div>
              <div className="border border-slate-200 bg-slate-50 p-5 shadow-sm">
                <p className="text-sm uppercase tracking-[0.35em] text-emerald-600">Step 3</p>
                <p className="mt-3 text-base font-semibold text-slate-900">Complete pickup</p>
              </div>
            </div>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            <div className="border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-lg font-semibold text-slate-900">{stats.totalDonations}</p>
              <p className="mt-2 text-sm text-slate-600">Total donations received.</p>
            </div>
            <div className="border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-lg font-semibold text-slate-900">{stats.acceptedDonations}</p>
              <p className="mt-2 text-sm text-slate-600">Currently active collections.</p>
            </div>
            <div className="border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-lg font-semibold text-slate-900">{stats.completedDonations}</p>
              <p className="mt-2 text-sm text-slate-600">Successfully completed.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-950 py-12 text-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
            <div id="donation-queue" className="space-y-4">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-emerald-300">Accept donations</p>
              <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                Pending donation queue
              </h2>
              <p className="max-w-xl text-sm leading-7 text-slate-300/90">
                Review all pending donations submitted by donors. Accept donations and schedule pickups, or mark them as complete when collected.
              </p>
              <div className="mt-8 space-y-4 max-h-96 overflow-y-auto">
                {donations.length === 0 ? (
                  <p className="text-sm text-slate-400">No pending donations at this time.</p>
                ) : (
                  donations.map((donation) => (
                    <div key={donation.id} className=" bg-slate-800/50 border border-slate-700/50 p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <Package size={18} className="text-emerald-400" />
                            <p className="text-sm font-semibold text-white">{donation.foodType}</p>
                          </div>
                          <p className="text-xs text-slate-300 mt-2">{donation.quantity} {donation.unit}</p>
                          <p className="text-xs text-slate-400 mt-1 flex items-center gap-2"><MapPin size={14} /> {donation.pickupLocation}</p>
                          <p className="text-xs text-slate-500 mt-1">Submitted {formatDate(donation.createdAt)}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button onClick={() => acceptDonation(donation.id)} disabled={loading} className="px-3 py-1.5 text-xs font-semibold bg-emerald-500 text-white rounded hover:bg-emerald-400 disabled:opacity-50">
                            Accept
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="border border-slate-800 bg-slate-900/80 p-6 shadow-[0_24px_60px_-30px_rgba(15,23,42,0.8)]">
              <p className="text-xs uppercase tracking-[0.35em] text-emerald-300">Quick stats</p>
              <h3 className="mt-3 text-xl font-semibold text-white">Donation activity</h3>
              <div className="mt-4 space-y-4">
                <div className=" bg-slate-800/50 p-3">
                  <p className="text-xs text-slate-400">Pending donations</p>
                  <p className="mt-2 text-2xl font-semibold text-emerald-400">{stats.pendingDonations}</p>
                </div>
                <div className=" bg-slate-800/50 p-3">
                  <p className="text-xs text-slate-400">Active collections</p>
                  <p className="mt-2 text-2xl font-semibold text-blue-400">{stats.acceptedDonations}</p>
                </div>
                <div className=" bg-slate-800/50 p-3">
                  <p className="text-xs text-slate-400">Completed</p>
                  <p className="mt-2 text-2xl font-semibold text-slate-300">{stats.completedDonations}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="accepted-donations" className="bg-white py-12">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-8 space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-emerald-600">Active collections</p>
            <h2 className="text-2xl font-semibold text-slate-900 sm:text-3xl">Donations you've accepted</h2>
            <p className="max-w-2xl text-sm text-slate-600">Track donations currently scheduled for pickup. Mark them as complete once you've collected them.</p>
          </div>

          <div className="space-y-4">
            {acceptedDonations.length === 0 ? (
              <div className=" border-2 border-dashed border-slate-300 bg-slate-50 p-8 text-center">
                <p className="text-sm text-slate-600">No active collections. Accept donations from the queue above.</p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {acceptedDonations.map((donation) => (
                  <div key={donation.id} className=" border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <Package size={20} className="text-emerald-500" />
                      <span className="px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-700 rounded-full">Active</span>
                    </div>
                    <p className="font-semibold text-slate-900">{donation.foodType}</p>
                    <p className="text-sm text-slate-600 mt-2">{donation.quantity} {donation.unit}</p>
                    <p className="text-sm text-slate-600 mt-1 flex items-center gap-2"><MapPin size={14} /> {donation.pickupLocation}</p>
                    <p className="text-xs text-slate-500 mt-2">Accepted {formatDate(donation.createdAt)}</p>
                    <button onClick={() => completeDonation(donation.id)} disabled={loading} className="mt-4 w-full px-3 py-2 text-sm font-semibold bg-slate-900 text-white rounded hover:bg-slate-800 disabled:opacity-50">
                      Mark complete
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-12">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-8 space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-emerald-600">History</p>
            <h2 className="text-2xl font-semibold text-slate-900 sm:text-3xl">Completed donations</h2>
            <p className="max-w-2xl text-sm text-slate-600">View all donations you've successfully collected and completed.</p>
          </div>

          <div className="space-y-4">
            {completedDonations.length === 0 ? (
              <div className=" border-2 border-dashed border-slate-300 bg-white p-8 text-center">
                <p className="text-sm text-slate-600">No completed donations yet.</p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {completedDonations.slice(0, 12).map((donation) => (
                  <div key={donation.id} className=" border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <Check size={18} className="text-emerald-500" />
                      <span className="px-2 py-1 text-xs font-semibold bg-emerald-100 text-emerald-700 rounded-full">Completed</span>
                    </div>
                    <p className="font-semibold text-slate-900 text-sm">{donation.foodType}</p>
                    <p className="text-xs text-slate-600 mt-1">{donation.quantity} {donation.unit}</p>
                    <p className="text-xs text-slate-500 mt-2">Completed {formatDate(donation.createdAt)}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="bg-slate-900 py-12">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className=" bg-slate-800/80 border border-slate-700 p-8">
            <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
              <div>
                <h3 className="text-lg font-semibold text-white">Organization profile</h3>
                <p className="text-sm text-slate-300 mt-1">Manage your NGO details and preferences</p>
              </div>
              <button onClick={logout} className="inline-flex items-center justify-center bg-red-500 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-red-600">
                <X size={16} className="mr-2" />
                Logout
              </button>
            </div>
            <div className="mt-6 p-4  bg-slate-700/50 border border-slate-600">
              <p className="text-sm text-slate-300"><span className="font-semibold text-white">Organization:</span> {user?.name}</p>
              <p className="text-sm text-slate-300 mt-2"><span className="font-semibold text-white">Email:</span> {user?.email}</p>
              <p className="text-sm text-slate-300 mt-2"><span className="font-semibold text-white">Phone:</span> {user?.phone || "Not provided"}</p>
              <p className="text-sm text-slate-300 mt-2"><span className="font-semibold text-white">Type:</span> {user?.organizationType || "Not specified"}</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
