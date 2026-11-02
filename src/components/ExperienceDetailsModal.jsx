import { getPartnerPriceInfo } from "../data/experiences";
import { useEffect, useState } from "react";

/** Reusable, read-only excursion details dialog for homepage and Trip Builder. */
export default function ExperienceDetailsModal({ experience, onClose }) {
  const [imageIndex, setImageIndex] = useState(0);
  useEffect(() => { setImageIndex(0); }, [experience?.id]);
  useEffect(() => {
    if (!experience) return undefined;
    const onKeyDown = (event) => { if (event.key === "Escape") onClose(); };
    const priorOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => { document.body.style.overflow = priorOverflow; window.removeEventListener("keydown", onKeyDown); };
  }, [experience, onClose]);
  if (!experience) return null;

  const photos = [...new Set([experience.image, ...(Array.isArray(experience.images) ? experience.images : [])].filter(Boolean))];
  const source = experience.website || experience.sourceUrl || experience.publishedSource;
  const priceInfo = getPartnerPriceInfo(experience);
  const unitName = { perPerson: "person", perVehicle: "vehicle", perCharter: "charter", perNight: "night" }[priceInfo?.unit];
  const price = priceInfo ? `From $${priceInfo.customerPrice.toFixed(2)} per ${unitName} · estimated` : "Price available upon request";
  const season = experience.season === "year-round" ? "Year-round" : experience.season === "winter" ? "Winter" : experience.season === "summer" ? "Summer" : "Season varies";
  const details = experience.sc || experience.desc || experience.description || "Contact us for more information about this experience.";
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-3 sm:p-6" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <div role="dialog" aria-modal="true" aria-labelledby="excursion-details-title" className="relative max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-orange-400/40 bg-neutral-950 text-white shadow-2xl">
        <button type="button" aria-label="Close details" onClick={onClose} className="sticky top-3 z-20 float-right mr-3 rounded-full border border-white/25 bg-black/85 px-3 py-2 text-lg font-bold hover:bg-neutral-800">✕</button>
        {photos.length > 0 && <div className="clear-both">
          <img src={photos[Math.min(imageIndex, photos.length - 1)]} alt={experience.name} className="max-h-[350px] w-full bg-black object-contain" />
          {photos.length > 1 && <div className="flex items-center justify-center gap-4 bg-neutral-900 px-4 py-2 text-sm"><button type="button" onClick={() => setImageIndex(i => (i - 1 + photos.length) % photos.length)} className="rounded-lg border border-white/25 px-4 py-1 hover:bg-white/10">← Previous</button><span>{imageIndex + 1} / {photos.length}</span><button type="button" onClick={() => setImageIndex(i => (i + 1) % photos.length)} className="rounded-lg border border-white/25 px-4 py-1 hover:bg-white/10">Next →</button></div>}
        </div>}
        <div className="p-5 sm:p-8">
          <p className="text-xs font-bold uppercase tracking-wide text-orange-300">{experience.operator === "AOE" ? "Alaska Off-Road Expedition" : experience.operator || "Alaska experience"}</p>
          <h2 id="excursion-details-title" className="mt-2 text-2xl font-extrabold sm:text-3xl">{experience.name}</h2>
          <p className="mt-3 text-lg font-bold text-orange-300">{price}</p>
          <p className="mt-2 text-xs text-neutral-400">Transportation is included with eligible AOE expedition packages. Standalone partner excursion transfers may have a separate fee.</p>
          <p className="mt-2 text-sm text-neutral-400">{season}{experience.location ? ` · ${experience.location}` : ""}{experience.durationHours ? ` · ${experience.durationHours} hours` : experience.duration ? ` · ${experience.duration}` : ""}</p>
          <h3 className="mt-7 text-lg font-bold">About this experience</h3>
          <p className="mt-2 whitespace-pre-line text-sm leading-7 text-neutral-200">{details}</p>
          {details !== experience.description && experience.description && <p className="mt-4 text-sm leading-7 text-neutral-300">{experience.description}</p>}
          {Array.isArray(experience.features) && experience.features.length > 0 && <div className="mt-5"><h3 className="font-bold">Highlights</h3><ul className="mt-2 list-inside list-disc space-y-1 text-sm text-neutral-300">{experience.features.map((feature, i) => <li key={i}>{feature}</li>)}</ul></div>}
          <p className="mt-6 rounded-lg border border-amber-400/25 bg-amber-500/10 p-3 text-xs leading-5 text-amber-100">Partner pricing, schedules, availability, and final arrangements are subject to confirmation. Viewing details does not add this excursion to your itinerary.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            {source && /^https?:\/\//.test(source) && <a href={source} target="_blank" rel="noopener noreferrer" className="rounded-xl border border-white/30 px-4 py-3 text-sm font-bold hover:bg-white/10">Provider website ↗</a>}
            <button type="button" onClick={onClose} className="rounded-xl bg-orange-500 px-5 py-3 text-sm font-bold text-white hover:bg-orange-400">Back to excursions</button>
          </div>
        </div>
      </div>
    </div>
  );
}
