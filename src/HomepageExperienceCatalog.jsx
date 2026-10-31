import { experiences, getPartnerDisplayPrice } from "./data/experiences";

// Homepage tour cards route into the Trip Builder. The server determines whether a price is chargeable.
const PARTNER_GROUPS = [
  { title: "Gunsight Mountain Lodge", subtitle: "Snowmachine tours, winter adventures & lodging near Eureka, Alaska", ids: ["gunsight-alpine-morning", "gunsight-frozen-waters", "gunsight-full-day", "gunsight-twilight-ridge", "gunsightLodge", "gunsight-cabin-stay", "gunsight-snowmachine-fishing", "gunsight-cabin-1", "gunsight-cabin-2", "gunsight-cabin-3", "gunsight-camping"] },
  { title: "St. Elias Alpine Guides", subtitle: "Root Glacier, Kennecott & Wrangell–St. Elias adventures", ids: ["Ice Climbing Root Glacier!", "Mill Tour", "stelias-root-halfday", "stelias-root-fullday", "stelias-ice-caves", "stelias-glacial-lake-paddle", "stelias-three-day-adventure", "stelias-root-overnight", "stelias-ice-camp"] },
  { title: "Outbound Heli Adventures", subtitle: "Flightseeing, glacier access & helicopter adventures", ids: ["outboundHeli", "outbound-knik-explorer", "outbound-chugach-explorer", "outbound-scenic-sampler", "outbound-glacier-trekking", "outbound-ice-climbing"] },
  { title: "Hatcher Pass ATV Tours", subtitle: "Guided ATV, UTV & snowmobile adventures", ids: ["hatcherPassAtv", "hatcher-two-person-utv", "hatcher-group-utv", "hatcher-full-day-utv", "hatcher-winter-snowmobile", "hatcher-northern-lights-utv"] },
  { title: "Phantom Tri-River Charters", subtitle: "Talkeetna fishing & river experiences", ids: ["phantomTriRiver", "phantom-half-day-float", "phantom-full-day-float", "phantom-private-spin", "phantom-fly-fishing", "phantom-public-spin"] },
  { title: "King for a Day / AK Charters", subtitle: "Copper River fishing, rafting & backcountry experiences", ids: ["kingForADay", "king-klutina-salmon", "king-gulkana-float", "king-scenic-float", "king-atv-tour"] },
  { title: "SeaCraft Hover Tours", subtitle: "Hovercraft exploration & scenic excursions", ids: ["seacraftHover", "seacraft-talkeetna-scenic"] },
];

function ExperienceCard({ item }) {
  const partnerQuote = getPartnerDisplayPrice(item);
  const unitName = { perPerson: "/person", perVehicle: "/UTV", perNight: "/night", perCharter: "/charter" }[item.publishedPriceUnit] || "";
  const image = item.image || item.images?.[0];
  const summary = item.description || item.desc || "Ask us about this Alaska experience.";
  return (
    <article className="flex min-w-0 flex-col overflow-hidden rounded-xl border border-white/15 bg-neutral-900">
      <div className="relative aspect-video w-full overflow-hidden bg-black">
        {image ? <img src={image} alt={item.name} loading="lazy" className="h-full w-full object-contain" /> : <div className="flex h-full items-center justify-center p-3 text-xs text-neutral-400">Photo coming soon</div>}
      </div>
      <div className="flex flex-1 flex-col p-3">
        <p className="text-[10px] font-bold uppercase tracking-wide text-orange-300">{item.operator === "AOE" ? "Guided AOE experience" : "Partner reservation · confirmation required"}</p>
        <h4 className="mt-1 min-h-[2.5rem] text-sm font-bold leading-snug text-white sm:text-base">{item.name}</h4>
        <p className="mt-1 flex-1 text-xs leading-4 text-neutral-400" style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{summary}</p>
        {partnerQuote != null && (
          <p className="mt-3 border-t border-white/10 pt-2 text-xs font-semibold text-white">
            From ${partnerQuote.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}{unitName}
          </p>
        )}
        <a href={`/plan-your-trip?experience=${encodeURIComponent(item.id)}`} className="mt-3 rounded-lg border border-orange-400/60 bg-orange-500/10 px-3 py-2 text-center text-xs font-bold text-orange-200 transition hover:bg-orange-500/20">Book Now →</a>
      </div>
    </article>
  );
}

