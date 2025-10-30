import { useState, useMemo } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


export default function AlaskaOffroadExpedition() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
      <div id="top" className="min-h-screen bg-neutral-950 text-neutral-100">
      <header className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-neutral-950/70">
        <div className="mx-auto max-w-7xl px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a href="#top" className="h-9 w-9 rounded-lg overflow-hidden">
  <img
    src="/images/logo1.png"
    alt="Alaska Offroad Expedition logo"
    className="h-full w-full object-contain"
  />
</a>
            <a
  href="#top"
  className="text-lg font-semibold tracking-wide hover:text-white/80 transition"
>
  Alaska Offroad Expedition
</a>


          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm text-neutral-300">
            <a href="#experiences" className="hover:text-white">Experiences</a>
            <a href="#fleet" className="hover:text-white">Fleet</a>
            <a href="#trip-builder" className="hover:text-white">Trip Builder</a>
            <a href="#about" className="hover:text-white">About</a>
            <a href="#faq" className="hover:text-white">FAQ</a>
            <a href="#contact" className="hover:text-white">Contact</a>
          </nav>
          <button onClick={() => setMobileNavOpen(!mobileNavOpen)} className="md:hidden text-white">☰</button>
          <a href="#trip-builder" className="hidden md:inline-flex items-center gap-2 rounded-2xl bg-white/10 px-4 py-2 text-sm font-semibold hover:bg-white/20 transition">Book an Expedition</a>
        </div>
        {mobileNavOpen && (
          <nav className="md:hidden flex flex-col items-center gap-4 pb-4 text-sm text-neutral-300">
            <a href="#experiences" onClick={() => setMobileNavOpen(false)}>Experiences</a>
            <a href="#fleet" onClick={() => setMobileNavOpen(false)}>Fleet</a>
            <a href="#trip-builder" onClick={() => setMobileNavOpen(false)}>Trip Builder</a>
            <a href="#about" onClick={() => setMobileNavOpen(false)}>About</a>
            <a href="#faq" onClick={() => setMobileNavOpen(false)}>FAQ</a>
            <a href="#contact" onClick={() => setMobileNavOpen(false)}>Contact</a>
          </nav>
        )}
      </header>

      <Hero />
      <TrustBar />
      <Experiences />
      <Fleet />
      <section id="trip-builder" className="relative">
        <TripBuilder />
      </section>
      <About />
      <FAQ />
      <Contact />
      <Footer />
    </div>
  );
}

/* ---------------- Components ---------------- */

function Hero() {
  return (
   <section className="relative h-[50vh] md:h-[60vh] w-full flex items-center justify-center">
  <div className="absolute inset-0">
    <img
      src="/images/hero-illustration.png"
      alt="Alaska mountains"
      className="w-full h-full object-cover object-[50%_80%] opacity-60"
      loading="lazy"
    />
  </div>

  <div className="relative max-w-3xl text-center bg-black/50 backdrop-blur-sm rounded-2xl p-6">
    <h1 className="text-4xl md:text-6xl font-extrabold leading-tight text-white drop-shadow-lg">
      Where Roads End, <span className="text-white/90">Adventure Begins.</span>
    </h1>
    <p className="mt-5 text-lg text-neutral-200">
      Premium, guided off-road expeditions across Alaska. Expedition-built offroad vehicles, expert guides,
      and bucket-list add-ons like glacier treks and helicopter flyovers. We plan it all. You show up.
    </p>
    <div className="mt-8 flex flex-wrap gap-3 justify-center">
      <a
        href="#trip-builder"
        className="rounded-xl bg-white text-neutral-900 px-5 py-3 font-semibold hover:bg-neutral-200"
      >
        Build Your Trip
      </a>
      <a
        href="#experiences"
        className="rounded-xl border border-white/30 px-5 py-3 font-semibold hover:bg-white/10"
      >
        See Experiences
      </a>
    </div>
    <div className="mt-6 text-sm text-neutral-300">
      Airport pickup & drop-off • Pro guides • All logistics handled
    </div>
  </div>
</section>
  );
}

