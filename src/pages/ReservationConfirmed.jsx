import { Link } from "react-router-dom";

export default function ReservationConfirmed() {
  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <div className="mx-auto flex min-h-screen max-w-5xl items-center justify-center px-6 py-16">
        <div className="w-full overflow-hidden rounded-3xl border border-orange-500/20 bg-neutral-900 shadow-2xl">
          <div className="bg-gradient-to-r from-orange-500/20 to-neutral-900 p-8 md:p-12 text-center">
            <div className="text-sm uppercase tracking-[0.3em] text-orange-300">
              Alaska Offroad Expedition
            </div>

            <h1 className="mt-4 text-4xl md:text-5xl font-extrabold">
              Reservation Confirmed
            </h1>

            <p className="mt-4 text-xl text-neutral-200">
              Welcome to the Alaska Offroad Expedition family.
            </p>

            <p className="mt-2 text-neutral-300">
              Your adventure officially begins now.
            </p>
          </div>

          <div className="grid gap-6 p-8 md:p-12">
            <div className="rounded-2xl border border-white/10 bg-neutral-800/70 p-6">
              <h2 className="text-2xl font-bold text-orange-400">
                Your 25% deposit has been received.
              </h2>

              <p className="mt-3 text-neutral-300">
                Your reservation is now being processed, and your requested dates are being secured. You’ll receive a confirmation email shortly with your trip details and next steps.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-neutral-800/70 p-6">
              <h2 className="text-xl font-bold">What Happens Next</h2>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                {[
                  "Reservation confirmation email",
                  "Expedition itinerary review",
                  "Waiver and emergency contact forms",
                  "Packing list and Alaska prep information",
                  "Remaining balance details",
                  "Final arrival and meetup instructions",
                ].map((item) => (
                  <div key={item} className="flex gap-3 text-neutral-300">
                    <span className="text-orange-400 font-bold">✓</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-orange-500/20 bg-orange-500/10 p-6">
              <h2 className="text-xl font-bold text-orange-300">
                Need anything before we reach out?
              </h2>

              <p className="mt-2 text-neutral-300">
                Call or text us anytime.
              </p>

              <div className="mt-3 text-2xl font-extrabold">
                907-406-7901
              </div>

              <div className="text-neutral-400">
                cooper@alaskaoffroadexpedition.com
              </div>
            </div>

            <div className="flex flex-col gap-4 md:flex-row md:justify-center">
              <Link
                to="/"
                className="rounded-xl bg-orange-500 px-6 py-3 text-center font-semibold text-white hover:bg-orange-400 transition"
              >
                Return Home
              </Link>

              <a
  href="https://www.alaskaoffroadexpedition.com/#merch"
  className="rounded-xl border border-white/20 px-6 py-3 text-center font-semibold hover:border-orange-400 transition"
>
  Shop Merch
</a>

<a
  href="https://www.alaskaoffroadexpedition.com/#faq"
  className="rounded-xl border border-white/20 px-6 py-3 text-center font-semibold hover:border-orange-400 transition"
>
  FAQ
</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}