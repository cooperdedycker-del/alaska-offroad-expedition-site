import { useState, useMemo, useRef, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";



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
    src="/images/android-chrome-512x512.png"
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
            <a href="#fleet" className="hover:text-white">Fleet</a>
            <a href="#trip-builder" className="hover:text-white">Trip Builder</a>
            <a href="#about" className="hover:text-white">About</a>
            <a href="#faq" className="hover:text-white">FAQ</a>
            <a href="#sponsors" className="hover:text-white">Sponsors</a>
            <a href="#contact" className="hover:text-white">Contact</a>
            <a href="https://alaskaoffroadlions.org" target="_blank" rel="noopener noreferrer" className="hover:text-white font-semibold text-amber-400">Off-Road Nonprofit</a>
          </nav>
          <button onClick={() => setMobileNavOpen(!mobileNavOpen)} className="md:hidden text-white">☰</button>
          <a href="#trip-builder" className="hidden md:inline-flex items-center gap-2 rounded-2xl bg-white/10 px-4 py-2 text-sm font-semibold hover:bg-white/20 transition">Book an Expedition</a>
        </div>
        {mobileNavOpen && (
          <nav className="md:hidden flex flex-col items-center gap-4 pb-4 text-sm text-neutral-300">
            <a href="#experiences" onClick={() => setMobileNavOpen(false)}>Expeditions</a>
            <a href="#excursions" onClick={() => setMobileNavOpen(false)}>Excursions</a>
            <a href="#fleet" onClick={() => setMobileNavOpen(false)}>Fleet</a>
            <a href="#trip-builder" onClick={() => setMobileNavOpen(false)}>Trip Builder</a>
            <a href="#about" onClick={() => setMobileNavOpen(false)}>About</a>
            <a href="#faq" onClick={() => setMobileNavOpen(false)}>FAQ</a>
            <a href="#sponsors" onClick={() => setMobileNavOpen(false)}>Sponsors</a>
            <a href="#contact" onClick={() => setMobileNavOpen(false)}>Contact</a>
            <a href="https://alaskaoffroadlions.org" target="_blank" rel="noopener noreferrer" className="hover:text-white font-semibold text-amber-400" onClick={() => setMobileNavOpen(false)}>Off-Road Nonprofit</a>
          </nav>
        )}
      </header>

      <Hero />
      <TrustBar />
      <Experiences />
      <Excursions />
      <Fleet />
      <section id="trip-builder" className="relative">
        <TripBuilder />
      </section>
      <About />
      <Sponsors />
      <Contact />
        <FAQ />
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
        <div>✔ Experienced guides</div>
        <div>✔ Expedition ready</div>
        <div>✔ Local Alaska experiences</div>
        <div>✔ Customizable itineraries</div>
      </div>
    </section>
  );
}

