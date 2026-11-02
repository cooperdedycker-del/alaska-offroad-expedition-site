/*
 * ALASKA OFFROAD EXPEDITION
 * MASTER EXPERIENCE CATALOG
 *
 * Every activity is maintained here.
 * Packages reference experience IDs.
 * Partner reservations require provider confirmation.
 */

// ==========================================
// ALASKA OFFROAD EXPEDITION OPERATING SEASONS
// ==========================================

export const OPERATING_SEASONS = {
  summer: [6, 7, 8, 9],
  winter: [10, 11, 12, 1, 2, 3, 4, 5],
};

export function getOperatingSeason(dateString) {
  if (!dateString) return null;

  const month = Number(dateString.slice(5, 7));

  if (OPERATING_SEASONS.summer.includes(month)) {
    return "summer";
  }

  if (OPERATING_SEASONS.winter.includes(month)) {
    return "winter";
  }

  return null;
} 


export const BOOKING_RATES = {
  // SUMMER EXPEDITION PRICING
  summerExpeditionDailyRate: 1250,
  summerArrivalDayRate: 250,
  summerDepartureDayRate: 250,

  // Included in summer expedition pricing
  summerAirbnbIncluded: true,
  summerCampingIncluded: true,
  summerAirportPickupIncluded: true,
  summerAirportDropoffIncluded: true,
  summerExpeditionJeepIncluded: true,

  // WINTER KNIK GLACIER
  winterKnikDriver: 695,
  winterKnikPassenger: 395,

  // Optional winter lodging
  airbnbNight: 300,

  // Partner experiences
  partnerTransportRoundTrip: 150,

  // Booking payments
  depositPercent: 0.25,
  fullPaymentWithinDays: 14,

  // Resident discount
  alaskaResidentDiscount: 0.10,
};


// ==========================================
// SEASONAL PRICING — SUMMER & WINTER
// ==========================================

export const SEASONAL_RATES = {
  summer: {
    expeditionDay: 1250,
    airbnbNight: 350, // reference only; standard AOE lodging included
    jeepExpeditionDay: 1250,
    additionalGuestDay: 200,
    tagAlongRigDay: 350,
  },
  winter: {
    expeditionDay: 600, // first guest: Jeep, AOE lodging and transportation included
    additionalGuestDay: 300, // each additional guest per winter expedition day
    airbnbNight: 350, // reference rate, not an extra trip charge
    jeepRentalDay: 350, // legacy reference; NOT independently charged
    partnerTransferPerExcursion: 250,
    // Standalone day-trip only. For multi-day winter bookings Knik is included.
    knikDriver: 695,
    knikPassenger: 395,
  },
};


// CONSOLIDATED MASTER CATALOG
// All partner descriptions, galleries, links, and seasons are maintained here.
// Current rates from experiences.js take precedence over outdated excursions.js prices.
// Knik's old $500 per-person listing is NOT a separately bookable product.
// IMPORTANT: Keep excursions.js in place until its imports are migrated.

