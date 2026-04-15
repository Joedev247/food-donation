import Link from "next/link";

const stats = [
  { value: "20M", label: "Number of Supporters" },
  { value: "15K+", label: "Volunteers Worldwide" },
  { value: "98%", label: "Completed Projects" },
];

const campaigns = [
  {
    title: "Plant Trees, Save Earth & Lives",
    description: "Support sustainable food programs and environmental restoration.",
    amount: "$98,000",
    category: "Environment",
    image: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Emergency Response and School Food",
    description: "Deliver hot meals to children in urgent need during crises.",
    amount: "$82,000",
    category: "Education",
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "People That Need Clean Drinking Water",
    description: "Fund water distribution and hygiene support for families.",
    amount: "$62,000",
    category: "Health",
    image: "https://images.unsplash.com/photo-1507537297725-24a1c029d3ca?auto=format&fit=crop&w=900&q=80",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 ">
      <section className="relative overflow-hidden bg-slate-950 text-white">
        <video
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          poster="https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1800&q=80"
        >
          <source src="https://assets.mixkit.co/videos/preview/mixkit-healthy-food-preparation-6063-large.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="absolute inset-0 bg-slate-350/20" />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-350/55 via-slate-950/80 to-slate-950/90" />
        <div className="relative mx-auto max-w-7xl px-6 pt-20 pb-48 lg:px-8 lg:pt-24 lg:pb-56">
          <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
            <div className="space-y-8">
              <span className="inline-flex rounded-full bg-emerald-500/10 px-4 py-2 text-sm font-semibold uppercase tracking-[0.35em] text-emerald-200">
                Lend a helping hand
              </span>
              <h1 className="max-w-3xl text-5xl font-semibold leading-tight tracking-tight text-white sm:text-6xl">
                Bring fresh food to those in need
                <span className="block mt-4 text-xl font-medium text-emerald-200 sm:text-2xl">
                  Simple, safe, and sustained support for every donor, volunteer, and community partner.
                </span>
              </h1>
             
            </div>
            <div className="relative overflow-hidden  shadow-2xl shadow-slate-950/20">
              <img
                src="https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?auto=format&fit=crop&w=1200&q=80"
                alt="Food donation volunteers handing over meals"
                className="h-[280px] w-full object-cover sm:h-[340px]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <span className="inline-flex rounded-full bg-emerald-500/90 px-3 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-white">
                  Food Donation
                </span>
                <h2 className="mt-4 text-3xl font-semibold leading-tight sm:text-4xl">
                  Donate meals and transform lives
                </h2>
                <p className="mt-3 max-w-xl text-sm leading-7 text-slate-100/90">
                  Join our community to deliver fresh food to families, shelters, and schools across your city.
                </p>
              </div>
            </div>
          </div>

          <div className="absolute inset-x-0 bottom-[-3rem] flex justify-center px-6 pb-8 sm:px-8">
            <div className="w-full max-w-6xl  bg-white/95 p-6 shadow-[0_40px_80px_-40px_rgba(15,23,42,0.25)] ring-1 ring-slate-200/70 backdrop-blur-xl">
              <div className="grid gap-4 sm:grid-cols-3">
                {stats.map((stat) => (
                  <div key={stat.label} className="font-sans bg-slate-950 p-6 text-white shadow-xl shadow-slate-950/10">
                    <p className="text-3xl font-semibold">{stat.value}</p>
                    <p className="mt-3 text-sm uppercase tracking-normal text-slate-400">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 pt-24">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div className="relative">
              <div className="overflow-hidden bg-white shadow-2xl shadow-slate-200">
                <img
                  src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=80"
                  alt="Volunteers working together"
                  className="h-[350px] w-full object-cover"
                />
                
              </div>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="overflow-hidden bg-white shadow-2xl shadow-slate-200">
                  <img
                    src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=800&q=80"
                    alt="Volunteer team"
                    className="h-48 w-full object-cover"
                  />
                </div>
                <div className="overflow-hidden bg-white shadow-2xl shadow-slate-200">
                  <img
                    src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=800&q=80"
                    alt="Volunteers collaborating"        
                    className="h-48 w-full object-cover"
                  />
                </div>
              </div>
            </div>
            <div className="space-y-8">
              <div className="space-y-3">
                <p className="text-sm font-semibold uppercase tracking-[0.35em] text-emerald-600">About Us</p>
                <h2 className="max-w-2xl text-4xl font-semibold text-slate-950">
                  We’re Non-Profit Charity & NGO organization
                </h2>
                <p className="max-w-xl text-base leading-8 text-slate-600">
                  We support people in extreme need and work closely with communities to deliver sustainable relief, food, education, and healthcare.
                </p>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <span className="mt-1 inline-flex h-10 w-10 items-center justify-center rounded-3xl bg-emerald-100 text-emerald-700">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                      <path d="M9 11.5l2 2 4-4" />
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
                    </svg>
                  </span>
                  <div>
                    <p className="font-semibold text-slate-950">Support people in extreme need</p>
                    <p className="text-sm text-slate-600">Provide rapid access to food, shelter, and medical care.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <span className="mt-1 inline-flex h-10 w-10 items-center justify-center rounded-3xl bg-emerald-100 text-emerald-700">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                      <path d="M9 11.5l2 2 4-4" />
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
                    </svg>
                  </span>
                  <div>
                    <p className="font-semibold text-slate-950">Largest education community</p>
                    <p className="text-sm text-slate-600">Build skills and support networks across every region.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <span className="mt-1 inline-flex h-10 w-10 items-center justify-center rounded-3xl bg-emerald-100 text-emerald-700">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                      <path d="M9 11.5l2 2 4-4" />
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
                    </svg>
                  </span>
                  <div>
                    <p className="font-semibold text-slate-950">Make the world a better place</p>
                    <p className="text-sm text-slate-600">Create positive outcomes through donation, volunteer, and care.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <span className="mt-1 inline-flex h-10 w-10 items-center justify-center rounded-3xl bg-emerald-100 text-emerald-700">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                      <path d="M9 11.5l2 2 4-4" />
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
                    </svg>
                  </span>
                  <div>
                    <p className="font-semibold text-slate-950">Share your love for community</p>
                    <p className="text-sm text-slate-600">Join hands with other supporters and make a lasting impact.</p>
                  </div>
                </div>
              </div>
              <Link href="/about" className="inline-flex items-center bg-green-700 px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-green-300/40 transition hover:bg-green-800">
                About Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-50">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-emerald-600">Causes</p>
            <h2 className="mt-4 text-4xl font-semibold text-slate-950">You Can Help Lots of People by Donating Little</h2>
          </div>
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            <div className="overflow-hidden bg-white shadow-[0_20px_60px_-35px_rgba(15,23,42,0.25)]">
              <div className="relative h-64 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=900&q=80"
                  alt="Plant Tree campaign"
                  className="h-full w-full object-cover"
                />
                <span className="absolute left-4 top-4 inline-flex  bg-emerald-700 px-3 py-2 text-xs font-semibold uppercase text-white shadow-lg shadow-slate-950/15">
                  Environment
                </span>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-slate-950">Plant Tree, Save Earth & Lives Secure the Future</h3>
                <p className="mt-4 text-sm leading-7 text-slate-600">
                  Sustainable tree planting and food programs for healthier families and cleaner communities.
                </p>
                <div className="mt-6 flex items-center justify-between gap-4 text-sm text-slate-500">
                  <span className="font-semibold text-slate-950">Raised $98,000</span>
                  <span>Goal $120,000</span>
                </div>
                <button className="mt-6 w-full  bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800">
                  Donate Now
                </button>
              </div>
            </div>
            <div className="overflow-hidden bg-white shadow-[0_20px_60px_-35px_rgba(15,23,42,0.25)]">
              <div className="relative h-64 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=80"
                  alt="Emergency response campaign"
                  className="h-full w-full object-cover"
                />
                <span className="absolute left-4 top-4 inline-flex  bg-emerald-700 px-3 py-2 text-xs font-semibold uppercase text-white shadow-lg shadow-slate-950/15">
                  Emergency
                </span>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-slate-950">Emergency Response and School Food</h3>
                <p className="mt-4 text-sm leading-7 text-slate-600">
                  Hot meal support for children and families in crisis, delivered fast where it’s needed most.
                </p>
                <div className="mt-6 flex items-center justify-between gap-4 text-sm text-slate-500">
                  <span className="font-semibold text-slate-950">Raised $82,000</span>
                  <span>Goal $105,000</span>
                </div>
                <button className="mt-6 w-full  bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800">
                  Donate Now
                </button>
              </div>
            </div>
            <div className="overflow-hidden bg-white shadow-[0_20px_60px_-35px_rgba(15,23,42,0.25)]">
              <div className="relative h-64 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?auto=format&fit=crop&w=900&q=80"
                  alt="Clean water campaign"
                  className="h-full w-full object-cover"
                />
                <span className="absolute left-4 top-4 inline-flex  bg-emerald-700 px-3 py-2 text-xs font-semibold uppercase text-white shadow-lg shadow-slate-950/15">
                  Health
                </span>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-slate-950">People That Need Clean Drinking Water</h3>
                <p className="mt-4 text-sm leading-7 text-slate-600">
                  Clean water initiatives that protect families and support long-term health.
                </p>
                <div className="mt-6 flex items-center justify-between gap-4 text-sm text-slate-500">
                  <span className="font-semibold text-slate-950">Raised $81,000</span>
                  <span>Goal $115,000</span>
                </div>
                <button className="mt-6 w-full  bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800">
                  Donate Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-emerald-600">How it works</p>
            <h2 className="mt-4 text-4xl font-semibold text-slate-950">Food donation made easy and impactful</h2>
            <p className="mt-4 text-base leading-8 text-slate-600">
              Donate food, connect with NGOs, and support communities in three simple steps.
            </p>
          </div>
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            <div className="border border-slate-200 bg-slate-50 p-8 text-slate-950 shadow-sm">
              <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-emerald-100 text-emerald-700 text-xl font-semibold">1</div>
              <h3 className="mt-6 text-xl font-semibold">Submit Donation</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Share details about your food donation, including quantity, type, and pickup location.
              </p>
            </div>
            <div className="border border-slate-200 bg-slate-50 p-8 text-slate-950 shadow-sm">
              <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-emerald-100 text-emerald-700 text-xl font-semibold">2</div>
              <h3 className="mt-6 text-xl font-semibold">Connect with NGOs</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Verified NGOs review your donation and request pickup support from nearby volunteers.
              </p>
            </div>
            <div className="border border-slate-200 bg-slate-50 p-8 text-slate-950 shadow-sm">
              <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-emerald-100 text-emerald-700 text-xl font-semibold">3</div>
              <h3 className="mt-6 text-xl font-semibold">Deliver & Track</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Track the pickup and delivery status until the food reaches people who need it most.
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-slate-950 text-slate-100">
        <div className="mx-auto max-w-7xl px-6 py-5 lg:px-8">
          
          <div className="mt-12 border-t border-slate-800 pt-8 text-center text-sm text-slate-500">
            © 2026 FoodBridge. All rights reserved.
          </div>
        </div>
      </footer>
    </main>
  );
}
