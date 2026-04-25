"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, X, Pencil, Trash, Plus, Clock, CheckCircle, XCircle, User as UserIcon, Bell, MagnifyingGlass, Funnel, Download, Calendar, MapPin } from "phosphor-react";
import { fetchDonations, fetchUsers, updateDonation, deleteDonation, updateUser, deleteUser } from "@/app/lib/api";
import type { Donation, User, DonationStatus } from "@/app/lib/types";

function formatDate(dateString: string) {
  return new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short" }).format(new Date(dateString));
}

export default function AdminPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("foodbridge_session");
    if (!stored) {
      router.push("/login");
      return;
    }
    const currentUser = JSON.parse(stored) as User;
    if (currentUser.role !== "admin") {
      router.push("/");
      return;
    }
    setUser(currentUser);
  }, [router]);

  useEffect(() => {
    if (!user) return;

    async function load() {
      setLoading(true);
      try {
        const [donationsResponse, usersResponse] = await Promise.all([fetchDonations(), fetchUsers()]);
        setDonations(donationsResponse.donations);
        setUsers(usersResponse.users);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to load admin data");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [user]);

  async function updateDonationStatus(donationId: string, status: DonationStatus) {
    setError(null);
    try {
      await updateDonation(donationId, { status });
      const donationsResponse = await fetchDonations();
      setDonations(donationsResponse.donations);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update donation");
    }
  }

  async function removeDonation(donationId: string) {
    if (!confirm("Are you sure you want to delete this donation?")) return;
    setError(null);
    try {
      await deleteDonation(donationId);
      const donationsResponse = await fetchDonations();
      setDonations(donationsResponse.donations);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to delete donation");
    }
  }

  async function removeUser(userId: string) {
    if (!confirm("Are you sure you want to delete this user?")) return;
    setError(null);
    try {
      await deleteUser(userId);
      const usersResponse = await fetchUsers();
      setUsers(usersResponse.users);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to delete user");
    }
  }

  function logout() {
    localStorage.removeItem("foodbridge_session");
    router.push("/login");
  }

  const totals = useMemo(() => {
    const pending = donations.filter((item) => item.status === "pending").length;
    const accepted = donations.filter((item) => item.status === "accepted").length;
    const completed = donations.filter((item) => item.status === "completed").length;
    const ngos = users.filter((user) => user.role === "ngo").length;
    const donors = users.filter((user) => user.role === "donor").length;

    return {
      totalDonations: donations.length,
      pending,
      accepted,
      completed,
      ngos,
      donors,
    };
  }, [donations, users]);

  return (
    <main className="min-h-screen bg-slate-50">
      {error && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-red-500 px-4 py-2 text-white shadow-lg">
          <X size={20} />
          {error}
        </div>
      )}

      <section className="relative overflow-hidden bg-slate-950">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1800&q=80')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-slate-950/85" />
        <div className="absolute inset-0 bg-slate-950/85" />
        <div className="relative mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
          <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div className="max-w-3xl space-y-6">
              <span className="inline-flex rounded-full bg-emerald-300/15 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-emerald-200 ring-1 ring-emerald-200/20">
                Admin dashboard
              </span>
              <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl lg:text-4xl">
                Welcome back, {user?.name}.
              </h1>
              <p className="max-w-2xl text-sm leading-7 text-slate-200 sm:text-base">
                Monitor all donations, manage NGO partners, and oversee platform activity to ensure every food donation reaches its intended beneficiaries.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <button onClick={() => document.getElementById('donations-table')?.scrollIntoView({ behavior: 'smooth' })} className="inline-flex items-center justify-center bg-emerald-500 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-400">
                  <CheckCircle size={16} className="mr-2" />
                  Review donations
                </button>
                <button onClick={() => document.getElementById('users-table')?.scrollIntoView({ behavior: 'smooth' })} className="inline-flex items-center justify-center border border-white/20 bg-white/10 px-6 py-2.5 text-sm font-semibold text-gray-300 transition hover:border-white hover:bg-white/15">
                  Manage users
                </button>
              </div>
            </div>

            <div className="grid gap-4 border border-white/10 bg-white/10 p-4 shadow-2xl shadow-slate-950/30 backdrop-blur-xl lg:p-5">
              <div className="bg-slate-950/90 p-4">
                <p className="text-xs uppercase tracking-[0.35em] text-emerald-300">Platform metrics</p>
                <h3 className="mt-3 text-2xl font-semibold text-white">Live activity</h3>
                <p className="mt-2 text-sm leading-6 text-slate-200/80">
                  Total donations, users, and system health snapshot.
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="bg-white/10 p-4">
                  <p className="text-2xl font-semibold text-white">{totals.totalDonations}</p>
                  <p className="mt-1 text-xs text-slate-200/80">Total donations.</p>
                </div>
                <div className="bg-white/10 p-4">
                  <p className="text-2xl font-semibold text-white">{totals.ngos + totals.donors}</p>
                  <p className="mt-1 text-xs text-slate-200/80">Active users.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-4">
            <div className="border border-white/10 bg-white/10 p-4 shadow-[0_25px_50px_-30px_rgba(15,23,42,0.9)] backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <Plus size={20} className="text-white" />
                <p className="text-xs text-slate-300">Total donations</p>
              </div>
              <p className="mt-2 text-2xl font-semibold text-white">{totals.totalDonations}</p>
            </div>
            <div className="border border-white/10 bg-white/10 p-4 shadow-[0_25px_50px_-30px_rgba(15,23,42,0.9)] backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <Clock size={20} className="text-white" />
                <p className="text-xs text-slate-300">Pending</p>
              </div>
              <p className="mt-2 text-2xl font-semibold text-white">{totals.pending}</p>
            </div>
            <div className="border border-white/10 bg-white/10 p-4 shadow-[0_25px_50px_-30px_rgba(15,23,42,0.9)] backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <CheckCircle size={20} className="text-white" />
                <p className="text-xs text-slate-300">Accepted</p>
              </div>
              <p className="mt-2 text-2xl font-semibold text-white">{totals.accepted}</p>
            </div>
            <div className="border border-white/10 bg-white/10 p-4 shadow-[0_25px_50px_-30px_rgba(15,23,42,0.9)] backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <Check size={20} className="text-white" />
                <p className="text-xs text-slate-300">Completed</p>
              </div>
              <p className="mt-2 text-2xl font-semibold text-white">{totals.completed}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-14">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
            <div className="space-y-4">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-emerald-600">Admin overview</p>
              <h2 className="text-2xl font-semibold text-slate-900 sm:text-3xl">
                Platform management and monitoring.
              </h2>
              <p className="max-w-xl text-sm leading-7 text-slate-600">
                Review donation requests, manage user accounts, track platform metrics, and ensure smooth operations across the network.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="border border-slate-200 bg-slate-50 p-5 shadow-sm">
                <p className="text-sm uppercase tracking-[0.35em] text-emerald-600">Users</p>
                <p className="mt-3 text-base font-semibold text-slate-900">{totals.ngos + totals.donors}</p>
              </div>
              <div className="border border-slate-200 bg-slate-50 p-5 shadow-sm">
                <p className="text-sm uppercase tracking-[0.35em] text-emerald-600">Partners</p>
                <p className="mt-3 text-base font-semibold text-slate-900">{totals.ngos}</p>
              </div>
              <div className="border border-slate-200 bg-slate-50 p-5 shadow-sm">
                <p className="text-sm uppercase tracking-[0.35em] text-emerald-600">Health</p>
                <p className="mt-3 text-base font-semibold text-slate-900">
                  {Math.round((totals.completed / Math.max(totals.totalDonations, 1)) * 100)}%
                </p>
              </div>
            </div>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            <div className="border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-lg font-semibold text-slate-900">{totals.pending}</p>
              <p className="mt-2 text-sm text-slate-600">Pending requests.</p>
            </div>
            <div className="border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-lg font-semibold text-slate-900">{totals.completed}</p>
              <p className="mt-2 text-sm text-slate-600">Completed donations.</p>
            </div>
            <div className="border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-lg font-semibold text-slate-900">{totals.donors}</p>
              <p className="mt-2 text-sm text-slate-600">Active donors.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-950 py-12 text-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div id="donations-table" className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-emerald-300">Donation management</p>
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Recent donations
            </h2>
            <p className="max-w-xl text-sm leading-7 text-slate-300/90">
              Review, update, and manage donation statuses to keep the platform running smoothly.
            </p>
            {loading ? (
              <div className="mt-8  bg-slate-800/50 p-8 text-center text-slate-300">Loading donations…</div>
            ) : donations.length === 0 ? (
              <div className="mt-8  bg-slate-800/50 p-8 text-center text-slate-300">No donations yet.</div>
            ) : (
              <div className="mt-8 overflow-x-auto  border border-slate-700">
                <table className="w-full divide-y divide-slate-700 text-left text-sm">
                  <thead className="bg-slate-800/50">
                    <tr>
                      <th className="px-4 py-3 text-xs font-semibold text-slate-300">Food Type</th>
                      <th className="px-4 py-3 text-xs font-semibold text-slate-300">Quantity</th>
                      <th className="px-4 py-3 text-xs font-semibold text-slate-300">Location</th>
                      <th className="px-4 py-3 text-xs font-semibold text-slate-300">Status</th>
                      <th className="px-4 py-3 text-xs font-semibold text-slate-300">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700">
                    {donations.slice(-10).reverse().map((item) => (
                      <tr key={item.id} className="transition hover:bg-slate-800/50">
                        <td className="px-4 py-3 text-slate-300">{item.foodType}</td>
                        <td className="px-4 py-3 text-slate-300">{item.quantity} {item.unit}</td>
                        <td className="px-4 py-3 text-slate-300 text-xs">{item.pickupLocation}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${item.status === 'completed' ? 'bg-emerald-500/20 text-emerald-300' : item.status === 'accepted' ? 'bg-blue-500/20 text-blue-300' : 'bg-yellow-500/20 text-yellow-300'}`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            {item.status === "pending" && (
                              <button onClick={() => updateDonationStatus(item.id, "accepted")} className="rounded px-2.5 py-1 text-xs bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30">
                                Accept
                              </button>
                            )}
                            {item.status === "accepted" && (
                              <button onClick={() => updateDonationStatus(item.id, "completed")} className="rounded px-2.5 py-1 text-xs bg-blue-500/20 text-blue-300 hover:bg-blue-500/30">
                                Complete
                              </button>
                            )}
                            <button onClick={() => removeDonation(item.id)} className="rounded px-2.5 py-1 text-xs bg-red-500/20 text-red-300 hover:bg-red-500/30">
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="bg-white py-12">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div id="users-table" className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-emerald-600">User management</p>
            <h2 className="text-2xl font-semibold text-slate-900 sm:text-3xl">
              All users
            </h2>
            <p className="max-w-xl text-sm leading-7 text-slate-600">
              View and manage all registered users, including donors and NGO partners.
            </p>
            {loading ? (
              <div className="mt-8  bg-slate-50 p-8 text-center text-slate-500">Loading users…</div>
            ) : users.length === 0 ? (
              <div className="mt-8  bg-slate-50 p-8 text-center text-slate-500">No users yet.</div>
            ) : (
              <div className="mt-8 overflow-x-auto  border border-slate-200">
                <table className="w-full divide-y divide-slate-200 text-left text-sm">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-4 py-3 text-xs font-semibold text-slate-700">Name</th>
                      <th className="px-4 py-3 text-xs font-semibold text-slate-700">Email</th>
                      <th className="px-4 py-3 text-xs font-semibold text-slate-700">Role</th>
                      <th className="px-4 py-3 text-xs font-semibold text-slate-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {users.map((u) => (
                      <tr key={u.id} className="transition hover:bg-slate-50">
                        <td className="px-4 py-3 font-medium text-slate-900">{u.name}</td>
                        <td className="px-4 py-3 text-slate-600">{u.email}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold capitalize ${u.role === 'admin' ? 'bg-purple-100 text-purple-700' : u.role === 'ngo' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'}`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {u.id !== user?.id && (
                            <button onClick={() => removeUser(u.id)} className="rounded px-2.5 py-1 text-xs bg-red-100 text-red-700 hover:bg-red-200">
                              Delete
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