export const experiences = [
  {
    "id": "winter-knik-glacier",
    "key": "winter-knik-glacier",
    "name": "Winter Knik Glacier 4x4 Adventure",
    "operator": "AOE",
    "category": "offroad",
    "season": "winter",
    "availableMonths": [
      10,
      11,
      12,
      1,
      2,
      3,
      4,
      5
    ],
    "durationHours": 8,
    "pricingType": "driverPassenger",
    "driverPrice": 695,
    "passengerPrice": 395,
    "maxDrivers": 2,
    "maxPassengers": 11,
    "transportationIncluded": true,
    "location": "Knik Glacier, Alaska",
    "image": "/images/knik-winter-package.png",
    "description": "Explore Knik Glacier in an expedition-ready Jeep Gladiator. Drive one of our rigs or ride with an experienced guide. Experience frozen icebergs, incredible glacier scenery, a hot lunch, and warm beverages.",
    "active": true,
    "images": [
      "/images/knik-winter-package.png",
      "/images/excursions/winterknik.jpg"
    ],
    "legacyExcursionKey": "Knik Winter Expedition"
  },
  {
    "id": "custom-offroad-expedition",
    "key": "custom-offroad-expedition",
    "name": "Custom Guided Alaska Off-Road Expedition",
    "operator": "AOE",
    "category": "offroad",
    "season": "summer",
    "availableMonths": [
      5,
      6,
      7,
      8,
      9
    ],
    "durationHours": null,
    "pricingType": "customExpedition",
    "selfDriveDaily": 1250,
    "arrivalDayRate": 250,
    "departureDayRate": 250,
    "lodgingIncluded": true,
    "airportTransportationIncluded": true,
    "selfDrivePassengerDaily": 100,
    "rideAlongFirstGuestDaily": 500,
    "rideAlongAdditionalGuestDaily": 350,
    "bringYourOwnRigDaily": 350,
    "transportationIncluded": true,
    "location": "Alaska",
    "image": "/images/hero-illustration.png",
    "description": "Build your own guided Alaska off-road adventure. Choose your expedition length, driving style, camping options, and destinations.",
    "active": true
  },
  {
    "id": "gunsight-alpine-morning",
    "key": "gunsight-alpine-morning",
    "name": "Alpine Morning Backcountry Ride",
    "operator": "Gunsight Mountain Adventures",
    "category": "snowmachine",
    "season": "winter",
    "availableMonths": [
      11,
      12,
      1,
      2,
      3
    ],
    "durationHours": 3,
    "departureTime": "09:00",
    "price": 295,
    "priceType": "perPerson",
    "transportationIncluded": false,
    "location": "Gunsight Mountain / Eureka, Alaska",
    "image": "/images/excursions/gsmlsr.png",
    "description": "A guided morning snowmachine ride through scenic mountain valleys, winter trails, and backcountry overlooks. Coffee or hot cocoa included.",
    "active": true,
    "requiresConfirmation": true
  },
  {
    "id": "gunsight-frozen-waters",
    "key": "gunsight-frozen-waters",
    "name": "Frozen Waters Ice Fishing Half-Day Ride",
    "operator": "Gunsight Mountain Adventures",
    "category": "snowmachine",
    "season": "winter",
    "availableMonths": [
      11,
      12,
      1,
      2,
      3
    ],
    "durationHours": 3,
    "price": 350,
    "priceType": "perPerson",
    "transportationIncluded": false,
    "location": "Gunsight Mountain / Eureka, Alaska",
    "image": "/images/excursions/gsmlfw.png",
    "description": "Ride snowmachines to a remote frozen lake for an unforgettable ice-fishing experience. Fishing equipment and warm beverages included.",
    "active": true,
    "requiresConfirmation": true
  },
  {
    "id": "gunsight-full-day",
    "key": "gunsight-full-day",
    "name": "Full Day Snowmachine & Ice Fishing Adventure",
    "operator": "Gunsight Mountain Adventures",
    "category": "snowmachine",
    "season": "winter",
    "availableMonths": [
      11,
      12,
      1,
      2,
      3
    ],
    "durationHours": 7,
    "price": 500,
    "priceType": "perPerson",
    "transportationIncluded": false,
    "location": "Gunsight Mountain / Eureka, Alaska",
    "image": "/images/excursions/gsmlfd.png",
    "description": "An extended backcountry snowmachine expedition featuring glacier-region scenery, remote ice fishing, photography opportunities, and a warm trailside lunch.",
    "active": true,
    "requiresConfirmation": true
  },
  {
    "id": "gunsight-twilight-ridge",
    "key": "gunsight-twilight-ridge",
    "name": "Twilight Ridge & Sunset Backcountry Ride",
    "operator": "Gunsight Mountain Adventures",
    "category": "snowmachine",
    "season": "winter",
    "availableMonths": [
      11,
      12,
      1,
      2,
      3
    ],
    "durationHours": 3,
    "price": 295,
    "priceType": "perPerson",
    "transportationIncluded": false,
    "location": "Gunsight Mountain / Eureka, Alaska",
    "image": "/images/excursions/gsmltl.png",
    "description": "Explore Alaska's snowy valleys and mountain ridges during the afternoon and evening. Enjoy scenic viewpoints and hot beverages before returning by dusk.",
    "active": true,
    "requiresConfirmation": true
  },
  {
    "id": "hatcherPassAtv",
    "key": "hatcherPassAtv",
    "name": "Hatcher Pass ATV Tours",
    "operator": "Partner",
    "category": "atv",
    "season": "summer",
    "price": 500,
    "priceType": "perPerson",
    "transportationIncluded": false,
    "location": "Hatcher Pass, Alaska",
    "image": "https://hatcherpasstour.com/wp-content/uploads/2026/01/Summer-UTV-Tour-Hatcher-Pass-Alaska.jpg",
    "description": "Explore Hatcher Pass and the Talkeetna Mountains on a guided ATV adventure.",
    "active": true,
    "requiresConfirmation": true,
    "website": "https://hatcherpasstour.com/",
    "type": "Alaska ATV and Snowmobile Tours",
    "desc": "Explore Alaska’s backcountry on a guided ride through the rugged Talkeetna Mountains of Hatcher Pass with unmatched panoramic views, creek crossings, and Denali views on clear days—without sacrificing comfort.",
    "images": [
      "https://hatcherpasstour.com/wp-content/uploads/2026/01/Summer-UTV-Tour-Hatcher-Pass-Alaska.jpg"
    ],
    "tripBuilder": true
  },
  {
    "id": "outboundHeli",
    "key": "outboundHeli",
    "name": "Outbound Heli Adventures",
    "operator": "Partner",
    "category": "helicopter",
    "season": "summer",
    "price": 550,
    "priceType": "perPerson",
    "transportationIncluded": false,
    "image": "/images/excursions/outbound1.jpg",
    "description": "Scenic helicopter flights, glacier landings, and incredible aerial views of Alaska.",
    "active": true,
    "requiresConfirmation": true,
    "availability": "June – Mid September",
    "seasonStart": "06-01",
    "seasonEnd": "09-15",
    "availabilityColor": "green",
    "website": "https://outboundheli.com/",
    "type": "Helicopter / Glacier Access",
    "desc": "Scenic flights, glacier landings, and remote ridge access—perfect for next-level views and unforgettable photo ops.",
    "images": [
      "/images/excursions/outbound1.jpg"
    ],
    "tripBuilder": true
  },
  {
    "id": "Ice Climbing Root Glacier!",
    "key": "Ice Climbing Root Glacier!",
    "name": "Ice Climbing Root Glacier",
    "operator": "Partner",
    "category": "glacier",
    "season": "summer",
    "price": 200,
    "priceType": "perPerson",
    "transportationIncluded": false,
    "location": "McCarthy, Alaska",
    "image": "https://www.steliasguides.com/wp-content/uploads/2023/01/ice-climbing-gallery-1.webp",
    "description": "Explore Root Glacier with experienced guides and learn to climb its incredible ice formations.",
    "active": true,
    "requiresConfirmation": true,
    "availability": "June – Mid September",
    "seasonStart": "06-01",
    "seasonEnd": "09-15",
    "availabilityColor": "green",
    "duration": "6–8 Hours",
    "difficulty": "Moderate",
    "website": "www.alaskaoffroadexpedition.com",
    "features": [
      "Guided experience",
      "Great for photos",
      "Adventure"
    ],
    "type": "Guided Glacier Adventure",
    "sc": "Step onto the ancient blue ice of Root Glacier and experience the thrill of climbing frozen ice walls with professional guides. Learn basic climbing techniques, explore glacial features, and enjoy one of Alaska's most unforgettable adventures—all surrounded by breathtaking mountain scenery in Wrangell-St. Elias National Park.",
    "images": [
      "https://www.steliasguides.com/wp-content/uploads/2023/01/ice-climbing-gallery-1.webp"
    ],
    "tripBuilder": true
  },
  {
    "id": "Mill Tour",
    "key": "Mill Tour",
    "name": "Kennecott Mill Town Tour",
    "operator": "Partner",
    "category": "history",
    "season": "summer",
    "price": 50,
    "priceType": "perPerson",
    "transportationIncluded": false,
    "location": "Kennecott, Alaska",
    "image": "https://www.steliasguides.com/wp-content/uploads/2026/08/Mill-Tour-6.jpg",
    "description": "Discover the history of Kennecott's famous mining town on a guided historical tour.",
    "active": true,
    "requiresConfirmation": true,
    "availability": "June – Mid September",
    "seasonStart": "06-01",
    "seasonEnd": "09-15",
    "availabilityColor": "green",
    "website": "https://www.steliasguides.com",
    "features": [
      "Guided experience",
      "Great for photos",
      "Family friendly"
    ],
    "type": "History tour",
    "desc": "Kennecott, Alaska is a ghost town frozen in time. When the Kennecott Copper Corporation abruptly abandoned the town in 1938, they left behind their equipment, buildings, and personal belongings; yet, their stories of discovery, perseverance, and ingenuity live on!",
    "images": [
      "https://www.steliasguides.com/wp-content/uploads/2026/08/Mill-Tour-6.jpg"
    ],
    "tripBuilder": true
  },
  {
    "id": "alaskaPremierEnduro",
    "key": "alaskaPremierEnduro",
    "name": "Alaska Premier Enduro",
    "operator": "Partner",
    "category": "motorsports",
    "season": "summer",
    "price": 350,
    "priceType": "perPerson",
    "transportationIncluded": false,
    "image": "/images/excursions/APE1.jpg",
    "description": "Experience technical Alaska backcountry terrain on a guided dirt bike adventure.",
    "active": true,
    "requiresConfirmation": true,
    "availability": "June – Mid September",
    "seasonStart": "06-01",
    "seasonEnd": "09-15",
    "availabilityColor": "green",
    "website": "https://www.alaskapremierendurollc.com/",
    "type": "Motorsports",
    "desc": "Technical terrain and high-energy off-road Dirt Bike riding experiences for guests who want adrenaline and skill-based routes.",
    "images": [
      "/images/excursions/APE1.jpg"
    ],
    "tripBuilder": true
  },
  {
    "id": "phantomTriRiver",
    "key": "phantomTriRiver",
    "name": "Phantom Tri-River Charters",
    "operator": "Partner",
    "category": "fishing",
    "season": "summer",
    "price": 500,
    "priceType": "perPerson",
    "transportationIncluded": false,
    "location": "Talkeetna, Alaska",
    "image": "/images/excursions/tririver.jpg",
    "description": "Experience guided fishing and river adventures in the Talkeetna area.",
    "active": true,
    "requiresConfirmation": true,
    "availability": "June – Mid September",
    "seasonStart": "06-01",
    "seasonEnd": "09-15",
    "availabilityColor": "green",
    "website": "https://phantomtririvercharters.com/",
    "type": "Lodging and fishing charters in Talkeetna Alaska",
    "desc": "Experience the charm of Talkeetna while enjoying world-class fishing, comfortable lodging, and unforgettable Alaska adventures. This is a perfect add-on for guests looking to explore one of Alaska's most iconic destinations.",
    "images": [
      "/images/excursions/tririver.jpg"
    ],
    "tripBuilder": true
  },
  {
    "id": "kingForADay",
    "key": "kingForADay",
    "name": "King for a Day Campground",
    "operator": "Partner",
    "category": "fishing",
    "season": "summer",
    "price": 500,
    "priceType": "perPerson",
    "transportationIncluded": false,
    "location": "Copper Center, Alaska",
    "image": "/images/excursions/fishandfloat.jpg",
    "description": "Fishing, lodging, and river adventures near Copper Center.",
    "active": true,
    "requiresConfirmation": true,
    "availability": "May – Mid September",
    "seasonStart": "0-01",
    "seasonEnd": "09-15",
    "availabilityColor": "green",
    "website": "https://akcharters.com/",
    "type": "Lodging & Fishing Experience in Copper Center Alaska",
    "desc": "Located along the scenic drive to McCarthy, King for a Day Campground offers world-class fishing, comfortable lodging, guided river adventures, and breathtaking Alaska scenery. It's the perfect stop for guests looking to experience Alaska's wild beauty while enjoying a relaxing and memorable stay.",
    "images": [
      "/images/excursions/fishandfloat.jpg"
    ],
    "tripBuilder": true
  },
  {
    "id": "gunsightLodge",
    "key": "gunsightLodge",
    "name": "Gunsight Mountain Lodge",
    "operator": "Partner",
    "category": "lodging",
    "season": "year-round",
    "price": 200,
    "priceType": "perPerson",
    "transportationIncluded": false,
    "location": "Gunsight Mountain, Alaska",
    "image": "/images/excursions/GSML1.jpg",
    "description": "Stay near Alaska's backcountry trail systems at Gunsight Mountain Lodge.",
    "active": true,
    "requiresConfirmation": true,
    "website": "https://www.facebook.com/gunsight.mtn.lodge/",
    "type": "Lodging",
    "desc": "Gun Sight Mountain Lodge offers comfortable, welcoming accommodations at the base of one of Alaska’s most accessible and diverse off-road trail systems. Hosted by Hap, the lodge serves as an ideal home base for summer and winter adventures, providing easy access to trail riding, overland routes, snowmachine terrain, and backcountry exploration—all while offering a warm, relaxed place to recharge after a day in the outdoors.",
    "images": [
      "/images/excursions/GSML1.jpg"
    ],
    "tripBuilder": true
  },
  {
    "id": "seacraftHover",
    "key": "seacraftHover",
    "name": "Seacraft Hover Tours",
    "operator": "Partner",
    "category": "hovercraft",
    "season": "summer",
    "price": 400,
    "priceType": "perPerson",
    "transportationIncluded": false,
    "image": "/images/excursions/seacraft.jpg",
    "description": "Discover remote Alaska scenery aboard an amphibious hovercraft.",
    "active": true,
    "requiresConfirmation": true,
    "availability": "June – Mid September",
    "seasonStart": "06-01",
    "seasonEnd": "09-15",
    "availabilityColor": "green",
    "website": "https://www.seacrafthovertours.com/",
    "type": "Hovercraft Tour",
    "desc": "You will have unrestricted access to many places inaccessible to traditional watercraft. Instead of riding on the water, you will fly just above it in a true amphibious vessel.",
    "images": [
      "/images/excursions/seacraft.jpg"
    ],
    "tripBuilder": true
  },
  {
    "key": "becomePartner",
    "name": "Become a Partner Today",
    "type": "Give us a call to get added to our list",
    "desc": "We are always looking for businesses to add to our partner list. Contact us today!",
    "price": 0,
    "priceType": "perPerson",
    "tripBuilder": false,
    "images": [
      "/images/excursions/Looking for1.png"
    ],
    "website": "https://www.alaskaoffroadexpedition.com/#contact",
    "id": "becomePartner",
    "operator": "AOE",
    "category": "partner-information",
    "season": "year-round",
    "active": true,
    "requiresConfirmation": false,
    "image": "/images/excursions/Looking for1.png",
    "description": "We are always looking for businesses to add to our partner list. Contact us today!"
  },
  // =========================================================
  // PARTNER EXPERIENCE CONCEPTS — INACTIVE, UNCONFIRMED DRAFTS
  // =========================================================
  // Descriptions are preliminary catalog concepts and require provider verification.
  // Rates, dates, capacity and AOE reseller permissions are NOT confirmed.
  // Do not mark active until request-to-book UI and checkout rules support quote pricing.
  // Existing entries and IDs above are preserved unchanged.
  {
    "id": "stelias-root-halfday",
    "key": "stelias-root-halfday",
    "name": "Root Glacier Half-Day Guided Hike",
    "operator": "St. Elias Alpine Guides",
    "category": "glacier",
    "season": "summer",
    "price": null,
    "priceType": "quote",
    "pricingType": "quote",
    "priceStatus": "partner-confirmation-required",
    "transportationIncluded": false,
    "image": "https://www.steliasguides.com/wp-content/uploads/2025/03/Getting-to-the-Root-Glacier.jpg",
    "images": [
      "https://www.steliasguides.com/wp-content/uploads/2025/03/Getting-to-the-Root-Glacier.jpg"
    ],
    "description": "A guided hike from Kennecott toward the Root Glacier with time exploring the ice using appropriate glacier equipment.",
    "active": false,
    "tripBuilder": false,
    "requiresConfirmation": true,
    "website": "https://www.steliasguides.com/trips/half-day-glacier-hike/",
    "sourceUrl": "https://www.steliasguides.com/trips/half-day-glacier-hike/",
    "catalogStatus": "draft-not-bookable",
    "availableMonths": [
      6,
      7,
      8,
      9
    ]
  },
  {
    "id": "stelias-root-fullday",
    "key": "stelias-root-fullday",
    "name": "Root Glacier Full-Day Hike & Donoho Falls",
    "operator": "St. Elias Alpine Guides",
    "category": "glacier",
    "season": "summer",
    "price": null,
    "priceType": "quote",
    "pricingType": "quote",
    "priceStatus": "partner-confirmation-required",
    "transportationIncluded": false,
    "image": "https://www.steliasguides.com/wp-content/uploads/2025/11/Full-Day-Glacier-Hike-Gallery-18.jpg",
    "images": [
      "https://www.steliasguides.com/wp-content/uploads/2025/11/Full-Day-Glacier-Hike-Gallery-18.jpg"
    ],
    "description": "Spend a full day with a guide exploring the Root Glacier and the dramatic landscapes around Donoho Falls.",
    "active": false,
    "tripBuilder": false,
    "requiresConfirmation": true,
    "website": "https://www.steliasguides.com/trips/full-day-root-glacier-hike/",
    "sourceUrl": "https://www.steliasguides.com/trips/full-day-root-glacier-hike/",
    "catalogStatus": "draft-not-bookable",
    "availableMonths": [
      6,
      7,
      8,
      9
    ]
  },
  {
    "id": "stelias-ice-caves",
    "key": "stelias-ice-caves",
    "name": "Kennecott Ice Cave Exploration",
    "operator": "St. Elias Alpine Guides",
    "category": "glacier",
    "season": "summer",
    "price": null,
    "priceType": "quote",
    "pricingType": "quote",
    "priceStatus": "partner-confirmation-required",
    "transportationIncluded": false,
    "image": "https://www.steliasguides.com/wp-content/uploads/2023/01/ice-cave-gallery-7.webp",
    "images": [
      "https://www.steliasguides.com/wp-content/uploads/2023/01/ice-cave-gallery-7.webp"
    ],
    "description": "A challenging guided exploration of glacier terrain and ice-cave features near Kennecott. Suitability and current cave conditions require guide confirmation.",
    "active": false,
    "tripBuilder": false,
    "requiresConfirmation": true,
    "website": "https://www.steliasguides.com/trips/ice-cave-exploration/",
    "sourceUrl": "https://www.steliasguides.com/trips/ice-cave-exploration/",
    "catalogStatus": "draft-not-bookable",
    "availableMonths": [
      6,
      7,
      8,
      9
    ]
  },
  {
    "id": "stelias-glacial-lake-paddle",
    "key": "stelias-glacial-lake-paddle",
    "name": "Kennecott Glacial Lake Paddle",
    "operator": "St. Elias Alpine Guides",
    "category": "paddling",
    "season": "summer",
    "price": null,
    "priceType": "quote",
    "pricingType": "quote",
    "priceStatus": "partner-confirmation-required",
    "transportationIncluded": false,
    "image": "https://www.steliasguides.com/wp-content/uploads/2025/11/kennicott-lake-paddle-gallery-9.jpg",
    "images": [
      "https://www.steliasguides.com/wp-content/uploads/2025/11/kennicott-lake-paddle-gallery-9.jpg"
    ],
    "description": "Explore the Kennicott glacial lake with a guide on a paddling-focused day adventure, subject to operating conditions.",
    "active": false,
    "tripBuilder": false,
    "requiresConfirmation": true,
    "website": "https://www.steliasguides.com/trips/kennicott-glacial-lake-paddle/",
    "sourceUrl": "https://www.steliasguides.com/trips/kennicott-glacial-lake-paddle/",
    "catalogStatus": "draft-not-bookable",
    "availableMonths": [
      6,
      7,
      8,
      9
    ]
  },
  {
    "id": "stelias-three-day-adventure",
    "key": "stelias-three-day-adventure",
    "name": "St. Elias Three-Day Adventure Package",
    "operator": "St. Elias Alpine Guides",
    "category": "multi-day",
    "season": "summer",
    "price": null,
    "priceType": "quote",
    "pricingType": "quote",
    "priceStatus": "partner-confirmation-required",
    "transportationIncluded": false,
    "image": "/images/excursions/stellis1.jpg",
    "images": [
      "/images/excursions/stellis1.jpg"
    ],
    "description": "A multi-activity Wrangell–St. Elias adventure combining glacier experiences and Kennecott history. Requires custom scheduling with the partner.",
    "active": false,
    "tripBuilder": false,
    "requiresConfirmation": true,
    "website": "https://www.steliasguides.com/trips/three-day-adventure-package/",
    "sourceUrl": "https://www.steliasguides.com/trips/three-day-adventure-package/",
    "catalogStatus": "draft-not-bookable",
    "availableMonths": [
      6,
      7,
      8,
      9
    ]
  },
  {
    "id": "outbound-knik-explorer",
    "key": "outbound-knik-explorer",
    "name": "Outbound Knik Glacier Explorer Helicopter Tour",
    "operator": "Outbound Heli Adventures",
    "category": "helicopter",
    "season": "year-round",
    "price": null,
    "priceType": "quote",
    "pricingType": "quote",
    "priceStatus": "partner-confirmation-required",
    "transportationIncluded": false,
    "image": "https://outboundheli.com/wp-content/uploads/2023/12/knikglacierhelicoptertour-5-1024x767.jpg",
    "images": [
      "https://outboundheli.com/wp-content/uploads/2023/12/knikglacierhelicoptertour-5-1024x767.jpg"
    ],
    "description": "Helicopter flightseeing over Knik Glacier with an on-glacier landing and time to explore the ice with the pilot, subject to conditions.",
    "active": false,
    "tripBuilder": false,
    "requiresConfirmation": true,
    "website": "https://outboundheli.com/knik-glacier-explorer/",
    "sourceUrl": "https://outboundheli.com/knik-glacier-explorer/",
    "catalogStatus": "draft-not-bookable"
  },
  {
    "id": "outbound-chugach-explorer",
    "key": "outbound-chugach-explorer",
    "name": "Outbound Chugach Explorer Helicopter Tour",
    "operator": "Outbound Heli Adventures",
    "category": "helicopter",
    "season": "year-round",
    "price": null,
    "priceType": "quote",
    "pricingType": "quote",
    "priceStatus": "partner-confirmation-required",
    "transportationIncluded": false,
    "image": "https://outboundheli.com/wp-content/uploads/2023/12/chugachmountainshelicoptertouralaska-alaska-16-682x1024.jpg",
    "images": [
      "https://outboundheli.com/wp-content/uploads/2023/12/chugachmountainshelicoptertouralaska-alaska-16-682x1024.jpg"
    ],
    "description": "Explore the Chugach Mountains by helicopter with scenic landscapes and potential remote landings as conditions allow.",
    "active": false,
    "tripBuilder": false,
    "requiresConfirmation": true,
    "website": "https://outboundheli.com/chugach-explorer/",
    "sourceUrl": "https://outboundheli.com/chugach-explorer/",
    "catalogStatus": "draft-not-bookable"
  },
  {
    "id": "outbound-scenic-sampler",
    "key": "outbound-scenic-sampler",
    "name": "Outbound Scenic Sampler Flightseeing",
    "operator": "Outbound Heli Adventures",
    "category": "helicopter",
    "season": "year-round",
    "price": null,
    "priceType": "quote",
    "pricingType": "quote",
    "priceStatus": "partner-confirmation-required",
    "transportationIncluded": false,
    "image": "https://outboundheli.com/wp-content/uploads/2023/12/alaskaflightseeingtours-3-768x1154.jpg",
    "images": [
      "https://outboundheli.com/wp-content/uploads/2023/12/alaskaflightseeingtours-3-768x1154.jpg"
    ],
    "description": "A scenic helicopter tour highlighting Alaska mountain peaks, waterways, glacial terrain, and possible wildlife sightings.",
    "active": false,
    "tripBuilder": false,
    "requiresConfirmation": true,
    "website": "https://outboundheli.com/scenic-sampler/",
    "sourceUrl": "https://outboundheli.com/scenic-sampler/",
    "catalogStatus": "draft-not-bookable"
  },
  {
    "id": "outbound-glacier-trekking",
    "key": "outbound-glacier-trekking",
    "name": "Outbound Helicopter Glacier Trekking",
    "operator": "Outbound Heli Adventures",
    "category": "glacier",
    "season": "year-round",
    "price": null,
    "priceType": "quote",
    "pricingType": "quote",
    "priceStatus": "partner-confirmation-required",
    "transportationIncluded": false,
    "image": "https://outboundheli.com/wp-content/uploads/2026/09/glacier-trekking-outbound-heli-adventures-jake-1024x683.jpg",
    "images": [
      "https://outboundheli.com/wp-content/uploads/2026/09/glacier-trekking-outbound-heli-adventures-jake-1024x683.jpg"
    ],
    "description": "Fly to glacier terrain for a professionally guided trekking experience; required equipment and suitability are confirmed by the provider.",
    "active": false,
    "tripBuilder": false,
    "requiresConfirmation": true,
    "website": "https://outboundheli.com/glacier-trekking/",
    "sourceUrl": "https://outboundheli.com/glacier-trekking/",
    "catalogStatus": "draft-not-bookable"
  },
  {
    "id": "outbound-ice-climbing",
    "key": "outbound-ice-climbing",
    "name": "Outbound Helicopter Ice Climbing",
    "operator": "Outbound Heli Adventures",
    "category": "glacier",
    "season": "year-round",
    "price": null,
    "priceType": "quote",
    "pricingType": "quote",
    "priceStatus": "partner-confirmation-required",
    "transportationIncluded": false,
    "image": "https://outboundheli.com/wp-content/uploads/2023/12/knikglaciertrekking-2.jpg",
    "images": [
      "https://outboundheli.com/wp-content/uploads/2023/12/knikglaciertrekking-2.jpg"
    ],
    "description": "Helicopter access to Knik Glacier for a guided ice-climbing adventure, subject to conditions and partner approval.",
    "active": false,
    "tripBuilder": false,
    "requiresConfirmation": true,
    "website": "https://outboundheli.com/ice-climbing/",
    "sourceUrl": "https://outboundheli.com/ice-climbing/",
    "catalogStatus": "draft-not-bookable"
  },
  {
    "id": "hatcher-two-person-utv",
    "key": "hatcher-two-person-utv",
    "name": "Hatcher Pass Two-Person UTV Tour",
    "operator": "Hatcher Pass ATV Tours",
    "category": "atv",
    "season": "summer",
    "price": null,
    "priceType": "quote",
    "pricingType": "quote",
    "priceStatus": "partner-confirmation-required",
    "transportationIncluded": false,
    "image": "https://hatcherpasstour.com/wp-content/uploads/2026/01/Summer-UTV-Tour-Hatcher-Pass-Alaska.jpg",
    "images": [
      "https://hatcherpasstour.com/wp-content/uploads/2026/01/Summer-UTV-Tour-Hatcher-Pass-Alaska.jpg"
    ],
    "description": "Guided two-person UTV adventure through Hatcher Pass backcountry and scenic mountain terrain. Priced by vehicle; confirm current provider rate.",
    "active": false,
    "tripBuilder": false,
    "requiresConfirmation": true,
    "website": "https://hatcherpasstour.com/tours/two-people-utv-tour/",
    "sourceUrl": "https://hatcherpasstour.com/tours/two-people-utv-tour/",
    "catalogStatus": "draft-not-bookable",
    "availableMonths": [
      6,
      7,
      8,
      9
    ]
  },
  {
    "id": "hatcher-group-utv",
    "key": "hatcher-group-utv",
    "name": "Hatcher Pass Family & Group UTV Tour",
    "operator": "Hatcher Pass ATV Tours",
    "category": "atv",
    "season": "summer",
    "price": null,
    "priceType": "quote",
    "pricingType": "quote",
    "priceStatus": "partner-confirmation-required",
    "transportationIncluded": false,
    "image": "https://hatcherpasstour.com/wp-content/uploads/2024/05/blog-ATV-Adventures.jpg",
    "images": [
      "https://hatcherpasstour.com/wp-content/uploads/2024/05/blog-ATV-Adventures.jpg"
    ],
    "description": "A guided group or family UTV tour in the Hatcher Pass area; party size and vehicle-based pricing require confirmation.",
    "active": false,
    "tripBuilder": false,
    "requiresConfirmation": true,
    "website": "https://hatcherpasstour.com/tours/family-utv-tour-up-to-5-people/",
    "sourceUrl": "https://hatcherpasstour.com/tours/family-utv-tour-up-to-5-people/",
    "catalogStatus": "draft-not-bookable",
    "availableMonths": [
      6,
      7,
      8,
      9
    ]
  },
  {
    "id": "hatcher-full-day-utv",
    "key": "hatcher-full-day-utv",
    "name": "Hatcher Pass Full-Day UTV Adventure",
    "operator": "Hatcher Pass ATV Tours",
    "category": "atv",
    "season": "summer",
    "price": null,
    "priceType": "quote",
    "pricingType": "quote",
    "priceStatus": "partner-confirmation-required",
    "transportationIncluded": false,
    "image": "https://hatcherpasstour.com/wp-content/uploads/2026/01/utv-tour-summer-full-day.jpg",
    "images": [
      "https://hatcherpasstour.com/wp-content/uploads/2026/01/utv-tour-summer-full-day.jpg"
    ],
    "description": "A longer guided UTV expedition exploring mountain scenery, backcountry trails, and the Hatcher Pass region.",
    "active": false,
    "tripBuilder": false,
    "requiresConfirmation": true,
    "website": "https://hatcherpasstour.com/tours/full-day-utv-tour/",
    "sourceUrl": "https://hatcherpasstour.com/tours/full-day-utv-tour/",
    "catalogStatus": "draft-not-bookable",
    "availableMonths": [
      6,
      7,
      8,
      9
    ]
  },
  {
    "id": "hatcher-winter-snowmobile",
    "key": "hatcher-winter-snowmobile",
    "name": "Hatcher Pass Guided Snowmobile Tour",
    "operator": "Hatcher Pass ATV Tours",
    "category": "snowmachine",
    "season": "winter",
    "price": null,
    "priceType": "quote",
    "pricingType": "quote",
    "priceStatus": "partner-confirmation-required",
    "transportationIncluded": false,
    "image": "https://hatcherpasstour.com/wp-content/uploads/2025/02/alaska-images-19.jpg",
    "images": [
      "https://hatcherpasstour.com/wp-content/uploads/2025/02/alaska-images-19.jpg"
    ],
    "description": "A guided snowmobile experience based around Hatcher Pass. Snowpack, weather, rider abilities and rate require confirmation.",
    "active": false,
    "tripBuilder": false,
    "requiresConfirmation": true,
    "website": "https://hatcherpasstour.com/winter-tours/",
    "sourceUrl": "https://hatcherpasstour.com/winter-tours/",
    "catalogStatus": "draft-not-bookable",
    "availableMonths": [
      10,
      11,
      12,
      1,
      2,
      3,
      4,
      5
    ]
  },
  {
    "id": "phantom-half-day-float",
    "key": "phantom-half-day-float",
    "name": "Phantom Half-Day River Float",
    "operator": "Phantom Tri-River Charters",
    "category": "fishing",
    "season": "summer",
    "price": null,
    "priceType": "quote",
    "pricingType": "quote",
    "priceStatus": "partner-confirmation-required",
    "transportationIncluded": false,
    "image": "https://phantomtririvercharters.com/wp-content/uploads/sites/6976/2025/02/Half-Day-Float-Trips-image-1.jpg",
    "images": [
      "https://phantomtririvercharters.com/wp-content/uploads/sites/6976/2025/02/Half-Day-Float-Trips-image-1.jpg"
    ],
    "description": "A guided half-day river float in the Talkeetna area, tailored to current conditions and the group’s interests.",
    "active": false,
    "tripBuilder": false,
    "requiresConfirmation": true,
    "website": "https://phantomtririvercharters.com/half-day-float-trips/",
    "sourceUrl": "https://phantomtririvercharters.com/half-day-float-trips/",
    "catalogStatus": "draft-not-bookable",
    "availableMonths": [
      6,
      7,
      8,
      9
    ]
  },
  {
    "id": "phantom-full-day-float",
    "key": "phantom-full-day-float",
    "name": "Phantom Full-Day River Float",
    "operator": "Phantom Tri-River Charters",
    "category": "fishing",
    "season": "summer",
    "price": null,
    "priceType": "quote",
    "pricingType": "quote",
    "priceStatus": "partner-confirmation-required",
    "transportationIncluded": false,
    "image": "https://phantomtririvercharters.com/wp-content/uploads/sites/6976/2025/02/Full-Day-Float-Trips-image-1.jpg",
    "images": [
      "https://phantomtririvercharters.com/wp-content/uploads/sites/6976/2025/02/Full-Day-Float-Trips-image-1.jpg"
    ],
    "description": "Spend a full day on a guided river float exploring the Talkeetna region and its fishing opportunities.",
    "active": false,
    "tripBuilder": false,
    "requiresConfirmation": true,
    "website": "https://phantomtririvercharters.com/full-day-float-trips/",
    "sourceUrl": "https://phantomtririvercharters.com/full-day-float-trips/",
    "catalogStatus": "draft-not-bookable",
    "availableMonths": [
      6,
      7,
      8,
      9
    ]
  },
  {
    "id": "phantom-private-spin",
    "key": "phantom-private-spin",
    "name": "Phantom Private Jet Boat Spin Fishing",
    "operator": "Phantom Tri-River Charters",
    "category": "fishing",
    "season": "summer",
    "price": null,
    "priceType": "quote",
    "pricingType": "quote",
    "priceStatus": "partner-confirmation-required",
    "transportationIncluded": false,
    "image": "https://phantomtririvercharters.com/wp-content/uploads/sites/6976/2023/10/Spin-Fishing-Charter-image-1.jpg",
    "images": [
      "https://phantomtririvercharters.com/wp-content/uploads/sites/6976/2023/10/Spin-Fishing-Charter-image-1.jpg"
    ],
    "description": "Private guided spin fishing by jet boat, with fishing location and species dependent on season and conditions.",
    "active": false,
    "tripBuilder": false,
    "requiresConfirmation": true,
    "website": "https://phantomtririvercharters.com/fishing-charters/private-spin-fishing/",
    "sourceUrl": "https://phantomtririvercharters.com/fishing-charters/private-spin-fishing/",
    "catalogStatus": "draft-not-bookable",
    "availableMonths": [
      6,
      7,
      8,
      9
    ]
  },
  {
    "id": "phantom-fly-fishing",
    "key": "phantom-fly-fishing",
    "name": "Phantom Guided Fly Fishing",
    "operator": "Phantom Tri-River Charters",
    "category": "fishing",
    "season": "summer",
    "price": null,
    "priceType": "quote",
    "pricingType": "quote",
    "priceStatus": "partner-confirmation-required",
    "transportationIncluded": false,
    "image": "https://phantomtririvercharters.com/wp-content/uploads/sites/6976/2023/10/Fly-Fishing-Charter-image-1.jpg",
    "images": [
      "https://phantomtririvercharters.com/wp-content/uploads/sites/6976/2023/10/Fly-Fishing-Charter-image-1.jpg"
    ],
    "description": "Private guided fly fishing in the Talkeetna region with a local guide.",
    "active": false,
    "tripBuilder": false,
    "requiresConfirmation": true,
    "website": "https://phantomtririvercharters.com/fishing-charters/fly-fishing/",
    "sourceUrl": "https://phantomtririvercharters.com/fishing-charters/fly-fishing/",
    "catalogStatus": "draft-not-bookable",
    "availableMonths": [
      6,
      7,
      8,
      9
    ]
  },
  {
    "id": "king-klutina-salmon",
    "key": "king-klutina-salmon",
    "name": "King for a Day Klutina River Salmon Fishing",
    "operator": "King for a Day / AK Charters",
    "category": "fishing",
    "season": "summer",
    "price": null,
    "priceType": "quote",
    "pricingType": "quote",
    "priceStatus": "partner-confirmation-required",
    "transportationIncluded": false,
    "image": "/images/excursions/fishandfloat.jpg",
    "images": [
      "/images/excursions/fishandfloat.jpg"
    ],
    "description": "Guided Klutina River salmon fishing from a Copper Center base; species and catch rules vary by season.",
    "active": false,
    "tripBuilder": false,
    "requiresConfirmation": true,
    "website": "https://akcharters.com/klutina-river-salmon-fishing/",
    "sourceUrl": "https://akcharters.com/klutina-river-salmon-fishing/",
    "catalogStatus": "draft-not-bookable",
    "availableMonths": [
      6,
      7,
      8,
      9
    ]
  },
  {
    "id": "king-gulkana-float",
    "key": "king-gulkana-float",
    "name": "King for a Day Gulkana River Fishing & Float",
    "operator": "King for a Day / AK Charters",
    "category": "fishing",
    "season": "summer",
    "price": null,
    "priceType": "quote",
    "pricingType": "quote",
    "priceStatus": "partner-confirmation-required",
    "transportationIncluded": false,
    "image": "https://akcharters.com/wp-content/uploads/elementor/thumbs/Frame-15-3-rmdvsnxuihyxh2tqmc9e6ncb2bk7kigy8k618guhzo.webp",
    "images": [
      "https://akcharters.com/wp-content/uploads/elementor/thumbs/Frame-15-3-rmdvsnxuihyxh2tqmc9e6ncb2bk7kigy8k618guhzo.webp"
    ],
    "description": "Guided Gulkana River fishing and float opportunities arranged through the Copper Center operator.",
    "active": false,
    "tripBuilder": false,
    "requiresConfirmation": true,
    "website": "https://akcharters.com/gulkana-river-fishing/",
    "sourceUrl": "https://akcharters.com/gulkana-river-fishing/",
    "catalogStatus": "draft-not-bookable",
    "availableMonths": [
      6,
      7,
      8,
      9
    ]
  },
  {
    "id": "king-scenic-float",
    "key": "king-scenic-float",
    "name": "King for a Day Scenic River Float",
    "operator": "King for a Day / AK Charters",
    "category": "river",
    "season": "summer",
    "price": null,
    "priceType": "quote",
    "pricingType": "quote",
    "priceStatus": "partner-confirmation-required",
    "transportationIncluded": false,
    "image": "https://akcharters.com/wp-content/uploads/elementor/thumbs/Screenshot-2026-03-25-at-10.33.20-PM-rmdvsovopc07sosdguo0r53rnpfks7kokotipqt3tg.webp",
    "images": [
      "https://akcharters.com/wp-content/uploads/elementor/thumbs/Screenshot-2026-03-25-at-10.33.20-PM-rmdvsovopc07sosdguo0r53rnpfks7kokotipqt3tg.webp"
    ],
    "description": "Relaxed guided river float designed for scenery and exploring Alaska’s waterways without a fishing-focused itinerary.",
    "active": false,
    "tripBuilder": false,
    "requiresConfirmation": true,
    "website": "https://akcharters.com/our-trips/non-fishing-trips/",
    "sourceUrl": "https://akcharters.com/our-trips/non-fishing-trips/",
    "catalogStatus": "draft-not-bookable",
    "availableMonths": [
      6,
      7,
      8,
      9
    ]
  },
  {
    "id": "king-atv-tour",
    "key": "king-atv-tour",
    "name": "King for a Day Backcountry ATV Tour",
    "operator": "King for a Day / AK Charters",
    "category": "atv",
    "season": "summer",
    "price": null,
    "priceType": "quote",
    "pricingType": "quote",
    "priceStatus": "partner-confirmation-required",
    "transportationIncluded": false,
    "image": "https://akcharters.com/wp-content/uploads/elementor/thumbs/Frame-2147224087-1-rmdvsovopc07sosdguo0r53rnpfks7kokotipqt3tg.webp",
    "images": [
      "https://akcharters.com/wp-content/uploads/elementor/thumbs/Frame-2147224087-1-rmdvsovopc07sosdguo0r53rnpfks7kokotipqt3tg.webp"
    ],
    "description": "Explore the Copper Center backcountry on a guided ATV experience arranged by King for a Day.",
    "active": false,
    "tripBuilder": false,
    "requiresConfirmation": true,
    "website": "https://akcharters.com/our-trips/non-fishing-trips/",
    "sourceUrl": "https://akcharters.com/our-trips/non-fishing-trips/",
    "catalogStatus": "draft-not-bookable",
    "availableMonths": [
      6,
      7,
      8,
      9
    ]
  },
  {
    "id": "seacraft-talkeetna-scenic",
    "key": "seacraft-talkeetna-scenic",
    "name": "SeaCraft Talkeetna Scenic Hovercraft Tour",
    "operator": "SeaCraft Hover Tours",
    "category": "hovercraft",
    "season": "summer",
    "price": null,
    "priceType": "quote",
    "pricingType": "quote",
    "priceStatus": "partner-confirmation-required",
    "transportationIncluded": false,
    "image": "/images/excursions/seacraft.jpg",
    "images": [
      "/images/excursions/seacraft.jpg"
    ],
    "description": "Explore river landscapes around Talkeetna aboard a guided hovercraft. The operator’s current booking availability requires verification.",
    "active": false,
    "tripBuilder": false,
    "requiresConfirmation": true,
    "website": "https://www.expedia.com/things-to-do/hover-craft-scenic-tour-in-talkeetna-alaska.a46218424.activity-details",
    "sourceUrl": "https://www.expedia.com/things-to-do/hover-craft-scenic-tour-in-talkeetna-alaska.a46218424.activity-details",
    "catalogStatus": "draft-not-bookable",
    "availableMonths": [
      6,
      7,
      8,
      9
    ]
  },
  {
    "id": "gunsight-cabin-stay",
    "key": "gunsight-cabin-stay",
    "name": "Gunsight Mountain Lodge Cabin Stay",
    "operator": "Gunsight Mountain Lodge",
    "category": "lodging",
    "season": "year-round",
    "price": null,
    "priceType": "quote",
    "pricingType": "quote",
    "priceStatus": "partner-confirmation-required",
    "transportationIncluded": false,
    "image": "/images/excursions/GSML1.jpg",
    "images": [
      "/images/excursions/GSML1.jpg"
    ],
    "description": "Rustic cabin lodging at Gunsight Mountain Lodge near Eureka, suited to a separate lodging inquiry rather than per-person activity checkout.",
    "active": false,
    "tripBuilder": false,
    "requiresConfirmation": true,
    "website": "https://www.gunsightmountainlodge.com/",
    "sourceUrl": "https://www.gunsightmountainlodge.com/",
    "catalogStatus": "draft-not-bookable"
  },
  {
    "id": "gunsight-snowmachine-fishing",
    "key": "gunsight-snowmachine-fishing",
    "name": "Gunsight Snowmachine Tour & Ice Fishing Inquiry",
    "operator": "Gunsight Mountain Lodge",
    "category": "snowmachine",
    "season": "winter",
    "price": null,
    "priceType": "quote",
    "pricingType": "quote",
    "priceStatus": "partner-confirmation-required",
    "transportationIncluded": false,
    "image": "/images/excursions/gsmlfw.png",
    "images": [
      "/images/excursions/gsmlfw.png"
    ],
    "description": "Ask about a combined snowmachine riding and ice-fishing experience offered through Gunsight Mountain Lodge. Confirm tour details with the operator.",
    "active": false,
    "tripBuilder": false,
    "requiresConfirmation": true,
    "website": "https://www.gunsightmountainlodge.com/book-online",
    "sourceUrl": "https://www.gunsightmountainlodge.com/book-online",
    "catalogStatus": "draft-not-bookable",
    "availableMonths": [
      11,
      12,
      1,
      2,
      3,
      4
    ]
  }

];