export default function HomepageExperienceCatalog() {
  const visible = experiences.filter(item => item.id && item.category !== "partner-information" && (item.active === true || item.catalogStatus === "draft-not-bookable"));
  const assigned = new Set(PARTNER_GROUPS.flatMap(group => group.ids));
  const primary = visible.filter(item => item.operator === "AOE" && item.id !== "custom-offroad-expedition");
  const other = visible.filter(item => item.operator !== "AOE" && !assigned.has(item.id));
  return (
    <section id="excursions" className="mx-auto max-w-7xl scroll-mt-40 px-4 py-14">
      {/* Single outer boundary for the complete Add-On Experiences catalog. */}
      <div className="rounded-3xl border border-white/30 bg-neutral-900/30 p-5 shadow-xl sm:p-8 lg:p-10">
        <section className="mb-12 rounded-3xl border border-orange-400/40 bg-orange-500/5 p-5 sm:p-7" aria-label="Alaska Off-Road Expedition seasonal expeditions">
          <div className="mb-5 border-b border-orange-400/25 pb-4">
            <p className="text-xs font-extrabold uppercase tracking-widest text-orange-300">Alaska Off-Road Expedition</p>
            <h2 className="mt-2 text-3xl font-extrabold uppercase text-white md:text-4xl">CHOOSE YOUR ALASKA EXPEDITION</h2>
            <p className="mt-2 text-sm text-neutral-300">Experience Alaska in any season. Choose a winter or summer off-road expedition, then personalize your trip with optional add-on excursions.</p>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <article className="flex min-w-0 flex-col overflow-hidden rounded-xl border border-white/20 bg-neutral-900">
              <div className="aspect-video w-full overflow-hidden bg-black">
                <img src="/images/knik-winter-package.png" alt="Winter Alaska off-road expedition with Jeep Gladiators near Knik Glacier" className="h-full w-full object-contain" loading="lazy" />
              </div>
              <div className="flex flex-1 flex-col p-4">
                <p className="text-xs font-extrabold uppercase tracking-wide text-orange-300">Winter Adventures</p>
                <h3 className="mt-1 text-xl font-extrabold text-white">Winter Expeditions</h3>
                <p className="mt-2 flex-1 text-sm text-neutral-300">Experience frozen glaciers and Alaska's winter backcountry. Drive one of our expedition-ready Jeeps or ride with your guide.</p>
                <a href="/plan-your-trip?experience=winter-knik-glacier" className="mt-4 rounded-lg border border-orange-300/50 bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 px-4 py-3 text-center text-sm font-extrabold text-white shadow-[0_0_16px_rgba(249,115,22,0.4)] transition hover:brightness-110">Book Now →</a>
              </div>
            </article>
            <article className="flex min-w-0 flex-col overflow-hidden rounded-xl border border-white/20 bg-neutral-900">
              <div className="aspect-video w-full overflow-hidden bg-black">
                <img src="/images/alaska_off_road_sunset_expedition.png" alt="Summer Alaska off-road expedition with Jeeps, campfire and mountain scenery" className="h-full w-full object-contain" loading="lazy" />
              </div>
              <div className="flex flex-1 flex-col p-4">
                <p className="text-xs font-extrabold uppercase tracking-wide text-orange-300">Summer Adventures</p>
                <h3 className="mt-1 text-xl font-extrabold text-white">Summer Expeditions</h3>
                <p className="mt-2 flex-1 text-sm text-neutral-300">Explore remote Alaska trails, mountain passes and scenic campsites on a fully guided off-road adventure.</p>
                <a href="/plan-your-trip" className="mt-4 rounded-lg border border-orange-300/50 bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 px-4 py-3 text-center text-sm font-extrabold text-white shadow-[0_0_16px_rgba(249,115,22,0.4)] transition hover:brightness-110">Book Now →</a>
              </div>
            </article>
          </div>
        </section>
        <div className="mb-9 text-center">
          <h2 className="text-4xl font-extrabold uppercase tracking-wide text-white md:text-5xl lg:text-6xl">
            ADD-ON EXCURSIONS
          </h2>
          <p className="mx-auto mt-3 max-w-3xl text-sm leading-6 text-neutral-300">Explore Alaska adventures and add-on excursions. Choose an experience to build your trip. Partner schedules are confirmed after reservation.</p>
        </div>
        {/* Matching, thumbnail-led excursion dropdowns. Primary expedition remains above. */}
        <div className="space-y-3">
          {PARTNER_GROUPS.map((group) => {
            const items = group.ids.map((id) => visible.find((item) => item.id === id)).filter(Boolean);
            if (!items.length) return null;
            return <details key={group.title} className="group min-w-0 overflow-hidden rounded-2xl border border-white/20 bg-neutral-900/70">
              <summary className="flex cursor-pointer list-none items-center gap-3 px-3 py-3 transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange-400 sm:gap-4 sm:px-5 [&::-webkit-details-marker]:hidden">
                <div className="h-16 w-20 shrink-0 overflow-hidden rounded-lg border border-white/20 bg-black sm:h-[72px] sm:w-24">
                  {(items[0].image || items[0].images?.[0]) ? (
                    <img src={items[0].image || items[0].images[0]} alt="" loading="lazy" className="h-full w-full object-contain" />
                  ) : <div className="flex h-full items-center justify-center p-2 text-center text-[10px] text-neutral-400">Photo coming soon</div>}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-base font-extrabold text-white sm:text-xl">{group.title}</h3>
                  <p className="mt-1 hidden text-xs text-neutral-400 sm:block sm:text-sm">{group.subtitle}</p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1 sm:flex-row sm:items-center sm:gap-3">
                  <span className="text-[10px] font-bold text-orange-300 sm:text-xs">{items.length} excursions</span>
                  <span className="inline-flex items-center gap-2 rounded-lg border border-orange-400/60 bg-orange-500/15 px-3 py-2 text-xs font-extrabold text-orange-200">
                    <span className="group-open:hidden">OPEN</span>
                    <span className="hidden group-open:inline">CLOSE</span>
                    <svg className="h-4 w-4 transition-transform duration-200 group-open:rotate-180" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true"><path d="m4 7 6 6 6-6" /></svg>
                  </span>
                </div>
              </summary>
              <div className="grid grid-cols-2 gap-3 border-t border-white/15 p-3 sm:grid-cols-3 sm:p-4 lg:grid-cols-4">
                {items.map((item) => <ExperienceCard key={item.id} item={item} />)}
              </div>
            </details>;
          })}
          {other.length > 0 && <details className="group min-w-0 overflow-hidden rounded-2xl border border-white/20 bg-neutral-900/70">
            <summary className="flex cursor-pointer list-none items-center gap-3 px-3 py-3 transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange-400 sm:gap-4 sm:px-5 [&::-webkit-details-marker]:hidden">
              <div className="h-16 w-20 shrink-0 overflow-hidden rounded-lg border border-white/20 bg-black sm:h-[72px] sm:w-24">
                {(other[0].image || other[0].images?.[0]) ? <img src={other[0].image || other[0].images[0]} alt="" loading="lazy" className="h-full w-full object-contain" /> : <div className="flex h-full items-center justify-center p-2 text-center text-[10px] text-neutral-400">Photo coming soon</div>}
              </div>
              <div className="min-w-0 flex-1"><h3 className="text-base font-extrabold text-white sm:text-xl">More Alaska Excursions</h3><p className="mt-1 hidden text-xs text-neutral-400 sm:block sm:text-sm">More local adventures</p></div>
              <div className="flex shrink-0 flex-col items-end gap-1 sm:flex-row sm:items-center sm:gap-3"><span className="text-[10px] font-bold text-orange-300 sm:text-xs">{other.length} excursions</span><span className="inline-flex items-center gap-2 rounded-lg border border-orange-400/60 bg-orange-500/15 px-3 py-2 text-xs font-extrabold text-orange-200"><span className="group-open:hidden">OPEN</span><span className="hidden group-open:inline">CLOSE</span><svg className="h-4 w-4 transition-transform duration-200 group-open:rotate-180" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true"><path d="m4 7 6 6 6-6" /></svg></span></div>
            </summary>
            <div className="grid grid-cols-2 gap-3 border-t border-white/15 p-3 sm:grid-cols-3 sm:p-4 lg:grid-cols-4">{other.map((item) => <ExperienceCard key={item.id} item={item} />)}</div>
          </details>}
        </div>
      </div>
    </section>
  );
}
