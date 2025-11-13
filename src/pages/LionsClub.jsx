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
    { key: "Member", label: "Be a member" },
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
{/* HERO BANNER - COMPACT AND CONNECTED TO ABOUT */}
<section
  className="relative border-b border-neutral-200"
  style={{
    backgroundImage: "url('/images/lions-banner-bg.jpg')", // Replace with your scenic background
    backgroundSize: "cover",
    backgroundPosition: "center",
  }}
>
  {/* Dark overlay for text contrast */}
  <div className="absolute inset-0 bg-black/30 backdrop-blur-[1px]" />

  <div className="relative mx-auto max-w-6xl px-4 py-10 flex flex-col items-center text-center">
    {/* LOGO CONTAINER */}
    <div className="rounded-3xl border-2 border-white/70 bg-white/90 shadow-lg p-8 flex flex-col items-center justify-center w-full md:w-4/5 lg:w-3/5 backdrop-blur-sm">
      
      {/* LOGO WITH BORDER */}
      <div className="rounded-2xl border-4 border-neutral-300 p-3 bg-white shadow-inner mb-6">
        <img
          src="/images/lions-hero.png?v=12"
          alt="Southcentral Outdoor & Off-Road Lions Club Logo"
          className="w-full max-w-[420px] h-auto object-contain rounded-xl"
          loading="lazy"
        />
      </div>

      {/* BUTTONS */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <a
          href="#join"
          className="inline-flex items-center justify-center rounded-xl px-6 py-3 text-base font-semibold bg-black text-white hover:opacity-90 transition"
        >
          Become a Founding Member
        </a>
        <a
          href="#about"
          className="inline-flex items-center justify-center rounded-xl px-6 py-3 text-base font-semibold border border-neutral-300 hover:bg-neutral-100 transition"
        >
          Learn more
        </a>
      </div>
    </div>
  </div>
</section>


   
      {/* ABOUT */}
<section id="about" className="mx-auto max-w-6xl px-4 py-20">
  <div className="grid md:grid-cols-2 gap-12 items-start">

    {/* LEFT: Expanded mission text */}
    <div>
      <h2 className="text-3xl md:text-4xl font-bold">About the Nonprofit</h2>
      <p className="mt-4 text-neutral-700 leading-relaxed text-lg">
        The Southcentral Outdoor & Off-Road Lions Club was founded by a group of Alaskans who believe the outdoors
        should be accessible to everyone. Our mission is to bring people together through adventure — serving our
        communities, supporting our veterans, and creating opportunities for those with special needs to experience
        the outdoors safely and confidently.
      </p>

      <p className="mt-4 text-neutral-700 leading-relaxed text-lg">
        We organize <strong>free off-road expeditions, camping weekends, survival classes, and recovery training</strong> events
        across Alaska. Members and volunteers help teach outdoor safety, 4x4 recovery, trail etiquette, and basic
        survival skills — ensuring that the next generation of adventurers is equipped, educated, and included.
      </p>

      <p className="mt-4 text-neutral-700 leading-relaxed text-lg">
        Through our efforts, we’re giving back to the community — helping families, veterans, and individuals who
        might not otherwise have the chance to experience the wild side of Alaska. Our club members work hand in hand
        to <strong>maintain trails, clean up public lands, host outreach events, and provide access to adaptive equipment </strong>
         so that everyone, regardless of ability, can share in the adventure.
      </p>

      <ul className="mt-8 space-y-3 text-neutral-800 text-base">
        <li>• Free trail rides, camping trips, and outdoor adventures for special needs participants and veterans</li>
        <li>• Community survival and recovery training classes open to the public</li>
        <li>• Trail cleanups and stewardship projects to protect Alaska’s backcountry</li>
        <li>• Group off-road runs that encourage teamwork, leadership, and inclusion</li>
        <li>• Local partnerships to provide equipment, safety gear, and resources</li>
        <li>• Events focused on mental health awareness and outdoor therapy</li>
      </ul>
    </div>

    {/* RIGHT: Larger image grid */}
    <div className="grid grid-cols-2 gap-6">
      <img
        src="/images/lions-ride-1.jpg"
        className="rounded-xl border border-neutral-200 object-cover h-64 md:h-80 w-full shadow-sm"
        alt="Veterans trail ride"
        loading="lazy"
      />
      <img
        src="/images/lions-cleanup.jpg"
        className="rounded-xl border border-neutral-200 object-cover h-64 md:h-80 w-full shadow-sm"
        alt="Trail cleanup"
        loading="lazy"
      />
      <img
        src="/images/lions-training.jpg"
        className="rounded-xl border border-neutral-200 object-cover h-64 md:h-80 w-full shadow-sm"
        alt="Recovery training"
        loading="lazy"
      />
      <img
        src="/images/lions-camp.jpg"
        className="rounded-xl border border-neutral-200 object-cover h-64 md:h-80 w-full shadow-sm"
        alt="Overnight campout"
        loading="lazy"
      />
    </div>
  </div>
</section>

      {/* CALL OUT */}
      <section className="bg-neutral-50 border-y border-neutral-200">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <div className="rounded-2xl border border-neutral-200 p-6 md:p-8">
            <h3 className="text-xl md:text-2xl font-bold">We’re recruiting 25 founding members</h3>
            <p className="mt-2 text-neutral-700">
              Membership is <strong>$110/year</strong> and supports vehicle maintenance for free rides,
              outreach and awareness events, insurance, permits, safety gear, and training materials. <strong>Dues</strong> will be addressed once the group is established.
            </p>
          </div>
        </div>
      </section>

      {/* JOIN FORM SECTION WITH BACKGROUND & FULL CONTACT FIELDS */}
<section
  id="join"
  className="relative border-t border-neutral-200"
  style={{
    backgroundImage: "url('/images/lions-join-bg.jpg')", // scenic or gradient background
    backgroundSize: "cover",
    backgroundPosition: "center",
  }}
>
  {/* Subtle overlay for contrast */}
  <div className="absolute inset-0 bg-black/30" />

  <div className="relative mx-auto max-w-5xl px-4 py-20">
    <div className="rounded-3xl border border-white/60 bg-white/90 shadow-xl backdrop-blur-sm p-10">
      <h2 className="text-3xl md:text-4xl font-bold text-center">Join the Club</h2>
      <p className="mt-3 text-neutral-700 text-center text-lg">
        Fill this out and we’ll get back to you with next steps and a charter meeting invite.
      </p>

      <form onSubmit={onSubmit} className="mt-10 grid gap-6">
        {/* Honeypot field */}
        <input
          type="text"
          name="company"
          value={form.honeypot}
          onChange={(e) => setForm({ ...form, honeypot: e.target.value })}
          className="hidden"
          autoComplete="off"
          tabIndex={-1}
        />

        {/* CONTACT INFO */}
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

        {/* INVOLVEMENT OPTIONS */}
        <div>
          <label className="block text-sm font-medium">How would you like to be involved?</label>
          <div className="mt-3 grid md:grid-cols-2 gap-3">
            {involvementOptions.map((opt) => (
              <label
                key={opt.key}
                className="flex items-center gap-3 rounded-lg border border-neutral-300 px-4 py-3 cursor-pointer hover:bg-neutral-50"
              >
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

        {/* MESSAGE */}
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

        {/* SUBMIT */}
        <div className="flex items-center gap-4 justify-center">
          <button
            type="submit"
            disabled={status.state === "submitting"}
            className="inline-flex items-center justify-center rounded-xl px-8 py-4 font-semibold bg-black text-white hover:opacity-90 disabled:opacity-60"
          >
            {status.state === "submitting" ? "Submitting..." : "Submit Membership Interest"}
          </button>
        </div>

        {status.state === "success" && (
          <p className="text-green-700 font-medium text-center mt-4">{status.msg}</p>
        )}
        {status.state === "error" && (
          <p className="text-red-700 font-medium text-center mt-4">{status.msg}</p>
        )}

        <p className="text-sm text-neutral-600 text-center mt-6">
          By submitting, you agree to be contacted about membership.
        </p>
      </form>
    </div>
  </div>
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
