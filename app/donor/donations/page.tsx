"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, X, Pencil, Trash, Plus, Clock, CheckCircle, XCircle, User, Bell, MagnifyingGlass, Funnel, Download, Calendar, MapPin } from "phosphor-react";
import { fetchDonations, fetchStats, updateDonation, deleteDonation, updateUser } from "@/app/lib/api";
import type { Donation, User as UserType, DonationStatus } from "@/app/lib/types";

function formatDate(dateString: string) {
  return new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short" }).format(new Date(dateString));
}

export default function DonorDonations() {
  const router = useRouter();
  const [user, setUser] = useState<UserType | null>(null);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [stats, setStats] = useState({ totalDonations: 0, pendingDonations: 0, acceptedDonations: 0, completedDonations: 0 });
  const [editingDonation, setEditingDonation] = useState<Donation | null>(null);
  const [profileForm, setProfileForm] = useState({ name: "", email: "", phone: "" });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date");

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

  const filteredDonations = useMemo(() => {
    let filtered = donations.filter(donation =>
      donation.foodType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      donation.pickupLocation.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (statusFilter !== "all") {
      filtered = filtered.filter(donation => donation.status === statusFilter);
    }
    filtered.sort((a, b) => {
      if (sortBy === "date") {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else if (sortBy === "status") {
        return a.status.localeCompare(b.status);
      }
      return 0;
    });
    return filtered;
  }, [donations, searchTerm, statusFilter, sortBy]);

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
    router.push(`/donor?edit=${donation.id}`);
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

  function exportDonations() {
    const csv = [
      ["Food Type", "Quantity", "Unit", "Pickup Location", "Availability", "Status", "Created At"],
      ...filteredDonations.map(d => [
        d.foodType,
        d.quantity,
        d.unit,
        d.pickupLocation,
        d.availability,
        d.status,
        formatDate(d.createdAt)
      ])
    ].map(row => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "donations.csv";
    a.click();
    URL.revokeObjectURL(url);
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

      <section className="border-b border-slate-200 bg-white py-6">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <button onClick={() => router.push('/donor')} className="inline-flex items-center gap-2  bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200">
                ← Back to Dashboard
              </button>
            </div>
            <div className="flex items-center gap-4">
             
              <button onClick={() => setShowProfile(true)} className="inline-flex items-center gap-2  bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200">
                <User size={16} />
                Profile
              </button>
              <button onClick={exportDonations} className="inline-flex items-center gap-2  bg-emerald-500 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-600">
                <Download size={16} />
                Export CSV
              </button>
              {/* <button onClick={logout} className="inline-flex items-center gap-2  bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600">
                Logout
              </button> */}
            </div>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-1 gap-4">
              <div className="relative flex-1">
                <MagnifyingGlass size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="text" placeholder="Search donations..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full  border border-slate-200 bg-white pl-10 pr-4 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" />
              </div>
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className=" border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100">
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="accepted">Accepted</option>
                <option value="completed">Completed</option>
              </select>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className=" border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100">
                <option value="date">Sort by Date</option>
                <option value="status">Sort by Status</option>
              </select>
            </div>
          </div>
          <div className="space-y-4">
            {filteredDonations.map((donation) => (
              <div key={donation.id} className=" border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold text-slate-900">{donation.foodType}</h3>
                      <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${donation.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : donation.status === 'accepted' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {donation.status}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-slate-600">{donation.quantity} {donation.unit} · {formatDate(donation.createdAt)}</p>
                    <p className="mt-1 text-sm text-slate-600"><MapPin size={14} className="inline mr-1" />{donation.pickupLocation}</p>
                    <p className="mt-1 text-sm text-slate-600"><Calendar size={14} className="inline mr-1" />{donation.availability}</p>
                    {donation.notes && <p className="mt-2 text-sm text-slate-500">Notes: {donation.notes}</p>}
                  </div>
                  <div className="flex gap-2">
                    {donation.status !== 'completed' && (
                      <button onClick={() => updateDonationStatus(donation.id, 'completed')} className="inline-flex items-center gap-1 rounded bg-emerald-500 px-3 py-1 text-xs font-semibold text-white hover:bg-emerald-600">
                        <Check size={12} />
                        Complete
                      </button>
                    )}
                    <button onClick={() => startEdit(donation)} className="inline-flex items-center gap-1 rounded border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50">
                      <Pencil size={12} />
                      Edit
                    </button>
                    <button onClick={() => deleteUserDonation(donation.id)} className="inline-flex items-center gap-1 rounded border border-red-200 bg-red-50 px-3 py-1 text-xs font-semibold text-red-700 hover:bg-red-100">
                      <Trash size={12} />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {filteredDonations.length === 0 && <p className="text-center text-slate-500">No donations found.</p>}
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
            <form onSubmit={(e) => { e.preventDefault(); updateProfile(); }} className="space-y-4">
              <label className="block">
                <span className="text-sm font-medium text-slate-700">Name</span>
                <input type="text" value={profileForm.name} onChange={(e) => setProfileForm(prev => ({ ...prev, name: e.target.value }))} className="mt-1 block w-full  border border-slate-200 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-slate-700">Email</span>
                <input type="email" value={profileForm.email} onChange={(e) => setProfileForm(prev => ({ ...prev, email: e.target.value }))} className="mt-1 block w-full  border border-slate-200 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-slate-700">Phone</span>
                <input type="tel" value={profileForm.phone} onChange={(e) => setProfileForm(prev => ({ ...prev, phone: e.target.value }))} className="mt-1 block w-full  border border-slate-200 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" />
              </label>
              <div className="flex gap-3 pt-4">
                <button type="submit" disabled={loading} className="flex-1 rounded bg-emerald-500 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-600 disabled:opacity-50">
                  {loading ? "Saving..." : "Save Changes"}
                </button>
                <button type="button" onClick={() => setShowProfile(false)} className="flex-1 rounded border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}