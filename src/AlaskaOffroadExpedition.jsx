import { useEffect, useState } from "react";
import Experiences from "./Experiences";
import HomepageExperienceCatalog from "./HomepageExperienceCatalog";
import Sponsors from "./Sponsors";
import FAQ from "./FAQ";
import Merch from "./Merch";



export default function AlaskaOffroadExpedition() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  useEffect(() => {
    function refreshCartCount() {
      try {
        const items = JSON.parse(localStorage.getItem("aoe-merch-cart-v1") || "[]");
        setCartCount(Array.isArray(items) ? items.reduce((sum, item) => sum + Number(item.quantity || 0), 0) : 0);
      } catch {
        setCartCount(0);
      }
    }
    refreshCartCount();
    window.addEventListener("aoe-merch-cart-updated", refreshCartCount);
    window.addEventListener("storage", refreshCartCount);
    return () => {
      window.removeEventListener("aoe-merch-cart-updated", refreshCartCount);
      window.removeEventListener("storage", refreshCartCount);
    };
  }, []);
  return (
      <div id="top" className="min-h-screen bg-neutral-950 text-neutral-100">
      <header className="sticky top-0 z-40 border-b border-orange-400/20 bg-neutral-950/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
          <div className="flex min-w-0 items-center gap-3">
            <a href="#top" className="h-9 w-9 shrink-0 overflow-hidden rounded-lg">
              <img src="/images/Newlogo.png" alt="Alaska Offroad Expedition logo" className="h-full w-full object-contain" />
            </a>
            <a href="#top" className="truncate text-sm font-semibold tracking-wide transition hover:text-white/80 sm:text-lg">
              Alaska Offroad Expedition
            </a>
          </div>

          <nav className="hidden items-center gap-3 text-xs text-neutral-300 lg:flex xl:gap-5 xl:text-sm" aria-label="Main navigation">
            <a href="/plan-your-trip" className="whitespace-nowrap hover:text-white">Plan Your Trip</a>
            <a href="#excursions" className="whitespace-nowrap hover:text-white">Add on Excursions</a>
            <a href="#merch" className="hover:text-white">Merch</a>
            <a href="#faq" className="hover:text-white">FAQ</a>
            <a href="#sponsors" className="hover:text-white">Sponsors</a>
            <a href="#contact" className="hover:text-white">Contact</a>
          </nav>

          <div className="hidden shrink-0 items-center gap-2 lg:flex">
            <a href="/plan-your-trip" className="inline-flex items-center justify-center whitespace-nowrap rounded-xl border border-orange-300/50 bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 px-3 py-2 text-xs font-extrabold text-white shadow-[0_0_16px_rgba(249,115,22,0.4)] transition hover:brightness-110 xl:px-4 xl:text-sm">
              Book an Expedition <span aria-hidden="true" className="ml-1">→</span>
            </a>
            <a href="#contact" className="inline-flex items-center justify-center whitespace-nowrap rounded-xl border border-orange-300/50 bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 px-3 py-2 text-xs font-extrabold text-white shadow-[0_0_16px_rgba(249,115,22,0.4)] transition hover:brightness-110 xl:px-4 xl:text-sm">
              Chat With Your Guide <span aria-hidden="true" className="ml-1">→</span>
            </a>
          </div>

          <a
            href="#merch-cart"
            aria-label={`View merchandise cart, ${cartCount} items`}
            title="Merch Cart"
            className="relative inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-orange-400/50 bg-orange-500/10 text-orange-200 transition hover:bg-orange-500/20"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6" aria-hidden="true">
              <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.4 12.3a2 2 0 0 0 2 1.7h9.8a2 2 0 0 0 2-1.6L23 6H6"/>
            </svg>
            {cartCount > 0 && <span className="absolute -right-2 -top-2 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-orange-500 px-1 text-[10px] font-black text-white">{cartCount > 99 ? "99+" : cartCount}</span>}
          </a>

          <button
            type="button"
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileNavOpen}
            className="shrink-0 rounded-lg border border-white/20 px-3 py-2 text-white lg:hidden"
          >
            ☰
          </button>
        </div>

        {mobileNavOpen && (
          <nav className="flex flex-col items-stretch gap-3 border-t border-white/10 px-4 py-4 text-sm text-neutral-300 lg:hidden" aria-label="Mobile navigation">
            <a href="/plan-your-trip" onClick={() => setMobileNavOpen(false)}>Plan Your Trip</a>
            <a href="#excursions" onClick={() => setMobileNavOpen(false)}>Add on Excursions</a>
            <a href="#merch" onClick={() => setMobileNavOpen(false)}>Merch</a>
            <a href="#faq" onClick={() => setMobileNavOpen(false)}>FAQ</a>
            <a href="#sponsors" onClick={() => setMobileNavOpen(false)}>Sponsors</a>
            <a href="#contact" onClick={() => setMobileNavOpen(false)}>Contact</a>
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              <a href="/plan-your-trip" onClick={() => setMobileNavOpen(false)} className="rounded-xl border border-orange-300/50 bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 px-4 py-3 text-center font-extrabold text-white shadow-[0_0_16px_rgba(249,115,22,0.4)]">
                Book an Expedition →
              </a>
              <a href="#contact" onClick={() => setMobileNavOpen(false)} className="rounded-xl border border-orange-300/50 bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 px-4 py-3 text-center font-extrabold text-white shadow-[0_0_16px_rgba(249,115,22,0.4)]">
                Chat With Your Guide →
              </a>
            </div>
          </nav>
        )}
      </header>

