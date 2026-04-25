export default function PickupPage() {
  const steps = [
    {
      title: "Submit donation details",
      description: "Enter your pickup address, food type, quantity, and availability. The dashboard tracks every request in one place.",
    },
    {
      title: "Partner review & acceptance",
      description: "Local NGOs review the offer quickly and confirm pickup based on need, capacity, and food safety.",
    },
    {
      title: "Trusted handoff",
      description: "A scheduled pickup completes safely, with donation status updates for both donor and receiver.",
    },
  ];

  const highlights = [
    {
      title: "Verified community partners",
      description: "Only trusted NGOs with active food safety protocols receive pickup requests.",
    },
    {
      title: "Smart pickup coordination",
      description: "Automated scheduling and clear messaging keep every handoff on time.",
    },
    {
      title: "Transparent donation flow",
      description: "Donors and NGOs see progress from request to collection in a single dashboard.",
    },
  ];

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <section className="relative overflow-hidden bg-slate-950">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=1800&q=80')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-slate-950/85" />
        <div className="relative mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
          <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div className="max-w-3xl space-y-6">
              <span className="inline-flex rounded-full bg-emerald-300/15 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-emerald-200 ring-1 ring-emerald-200/20">
                Pickup made effortless
              </span>
              <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl lg:text-4xl">
                Fast, reliable pickup coordination for every food donation.
              </h1>
              <p className="max-w-2xl text-sm leading-7 text-slate-200 sm:text-base">
                Simplify donation handoffs with verified NGOs, flexible scheduling, and a real-time dashboard that keeps every pickup moving smoothly.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <a href="/donor" className="inline-flex items-center justify-center bg-emerald-500 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-400">
                  Start pickup request
                </a>
                <a href="/contact" className="inline-flex items-center justify-center border border-white/20 bg-white/10 px-6 py-2.5 text-sm font-semibold text-gray-300 transition hover:border-white hover:bg-white/15">
                  Learn how it works
                </a>
              </div>
            </div>

            <div className="grid gap-4  border border-white/10 bg-white/10 p-4 shadow-2xl shadow-slate-950/30 backdrop-blur-xl lg:p-5">
              <div className=" bg-slate-950/90 p-4">
                <p className="text-xs uppercase tracking-[0.35em] text-emerald-300">Pickup snapshot</p>
                <h3 className="mt-3 text-2xl font-semibold text-white">Donor request confirmed</h3>
                <p className="mt-2 text-sm leading-6 text-slate-200/80">
                  Pickup window, food type, and partner details are shared instantly.
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className=" bg-white/10 p-4">
                  <p className="text-2xl font-semibold text-white">6 min</p>
                  <p className="mt-1 text-xs text-slate-200/80">Average connection time to a verified NGO.</p>
                </div>
                <div className=" bg-white/10 p-4">
                  <p className="text-2xl font-semibold text-white">3x</p>
                  <p className="mt-1 text-xs text-slate-200/80">More donations routed when pickups are coordinated through our network.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-3 sm:gap-3">
            <div className=" border border-white/10 bg-white/10 p-4 shadow-[0_25px_50px_-30px_rgba(15,23,42,0.9)] backdrop-blur-sm">
              <p className="text-xl font-semibold text-white">24h+</p>
              <p className="mt-1 text-xs text-slate-300">Average quicker response from NGOs across active communities.</p>
            </div>
            <div className=" border border-white/10 bg-white/10 p-4 shadow-[0_25px_50px_-30px_rgba(15,23,42,0.9)] backdrop-blur-sm">
              <p className="text-xl font-semibold text-white">98%</p>
              <p className="mt-1 text-xs text-slate-300">Pickup success rate through guided logistics and verified handoffs.</p>
            </div>
            <div className=" border border-white/10 bg-white/10 p-4 shadow-[0_25px_50px_-30px_rgba(15,23,42,0.9)] backdrop-blur-sm">
              <p className="text-xl font-semibold text-white">Full visibility</p>
              <p className="mt-1 text-xs text-slate-300">Track every step from donor submission to NGO collection.</p>
            </div>
          </div>
        </div>
      </section>


      <section className="bg-white py-14">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
            <div className="space-y-4">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-emerald-600">Pickup overview</p>
              <h2 className="text-2xl font-semibold text-slate-900 sm:text-3xl">
                A streamlined pickup process for donors and NGOs.
              </h2>
              <p className="max-w-xl text-sm leading-7 text-slate-600">
                Submit one request, get matched with verified partners, and keep the handoff on track with clear pickup details.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className=" border border-slate-200 bg-slate-50 p-5 shadow-sm">
                <p className="text-sm uppercase tracking-[0.35em] text-emerald-600">Step 1</p>
                <p className="mt-3 text-base font-semibold text-slate-900">Submit donation</p>
              </div>
              <div className=" border border-slate-200 bg-slate-50 p-5 shadow-sm">
                <p className="text-sm uppercase tracking-[0.35em] text-emerald-600">Step 2</p>
                <p className="mt-3 text-sm font-semibold text-slate-900">Partner confirmation</p>
              </div>
              <div className=" border border-slate-200 bg-slate-50 p-5 shadow-sm">
                <p className="text-sm uppercase tracking-[0.35em] text-emerald-600">Step 3</p>
                <p className="mt-3 text-base font-semibold text-slate-900">Pickup completed</p>
              </div>
            </div>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            <div className=" border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-lg font-semibold text-slate-900">6 min</p>
              <p className="mt-2 text-sm text-slate-600">Avg response time to a new pickup request.</p>
            </div>
            <div className=" border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-lg font-semibold text-slate-900">98%</p>
              <p className="mt-2 text-sm text-slate-600">Successful pickups when requests are routed properly.</p>
            </div>
            <div className=" border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-lg font-semibold text-slate-900">3x</p>
              <p className="mt-2 text-sm text-slate-600">More donations routed when coordination is clear.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-950 py-12 text-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
            <div className="space-y-4">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-emerald-300">Schedule pickup</p>
              <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                Ready to book your next donation pickup?
              </h2>
              <p className="max-w-xl text-sm leading-7 text-slate-300/90">
                Use our lightweight pickup flow to submit details, match with a trusted partner, and keep everyone aligned with a simple request summary.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <a href="/donor-dashboard" className="inline-flex items-center justify-center  bg-emerald-500 px-6 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400">
                  Request pickup
                </a>
                <a href="/about" className="inline-flex items-center justify-center  border border-slate-700 bg-slate-900/70 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800">
                  View our impact
                </a>
              </div>
            </div>

            <div className=" border border-slate-800 bg-slate-900/80 p-6 shadow-[0_24px_60px_-30px_rgba(15,23,42,0.8)]">
              <p className="text-xs uppercase tracking-[0.35em] text-emerald-300">Why choose pickup</p>
              <h3 className="mt-3 text-xl font-semibold text-white">A faster handoff with fewer steps.</h3>
              <ul className="mt-4 space-y-3 text-sm text-slate-300">
                <li className="flex gap-3">
                  <span className="mt-1 inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  One page to capture all pickup details.
                </li>
                <li className="flex gap-3">
                  <span className="mt-1 inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  Matches only verified NGOs ready to receive donations.
                </li>
                <li className="flex gap-3">
                  <span className="mt-1 inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  See estimated pickup time without extra email chains.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
