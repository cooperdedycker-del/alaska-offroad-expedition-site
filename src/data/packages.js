export const expeditionPackages = [

  {
    id: "winter-knik-glacier",
    slug: "winter-knik-glacier",

    name: "Winter Knik Glacier Experience",
    duration: "Full Day",

    seasonLabel: "November – February",
    availableMonths: [11, 12, 1, 2],

    shortDescription:
      "Take a guided winter expedition through Alaska's backcountry to the Knik Glacier. Drive one of our expedition rigs or ride along and experience one of Alaska's most incredible winter destinations.",

    includes: [
      "Full-day guided Knik Glacier expedition",
      "Expedition-ready off-road vehicles",
      "Choose to drive or ride as a passenger",
      "Experienced off-road guides",
      "Recovery and safety equipment",
      "GMRS communications",
      "Remote Alaska glacier experience",
    ],

    image: "/images/knik-winter-package.png",

    maxDrivers: 2,
    maxPassengers: 11,

    driverPrice: 695,
    passengerPrice: 395,

    priceLabel: "Drivers $695 • Passengers $395",
    priceNote: "Full payment due at booking",

    paymentType: "full",
    active: true,
  },

    // ==========================================
  // GUNSIGHT MOUNTAIN ADVENTURES
  // Winter Snowmachine Packages
  // ==========================================

  {
    id: "gunsight-alpine-morning",
    slug: "gunsight-alpine-morning",
    name: "Alpine Morning Backcountry Ride",
    duration: "3 Hours",
    seasonLabel: "Winter Season",
    availableMonths: [11, 12, 1, 2, 3],

    shortDescription:
      "Start your morning with an unforgettable guided snowmachine adventure through Alaska's mountain valleys, winding winter trails, and scenic backcountry overlooks near Gunsight Mountain Lodge.",

    includes: [
      "Three-hour guided snowmachine adventure",
      "9:00 AM morning departure",
      "Experienced local backcountry guide",
      "Mountain valleys and scenic overlooks",
      "Coffee or hot cocoa",
    ],

    image: "/images/excursions/gsmlsr.png",
    pricePerPerson: 295,
    priceLabel: "$295 per person",
    bookingType: "request",
    paymentType: "request",
    active: true,
  },

  {
    id: "gunsight-frozen-waters",
    slug: "gunsight-frozen-waters",
    name: "Frozen Waters Ice Fishing Half-Day Ride",
    duration: "3 Hours",
    seasonLabel: "Winter Season",
    availableMonths: [11, 12, 1, 2, 3],

    shortDescription:
      "Combine a guided snowmachine adventure with remote Alaskan ice fishing. Travel to a secluded frozen backcountry lake and enjoy fishing surrounded by Alaska's magnificent winter scenery.",

    includes: [
      "Three-hour snowmachine and ice-fishing experience",
      "Experienced local backcountry guide",
      "Remote frozen lake access",
      "Ice-fishing equipment, augers, and tackle",
      "Coffee or hot cocoa",
    ],

    image: "/images/excursions/gsmlfw.png",
    pricePerPerson: 350,
    priceLabel: "$350 per person",
    bookingType: "request",
    paymentType: "request",
    active: true,
  },

  {
    id: "gunsight-full-day",
    slug: "gunsight-full-day",
    name: "Full Day Snowmachine & Ice Fishing Adventure",
    duration: "6–7 Hours",
    seasonLabel: "Winter Season",
    availableMonths: [11, 12, 1, 2, 3],

    shortDescription:
      "Experience Gunsight Mountain's premier full-day winter adventure. Explore remote mountain corridors, frozen riverbeds, and glacier-region scenery before stopping for backcountry ice fishing and a warm trailside lunch.",

    includes: [
      "Six-to-seven-hour guided snowmachine adventure",
      "Experienced local backcountry guide",
      "Glacier-region winter scenery",
      "Remote ice-fishing experience",
      "Ice-fishing and drilling equipment",
      "Warm trailside lunch",
      "Scenic photography opportunities",
    ],

    image: "/images/excursions/gsmlfd.png",
    pricePerPerson: 500,
    priceLabel: "$500 per person",
    bookingType: "request",
    paymentType: "request",
    active: true,
  },

  {
    id: "gunsight-twilight-ridge",
    slug: "gunsight-twilight-ridge",
    name: "Twilight Ridge & Sunset Backcountry Ride",
    duration: "3 Hours",
    seasonLabel: "Winter Season",
    availableMonths: [11, 12, 1, 2, 3],

    shortDescription:
      "Explore Alaska's winter wilderness as the afternoon sun sets over the mountains. Ride scenic valleys and timbered ridgelines before stopping at a panoramic viewpoint to experience the beauty of Alaska's evening light.",

    includes: [
      "Three-hour guided snowmachine adventure",
      "Afternoon and evening departure",
      "Experienced local backcountry guide",
      "Scenic mountain viewpoint stops",
      "Coffee or hot cocoa",
      "Return to Gunsight Mountain Lodge by dusk",
    ],

    image: "/images/excursions/gsmltl.png",
    pricePerPerson: 295,
    priceLabel: "$295 per person",
    bookingType: "request",
    paymentType: "request",
    active: true,
  },
  
];

export const getPackageBySlug = (slug) => {
  return expeditionPackages.find(
    (expeditionPackage) =>
      expeditionPackage.slug === slug && expeditionPackage.active
  );
};

// ==========================================
// PREBUILT VACATION PACKAGES
// These reference experiences.js
// ==========================================

export const vacationPackages = [
  {
    id: "winter-knik-adventure",
    name: "Winter Knik Glacier Adventure",
    description:
      "Experience Alaska's frozen backcountry in one of our expedition-ready Jeeps.",
    experienceIds: ["winter-knik-glacier"],
    lodgingNights: 0,
    image: "/images/knik-winter-package.png",
    active: true,
  },

  {
    id: "winter-alaska-explorer",
    name: "Winter Alaska Explorer",
    description:
      "Combine an unforgettable Knik Glacier 4x4 adventure with a guided snowmachine experience.",
    experienceIds: [
      "winter-knik-glacier",
      "gunsight-alpine-morning",
    ],
    lodgingNights: 0,
    image: "/images/knik-winter-package.png",
    active: true,
  },

  {
    id: "winter-glacier-ice-fishing",
    name: "Winter Glacier & Ice Fishing",
    description:
      "Explore Knik Glacier and experience remote Alaska ice fishing by snowmachine.",
    experienceIds: [
      "winter-knik-glacier",
      "gunsight-frozen-waters",
    ],
    lodgingNights: 0,
    image: "/images/knik-winter-package.png",
    active: true,
  },
];

export const getVacationPackageById = (id) =>
  vacationPackages.find(
    (pkg) => pkg.id === id && pkg.active
  );