<Hero />

<WelcomeIntro />

<div className="mx-auto max-w-7xl px-4 py-4">
  <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
</div>

<Experiences />

<HomepageExperienceCatalog />



<Merch />



<FAQ />
<Sponsors />

<Contact />
<Footer />
    </div>
  );
}


/* ---------------- Welcome / What We Do ---------------- */

function WelcomeIntro() {
  return (
    <section aria-labelledby="welcome-intro-title" className="mx-auto max-w-7xl px-4 py-8 sm:py-10">
      <div className="rounded-3xl border border-orange-400/30 bg-neutral-900/50 px-5 py-8 text-center shadow-xl sm:px-10 sm:py-10">
        <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-orange-400">Welcome to Alaska Off-Road Expedition</p>
        <h2 id="welcome-intro-title" className="mt-3 text-2xl font-extrabold uppercase tracking-wide text-white sm:text-3xl lg:text-4xl">
          Your Alaska Adventure, Your Way
        </h2>
        <p className="mx-auto mt-4 max-w-3xl text-sm leading-7 text-neutral-300 sm:text-base">
          Build a custom Alaska adventure around what you want to experience. Drive one of our expedition-ready Jeeps or ride with your guide, explore incredible off-road trails, and add unforgettable excursions along the way.
        </p>
        <p className="mx-auto mt-3 max-w-3xl text-sm leading-7 text-neutral-300 sm:text-base">
          From airport pickup and lodging to guided adventures and coordinating your excursions, we handle the details. One trip, one itinerary, and one place to plan it all.
        </p>
        <div className="mx-auto mt-6 flex max-w-3xl flex-wrap items-center justify-center gap-x-3 gap-y-2 text-xs font-semibold text-orange-200 sm:text-sm">
          <span>Pick Your Dates</span><span className="text-orange-400" aria-hidden="true">→</span>
          <span>Choose Your Adventures</span><span className="text-orange-400" aria-hidden="true">→</span>
          <span>We Handle the Rest</span>
        </div>
        <a href="/plan-your-trip" className="mt-7 inline-flex items-center justify-center rounded-xl border border-orange-300/50 bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 px-7 py-3 text-sm font-extrabold text-white shadow-[0_0_20px_rgba(249,115,22,0.4)] transition hover:brightness-110 sm:text-base">
          Start Here - Build Your Alaska Expedition <span aria-hidden="true" className="ml-2">→</span>
        </a>
      </div>
    </section>
  );
}

/* ---------------- Components ---------------- */