// PUBLIC PARTNER PRICE RESEARCH (October 2026). No price here is automatically chargeable.
// `publishedBasePrice` = provider's advertised starting rate before AOE markup.
// `displayPrice` = provider rate + 5% AOE partner markup (rounded UP to nearest cent).
// AOE-owned experiences do not receive the partner markup.
export const PARTNER_MARKUP_RATE = 0.05;
export const EXTENDED_STAY_DISCOUNTS = Object.freeze({ fourToSixDays: 0.05, sevenPlusDays: 0.10 });
export function getExtendedStayDiscountRate(days) {
  return days >= 7 ? EXTENDED_STAY_DISCOUNTS.sevenPlusDays : days >= 4 ? EXTENDED_STAY_DISCOUNTS.fourToSixDays : 0;
}
// Shared display model. Published catalog rates can be used for existing server-side
// checkout validation; legacy `price` values are REVIEW estimates only.
export function getPartnerPriceInfo(experience) {
  if (!experience || experience.operator === "AOE") return null;
  const published = Number(experience.publishedBasePrice);
  const publishedUnit = experience.publishedPriceUnit;
  const legacy = Number(experience.price);
  const legacyUnit = experience.priceType;
  const units = ["perPerson", "perVehicle", "perCharter", "perNight"];
  const verified = Number.isFinite(published) && published > 0 && units.includes(publishedUnit);
  const estimated = !verified && Number.isFinite(legacy) && legacy > 0 && units.includes(legacyUnit);
  if (!verified && !estimated) return null;
  const base = verified ? published : legacy;
  const unit = verified ? publishedUnit : legacyUnit;
  return {
    base, unit, chargeable: verified, source: verified ? "published" : "legacy",
    customerPrice: Math.ceil((Math.round(base * 100) * 1.05) - 0.0000001) / 100,
  };
}

