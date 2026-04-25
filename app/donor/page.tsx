"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, X, Pencil, Trash, Plus, Clock, CheckCircle, XCircle, User, Bell, MagnifyingGlass, Funnel, Download, Calendar, MapPin } from "phosphor-react";
import { createDonation, fetchDonations, fetchStats, fetchUsers, updateDonation, deleteDonation, updateUser } from "@/app/lib/api";
import type { Donation, User as UserType, DonationStatus } from "@/app/lib/types";

function formatDate(dateString: string) {
  return new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short" }).format(new Date(dateString));
}

export default function DonorDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<UserType | null>(null);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [stats, setStats] = useState({ totalDonations: 0, pendingDonations: 0, acceptedDonations: 0, completedDonations: 0 });
  const [form, setForm] = useState({ foodType: "Prepared Food", quantity: 1, unit: "kg", pickupLocation: "", availability: "", notes: "", ngoId: "" });
  const [editingDonation, setEditingDonation] = useState<Donation | null>(null);
  const [profileForm, setProfileForm] = useState({ name: "", email: "", phone: "" });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [ngos, setNgos] = useState<UserType[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("foodbridge_session");
    if (!stored) {
      router.push("/login");
      return;
    }
    const currentUser = JSON.parse(stored) as UserType;
    if (currentUser.role !== "donor") {
      router.push("/");
      return;
    }
    setUser(currentUser);
    setProfileForm({ name: currentUser.name, email: currentUser.email, phone: currentUser.phone || "" });

    // Check for edit parameter
    const urlParams = new URLSearchParams(window.location.search);
    const editId = urlParams.get('edit');
    if (editId) {
      // Load donations and find the one to edit
      async function loadDonationToEdit() {
        try {
          const donationResponse = await fetchDonations({ donorId: currentUser.id });
          const donationToEdit = donationResponse.donations.find(d => d.id === editId);
          if (donationToEdit) {
            startEdit(donationToEdit);
            // Clean up URL
            window.history.replaceState({}, '', '/donor');
          }
        } catch (err) {
          console.error("Failed to load donation for editing:", err);
        }
      }
      loadDonationToEdit();
    }
  }, [router]);

  useEffect(() => {
    if (!user) return;
    const currentUser = user;

    async function load() {
      setLoading(true);
      try {
        const [donationResponse, statsResponse, ngosResponse] = await Promise.all([
          fetchDonations({ donorId: currentUser.id }),
          fetchStats(currentUser.id, currentUser.role),
          fetchUsers()
        ]);
        setDonations(donationResponse.donations);
        setStats(statsResponse);
        setNgos(ngosResponse.users.filter(u => u.role === 'ngo'));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to load donor data");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [user]);

  async function submitDonation() {
    if (!user) return;
    if (!form.foodType || !form.quantity || !form.pickupLocation || !form.availability || !form.ngoId) {
      setError("Please fill in all required fields, including selecting an NGO.");
      return;
    }
    setError(null);
    setSuccess(null);
    setLoading(true);
    try {
      await createDonation({
        donorId: user.id,
        ngoId: form.ngoId,
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
      setForm({ foodType: "Prepared Food", quantity: 1, unit: "kg", pickupLocation: "", availability: "", notes: "", ngoId: "" });
      setSuccess("Donation submitted successfully!");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to submit donation");
    } finally {
      setLoading(false);
    }
  }

  async function updateDonationStatus(donationId: string, status: DonationStatus) {
    if (!user) return;
    setError(null);
    setSuccess(null);
    setLoading(true);
    try {
      await updateDonation(donationId, { status });
      const donationResponse = await fetchDonations({ donorId: user.id });
      const statsResponse = await fetchStats(user.id, user.role);
      setDonations(donationResponse.donations);
      setStats(statsResponse);
      setSuccess(`Donation status updated to ${status}!`);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update donation");
    } finally {
      setLoading(false);
    }
  }

  async function deleteUserDonation(donationId: string) {
    if (!user || !confirm("Are you sure you want to delete this donation?")) return;
    setError(null);
    setSuccess(null);
    setLoading(true);
    try {
      await deleteDonation(donationId);
      const donationResponse = await fetchDonations({ donorId: user.id });
      const statsResponse = await fetchStats(user.id, user.role);
      setDonations(donationResponse.donations);
      setStats(statsResponse);
      setSuccess("Donation deleted successfully!");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to delete donation");
    } finally {
      setLoading(false);
    }
  }

  function startEdit(donation: Donation) {
    setEditingDonation(donation);
    setForm({
      foodType: donation.foodType,
      quantity: donation.quantity,
      unit: donation.unit,
      pickupLocation: donation.pickupLocation,
      availability: donation.availability,
      notes: donation.notes || "",
      ngoId: donation.ngoId || "",
    });
  }

  async function saveEdit() {
    if (!editingDonation || !user) return;
    if (!form.foodType || !form.quantity || !form.pickupLocation || !form.availability || !form.ngoId) {
      setError("Please fill in all required fields, including selecting an NGO.");
      return;
    }
    setError(null);
    setSuccess(null);
    setLoading(true);
    try {
      await updateDonation(editingDonation.id, {
        foodType: form.foodType,
        quantity: Number(form.quantity),
        unit: form.unit,
        pickupLocation: form.pickupLocation,
        availability: form.availability,
        notes: form.notes,
        ngoId: form.ngoId,
      });
      const donationResponse = await fetchDonations({ donorId: user.id });
      setDonations(donationResponse.donations);
      setEditingDonation(null);
      setForm({ foodType: "Prepared Food", quantity: 1, unit: "kg", pickupLocation: "", availability: "", notes: "", ngoId: "" });
      setSuccess("Donation updated successfully!");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update donation");
    } finally {
      setLoading(false);
    }
  }

  async function updateProfile() {
    if (!user) return;
    setError(null);
    setSuccess(null);
    setLoading(true);
    try {
      const response = await updateUser(user.id, profileForm);
      setUser(response.user);
      localStorage.setItem("foodbridge_session", JSON.stringify(response.user));
      setSuccess("Profile updated successfully!");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update profile");
    } finally {
      setLoading(false);
    }
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
            <div className="flex items-center gap-2  bg-red-500 px-4 py-2 text-white shadow-lg">
              <X size={20} />
              {error}
            </div>
          )}
          {success && (
            <div className="flex items-center gap-2  bg-emerald-500 px-4 py-2 text-white shadow-lg">
              <Check size={20} />
              {success}
            </div>
          )}
        </div>
      )}

      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className=" bg-white p-6 shadow-lg">
            <h3 className="text-lg font-semibold">Confirm Logout</h3>
            <p className="mt-2 text-sm text-slate-600">Are you sure you want to log out?</p>
            <div className="mt-4 flex gap-3">
              <button onClick={confirmLogout} className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600">Logout</button>
              <button onClick={() => setShowLogoutConfirm(false)} className="rounded bg-slate-200 px-4 py-2 hover:bg-slate-300">Cancel</button>
            </div>
          </div>
        </div>
      )}

     

      <section className="relative overflow-hidden bg-slate-950">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=1800&q=80')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-slate-950/85" />
        <div className="relative mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
          <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div className="max-w-3xl space-y-6">
              <span className="inline-flex rounded-full bg-emerald-300/15 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-emerald-200 ring-1 ring-emerald-200/20">
                Donor dashboard
              </span>
              <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl lg:text-4xl">
                Welcome back, {user?.name}.
              </h1>
              <p className="max-w-2xl text-sm leading-7 text-slate-200 sm:text-base">
                Track your impact, submit new donations, and manage pickups—all from one streamlined dashboard designed for food donors like you.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <button onClick={() => document.getElementById('donation-form')?.scrollIntoView({ behavior: 'smooth' })} className="inline-flex items-center justify-center bg-emerald-500 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-400">
                  <Plus size={16} className="mr-2" />
                  Submit donation
                </button>
                <button onClick={() => router.push('/donor/donations')} className="inline-flex items-center justify-center border border-white/20 bg-white/10 px-6 py-2.5 text-sm font-semibold text-gray-300 transition hover:border-white hover:bg-white/15">
                  View all donations
                </button>
               
              </div>
            </div>

            <div className="grid gap-4 border border-white/10 bg-white/10 p-4 shadow-2xl shadow-slate-950/30 backdrop-blur-xl lg:p-5">
              <div className="bg-slate-950/90 p-4">
                <p className="text-xs uppercase tracking-[0.35em] text-emerald-300">Your impact</p>
                <h3 className="mt-3 text-2xl font-semibold text-white">Donation summary</h3>
                <p className="mt-2 text-sm leading-6 text-slate-200/80">
                  Total donations, pending requests, and completed handoffs at a glance.
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="bg-white/10 p-4">
                  <p className="text-2xl font-semibold text-white">{stats.totalDonations}</p>
                  <p className="mt-1 text-xs text-slate-200/80">Total donations made.</p>
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
                <Plus size={20} className="text-white" />
                <p className="text-xs text-slate-300">Total donations</p>
              </div>
              <p className="mt-2 text-2xl font-semibold text-white">{stats.totalDonations}</p>
            </div>
            <div className="border border-white/10 bg-white/10 p-4 shadow-[0_25px_50px_-30px_rgba(15,23,42,0.9)] backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <Clock size={20} className="text-white" />
                <p className="text-xs text-slate-300">Pending</p>
              </div>
              <p className="mt-2 text-2xl font-semibold text-white">{stats.pendingDonations}</p>
            </div>
            <div className="border border-white/10 bg-white/10 p-4 shadow-[0_25px_50px_-30px_rgba(15,23,42,0.9)] backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <CheckCircle size={20} className="text-white" />
                <p className="text-xs text-slate-300">Accepted</p>
              </div>
              <p className="mt-2 text-2xl font-semibold text-white">{stats.acceptedDonations}</p>
            </div>
            <div className="border border-white/10 bg-white/10 p-4 shadow-[0_25px_50px_-30px_rgba(15,23,42,0.9)] backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <Check size={20} className="text-white" />
                <p className="text-xs text-slate-300">Completed</p>
              </div>
              <p className="mt-2 text-2xl font-semibold text-white">{stats.completedDonations}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-14">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
            <div className="space-y-4">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-emerald-600">Donation overview</p>
              <h2 className="text-2xl font-semibold text-slate-900 sm:text-3xl">
                Submit donations and track their progress.
              </h2>
              <p className="max-w-xl text-sm leading-7 text-slate-600">
                Fill out the form to donate food, view your donation history, and manage pickups with ease.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="border border-slate-200 bg-slate-50 p-5 shadow-sm">
                <p className="text-sm uppercase tracking-[0.35em] text-emerald-600">Step 1</p>
                <p className="mt-3 text-base font-semibold text-slate-900">Submit donation</p>
              </div>
              <div className="border border-slate-200 bg-slate-50 p-5 shadow-sm">
                <p className="text-sm uppercase tracking-[0.35em] text-emerald-600">Step 2</p>
                <p className="mt-3 text-sm font-semibold text-slate-900">NGO acceptance</p>
              </div>
              <div className="border border-slate-200 bg-slate-50 p-5 shadow-sm">
                <p className="text-sm uppercase tracking-[0.35em] text-emerald-600">Step 3</p>
                <p className="mt-3 text-base font-semibold text-slate-900">Pickup completed</p>
              </div>
            </div>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            <div className="border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-lg font-semibold text-slate-900">{stats.totalDonations}</p>
              <p className="mt-2 text-sm text-slate-600">Total donations submitted.</p>
            </div>
            <div className="border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-lg font-semibold text-slate-900">{stats.completedDonations}</p>
              <p className="mt-2 text-sm text-slate-600">Successfully picked up.</p>
            </div>
            <div className="border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-lg font-semibold text-slate-900">3x</p>
              <p className="mt-2 text-sm text-slate-600">More impact through coordinated donations.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-950 py-12 text-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
            <div id="donation-form" className="space-y-4">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-emerald-300">{editingDonation ? "Edit donation" : "Submit donation"}</p>
              <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                {editingDonation ? "Update your donation" : "Ready to make a donation?"}
              </h2>
              <p className="max-w-xl text-sm leading-7 text-slate-300/90">
                {editingDonation ? "Modify the details of your donation." : "Fill out the form below to submit your food donation details and connect with local NGOs."}
              </p>
              <div className="mt-8 grid gap-6 sm:grid-cols-2">
                <label className="space-y-3 text-sm font-medium text-slate-300">
                  Food type *
                  <select value={form.foodType} onChange={(event) => setForm((prev) => ({ ...prev, foodType: event.target.value }))} className="mt-2 block w-full  border border-slate-600 bg-slate-800 px-4 py-3 text-base text-white outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition">
                    <option>Prepared Food</option>
                    <option>Fresh Produce</option>
                    <option>Packaged Food</option>
                    <option>Baked Goods</option>
                    <option>Dairy</option>
                    <option>Other</option>
                  </select>
                </label>
                <label className="space-y-3 text-sm font-medium text-slate-300">
                  Select NGO *
                  <select value={form.ngoId} onChange={(event) => setForm((prev) => ({ ...prev, ngoId: event.target.value }))} className="mt-2 block w-full  border border-slate-600 bg-slate-800 px-4 py-3 text-base text-white outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition">
                    <option value="">Choose an NGO...</option>
                    {ngos.map((ngo) => (
                      <option key={ngo.id} value={ngo.id}>
                        {ngo.name} {ngo.organizationType ? `(${ngo.organizationType})` : ''}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="space-y-3 text-sm font-medium text-slate-300">
                  Quantity *
                  <input type="number" value={form.quantity} onChange={(event) => setForm((prev) => ({ ...prev, quantity: Number(event.target.value) }))} className="mt-2 block w-full  border border-slate-600 bg-slate-800 px-4 py-3 text-base text-white outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition" />
                </label>
                <label className="space-y-3 text-sm font-medium text-slate-300">
                  Unit
                  <select value={form.unit} onChange={(event) => setForm((prev) => ({ ...prev, unit: event.target.value }))} className="mt-2 block w-full  border border-slate-600 bg-slate-800 px-4 py-3 text-base text-white outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition">
                    <option>kg</option>
                    <option>lbs</option>
                    <option>servings</option>
                    <option>items</option>
                  </select>
                </label>
                <label className="space-y-3 text-sm font-medium text-slate-300">
                  Pickup location *
                  <div className="relative">
                    <input type="text" value={form.pickupLocation} onChange={(event) => setForm((prev) => ({ ...prev, pickupLocation: event.target.value }))} className="mt-2 block w-full  border border-slate-600 bg-slate-800 px-4 py-3 pr-10 text-base text-white outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition" placeholder="e.g., 123 Main St, City" />
                    <MapPin size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  </div>
                </label>
                <label className="space-y-3 text-sm font-medium text-slate-300">
                  Availability *
                  <div className="relative">
                    <input type="datetime-local" value={form.availability} onChange={(event) => setForm((prev) => ({ ...prev, availability: event.target.value }))} className="mt-2 block w-full  border border-slate-600 bg-slate-800 px-4 py-3 pr-10 text-base text-white outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition" />
                  </div>
                </label>
                <label className="space-y-3 text-sm font-medium text-slate-300 sm:col-span-2">
                  Notes
                  <textarea value={form.notes} onChange={(event) => setForm((prev) => ({ ...prev, notes: event.target.value }))} className="mt-2 block w-full  border border-slate-600 bg-slate-800 px-4 py-3 text-base text-white outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition" rows={3} placeholder="Any additional details..." />
                </label>
              </div>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <button onClick={editingDonation ? saveEdit : submitDonation} disabled={loading} className="inline-flex items-center justify-center bg-emerald-500 px-6 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:opacity-50">
                  {loading ? "Saving..." : editingDonation ? "Save changes" : "Submit donation"}
                </button>
                <button onClick={() => { setEditingDonation(null); setForm({ foodType: "Prepared Food", quantity: 1, unit: "kg", pickupLocation: "", availability: "", notes: "", ngoId: "" }); }} className="inline-flex items-center justify-center border border-slate-700 bg-slate-900/70 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800">
                  {editingDonation ? "Cancel edit" : "Clear form"}
                </button>
              </div>
            </div>

            <div className="border border-slate-800 bg-slate-900/80 p-6 shadow-[0_24px_60px_-30px_rgba(15,23,42,0.8)]">
              <p className="text-xs uppercase tracking-[0.35em] text-emerald-300">Recent donations</p>
              <h3 className="mt-3 text-xl font-semibold text-white">Your donation history</h3>
              <div className="mt-4 space-y-3 max-h-96 overflow-y-auto">
                {donations.slice(0, 5).map((donation) => (
                  <div key={donation.id} className=" bg-slate-800/50 p-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-white">{donation.foodType}</p>
                        <p className="text-xs text-slate-300">{donation.quantity} {donation.unit} · {formatDate(donation.createdAt)}</p>
                        <p className="text-xs text-slate-400 mt-1">{donation.pickupLocation}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${donation.status === 'completed' ? 'bg-emerald-500/20 text-emerald-300' : donation.status === 'accepted' ? 'bg-blue-500/20 text-blue-300' : 'bg-yellow-500/20 text-yellow-300'}`}>
                          {donation.status}
                        </span>
                        <div className="flex gap-1">
                          {donation.status !== 'completed' && (
                            <button onClick={() => updateDonationStatus(donation.id, 'completed')} className="p-1 text-emerald-400 hover:text-emerald-300" title="Mark as completed">
                              <Check size={14} />
                            </button>
                          )}
                          <button onClick={() => startEdit(donation)} className="p-1 text-blue-400 hover:text-blue-300" title="Edit donation">
                            <Pencil size={14} />
                          </button>
                          <button onClick={() => deleteUserDonation(donation.id)} className="p-1 text-red-400 hover:text-red-300" title="Delete donation">
                            <Trash size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {donations.length === 0 && <p className="text-sm text-slate-400">No donations yet.</p>}
              </div>
              <button onClick={() => router.push('/donor/donations')} className="mt-4 text-sm text-emerald-300 hover:text-emerald-200">View all donations →</button>
            </div>
          </div>
        </div>
      </section>

      {showProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="mx-4 w-full max-w-md  bg-white p-6 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <User size={24} className="text-slate-600" />
                <h2 className="text-xl font-semibold text-slate-900">Profile Settings</h2>
              </div>
              <button onClick={() => setShowProfile(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            <div className="space-y-6">
              <label className="block space-y-2">
                <span className="text-sm font-medium text-slate-700">Name</span>
                <input type="text" value={profileForm.name} onChange={(e) => setProfileForm(prev => ({ ...prev, name: e.target.value }))} className="block w-full  border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" />
              </label>
              <label className="block space-y-2">
                <span className="text-sm font-medium text-slate-700">Email</span>
                <input type="email" value={profileForm.email} onChange={(e) => setProfileForm(prev => ({ ...prev, email: e.target.value }))} className="block w-full  border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" />
              </label>
              <label className="block space-y-2">
                <span className="text-sm font-medium text-slate-700">Phone</span>
                <input type="tel" value={profileForm.phone} onChange={(e) => setProfileForm(prev => ({ ...prev, phone: e.target.value }))} className="block w-full  border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" />
              </label>
              <div className="flex gap-3">
                <button onClick={updateProfile} disabled={loading} className="flex-1  bg-emerald-500 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-600 disabled:opacity-50">
                  {loading ? "Updating..." : "Update Profile"}
                </button>
                <button onClick={() => setShowProfile(false)} className=" border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
