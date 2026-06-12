import { useState, useMemo, useRef, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { excursions } from "./data/excursions";

function calculateDiscountedDailyTotal(totalDays, dailyRate, passengerDailyTotal) {
  let baseCost = 0;
  let discountSavings = 0;

  const dailyTotal = dailyRate + passengerDailyTotal;

  for (let day = 1; day <= totalDays; day++) {
    if (day <= 3) {
      baseCost += dailyTotal;
    } else if (day <= 6) {
      baseCost += dailyTotal * 0.85;
      discountSavings += dailyTotal * 0.15;
    } else {
      baseCost += dailyTotal * 0.76;
      discountSavings += dailyTotal * 0.24;
    }
  }

  return {
    baseCost: Math.round(baseCost),
    discountSavings: Math.round(discountSavings),
  };
}

export default function TripBuilder() {
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
  rig: "Jeep Gladiator Expedition Rig",
  campNights: 0,
 
  lodgingPreference: "lodging",
  lodgingNotes: "",
  homebaselodging: false,

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

const [blockedRanges, setBlockedRanges] = useState([]);
const [availabilityLoading, setAvailabilityLoading] = useState(true);
const [availabilityError, setAvailabilityError] = useState("");

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

useEffect(() => {
  async function loadAvailability() {
    try {
      setAvailabilityLoading(true);
      setAvailabilityError("");

      const res = await fetch("/api/calendar-availability");
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to load availability");
      }

      const ranges = (data.busy || []).map((range) => ({
        start: new Date(range.start),
        end: new Date(range.end),
      }));

      setBlockedRanges(ranges);

      // 👇 This lets us verify it's working
      console.log("Calendar blocked ranges:", ranges);
    } catch (error) {
      console.error("Calendar fetch failed:", error);
      setAvailabilityError("Could not load calendar availability.");
    } finally {
      setAvailabilityLoading(false);
    }
  }

  loadAvailability();
}, []);

useEffect(() => {
  async function loadAvailability() {
    try {
      setAvailabilityLoading(true);
      setAvailabilityError("");

      const res = await fetch("/api/calendar-availability");
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to load availability");
      }

      const ranges = (data.busy || []).map((range) => ({
        start: new Date(range.start),
        end: new Date(range.end),
      }));

      setBlockedRanges(ranges);
    } catch (error) {
      console.error("Failed to load calendar availability:", error);
      setAvailabilityError("Could not load available dates right now.");
    } finally {
      setAvailabilityLoading(false);
    }
  }

  loadAvailability();
}, []);




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

  const selectedDatesOverlapBlocked = useMemo(() => {
  if (!form.start || !form.end || !blockedRanges.length) return false;

  const tripStart = new Date(`${form.start}T00:00:00`);
  const tripEnd = new Date(`${form.end}T23:59:59`);

  return blockedRanges.some((range) => {
    const blockedStart = new Date(range.start);
    const blockedEnd = new Date(range.end);

    blockedStart.setHours(0, 0, 0, 0);
    blockedEnd.setHours(23, 59, 59, 999);

    return tripStart <= blockedEnd && tripEnd >= blockedStart;
  });
}, [form.start, form.end, blockedRanges]);

