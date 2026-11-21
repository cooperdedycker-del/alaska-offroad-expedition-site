export const ADD_ON_CATEGORIES = [
  { id: "snow", title: "Winter Add-Ons", subtitle: "Snowmachining, heated side-by-side tours, ice fishing, flightseeing, and more." },
  { id: "helicopter", title: "Helicopter & Flightseeing Tours", subtitle: "Scenic flights, glacier landings, and helicopter exploration." },
  { id: "glacier", title: "Ice Climbing, Glacier Hikes & Adventures", subtitle: "Glacier walks, ice climbing, hiking, and backcountry adventures." },
  { id: "atv", title: "ATV, Side-by-Side & Dirt Bike Tours", subtitle: "Off-road ATV, UTV, side-by-side, and motorcycle experiences." },
  { id: "fishing", title: "Fishing Tours", subtitle: "Guided fishing trips, river fishing, and ice fishing experiences." },
  { id: "water", title: "Boat, River & Hovercraft Tours", subtitle: "River floats, boat trips, paddling, and SeaCraft hovercraft tours." },
  { id: "lodging", title: "Lodging & Overnight Stays", subtitle: "Cabins, lodges, camping, and overnight accommodations." },
  { id: "sightseeing", title: "Sightseeing & Historic Tours", subtitle: "Historic sites, cultural tours, and scenic experiences." },
  { id: "other", title: "More Alaska Adventures", subtitle: "More guided experiences and unique Alaska activities." },
];

function getActivityCategory(item) {
  const category = String(item.category || "").toLowerCase();
  const name = String(item.name || "").toLowerCase();
  // Accommodation and fishing should not be misfiled as general winter adventures.
  if (["lodging", "camping", "accommodation"].includes(category) || /\b(cabin|lodging|campground|overnight stay|rv spot)\b/.test(name)) return "lodging";
  if (["fishing"].includes(category) || /\b(fishing|angling)\b/.test(name)) {
    // River floats without fishing are water tours; ice fishing belongs with winter tours.
    if (/\b(ice fishing|snowmachine|snowmobile)\b/.test(name)) return "snow";
    if (/\b(float|raft|boat|paddle)\b/.test(name) && !/\bfish/.test(name)) return "water";
    return "fishing";
  }
  if (["snowmachine", "snowmobile", "winter"].includes(category) || /\b(snowmachin(?:e|ing)|snowmobil(?:e|ing)|ice fishing|northern lights utv)\b/.test(name)) return "snow";
  if (["helicopter", "flightseeing", "aviation"].includes(category) || /\b(helicopter|heli|flightseeing)\b/.test(name)) return "helicopter";
  if (["glacier", "hiking", "ice-climbing", "iceclimbing", "climbing", "multi-day"].includes(category) || /\b(ice climbing|glacier hike|glacier trekking|ice cave|hike)\b/.test(name)) return "glacier";
  if (["atv", "utv", "motorsports", "dirtbike", "dirt-bike", "offroad"].includes(category) || /\b(atv|utv|side.by.side|dirt bike)\b/.test(name)) return "atv";
  if (["hovercraft", "water", "boating", "paddling", "river", "rafting", "float", "kayaking"].includes(category) || /\b(hovercraft|river float|boat tour|lake paddle)\b/.test(name)) return "water";
  if (["history", "sightseeing", "culture"].includes(category)) return "sightseeing";
  return "other";
}

// Winter-only trips always live in Winter Add-Ons. Tours also offered in
// winter are shown there for winter dates and by activity for summer dates.
export function getAddOnCategoryIds(item, tripSeason) {
  const category = getActivityCategory(item);
  if (item.season === "winter" || category === "snow") return ["snow"];

  const winterMonths = [11, 12, 1, 2, 3, 4];
  const months = Array.isArray(item.availableMonths) ? item.availableMonths.map(Number) : [];
  const hasWinterMonth = months.some(month => winterMonths.includes(month));
  const hasOtherMonth = months.some(month => !winterMonths.includes(month));
  if (hasWinterMonth && !hasOtherMonth) return ["snow"];

  const alsoOfferedInWinter = item.season === "year-round" || (item.season !== "summer" && hasWinterMonth);
  if (!alsoOfferedInWinter) return [category];
  if (tripSeason) return [tripSeason === "winter" ? "snow" : category];

  // The homepage has no dates selected, so year-round options are discoverable
  // from both Winter Add-Ons and their activity category.
  return ["snow", category];
}
