export default function ReservationConfirmed() {
  const params = new URLSearchParams(window.location.search);

  const bookingType = params.get("booking");
  const packageSlug = params.get("package");

  const isPackageBooking = bookingType === "package";

  const packageNames = {
    "winter-knik-glacier": "Winter Knik Glacier Experience",
  };

  const packageName =
    packageNames[packageSlug] || "Alaska Offroad Expedition";

  return (
    <div className="min-h-screen bg-neutral-950 px-4 py-8 text-neutral-100">
      <div className="mx-auto max-w-5xl overflow-hidden rounded-3xl border border-orange-500/20 bg-neutral-900 shadow-2xl">

        {/* Header */}
        <div className="bg-gradient-to-r from-orange-950/70 via-neutral-900 to-neutral-900 px-6 py-12 text-center md:px-12">
          <div className="text-xs font-semibold uppercase tracking-[0.35em] text-orange-400">
            Alaska Offroad Expedition
          </div>

          <h1 className="mt-5 text-4xl font-extrabold text-white md:text-5xl">
            Reservation Confirmed
          </h1>

          <p className="mt-4 text-lg text-neutral-200">
            Welcome to the Alaska Offroad Expedition family.
          </p>

          <p className="mt-2 text-neutral-300">
            Your adventure officially begins now.
          </p>
        </div>

        <div className="space-y-6 p-6 md:p-12">

          {/* PAYMENT CONFIRMATION */}
          <div className="rounded-2xl border border-white/10 bg-neutral-800/70 p-6">
            {isPackageBooking ? (
              <>
                <h2 className="text-2xl font-bold text-orange-400">
                  Your payment has been received in full.
                </h2>

                <p className="mt-3 leading-7 text-neutral-200">
                  Your reservation for the{" "}
                  <strong className="text-white">
                    {packageName}
                  </strong>{" "}
                  is confirmed and your expedition date is now reserved.
                  You'll receive a confirmation email shortly with your
                  reservation details and next steps.
                </p>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-orange-400">
                  Your 25% deposit has been received.
                </h2>

                <p className="mt-3 leading-7 text-neutral-200">
                  Your reservation is now being processed and your requested
                  dates are being secured. You'll receive a confirmation email
                  shortly with your trip details and next steps.
                </p>
              </>
            )}
          </div>

          {/* WHAT HAPPENS NEXT */}
          <div className="rounded-2xl border border-white/10 bg-neutral-800/70 p-6">
            <h2 className="text-xl font-bold text-white">
              What Happens Next
            </h2>

            {isPackageBooking ? (
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <NextItem text="Reservation confirmation email" />
                <NextItem text="Waiver and emergency contact forms" />
                <NextItem text="Knik Glacier trip preparation information" />
                <NextItem text="Final meetup location and arrival time" />
                <NextItem text="Winter clothing and gear recommendations" />
                <NextItem text="Driver information and requirements, if applicable" />
              </div>
            ) : (
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <NextItem text="Reservation confirmation email" />
                <NextItem text="Expedition itinerary review" />
                <NextItem text="Waiver and emergency contact forms" />
                <NextItem text="Packing list and Alaska prep information" />
                <NextItem text="Remaining balance details" />
                <NextItem text="Final arrival and meetup instructions" />
              </div>
            )}
          </div>

          {/* PACKAGE POLICY */}
          {isPackageBooking && (
            <div className="rounded-2xl border border-orange-500/30 bg-orange-950/30 p-6">
              <h2 className="text-xl font-bold text-orange-300">
                Winter Knik Glacier Cancellation Policy
              </h2>

              <p className="mt-3 leading-7 text-neutral-200">
                Cancel before the day of your expedition for a{" "}
                <strong className="text-white">full refund</strong>.
                Same-day cancellations are eligible for a{" "}
                <strong className="text-white">50% refund</strong>.
              </p>
            </div>
          )}

          {/* CONTACT */}
          <div className="rounded-2xl border border-orange-500/30 bg-orange-950/40 p-6">
            <h2 className="text-xl font-bold text-orange-300">
              Need anything before we reach out?
            </h2>

            <p className="mt-2 text-neutral-200">
              Call or text us anytime.
            </p>

            <a
              href="tel:9074067901"
              className="mt-4 block text-2xl font-extrabold text-white"
            >
              907-406-7901
            </a>

            <a
              href="mailto:cooper@alaskaoffroadexpedition.com"
              className="mt-1 block text-neutral-400 hover:text-white"
            >
              cooper@alaskaoffroadexpedition.com
            </a>
          </div>

          {/* BUTTONS */}
          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <a
              href="/"
              className="rounded-xl bg-orange-500 px-7 py-3 font-bold text-white transition hover:bg-orange-400"
            >
              Return Home
            </a>

            <a
              href="/#merch"
              className="rounded-xl border border-white/20 px-7 py-3 font-bold text-white transition hover:bg-white/10"
            >
              Shop Merch
            </a>

            <a
              href="/#faq"
              className="rounded-xl border border-white/20 px-7 py-3 font-bold text-white transition hover:bg-white/10"
            >
              FAQ
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function NextItem({ text }) {
  return (
    <div className="flex items-start gap-3">
      <span className="text-xl font-bold text-orange-500">
        ✓
      </span>

      <span className="pt-0.5 text-neutral-200">
        {text}
      </span>
    </div>
  );
}