export function getPartnerDisplayPrice(experience) {
  return getPartnerPriceInfo(experience)?.customerPrice ?? null;
}

// Catalog publication != confirmed checkout inventory. All external tours
// remain request-to-book until AOE verifies pricing, exact dates and capacity.
const VERIFIED_PUBLIC_LISTINGS = {
  "stelias-root-halfday": {
    "base": 133,
    "unit": "perPerson",
    "source": "https://www.steliasguides.com/trips/alaska-glacier-activities/",
    "months": [
      5,
      6,
      7,
      8,
      9
    ]
  },
  "stelias-root-fullday": {
    "base": 179,
    "unit": "perPerson",
    "source": "https://www.steliasguides.com/trips/alaska-glacier-activities/",
    "months": [
      5,
      6,
      7,
      8,
      9
    ]
  },
  "stelias-ice-caves": {
    "base": 438,
    "unit": "perPerson",
    "source": "https://www.steliasguides.com/trips/alaska-glacier-activities/",
    "months": [
      5,
      6,
      7,
      8,
      9
    ]
  },
  "Ice Climbing Root Glacier!": {
    "base": 207,
    "unit": "perPerson",
    "source": "https://www.steliasguides.com/trips/alaska-glacier-activities/",
    "months": [
      5,
      6,
      7,
      8,
      9
    ]
  },
  "hatcher-two-person-utv": {
    "base": 299,
    "unit": "perVehicle",
    "source": "https://hatcherpasstour.com/summer-tours/",
    "months": [
      6,
      7,
      8,
      9
    ]
  },
  "hatcher-group-utv": {
    "base": 365,
    "unit": "perVehicle",
    "source": "https://hatcherpasstour.com/summer-tours/",
    "months": [
      6,
      7,
      8,
      9
    ]
  },
  "hatcher-full-day-utv": {
    "base": 1200,
    "unit": "perVehicle",
    "source": "https://hatcherpasstour.com/summer-tours/",
    "months": [
      6,
      7,
      8,
      9
    ]
  },
  "phantom-half-day-float": {
    "base": 225,
    "unit": "perPerson",
    "source": "https://phantomtririvercharters.com/fishing-charters/",
    "months": [
      5,
      6,
      7,
      8,
      9
    ]
  },
  "phantom-full-day-float": {
    "base": 350,
    "unit": "perPerson",
    "source": "https://phantomtririvercharters.com/fishing-charters/",
    "months": [
      5,
      6,
      7,
      8,
      9
    ]
  },
  "phantom-private-spin": {
    "base": 1000,
    "unit": "perCharter",
    "source": "https://phantomtririvercharters.com/fishing-charters/",
    "months": [
      5,
      6,
      7,
      8,
      9
    ]
  },
  "phantom-fly-fishing": {
    "base": 1000,
    "unit": "perCharter",
    "source": "https://phantomtririvercharters.com/fishing-charters/",
    "months": [
      5,
      6,
      7,
      8,
      9
    ]
  },
  "gunsight-cabin-stay": {
    "base": 125,
    "unit": "perNight",
    "source": "https://www.gunsightmountainlodge.com/book-online",
    "months": [
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12
    ]
  }
};
for (const entry of experiences) {
  if (entry.operator === "AOE") continue;
  entry.active = true;
  entry.tripBuilder = true;
  entry.requiresConfirmation = true;
  entry.catalogStatus = "draft-not-bookable";
  entry.bookingMode = "inquiry";
  const published = VERIFIED_PUBLIC_LISTINGS[entry.id];
  if (published) {
    entry.publishedBasePrice = published.base;
    entry.publishedPriceUnit = published.unit;
    entry.publishedSource = published.source;
    entry.availableMonths = published.months;
    entry.displayPrice = getPartnerDisplayPrice(entry);
    entry.priceVerifiedOn = "2026-10-31"; // public listing, NOT partner-negotiated rate
  } else {
    // Prevent older placeholder prices from showing as verified quotes.
    // Retain legacy price for a visible estimate; do not mark it verified for Stripe.
    entry.publishedBasePrice = null;
    entry.displayPrice = getPartnerDisplayPrice(entry);
  }
}

