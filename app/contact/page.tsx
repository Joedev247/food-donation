"use client";

import { FormEvent, useState } from "react";
import { Envelope, Phone, MapPin } from "phosphor-react";

export default function ContactPage() {
  const [status, setStatus] = useState<string | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("Your message has been sent. We will reply soon.");
  }

  const contactMethods = [
    {
      title: "Email support",
      description: "Get help with donations, pickups, or partnerships.",
      contact: "support@foodbridge.com",
      icon: <Envelope size={20} className="text-emerald-700" weight="duotone" />,
    },
    {
      title: "Phone assistance",
      description: "Speak directly with our team for urgent matters.",
      contact: "+1 (555) 123-4567",
      icon: <Phone size={20} className="text-emerald-700" weight="duotone" />,
    },
    {
      title: "Visit our office",
      description: "Located in the heart of the community.",
      contact: "123 Community Lane, Cityville, Country",
      icon: <MapPin size={20} className="text-emerald-700" weight="duotone" />,
    },
  ];

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <section className="relative overflow-hidden bg-cover bg-center py-16 text-white" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=800&fit=crop&crop=center')" }}>
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex rounded-full bg-emerald-300/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-emerald-200 ring-1 ring-emerald-200/20">
              Get in touch
            </span>
            <h1 className="mt-6 text-3xl font-semibold tracking-tight sm:text-4xl">
              Contact FoodBridge
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-slate-200">
              Questions about donations, NGO partnerships, or how to get involved? Our team is here to help you make a difference in your community.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a href="mailto:support@foodbridge.com" className="inline-flex items-center justify-center  bg-emerald-500 px-6 py-2 text-xs font-semibold text-white transition hover:bg-emerald-400">
                Email us
              </a>
              <a href="tel:+15551234567" className="inline-flex items-center justify-center border border-white/20 bg-white/10 px-6 py-2 text-xs font-semibold text-white transition hover:border-white hover:bg-white/15">
                Call now
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <div className="space-y-6">
            <div className="space-y-4">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-emerald-600">Contact methods</p>
              <h2 className="text-2xl font-semibold text-slate-900 sm:text-3xl">
                Multiple ways to reach us
              </h2>
              <p className="max-w-2xl text-sm leading-7 text-slate-600">
                Whether you're a donor with questions, an NGO looking to partner, or someone interested in our mission, we're here to support your food donation journey.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              {contactMethods.map((method) => (
                <div key={method.title} className="group overflow-hidden  border border-slate-200 bg-white p-6 shadow-[0_24px_80px_-40px_rgba(15,23,42,0.1)] transition hover:-translate-y-1 hover:shadow-[0_24px_90px_-40px_rgba(15,23,42,0.15)]">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center  bg-emerald-100 text-xl">
                      {method.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-slate-900">{method.title}</h3>
                      <p className="mt-1 text-sm text-slate-600">{method.description}</p>
                      <p className="mt-3 text-sm font-medium text-slate-900">{method.contact}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className=" border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60 lg:p-8">
            <div className="space-y-4">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-emerald-600">Send a message</p>
              <h2 className="text-2xl font-semibold text-slate-900 sm:text-3xl">Let's start a conversation</h2>
              <p className="text-sm text-slate-600">Fill out the form below and we'll get back to you within 24 hours.</p>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="text-xs font-medium text-slate-700">Full name</span>
                  <input required className="mt-2 w-full  border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" />
                </label>
                <label className="block">
                  <span className="text-xs font-medium text-slate-700">Email address</span>
                  <input type="email" required className="mt-2 w-full  border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" />
                </label>
              </div>
              <label className="block">
                <span className="text-xs font-medium text-slate-700">Subject</span>
                <input required className="mt-2 w-full  border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" />
              </label>
              <label className="block">
                <span className="text-xs font-medium text-slate-700">Message</span>
                <textarea required rows={4} className="mt-2 w-full  border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" />
              </label>
              {status ? <p className=" bg-emerald-50 px-3 py-2 text-xs text-emerald-700">{status}</p> : null}
              <button type="submit" className="inline-flex w-full items-center justify-center  bg-slate-900 px-6 py-2 text-xs font-semibold text-white transition hover:bg-slate-700">
                Send message
              </button>
            </form>
          </div>
        </div>
      </section>

      <section className="bg-slate-950 py-12 text-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div className="space-y-4">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-emerald-300">Support hours</p>
              <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                We're here when you need us
              </h2>
              <p className="max-w-2xl text-sm leading-6 text-slate-300/80">
                Our team is committed to supporting food donation efforts across communities. Reach out anytime during our operating hours.
              </p>
              <div className="mt-6 space-y-3">
                <div className="flex gap-3">
                  <span className="mt-1 inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                  <div>
                    <p className="text-sm font-semibold">Monday - Friday</p>
                    <p className="text-xs text-slate-300/80">9:00 AM - 6:00 PM EST</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="mt-1 inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                  <div>
                    <p className="text-sm font-semibold">Saturday</p>
                    <p className="text-xs text-slate-300/80">10:00 AM - 4:00 PM EST</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="mt-1 inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                  <div>
                    <p className="text-sm font-semibold">Sunday</p>
                    <p className="text-xs text-slate-300/80">Closed</p>
                  </div>
                </div>
              </div>
            </div>

            <div className=" border border-slate-800 bg-slate-900/80 p-6 shadow-[0_30px_60px_-30px_rgba(15,23,42,0.8)]">
              <p className="text-xs uppercase tracking-[0.35em] text-emerald-300">Quick response</p>
              <h3 className="mt-3 text-xl font-semibold">Average 4-hour response time</h3>
              <p className="mt-2 text-sm text-slate-100/90">We prioritize timely communication to keep donation processes moving smoothly for everyone involved.</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className=" bg-white/10 p-4">
                  <p className="text-xl font-semibold">95%</p>
                  <p className="mt-1 text-xs text-slate-100/80">Messages answered within 24 hours</p>
                </div>
                <div className=" bg-white/10 p-4">
                  <p className="text-xl font-semibold">24/7</p>
                  <p className="mt-1 text-xs text-slate-100/80">Emergency hotline for urgent food safety issues</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
