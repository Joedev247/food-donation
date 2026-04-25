"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { login, registerUser } from "@/app/lib/api";
import type { User } from "@/app/lib/types";

export default function AdminLoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!isLogin) {
      if (password !== confirmPassword) {
        setError("Passwords do not match");
        return;
      }
    }

    setLoading(true);
    try {
      if (isLogin) {
        const response = await login(email, password);
        const user = response.user as User;
        if (user.role !== "admin") {
          setError("Access denied. Admin privileges required.");
          return;
        }
        localStorage.setItem("foodbridge_session", JSON.stringify(user));
        localStorage.setItem("token", response.token);
        router.push("/admin");
      } else {
        await registerUser({
          name,
          email,
          password,
          role: "admin"
        });
        setIsLogin(true);
        setError("Admin account created successfully. Please log in.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to process request");
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
              <span className="inline-flex bg-red-300/15 px-4 py-1.5 text-sm font-semibold uppercase tracking-[0.35em] text-red-600 ring-1 ring-red-200/20">
                Admin {isLogin ? "Login" : "Signup"}
              </span>
              <h1 className="mt-6 text-3xl font-semibold tracking-tight">
                {isLogin ? "Admin Access" : "Create Admin Account"}
              </h1>
              <p className="mt-2 text-base text-slate-600">
                {isLogin
                  ? "Access the administrative dashboard to manage the platform."
                  : "Create a new administrator account for platform management."
                }
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {!isLogin && (
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-slate-700">Full name</label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    required
                    className="mt-3 block w-full border border-slate-200 bg-slate-50 px-4 py-3 text-base text-slate-900 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100"
                  />
                </div>
              )}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700">Email address</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                  className="mt-3 block w-full border border-slate-200 bg-slate-50 px-4 py-3 text-base text-slate-900 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100"
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
                  minLength={6}
                  className="mt-3 block w-full border border-slate-200 bg-slate-50 px-4 py-3 text-base text-slate-900 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100"
                />
              </div>
              {!isLogin && (
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700">Confirm password</label>
                  <input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    required
                    className="mt-3 block w-full border border-slate-200 bg-slate-50 px-4 py-3 text-base text-slate-900 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100"
                  />
                </div>
              )}
              {error ? <p className=" bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-red-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-red-400"
              >
                {loading ? (isLogin ? "Signing in..." : "Creating account...") : (isLogin ? "Sign in as Admin" : "Create Admin Account")}
              </button>
            </form>
          </div>

          <p className="mt-8 text-center text-sm text-slate-600">
            {isLogin ? "Need to create an admin account? " : "Already have an admin account? "}
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError(null);
                setName("");
                setConfirmPassword("");
              }}
              className="font-semibold text-red-600 underline hover:text-red-700"
            >
              {isLogin ? "Create one" : "Sign in"}
            </button>
          </p>
        </div>
      </div>
    </main>
  );
}