// Additional published distinct provider offerings, visible as inquiry cards.
const ADDITIONAL_PUBLIC_LISTINGS = [
  {
    "id": "gunsight-cabin-1",
    "name": "Gunsight Dry Cabin #1",
    "operator": "Gunsight Mountain Lodge",
    "category": "lodging",
    "season": "year-round",
    "publishedBasePrice": 169,
    "publishedPriceUnit": "perNight",
    "publishedSource": "https://www.gunsightmountainlodge.com/book-online",
    "availableMonths": [
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12
    ],
    "image": "/images/excursions/GSML1.jpg",
    "description": "Historic dry cabin lodging at Gunsight Mountain."
  },
  {
    "id": "gunsight-cabin-2",
    "name": "Gunsight Dry Cabin #2",
    "operator": "Gunsight Mountain Lodge",
    "category": "lodging",
    "season": "year-round",
    "publishedBasePrice": 169,
    "publishedPriceUnit": "perNight",
    "publishedSource": "https://www.gunsightmountainlodge.com/book-online",
    "availableMonths": [
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12
    ],
    "image": "/images/excursions/GSML1.jpg",
    "description": "Dry cabin lodging at Gunsight Mountain."
  },
  {
    "id": "gunsight-cabin-3",
    "name": "Gunsight Dry Cabin #3",
    "operator": "Gunsight Mountain Lodge",
    "category": "lodging",
    "season": "year-round",
    "publishedBasePrice": 159,
    "publishedPriceUnit": "perNight",
    "publishedSource": "https://www.gunsightmountainlodge.com/book-online",
    "availableMonths": [
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12
    ],
    "image": "/images/excursions/GSML1.jpg",
    "description": "Rustic dry cabin stay."
  },
  {
    "id": "gunsight-camping",
    "name": "Gunsight Dry Camping / RV Spot",
    "operator": "Gunsight Mountain Lodge",
    "category": "lodging",
    "season": "year-round",
    "publishedBasePrice": 35,
    "publishedPriceUnit": "perNight",
    "publishedSource": "https://www.gunsightmountainlodge.com/book-online",
    "availableMonths": [
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12
    ],
    "image": "/images/excursions/GSML1.jpg",
    "description": "Dry camping and gravel RV parking."
  },
  {
    "id": "stelias-root-overnight",
    "name": "Root Glacier Overnight Adventure",
    "operator": "St. Elias Alpine Guides",
    "category": "glacier",
    "season": "summer",
    "publishedBasePrice": 785,
    "publishedPriceUnit": "perPerson",
    "publishedSource": "https://www.steliasguides.com/trips/alaska-glacier-activities/",
    "availableMonths": [
      6,
      7,
      8,
      9
    ],
    "image": "https://www.steliasguides.com/wp-content/uploads/2023/09/Root-Overnight-Gallery-2.jpg",
    "description": "Two-day guided glacier adventure with overnight camping."
  },
  {
    "id": "stelias-ice-camp",
    "name": "Three-Day Ice Climbing Camp",
    "operator": "St. Elias Alpine Guides",
    "category": "glacier",
    "season": "summer",
    "publishedBasePrice": 1050,
    "publishedPriceUnit": "perPerson",
    "publishedSource": "https://www.steliasguides.com/trips/alaska-glacier-activities/",
    "availableMonths": [
      6,
      7,
      8,
      9
    ],
    "image": "/images/excursions/Iceclimbing1.jpg",
    "description": "Three-day guided ice climbing course."
  },
  {
    "id": "phantom-public-spin",
    "name": "Phantom Public Spin Fishing",
    "operator": "Phantom Tri-River Charters",
    "category": "fishing",
    "season": "summer",
    "publishedBasePrice": 225,
    "publishedPriceUnit": "perPerson",
    "publishedSource": "https://phantomtririvercharters.com/fishing-charters/",
    "availableMonths": [
      5,
      6,
      7,
      8,
      9
    ],
    "image": "https://phantomtririvercharters.com/wp-content/uploads/sites/6976/2023/10/Spin-Fishing-Charter-image-6-e1699636252429.jpg",
    "description": "Shared Talkeetna fishing charter."
  },
  {
    "id": "hatcher-northern-lights-utv",
    "name": "Hatcher Pass Northern Lights UTV Tour",
    "operator": "Hatcher Pass ATV Tours",
    "category": "atv",
    "season": "winter",
    "publishedBasePrice": 485,
    "publishedPriceUnit": "perVehicle",
    "publishedSource": "https://hatcherpasstour.com/anchorage-alaska-northern-lights-tour/",
    "availableMonths": [
      9,
      10,
      11,
      12,
      1,
      2,
      3,
      4
    ],
    "image": "https://hatcherpasstour.com/wp-content/uploads/2024/12/13aurora-tour-photo.jpg",
    "description": "Late-night guided Northern Lights UTV outing, date dependent."
  }
];
for (const entry of ADDITIONAL_PUBLIC_LISTINGS) {
  if (!experiences.some((e) => e.id === entry.id)) {
    experiences.push({ ...entry, active: true, tripBuilder: true, requiresConfirmation: true,
      bookingMode: "inquiry", catalogStatus: "draft-not-bookable", priceVerifiedOn: "2026-10-31",
      displayPrice: getPartnerDisplayPrice(entry),
    });
  }
}

