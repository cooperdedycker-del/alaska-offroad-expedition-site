import { useState, } from "react";
import Packages from "./components/Packages";
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
  <a href="#experiences" className="hover:text-white">
    Intro
  </a>

   <a href="#trip-builder" className="hover:text-white">
    Trip Builder
  </a>

  <a href="#packages" className="hover:text-white">
    Packages
  </a>

  <a href="#merch" className="hover:text-white">
    Merch
  </a>

  <a href="#faq" className="hover:text-white">
    FAQ
  </a>

  <a href="#sponsors" className="hover:text-white">
    Sponsors
  </a>

    <a href="#excursions" className="hover:text-white">
    Add on Excursions
  </a>

  <a href="#contact" className="hover:text-white">
    Contact
  </a>
</nav>
          <button onClick={() => setMobileNavOpen(!mobileNavOpen)} className="md:hidden text-white">☰</button>
          <a href="#trip-builder" className="hidden md:inline-flex items-center gap-2 rounded-2xl bg-white/10 px-4 py-2 text-sm font-semibold hover:bg-white/20 transition">Book an Expedition</a>
        </div>
        {mobileNavOpen && (
  <nav className="md:hidden flex flex-col items-center gap-4 pb-4 text-sm text-neutral-300">
    <a
      href="#experiences"
      onClick={() => setMobileNavOpen(false)}
    >
      Intro
    </a>
    <a
      href="#trip-builder"
      onClick={() => setMobileNavOpen(false)}
    >
      Trip Builder
    </a>

    <a
      href="#packages"
      onClick={() => setMobileNavOpen(false)}
    >
      Packages
    </a>

    <a
      href="#merch"
      onClick={() => setMobileNavOpen(false)}
    >
      Merch
    </a>

    <a
      href="#faq"
      onClick={() => setMobileNavOpen(false)}
    >
      FAQ
    </a>

    <a
      href="#sponsors"
      onClick={() => setMobileNavOpen(false)}
    >
      Sponsors
    </a>

       <a
      href="#excursions"
      onClick={() => setMobileNavOpen(false)}
    >
      Add on Excursions
    </a>


    <a
      href="#contact"
      onClick={() => setMobileNavOpen(false)}
    >
      Contact
    </a>
  </nav>
)}
      </header>

<Hero />

<div className="mx-auto max-w-7xl px-4 py-4">
  <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
</div>

<Experiences />
<GuideCTA />

<section id="packages" className="relative scroll-mt-24">
  <Packages />
  <GuideCTA />
</section>

<section id="trip-builder" className="relative scroll-mt-24">
  <TripBuilder />
</section>

<GuideCTA />
<Merch />

<GuideCTA />
<Sponsors />

<GuideCTA />
<Excursions />

<GuideCTA />
<FAQ />
<Contact />
<Footer />
    </div>
  );
}


function GuideCTA() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="flex justify-center">

        <a
          href="#contact"
          className="
            group relative inline-flex items-center justify-center
            gap-3 overflow-hidden rounded-2xl
            border border-orange-300/50
            bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500
            px-8 py-4
            text-base font-extrabold tracking-wide text-white
            shadow-[0_0_20px_rgba(249,115,22,0.45),0_0_45px_rgba(249,115,22,0.18)]
            transition-all duration-300
            hover:scale-105
            hover:from-orange-500 hover:via-orange-400 hover:to-amber-400
            hover:shadow-[0_0_30px_rgba(249,115,22,0.75),0_0_65px_rgba(249,115,22,0.35)]
            active:scale-95
            focus-visible:outline-none
            focus-visible:ring-2 focus-visible:ring-orange-300
            focus-visible:ring-offset-2 focus-visible:ring-offset-black
          "
        >

          {/* Chat Icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="transition-transform duration-300 group-hover:rotate-[-10deg]"
          >
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
          </svg>

          <span>Chat With Your Guide</span>

          {/* Arrow */}
          <span
            aria-hidden="true"
            className="text-xl transition-transform duration-300 group-hover:translate-x-1"
          >
            →
          </span>

        </a>

      </div>
    </div>
  );
}


/* ---------------- Components ---------------- */

