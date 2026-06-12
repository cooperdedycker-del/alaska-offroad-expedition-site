import { useState, } from "react";
import TripBuilder from "./TripBuilder";
import Experiences from "./Experiences";
import Excursions from "./Excursions";
import Sponsors from "./Sponsors";
import FAQ from "./FAQ";
import Merch from "./Merch";



export default function AlaskaOffroadExpedition() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [tripStatus, setTripStatus] = useState("idle"); // "idle" | "loading" | "success" | "error"
  const [tripError, setTripError] = useState("");
  return (
      <div id="top" className="min-h-screen bg-neutral-950 text-neutral-100">
      <header className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-neutral-950/70">
        <div className="mx-auto max-w-7xl px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a href="#top" className="h-9 w-9 rounded-lg overflow-hidden">
  <img
    src="/images/Newlogo.png"
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
            <a href="#experiences" className="hover:text-white">Expeditions</a>
            <a href="#excursions" className="hover:text-white">Excursions</a>
            <a href="#trip-builder" className="hover:text-white">Trip Builder</a>
            <a href="#merch" className="hover:text-white">Merch</a>
            <a href="#faq" className="hover:text-white">FAQ</a>
            <a href="#sponsors" className="hover:text-white">Sponsors</a>
            <a href="#contact" className="hover:text-white">Contact</a>
           
          </nav>
          <button onClick={() => setMobileNavOpen(!mobileNavOpen)} className="md:hidden text-white">☰</button>
          <a href="#trip-builder" className="hidden md:inline-flex items-center gap-2 rounded-2xl bg-white/10 px-4 py-2 text-sm font-semibold hover:bg-white/20 transition">Book an Expedition</a>
        </div>
        {mobileNavOpen && (
          <nav className="md:hidden flex flex-col items-center gap-4 pb-4 text-sm text-neutral-300">
            <a href="#experiences" onClick={() => setMobileNavOpen(false)}>Expeditions</a>
            <a href="#excursions" onClick={() => setMobileNavOpen(false)}>Excursions</a>
            <a href="#trip-builder" onClick={() => setMobileNavOpen(false)}>Trip Builder</a>
            <a href="#merch" onClick={() => setMobileNavOpen(false)}>Merch</a>
            <a href="#faq" onClick={() => setMobileNavOpen(false)}>FAQ</a>
            <a href="#sponsors" onClick={() => setMobileNavOpen(false)}>Sponsors</a>
            <a href="#contact" onClick={() => setMobileNavOpen(false)}>Contact</a>
            
          </nav>
        )}
      </header>

      <Hero />

<div className="mx-auto max-w-7xl px-4 py-4">
  <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
</div>

<Experiences />

<section id="trip-builder" className="relative">
  <TripBuilder />
</section>

<Excursions />
<Merch />
<Sponsors />
<FAQ />
<Contact />
<Footer />
    </div>
  );
}

/* ---------------- Components ---------------- */

