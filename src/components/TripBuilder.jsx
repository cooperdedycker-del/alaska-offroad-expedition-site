import { useState } from "react";
import TripBuilder from "./components/TripBuilder";

export default function AlaskaOffroadExpedition() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div id="top" className="min-h-screen bg-neutral-950 text-neutral-100">
      <header className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-neutral-950/70">
        <div className="mx-auto max-w-7xl px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a href="#top" className="h-9 w-9 rounded-lg overflow-hidden">
              <img
                src="/images/logo-round.png"
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

          <button
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            className="md:hidden text-white"
          >
            ☰
          </button>

          <a
            href="#trip-builder"
            className="hidden md:inline-flex items-center gap-2 rounded-2xl bg-white/10 px-4 py-2 text-sm font-semibold hover:bg-white/20 transition"
          >
            Book an Expedition
          </a>
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
      img: "/images/guidedday1.png",
    },
    {
      title: "Overnight Remote Camp",
      price: "from $2,500 – $3,000 / couple",
      desc: "Two-day off-road push, camp set-up, hot meals, stargazing.",
      img: "/images/Overnight1.jpg",
    },
    {
      title: "Ultimate 7-Day Expedition",
      price: "$25,000 – $30,000 / guest",
      desc: "Helicopter flyover, glacier trek, bush plane segment, lodge nights.",
      img: "/images/7day.jpg",
    },
  ];

  return (
    <section id="experiences" className="mx-auto max-w-7xl px-4 py-16">
      <h2 className="text-3xl md:text-4xl font-bold">Signature Experiences</h2>
      <p className="mt-2 text-neutral-300 max-w-3xl">
        Choose your pace—from a single day on iconic trails to week-long expeditions that mix off-road travel with glacier walks, bush plane drop-ins, and nights under the northern lights.
      </p>
      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {cards.map((x, i) => (
          <div key={i} className="group relative overflow-hidden rounded-2xl border border-white/10 bg-neutral-900/40">
            <img
              src={x.img}
              alt={x.title}
              className="h-44 w-full object-cover opacity-80 group-hover:scale-105 transition duration-500"
              loading="lazy"
            />
            <div className="p-5">
              <h3 className="text-xl font-semibold">{x.title}</h3>
              <div className="text-sm text-neutral-300 mt-1">{x.price}</div>
              <p className="mt-3 text-neutral-300">{x.desc}</p>
              <a
                href="#trip-builder"
                className="mt-4 inline-block rounded-xl bg-white text-neutral-900 px-4 py-2 font-semibold hover:bg-neutral-200"
              >
                Customize
              </a>
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
      <p className="mt-2 text-neutral-300 max-w-3xl">
        4&quot; lift • 37–40&quot; tires • 1-ton axles • Lockers • Winch • Skids • Roof rack • Fridge • Comms • Recovery kit • Camp systems • Airport pickup & drop-off available.
      </p>

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
          <p className="mt-3 text-neutral-300">
            We’ve spent years pushing deep into the backcountry—recoveries, remote routes, winter crossings.
            Alaska Offroad Expedition was built to share that world with guests who want the real thing—rugged, safe,
            and unforgettable.
          </p>
          <ul className="mt-5 list-disc pl-5 text-neutral-300 space-y-2">
            <li>Wilderness first aid & recovery trained</li>
            <li>Permits & partnerships across key regions</li>
            <li>Small groups, high guide-to-guest ratio</li>
          </ul>
        </div>
        <div className="rounded-2xl overflow-hidden border border-white/10 bg-neutral-900/40">
          <img src="/images/expedition2.bmp" alt="Glacier valley" className="w-full h-72 object-cover" loading="lazy" />
          <div className="p-5 text-neutral-300">
            “Not a tour—an expedition. The team handled everything. We just showed up and lived Alaska.”
          </div>
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
    { q: "What about weather & safety?", a: "We monitor conditions, carry satellite comms, and build conservative go/no-go plans for each route." },
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

function Contact() {
  return (
    <section id="contact" className="mx-auto max-w-7xl px-4 py-16">
      <div className="rounded-3xl border border-white/10 bg-neutral-900/50 p-8 md:p-12">
        <h2 className="text-3xl md:text-4xl font-bold">Talk to an Expedition Planner</h2>
        <p className="mt-2 text-neutral-300">
          Tell us your dates and must-do experiences. We’ll craft a custom itinerary and get permits rolling.
        </p>
        <form className="mt-6 grid gap-4 md:grid-cols-2">
          <input className="rounded-xl bg-neutral-800 px-4 py-3" placeholder="Full name" />
          <input className="rounded-xl bg-neutral-800 px-4 py-3" placeholder="Email" type="email" />
          <input className="rounded-xl bg-neutral-800 px-4 py-3 md:col-span-2" placeholder="Desired dates (flexible is okay)" />
          <textarea
            className="rounded-xl bg-neutral-800 px-4 py-3 md:col-span-2"
            rows={4}
            placeholder="Tell us what you want to experience (glacier, helicopter, zipline, remote camping, etc.)"
          />
          <button
            type="button"
            className="rounded-xl bg-white text-neutral-900 px-4 py-3 font-semibold hover:bg-neutral-200 md:col-span-2"
          >
            Request Itinerary
          </button>
        </form>
      </div>
    </section>
  );
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