function Hero() {
  return (
    <section className="w-full">

      {/* Mobile Hero */}
      <div className="block md:hidden bg-black">
        <div className="px-4 pt-6">
          <img
            src="/images/hero-mobile-sticker.png"
            alt="Alaska Offroad Expedition"
            className="mx-auto w-full max-w-md h-auto object-contain"
            loading="eager"
          />
        </div>

        <div className="mx-auto max-w-7xl px-4 pb-6 pt-4">

          {/* First Row - Two Buttons */}
          <div className="flex flex-wrap justify-center gap-3">
            <a
              href="#trip-builder"
              className="rounded-xl border border-white/40 bg-black/30 px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-white/10"
            >
              Build Your Trip
            </a>

            <a
              href="#packages"
              className="rounded-xl border border-white/40 bg-black/30 px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-white/10"
            >
              View Packages
            </a>
          </div>

          
{/* Mobile - Glowing Chat With Your Guide */}
<div className="mt-5 flex justify-center">
  <a
    href="#contact"
    className="
      group relative inline-flex items-center justify-center
      gap-3 rounded-2xl
      border border-orange-300/50
      bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500
      px-8 py-4
      text-sm font-extrabold tracking-wide text-white
      shadow-[0_0_20px_rgba(249,115,22,0.55),0_0_45px_rgba(249,115,22,0.25)]
      transition-all duration-300
      hover:scale-105
      hover:shadow-[0_0_30px_rgba(249,115,22,0.8),0_0_65px_rgba(249,115,22,0.4)]
      active:scale-95
    "
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>

    <span>Chat With Your Guide</span>
    <span aria-hidden="true" className="text-xl">→</span>
  </a>
</div>


          {/* Third Row - Watch Videos */}
          <div className="mt-4 flex justify-center">
            <a
              href="https://www.youtube.com/@alaskaoffroadexpeditions"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl border border-white/40 bg-black/30 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-white/10"
            >
              Watch Videos
            </a>
          </div>

        </div>
      </div>

      {/* Desktop Hero */}
      <div className="relative hidden md:block overflow-hidden">
        <img
          src="/images/hero-illustration.png"
          alt="Alaska mountains"
          className="h-[70vh] w-full object-cover object-center"
          loading="eager"
        />

        <div className="absolute inset-0 bg-black/10" />

        <div className="absolute bottom-0 left-0 right-0">
          <div className="mx-auto max-w-7xl px-4 pb-8 md:pb-10">

            {/* First Row - Two Buttons */}
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="#trip-builder"
                className="rounded-xl border border-white/40 bg-black/30 px-6 py-3 font-semibold text-white shadow-lg backdrop-blur-sm transition hover:bg-white/10"
              >
                Build Your Trip
              </a>

              <a
                href="#packages"
                className="rounded-xl border border-white/40 bg-black/30 px-6 py-3 font-semibold text-white shadow-lg backdrop-blur-sm transition hover:bg-white/10"
              >
                View Packages
              </a>
            </div>

            
{/* Desktop - Glowing Chat With Your Guide */}
<div className="mt-5 flex justify-center">
  <a
    href="#contact"
    className="
      group relative inline-flex items-center justify-center
      gap-3 rounded-2xl
      border border-orange-300/50
      bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500
      px-10 py-4
      text-lg font-extrabold tracking-wide text-white
      shadow-[0_0_25px_rgba(249,115,22,0.65),0_0_55px_rgba(249,115,22,0.3)]
      transition-all duration-300
      hover:scale-105
      hover:shadow-[0_0_35px_rgba(249,115,22,0.9),0_0_75px_rgba(249,115,22,0.45)]
      active:scale-95
    "
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="23"
      height="23"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>

    <span>Chat With Your Guide</span>

    <span
      aria-hidden="true"
      className="text-xl transition-transform duration-300 group-hover:translate-x-1"
    >
      →
    </span>
  </a>
</div>


          </div>
        </div>
      </div>

    </section>
  );
}










