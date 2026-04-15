"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { registerUser } from "@/app/lib/api";
import type { UserRole } from "@/app/lib/types";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<UserRole>("donor");
  const [phone, setPhone] = useState("");
  const [organizationType, setOrganizationType] = useState("");
  const [address, setAddress] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      await registerUser({ name, email, password, role, phone, organizationType: role === "ngo" ? organizationType : undefined, address: role === "ngo" ? address : undefined });
      router.push("/login");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to register");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="flex min-h-screen items-center justify-center px-6 py-8 sm:px-12">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div className="space-y-6">
            <div className="text-center">
              <span className="inline-flex bg-emerald-300/15 px-4 py-1.5 text-sm font-semibold uppercase tracking-[0.35em] text-emerald-600 ring-1 ring-emerald-200/20">
                Create account
              </span>
              <h1 className="mt-6 text-3xl font-semibold tracking-tight">Join FoodBridge</h1>
              <p className="mt-2 text-base text-slate-600">Choose your role and start making a difference today.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="space-y-2 text-sm font-medium text-slate-700">
                  Full name or organization
                  <input
                    type="text"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    required
                    className="mt-2 block w-full  border border-slate-200 bg-slate-50 px-4 py-3 text-base text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  />
                </label>
                <label className="space-y-2 text-sm font-medium text-slate-700">
                  Email address
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                    className="mt-2 block w-full  border border-slate-200 bg-slate-50 px-4 py-3 text-base text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  />
                </label>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="space-y-2 text-sm font-medium text-slate-700">
                  Password
                  <input
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                    minLength={6}
                    className="mt-2 block w-full  border border-slate-200 bg-slate-50 px-4 py-3 text-base text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  />
                </label>
                <label className="space-y-2 text-sm font-medium text-slate-700">
                  Confirm password
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    required
                    className="mt-2 block w-full  border border-slate-200 bg-slate-50 px-4 py-3 text-base text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  />
                </label>
              </div>
              <div className="space-y-3  border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-700">Select your role</p>
                <div className="flex flex-wrap gap-3">
                  {(["donor", "ngo"] as UserRole[]).map((option) => (
                    <button
                      type="button"
                      key={option}
                      onClick={() => setRole(option)}
                      className={` px-6 py-3 text-sm font-semibold transition ${role === option ? "bg-emerald-600 text-white shadow-lg shadow-emerald-500/20" : "bg-white text-slate-700 border border-slate-200 hover:border-slate-300"}`}
                    >
                      {option === "donor" ? "Donor" : "NGO"}
                    </button>
                  ))}
                </div>
              </div>
              <label className="space-y-2 text-sm font-medium text-slate-700">
                Phone number
                <input
                  type="tel"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  className="mt-2 block w-full  border border-slate-200 bg-slate-50 px-4 py-3 text-base text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />
              </label>
              {role === "ngo" ? (
                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="space-y-2 text-sm font-medium text-slate-700">
                    Organization type
                    <input
                      type="text"
                      value={organizationType}
                      onChange={(event) => setOrganizationType(event.target.value)}
                      className="mt-2 block w-full  border border-slate-200 bg-slate-50 px-4 py-3 text-base text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                    />
                  </label>
                  <label className="space-y-2 text-sm font-medium text-slate-700">
                    Organization address
                    <input
                      type="text"
                      value={address}
                      onChange={(event) => setAddress(event.target.value)}
                      className="mt-2 block w-full  border border-slate-200 bg-slate-50 px-4 py-3 text-base text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                    />
                  </label>
                </div>
              ) : null}
              {error ? <p className=" bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-400"
              >
                {loading ? "Creating account..." : "Create account"}
              </button>
            </form>
          </div>

          <p className="mt-8 text-center text-sm text-slate-600">
            Already have an account?{" "}
            <a href="/login" className="font-semibold text-slate-900 underline hover:text-slate-700">
              Sign in
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