const price = useMemo(() => {
  const totalDays = Math.max(1, Number(nights || 0) + 1);

  const baseDailyRate = 1000;
  const passengerRate = 100;
  const passengerCount = Number(form.passengers || 0);
  const passengerDailyTotal = passengerCount * passengerRate;

  const discountedBase = calculateDiscountedDailyTotal(
    totalDays,
    baseDailyRate,
    passengerDailyTotal
  );

  const baseCost = discountedBase.baseCost;
  const discountSavings = discountedBase.discountSavings;

  const lodgeNights = Number(nights || 0);
  const lodgeCost = lodgeNights * 300;

  const totalGuests = 1 + Number(form.passengers || 0);

  const selectedExcursions = excursions
    .filter((x) => x.tripBuilder && form.addOns?.[x.key])
    .map((x) => {
      const priceType = x.priceType || "flat";
      const unitPrice = Number(x.price || 0);

      const totalPrice =
        priceType === "perPerson"
          ? unitPrice * totalGuests
          : unitPrice;

      return {
        ...x,
        unitPrice,
        priceType,
        totalPrice,
      };
    });

  const addOnSum = selectedExcursions.reduce(
    (sum, x) => sum + Number(x.totalPrice || 0),
    0
  );

  const total = baseCost + lodgeCost + addOnSum;
  const depositDue = Math.round(total * 0.25);
  const balanceDue = total - depositDue;

  return {
    totalDays,
    totalGuests,
    baseDailyRate,
    passengerRate,
    passengerCount,
    passengerDailyTotal,
    baseCost,
    discountSavings,
    lodgeNights,
    lodgeCost,
    selectedExcursions,
    addOnSum,
    total,
    depositDue,
    balanceDue,
  };
}, [form, nights]);

  const next = () => setStep((s) => Math.min(4, s + 1));
  const back = () => setStep((s) => Math.max(1, s - 1));
  const set = (patch) => setForm((f) => ({ ...f, ...patch }));

  const submit = async () => {
  if (!form.contact.name || !form.contact.email) {
    setTripStatus("error");
    setTripError(
      "Please enter your name and email in the Contact step so we can reserve your expedition."
    );
    setStep(4);
    return;
  }

  if (!form.start || !form.end) {
    setTripStatus("error");
    setTripError("Please select your expedition start and end dates.");
    setStep(1);
    return;
  }

  if (selectedDatesOverlapBlocked) {
    setTripStatus("error");
    setTripError("Those dates are unavailable. Please choose different dates.");
    setStep(1);
    return;
  }

  try {
    setTripStatus("loading");
    setTripError("");

    const r = await fetch("/api/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        form,
        pricing: price,
      }),
    });

   const text = await r.text();
let data = {};

try {
  data = text ? JSON.parse(text) : {};
} catch {
  throw new Error(`API did not return JSON. Status: ${r.status}. Response: ${text.slice(0, 200)}`);
}

if (!r.ok || !data.url) {
  throw new Error(data.error || `Checkout failed with status ${r.status}`);
}

    window.location.href = data.url;
  } catch (e) {
  console.error("Checkout error:", e);
  setTripStatus("error");
  setTripError(e.message || "Something went wrong starting checkout.");
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
                Select dates, overnight options, add experiences, and request an itinerary. Your expedition rig is our Jeep Gladiator Expedition Build.
              </p>
            </div>
            <Stepper step={step} />
          </header>

          <div className="mt-8 grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-6">
              {step === 1 && (
  <StepDates
    form={form}
    set={set}
    nights={nights}
    blockedRanges={blockedRanges}
  />
)}
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

              {step === 1 && selectedDatesOverlapBlocked && (
  <div className="mb-4 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
    Those dates overlap with an unavailable expedition booking. Please choose a different start or end date before continuing.
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
  disabled={step === 1 && selectedDatesOverlapBlocked}
  className="rounded-xl bg-white text-neutral-900 px-5 py-3 font-semibold hover:bg-neutral-200 disabled:opacity-60 disabled:cursor-not-allowed"
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
                      : `Reserve Expedition - $${price.depositDue.toLocaleString()} Deposit`}
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
  const steps = ["Dates", "Overnight", "Add-ons", "Contact"];
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
      price: "Driver $500 • Passengers $100",
      note: "Winter-only Knik Glacier day tour",
    },
    {
      id: "offroad-day-levels",
      tier: "Entry",
      title: "1-Day Off-Road Experience (Choose Your Level)",
      price: "Driver $500 / $1000 / $1500 • Passengers $100",
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


function StepDates({ form, set, nights, blockedRanges = [] }) {
  const isDayTrip = ["knik-glacier-winter", "offroad-day-levels"].includes(
    form.packageId
  );

  const startDate = form.start ? new Date(`${form.start}T12:00:00`) : null;
  const endDate = form.end ? new Date(`${form.end}T12:00:00`) : null;

  const formatDateForForm = (date) => {
    if (!date) return "";
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, "0");
    const day = `${date.getDate()}`.padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const isDateBlocked = (date) => {
    return blockedRanges.some((range) => {
      const checkDate = new Date(date);
      checkDate.setHours(12, 0, 0, 0);

      const start = new Date(range.start);
      const end = new Date(range.end);

      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);

      return checkDate >= start && checkDate <= end;
    });
  };

  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-3 gap-4">
        <div>
          <label className="text-sm text-neutral-300">Start date</label>
          <DatePicker
            selected={startDate}
            onChange={(date) => {
              const formatted = formatDateForForm(date);

              set({
                start: formatted,
                end: isDayTrip ? formatted : "",
              });
            }}
            minDate={new Date()}
            filterDate={(date) => !isDateBlocked(date)}
            placeholderText="Select start date"
            dateFormat="yyyy-MM-dd"
            className="mt-1 w-full rounded-xl bg-neutral-800 px-4 py-3 text-white"
          />
        </div>

        <div>
          <label className="text-sm text-neutral-300">End date</label>
          <DatePicker
            selected={endDate}
            onChange={(date) => {
              set({ end: formatDateForForm(date) });
            }}
            minDate={startDate || new Date()}
            placeholderText="Select end date"
            dateFormat="yyyy-MM-dd"
            className="mt-1 w-full rounded-xl bg-neutral-800 px-4 py-3 text-white"
            disabled={isDayTrip || !startDate}
          />

          {isDayTrip && (
            <div className="mt-1 text-xs text-neutral-500">
              Day trips are single-day bookings.
            </div>
          )}

          {!isDayTrip && !startDate && (
            <div className="mt-1 text-xs text-neutral-500">
              Select a start date first.
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
        <div className="text-sm text-neutral-400">
          {nights} night(s) selected.
        </div>
      )}
    </div>
  );
}

