import { expeditionPackages } from "../data/packages";

export default function Packages() {
  const packages = expeditionPackages.filter(
    (expeditionPackage) => expeditionPackage.active
  );

  const handleBookPackage = (slug) => {
    window.location.href = `/book-package?package=${slug}`;
  };

  return (
    <section id="packages" className="relative">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-neutral-950 via-neutral-900/50 to-neutral-950" />

      <div className="mx-auto max-w-7xl px-4 py-16 md:py-20">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-400">
            Ready-To-Book Adventures
          </div>

          <h2 className="mt-3 text-3xl font-bold text-white md:text-5xl">
            Choose Your Alaska Expedition
          </h2>

          <p className="mt-5 text-base leading-7 text-neutral-300 md:text-lg">
            Skip the planning and choose one of our pre-built Alaska
            adventures. Pick your experience, choose your date, register your
            group and get ready to explore Alaska.
          </p>
        </div>

        {/* Package Cards */}
        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {packages.map((expeditionPackage) => (
            <article
              key={expeditionPackage.id}
              className="flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-neutral-900/70 shadow-xl transition hover:-translate-y-1 hover:border-orange-400/30 hover:bg-neutral-900"
            >
              {/* Optional Image */}
              {expeditionPackage.image && (
                <div className="h-56 overflow-hidden">
                  <img
                    src={expeditionPackage.image}
                    alt={expeditionPackage.name}
                    className="h-full w-full object-cover transition duration-500 hover:scale-105"
                    loading="lazy"
                  />
                </div>
              )}

              <div className="flex flex-1 flex-col p-6">
                <div className="flex items-center justify-between gap-4">
                  <span className="rounded-full border border-orange-400/30 bg-orange-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-orange-300">
                    {expeditionPackage.duration}
                  </span>

                  {expeditionPackage.seasonLabel && (
                    <span className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
                      {expeditionPackage.seasonLabel}
                    </span>
                  )}
                </div>

                <h3 className="mt-5 text-2xl font-bold text-white">
                  {expeditionPackage.name}
                </h3>

                <p className="mt-3 leading-6 text-neutral-300">
                  {expeditionPackage.shortDescription}
                </p>

                <div className="mt-6 border-t border-white/10 pt-5">
                  <div className="text-sm font-semibold uppercase tracking-wide text-neutral-400">
                    What's Included
                  </div>

                  <ul className="mt-4 space-y-3">
                    {expeditionPackage.includes.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-3 text-sm text-neutral-300"
                      >
                        <span className="mt-0.5 text-orange-400">✓</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-auto pt-7">
                  <div className="flex items-end justify-between gap-4 border-t border-white/10 pt-5">
                    <div>
                      <div className="text-xs uppercase tracking-wide text-neutral-500">
                        Package Price
                      </div>

                      <div className="mt-1 text-2xl font-bold text-white">
                        {expeditionPackage.priceLabel}
                      </div>

                      {expeditionPackage.priceNote && (
                        <div className="mt-1 text-xs text-neutral-500">
                          {expeditionPackage.priceNote}
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      handleBookPackage(expeditionPackage.slug)
                    }
                    className="mt-5 w-full rounded-xl bg-orange-400 px-5 py-3 font-bold text-neutral-950 transition hover:bg-orange-300"
                  >
                    BOOK NOW
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Custom Trip Builder Callout */}
        <div className="mt-12 rounded-3xl border border-white/10 bg-neutral-900/60 p-7 md:flex md:items-center md:justify-between md:gap-10 md:p-10">
          <div>
            <div className="text-sm font-semibold uppercase tracking-[0.15em] text-orange-400">
              Want Something Different?
            </div>

            <h3 className="mt-2 text-2xl font-bold text-white md:text-3xl">
              Build Your Own Expedition
            </h3>

            <p className="mt-3 max-w-2xl text-neutral-300">
              Looking for a longer trip or something more customized? Choose
              your dates, expedition style, lodging, camping and additional
              experiences with our Trip Builder.
            </p>
          </div>

          <a
            href="#trip-builder"
            className="mt-6 inline-flex shrink-0 items-center justify-center rounded-xl border border-white/20 bg-white px-6 py-3 font-bold text-neutral-950 transition hover:bg-neutral-200 md:mt-0"
          >
            BUILD YOUR EXPEDITION
          </a>
        </div>
      </div>
    </section>
  );
}