"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createDonation, fetchDonations, fetchStats, updateDonation, deleteDonation } from "@/app/lib/api";
import type { Donation, User } from "@/app/lib/types";

function formatDate(dateString: string) {
  return new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short" }).format(new Date(dateString));
}

export default function DonorDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [stats, setStats] = useState({ totalDonations: 0, pendingDonations: 0, acceptedDonations: 0, completedDonations: 0 });
  const [form, setForm] = useState({ foodType: "Prepared Food", quantity: 1, unit: "kg", pickupLocation: "", availability: "", notes: "" });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("foodbridge_session");
    if (!stored) {
      router.push("/login");
      return;
    }
    const currentUser = JSON.parse(stored) as User;
    if (currentUser.role !== "donor") {
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
        const donationResponse = await fetchDonations({ donorId: currentUser.id });
        const statsResponse = await fetchStats(currentUser.id, currentUser.role);
        setDonations(donationResponse.donations);
        setStats(statsResponse);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to load donor data");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [user]);

  const summary = useMemo(
    () => [
      { label: "Total donations", value: stats.totalDonations, color: "bg-slate-900" },
      { label: "Pending", value: stats.pendingDonations, color: "bg-green-500" },
      { label: "Accepted", value: stats.acceptedDonations, color: "bg-emerald-600" },
      { label: "Completed", value: stats.completedDonations, color: "bg-sky-600" },
    ],
    [stats]
  );

  async function submitDonation() {
    if (!user) return;
    setError(null);
    setLoading(true);
    try {
      await createDonation({
        donorId: user.id,
        foodType: form.foodType,
        quantity: Number(form.quantity),
        unit: form.unit,
        pickupLocation: form.pickupLocation,
        availability: form.availability,
        notes: form.notes,
      });
      const donationResponse = await fetchDonations({ donorId: user.id });
      const statsResponse = await fetchStats(user.id, user.role);
      setDonations(donationResponse.donations);
      setStats(statsResponse);
      setForm({ foodType: "Prepared Food", quantity: 1, unit: "kg", pickupLocation: "", availability: "", notes: "" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to submit donation");
    } finally {
      setLoading(false);
    }
  }

  async function markCollected(donationId: string) {
    if (!user) return;
    setError(null);
    setLoading(true);
    try {
      await updateDonation(donationId, { status: "completed" });
      const donationResponse = await fetchDonations({ donorId: user.id });
      const statsResponse = await fetchStats(user.id, user.role);
      setDonations(donationResponse.donations);
      setStats(statsResponse);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update donation");
    } finally {
      setLoading(false);
    }
  }

  async function deleteUserDonation(donationId: string) {
    if (!user || !confirm("Are you sure you want to delete this donation?")) return;
    setError(null);
    setLoading(true);
    try {
      await deleteDonation(donationId);
      const donationResponse = await fetchDonations({ donorId: user.id });
      const statsResponse = await fetchStats(user.id, user.role);
      setDonations(donationResponse.donations);
      setStats(statsResponse);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to delete donation");
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    localStorage.removeItem("foodbridge_session");
    router.push("/login");
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <section className="relative overflow-hidden bg-slate-950 py-16 text-white sm:py-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(34,197,94,0.18),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(6,182,212,0.16),_transparent_20%)]" />
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div className="space-y-6">
              <span className="inline-flex rounded-full bg-emerald-300/15 px-4 py-1.5 text-sm font-semibold uppercase tracking-[0.35em] text-emerald-200 ring-1 ring-emerald-200/20">
                Donor dashboard
              </span>
              <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
                Welcome back, {user?.name}
              </h1>
              <p className="max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
                Track your impact, submit new donations, and manage pickups—all from one streamlined dashboard designed for food donors like you.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <button onClick={() => document.getElementById('donation-form')?.scrollIntoView({ behavior: 'smooth' })} className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-8 py-3 text-sm font-semibold text-white transition hover:bg-emerald-400">
                  Submit a donation
                </button>
                <button onClick={logout} className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/10 px-8 py-3 text-sm font-semibold text-white transition hover:border-white hover:bg-white/15">
                  Logout
                </button>
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-[0_25px_50px_-30px_rgba(15,23,42,0.9)] backdrop-blur-sm">
              <p className="text-sm uppercase tracking-[0.35em] text-emerald-300">Your impact</p>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl bg-white/10 p-5">
                  <p className="text-3xl font-semibold">{stats.totalDonations}</p>
                  <p className="mt-2 text-sm text-slate-100/80">Total donations made</p>
                </div>
                <div className="rounded-3xl bg-white/10 p-5">
                  <p className="text-3xl font-semibold">{stats.completedDonations}</p>
                  <p className="mt-2 text-sm text-slate-100/80">Successfully completed</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-12">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {summary.map((item) => (
                <div key={item.label} className="group overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_24px_80px_-40px_rgba(15,23,42,0.1)] transition hover:-translate-y-1 hover:shadow-[0_24px_90px_-40px_rgba(15,23,42,0.15)]">
                  <p className="text-sm font-medium text-slate-500">{item.label}</p>
                  <p className={`mt-4 text-4xl font-semibold text-slate-900 ${item.color}`}>{item.value}</p>
                </div>
              ))}
            </div>

            <div id="donation-form" className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/60">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-semibold text-slate-900">Submit a new donation</h2>
                  <p className="mt-2 text-base text-slate-600">Share food details and pickup info to connect with local NGOs.</p>
                </div>
                <span className="rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-700">Live API</span>
              </div>
              <div className="mt-8 grid gap-6 sm:grid-cols-2">
                <label className="space-y-3 text-sm font-medium text-slate-700">
                  Food type
                  <select value={form.foodType} onChange={(event) => setForm((prev) => ({ ...prev, foodType: event.target.value }))} className="mt-2 block w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-base outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition">
                    <option>Prepared Food</option>
                    <option>Fresh Produce</option>
                    <option>Packaged Food</option>
                    <option>Dairy Products</option>
                    <option>Bakery Items</option>
                    <option>Other</option>
                  </select>
                </label>
                <label className="space-y-3 text-sm font-medium text-slate-700">
                  Quantity
                  <input type="number" min={1} value={form.quantity} onChange={(event) => setForm((prev) => ({ ...prev, quantity: Number(event.target.value) }))} className="mt-2 block w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-base outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition" />
                </label>
                <label className="space-y-3 text-sm font-medium text-slate-700">
                  Unit
                  <select value={form.unit} onChange={(event) => setForm((prev) => ({ ...prev, unit: event.target.value }))} className="mt-2 block w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-base outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition">
                    <option>kg</option>
                    <option>pieces</option>
                    <option>plates</option>
                    <option>boxes</option>
                  </select>
                </label>
                <label className="space-y-3 text-sm font-medium text-slate-700">
                  Available until
                  <input type="datetime-local" value={form.availability} onChange={(event) => setForm((prev) => ({ ...prev, availability: event.target.value }))} className="mt-2 block w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-base outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition" />
                </label>
                <label className="space-y-3 text-sm font-medium text-slate-700 sm:col-span-2">
                  Pickup location
                  <input type="text" value={form.pickupLocation} onChange={(event) => setForm((prev) => ({ ...prev, pickupLocation: event.target.value }))} className="mt-2 block w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-base outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition" />
                </label>
                <label className="space-y-3 text-sm font-medium text-slate-700 sm:col-span-2">
                  Notes (optional)
                  <textarea value={form.notes} onChange={(event) => setForm((prev) => ({ ...prev, notes: event.target.value }))} className="mt-2 block w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-base outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition" rows={4} />
                </label>
              </div>
              {error ? <p className="mt-6 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}
              <button onClick={submitDonation} disabled={loading} className="mt-8 inline-flex items-center justify-center rounded-full bg-slate-900 px-8 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-400">
                {loading ? "Submitting..." : "Submit donation"}
              </button>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/60">
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-2xl font-semibold text-slate-900">My donations</h2>
                <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">{donations.length} records</span>
              </div>
              <div className="mt-8 space-y-6">
                {donations.length === 0 ? (
                  <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
                    <p className="text-base text-slate-600">No donations yet. Create one to begin sharing food.</p>
                  </div>
                ) : (
                  donations.map((donation) => (
                    <div key={donation.id} className="group overflow-hidden rounded-[1.75rem] border border-slate-200 bg-slate-50 p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.1)] transition hover:-translate-y-1 hover:shadow-[0_20px_70px_-40px_rgba(15,23,42,0.15)]">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <p className="text-lg font-semibold text-slate-900">{donation.foodType}</p>
                          <p className="text-sm text-slate-600">{donation.quantity} {donation.unit} · {formatDate(donation.createdAt)}</p>
                        </div>
                        <span className={`rounded-full px-3 py-1 text-sm font-semibold ${donation.status === "pending" ? "bg-green-100 text-green-700" : donation.status === "accepted" ? "bg-emerald-100 text-emerald-700" : "bg-sky-100 text-sky-700"}`}>{donation.status}</span>
                      </div>
                      <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
                        <p className="text-sm text-slate-600">Pickup: {donation.pickupLocation}</p>
                        <div className="flex gap-2">
                          {donation.status !== "completed" ? (
                            <button onClick={() => markCollected(donation.id)} className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700">
                              Mark completed
                            </button>
                          ) : null}
                          {donation.status === "pending" ? (
                            <button onClick={() => deleteUserDonation(donation.id)} className="rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700">
                              Delete
                            </button>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
