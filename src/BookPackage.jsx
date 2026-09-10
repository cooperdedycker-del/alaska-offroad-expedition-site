import { useEffect, useMemo, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { getPackageBySlug } from "./data/packages";

export default function BookPackage() {
  const params = new URLSearchParams(window.location.search);
  const packageSlug = params.get("package");

  const expeditionPackage = getPackageBySlug(packageSlug);

  const [selectedDate, setSelectedDate] = useState(null);

  const [drivers, setDrivers] = useState(0);
  const [passengers, setPassengers] = useState(1);

  const [contact, setContact] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [participants, setParticipants] = useState([
    {
      name: "",
      age: "",
      shirtSize: "",
    },
  ]);

  const [blockedRanges, setBlockedRanges] = useState([]);
  const [blockedDates, setBlockedDates] = useState([]);
  const [availabilityLoading, setAvailabilityLoading] = useState(true);
  const [availabilityError, setAvailabilityError] = useState("");

  const [checkoutStatus, setCheckoutStatus] = useState("idle");
  const [checkoutError, setCheckoutError] = useState("");

  const totalGuests = Number(drivers) + Number(passengers);

  const total = useMemo(() => {
    if (!expeditionPackage) return 0;

    const driverTotal =
      Number(drivers) * Number(expeditionPackage.driverPrice || 0);

    const passengerTotal =
      Number(passengers) * Number(expeditionPackage.passengerPrice || 0);

    return driverTotal + passengerTotal;
  }, [drivers, passengers, expeditionPackage]);

  useEffect(() => {
    const requiredParticipants = Math.max(0, totalGuests);

    setParticipants((current) => {
      return Array.from({ length: requiredParticipants }, (_, index) => {
        return (
          current[index] || {
            name: "",
            age: "",
            shirtSize: "",
          }
        );
      });
    });
  }, [totalGuests]);

  useEffect(() => {
    async function loadAvailability() {
      try {
        setAvailabilityLoading(true);
        setAvailabilityError("");

        const res = await fetch("/api/calendar-availability");
        const data = await res.json();

        if (!res.ok) {
          throw new Error(
            data.error || "Failed to load calendar availability."
          );
        }

        const ranges = (data.busy || []).map((range) => ({
          start: new Date(range.start),
          end: new Date(range.end),
        }));

        setBlockedRanges(ranges);
        setBlockedDates(data.blockedDates || []);
      } catch (error) {
        console.error("Calendar availability error:", error);
        setAvailabilityError(
          "Could not load available dates right now."
        );
      } finally {
        setAvailabilityLoading(false);
      }
    }

    loadAvailability();
  }, []);

  function isDateBlocked(date) {
  const dateString =
    formatDateForForm(date);

  return blockedDates.includes(dateString);
}

  function isDateInSeason(date) {
  if (!expeditionPackage?.availableMonths?.length) {
    return true;
  }

  const month = date.getMonth() + 1;

  return expeditionPackage.availableMonths.includes(month);
}


  function formatDateForForm(date) {
    if (!date) return "";

    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, "0");
    const day = `${date.getDate()}`.padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  function updateParticipant(index, patch) {
    setParticipants((current) =>
      current.map((participant, participantIndex) =>
        participantIndex === index
          ? {
              ...participant,
              ...patch,
            }
          : participant
      )
    );
  }

  function participantLabel(index) {
    if (index < Number(drivers)) {
      return `Driver ${index + 1}`;
    }

    return `Passenger ${index - Number(drivers) + 1}`;
  }

  async function handleCheckout() {
    setCheckoutError("");

    if (!selectedDate) {
      setCheckoutStatus("error");
      setCheckoutError("Please choose an expedition date.");
      return;
    }

    if (totalGuests < 1) {
      setCheckoutStatus("error");
      setCheckoutError(
        "Please select at least one driver or passenger."
      );
      return;
    }

    if (drivers > expeditionPackage.maxDrivers) {
      setCheckoutStatus("error");
      setCheckoutError(
        `A maximum of ${expeditionPackage.maxDrivers} driver seats are available.`
      );
      return;
    }

    if (passengers > expeditionPackage.maxPassengers) {
      setCheckoutStatus("error");
      setCheckoutError(
        `A maximum of ${expeditionPackage.maxPassengers} passenger seats are available.`
      );
      return;
    }

    if (!contact.name.trim()) {
      setCheckoutStatus("error");
      setCheckoutError("Please enter your name.");
      return;
    }

    if (!contact.email.trim()) {
      setCheckoutStatus("error");
      setCheckoutError("Please enter your email.");
      return;
    }

    const missingParticipant = participants.some(
      (participant) =>
        !participant.name ||
        !participant.age ||
        !participant.shirtSize
    );

    if (missingParticipant) {
      setCheckoutStatus("error");
      setCheckoutError(
        "Please enter the name, age and shirt size for every participant."
      );
      return;
    }

    try {
      setCheckoutStatus("loading");

      const tripDate = formatDateForForm(selectedDate);

      /*
       * This intentionally uses the same general form/pricing
       * structure as the existing Trip Builder.
       *
       * Package-specific fields are included as well so the Stripe
       * checkout handler can identify this as a package reservation.
       */

      const form = {
        bookingType: "package",

        packageId: expeditionPackage.id,
        packageSlug: expeditionPackage.slug,
        packageName: expeditionPackage.name,

        start: tripDate,
        end: tripDate,

        experienceType:
          drivers > 0 ? "selfDrive" : "rideAlong",

        drivers: Number(drivers),
        passengers: Number(passengers),

        rig: "Alaska Offroad Expedition Fleet",

        lodgingPreference: "Not applicable",
        lodgingNotes: "",

        addOns: {},

        contact,

        participants,
      };

      const pricing = {
        bookingType: "package",

        packageId: expeditionPackage.id,
        packageName: expeditionPackage.name,

        driverPrice: expeditionPackage.driverPrice,
        passengerPrice: expeditionPackage.passengerPrice,

        driverCount: Number(drivers),
        passengerCount: Number(passengers),

        totalGuests,

        driverTotal:
          Number(drivers) *
          Number(expeditionPackage.driverPrice),

        passengerTotal:
          Number(passengers) *
          Number(expeditionPackage.passengerPrice),

        total,

        /*
         * Package is paid in full.
         * We send the full total as the amount due at checkout.
         */
        depositDue: total,
        balanceDue: 0,

        paymentType: "full",
      };

      const response = await fetch(
        "/api/create-checkout-session",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            form,
            pricing,
          }),
        }
      );

      const text = await response.text();

      let data = {};

      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        throw new Error(
          `Checkout did not return valid JSON. Status: ${response.status}`
        );
      }

      if (!response.ok || !data.url) {
        throw new Error(
          data.error || "Unable to start checkout."
        );
      }

      window.location.href = data.url;
    } catch (error) {
      console.error("Package checkout error:", error);

      setCheckoutStatus("error");

      setCheckoutError(
        error.message ||
          "Something went wrong starting checkout."
      );
    }
  }

  if (!expeditionPackage) {
    return (
      <div className="min-h-screen bg-neutral-950 px-4 py-20 text-white">
        <div className="mx-auto max-w-3xl rounded-3xl border border-white/10 bg-neutral-900 p-8 text-center">
          <h1 className="text-3xl font-bold">
            Package Not Found
          </h1>

          <p className="mt-4 text-neutral-400">
            This expedition package is not currently available.
          </p>

          <a
            href="/"
            className="mt-6 inline-flex rounded-xl bg-orange-400 px-6 py-3 font-bold text-neutral-950 hover:bg-orange-300"
          >
            Return Home
          </a>
        </div>
      </div>
    );
  }

  const shirtSizes = [
    "Youth S",
    "Youth M",
    "Youth L",
    "S",
    "M",
    "L",
    "XL",
    "2XL",
    "3XL",
    "4XL",
  ];

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      {/* Top Bar */}
      <header className="border-b border-white/10 bg-neutral-950">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <a
            href="/"
            className="flex items-center gap-3"
          >
            <img
              src="/images/Newlogo.png"
              alt="Alaska Offroad Expedition"
              className="h-10 w-10 object-contain"
            />

            <span className="font-semibold">
              Alaska Offroad Expedition
            </span>
          </a>

          <a
            href="/"
            className="text-sm text-neutral-400 transition hover:text-white"
          >
            ← Back to Website
          </a>
        </div>
      </header>

      {/* Package Hero */}
      <section className="relative overflow-hidden">
        {expeditionPackage.image && (
          <div className="absolute inset-0">
            <img
              src={expeditionPackage.image}
              alt={expeditionPackage.name}
              className="h-full w-full object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/30" />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent" />
          </div>
        )}

        <div className="relative mx-auto max-w-7xl px-4 py-20 md:py-28">
          <div className="max-w-3xl">
            <div className="inline-flex rounded-full border border-orange-400/40 bg-orange-400/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] text-orange-300">
              {expeditionPackage.seasonLabel} •{" "}
              {expeditionPackage.duration}
            </div>

            <h1 className="mt-5 text-4xl font-extrabold leading-tight text-white md:text-6xl">
              {expeditionPackage.name}
            </h1>

            <p className="mt-5 max-w-2xl text-lg leading-8 text-neutral-200">
              {expeditionPackage.shortDescription}
            </p>
          </div>
        </div>
      </section>

      {/* Booking Area */}
      <main className="mx-auto max-w-7xl px-4 pb-20">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left */}
          <div className="space-y-6 lg:col-span-2">
            {/* Date */}
            <section className="rounded-3xl border border-white/10 bg-neutral-900/60 p-6 md:p-8">
              <div className="text-sm font-bold uppercase tracking-[0.15em] text-orange-400">
                Step 1
              </div>

              <h2 className="mt-2 text-2xl font-bold">
                Choose Your Date
              </h2>

              <p className="mt-2 text-neutral-400">
                Select an available date for your Knik Glacier expedition.
              </p>

              <div className="mt-6 max-w-md">
                <label className="text-sm text-neutral-300">
                  Expedition Date
                </label>

                <DatePicker
  selected={selectedDate}
  onChange={(date) => setSelectedDate(date)}
  minDate={new Date()}
  filterDate={(date) =>
    isDateInSeason(date) && !isDateBlocked(date)
  }
  disabled={availabilityLoading || !!availabilityError}
  placeholderText={
    availabilityLoading
      ? "Checking availability..."
      : availabilityError
      ? "Availability unavailable"
      : "Select available date"
  }
  dateFormat="MMMM d, yyyy"
  className="mt-2 w-full rounded-xl border border-white/10 bg-neutral-800 px-4 py-3 text-white disabled:cursor-not-allowed disabled:opacity-50"
