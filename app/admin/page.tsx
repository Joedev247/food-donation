"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchDonations, fetchUsers, updateDonation, deleteDonation, updateUser, deleteUser } from "@/app/lib/api";
import type { Donation, User } from "@/app/lib/types";

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

  async function updateDonationStatus(donationId: string, status: string) {
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

  const quickActions = [
    {
      title: "Review pending donations",
      description: "Check new donation requests and approve or reassign pickup details.",
      tone: "bg-emerald-500/10 text-emerald-700",
    },
    {
      title: "Manage partners",
      description: "Verify NGO profiles and keep your partner network up to date.",
      tone: "bg-sky-500/10 text-sky-700",
    },
    {
      title: "Monitor platform health",
      description: "Track activity metrics and ensure donations are moving smoothly.",
      tone: "bg-violet-500/10 text-violet-700",
    },
  ];

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <section className="relative overflow-hidden bg-slate-950 py-20 text-white sm:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(34,197,94,0.16),_transparent_25%),radial-gradient(circle_at_bottom_right,_rgba(59,130,246,0.14),_transparent_20%)]" />
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[1.3fr_0.7fr] lg:items-center">
            <div className="space-y-6">
              <p className="inline-flex rounded-full bg-emerald-300/15 px-4 py-1.5 text-sm font-semibold uppercase tracking-[0.35em] text-emerald-200 ring-1 ring-emerald-200/20">
                Admin dashboard
              </p>
              <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
                Monitor donation flow, partner activity, and platform health.
              </h1>
              <p className="max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
                The centralized admin console helps you stay on top of donations, verify partners, and keep every food rescue moving toward community impact.
              </p>
              <div className="flex items-center gap-4">
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {quickActions.map((action) => (
                    <div key={action.title} className={`rounded-[1.75rem] border border-white/10 ${action.tone} p-6 shadow-lg shadow-slate-950/20`}>
                      <h2 className="text-lg font-semibold">{action.title}</h2>
                      <p className="mt-3 text-sm leading-6 text-slate-200">{action.description}</p>
                    </div>
                  ))}
                </div>
                <button onClick={logout} className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:border-white hover:bg-white/15">
                  Logout
                </button>
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-[0_30px_80px_-40px_rgba(15,23,42,0.8)] backdrop-blur-xl">
              <p className="text-sm uppercase tracking-[0.35em] text-emerald-300">Live metrics</p>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="rounded-[1.75rem] bg-white/10 p-5">
                  <p className="text-4xl font-semibold text-white">{totals.totalDonations}</p>
                  <p className="mt-2 text-sm text-slate-200/80">Donations created</p>
                </div>
                <div className="rounded-[1.75rem] bg-white/10 p-5">
                  <p className="text-4xl font-semibold text-white">{totals.accepted}</p>
                  <p className="mt-2 text-sm text-slate-200/80">Accepted offers</p>
                </div>
                <div className="rounded-[1.75rem] bg-white/10 p-5">
                  <p className="text-4xl font-semibold text-white">{totals.pending}</p>
                  <p className="mt-2 text-sm text-slate-200/80">Pending approvals</p>
                </div>
                <div className="rounded-[1.75rem] bg-white/10 p-5">
                  <p className="text-4xl font-semibold text-white">{totals.completed}</p>
                  <p className="mt-2 text-sm text-slate-200/80">Completed handoffs</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        {error && <p className="mb-6 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
        {loading ? (
          <div className="rounded-[2rem] border border-slate-200 bg-white p-12 text-center shadow-xl shadow-slate-200/60">Loading admin data…</div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-6">
              <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/60">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-sm uppercase tracking-[0.35em] text-emerald-600">Live donation activity</p>
                    <h2 className="mt-3 text-2xl font-semibold text-slate-900">Recent donations</h2>
                  </div>
                  <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">Latest 8 entries</span>
                </div>
                <div className="mt-8 overflow-x-auto">
                  <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
                    <thead className="border-b border-slate-200 text-slate-500">
                      <tr>
                        <th className="px-4 py-3">ID</th>
                        <th className="px-4 py-3">Donor</th>
                        <th className="px-4 py-3">Food</th>
                        <th className="px-4 py-3">Location</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {donations.slice(-8).reverse().map((item) => (
                        <tr key={item.id} className="transition hover:bg-slate-50">
                          <td className="px-4 py-4 font-medium text-slate-900">{item.id.slice(0, 8)}</td>
                          <td className="px-4 py-4 text-slate-600">{item.donorId}</td>
                          <td className="px-4 py-4 text-slate-600">{item.foodType}</td>
                          <td className="px-4 py-4 text-slate-600">{item.pickupLocation}</td>
                          <td className="px-4 py-4 text-slate-600 capitalize">{item.status}</td>
                          <td className="px-4 py-4">
                            <div className="flex gap-2">
                              {item.status === "pending" && (
                                <button onClick={() => updateDonationStatus(item.id, "accepted")} className="rounded px-2 py-1 text-xs bg-emerald-100 text-emerald-700 hover:bg-emerald-200">
                                  Accept
                                </button>
                              )}
                              {item.status === "accepted" && (
                                <button onClick={() => updateDonationStatus(item.id, "completed")} className="rounded px-2 py-1 text-xs bg-sky-100 text-sky-700 hover:bg-sky-200">
                                  Complete
                                </button>
                              )}
                              <button onClick={() => removeDonation(item.id)} className="rounded px-2 py-1 text-xs bg-red-100 text-red-700 hover:bg-red-200">
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/60">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-sm uppercase tracking-[0.35em] text-emerald-600">User summary</p>
                    <h2 className="mt-3 text-2xl font-semibold text-slate-900">Partner and donor network</h2>
                  </div>
                </div>
                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-[1.75rem] bg-slate-50 p-6">
                    <p className="text-3xl font-semibold text-slate-900">{totals.ngos}</p>
                    <p className="mt-2 text-sm text-slate-600">Active NGO partners</p>
                  </div>
                  <div className="rounded-[1.75rem] bg-slate-50 p-6">
                    <p className="text-3xl font-semibold text-slate-900">{totals.donors}</p>
                    <p className="mt-2 text-sm text-slate-600">Registered donors</p>
                  </div>
                </div>
                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-[1.75rem] bg-slate-50 p-6">
                    <p className="text-2xl font-semibold text-slate-900">{Math.round((totals.accepted / Math.max(totals.totalDonations, 1)) * 100)}%</p>
                    <p className="mt-2 text-sm text-slate-600">Acceptance rate</p>
                  </div>
                  <div className="rounded-[1.75rem] bg-slate-50 p-6">
                    <p className="text-2xl font-semibold text-slate-900">{Math.round((totals.completed / Math.max(totals.totalDonations, 1)) * 100)}%</p>
                    <p className="mt-2 text-sm text-slate-600">Completion rate</p>
                  </div>
                </div>
              </div>

              <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/60">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-sm uppercase tracking-[0.35em] text-emerald-600">User management</p>
                    <h2 className="mt-3 text-2xl font-semibold text-slate-900">All users</h2>
                  </div>
                  <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">{users.length} total users</span>
                </div>
                <div className="mt-8 overflow-x-auto">
                  <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
                    <thead className="border-b border-slate-200 text-slate-500">
                      <tr>
                        <th className="px-4 py-3">Name</th>
                        <th className="px-4 py-3">Email</th>
                        <th className="px-4 py-3">Role</th>
                        <th className="px-4 py-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {users.map((user) => (
                        <tr key={user.id} className="transition hover:bg-slate-50">
                          <td className="px-4 py-4 font-medium text-slate-900">{user.name}</td>
                          <td className="px-4 py-4 text-slate-600">{user.email}</td>
                          <td className="px-4 py-4 text-slate-600 capitalize">{user.role}</td>
                          <td className="px-4 py-4">
                            <button onClick={() => removeUser(user.id)} className="rounded px-2 py-1 text-xs bg-red-100 text-red-700 hover:bg-red-200">
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <aside className="space-y-6">
              <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/60">
                <p className="text-sm uppercase tracking-[0.35em] text-emerald-600">Insights</p>
                <h2 className="mt-3 text-2xl font-semibold text-slate-900">Platform health</h2>
                <p className="mt-4 text-slate-600">Stay informed with the most important metrics for donor activity and NGO response.</p>
                <div className="mt-8 grid gap-4">
                  <div className="rounded-[1.75rem] bg-slate-50 p-5">
                    <p className="text-lg font-semibold text-slate-900">Fast response</p>
                    <p className="mt-2 text-sm text-slate-600">Most donation requests are reviewed within a few hours.</p>
                  </div>
                  <div className="rounded-[1.75rem] bg-slate-50 p-5">
                    <p className="text-lg font-semibold text-slate-900">Trusted network</p>
                    <p className="mt-2 text-sm text-slate-600">Partner growth is rising as more NGOs join the platform.</p>
                  </div>
                </div>
              </div>

              <div className="rounded-[2rem] border border-slate-200 bg-[#f8fafc] p-8 shadow-xl shadow-slate-200/60">
                <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Admin actions</p>
                <h2 className="mt-3 text-2xl font-semibold text-slate-900">Next steps for the team</h2>
                <ul className="mt-6 space-y-4 text-sm text-slate-600">
                  <li className="flex gap-3">
                    <span className="mt-1 inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
                    Verify new NGO profiles and update any missing documents.
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-1 inline-flex h-2.5 w-2.5 rounded-full bg-sky-500" />
                    Review recent pending donations and confirm pickups.
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-1 inline-flex h-2.5 w-2.5 rounded-full bg-violet-500" />
                    Share performance highlights with the operations team.
                  </li>
                </ul>
              </div>
            </aside>
          </div>
        )}
      </section>
    </main>
  );
}