// ==========================================
// CATALOG HELPERS
// ==========================================

export function getExperienceById(id) {
  return experiences.find(
    (experience) => experience.id === id && experience.active
  );
}

export function getExperiencesForMonth(month) {
  return experiences.filter((experience) => {
    if (!experience.active) return false;

    if (!experience.availableMonths) return true;

    return experience.availableMonths.includes(Number(month));
  });
}

export function getAOEExperiences() {
  return experiences.filter(
    (experience) =>
      experience.active && experience.operator === "AOE"
  );
}

export function getPartnerExperiences() {
  return experiences.filter(
    (experience) =>
      experience.active && experience.operator !== "AOE"
  );
}

// LEGACY EXCURSION COMPATIBILITY
// Old website screens and legacy checkout still consume `excursions`.
// This export is generated from the single master catalog, so prices and
// partner details are not duplicated in a second data file.
// Knik and the flagship summer expedition must be booked through their
// dedicated pricing logic, NOT as generic per-person add-ons.
export const excursions = experiences
  .filter((item) =>
    item.active !== false &&
    item.operator !== "AOE" &&
    item.tripBuilder !== false
  )
  .map((item) => ({
    ...item,
    key: item.key || item.id,
    type: item.type || item.category || "Experience",
    desc: item.desc || item.description || "",
    sc: item.sc || item.description || "",
    images: Array.isArray(item.images)
      ? item.images
      : item.image
        ? [item.image]
        : [],
    tripBuilder: true,
  }));