/>

<div className="mt-3 text-sm text-neutral-400">
  Winter Knik Glacier expeditions are available November through February.
  Dates already reserved or unavailable are automatically blocked.
</div>

                {availabilityLoading && (
                  <div className="mt-2 text-xs text-neutral-500">
                    Checking availability...
                  </div>
                )}

                {availabilityError && (
                  <div className="mt-2 text-xs text-red-300">
                    {availabilityError}
                  </div>
                )}
              </div>
            </section>

            {/* Seats */}
            <section className="rounded-3xl border border-white/10 bg-neutral-900/60 p-6 md:p-8">
              <div className="text-sm font-bold uppercase tracking-[0.15em] text-orange-400">
                Step 2
              </div>

              <h2 className="mt-2 text-2xl font-bold">
                Choose Your Seats
              </h2>

              <p className="mt-2 text-neutral-400">
                Drive one of our expedition rigs or come along as a passenger.
              </p>

              <div className="mt-6 grid gap-5 md:grid-cols-2">
                {/* Drivers */}
                <div className="rounded-2xl border border-orange-400/30 bg-orange-400/5 p-5">
                  <div className="text-xl font-bold text-white">
                    Driver Seats
                  </div>

                  <div className="mt-1 text-2xl font-extrabold text-orange-400">
                    $
                    {expeditionPackage.driverPrice.toLocaleString()}
                  </div>

                  <div className="mt-1 text-sm text-neutral-400">
                    Per driver
                  </div>

                  <p className="mt-4 text-sm leading-6 text-neutral-300">
                    Take the wheel of one of our expedition rigs while following
                    your guide through the Knik Glacier backcountry.
                  </p>

                  <div className="mt-5">
                    <label className="text-sm text-neutral-300">
                      Drivers
                    </label>

                    <select
                      value={drivers}
                      onChange={(e) =>
                        setDrivers(Number(e.target.value))
                      }
                      className="mt-2 w-full rounded-xl bg-neutral-800 px-4 py-3"
                    >
                      {Array.from(
                        {
                          length:
                            expeditionPackage.maxDrivers + 1,
                        },
                        (_, number) => (
                          <option
                            key={number}
                            value={number}
                          >
                            {number}
                          </option>
                        )
                      )}
                    </select>
                  </div>
                </div>

                {/* Passengers */}
                <div className="rounded-2xl border border-white/10 bg-neutral-800/50 p-5">
                  <div className="text-xl font-bold text-white">
                    Passenger Seats
                  </div>

                  <div className="mt-1 text-2xl font-extrabold text-white">
                    $
                    {expeditionPackage.passengerPrice.toLocaleString()}
                  </div>

                  <div className="mt-1 text-sm text-neutral-400">
                    Per passenger
                  </div>

                  <p className="mt-4 text-sm leading-6 text-neutral-300">
                    Ride along and enjoy the expedition while your guide or
                    another member of your group handles the driving.
                  </p>

                  <div className="mt-5">
                    <label className="text-sm text-neutral-300">
                      Passengers
                    </label>

                    <select
                      value={passengers}
                      onChange={(e) =>
                        setPassengers(Number(e.target.value))
                      }
                      className="mt-2 w-full rounded-xl bg-neutral-800 px-4 py-3"
                    >
                      {Array.from(
                        {
                          length:
                            expeditionPackage.maxPassengers + 1,
                        },
                        (_, number) => (
                          <option
                            key={number}
                            value={number}
                          >
                            {number}
                          </option>
                        )
                      )}
                    </select>
                  </div>
                </div>
              </div>

              <div className="mt-5 rounded-xl border border-white/10 bg-neutral-800/40 p-4 text-sm text-neutral-300">
                Up to{" "}
                <strong>
                  {expeditionPackage.maxDrivers} driver seats
                </strong>{" "}
                and{" "}
                <strong>
                  {expeditionPackage.maxPassengers} passenger seats
                </strong>{" "}
                are available per expedition.
              </div>
            </section>

            {/* Contact */}
            <section className="rounded-3xl border border-white/10 bg-neutral-900/60 p-6 md:p-8">
              <div className="text-sm font-bold uppercase tracking-[0.15em] text-orange-400">
                Step 3
              </div>

              <h2 className="mt-2 text-2xl font-bold">
                Your Information
              </h2>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm text-neutral-300">
                    Full Name
                  </label>

                  <input
                    value={contact.name}
                    onChange={(e) =>
                      setContact({
                        ...contact,
                        name: e.target.value,
                      })
                    }
                    className="mt-2 w-full rounded-xl bg-neutral-800 px-4 py-3"
                    placeholder="Full name"
                  />
                </div>

                <div>
                  <label className="text-sm text-neutral-300">
                    Email
                  </label>

                  <input
                    value={contact.email}
                    onChange={(e) =>
                      setContact({
                        ...contact,
                        email: e.target.value,
                      })
                    }
                    type="email"
                    className="mt-2 w-full rounded-xl bg-neutral-800 px-4 py-3"
                    placeholder="you@email.com"
                  />
                </div>

                <div>
                  <label className="text-sm text-neutral-300">
                    Phone
                  </label>

                  <input
                    value={contact.phone}
                    onChange={(e) =>
                      setContact({
                        ...contact,
                        phone: e.target.value,
                      })
                    }
                    className="mt-2 w-full rounded-xl bg-neutral-800 px-4 py-3"
                    placeholder="907-555-5555"
                  />
                </div>
              </div>
            </section>

            {/* Participants */}
            {totalGuests > 0 && (
              <section className="rounded-3xl border border-white/10 bg-neutral-900/60 p-6 md:p-8">
                <div className="text-sm font-bold uppercase tracking-[0.15em] text-orange-400">
                  Step 4
                </div>

                <h2 className="mt-2 text-2xl font-bold">
                  Participant Details
                </h2>

                <p className="mt-2 text-neutral-400">
                  Enter the information for everyone joining the expedition.
                </p>

                <div className="mt-6 space-y-4">
                  {participants.map(
                    (participant, index) => (
                      <div
                        key={index}
                        className="rounded-2xl border border-white/10 bg-neutral-800/50 p-5"
                      >
                        <div className="font-bold text-white">
                          {participantLabel(index)}
                        </div>

                        <div className="mt-4 grid gap-4 md:grid-cols-3">
                          <div>
                            <label className="text-sm text-neutral-300">
                              Name
                            </label>

                            <input
                              value={participant.name}
                              onChange={(e) =>
                                updateParticipant(index, {
                                  name: e.target.value,
                                })
                              }
                              className="mt-2 w-full rounded-xl bg-neutral-900 px-4 py-3"
                              placeholder="Full name"
                            />
                          </div>

                          <div>
                            <label className="text-sm text-neutral-300">
                              Age
                            </label>

                            <input
                              value={participant.age}
                              onChange={(e) =>
                                updateParticipant(index, {
                                  age: e.target.value,
                                })
                              }
                              type="number"
                              min="0"
                              className="mt-2 w-full rounded-xl bg-neutral-900 px-4 py-3"
                              placeholder="Age"
                            />
                          </div>

                          <div>
                            <label className="text-sm text-neutral-300">
                              Shirt Size
                            </label>

                            <select
                              value={
                                participant.shirtSize
                              }
                              onChange={(e) =>
                                updateParticipant(index, {
                                  shirtSize:
                                    e.target.value,
                                })
                              }
                              className="mt-2 w-full rounded-xl bg-neutral-900 px-4 py-3"
                            >
                              <option value="">
                                Select size
                              </option>

                              {shirtSizes.map((size) => (
                                <option
                                  key={size}
                                  value={size}
                                >
                                  {size}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </section>
            )}
          </div>

          {/* Right Summary */}
          <aside>
            <div className="sticky top-6 rounded-3xl border border-white/10 bg-neutral-900 p-6 shadow-2xl">
              <div className="text-sm font-semibold uppercase tracking-[0.15em] text-orange-400">
                Your Expedition
              </div>

              <h3 className="mt-2 text-2xl font-bold">
                {expeditionPackage.name}
              </h3>

              <div className="mt-6 space-y-4 border-y border-white/10 py-5">
                <div className="flex justify-between gap-4">
                  <span className="text-neutral-400">
                    Date
                  </span>

                  <span className="text-right font-semibold">
                    {selectedDate
                      ? selectedDate.toLocaleDateString(
                          "en-US",
                          {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          }
                        )
                      : "Select date"}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-neutral-400">
                    Drivers
                  </span>

                  <span>
                    {drivers} × $
                    {expeditionPackage.driverPrice.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-neutral-400">
                    Passengers
                  </span>

                  <span>
                    {passengers} × $
                    {expeditionPackage.passengerPrice.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-neutral-400">
                    Total Guests
                  </span>

                  <span>{totalGuests}</span>
                </div>
              </div>

              <div className="mt-5 flex items-end justify-between">
                <div>
                  <div className="text-sm text-neutral-400">
                    Total
                  </div>

                  <div className="text-4xl font-extrabold text-white">
                    ${total.toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="mt-2 text-xs text-neutral-500">
                Full payment is due when booking.
              </div>

              {checkoutStatus === "error" &&
                checkoutError && (
                  <div className="mt-5 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
                    {checkoutError}
                  </div>
                )}

              <button
                type="button"
                onClick={handleCheckout}
                disabled={
                  checkoutStatus === "loading" ||
                  totalGuests < 1
                }
                className="mt-6 w-full rounded-xl bg-orange-400 px-5 py-4 text-lg font-bold text-neutral-950 transition hover:bg-orange-300 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {checkoutStatus === "loading"
                  ? "Opening Checkout..."
                  : `BOOK NOW — $${total.toLocaleString()}`}
              </button>

              {/* Cancellation Policy */}
              <div className="mt-6 rounded-xl border border-white/10 bg-neutral-800/50 p-4">
                <div className="font-semibold text-white">
                  Cancellation Policy
                </div>

                <div className="mt-2 space-y-2 text-sm leading-6 text-neutral-400">
                  <p>
                    Cancel before the day of your
                    expedition and receive a{" "}
                    <strong className="text-neutral-200">
                      full refund.
                    </strong>
                  </p>

                  <p>
                    Same-day cancellations are eligible
                    for a{" "}
                    <strong className="text-neutral-200">
                      50% refund.
                    </strong>
                  </p>
                </div>
              </div>

              {/* Includes */}
              <div className="mt-6">
                <div className="font-semibold text-white">
                  What's Included
                </div>

                <ul className="mt-3 space-y-2">
                  {expeditionPackage.includes.map(
                    (item) => (
                      <li
                        key={item}
                        className="flex gap-2 text-sm text-neutral-400"
                      >
                        <span className="text-orange-400">
                          ✓
                        </span>

                        <span>{item}</span>
                      </li>
                    )
                  )}
                </ul>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}