function Experiences() {
  const cards = [
    {
      tier: "Signature",
      title: "14-Day Ultimate Guided Expedition",
      price: "Starting at $15,000+",
      desc:
        "A full-state, multi-week expedition built around the best of Alaska. Includes expedition rigs, daily guiding, lodging, excursions, and all essential gear. Helicopter tours, glacier climbing, mine tours, dirt bikes, and more—planned end-to-end.",
      img: "/images/7day.jpg",
      bullets: [
        "Rigs included",
        "Guided daily",
        "Excursions included",
        "Lodging included",
        "All gear included",
      ],
    },
    {
      tier: "Signature",
      title: "7-Day Guided Expedition (All-In)",
      price: "Starting at $7,500+",
      desc:
        "A week-long guided expedition with an expedition rig, curated routes, lodging, and top excursions. Built for guests who want the full Alaska experience without the multi-week timeline.",
      img: "/images/7 day trip.jpg",
      bullets: [
        "Rigs included",
        "Guided daily",
        "Excursions + lodging",
        "Route planning + logistics",
      ],
    },
    {
      tier: "Popular",
      title: "3-Day Remote Adventure (Guided + Camp/Lodge Mix)",
      price: "Starting at $3,500+",
      desc:
        "A long-weekend expedition that gets you deep into the backcountry. Includes guided trail days, a camp system, and optional lodge nights depending on your comfort level and the season.",
      img: "/images/Overnight1.jpg",
      bullets: [
        "Rig + guided trail days",
        "Camp system + meals",
        "Optional lodge nights",
      ],
    },
    {
      tier: "Popular",
      title: "Overnight Remote Camp (2-Day)",
      price: "Starting at $2,500+",
      desc:
        "Two days of off-road travel with camp setup, hot meals, and a true off-grid overnight. A perfect intro to expedition-style Alaska without committing to a full week.",
      img: "/images/Bolder creek Camp.jpg",
      bullets: ["Rig + guiding", "Meals + camp system", "Backcountry overnight"],
    },
    {
      tier: "Seasonal",
      title: "Knik Glacier Winter Day Tour (1-Day)",
      price: "Driver $500 • Passengers $300 each",
      desc:
        "Winter-only glacier day tour to Knik Glacier. Lunch is provided. One driver seat and up to six passenger seats available—ideal for families, groups, or visitors who want glacier views in a single day.",
      img: "/images/Knik .jpg",
      bullets: [
        "Winter-only",
        "Lunch included",
        "1 driver + up to 6 passengers",
        "Glacier destination: Knik",
      ],
    },
    {
      tier: "Entry",
      title: "1-Day Off-Road Experience (Choose Your difficulty Level)",
      price: "Driver $500 / $1000/ $1500 • Passengers $300 each",
      desc:
        "A guided one-day off-road experience with three difficulty levels—easy, moderate, or advanced. Lunch is provided. One driver seat and up to six passenger seats available (Between two rigs).",
      img: "/images/guidedday1.png",
      bullets: [
        "3 difficulty levels",
        "Lunch included",
        "1 driver + up to 6 passengers",
        "Perfect first-time experience",
      ],
    },
  ];

  return (
  <section id="experiences" className="mx-auto max-w-7xl px-4 py-16">
    <div className="mb-10 text-center">
      <h2 className="text-3xl md:text-4xl font-bold">
        Expedition Packages
      </h2>
      <p className="mt-3 text-neutral-300 max-w-3xl mx-auto">
        Premium, fully guided expeditions built around Alaska’s most iconic trails, glaciers, and remote backcountry.
        Choose a multi-week, full-service expedition—or start with a single-day adventure. Use the Trip Builder below to customize your dates, rig, and excursions.
      </p>
    </div>


      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {cards.map((x, i) => (
          <div
            key={i}
            className="group relative overflow-hidden rounded-2xl border border-white/10 bg-neutral-900/40"
          >
            <img
              src={x.img}
              alt={x.title}
              className="h-52 w-full object-cover opacity-85 group-hover:scale-105 transition duration-500"
              loading="lazy"
            />

            <div className="p-5">
              <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-neutral-200">
                {x.tier}
              </div>

              <h3 className="mt-3 text-xl font-semibold">{x.title}</h3>
              <div className="text-sm text-neutral-200 mt-1">{x.price}</div>

              <p className="mt-3 text-neutral-300">{x.desc}</p>

              {x.bullets?.length > 0 && (
                <ul className="mt-4 space-y-1 text-sm text-neutral-300">
                  {x.bullets.map((b, idx) => (
                    <li key={idx} className="flex gap-2">
                      <span className="text-neutral-500">•</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              )}

              <a
                href="#trip-builder"
                className="mt-5 inline-block rounded-xl bg-white text-neutral-900 px-4 py-2 font-semibold hover:bg-neutral-200"
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

function Excursions() {
  const partners = [
    {
      name: "St. Elias Alpine Guides",
      type: "Experiances / Glacier / Full service",
      desc: "Guided glacier travel, ice, and alpine objectives—ideal for bucket-list glacier days and technical adventures.",
      img: "/images/excursions/stellis1.jpg",
      website: "https://www.steliasguides.com",
    },
    {
      name: "Outbound Heli Adventures",
      type: "Helicopter / Glacier Access",
      desc: "Scenic flights, glacier landings, and remote ridge access—perfect for next-level views and unforgettable photo ops.",
      img: "/images/excursions/outbound1.jpg",
      website: "https://outboundheli.com/",
      
    },
    {
      name: "Alaska Premier Enduro",
      type: "Motorsports",
      desc: "Technical terrain and high-energy off-road Dirt Bike riding experiences for guests who want adrenaline and skill-based routes.",
      img: "/images/excursions/APE1.jpg",
      website: "https://www.alaskapremierendurollc.com/",
      
    },
       {
      name: "Gunsight Mountain Lodge",
      type: "Lodging",
      desc: "Gun Sight Mountain Lodge offers comfortable, welcoming accommodations at the base of one of Alaska’s most accessible and diverse off-road trail systems. Hosted by Hap, the lodge serves as an ideal home base for summer and winter adventures, providing easy access to trail riding, overland routes, snowmachine terrain, and backcountry exploration—all while offering a warm, relaxed place to recharge after a day in the outdoors.",
      img: "/images/excursions/GSML1.jpg",
      website: "https://www.facebook.com/gunsight.mtn.lodge/",
      
    },
    {
      name: "Hatcher Pass ATV Tours",
      type: "Alaska ATV and Snowmobile Tours",
      desc: "Explore Alaska’s backcountry on a guided ride through the rugged Talkeetna Mountains of Hatcher Pass with unmatched panoramic views, creek crossings, and Denali views on clear days—without sacrificing comfort.",
      img: "/images/excursions/HPATVT.jpg",
      website: "https://hatcherpasstour.com/",
    },
    {
      name: "Become a partner Today!",
      type: "Give us a call to get added to our list",
      desc: "We are always looking for bussniess to add to our partner list. Contact us today!",
      img: "/images/excursions/Looking for1.png",
      website: "https://www.alaskaoffroadexpedition.com/#contact",
    },
  ];

  return (
    <section id="excursions" className="mx-auto max-w-7xl px-4 py-16">
      {/* Centered header + description */}
      <div className="mb-10 text-center">
        <h2 className="text-3xl md:text-4xl font-bold">
          Local Alaska Experiences
        </h2>
        <p className="mt-3 text-neutral-300 max-w-3xl mx-auto">
          We partner with proven Alaska outfitters to integrate bucket-list experiences into your expedition.
          We coordinate logistics, timing, and planning so your trip flows smoothly.
        </p>
      </div>

      {/* Partner cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {partners.map((p) => (
          <div
            key={p.name}
            className="rounded-2xl overflow-hidden border border-white/10 bg-neutral-900/40"
          >
            <div className="aspect-[4/3] bg-black/30">
              <img
                src={p.img}
                alt={p.name}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>

            <div className="p-5">
              <div className="text-xs uppercase tracking-wider text-white/60">
                {p.type}
              </div>
              <div className="mt-2 font-semibold">{p.name}</div>
              <p className="mt-2 text-sm text-neutral-300">{p.desc}</p>
              <a href={p.website}target="_blank"rel="noopener noreferrer"
                     className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-white/10 px-4 py-2 text-sm font-semibold text-neutral-100 hover:bg-white/20 transition"
          >
                 Learn More
              </a>    


              <div className="mt-3 text-xs text-neutral-500">
                Excursion addons are selected in the trip builder
              </div>
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
    <div className="mb-10 text-center">
      <h2 className="text-3xl md:text-4xl font-bold">
        Expedition-Ready Rigs
      </h2>
      <p className="mt-3 text-neutral-300 max-w-3xl mx-auto">
        Built expedition vehicles equipped for Alaska’s most demanding terrain.
        37&quot; Lifted &quot; Heavy-duty bumpers &amp; winches • 
        Camping gear &amp; Full recovery.
      </p>
    </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {/* Jeep Gladiator */}
        <div className="rounded-2xl overflow-hidden border border-white/10 bg-neutral-900/40">
          <img
            src="/images/Wrangler140.jpg"
            alt="Jeep Gladiator expedition build on mountain trail"
            className="h-96 md:h-[28rem] w-full object-cover"
            loading="lazy"
          />
          <div className="p-5">
            <h3 className="text-xl font-semibold">
              Jeep Gladiator Expedition Build
            </h3>
            <p className="mt-2 text-neutral-300">
              37&quot; tires, steel bumpers, integrated winch,
              expedition suspension, comms, recovery equipment, and a SmartCap-based
              camp system designed for long-range travel in remote terrain.
            </p>
          </div>
        </div>

        {/* Toyota Tacoma */}
        <div className="rounded-2xl overflow-hidden border border-white/10 bg-neutral-900/40">
          <img
            src="/images/tacomaone40.jpeg"
            alt="Toyota Tacoma expedition build in the mountains"
            className="h-96 md:h-[28rem] w-full object-cover"
            loading="lazy"
          />
          <div className="p-5">
            <h3 className="text-xl font-semibold">
              Toyota Tacoma Expedition Build
            </h3>
            <p className="mt-2 text-neutral-300">
              2019 Tacoma TRD Off-Road on 37&quot; tires with a 6&quot; lift, heavy-duty
              bumper and winch, OVS topper and tent system, satellite comms,
              recovery gear, and cold-weather camping equipment for true off-grid comfort.
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
    {
      q: "Do I need off-road experience?",
      a: "No—our guides coach you on the trail. We tailor obstacles to your comfort level and conditions.",
    },
    {
      q: "What’s included on overnights?",
      a: "Camp setup and all safety gear are included. Bring personal layers and boots. Gear runs are available if needed.",
    },
    {
      q: "Is food included on the expedition?",
      a: "Not all food is provided. We plan dinners for guests while on the trail. Guests are responsible for breakfast and lunch.",
    },
    {
      q: "Can you pick us up at the airport?",
      a: "Yes. Airport pickup and drop-off, as well as hotel transfers, are available.",
    },
    {
      q: "What about weather & safety?",
      a: "We monitor conditions, carry satellite communications, and build conservative go/no-go plans for each route.",
    },
    {
  q: "What should I pack for the expedition?",
  a: "We provide a recommended packing list after booking. Guests should bring weather-appropriate clothing, sturdy boots, and personal items. All critical expedition gear and safety equipment are provided."
},
{
  q: "How physically demanding are the expeditions?",
  a: "Trips can be tailored to your comfort level. Most experiences are moderate, but some activities like hiking, glacier travel, or technical terrain can be more demanding depending on your selections."
},
{
  q: "Are your vehicles automatic or manual?",
  a: "All expedition vehicles are automatic and equipped for ease of use, even for drivers with limited off-road experience."
},
{
  q: "What happens if weather impacts the trip?",
  a: "Safety is our top priority. We may adjust routes, timing, or activities due to weather conditions. When possible, we provide equal or better alternative experiences."
},
{
  q: "Is there a minimum or maximum group size?",
  a: "We focus on small group experiences to maintain quality and safety. Most trips accommodate 1–2 drivers and up to 6 passengers depending on the package and vehicles."
},
{
  q: "Can we customize our expedition?",
  a: "Yes—every trip is customizable. You can choose your duration, rig, lodging style, and add-on excursions like helicopter flights or glacier tours."
},
{
  q: "Do you provide recovery support if something goes wrong?",
  a: "Yes. All expeditions include professional recovery equipment and trained guides. In the rare case of a mechanical issue or stuck vehicle, we handle recovery and logistics."
},
{
  q: "Is fuel included in the trip cost?",
  a: "Fuel is typically included for guided expeditions. Specific details will be outlined in your final itinerary depending on trip length and route."
},
{
  q: "Can beginners drive the vehicles?",
  a: "Yes. Our vehicles are built for capability and ease of use. Guides provide instruction and support to ensure you are comfortable and confident behind the wheel."
},
{
  q: "Do you operate year-round?",
  a: "Yes. Summer expeditions focus on remote trails and overlanding, while winter offers snow-based adventures such as glacier tours and snowmachine experiences."
},
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

function Sponsors() {
  const sponsors = [
    {
      name: "Carbon Offroad",
      img: "/images/sponsors/carbonoffroad.jpg",
      description:
        "Carbon Offroad builds premium winches and recovery gear engineered for serious off-road and expedition use. Their equipment is trusted on our Alaska expedition rigs in harsh terrain and remote recovery situations.",
      website: "https://carbonoffroadusa.com",
      badge: "Used on our rigs",
      discountCode: "ALASKAOFFROAD",
      featured: true,
    },
    {
      name: "Diode Dynamics",
      img: "/images/sponsors/Diodedynamics.png",
      description:
        "Diode Dynamics designs high-performance LED lighting systems built for extreme weather, off-road visibility, and dependable vehicle-specific fitment.",
      website: "https://diodedynamics.com",
      badge: "Trusted lighting partner",
      discountCode: "",
      featured: true,
    },
    {
      name: "Wolfbox",
      img: "/images/sponsors/wolfbox.webp",
      description:
        "Wolfbox produces advanced dash cam and rearview mirror camera systems that improve visibility, safety, and awareness—especially for rigs with toppers, trailers, gear, or limited rear visibility.",
      website:
        "https://wolfbox.com/products/wolfbox-g900tripro-bumper-version-3-channel-rearview-mirror?ref=yprxdscf&utm_source=goaff",
      badge: "Recommended gear",
      discountCode: "",
      featured: true,
    },
    {
      name: "VEVOR",
      img: "/images/sponsors/Vevor.png",
      description:
        "VEVOR offers a wide range of tools, shop equipment, and outdoor products that support fabrication, vehicle prep, camp setups, and expedition support gear.",
      website: "https://www.vevor.com",
      badge: "Shop & support gear",
      discountCode: "",
      featured: true,
    },
    {
  name: "OVS (Overland Vehicle Systems)",
  img: "/images/sponsors/OVS.webp",
  description:
    "Overland Vehicle Systems builds high-quality rooftop tents, awnings, recovery gear, and overland equipment designed for durability in extreme environments.",
  website: "https://overlandvehiclesystems.com",
  badge: "Overland gear partner",
  discountCode: "",
  featured: true,
},
{
  name: "Bubba Rope",
  img: "/images/sponsors/bubbarope.png",
  description:
    "Bubba Rope produces industry-leading kinetic recovery ropes and soft shackles designed for safe, efficient, and powerful vehicle recoveries.",
  website: "https://bubbarope.com",
  badge: "Recovery gear",
  discountCode: "AKOE10",
  featured: true,
},
{
  name: "PullPal",
  img: "/images/sponsors/Pulpall.png",
  description:
    "PullPal manufactures portable land anchors that allow for self-recovery in terrain where natural anchor points are not available—essential for remote off-road travel.",
  website: "https://pullpal.com",
  badge: "Recovery equipment",
  discountCode: "",
  featured: true,
},
{
  name: "Method Race Wheels",
  img: "/images/sponsors/Method.png",
  description:
    "Method Race Wheels builds high-performance wheels engineered for off-road strength, durability, and proven performance in extreme terrain.",
  website: "https://www.methodracewheels.com",
  badge: "Wheel partner",
  discountCode: "",
  featured: true,
},
{
  name: "FCK Lightbars",
  img: "/images/sponsors/FCK lightbars.avif",
  description:
    "FCK Lightbars delivers high-output LED lighting solutions designed for off-road visibility, durability, and performance in harsh conditions.",
  website: "https://fcklightbars.com",
  badge: "Lighting partner",
  discountCode: "ALASKAOFFROAD 15%",
  featured: true,
},
{
  name: "TrailToyz Offroad",
  img: "/images/sponsors/trailtoyz.png",
  description:
    "Local Offroad shop located in Wasilla, Alaska.",
  website: "https://trailtoyz.com",
  badge: "Local Shop",
  discountCode: "",
  featured: false,
},
{
  name: "AK Gear works",
  img: "/images/sponsors/akgearworks.jpg",
  description:
    "Local Offroad shop located in Wasilla, Alaska.",
  website: "https://www.facebook.com/people/AKGearworks/61587939817297/#",
  badge: "Local Shop",
  discountCode: "",
  featured: false,
},
  ];

  const featuredSponsors = sponsors.filter((s) => s.featured);
  const supportingSponsors = sponsors.filter((s) => !s.featured);

  return (
    <section id="sponsors" className="mx-auto max-w-7xl px-4 py-16">
      <div className="mb-12 text-center">
        <h2 className="text-3xl md:text-4xl font-bold">Featured Sponsors & Partners</h2>
        <p className="mt-3 text-neutral-300 max-w-3xl mx-auto">
          We’re proud to work with brands and companies that help power Alaska Offroad Expedition.
          These are products and partners we trust, use, and recommend.
        </p>

        <a
          href="#contact"
          className="mt-6 inline-flex items-center justify-center rounded-xl bg-amber-400 px-6 py-3 text-sm font-bold text-neutral-900 hover:bg-amber-300 transition"
        >
          Become a Sponsor
        </a>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {featuredSponsors.map((s) => (
          <div
            key={s.name}
            className="rounded-3xl overflow-hidden border border-white/10 bg-neutral-900/50"
          >
            <div className="h-44 flex items-center justify-center bg-black/30 p-6">
              <img
                src={s.img}
                alt={s.name}
                className="max-h-24 max-w-full object-contain"
                loading="lazy"
              />
            </div>

            <div className="p-6">
              {s.badge && (
                <div className="inline-flex rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-xs font-semibold text-amber-300">
                  {s.badge}
                </div>
              )}

              <div className="mt-3 text-xl font-semibold text-neutral-100">
                {s.name}
              </div>

              <p className="mt-3 text-sm text-neutral-300">
                {s.description}
              </p>

              {s.discountCode && (
                <div className="mt-4 rounded-xl border border-white/10 bg-neutral-800 px-4 py-3 text-sm">
                  <span className="text-neutral-400">Discount Code: </span>
                  <span className="font-bold text-amber-300">{s.discountCode}</span>
                </div>
              )}

              <a
                href={s.website}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex w-full items-center justify-center rounded-xl bg-white/10 px-4 py-3 text-sm font-semibold text-neutral-100 hover:bg-white/20 transition"
              >
                Visit Sponsor
              </a>
            </div>
          </div>
        ))}
      </div>

      {supportingSponsors.length > 0 && (
        <div className="mt-12 rounded-3xl border border-white/10 bg-neutral-900/40 p-6 md:p-8">
          <h3 className="text-2xl font-bold text-center">Supporting Sponsors</h3>
          <p className="mt-2 text-center text-sm text-neutral-400">
            Additional companies and gear partners helping support the mission.
          </p>

          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {supportingSponsors.map((s) => (
              <div
                key={s.name}
                className="rounded-2xl overflow-hidden border border-white/10 bg-neutral-900/50"
              >
                <div className="h-32 flex items-center justify-center bg-black/30 p-4">
                  <img
                    src={s.img}
                    alt={s.name}
                    className="max-h-20 max-w-full object-contain"
                    loading="lazy"
                  />
                </div>

                <div className="p-5 text-center">
                  {s.badge && (
                    <div className="inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-neutral-300">
                      {s.badge}
                    </div>
                  )}

                  <div className="mt-3 text-lg font-semibold text-neutral-100">
                    {s.name}
                  </div>

                  <p className="mt-2 text-sm text-neutral-300">
                    {s.description}
                  </p>

                  {s.discountCode && (
                    <div className="mt-4 rounded-xl border border-white/10 bg-neutral-800 px-4 py-3 text-sm">
                      <span className="text-neutral-400">Discount Code: </span>
                      <span className="font-bold text-amber-300">{s.discountCode}</span>
                    </div>
                  )}

                  <a
                    href={s.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-white/10 px-4 py-3 text-sm font-semibold text-neutral-100 hover:bg-white/20 transition"
                  >
                    Visit Sponsor
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
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
          <a
  href="mailto:Cooper@alaskaoffroadexpedition.com"
  className="text-sm md:text-base font-semibold text-neutral-300 hover:text-white transition"
>
  Cooper@alaskaoffroadexpedition.com
</a>


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

/* ---------------- Trip Builder ---------------- */

function TripBuilder() {
  const topRef = useRef(null);
  const PACKAGES = [
    {
      id: "ultimate-multiweek",
      title: "Ultimate Alaska Expedition (Multi-Week)",
      priceLabel: "Starting at $15,000+",
      desc:
        "Multi-week expedition across Alaska. Includes rigs, daily guiding, excursions, lodging, and all essential gear. Helicopter tours, glacier climbing, mine tours, dirt bikes, and more.",
      airportIncluded: true,
    },
    {
      id: "guided-week",
      title: "7-Day Guided Expedition (All-In)",
      priceLabel: "Starting at $7,500+",
      desc:
        "A full week of guided exploration with rigs, lodging, and curated excursions. Built for guests who want the full Alaska experience on a fixed timeline.",
      airportIncluded: true,
    },
    {
      id: "remote-3day",
      title: "3-Day Remote Adventure",
      priceLabel: "Starting at $3,500+",
      desc:
        "A long-weekend expedition with guided trail days, camp system, and optional lodge nights depending on season and comfort level.",
      airportIncluded: true,
    },
    {
      id: "overnight-2day",
      title: "Overnight Remote Camp (2-Day)",
      priceLabel: "Starting at $2,500+",
      desc:
        "Two days off-road with camp setup, hot meals, and a true off-grid overnight.",
      airportIncluded: true,
    },
    {
      id: "knik-glacier-winter",
      title: "Knik Glacier Winter Day Tour (1-Day)",
      priceLabel: "Driver $250 • Passengers $100 each",
      desc:
        "Winter-only glacier day tour to Knik Glacier. Lunch included. 1 driver seat + up to 6 passenger seats.",
      airportIncluded: false,
      meetupNote: "Meetup location provided after booking (day trip).",
    },
    {
      id: "offroad-day-levels",
      title: "1-Day Off-Road Experience (Choose Your Level)",
      priceLabel: "Driver $250 / $350 / $450 • Passengers $100 each",
      desc:
        "Guided one-day off-road experience with three difficulty levels (easy, moderate, advanced). Lunch included. 1 driver seat + up to 6 passenger seats.",
      airportIncluded: false,
      meetupNote: "Meetup location provided after booking (day trip).",
    },
  ];

  const [step, setStep] = useState(1);

const [form, setForm] = useState({
  start: "",
  end: "",
  drivers: 1,
  passengers: 0,
  dayLevel: "easy",
  rig: "gladiator-expedition",
  campNights: 0,
  lodgingOnly: false,

  addOns: {
    glacier: false,
    helicopter: false,
    bushplane: false,
    zipline: false,
    mine: false,
    dirtBikes: false,
  },

  contact: { name: "", email: "", phone: "" },
});

  const didMountRef = useRef(false);

useEffect(() => {
  // Prevent auto-scroll on initial page load
  if (!didMountRef.current) {
    didMountRef.current = true;
    return;
  }

  // Scroll only when the user navigates steps
  if (topRef.current) {
    topRef.current.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }
}, [step]);




  const selectedPackage = useMemo(
    () => PACKAGES.find((p) => p.id === form.packageId) || PACKAGES[0],
    [form.packageId]
  );

  // ✅ status + error for inline messages
  const [tripStatus, setTripStatus] = useState("idle"); // "idle" | "loading" | "success" | "error"
  const [tripError, setTripError] = useState("");


  const nights = useMemo(() => {
    if (!form.start || !form.end) return 0;
    const s = new Date(form.start),
      e = new Date(form.end);
    return Math.max(
      0,
      Math.round((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24))
    );
  }, [form.start, form.end]);

const price = useMemo(() => {
  const totalDays = Math.max(1, Number(nights || 0) +1); // fallback to 1 day minimum

  const baseDailyRate = 1000;
  const passengerRate = 300;

  const baseCost = totalDays * baseDailyRate;

  const passengerCost =
    totalDays * (Number(form.passengers || 0) * passengerRate);

  const lodgeNights = form.lodgingOnly
  ? Number(nights || 0)
  : Math.max(0, Number(nights || 0) - Number(form.campNights || 0));

const lodgeCost = lodgeNights * 150;

  // Add-ons (still optional / TBD)
  const addOnMap = {
    glacier: 0,
    helicopter: 0,
    bushplane: 0,
    zipline: 0,
    mine: 0,
    dirtBikes: 0,
  };

  const addOnSum = Object.entries(form.addOns)
    .filter(([k, v]) => v === true)
    .reduce((sum, [k]) => sum + (addOnMap[k] || 0), 0);

  const total = baseCost + passengerCost + lodgeCost + addOnSum;

  return {
    totalDays,
    baseCost,
    passengerCost,
    lodgeCost,
    addOnSum,
    total,
  };
}, [form, nights]);

  const next = () => setStep((s) => Math.min(4, s + 1));
  const back = () => setStep((s) => Math.max(1, s - 1));
  const set = (patch) => setForm((f) => ({ ...f, ...patch }));

  const submit = async () => {
    // 🔴 Client-side validation for contact info
    if (!form.contact.name || !form.contact.email) {
      setTripStatus("error");
      setTripError(
        "Please enter your name and email in the Contact step so we can send your itinerary."
      );
      setStep(5);
      return;
    }

    try {
      setTripStatus("loading");
      setTripError("");

      const r = await fetch("/api/trip-inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          form,
          pricing: price, // ✅ include pricing details for the email
        }),
      });

      const data = await r.json();
      if (!r.ok || !data.ok) {
        throw new Error(data.error || "Failed to submit");
      }

      // ✅ SUCCESS
      setTripStatus("success");
      setTripError("");
      // Optional: clear the form after success:
      // setForm({
      //   start: "",
      //   end: "",
      //   party: 2,
      //   rig: "wrangler-expedition",
      //   guideDay: false,
      //   overnight: 0,
      //   addOns: {
      //     glacier: false,
      //     helicopter: false,
      //     bushplane: false,
      //     zipline: false,
      //     mine: false,
      //     lodgeNights: 0,
      //   },
      //   contact: { name: "", email: "", phone: "" },
      // });
    } catch (e) {
      console.error("Trip submit error:", e);
      setTripStatus("error");
      setTripError(
        "Something went wrong sending your request. Please try again in a minute."
      );
    }
  };

  return (
    <div className="relative">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-neutral-900/60 to-neutral-950" />
      <div className="mx-auto max-w-7xl px-4 py-16">
        <div
  ref={topRef}
  className="rounded-3xl border border-white/10 bg-neutral-900/50 p-8 md:p-12"
>

          <header className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold">Build Your Expedition</h2>
              <p className="mt-2 text-neutral-300 max-w-3xl">
                Select dates, rig, add experiences, and request an itinerary. We’ll confirm
                permits and send payment & waiver links.
              </p>
            </div>
            <Stepper step={step} />
          </header>

          <div className="mt-8 grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-6">
              {step === 1 && <StepDates form={form} set={set} nights={nights} />}
              {step === 2 && <StepRigAndExtras form={form} set={set} nights={nights} />}
              {step === 3 && <StepAddOns form={form} set={set} />}
              {step === 4 && <StepContact form={form} set={set} />}

              {/* ✅ Inline success / error messages near the buttons */}
              {tripStatus === "success" && (
                <div className="mb-4 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
                  Your trip inquiry has been sent! We’ll email your custom Alaska Offroad
                  Expedition itinerary shortly.
                </div>
              )}

              {tripStatus === "error" && tripError && (
                <div className="mb-4 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                  {tripError}
                </div>
              )}

              <div className="flex items-center gap-3">
                {step > 1 && (
                  <button
                    onClick={back}
                    className="rounded-xl border border-white/20 px-5 py-3 font-semibold hover:bg-white/10"
                  >
                    Back
                  </button>
                )}
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
                    disabled={tripStatus === "loading"}
                    className="rounded-xl bg-white text-neutral-900 px-5 py-3 font-semibold hover:bg-neutral-200 disabled:opacity-60"
                  >
                    {tripStatus === "loading"
                      ? "Sending..."
                      : "Request Itinerary"}
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
            <div
              className={`h-7 w-7 grid place-items-center rounded-full border ${
                active
                  ? "bg-white text-neutral-900 border-white"
                  : "border-white/30"
              }`}
            >
              {n}
            </div>
            <span className={active ? "text-white" : "text-neutral-400"}>
              {label}
            </span>
            {i < steps.length - 1 && (
              <div className="mx-2 h-px w-8 bg-white/20" />
            )}
          </div>
        );
      })}
    </div>
  );
}

function StepPackage({ form, set }) {
  const packages = [
    {
      id: "ultimate-multiweek",
      tier: "Signature",
      title: "Ultimate Alaska Expedition (Multi-Week)",
      price: "Starting at $15,000+",
      note: "Full-state, all-in experience",
    },
    {
      id: "guided-week",
      tier: "Signature",
      title: "7-Day Guided Expedition (All-In)",
      price: "Starting at $7,500+",
      note: "Week-long guided + lodging + excursions",
    },
    {
      id: "remote-3day",
      tier: "Popular",
      title: "3-Day Remote Adventure",
      price: "Starting at $3,500+",
      note: "Long weekend into the backcountry",
    },
    {
      id: "overnight-2day",
      tier: "Popular",
      title: "Overnight Remote Camp (2-Day)",
      price: "Starting at $2,500+",
      note: "Camp setup + meals + off-grid night",
    },
    {
      id: "knik-glacier-winter",
      tier: "Seasonal",
      title: "Knik Glacier Winter Day Tour (1-Day)",
      price: "Driver $500 • Passengers $300",
      note: "Winter-only Knik Glacier day tour",
    },
    {
      id: "offroad-day-levels",
      tier: "Entry",
      title: "1-Day Off-Road Experience (Choose Your Level)",
      price: "Driver $500 / $1000 / $1500 • Passengers $300",
      note: "Easy / Moderate / Advanced options",
    },
  ];

  return (
    <div className="space-y-4">
      <div className="text-sm text-neutral-300">
        Choose a package to start. You can customize dates, rigs, and add-ons in the next steps.
      </div>

      <div className="grid gap-3">
        {packages.map((p) => {
          const active = form.packageId === p.id;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => set({ packageId: p.id })}
              className={`text-left rounded-2xl border p-4 transition ${
                active
                  ? "border-white/40 bg-white/10"
                  : "border-white/10 bg-neutral-900/40 hover:bg-white/5"
              }`}
            >
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-neutral-200">
                    {p.tier}
                  </div>
                  <div className="mt-2 font-semibold text-neutral-100">
                    {p.title}
                  </div>
                  <div className="mt-1 text-sm text-neutral-400">{p.note}</div>
                </div>
                <div className="shrink-0 text-sm text-neutral-200">
                  {p.price}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="rounded-xl border border-white/10 bg-neutral-900/50 p-4 text-sm text-neutral-300">
        <span className="font-semibold text-neutral-100">Pickup info:</span>{" "}
        Airport pickup &amp; drop-off are included for multi-day packages. Day trips are a meetup at a set location.
      </div>
    </div>
  );
}


function StepDates({ form, set, nights }) {
  const isDayTrip = ["knik-glacier-winter", "offroad-day-levels"].includes(form.packageId);

  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-3 gap-4">
        <div>
          <label className="text-sm text-neutral-300">Start date</label>
          <input
            value={form.start}
            onChange={(e) => set({ start: e.target.value })}
            className="mt-1 w-full rounded-xl bg-neutral-800 px-4 py-3"
            type="date"
          />
        </div>

        <div>
          <label className="text-sm text-neutral-300">End date</label>
          <input
            value={form.end}
            onChange={(e) => set({ end: e.target.value })}
            className="mt-1 w-full rounded-xl bg-neutral-800 px-4 py-3"
            type="date"
            disabled={isDayTrip}
          />
          {isDayTrip && (
            <div className="mt-1 text-xs text-neutral-500">
              Day trips are single-day bookings (end date not required).
            </div>
          )}
        </div>

        <div>
          <label className="text-sm text-neutral-300">Drivers</label>
          <input
            value={form.drivers}
            onChange={(e) => set({ drivers: Number(e.target.value) })}
            className="mt-1 w-full rounded-xl bg-neutral-800 px-4 py-3"
            type="number"
            min={1}
            max={2}
          />
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div>
          <label className="text-sm text-neutral-300">Passengers</label>
          <input
            value={form.passengers}
            onChange={(e) => set({ passengers: Number(e.target.value) })}
            className="mt-1 w-full rounded-xl bg-neutral-800 px-4 py-3"
            type="number"
            min={0}
            max={6}
          />
        </div>

        {form.packageId === "offroad-day-levels" && (
          <div className="md:col-span-2">
            <label className="text-sm text-neutral-300">Difficulty level</label>
            <select
              value={form.dayLevel}
              onChange={(e) => set({ dayLevel: e.target.value })}
              className="mt-1 w-full rounded-xl bg-neutral-800 px-4 py-3"
            >
              <option value="easy">Easy (Driver $500)</option>
              <option value="moderate">Moderate (Driver $1000)</option>
              <option value="advanced">Advanced (Driver $1500)</option>
            </select>
          </div>
        )}
      </div>

      {!isDayTrip && (
        <div className="text-sm text-neutral-400">{nights} night(s) selected.</div>
      )}
    </div>
  );
}


function StepRigAndExtras({ form, set, nights }) {
  const rigOptions = [
    {
      value: "gladiator-expedition",
      label: '2020 Jeep Gladiator',
      img: "/images/Wrangler140.jpg",
    },
    {
      value: "tacoma-expedition",
      label: '2019 Toyota Tacoma TRD Off-Road',
      img: "/images/tacomaone40.jpeg",
    },
  ];

  const selectedRig = rigOptions.find((r) => r.value === form.rig) || rigOptions[0];

  // Total nights should come from the TripBuilder nights calculation
  const totalNights = Math.max(0, Number(nights || 0));

  // Compute lodge nights as "remaining nights" unless lodgingOnly
  const derivedLodgeNights = form.lodgingOnly
    ? totalNights
    : Math.max(0, totalNights - Number(form.campNights || 0));

  const setCampNights = (val) => {
    const nextCamp = Math.max(0, Math.min(totalNights, Number(val || 0)));
    set({
      campNights: nextCamp,
      lodgingOnly: nextCamp === 0 ? form.lodgingOnly : false, // if they choose camping, lodgingOnly should turn off
    });
  };

  const setLodgingOnly = (checked) => {
    set({
      lodgingOnly: checked,
      campNights: checked ? 0 : form.campNights,
    });
  };

  return (
    <div className="space-y-6">
      {/* Rig selection + live preview */}
      <div className="grid gap-4 md:grid-cols-2 md:items-start">
        <div>
          <label className="text-sm text-neutral-300">Rig selection</label>
          <select
            value={form.rig}
            onChange={(e) => set({ rig: e.target.value })}
            className="mt-1 w-full rounded-xl bg-neutral-800 px-4 py-3"
          >
            {rigOptions.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>

          <div className="mt-2 text-xs text-neutral-500">
            Your rig selection updates the live preview and helps us plan your itinerary and logistics.
          </div>
        </div>

        <div className="rounded-2xl overflow-hidden border border-white/10 bg-neutral-900/40">
          <img
            src={selectedRig.img}
            alt={selectedRig.label}
            className="h-48 w-full object-cover"
            loading="lazy"
          />
          <div className="p-4 text-sm text-neutral-300 text-center">
            {selectedRig.label}
          </div>
        </div>
      </div>

      

      {/* Overnight style */}
      <div className="rounded-2xl border border-white/10 bg-neutral-900/40 p-5">
        <div className="text-sm font-semibold text-neutral-100">Overnight style</div>
        <p className="mt-2 text-sm text-neutral-300">
          Choose how many nights you want to camp. The remaining nights become lodge/hotel nights based on your trip length.
        </p>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-sm text-neutral-300">Camping nights</label>
            <input
              type="number"
              min={0}
              max={totalNights}
              value={form.campNights}
              onChange={(e) => setCampNights(e.target.value)}
              disabled={form.lodgingOnly || totalNights === 0}
              className="mt-1 w-full rounded-xl bg-neutral-800 px-4 py-3 disabled:opacity-60"
            />
            <div className="mt-1 text-xs text-neutral-500">
              Includes expedition camp setup and meals where applicable.
            </div>
          </div>

          <div>
            <label className="text-sm text-neutral-300">Lodge / hotel nights</label>
            <input
              type="number"
              value={derivedLodgeNights}
              readOnly
              className="mt-1 w-full rounded-xl bg-neutral-800 px-4 py-3 opacity-80"
            />
            <div className="mt-1 text-xs text-neutral-500">
              Auto-calculated as remaining nights ({totalNights} total).
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-3">
          <input
            id="lodgingOnly"
            type="checkbox"
            checked={form.lodgingOnly}
            onChange={(e) => setLodgingOnly(e.target.checked)}
            className="h-4 w-4"
            disabled={totalNights === 0}
          />
          <label htmlFor="lodgingOnly" className="text-sm text-neutral-200">
            Lodging only (no camping)
          </label>
        </div>

        {totalNights === 0 && (
          <div className="mt-2 text-xs text-neutral-500">
            Select dates first to calculate total nights and enable overnight options.
          </div>
        )}
      </div>
    </div>
  );
}


function StepAddOns({ form, set }) {
  const toggle = (k) =>
    set({ addOns: { ...form.addOns, [k]: !form.addOns[k] } });
  const setNum = (k, v) =>
    set({ addOns: { ...form.addOns, [k]: Number(v) } });

  const items = [
    {
    key: "mine",
    label: "Historic Mine / Glacier Tunnel Tour (St. Elias Alpine Guides)",
    note: "TBD",
    img: "/images/addons/mine.jpg",
    desc: "Guided historic mine and glacier tunnel experiences when available.",
  },
  {
    key: "glacier",
    label: "Glacier Hike",
    note: "TBD",
    img: "/images/addons/glacier.jpg",
    desc: "Guided glacier hike option based on conditions and season.",
  },
  {
    key: "helicopter",
    label: "Helicopter Flight to Knik Glacier",
    note: "TBD",
    img: "/images/addons/helicopter.jpg",
    desc: "Scenic helicopter flight options available with Outbound Heli Adventures ",
  },
  {
    key: "bushplane",
    label: "Bush Plane Segment",
    note: "TBD",
    img: "/images/addons/bushplane.jpg",
    desc: "Remote access flight segment for true off-grid destinations with Denali Flightseeting Tours or K2 Aviation",
  },
 
  {
    key: "zipline",
    label: "Zipline",
    note: "TBD",
    img: "/images/addons/zipline.jpg",
    desc: "Add a zipline excursion when available near your itinerary.",
  },
  {
    key: "dirtBikes",
    label: "Dirt Bike Rental Tour (Alaska Premier Enduro)",
    note: "TBD",
    img: "/images/addons/dirtbikes.jpg",
    desc: "Add a dirt bike tour day—availability varies by season and location.",
  },
  {
    key: "Alaska Adventure Tours",
    label: "ATV or snow machine tours",
    note: "TBD",
    img: "/images/addons/7-Summer-ATV-Tours.webp",
    desc: "Explore Hatcher Pass with unmatched panoramic views, creek crossings, and Denali views on clear days—without sacrificing comfort.",
  },
];


  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-2 gap-3">
        {items.map((x) => (
         <label
  key={x.key}
  className="overflow-hidden rounded-2xl border border-white/10 bg-neutral-900/40 hover:bg-white/5 cursor-pointer"
>
  <div className="flex gap-4 p-4">
    <input
      type="checkbox"
      checked={form.addOns[x.key]}
      onChange={() => toggle(x.key)}
      className="mt-1 h-4 w-4"
    />

    <div className="flex-1">
      <div className="font-semibold">{x.label}</div>
      <div className="text-sm text-neutral-400 mt-1">{x.desc}</div>
      <div className="text-xs text-neutral-500 mt-2">Cost: {x.note}</div>
    </div>
  </div>

  <div className="px-4 pb-4">
    <img
      src={x.img}
      alt={x.label}
      className="h-36 w-full rounded-xl object-cover border border-white/10"
      loading="lazy"
    />
  </div>
</label>

        ))}
      </div>
      <div>
        <label className="text-sm text-neutral-300">
          Lodge nights (optional)
        </label>
        <input
          type="number"
          min={0}
          max={14}
          value={form.addOns.lodgeNights}
          onChange={(e) => setNum("lodgeNights", e.target.value)}
          className="mt-1 w-full rounded-xl bg-neutral-800 px-4 py-3"
        />
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
          <input
            value={c.name}
            onChange={(e) => setC({ name: e.target.value })}
            className="mt-1 w-full rounded-xl bg-neutral-800 px-4 py-3"
            placeholder="Your name"
          />
        </div>
        <div>
          <label className="text-sm text-neutral-300">Email</label>
          <input
            value={c.email}
            type="email"
            onChange={(e) => setC({ email: e.target.value })}
            className="mt-1 w-full rounded-xl bg-neutral-800 px-4 py-3"
            placeholder="you@email.com"
          />
        </div>
      </div>
      <div>
        <label className="text-sm text-neutral-300">Phone</label>
        <input
          value={c.phone}
          onChange={(e) => setC({ phone: e.target.value })}
          className="mt-1 w-full rounded-xl bg-neutral-800 px-4 py-3"
          placeholder="+1 (___) ___-____"
        />
      </div>
      <div className="text-sm text-neutral-400">
        Submitting will create a reservation request. We’ll reply with
        availability, a deposit link (Stripe), and an e-signature waiver.
      </div>
    </div>
  );
}

function SummaryCard({ form, nights, price }) {
  const airportIncluded = Math.max(1, Number(nights || 0) + 1) > 1;

  const prettyAddOnLabel = (k) => {
    const map = {
      glacier: "Glacier Hike",
      helicopter: "Helicopter Flight",
      bushplane: "Bush Plane Segment",
      zipline: "Zipline",
      mine: "Historic Mine / Glacier Tunnel Tour",
      dirtBikes: "Dirt Bike Rental Tour",
    };
    return map[k] || k;
  };

  const selectedAddOns = Object.entries(form.addOns || {})
    .filter(([k, v]) => typeof v === "boolean" && v)
    .map(([k]) => prettyAddOnLabel(k));

  const lodgeNights = form.lodgingOnly
    ? Number(nights || 0)
    : Math.max(0, Number(nights || 0) - Number(form.campNights || 0));

  return (
    <div className="rounded-2xl border border-white/10 bg-neutral-900/60 p-5">
      <div className="font-semibold text-lg">Summary</div>

      <div className="mt-3 space-y-2 text-sm text-neutral-300">
        <div className="flex justify-between gap-4">
          <span className="text-neutral-400">Pickup</span>
          <span className="text-neutral-100">
            {airportIncluded
              ? "Airport pickup & drop-off included"
              : "Meetup location (day trip)"}
          </span>
        </div>

        <div className="flex justify-between gap-4">
          <span className="text-neutral-400">Dates</span>
          <span className="text-neutral-100">
            {form.start || "—"} → {form.end || "—"} ({nights} night{nights !== 1 ? "s" : ""})
          </span>
        </div>

        <div className="flex justify-between gap-4">
          <span className="text-neutral-400">Rig</span>
          <span className="text-neutral-100">
            {(form.rig || "—").replaceAll("-", " ")}
          </span>
        </div>

        <div className="flex justify-between gap-4">
          <span className="text-neutral-400">Guiding</span>
          <span className="text-neutral-100">Included</span>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10">
          <div className="flex justify-between gap-4">
            <span className="text-neutral-400">Camp nights</span>
            <span className="text-neutral-100">{form.campNights || 0}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-neutral-400">Lodge nights</span>
            <span className="text-neutral-100">{lodgeNights}</span>
          </div>
        </div>

        <div className="pt-2 border-t border-white/10">
          <div className="text-neutral-400">Excursions / Add-ons</div>
          {selectedAddOns.length ? (
            <ul className="mt-2 list-disc pl-5">
              {selectedAddOns.map((label) => (
                <li key={label}>{label}</li>
              ))}
            </ul>
          ) : (
            <div className="mt-2 text-neutral-400">None selected</div>
          )}
        </div>
      </div>

      <div className="mt-4 rounded-xl bg-neutral-800 p-4 text-sm text-neutral-200">
        <div className="flex justify-between">
          <span>Expedition ({price.totalDays} day{price.totalDays > 1 ? "s" : ""})</span>
          <span>${price.baseCost.toLocaleString()}</span>
        </div>

        {form.passengers > 0 && (
          <div className="flex justify-between">
            <span>Passengers ({form.passengers} × $300 × {price.totalDays} days)</span>
            <span>${price.passengerCost.toLocaleString()}</span>
          </div>
        )}

        {lodgeNights > 0 && (
          <div className="flex justify-between">
            <span>Lodge Nights ({lodgeNights} × $150)</span>
            <span>${price.lodgeCost.toLocaleString()}</span>
          </div>
        )}

        {price.addOnSum > 0 && (
          <div className="flex justify-between">
            <span>Excursions</span>
            <span>${price.addOnSum.toLocaleString()}</span>
          </div>
        )}

        <div className="mt-3 flex justify-between text-base font-semibold">
          <span>Total (est.)</span>
          <span>${price.total.toLocaleString()}</span>
        </div>

        <div className="text-xs text-neutral-400 mt-1">
          Final pricing confirmed after itinerary planning and availability.
        </div>
      </div>
    </div>
  );
}




function PolicyCard() {
  return (
    <div className="rounded-2xl border border-white/10 bg-neutral-900/60 p-5 text-sm text-neutral-300">
      <div className="font-semibold text-lg">Policies</div>
      <ul className="mt-3 list-disc pl-5 space-y-2">
  <li>25% deposit required to reserve your expedition.</li>
  <li>Deposits become non-refundable within 14 days of the trip start date.</li>
  <li>Remaining balance due 14 days before the expedition.</li>
  <li>
    Driver’s license verification and damage deposit required for rentals.
  </li>
  <li>
    Trips may adjust due to weather or safety conditions; equal or better
    alternatives will be provided when possible.
  </li>
</ul>

    </div>
  );
}
