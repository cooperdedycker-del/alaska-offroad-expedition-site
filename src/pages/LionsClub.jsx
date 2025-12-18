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
    { key: "Member", label: "Club member / founding member" },
  ];

  const toggleInvolvement = (key) => {
    setForm((f) => {
      const has = f.involvement.includes(key);
      return {
        ...f,
        involvement: has
          ? f.involvement.filter((k) => k !== key)
          : [...f.involvement, key],
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
        try {
          data = JSON.parse(text);
        } catch {
          // ignore JSON parse errors for non-JSON responses
        }
      }

      if (!res.ok || data.ok === false) {
        const msg =
          (data && data.error) || `HTTP ${res.status} – ${text.slice(0, 200)}`;
        throw new Error(msg);
      }

      setStatus({
        state: "success",
        msg: "Thanks! We’ll be in touch shortly.",
      });
      setForm({
        name: "",
        email: "",
        phone: "",
        city: "",
        involvement: [],
        message: "",
        honeypot: "",
      });
    } catch (err) {
      setStatus({
        state: "error",
        msg: err.message || "Something went wrong.",
      });
    }
  }

  return (
    <main className="min-h-screen bg-white text-neutral-900">
      {/* TOP BACK BAR */}
      <div className="bg-neutral-50 border-b border-neutral-200">
        <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between gap-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-lg border border-neutral-300 px-4 py-2 text-sm font-semibold hover:bg-neutral-100 transition"
          >
            ← Back to Alaska Offroad Expedition
          </Link>
          <p className="hidden md:block text-xs text-neutral-500">
            Southcentral Alaska Offroad &amp; Outdoor Lions Club • Adventure with purpose
          </p>
        </div>
      </div>

      {/* HERO – Big title + two-side layout */}
      <section className="relative overflow-hidden bg-neutral-950 text-white">
        {/* Background image + gradient overlay */}
        <div
          className="absolute inset-0 opacity-50"
          style={{
            backgroundImage: "url('/images/lions-join-bg.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-neutral-950/95" />

        <div className="relative mx-auto max-w-7xl px-4 lg:px-8 py-16 md:py-20 space-y-10">
          {/* BIG TITLE + TAGLINE CENTERED */}
          <div className="text-center flex flex-col items-center gap-3">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight">
              Southcentral Alaska Offroad &amp; Outdoor Lions Club
            </h1>
            <p className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-neutral-100">
              Adventure with Purpose
            </p>
            <p className="text-neutral-200 max-w-2xl text-sm md:text-base">
              An official Lions Club built by Alaskans for Alaskans — bringing
              off-roaders, campers, and volunteers together to protect outdoor
              access, support veterans and special needs participants, and serve
              our communities through education and hands-on projects.
            </p>
          </div>

          {/* TWO-COLUMN LAYOUT */}
          <div className="grid md:grid-cols-[1.1fr,1.7fr] gap-10 items-center">
            {/* LEFT: Story + CTAs + stats */}
            <div>
              <h2 className="text-2xl md:text-3xl font-bold">
                Adventure that actually gives back.
              </h2>
              <p className="mt-4 text-neutral-200 text-sm md:text-base leading-relaxed">
                Our mission is to be{" "}
                <strong>
                  advocates and stewards for Alaska’s outdoor and off-road
                  community
                </strong>
                . We’re building a service-focused club that protects access,
                teaches safety, and opens the outdoors to people who might not
                otherwise get the chance.
              </p>
              <p className="mt-4 text-neutral-200 text-sm md:text-base leading-relaxed">
                We provide training in survival skills, first aid, wilderness
                safety, and off-road recovery; support special needs Alaskans
                and veterans with access to capable vehicles and equipment; and
                lead trail cleanups and conservation work to keep public lands
                open for future generations.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href="#join"
                  className="inline-flex items-center rounded-xl px-6 py-3 text-sm md:text-base font-semibold bg-amber-300 text-black hover:bg-amber-200 transition shadow-md"
                >
                  Apply as a founding member
                </a>
                <a
                  href="#about"
                  className="inline-flex items-center rounded-xl px-6 py-3 text-sm md:text-base font-semibold border border-white/70 text-white hover:bg-white/10 transition"
                >
                  Learn more about the club
                </a>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-4 max-w-md text-sm">
                <div>
                  <p className="text-xs uppercase tracking-wide text-neutral-400">
                    Founding Members
                  </p>
                  <p className="text-xl font-bold text-amber-300">25</p>
                  <p className="text-[11px] text-neutral-400 mt-1">
                    Accepting founding members until the 4th.
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-neutral-400">
                    Focus
                  </p>
                  <p className="text-sm font-semibold">
                    Veterans &amp; special needs
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-neutral-400">
                    Core pillars
                  </p>
                  <p className="text-sm font-semibold">
                    Service • Safety • Access
                  </p>
                </div>
              </div>
            </div>

            {/* RIGHT: LOGO */}
            <div className="flex justify-center md:justify-end">
              <div className="w-full">
                <img
                  src="/images/Offical SAOOLC Logo.png"
                  alt="Southcentral Alaska Off-Road & Outdoor Lions Club logo"
                  className="w-full max-w-[200px] md:max-w-[500px] h-auto object-contain drop-shadow-2xl mx-auto"
                  loading="lazy"
                />
                <p className="mt-4 text-center text-sm text-neutral-200">
                  Southcentral Alaska Off-Road &amp; Outdoor Lions Club
                  <br />
                  <span className="text-amber-300 font-semibold">
                    “Adventure with purpose”
                  </span>
                </p>
                <div className="mt-4 flex flex-col gap-2 text-xs text-neutral-300 text-center">
                  <p>• Official Lions Club serving the Southcentral Alaska area and beyond</p>
                  <p>• Focused on outdoor access, safety, and community support</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT WE DO / ABOUT SECTION */}
      <section
        id="about"
        className="mx-auto max-w-6xl px-4 py-16 md:py-20 space-y-16"
      >
        {/* Top row: mission + quick pillars */}
        <div className="grid lg:grid-cols-[1.6fr,1.1fr] gap-12 items-start">
          {/* Mission / Story */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold">
              Keeping Alaska&apos;s outdoors accessible to everyone.
            </h2>
            <p className="mt-4 text-neutral-700 leading-relaxed text-lg">
              The Southcentral Alaska Off-Road &amp; Outdoor Lions Club was founded by
              Alaskans who believe the outdoors should be shared, not gatekept.
              Our mission is to be advocates and stewards for Alaska’s outdoor
              and off-road community — protecting access, teaching safety, and
              serving people who need support getting outside.
            </p>
            <p className="mt-4 text-neutral-700 leading-relaxed">
              We’re building a club centered around{" "}
              <strong>service, education, inclusion, and access</strong>. That
              means:
            </p>
            <ul className="mt-4 list-disc list-inside text-neutral-800 space-y-1">
              <li>
                Providing educational training like survival skills, first aid,
                wilderness safety, off-road recovery, bush repairs, and more.
              </li>
              <li>
                Supporting special needs Alaskans and veterans with reliable,
                capable vehicles and equipment so they can experience the
                outdoors safely and confidently.
              </li>
              <li>
                Protecting and maintaining public lands through trail cleanups,
                trail maintenance, and conservation work.
              </li>
              <li>
                Partnering with other leaders and organizations to strengthen
                the outdoor community and keep trails open for future
                generations.
              </li>
            </ul>
          </div>

          {/* Pillars / Highlights */}
          <div className="space-y-4">
            <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-5">
              <h3 className="text-lg font-semibold">
                Who we serve &amp; how we show up
              </h3>
              <ul className="mt-3 space-y-2 text-sm text-neutral-700">
                <li>• Veterans seeking connection, purpose, and time outside</li>
                <li>• Special needs participants and their families</li>
                <li>• Local communities that rely on safe, open trails</li>
                <li>• New off-roaders learning safety, recovery, and stewardship</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-neutral-200 bg-white p-5">
              <h3 className="text-lg font-semibold">What we focus on</h3>
              <div className="mt-3 flex flex-wrap gap-2 text-xs">
                <span className="rounded-full bg-neutral-900 text-white px-3 py-1">
                  Education &amp; training
                </span>
                <span className="rounded-full bg-neutral-100 px-3 py-1 border border-neutral-300">
                  Trail cleanups &amp; stewardship
                </span>
                <span className="rounded-full bg-neutral-100 px-3 py-1 border border-neutral-300">
                  Wilderness safety &amp; recovery
                </span>
                <span className="rounded-full bg-neutral-100 px-3 py-1 border border-neutral-300">
                  Camping &amp; survival skills
                </span>
                <span className="rounded-full bg-neutral-100 px-3 py-1 border border-neutral-300">
                  Community &amp; partnerships
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Photo grid */}
        <div className="grid md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <img
              src="/images/lions-ride-1.jpg"
              className="h-72 md:h-80 w-full object-cover rounded-2xl border border-neutral-200 shadow-sm"
              alt="Veterans trail ride"
              loading="lazy"
            />
          </div>
          <div className="space-y-4">
            <img
              src="/images/lions-cleanup.jpg"
              className="h-32 md:h-36 w-full object-cover rounded-2xl border border-neutral-200 shadow-sm"
              alt="Trail cleanup"
              loading="lazy"
            />
            <img
              src="/images/lions-training.jpg"
              className="h-32 md:h-36 w-full object-cover rounded-2xl border border-neutral-200 shadow-sm"
              alt="Recovery training"
              loading="lazy"
            />
          </div>
          <div>
            <img
              src="/images/lions-camp.jpg"
              className="h-full min-h-[10rem] w-full object-cover rounded-2xl border border-neutral-200 shadow-sm"
              alt="Overnight campout"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* LONG-TERM FUTURE GOALS */}
      <section className="bg-neutral-900 text-white">
        <div className="mx-auto max-w-6xl px-4 py-16 md:py-20 space-y-10">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold">
              Long-term future goals
            </h2>
            <p className="mt-3 text-sm md:text-base text-neutral-200 max-w-3xl">
              Beyond the first year, we have ambitious goals that will take
              time, teamwork, and strong leadership — but they’re absolutely
              achievable. Our long-term vision is big because Alaska deserves
              something big: a club that protects outdoor access, develops new
              opportunities, and serves the community for decades to come.
            </p>
          </div>

          <div className="space-y-8 text-sm md:text-base">
            <div>
              <h3 className="text-xl font-semibold">
                1. Designated Off-Road &amp; Outdoor Recreational Areas
              </h3>
              <p className="mt-2 text-neutral-200">
                We want to work toward establishing designated land specifically
                for off-road and outdoor recreation, including:
              </p>
              <ul className="mt-2 list-disc list-inside text-neutral-100 space-y-1">
                <li>Off-road park-style areas</li>
                <li>Trail systems built for all skill levels</li>
                <li>Safe, legal spaces for families and newcomers to learn</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold">2. Event &amp; Community Spaces</h3>
              <p className="mt-2 text-neutral-200">
                We envision developing areas that can support:
              </p>
              <ul className="mt-2 list-disc list-inside text-neutral-100 space-y-1">
                <li>Meet &amp; greets</li>
                <li>Training days</li>
                <li>Community events</li>
                <li>Outdoor festivals</li>
                <li>Off-road competitions and skill challenges</li>
              </ul>
              <p className="mt-2 text-neutral-200">
                These areas would be dedicated, organized, safe, and
                professionally maintained — something Alaska desperately needs.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold">
                3. A Strong, Statewide Outdoor Service Network
              </h3>
              <p className="mt-2 text-neutral-200">
                Over time, we see this club becoming a major resource for:
              </p>
              <ul className="mt-2 list-disc list-inside text-neutral-100 space-y-1">
                <li>Outdoor education</li>
                <li>Trail advocacy</li>
                <li>Veteran and special needs support</li>
                <li>Conservation and trail access</li>
                <li>Community-building across all regions of Alaska</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CALL OUT – Founding members */}
      <section className="bg-neutral-50 border-y border-neutral-200">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <div className="rounded-3xl border border-neutral-200 bg-white p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h3 className="text-xl md:text-2xl font-bold">
                We’re recruiting 25 founding members
              </h3>
              <p className="mt-2 text-neutral-700">
                Founding membership includes a{" "}
                <strong>$35 application fee</strong> and{" "}
                <strong>$110 yearly dues</strong>. Your support helps cover
                vehicle maintenance, free ride events, insurance, permits,
                safety gear, training materials, and more.
              </p>
            </div>
            <div className="flex flex-col items-start gap-3">
              <p className="text-sm text-neutral-700">
                Founding members help shape:
              </p>
              <ul className="text-sm text-neutral-800 space-y-1">
                <li>• Which projects we take on first</li>
                <li>• How we serve veterans &amp; special needs participants</li>
                <li>• Club bylaws, leadership, and meeting structure</li>
              </ul>
              <a
                href="#join"
                className="mt-2 inline-flex items-center rounded-xl px-5 py-2.5 text-sm font-semibold bg-black text-white hover:bg-neutral-800 transition"
              >
                Raise your hand to be a founding member →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* JOIN FORM SECTION */}
      <section
        id="join"
        className="relative border-t border-neutral-200"
        style={{
          backgroundImage: "url('/images/lions-join-bg.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/40" />

        <div className="relative mx-auto max-w-5xl px-4 py-20">
          <div className="rounded-3xl border border-white/60 bg-white/95 shadow-2xl backdrop-blur-sm p-8 md:p-10">
            <h2 className="text-3xl md:text-4xl font-bold text-center">
              Join the Southcentral Alaska Off-Road &amp; Outdoor Lions Club
            </h2>
            <p className="mt-3 text-neutral-700 text-center text-base md:text-lg">
              We are officially a chartering club and are accepting{" "}
              <strong>founding members</strong>. Fill out this
              form to apply as a founding member or general club member. We’ll
              follow up with next steps, charter meeting details, and how to
              submit your <strong>$35 application fee</strong> and{" "}
              <strong>$110 yearly dues</strong>.
            </p>

            <form onSubmit={onSubmit} className="mt-10 grid gap-6">
              {/* Honeypot */}
              <input
                type="text"
                name="company"
                value={form.honeypot}
                onChange={(e) =>
                  setForm({ ...form, honeypot: e.target.value })
                }
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
                    onChange={(e) =>
                      setForm({ ...form, name: e.target.value })
                    }
                    placeholder="Jane Doe"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium">
                    City / Region
                  </label>
                  <input
                    type="text"
                    className="mt-1 w-full rounded-lg border border-neutral-300 px-4 py-3 outline-none focus:ring-2 focus:ring-black"
                    value={form.city}
                    onChange={(e) =>
                      setForm({ ...form, city: e.target.value })
                    }
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
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    placeholder="you@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium">Phone</label>
                  <input
                    type="tel"
                    className="mt-1 w-full rounded-lg border border-neutral-300 px-4 py-3 outline-none focus:ring-2 focus:ring-black"
                    value={form.phone}
                    onChange={(e) =>
                      setForm({ ...form, phone: e.target.value })
                    }
                    placeholder="907-555-1234"
                  />
                </div>
              </div>

              {/* INVOLVEMENT OPTIONS */}
              <div>
                <label className="block text-sm font-medium">
                  How would you like to be involved?
                </label>
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
                <label className="block text-sm font-medium">
                  Anything else you want us to know?
                </label>
                <textarea
                  rows={4}
                  className="mt-1 w-full rounded-lg border border-neutral-300 px-4 py-3 outline-none focus:ring-2 focus:ring-black"
                  value={form.message}
                  onChange={(e) =>
                    setForm({ ...form, message: e.target.value })
                  }
                  placeholder="Share your background, availability, ideas, or questions."
                />
              </div>

              {/* SUBMIT */}
              <div className="flex flex-col items-center gap-3">
                <button
                  type="submit"
                  disabled={status.state === "submitting"}
                  className="inline-flex items-center justify-center rounded-xl px-8 py-3 font-semibold bg-black text-white hover:bg-neutral-800 disabled:opacity-60 transition"
                >
                  {status.state === "submitting"
                    ? "Submitting..."
                    : "Submit Membership Interest"}
                </button>

                {status.state === "success" && (
                  <p className="text-green-700 font-medium text-center">
                    {status.msg}
                  </p>
                )}
                {status.state === "error" && (
                  <p className="text-red-700 font-medium text-center">
                    {status.msg}
                  </p>
                )}

                <p className="text-xs text-neutral-600 text-center mt-2">
                  By submitting, you agree to be contacted about membership and
                  upcoming club meetings. No payment is collected on this form;
                  we’ll send instructions on paying the $35 application fee and
                  $110 yearly dues after we review your info.
                </p>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* FOOTER NOTE */}
      <section className="pb-12 bg-white">
        <div className="mx-auto max-w-6xl px-4">
          <p className="text-sm text-neutral-600">
            *This page is for the official Southcentral Alaska Off-Road &amp; Outdoor Lions
            Club, supported by Alaska Offroad Expedition.
          </p>
        </div>
      </section>
    </main>
  );
}
