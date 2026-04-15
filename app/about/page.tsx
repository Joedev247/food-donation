'use client'
import Link from "next/link";
import { Handshake, CheckCircle, ChartBar, Lightning, TrendUp } from "phosphor-react";

const stats = [
  { value: "20M+", label: "Meals distributed" },
  { value: "15K+", label: "Active donors" },
  { value: "98%", label: "Pickup success rate" },
  { value: "500+", label: "Partner NGOs" },
];

const values = [
  {
    title: "Community-focused",
    description: "We build trust between donors, volunteers, and NGOs through transparent coordination.",
    icon: <Handshake size={28} className="text-emerald-500" weight="duotone" />,
  },
  {
    title: "Verified partners",
    description: "All NGOs and pickup requests are vetted to ensure safe, responsible delivery.",
    icon: <CheckCircle size={28} className="text-emerald-500" weight="duotone" />,
  },
  {
    title: "Impact tracking",
    description: "Every donation is measurable and traceable from donation to distribution.",
    icon: <ChartBar size={28} className="text-emerald-500" weight="duotone" />,
  },
];

const team = [
  {
    name: "Sarah Johnson",
    role: "Founder & CEO",
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Michael Chen",
    role: "Head of Operations",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Emma Rodriguez",
    role: "Community Manager",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&q=80",
  },
];

const milestones = [
  { year: "2024", event: "Platform launched with 50 partner NGOs" },
  { year: "2025", event: "Expanded to 10 cities, 10K+ donations processed" },
  { year: "2026", event: "AI-powered matching system implemented" },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <section className="relative overflow-hidden bg-slate-950 py-16 text-white sm:py-20">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1800&q=80')] bg-cover bg-center opacity-75" />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-550/30 via-slate-950/80 to-slate-950/90" />
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div className="space-y-6">
              <span className="inline-flex rounded-full bg-emerald-300/15 px-4 py-1.5 text-sm font-semibold uppercase tracking-[0.35em] text-emerald-200 ring-1 ring-emerald-200/20">
                About FoodBridge
              </span>
              <h1 className="max-w-3xl text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
                Connecting surplus food to communities in need.
              </h1>
              <p className="max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
                FoodBridge is a modern platform that reduces food waste by connecting donors with verified NGOs, ensuring every meal reaches someone who needs it through efficient pickup coordination.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Link href="/donor" className="inline-flex items-center justify-center  bg-emerald-500 px-8 py-3 text-sm font-semibold text-white transition hover:bg-emerald-400">
                  Start donating
                </Link>
                <Link href="/pickup" className="inline-flex items-center justify-center  border border-white/20 bg-white/10 px-8 py-3 text-sm font-semibold text-white transition hover:border-white hover:bg-white/15">
                  Learn about pickups
                </Link>
              </div>
            </div>

            <div className="grid gap-6">
              <div className="overflow-hidden  bg-gradient-to-br from-emerald-500 to-teal-600 shadow-2xl shadow-slate-900/20">
                <img
                  src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=80"
                  alt="Volunteers with food donations"
                  className="h-[280px] w-full object-cover"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="overflow-hidden bg-white shadow-lg">
                  <img
                    src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=800&q=80"
                    alt="Volunteer team"
                    className="h-40 w-full object-cover"
                  />
                </div>
                <div className="overflow-hidden bg-white shadow-lg">
                  <img
                    src="https://images.unsplash.com/photo-1498940305678-6b0d5b46b0f4?auto=format&fit=crop&w=800&q=80"
                    alt="Community support"
                    className="h-40 w-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <div className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-emerald-600">Our mission</p>
            <h2 className="text-2xl font-semibold text-slate-900 sm:text-3xl">
              Reducing food waste, one donation at a time.
            </h2>
            <p className="max-w-2xl text-sm leading-7 text-slate-600">
              We believe every meal has value. Our platform connects surplus food from donors to verified NGOs, ensuring safe distribution while building stronger communities.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-2 text-sm uppercase text-emerald-600">
                  <Lightning size={18} weight="fill" />
                  <span>Fast pickup</span>
                </div>
                <h3 className="mt-3 text-lg font-semibold text-slate-900">Instant NGO alerts</h3>
                <p className="mt-2 text-sm text-slate-600">Donations are shared with nearby NGOs so pickup can happen quickly and safely.</p>
              </div>
              <div className="border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-2 text-sm uppercase text-emerald-600">
                  <TrendUp size={18} weight="fill" />
                  <span>Clear impact</span>
                </div>
                <h3 className="mt-3 text-lg font-semibold text-slate-900">Track every donation</h3>
                <p className="mt-2 text-sm text-slate-600">Donors and NGOs can monitor status from request to delivery with one simple interface.</p>
              </div>
            </div>
          </div>

          <div className="grid gap-2 bg-slate-950 p-7
           text-white shadow-2xl shadow-slate-900/20">
            <div>
              <p className="text-sm font-semibold uppercase text-emerald-300">Our values</p>
              <h3 className="mt-2 text-xl font-semibold">Driven by trust, transparency, and community.</h3>
            </div>
            {values.map((item) => (
              <div key={item.title} className="border border-slate-800 bg-slate-900/95 p-5">
                <div className="flex items-start gap-3">
                  <span className="text-lg">{item.icon}</span>
                  <div>
                    <p className="text-sm font-semibold text-white">{item.title}</p>
                    <p className="mt-1 text-xs text-slate-300">{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-emerald-600">Our journey</p>
            <h2 className="mt-4 text-3xl font-semibold text-slate-900 sm:text-4xl">From idea to impact</h2>
            <p className="mt-4 text-base leading-8 text-slate-600">
              See how FoodBridge has grown from a small initiative to a nationwide platform connecting communities.
            </p>
          </div>

          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {milestones.map((milestone, index) => (
              <div key={milestone.year} className="group relative overflow-hidden  border border-slate-200 bg-slate-50 p-8 shadow-[0_24px_80px_-40px_rgba(15,23,42,0.1)] transition hover:-translate-y-1 hover:shadow-[0_24px_90px_-40px_rgba(15,23,42,0.15)]">
                <div className="absolute -top-4 -right-4 h-16 w-16 rounded-full bg-emerald-500/10" />
                <div className="relative">
                  <p className="text-2xl font-semibold text-emerald-600">{milestone.year}</p>
                  <p className="mt-4 text-slate-700">{milestone.event}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </main>
  );
}
