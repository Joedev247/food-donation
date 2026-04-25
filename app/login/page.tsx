"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { login } from "@/app/lib/api";
import type { User } from "@/app/lib/types";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await login(email, password);
      const user = response.user as User;
      localStorage.setItem("foodbridge_session", JSON.stringify(user));
      localStorage.setItem("token", response.token);
      if (user.role === "ngo") {
        router.push("/ngo");
      } else if (user.role === "donor") {
        router.push("/donor");
      } else if (user.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to sign in");
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
              <span className="inline-flex  bg-emerald-300/15 px-4 py-1.5 text-sm font-semibold uppercase tracking-[0.35em] text-emerald-600 ring-1 ring-emerald-200/20">
                Sign in
              </span>
              <h1 className="mt-6 text-3xl font-semibold tracking-tight">Welcome back</h1>
              <p className="mt-2 text-base text-slate-600">Access your dashboard to continue making a difference.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700">Email address</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                  className="mt-3 block w-full border border-slate-200 bg-slate-50 px-4 py-3 text-base text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-700">Password</label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                  className="mt-3 block w-full border border-slate-200 bg-slate-50 px-4 py-3 text-base text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />
              </div>
              {error ? <p className=" bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}
              <button
                type="submit"
                disabled={loading}
                className="w-full  bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-400"
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>
            </form>
          </div>

          <p className="mt-8 text-center text-sm text-slate-600">
            Don’t have an account?{" "}
            <a href="/register" className="font-semibold text-slate-900 underline hover:text-slate-700">
              Create one
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
