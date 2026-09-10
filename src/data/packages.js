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
];

export const getPackageBySlug = (slug) => {
  return expeditionPackages.find(
    (expeditionPackage) =>
      expeditionPackage.slug === slug && expeditionPackage.active
  );
};