function Hero() {
  return (
    <section className="w-full">
      <div className="relative h-[55vh] md:h-[70vh] overflow-hidden">
        <img
          src="/images/hero-illustration.png"
          alt="Alaska mountains"
          className="h-full w-full object-cover object-center"
          loading="lazy"
        />

        <div className="absolute inset-0 bg-black/10" />


        <div className="absolute bottom-0 left-0 right-0">
          <div className="mx-auto max-w-7xl px-4 pb-8 md:pb-10">
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="#trip-builder"
                className="rounded-xl bg-white px-6 py-3 font-semibold text-neutral-900 shadow-lg transition hover:bg-neutral-200"
              >
                Build Your Trip
              </a>

              <a
                href="#experiences"
                className="rounded-xl border border-white/40 bg-black/30 px-6 py-3 font-semibold text-white shadow-lg backdrop-blur-sm transition hover:bg-white/10"
              >
                Watch Video
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}








function Contact() {
  const [status, setStatus] = useState("idle"); // "idle" | "loading" | "success" | "error"
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    dates: "",
    message: "",
  });

  const update = (patch) => setForm((f) => ({ ...f, ...patch }));

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    // 🔴 Validation
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setStatus("error");
      setError("Please include your name, email, and a short message.");
      return;
    }

    try {
      setStatus("loading");

      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          form: {
            name: form.name,
            email: form.email,
            phone: form.phone,
            dates: form.dates,
            message: form.message,
            source: "Bottom contact form",
          },
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.error || "Failed to send message");
      }

      // ✅ SUCCESS
      setStatus("success");
      setError("");
      setForm({ name: "", email: "", phone: "", dates: "", message: "" });
    } catch (err) {
      console.error("Contact form error:", err);
      setStatus("error");
      setError("Something went wrong sending your message. Please try again.");
    }
  };

  return (
    <section id="contact" className="mx-auto max-w-7xl px-4 py-16">
      <div className="rounded-3xl border border-white/10 bg-neutral-900/50 p-8 md:p-12">
        {/* Call Now CTA */}
        <div className="mb-10 flex flex-col items-center gap-3 text-center">
          <div className="text-sm uppercase tracking-wider text-neutral-400">
            Prefer to talk now?
          </div>

          <a
            href="tel:9074067901"
            className="inline-flex items-center justify-center rounded-2xl bg-amber-400 px-6 py-3 font-bold text-neutral-900 hover:bg-amber-300 transition"
          >
            Call Now
          </a>

          <div className="text-2xl md:text-3xl font-extrabold text-amber-400 tracking-wide">
            907-406-7901
          </div>
          
          <div className="text-sm text-neutral-400 max-w-xl">
            Speak directly with an expedition planner to discuss availability, routes, and custom options.
          </div>
        </div>

        <h2 className="text-3xl md:text-4xl font-bold text-center">
          Talk to an Expedition Planner
        </h2>
        <p className="mt-3 text-neutral-300 text-center max-w-3xl mx-auto">
          Tell us your dates and must-do experiences. We’ll craft a custom itinerary and take care of everything!
        </p>

        {/* Status messages */}
        <div className="mt-4">
          {status === "success" && (
            <div className="mb-4 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
              Message sent! We’ll get back to you soon about your Alaska Expedition.
            </div>
          )}

          {status === "error" && error && (
            <div className="mb-4 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}
        </div>

        <form onSubmit={submit} className="mt-6 grid gap-4 md:grid-cols-2">
          <input
            className="rounded-xl bg-neutral-800 px-4 py-3"
            placeholder="Full name"
            value={form.name}
            onChange={(e) => update({ name: e.target.value })}
          />

          <input
            className="rounded-xl bg-neutral-800 px-4 py-3"
            placeholder="Email"
            type="email"
            value={form.email}
            onChange={(e) => update({ email: e.target.value })}
          />

          <input
            className="rounded-xl bg-neutral-800 px-4 py-3"
            placeholder="Phone number"
            value={form.phone}
            onChange={(e) => update({ phone: e.target.value })}
          />

          <input
            className="rounded-xl bg-neutral-800 px-4 py-3 md:col-span-2"
            placeholder="Desired dates (flexible is okay)"
            value={form.dates}
            onChange={(e) => update({ dates: e.target.value })}
          />

          <textarea
            className="rounded-xl bg-neutral-800 px-4 py-3 md:col-span-2"
            rows={4}
            placeholder="Tell us what you want to experience (glacier, helicopter, zipline, remote camping, etc.)"
            value={form.message}
            onChange={(e) => update({ message: e.target.value })}
          />

          <button
            type="submit"
            disabled={status === "loading"}
            className="rounded-xl bg-white text-neutral-900 px-4 py-3 font-semibold hover:bg-neutral-200 md:col-span-2 disabled:opacity-60"
          >
            {status === "loading" ? "Sending..." : "Request Itinerary"}
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


