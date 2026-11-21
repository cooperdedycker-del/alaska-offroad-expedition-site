import { useState } from "react";
import ExperienceDetailsModal from "./components/ExperienceDetailsModal";
import { experiences, getPartnerPriceInfo } from "./data/experiences";

import { ADD_ON_CATEGORIES, getAddOnCategoryIds } from "./data/addOnCategories";

function ExperienceCard({ item, onViewDetails }) {
  const priceInfo = getPartnerPriceInfo(item);
  const unitName = priceInfo?.unitLabel ?? {perPerson:"person",perVehicle:"vehicle",perCharter:"charter",perNight:"night"}[priceInfo?.unit];
  const image = item.image || item.images?.[0];
  const summary = item.description || item.desc || "Ask us about this Alaska experience.";
  return (
    <article className="flex min-w-0 flex-col overflow-hidden rounded-xl border border-white/15 bg-neutral-900">
      <div className="relative aspect-video w-full overflow-hidden bg-black">
        {image ? <img src={image} alt={item.name} loading="lazy" className="h-full w-full object-contain" /> : <div className="flex h-full items-center justify-center p-3 text-xs text-neutral-400">Photo coming soon</div>}
      </div>
      <div className="flex flex-1 flex-col p-3">
        <p className="text-[10px] font-bold uppercase tracking-wide text-orange-300">Partner dates subject to confirmation</p>
        <h4 className="mt-1 min-h-[2.5rem] text-sm font-bold leading-snug text-white sm:text-base">{item.name}</h4>
        <p className="mt-1 flex-1 text-xs leading-4 text-neutral-400" style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{summary}</p>
        <p className="mt-3 border-t border-white/10 pt-2 text-xs font-semibold text-white">{priceInfo ? `From $${priceInfo.customerPrice.toLocaleString("en-US")}/${unitName} · estimated` : "Price available upon request"}</p>
        <p className="mt-2 text-[11px] text-neutral-400">Transportation included with eligible AOE expedition packages; standalone transfers may cost extra.</p>
        <button type="button" onClick={() => onViewDetails(item)} className="mt-3 rounded-lg border border-white/25 px-3 py-2 text-center text-xs font-bold text-white transition hover:bg-white/10">View Details</button>
        <a href={`/plan-your-trip?experience=${encodeURIComponent(item.id)}`} className="mt-3 rounded-lg border border-orange-400/60 bg-orange-500/10 px-3 py-2 text-center text-xs font-bold text-orange-200 transition hover:bg-orange-500/20">Plan This Experience →</a>
      </div>
    </article>
  );
}

export default function HomepageExperienceCatalog() {
  const [detailExperience, setDetailExperience] = useState(null);
  const visible = experiences.filter(item => item.id && item.category !== "partner-information" && item.operator !== "AOE");
  return (
    <section id="excursions" className="mx-auto max-w-7xl scroll-mt-40 px-4 py-14">
      {/* Single outer boundary for the complete Add-On Experiences catalog. */}
      <div className="rounded-3xl border border-white/30 bg-neutral-900/30 p-5 shadow-xl sm:p-8 lg:p-10">
        <div className="mb-9 text-center">
          <h2 className="text-4xl font-extrabold uppercase tracking-wide text-white md:text-5xl lg:text-6xl">
            ADD-ON EXPERIENCES
          </h2>
          <p className="mx-auto mt-3 max-w-3xl text-sm leading-6 text-neutral-300">Discover individual tours from Alaska adventure providers. Experiences marked as inquiries are subject to partner confirmation and are not available for instant checkout.</p>
        </div>
        <div className="space-y-8">
          {ADD_ON_CATEGORIES.map(group => {
            const items = visible.filter(item => getAddOnCategoryIds(item).includes(group.id));
            if (!items.length) return null;
            return (
              <details key={group.id} className="group overflow-hidden rounded-2xl border border-white/20 bg-neutral-900/70">
                <summary className="flex cursor-pointer list-none items-center gap-3 px-3 py-4 transition hover:bg-white/10 sm:px-5 [&::-webkit-details-marker]:hidden">
                  <div className="h-16 w-20 shrink-0 overflow-hidden rounded-lg border border-white/15 bg-black sm:h-[72px] sm:w-24">
                    {items[0].image || items[0].images?.[0] ? (
                      <img src={items[0].image || items[0].images[0]} alt="" loading="lazy" className="h-full w-full object-contain" />
                    ) : <div className="grid h-full place-items-center text-xs text-neutral-400">Photo soon</div>}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-base font-extrabold text-white sm:text-xl">{group.title}</h3>
                    <p className="mt-1 hidden text-xs text-neutral-400 sm:block sm:text-sm">{group.subtitle}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <span className="hidden text-xs font-bold text-orange-300 sm:inline">{items.length} excursions</span>
                    <span className="rounded-lg border border-orange-400/60 bg-orange-500/15 px-3 py-2 text-xs font-extrabold text-orange-200">
                      <span className="group-open:hidden">OPEN ↓</span><span className="hidden group-open:inline">CLOSE ↑</span>
                    </span>
                  </div>
                </summary>
                <div className="grid grid-cols-2 gap-3 border-t border-white/15 p-3 sm:grid-cols-3 sm:p-4 lg:grid-cols-4">
                  {items.map(item => <ExperienceCard key={item.id} item={item} onViewDetails={setDetailExperience} />)}
                </div>
              </details>
            );
          })}
        </div>
      </div>
      <ExperienceDetailsModal experience={detailExperience} onClose={() => setDetailExperience(null)} />
    </section>
  );
}
