
import { useEffect, useState } from "react";
import { excursions } from "./data/excursions";

function AutoSlideshow({ images, alt }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!images || images.length <= 1) return;

    const timer = setInterval(() => {
      setIndex((current) => (current + 1) % images.length);
    }, 3500);

    return () => clearInterval(timer);
  }, [images]);

  const activeImage = images?.[index] || images?.[0];

  return (
    <div className="relative aspect-[4/3] overflow-hidden bg-black/30">
      <img
        src={activeImage}
        alt={alt}
        className="h-full w-full object-cover transition duration-500"
        loading="lazy"
      />

      {images?.length > 1 && (
        <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2">
          {images.map((_, i) => (
            <span
              key={i}
              className={`h-2 w-2 rounded-full ${
                i === index ? "bg-white" : "bg-white/40"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function Excursions() {
  const partners = excursions;

  return (
    <section id="excursions" className="mx-auto max-w-7xl px-4 py-16">
     <div className="mb-10 text-center">
  <h2 className="text-3xl md:text-4xl font-bold">
    Add-On Experiences
  </h2>

  <p className="mt-3 text-neutral-300 max-w-3xl mx-auto">
    Make your Alaska expedition even more unforgettable!
    From glacier adventures to unique Alaskan activities,
    customize your trip with experiences that match your interests.
    Select your favorite add-ons directly in our Trip Builder,
    and we'll handle the planning and coordination.
  </p>

  <a
    href="#trip-builder"
    className="mt-5 inline-flex items-center gap-2 font-semibold text-orange-400 transition hover:text-orange-300"
  >
    Explore Add-Ons in the Trip Builder
    <span aria-hidden="true">→</span>
  </a>
</div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {partners.map((p) => (
          <div
            key={p.name}
            className="rounded-2xl overflow-hidden border border-white/10 bg-neutral-900/40"
          >
            <AutoSlideshow images={p.images} alt={p.name} />

            <div className="p-5">
              {p.availability && (
                <div className="mb-3">
                  <span className="inline-flex rounded-full bg-emerald-500/15 border border-emerald-400/30 px-3 py-1 text-xs font-semibold text-emerald-300">
                    Available {p.availability}
                  </span>
                </div>
              )}

              <div className="text-xs uppercase tracking-wider text-white/60">
                {p.type}
              </div>

              <div className="mt-2 font-semibold">
                {p.name}
              </div>

              <p className="mt-2 text-sm text-neutral-300">
                {p.desc}
              </p>

              <div className="mt-4 text-xs text-neutral-400">
  Available as an add-on in our Trip Builder.
</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