function StepRigAndExtras({ form, set, nights }) {
  const totalNights = Math.max(0, Number(nights || 0));

  return (
    <div className="space-y-6">
      <div className="rounded-2xl overflow-hidden border border-white/10 bg-neutral-900/40">
        <img
          src="/images/Wrangler140.jpg"
          alt="Jeep Gladiator Expedition Build"
          className="h-64 w-full object-cover"
          loading="lazy"
        />

        <div className="p-5">
          <div className="text-sm uppercase tracking-wider text-neutral-400">
            Meet Your Expedition Rig
          </div>

          <h3 className="mt-2 text-2xl font-bold text-white">
            Jeep Gladiator Expedition Build
          </h3>

          <p className="mt-3 text-neutral-300">
            Built for Alaska's remote trails, river crossings, glaciers, and
            backcountry adventures. This fully equipped Gladiator is designed to
            provide capability, comfort, and confidence while exploring some of
            the most incredible places Alaska has to offer.
          </p>

          <div className="mt-5 rounded-xl border border-amber-400/20 bg-amber-400/10 p-4">
            <div className="font-semibold text-amber-300">
              What's Included
            </div>

            <p className="mt-2 text-sm text-neutral-300">
              Every expedition includes recovery gear, air compressor, tire
              repair equipment, first aid supplies, satellite communications,
              and essential safety equipment so you're prepared for Alaska's
              changing conditions.
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-neutral-900/40 p-5">
        <div className="text-sm font-semibold text-neutral-100">
          Lodging & Camping Preference
        </div>

        <p className="mt-2 text-sm text-neutral-300">
          We build each itinerary around your comfort level. Lodging is
          estimated at $300 per night whether that is our private Home Base
          lodging in town or a lodge along the route. Camping can be worked into
          the itinerary at no extra lodging cost when conditions and route allow.
        </p>

        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {[
            {
              value: "lodging",
              title: "Lodging every night",
              desc: "Best for guests who want a bed, shower, and warm reset each night.",
            },
            {
              value: "mixed",
              title: "Mix lodging and camping",
              desc: "Best for guests who want comfort stops but are open to a true expedition camp.",
            },
            {
              value: "camping",
              title: "Camping preferred",
              desc: "Best for guests who want the most remote, off-grid Alaska experience.",
            },
          ].map((option) => (
            <label
              key={option.value}
              className={`rounded-2xl border p-4 cursor-pointer transition ${
                form.lodgingPreference === option.value
                  ? "border-amber-400/60 bg-amber-400/10"
                  : "border-white/10 bg-neutral-800/60 hover:bg-white/5"
              }`}
            >
              <div className="flex items-start gap-3">
                <input
                  type="radio"
                  name="lodgingPreference"
                  value={option.value}
                  checked={form.lodgingPreference === option.value}
                  onChange={(e) =>
                    set({ lodgingPreference: e.target.value })
                  }
                  className="mt-1"
                />

                <div>
                  <div className="font-semibold text-neutral-100">
                    {option.title}
                  </div>
                  <p className="mt-1 text-sm text-neutral-400">
                    {option.desc}
                  </p>
                </div>
              </div>
            </label>
          ))}
        </div>

        <div className="mt-5">
          <label className="text-sm text-neutral-300">
            Lodging or camping notes
          </label>

          <textarea
            rows={3}
            value={form.lodgingNotes || ""}
            onChange={(e) => set({ lodgingNotes: e.target.value })}
            className="mt-1 w-full rounded-xl bg-neutral-800 px-4 py-3"
            placeholder="Example: We want the first and last night at Home Base, but are open to camping one or two nights if the weather is good."
          />
        </div>

        <div className="mt-5 rounded-xl border border-amber-400/20 bg-amber-400/10 p-4 text-sm text-neutral-300">
          Lodging estimate: $300/night. Final lodging and camping layout is
          confirmed when we build your custom itinerary.
        </div>

        {totalNights === 0 && (
          <div className="mt-3 text-xs text-neutral-500">
            Select dates first so we can estimate lodging nights.
          </div>
        )}
      </div>
    </div>
  );
}



