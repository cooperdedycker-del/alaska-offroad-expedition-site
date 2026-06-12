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
          Local Alaska Experiences
        </h2>

        <p className="mt-3 text-neutral-300 max-w-3xl mx-auto">
          We partner with proven Alaska outfitters to integrate bucket-list
          experiences into your expedition. We coordinate logistics, timing, and
          planning so your trip flows smoothly.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {partners.map((p) => (
          <div
            key={p.name}
            className="rounded-2xl overflow-hidden border border-white/10 bg-neutral-900/40"
          >
            <AutoSlideshow images={p.images} alt={p.name} />

            <div className="p-5">
              <div className="text-xs uppercase tracking-wider text-white/60">
                {p.type}
              </div>

              <div className="mt-2 font-semibold">{p.name}</div>

              <p className="mt-2 text-sm text-neutral-300">{p.desc}</p>

              <a
                href={p.website}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-white/10 px-4 py-2 text-sm font-semibold text-neutral-100 hover:bg-white/20 transition"
              >
                Learn More
              </a>

              <div className="mt-3 text-xs text-neutral-500">
                Excursion add-ons are selected in the Trip Builder.
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}