function TrustBar() {
  return (
    <section className="border-y border-white/5 bg-neutral-900/40">
      <div className="mx-auto max-w-7xl px-4 py-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-neutral-300">
        <div>✔ Wilderness certified guides</div>
        <div>✔ Expedition ready offroad fleet</div>
        <div>✔ Fully insured & permitted</div>
        <div>✔ Customizable itineraries</div>
      </div>
    </section>
  );
}

function Experiences() {
  const cards = [
    {
      title: "Guided Day Expedition",
      price: "from $1,200 / day (per couple)",
      desc: "4–6 hours off-road with a pro guide, lunch included.",
      img: "/images/guidedday1.png"
    },
    {
      title: "Overnight Remote Camp",
      price: "from $2,500 – $3,000 / couple",
      desc: "Two-day off-road push, camp set-up, hot meals, stargazing.",
      img: "/images/Overnight1.jpg"
    },
    {
      title: "Ultimate 7-Day Expedition",
      price: "$25,000 – $30,000 / guest",
      desc: "Helicopter flyover, glacier trek, bush plane segment, lodge nights.",
      img: "/images/7day.jpg"
    }
  ];
  return (
    <section id="experiences" className="mx-auto max-w-7xl px-4 py-16">
      <h2 className="text-3xl md:text-4xl font-bold">Signature Experiences</h2>
      <p className="mt-2 text-neutral-300 max-w-3xl">Choose your pace—from a single day on iconic trails to week-long expeditions that mix off-road travel with glacier walks, bush plane drop-ins, and nights under the northern lights.</p>
      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {cards.map((x, i) => (
          <div key={i} className="group relative overflow-hidden rounded-2xl border border-white/10 bg-neutral-900/40">
            <img src={x.img} alt={x.title} className="h-44 w-full object-cover opacity-80 group-hover:scale-105 transition duration-500" loading="lazy" />
            <div className="p-5">
              <h3 className="text-xl font-semibold">{x.title}</h3>
              <div className="text-sm text-neutral-300 mt-1">{x.price}</div>
              <p className="mt-3 text-neutral-300">{x.desc}</p>
              <a href="#trip-builder" className="mt-4 inline-block rounded-xl bg-white text-neutral-900 px-4 py-2 font-semibold hover:bg-neutral-200">Customize</a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Fleet() {
  return (
    <section id="fleet" className="mx-auto max-w-7xl px-4 py-16">
      <h2 className="text-3xl md:text-4xl font-bold">Fleet of Expedition Vehicles</h2>
      <p className="mt-2 text-neutral-300 max-w-3xl">4&quot; lift • 37–40&quot; tires • 1-ton axles • Lockers • Winch • Skids • Roof rack • Fridge • Comms • Recovery kit • Camp systems • Airport pickup & drop-off available.</p>
      <div className="mt-8 grid gap-6 md:grid-cols-2">
  {/* Jeep Gladiator */}
  <div className="rounded-2xl overflow-hidden border border-white/10 bg-neutral-900/40">
    <img
      src="/images/Fleet2.jpg"
      alt="Jeep on trail"
      className="h-64 w-full object-contain bg-black"
      loading="lazy"
    />
    <div className="p-5">
      <h3 className="text-xl font-semibold">2025 Jeep Gladiator</h3>
      <p className="mt-2 text-neutral-300">
        Purpose-built 2025 Jeep Gladiator for Alaska’s toughest terrain.
      </p>
    </div>
  </div>

  {/* Toyota Tacoma */}
  <div className="rounded-2xl overflow-hidden border border-white/10 bg-neutral-900/40">
    <img
      src="/images/Fleet3.jpeg"
      alt="Tacoma Expedition Build"
      className="h-64 w-full object-contain bg-black"
      loading="lazy"
    />
    <div className="p-5">
      <h3 className="text-xl font-semibold">2019 Toyota Tacoma</h3>
      <p className="mt-2 text-neutral-300">
        This is a 2019 Toyota Tacoma, 37&quot; tires and a 6-inch lift,
        insulated tents, warm meals, safety gear, and satellite comms for true
        off-grid comfort.
      </p>
    </div>
  </div>

  {/* 3rd Rig - Overland XJ */}
  <div className="rounded-2xl overflow-hidden border border-white/10 bg-neutral-900/40">
    <img
      src="/images/Fleet5.jpg"
      alt="Jeep XJ Overland Build"
      className="h-64 w-full object-contain bg-black"
      loading="lazy"
    />
    <div className="p-5">
      <h3 className="text-xl font-semibold">2000 Jeep XJ</h3>
      <p className="mt-2 text-neutral-300">
        Fully built Jeep Cherokee XJ on 35s with a roof tent, dual battery
        system, and complete trail recovery gear. Compact, capable, and ready
        for the wild.
      </p>
    </div>
  </div>

  {/* 4th Rig - Ram Power Wagon */}
  <div className="rounded-2xl overflow-hidden border border-white/10 bg-neutral-900/40">
    <img
      src="/images/Fleet4.jpeg"
      alt="Ram Power Wagon Expedition Rig"
      className="h-64 w-full object-contain bg-black"
      loading="lazy"
    />
    <div className="p-5">
      <h3 className="text-xl font-semibold">2025 Ram Power Wagon Expedition Rig</h3>
      <p className="mt-2 text-neutral-300">
        Heavy-duty Ram Power Wagon with onboard air, winch, full-size rooftop
        tent, and cold-weather overland setup — ideal for long-range Alaska
        expeditions.
      </p>
    </div>
  </div>
</div>

    </section>
  );
}

function About() {
  return (
    <section id="about" className="mx-auto max-w-7xl px-4 py-16">
      <div className="grid md:grid-cols-2 gap-10 items-start">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold">Alaskans. Guides. Expedition Leaders.</h2>
          <p className="mt-3 text-neutral-300">We’ve spent years pushing deep into the backcountry—recoveries, remote routes, winter crossings. Alaska Offroad Expedition was built to share that world with guests who want the real thing—rugged, safe, and unforgettable.</p>
          <ul className="mt-5 list-disc pl-5 text-neutral-300 space-y-2">
            <li>Wilderness first aid & recovery trained</li>
            <li>Permits & partnerships across key regions</li>
            <li>Small groups, high guide-to-guest ratio</li>
          </ul>
        </div>
        <div className="rounded-2xl overflow-hidden border border-white/10 bg-neutral-900/40">
          <img src="/images/expedition2.bmp" alt="Glacier valley" className="w-full h-72 object-cover" loading="lazy" />
          <div className="p-5 text-neutral-300">“Not a tour—an expedition. The team handled everything. We just showed up and lived Alaska.”</div>
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  const qa = [
    { q: "Do I need off-road experience?", a: "No—our guides coach you on trail. We tailor obstacles to your comfort level and conditions." },
    { q: "What’s included on overnights?", a: "Camp setup, three meals per day, hot drinks, and all safety gear. Bring personal layers and boots." },
    { q: "Can you pick us up at the airport?", a: "Yes. Airport pickup / drop-off and hotel transfers are available." },
    { q: "What about weather & safety?", a: "We monitor conditions, carry satellite comms, and build conservative go/no-go plans for each route." }
  ];
  return (
    <section id="faq" className="mx-auto max-w-7xl px-4 py-16">
      <h2 className="text-3xl md:text-4xl font-bold">FAQ</h2>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {qa.map((item, i) => (
          <div key={i} className="rounded-2xl border border-white/10 bg-neutral-900/40 p-5">
            <div className="font-semibold">{item.q}</div>
            <div className="mt-2 text-neutral-300">{item.a}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

import { useState } from "react";

function Contact() {
  const [planner, setPlanner] = useState({
    name: "",
    email: "",
    dates: "",
    message: "",
  });
  const [sending, setSending] = useState(false);

  async function handlePlannerSubmit(e) {
    e.preventDefault();
    setSending(true);

    const payload = {
      name: planner.name,
      email: planner.email,
      phone: "", // no phone field in this form
      message: `Desired dates: ${planner.dates}\n\n${planner.message}`,
      sourceUrl: window.location.href,
    };

    try {
      const resp = await fetch("/api/contact-planner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await resp.json();
      if (!resp.ok || !data.ok) {
        alert(`There was a problem sending your message. ${data?.error || ""}`);
      } else {
        alert("Thanks! An expedition planner will reach out shortly.");
        setPlanner({ name: "", email: "", dates: "", message: "" });
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong while sending your message.");
    } finally {
      setSending(false);
    }
  }

  return (
    <section id="contact" className="mx-auto max-w-7xl px-4 py-16">
      <div className="rounded-3xl border border-white/10 bg-neutral-900/50 p-8 md:p-12">
        <h2 className="text-3xl md:text-4xl font-bold">Talk to an Expedition Planner</h2>
        <p className="mt-2 text-neutral-300">
          Tell us your dates and must-do experiences. We’ll craft a custom itinerary and get permits rolling.
        </p>

        <form
          onSubmit={handlePlannerSubmit}
          className="mt-6 grid gap-4 md:grid-cols-2"
        >
          <input
            className="rounded-xl bg-neutral-800 px-4 py-3"
            placeholder="Full name"
            value={planner.name}
            onChange={(e) => setPlanner((p) => ({ ...p, name: e.target.value }))}
            required
          />
          <input
            className="rounded-xl bg-neutral-800 px-4 py-3"
            placeholder="Email"
            type="email"
            value={planner.email}
            onChange={(e) => setPlanner((p) => ({ ...p, email: e.target.value }))}
            required
          />
          <input
            className="rounded-xl bg-neutral-800 px-4 py-3 md:col-span-2"
            placeholder="Desired dates (flexible is okay)"
            value={planner.dates}
            onChange={(e) => setPlanner((p) => ({ ...p, dates: e.target.value }))}
          />
          <textarea
            className="rounded-xl bg-neutral-800 px-4 py-3 md:col-span-2"
            rows={4}
            placeholder="Tell us what you want to experience (glacier, helicopter, zipline, remote camping, etc.)"
            value={planner.message}
            onChange={(e) => setPlanner((p) => ({ ...p, message: e.target.value }))}
            required
          />
          <button
            type="submit"
            disabled={sending}
            className={`rounded-xl bg-white text-neutral-900 px-4 py-3 font-semibold hover:bg-neutral-200 md:col-span-2 ${
              sending ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {sending ? "Sending..." : "Request Itinerary"}
          </button>
        </form>
      </div>
    </section>
  );
}

export default Contact;

}

function Footer() {
  return (
    <footer className="border-t border-white/10">
      <div className="mx-auto max-w-7xl px-4 py-10 text-sm text-neutral-400 grid md:grid-cols-3 gap-6">
        <div>
          <div className="font-semibold text-neutral-200">Alaska Offroad Expedition</div>
          <p className="mt-2">Built for the Wild.</p>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <a href="#experiences" className="hover:text-neutral-200">Experiences</a>
          <a href="#fleet" className="hover:text-neutral-200">Fleet</a>
          <a href="#trip-builder" className="hover:text-neutral-200">Trip Builder</a>
          <a href="#faq" className="hover:text-neutral-200">FAQ</a>
          <a href="#about" className="hover:text-neutral-200">About</a>
          <a href="#contact" className="hover:text-neutral-200">Contact</a>
        </div>
        <div className="text-neutral-500">
          © {new Date().getFullYear()} Alaska Offroad Expedition. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

/* ---------------- Trip Builder ---------------- */

function TripBuilder() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    start: "", end: "", party: 2, rig: "wrangler-expedition", guideDay: false, overnight: 0,
    addOns: { glacier: false, helicopter: false, bushplane: false, zipline: false, mine: false, lodgeNights: 0 },
    contact: { name: "", email: "", phone: "" },
  });

  const nights = useMemo(() => {
    if (!form.start || !form.end) return 0;
    const s = new Date(form.start), e = new Date(form.end);
    return Math.max(0, Math.round((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24)));
  }, [form.start, form.end]);

  const price = useMemo(() => {
    const dailyRental = 850;
    const guideTotal = form.guideDay ? 750 : 0;
    const overnightAdd = (form.overnight || 0) * 1000;
    const addOnMap = { glacier: 600, helicopter: 1200, bushplane: 900, zipline: 250, mine: 300 };
    const addOnSum = Object.entries(form.addOns).filter(([k, v]) => addOnMap[k] && v === true).reduce((a, [k]) => a + addOnMap[k], 0);
    const lodgeCost = (form.addOns.lodgeNights || 0) * 350;
    const rentalTotal = nights * dailyRental;
    const total = rentalTotal + guideTotal + overnightAdd + addOnSum + lodgeCost;
    return { rentalTotal, guideTotal, overnightAdd, addOnSum, lodgeCost, total };
  }, [nights, form]);

  const next = () => setStep((s) => Math.min(4, s + 1));
  const back = () => setStep((s) => Math.max(1, s - 1));
  const set = (patch) => setForm((f) => ({ ...f, ...patch }));
const [sending, setSending] = useState(false);
const submit = async () => {
  // basic validation
  if (!form.contact.name || !form.contact.email) {
    alert("Please enter your name and email in the Contact step.");
    setStep(4);
    return;
  }

  try {
    setSending(true);
    const r = await fetch('/api/trip-inquiry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      // 🔧 CHANGE: send an object with { form, pricing }
      body: JSON.stringify({ form, pricing: price }),
    });

    // Better error surfacing
    let data;
    try { data = await r.json(); } catch (_) { data = null; }

    if (!r.ok || !data?.ok) {
      const msg = data?.error || r.statusText || 'Failed to submit';
      throw new Error(msg);
    }

    alert('Request submitted! We’ll email you shortly with availability and next steps.');
    // optional: reset form here if desired
  } catch (e) {
    console.error('submit error:', e);
    alert(`Something went wrong sending your request: ${e.message}`);
  } finally {
    setSending(false);
  }
};


  return (
    <div className="relative">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-neutral-900/60 to-neutral-950" />
      <div className="mx-auto max-w-7xl px-4 py-16">
        <div className="rounded-3xl border border-white/10 bg-neutral-900/50 p-8 md:p-12">
          <header className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold">Build Your Expedition</h2>
              <p className="mt-2 text-neutral-300 max-w-3xl">Select dates, rig, add experiences, and request an itinerary. We’ll confirm permits and send payment & waiver links.</p>
            </div>
            <Stepper step={step} />
          </header>

          <div className="mt-8 grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-6">
              {step === 1 && (<StepDates form={form} set={set} nights={nights} />)}
              {step === 2 && (<StepRigAndExtras form={form} set={set} />)}
              {step === 3 && (<StepAddOns form={form} set={set} />)}
              {step === 4 && (<StepContact form={form} set={set} />)}

              <div className="flex items-center gap-3">
                {step > 1 && (<button onClick={back} className="rounded-xl border border-white/20 px-5 py-3 font-semibold hover:bg-white/10">Back</button>)}
                {step < 4 ? (
  <button
    onClick={next}
    className="rounded-xl bg-white text-neutral-900 px-5 py-3 font-semibold hover:bg-neutral-200"
  >
    Continue
  </button>
) : (
  <button
    onClick={submit}
    disabled={sending}
    className="rounded-xl bg-white text-neutral-900 px-5 py-3 font-semibold hover:bg-neutral-200 disabled:opacity-60"
  >
    {sending ? "Sending..." : "Request Itinerary"}
  </button>
)}
              </div>
            </div>

            <aside className="space-y-4">
              <SummaryCard form={form} nights={nights} price={price} />
              <PolicyCard />
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}

function Stepper({ step }) {
  const steps = ["Dates", "Rig", "Add-ons", "Contact"];
  return (
    <div className="hidden md:flex items-center gap-2 text-sm text-neutral-300">
      {steps.map((label, i) => {
        const n = i + 1;
        const active = n <= step;
        return (
          <div key={label} className="flex items-center gap-2">
            <div className={`h-7 w-7 grid place-items-center rounded-full border ${active ? "bg-white text-neutral-900 border-white" : "border-white/30"}`}>{n}</div>
            <span className={active ? "text-white" : "text-neutral-400"}>{label}</span>
            {i < steps.length - 1 && <div className="mx-2 h-px w-8 bg-white/20" />}
          </div>
        );
      })}
    </div>
  );
}

function StepDates({ form, set, nights }) {
  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-3 gap-4">
        <div>
          <label className="text-sm text-neutral-300">Start date</label>
          <input value={form.start} onChange={(e) => set({ start: e.target.value })} className="mt-1 w-full rounded-xl bg-neutral-800 px-4 py-3" type="date" />
        </div>
        <div>
          <label className="text-sm text-neutral-300">End date</label>
          <input value={form.end} onChange={(e) => set({ end: e.target.value })} className="mt-1 w-full rounded-xl bg-neutral-800 px-4 py-3" type="date" />
        </div>
        <div>
          <label className="text-sm text-neutral-300">Party size</label>
          <input value={form.party} onChange={(e) => set({ party: Number(e.target.value) })} className="mt-1 w-full rounded-xl bg-neutral-800 px-4 py-3" type="number" min={1} max={4} />
        </div>
      </div>
      <div className="text-sm text-neutral-400">{nights} night(s) selected.</div>
    </div>
  );
}

function StepRigAndExtras({ form, set }) {
  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm text-neutral-300">Rig selection</label>
        <select value={form.rig} onChange={(e) => set({ rig: e.target.value })} className="mt-1 w-full rounded-xl bg-neutral-800 px-4 py-3">
          <option value="wrangler-expedition">Wrangler Expedition (40&quot; tires)</option>
          <option value="wrangler-premium">Wrangler Premium (35&quot; Tires)</option>
          <option value="tacoma-expedition">Tacoma Expedition (40&quot; Tires)</option>
          <option value="tacoma-premium">Tacoma Premium (35&quot; Tires)</option>
        </select>
      </div>
      <div className="flex items-center gap-3">
        <input id="guideDay" type="checkbox" checked={form.guideDay} onChange={(e) => set({ guideDay: e.target.checked })} className="h-4 w-4" />
        <label htmlFor="guideDay" className="text-neutral-200">Add a guided day (+$750)</label>
      </div>
      <div>
        <label className="text-sm text-neutral-300">Overnights (includes meals & camp)</label>
        <input value={form.overnight} onChange={(e) => set({ overnight: Number(e.target.value) })} type="number" min={0} max={14} className="mt-1 w-full rounded-xl bg-neutral-800 px-4 py-3" />
      </div>
    </div>
  );
}

function StepAddOns({ form, set }) {
  const toggle = (k) => set({ addOns: { ...form.addOns, [k]: !form.addOns[k] } });
  const setNum = (k, v) => set({ addOns: { ...form.addOns, [k]: Number(v) } });
  const items = [
    { key: "glacier", label: "Glacier Hike", note: "+$600" },
    { key: "helicopter", label: "Helicopter Flight", note: "+$1500" },
    { key: "bushplane", label: "Bush Plane Segment", note: "+$1500" },
    { key: "zipline", label: "Zipline", note: "+$500" },
    { key: "mine", label: "Historic Mine/Glacier Tunnel Tour", note: "+$1500" },
  ];
  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-2 gap-3">
        {items.map((x) => (
          <label key={x.key} className="flex items-center gap-3 rounded-xl border border-white/10 bg-neutral-900/40 p-4 hover:bg-white/5 cursor-pointer">
            <input type="checkbox" checked={form.addOns[x.key]} onChange={() => toggle(x.key)} className="h-4 w-4" />
            <span className="flex-1">
              <div className="font-semibold">{x.label}</div>
              <div className="text-sm text-neutral-400">{x.note}</div>
            </span>
          </label>
        ))}
      </div>
      <div>
        <label className="text-sm text-neutral-300">Lodge nights (optional)</label>
        <input type="number" min={0} max={14} value={form.addOns.lodgeNights} onChange={(e) => setNum("lodgeNights", e.target.value)} className="mt-1 w-full rounded-xl bg-neutral-800 px-4 py-3" />
      </div>
    </div>
  );
}

function StepContact({ form, set }) {
  const c = form.contact;
  const setC = (patch) => set({ contact: { ...c, ...patch } });
  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm text-neutral-300">Full name</label>
          <input value={c.name} onChange={(e) => setC({ name: e.target.value })} className="mt-1 w-full rounded-xl bg-neutral-800 px-4 py-3" placeholder="Your name" />
        </div>
        <div>
          <label className="text-sm text-neutral-300">Email</label>
          <input value={c.email} type="email" onChange={(e) => setC({ email: e.target.value })} className="mt-1 w-full rounded-xl bg-neutral-800 px-4 py-3" placeholder="you@email.com" />
        </div>
      </div>
      <div>
        <label className="text-sm text-neutral-300">Phone</label>
        <input value={c.phone} onChange={(e) => setC({ phone: e.target.value })} className="mt-1 w-full rounded-xl bg-neutral-800 px-4 py-3" placeholder="+1 (___) ___-____" />
      </div>
      <div className="text-sm text-neutral-400">Submitting will create a reservation request. We’ll reply with availability, a deposit link (Stripe), and an e-signature waiver.</div>
    </div>
  );
}

function SummaryCard({ form, nights, price }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-neutral-900/60 p-5">
      <div className="font-semibold text-lg">Summary</div>
      <div className="mt-3 space-y-2 text-sm text-neutral-300">
        <div><span className="text-neutral-400">Dates:</span> {form.start || '—'} → {form.end || '—'} ({nights} night{nights !== 1 ? 's' : ''})</div>
        <div><span className="text-neutral-400">Rig:</span> {form.rig.replace('-', ' ')}</div>
        <div><span className="text-neutral-400">Guided day:</span> {form.guideDay ? 'Yes' : 'No'}</div>
        <div><span className="text-neutral-400">Overnights:</span> {form.overnight}</div>
        <div className="pt-2 border-t border-white/10">Add-ons:</div>
        <ul className="list-disc pl-5">
          {Object.entries(form.addOns).filter(([k, v]) => typeof v === 'boolean' && v).map(([k]) => (
            <li key={k} className="capitalize">{k}</li>
          ))}
          {form.addOns.lodgeNights > 0 && (<li>Lodge nights × {form.addOns.lodgeNights}</li>)}
          {Object.values(form.addOns).every(v => v === false || v === 0) && (<li className="text-neutral-400">None selected</li>)}
        </ul>
      </div>
      <div className="mt-4 rounded-xl bg-neutral-800 p-4 text-sm text-neutral-200">
        <div className="flex justify-between"><span>Rental</span><span>${price.rentalTotal.toLocaleString()}</span></div>
        {price.guideTotal > 0 && <div className="flex justify-between"><span>Guided day</span><span>${price.guideTotal.toLocaleString()}</span></div>}
        {price.overnightAdd > 0 && <div className="flex justify-between"><span>Overnights</span><span>${price.overnightAdd.toLocaleString()}</span></div>}
        {price.addOnSum > 0 && <div className="flex justify-between"><span>Add-ons</span><span>${price.addOnSum.toLocaleString()}</span></div>}
        {price.lodgeCost > 0 && <div className="flex justify-between"><span>Lodge</span><span>${price.lodgeCost.toLocaleString()}</span></div>}
        <div className="mt-3 flex justify-between text-base font-semibold"><span>Total (est.)</span><span>${price.total.toLocaleString()}</span></div>
        <div className="text-xs text-neutral-400 mt-1">Final price confirmed after permits & vendor availability.</div>
      </div>
    </div>
  );
}

function PolicyCard() {
  return (
    <div className="rounded-2xl border border-white/10 bg-neutral-900/60 p-5 text-sm text-neutral-300">
      <div className="font-semibold text-lg">Policies</div>
      <ul className="mt-3 list-disc pl-5 space-y-2">
        <li>25% deposit to reserve; balance due 14 days before start.</li>
        <li>Free date change up to 30 days prior (subject to availability).</li>
        <li>Driver’s license verification and damage deposit required for rentals.</li>
        <li>Trips may shift for safety/weather; equal or better alternatives provided.</li>
      </ul>
    </div>
  );
}