function Hero() {
  const actionButtonStyle = `
    group relative inline-flex items-center justify-center
    gap-2 md:gap-3
    min-w-0 flex-1 md:flex-none
    md:min-w-[270px]
    rounded-2xl
    border border-orange-300/50
    bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500
    px-3 py-4 md:px-10
    text-xs sm:text-sm md:text-lg
    font-extrabold tracking-wide text-white
    text-center
    shadow-[0_0_20px_rgba(249,115,22,0.55),0_0_45px_rgba(249,115,22,0.25)]
    md:shadow-[0_0_25px_rgba(249,115,22,0.65),0_0_55px_rgba(249,115,22,0.3)]
    transition-all duration-300
    hover:scale-105
    hover:from-orange-500 hover:via-orange-400 hover:to-amber-400
    hover:shadow-[0_0_30px_rgba(249,115,22,0.9),0_0_65px_rgba(249,115,22,0.45)]
    active:scale-95
    focus-visible:outline-none
    focus-visible:ring-2
    focus-visible:ring-orange-300
    focus-visible:ring-offset-2
    focus-visible:ring-offset-black
  `;

  function ActionButtons() {
    return (
      <div className="flex w-full items-stretch justify-center gap-3 md:gap-5">

        {/* Plan Your Trip */}
        <a
          href="/plan-your-trip"
          className={actionButtonStyle}
        >
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
            className="hidden shrink-0 sm:block"
          >
            <path d="M3 6l6-3 6 3 6-3v15l-6 3-6-3-6 3V6z" />
            <path d="M9 3v15M15 6v15" />
          </svg>

          <span>Plan Your Trip</span>

          <span
            aria-hidden="true"
            className="shrink-0 text-lg transition-transform duration-300 group-hover:translate-x-1"
          >
            →
          </span>
        </a>

        {/* Chat With Your Guide */}
        <a
          href="#contact"
          className={actionButtonStyle}
        >
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
            className="hidden shrink-0 sm:block"
          >
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
          </svg>

          <span>Chat With Your Guide</span>

          <span
            aria-hidden="true"
            className="shrink-0 text-lg transition-transform duration-300 group-hover:translate-x-1"
          >
            →
          </span>
        </a>

      </div>
    );
  }

  return (
    <section className="w-full">

      {/* ========================================
          MOBILE HERO
      ======================================== */}
      <div className="block bg-black md:hidden">

     {/* Mobile Hero Image */}
<div className="flex w-full items-center justify-center bg-black px-4 pt-6">
  <div className="mx-auto aspect-square w-full max-w-[420px] overflow-hidden rounded-full bg-black">
    <img
      src="/images/hero-mobile-sticker.png"
      alt="Alaska Offroad Expedition"
      className="block h-full w-full rounded-full object-cover"
      loading="eager"
    />
  </div>
</div>

<div className="mx-auto max-w-7xl px-4 pb-8 pt-8">

  {/* Mobile Main Buttons */}
  <ActionButtons />

   

        </div>
      </div>

      {/* ========================================
          DESKTOP HERO
      ======================================== */}
      <div className="relative hidden overflow-hidden md:block">

        {/* Desktop Hero Image */}
        <img
          src="/images/hero-illustration.png"
          alt="Alaska mountains"
          className="h-[70vh] w-full object-cover object-center"
          loading="eager"
        />

        {/* Image Overlay */}
        <div className="absolute inset-0 bg-black/10" />

        {/* Desktop Main Buttons */}
<div className="absolute bottom-0 left-0 right-0 z-20">
  <div className="mx-auto max-w-7xl px-4 pb-0">

    <ActionButtons />

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
   <section id="contact" className="mx-auto max-w-7xl scroll-mt-40 px-4 py-16">
      <div className="rounded-3xl border border-white/25 bg-neutral-900/30 p-5 shadow-xl sm:p-8 lg:p-10">

        
<h2 className="text-center text-4xl font-extrabold uppercase tracking-wide text-white md:text-5xl lg:text-6xl">
  CONTACT YOUR GUIDE
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
          <a href="/plan-your-trip" className="hover:text-neutral-200">Plan Your Trip</a>
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