function StepAddOns({ form, set }) {
  const toggle = (k) =>
    set({ addOns: { ...form.addOns, [k]: !form.addOns[k] } });

  const items = excursions.filter((x) => x.tripBuilder);

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
                checked={!!form.addOns[x.key]}
                onChange={() => toggle(x.key)}
                className="mt-1 h-4 w-4"
              />

              <div className="flex-1">
                <div className="font-semibold">{x.name}</div>

                <div className="text-sm text-neutral-400 mt-1">
                  {x.desc}
                </div>

                {x.features?.length > 0 && (
                  <ul className="mt-3 space-y-1 text-sm text-neutral-300">
                    {x.features.map((feature) => (
                      <li key={feature} className="flex gap-2">
                        <span className="text-orange-400">✔</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                )}

                <div className="text-xs text-neutral-500 mt-3">
                  Cost: ${Number(x.price || 0).toLocaleString()}
{x.priceType === "perPerson" ? " per person" : ""}
                </div>
              </div>
            </div>

            <div className="px-4 pb-4">
              <img
                src={x.images?.[0]}
                alt={x.name}
                className="h-36 w-full rounded-xl object-cover border border-white/10"
                loading="lazy"
              />
            </div>
          </label>
        ))}
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

  const lodgingLabel =
    form.lodgingPreference === "mixed"
      ? "Mix lodging and camping"
      : form.lodgingPreference === "camping"
      ? "Camping preferred"
      : "Lodging every night";

  return (
    <div className="rounded-2xl border border-white/10 bg-neutral-900/60 p-5">
      <div className="text-xl font-bold">Trip Estimate</div>

      <div className="mt-4 rounded-xl border border-white/10 bg-neutral-800/50 p-4">
        <div className="text-sm font-semibold text-neutral-100">
          Trip Snapshot
        </div>

        <div className="mt-3 space-y-2 text-sm text-neutral-300">
          <div className="flex justify-between gap-4">
            <span className="text-neutral-400">Dates</span>
            <span className="text-right text-neutral-100">
              {form.start || "—"} → {form.end || "—"}
            </span>
          </div>

          <div className="flex justify-between gap-4">
            <span className="text-neutral-400">Length</span>
            <span className="text-neutral-100">
              {price.totalDays} day{price.totalDays !== 1 ? "s" : ""} /{" "}
              {nights} night{nights !== 1 ? "s" : ""}
            </span>
          </div>

          <div className="flex justify-between gap-4">
            <span className="text-neutral-400">Guests</span>
            <span className="text-neutral-100">
              {price.totalGuests} total
            </span>
          </div>

          <div className="flex justify-between gap-4">
            <span className="text-neutral-400">Rig</span>
            <span className="text-right text-neutral-100">
              Jeep Gladiator Expedition Rig
            </span>
          </div>

          <div className="flex justify-between gap-4">
            <span className="text-neutral-400">Pickup</span>
            <span className="text-right text-neutral-100">
              {airportIncluded
                ? "Airport pickup & drop-off included"
                : "Meetup location"}
            </span>
          </div>

          <div className="border-t border-white/10 pt-3">
            <div className="text-neutral-400">Lodging Preference</div>
            <div className="mt-1 text-neutral-100">{lodgingLabel}</div>
          </div>

          <div className="border-t border-white/10 pt-3">
            <div className="text-neutral-400">Selected Excursions</div>

            {price.selectedExcursions?.length ? (
              <ul className="mt-2 space-y-1">
                {price.selectedExcursions.map((x) => (
                  <li key={x.key} className="flex gap-2">
                    <span className="text-orange-400">✔</span>
                    <span>{x.name}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="mt-2 text-neutral-400">None selected</div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-4 rounded-xl bg-neutral-800 p-4 text-sm text-neutral-200">
        <div className="text-sm font-semibold text-neutral-100">
          Price Breakdown
        </div>

        <div className="mt-3 space-y-2">
          <div className="flex justify-between gap-4">
            <span>
              Expedition + guests ({price.totalDays} day
              {price.totalDays !== 1 ? "s" : ""})
            </span>
            <span>${price.baseCost.toLocaleString()}</span>
          </div>

          {price.passengerCount > 0 && (
            <div className="flex justify-between gap-4 text-neutral-400">
              <span>
                Includes {price.passengerCount} passenger
                {price.passengerCount !== 1 ? "s" : ""} at $
                {price.passengerRate}/day
              </span>
              <span>Included</span>
            </div>
          )}

          {price.discountSavings > 0 && (
            <div className="flex justify-between gap-4 text-emerald-300">
              <span>Stay Longer Savings</span>
              <span>-${price.discountSavings.toLocaleString()}</span>
            </div>
          )}

          {price.lodgeNights > 0 && (
            <div className="flex justify-between gap-4">
              <span>Lodging Estimate ({price.lodgeNights} × $300)</span>
              <span>${price.lodgeCost.toLocaleString()}</span>
            </div>
          )}

          {price.selectedExcursions?.length > 0 && (
            <div className="border-t border-white/10 pt-3 space-y-1">
              <div className="font-medium text-neutral-200">
                Excursions
              </div>

              {price.selectedExcursions.map((x) => (
                <div key={x.key} className="flex justify-between gap-4">
                  <span>
                    {x.name}
                    {x.priceType === "perPerson" && (
                      <span className="text-neutral-400">
                        {" "}
                        ({price.totalGuests} × ${x.unitPrice.toLocaleString()})
                      </span>
                    )}
                  </span>

                  <span>${Number(x.totalPrice || 0).toLocaleString()}</span>
                </div>
              ))}

              <div className="mt-2 flex justify-between font-semibold">
                <span>Excursion Total</span>
                <span>${price.addOnSum.toLocaleString()}</span>
              </div>
            </div>
          )}

          <div className="border-t border-white/10 pt-3 flex justify-between text-lg font-bold text-white">
            <span>Total Estimate</span>
            <span>${price.total.toLocaleString()}</span>
          </div>

          <div className="text-xs text-neutral-400">
            Final pricing, lodging layout, and excursion availability are
            confirmed after itinerary planning.
          </div>
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
  <li>Remaining balance within 14 days before the expedition.</li>
  <li>Driver’s license verification and damage deposit required 14 days before expedition.</li>
  <li>Trips may adjust due to weather or safety conditions; equal or better alternatives will be provided when possible.</li>
</ul>
</div>
  );
}