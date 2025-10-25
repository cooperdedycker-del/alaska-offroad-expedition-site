import { useState, useMemo } from "react";

export default function TripBuilder() {
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
    const addOnSum = Object.entries(form.addOns)
      .filter(([k, v]) => addOnMap[k] && v === true)
      .reduce((a, [k]) => a + addOnMap[k], 0);
    const lodgeCost = (form.addOns.lodgeNights || 0) * 350;
    const rentalTotal = nights * dailyRental;
    const total = rentalTotal + guideTotal + overnightAdd + addOnSum + lodgeCost;
    return { rentalTotal, guideTotal, overnightAdd, addOnSum, lodgeCost, total };
  }, [nights, form]);

  const next = () => setStep((s) => Math.min(4, s + 1));
  const back = () => setStep((s) => Math.max(1, s - 1));
  const set = (patch) => setForm((f) => ({ ...f, ...patch }));

  const submit = async () => {
    alert("Request submitted. In production this will send your itinerary and confirmation email.");
  };

  return (
    <div className="relative" id="trip-builder">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-neutral-900/60 to-neutral-950" />
      <div className="mx-auto max-w-7xl px-4 py-16">
        <div className="rounded-3xl border border-white/10 bg-neutral-900/50 p-8 md:p-12">
          <header className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold">Build Your Expedition</h2>
              <p className="mt-2 text-neutral-300 max-w-3xl">
                Select dates, rig, add experiences, and request an itinerary.
              </p>
            </div>
            <div className="text-neutral-400 text-sm">Step {step} / 4</div>
          </header>

          <div className="mt-8">
            <p className="text-neutral-400">Step {step} form content goes here…</p>
            <div className="mt-6 flex gap-3">
              {step > 1 && (
                <button onClick={back} className="rounded-xl border border-white/20 px-5 py-3 font-semibold hover:bg-white/10">
                  Back
                </button>
              )}
              {step < 4 ? (
                <button onClick={next} className="rounded-xl bg-white text-neutral-900 px-5 py-3 font-semibold hover:bg-neutral-200">
                  Continue
                </button>
              ) : (
                <button onClick={submit} className="rounded-xl bg-white text-neutral-900 px-5 py-3 font-semibold hover:bg-neutral-200">
                  Request Itinerary
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
