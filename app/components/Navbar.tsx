"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { List, X } from "phosphor-react";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/donor", label: "Donate" },
  { href: "/pickup", label: "Pickup" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur-xl shadow-lg">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 sm:px-10">
        <Link href="/" className="flex items-center gap-3 text-2xl font-semibold tracking-tight text-slate-900">
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-3xl bg-emerald-700 text-lg font-bold text-white">F</span>
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
          <Link href="/login" className=" border border-slate-300 bg-white px-5 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400">
            Login
          </Link>
          <Link href="/register" className=" bg-emerald-700 px-5 py-2 text-sm font-semibold text-gray-100 transition hover:bg-emerald-800">
            Donate Now
          </Link>
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
                  className={`rounded-2xl px-4 py-3 text-sm font-medium transition ${isActive ? "bg-emerald-50 text-emerald-700" : "text-slate-700 hover:bg-slate-100"}`}
                >
                  {item.label}
                </Link>
              );
            })}
            <Link href="/login" className="rounded-2xl px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100" onClick={() => setMenuOpen(false)}>
              Login
            </Link>
            <Link href="/register" className="rounded-2xl bg-emerald-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800" onClick={() => setMenuOpen(false)}>
              Donate Now
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
