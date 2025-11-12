import { useState } from "react";
import { Link } from "react-router-dom";

export default function LionsClubPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    involvement: [],
    message: "",
    honeypot: "", // spam trap
  });
  const [status, setStatus] = useState({ state: "idle", msg: "" });

  const involvementOptions = [
    { key: "trail_cleanups", label: "Trail cleanups" },
    { key: "leadership", label: "Leadership & organizing" },
    { key: "safety_training", label: "Safety & recovery training" },
    { key: "events", label: "Event day volunteer" },
    { key: "sponsors", label: "Sponsorships & outreach" },
    { key: "involved", label: "Member involvement" },
  ];

  const toggleInvolvement = (key) => {
    setForm((f) => {
      const has = f.involvement.includes(key);
      return {
        ...f,
        involvement: has ? f.involvement.filter((k) => k !== key) : [...f.involvement, key],
      };
    });
  };

  async function onSubmit(e) {
    e.preventDefault();
    if (form.honeypot) return; // bot
    setStatus({ state: "submitting", msg: "" });

    try {
      const res = await fetch("/api/lionsclub-join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      // Robust parse (avoids “Unexpected end of JSON input” in local dev)
      const ct = res.headers.get("content-type") || "";
      const text = await res.text();
      let data = {};
      if (ct.includes("application/json")) {
        try { data = JSON.parse(text); } catch {}
      }

      if (!res.ok || data.ok === false) {
        const msg = (data && data.error) || `HTTP ${res.status} – ${text.slice(0, 200)}`;
        throw new Error(msg);
      }

      setStatus({ state: "success", msg: "Thanks! We’ll be in touch shortly." });
      setForm({ name: "", email: "", phone: "", city: "", involvement: [], message: "", honeypot: "" });
    } catch (err) {
      setStatus({ state: "error", msg: err.message || "Something went wrong." });
    }
  }

  return (
    <main className="min-h-screen bg-white text-neutral-900">
      {/* BACK TO MAIN SITE */}
      <div className="bg-neutral-50 border-b border-neutral-200">
        <div className="mx-auto max-w-6xl px-4 py-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-lg border border-neutral-300 px-4 py-2 text-sm font-semibold hover:bg-neutral-100 transition"
          >
            ← Back to Alaska Offroad Expedition
          </Link>
        </div>
      </div>

      {/* HERO */}
      <section className="border-b border-neutral-200">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
                Southcentral Outdoor & Off-Road Lions Club
              </h1>
              <p className="mt-3 text-lg md:text-xl text-neutral-700">
                Adventure with purpose — giving back through outdoor education, safety,
                leadership, and service across Alaska.
              </p>
              <div className="mt-6 flex gap-3">
                <a
                  href="#join"
                  className="inline-flex items-center rounded-xl px-5 py-3 text-base font-semibold bg-black text-white hover:opacity-90"
                >
                  Become a Founding Member
                </a>
                <a
                  href="#about"
                  className="inline-flex items-center rounded-xl px-5 py-3 text-base font-semibold border border-neutral-300 hover:bg-neutral-50"
                >
                  Learn more
                </a>
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden border border-neutral-200 bg-neutral-50">
              <img
                src="/images/lions club logo 1.png"
                alt="Alaska off-road community ride"
                className="w-full h-64 md:h-72 object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid md:grid-cols-2 gap-10 items-start">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold">About the Nonprofit</h2>
            <p className="mt-3 text-neutral-700 leading-relaxed">
              The Southcentral Outdoor & Off-Road Lions Club is a new Alaska-based nonprofit
              founded by off-road and outdoor enthusiasts who believe adventure should serve a purpose.
              We host free off-road experiences for veterans and special-needs participants, champion
              suicide-awareness initiatives, teach wilderness safety and recovery, and take care of the trails we love.
            </p>
            <ul className="mt-6 space-y-2 text-neutral-800">
              <li>• Free expedition-style trail rides for veterans & special-needs participants</li>
              <li>• Suicide awareness & community outreach events</li>
              <li>• Wilderness safety, recovery techniques, and stewardship education</li>
              <li>• Trail maintenance and conservation projects</li>
              <li>• Member discounts on rentals, guided trips, training, and recovery</li>
            </ul>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <img src="/images/lions-ride-1.jpg" className="rounded-xl border border-neutral-200 object-cover h-40 md:h-48 w-full" alt="Veterans trail ride" />
            <img src="/images/lions-cleanup.png" className="rounded-xl border border-neutral-200 object-cover h-40 md:h-48 w-full" alt="Trail cleanup" />
            <img src="/images/lions-training.jpg" className="rounded-xl border border-neutral-200 object-cover h-40 md:h-48 w-full" alt="Recovery training" />
            <img src="/images/lions-camp.jpg" className="rounded-xl border border-neutral-200 object-cover h-40 md:h-48 w-full" alt="Overnight campout" />
          </div>
        </div>
      </section>

      {/* CALL OUT */}
      <section className="bg-neutral-50 border-y border-neutral-200">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <div className="rounded-2xl border border-neutral-200 p-6 md:p-8">
            <h3 className="text-xl md:text-2xl font-bold">We’re recruiting 25 founding members</h3>
            <p className="mt-2 text-neutral-700">
              Membership is <strong>$100/month</strong> and supports vehicle maintenance for free rides,
              outreach and awareness events, insurance, permits, safety gear, and training materials. <strong>Membership dues</strong> will be established and collected once the club is formed.
            </p>
          </div>
        </div>
      </section>

      {/* JOIN FORM */}
      <section id="join" className="mx-auto max-w-4xl px-4 py-16">
        <h2 className="text-2xl md:text-3xl font-bold">Join the Club</h2>
        <p className="mt-2 text-neutral-700">Fill this out and we’ll get back to you with next steps and the charter meeting invite.</p>

        <form onSubmit={onSubmit} className="mt-8 grid gap-6 rounded-2xl border border-neutral-200 p-6 md:p-8 bg-white">
          {/* Honeypot */}
          <input
            type="text"
            name="company"
            value={form.honeypot}
            onChange={(e) => setForm({ ...form, honeypot: e.target.value })}
            className="hidden"
            autoComplete="off"
            tabIndex={-1}
          />

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium">Full name</label>
              <input
                required
                type="text"
                className="mt-1 w-full rounded-lg border border-neutral-300 px-4 py-3 outline-none focus:ring-2 focus:ring-black"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Jane Doe"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">City / Region</label>
              <input
                type="text"
                className="mt-1 w-full rounded-lg border border-neutral-300 px-4 py-3 outline-none focus:ring-2 focus:ring-black"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                placeholder="Palmer / Anchorage / Copper Valley"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Email</label>
              <input
                required
                type="email"
                className="mt-1 w-full rounded-lg border border-neutral-300 px-4 py-3 outline-none focus:ring-2 focus:ring-black"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Phone</label>
              <input
                type="tel"
                className="mt-1 w-full rounded-lg border border-neutral-300 px-4 py-3 outline-none focus:ring-2 focus:ring-black"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="907-555-1234"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium">How would you like to be involved?</label>
            <div className="mt-3 grid md:grid-cols-2 gap-3">
              {involvementOptions.map((opt) => (
                <label key={opt.key} className="flex items-center gap-3 rounded-lg border border-neutral-300 px-4 py-3 cursor-pointer hover:bg-neutral-50">
                  <input
                    type="checkbox"
                    className="h-5 w-5"
                    checked={form.involvement.includes(opt.key)}
                    onChange={() => toggleInvolvement(opt.key)}
                  />
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium">Anything else you want us to know?</label>
            <textarea
              rows={4}
              className="mt-1 w-full rounded-lg border border-neutral-300 px-4 py-3 outline-none focus:ring-2 focus:ring-black"
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              placeholder="Share your background, availability, or questions."
            />
          </div>

          <div className="flex items-center gap-4">
            <button
              type="submit"
              disabled={status.state === "submitting"}
              className="inline-flex items-center rounded-xl px-6 py-3 font-semibold bg-black text-white hover:opacity-90 disabled:opacity-60"
            >
              {status.state === "submitting" ? "Submitting..." : "Submit Membership Interest"}
            </button>
            {status.state === "success" && <span className="text-green-700 font-medium">{status.msg}</span>}
            {status.state === "error" && <span className="text-red-700 font-medium">{status.msg}</span>}
          </div>

          <p className="text-sm text-neutral-600">
            By submitting, you agree to be contacted about membership. Dues are $100/month; we’ll send details for setup after the charter meeting.
          </p>
        </form>
      </section>

      {/* FOOTER NOTE */}
      <section className="pb-16">
        <div className="mx-auto max-w-6xl px-4">
          <p className="text-sm text-neutral-600">
            *This page is for the Southcentral Outdoor & Off-Road Lions Club initiative hosted by Alaska Offroad Expedition.
          </p>
        </div>
      </section>
    </main>
  );
}