function Contact() {
  const [status, setStatus] = useState("idle");
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

      setStatus("success");
      setError("");
      setForm({
        name: "",
        email: "",
        phone: "",
        dates: "",
        message: "",
      });
    } catch (err) {
      console.error("Contact form error:", err);
      setStatus("error");
      setError("Something went wrong sending your message. Please try again.");
    }
  };

 
  return (
   <section id="contact" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-16">
      <div className="rounded-3xl border border-white/10 bg-neutral-900/50 p-8 md:p-12">

        
<h2 className="text-3xl md:text-4xl font-bold text-center">
  Talk Directly With Your Guide
</h2>

<p className="mt-3 text-center text-sm text-neutral-400">
  Usually responds within 1–2 hours
</p>


        {/* Status Messages */}
        <div className="mt-4" aria-live="polite">
          {status === "success" && (
            <div className="mb-4 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
              Message sent! Your guide will get back to you soon.
            </div>
          )}

          {status === "error" && error && (
            <div className="mb-4 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}
        </div>

        {/* Contact Form */}
        <form onSubmit={submit} className="mt-6 grid gap-4 md:grid-cols-2">
          <input
            className="rounded-xl bg-neutral-800 px-4 py-3"
            placeholder="Full name"
            aria-label="Full name"
            required
            value={form.name}
            onChange={(e) => update({ name: e.target.value })}
          />

          <input
            className="rounded-xl bg-neutral-800 px-4 py-3"
            placeholder="Email address"
            aria-label="Email address"
            type="email"
            required
            value={form.email}
            onChange={(e) => update({ email: e.target.value })}
          />

          <input
            className="rounded-xl bg-neutral-800 px-4 py-3"
            placeholder="Phone number"
            aria-label="Phone number"
            type="tel"
            value={form.phone}
            onChange={(e) => update({ phone: e.target.value })}
          />

          <input
            className="rounded-xl bg-neutral-800 px-4 py-3 md:col-span-2"
            placeholder="Desired travel dates (flexible is okay)"
            aria-label="Desired travel dates"
            value={form.dates}
            onChange={(e) => update({ dates: e.target.value })}
          />

          <textarea
            className="rounded-xl bg-neutral-800 px-4 py-3 md:col-span-2"
            rows={4}
            placeholder="Tell us what your perfect Alaska adventure looks like! What do you want to see, where do you want to explore, and what experiences are on your bucket list? Have questions? Ask away! We're here to help make your Alaska off-road adventure unforgettable."
            aria-label="Your message"
            required
            value={form.message}
            onChange={(e) => update({ message: e.target.value })}
          />

          <button
            type="submit"
            disabled={status === "loading"}
            className="rounded-xl bg-white text-neutral-900 px-4 py-3 font-semibold hover:bg-neutral-200 md:col-span-2 disabled:opacity-60 transition"
          >
            {status === "loading" ? "Sending..." : "Send Message to Your Guide"}
          </button>
        </form>

     
{/* Call Now - Glowing Gold Button */}
<div className="mt-8 border-t border-white/10 pt-8 flex flex-col items-center gap-4 text-center">

  <a
    href="tel:9074067901"
    className="
      group relative inline-flex items-center justify-center
      gap-3 rounded-2xl
      border border-yellow-200/60
      bg-gradient-to-r from-yellow-500 via-amber-400 to-yellow-500
      px-10 py-4
      text-lg font-extrabold tracking-wide text-neutral-900
      shadow-[0_0_25px_rgba(250,204,21,0.6),0_0_55px_rgba(245,158,11,0.3)]
      transition-all duration-300
      hover:scale-105
      hover:from-yellow-400 hover:via-amber-300 hover:to-yellow-400
      hover:shadow-[0_0_35px_rgba(250,204,21,0.85),0_0_75px_rgba(245,158,11,0.45)]
      active:scale-95
      focus-visible:outline-none
      focus-visible:ring-2 focus-visible:ring-yellow-300
      focus-visible:ring-offset-2 focus-visible:ring-offset-black
    "
  >

    {/* Phone Icon */}
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="23"
      height="23"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.79 19.79 0 0 1 11.19 18a19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.09 3.18 2 2 0 0 1 4.08 1h3a2 2 0 0 1 2 1.72c.12.96.35 1.91.68 2.81a2 2 0 0 1-.45 2.11L8.04 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.33 1.85.56 2.81.68A2 2 0 0 1 22 16.92z" />
    </svg>

    <span>Call Now</span>

    <span
      aria-hidden="true"
      className="text-xl transition-transform duration-300 group-hover:translate-x-1"
    >
      →
    </span>

  </a>

  {/* Phone Number */}
  <a
    href="tel:9074067901"
    className="text-2xl md:text-3xl font-extrabold text-amber-400 tracking-wide transition hover:text-amber-300"
  >
    907-406-7901
  </a>

</div>


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


