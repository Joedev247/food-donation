"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { List, X, User, SignOut } from "phosphor-react";
import type { User as UserType } from "@/app/lib/types";

const defaultNavItems = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/donor", label: "Donate" },
  { href: "/pickup", label: "Pickup" },
  { href: "/contact", label: "Contact" },
];

const ngoNavItems = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/ngo", label: "NGO Dashboard" },
];

const adminNavItems = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/admin", label: "Admin Dashboard" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<UserType | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);

  const navItems = user?.role === 'ngo' ? ngoNavItems : user?.role === 'admin' ? adminNavItems : defaultNavItems;

  useEffect(() => {
    const userData = localStorage.getItem('foodbridge_session');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('foodbridge_session');
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur-xl shadow-lg">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 sm:px-10">
        <Link href="/" className="flex items-center gap-3 text-2xl font-semibold tracking-tight text-slate-900">
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-emerald-700 text-lg font-bold text-white">FB</span>
          <span>FoodBridge</span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition ${isActive ? "text-emerald-700" : "text-slate-600 hover:text-emerald-700"}`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <div className="relative">
              <button onClick={() => setProfileOpen(!profileOpen)} className="flex items-center gap-2 border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400">
                <User size={16} />
                {user.name || user.email}
              </button>
              {profileOpen && (
                <div className="absolute right-0 top-full mt-2 w-48  border border-slate-200 bg-white p-1 shadow-lg">
                  <button onClick={() => { handleLogout(); setProfileOpen(false); }} className="flex w-full items-center gap-2 px-3 py-1 text-sm text-red-700 hover:bg-red-100">
                    <SignOut size={16} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link href="/login" className=" border border-slate-300 bg-white px-5 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400">
                Login
              </Link>
              <Link href="/register" className=" bg-emerald-700 px-5 py-2 text-sm font-semibold text-gray-100 transition hover:bg-emerald-800">
                Donate Now
              </Link>
              {/* <Link href="/admin-login" className=" border border-red-300 bg-white px-5 py-2 text-sm font-semibold text-red-700 transition hover:border-red-400">
                Admin
              </Link> */}
            </>
          )}
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white p-3 text-slate-700 transition hover:border-slate-400 md:hidden"
          onClick={() => setMenuOpen((state) => !state)}
          aria-label="Toggle navigation menu"
        >
          {menuOpen ? <X size={20} weight="bold" /> : <List size={20} weight="bold" />}
        </button>
      </div>

      {menuOpen ? (
        <div className="border-t border-slate-200 bg-white px-6 py-5 md:hidden">
          <div className="flex flex-col gap-3">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className={` px-4 py-3 text-sm font-medium transition ${isActive ? "bg-emerald-50 text-emerald-700" : "text-slate-700 hover:bg-slate-100"}`}
                >
                  {item.label}
                </Link>
              );
            })}
            {user ? (
              <div className="flex items-center gap-2  px-4 py-3 text-sm font-semibold text-slate-700">
                <User size={16} />
                {user.name || user.email}
              </div>
            ) : (
              <Link href="/login" className=" px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100" onClick={() => setMenuOpen(false)}>
                Login
              </Link>
            )}
            {user ? (
              <button onClick={() => { handleLogout(); setMenuOpen(false); }} className=" px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100">
                Logout
              </button>
            ) : (
              <>
                <Link href="/register" className=" bg-emerald-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800" onClick={() => setMenuOpen(false)}>
                  Donate Now
                </Link>
                <Link href="/admin-login" className=" px-4 py-3 text-sm font-semibold text-red-700 transition hover:bg-red-100" onClick={() => setMenuOpen(false)}>
                  Admin Login
                </Link>
              </>
            )}
          </div>
        </div>
      ) : null}
    </header>
  );
}
