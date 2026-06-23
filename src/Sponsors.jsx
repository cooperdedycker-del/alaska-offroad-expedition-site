export default function Sponsors() {
  const sponsors = [
    {
      name: "Carbon Offroad",
      img: "/images/sponsors/carbonoffroad.jpg",
      description:
        "Carbon Offroad builds premium winches and recovery gear engineered for serious off-road and expedition use. Their equipment is trusted on our Alaska expedition rigs in harsh terrain and remote recovery situations.",
      website: "https://carbonoffroadusa.com",
      badge: "Used on our rigs",
      discountCode: "ALASKAOFFROAD",
      featured: true,
    },
    {
  name: "Bubba Rope",
  img: "/images/sponsors/bubbarope.png",
  description:
    "Bubba Rope produces industry-leading kinetic recovery ropes and soft shackles designed for safe, efficient, and powerful vehicle recoveries.",
  website: "https://bubbarope.com",
  badge: "Recovery gear",
  discountCode: "AKOE10",
  featured: true,
},
{
  name: "PullPal",
  img: "/images/sponsors/Pulpall.png",
  description:
    "PullPal manufactures portable land anchors that allow for self-recovery in terrain where natural anchor points are not available—essential for remote off-road travel.",
  website: "https://pullpal.com",
  badge: "Recovery equipment",
  discountCode: "",
  featured: true,
},
{
  name: "Method Race Wheels",
  img: "/images/sponsors/Method.png",
  description:
    "Method Race Wheels builds high-performance wheels engineered for off-road strength, durability, and proven performance in extreme terrain.",
  website: "https://www.methodracewheels.com",
  badge: "Wheel partner",
  discountCode: "",
  featured: true,
},
    {
  name: "OVS (Overland Vehicle Systems)",
  img: "/images/sponsors/OVS.webp",
  description:
    "Overland Vehicle Systems builds high-quality rooftop tents, awnings, recovery gear, and overland equipment designed for durability in extreme environments.",
  website: "https://overlandvehiclesystems.com",
  badge: "Overland gear partner",
  discountCode: "",
  featured: true,
},
    {
      name: "Diode Dynamics",
      img: "/images/sponsors/Diodedynamics.png",
      description:
        "Diode Dynamics designs high-performance LED lighting systems built for extreme weather, off-road visibility, and dependable vehicle-specific fitment.",
      website: "https://diodedynamics.com",
      badge: "Trusted lighting partner",
      discountCode: "",
      featured: true,
    },
    {
      name: "Wolfbox",
      img: "/images/sponsors/wolfbox.webp",
      description:
        "Wolfbox produces advanced dash cam and rearview mirror camera systems that improve visibility, safety, and awareness—especially for rigs with toppers, trailers, gear, or limited rear visibility.",
      website:
        "https://wolfbox.com/products/wolfbox-g900tripro-bumper-version-3-channel-rearview-mirror?ref=yprxdscf&utm_source=goaff",
      badge: "Recommended gear",
      discountCode: "",
      featured: true,
    },
    {
      name: "VEVOR",
      img: "/images/sponsors/Vevor.png",
      description:
        "VEVOR offers a wide range of tools, shop equipment, and outdoor products that support fabrication, vehicle prep, camp setups, and expedition support gear.",
      website: "https://www.vevor.com",
      badge: "Shop & support gear",
      discountCode: "",
      featured: true,
    },

{
  name: "FCK Lightbars",
  img: "/images/sponsors/FCK lightbars.avif",
  description:
    "FCK Lightbars delivers high-output LED lighting solutions designed for off-road visibility, durability, and performance in harsh conditions.",
  website: "https://fcklightbars.com",
  badge: "Lighting partner",
  discountCode: "ALASKAOFFROAD 15%",
  featured: true,
},
{
  name: "TrailToyz Offroad",
  img: "/images/sponsors/trailtoyz.png",
  description:
    "Local Offroad shop located in Wasilla, Alaska.",
  website: "https://trailtoyz.com",
  badge: "Local Shop",
  discountCode: "",
  featured: false,
},
{
  name: "AK Gear works",
  img: "/images/sponsors/akgearworks.jpg",
  description:
    "Local Offroad shop located in Wasilla, Alaska.",
  website: "https://trailtoyz.com",
  badge: "Local Shop",
  discountCode: "",
  featured: false,
},
  ];

  const featuredSponsors = sponsors.filter((s) => s.featured);
  const supportingSponsors = sponsors.filter((s) => !s.featured);

  return (
    <section id="sponsors" className="mx-auto max-w-7xl px-4 py-16">
      <div className="mb-12 text-center">
        <h2 className="text-3xl md:text-4xl font-bold">Featured Sponsors & Partners</h2>
        <p className="mt-3 text-neutral-300 max-w-3xl mx-auto">
          We’re proud to work with brands and companies that help power Alaska Offroad Expedition.
          These are products and partners we trust, use, and recommend.
        </p>

        <a
          href="#contact"
          className="mt-6 inline-flex items-center justify-center rounded-xl bg-amber-400 px-6 py-3 text-sm font-bold text-neutral-900 hover:bg-amber-300 transition"
        >
          Become a Sponsor
        </a>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {featuredSponsors.map((s) => (
          <div
            key={s.name}
            className="rounded-3xl overflow-hidden border border-white/10 bg-neutral-900/50"
          >
            <div className="h-44 flex items-center justify-center bg-black/30 p-6">
              <img
                src={s.img}
                alt={s.name}
                className="max-h-24 max-w-full object-contain"
                loading="lazy"
              />
            </div>

            <div className="p-6">
              {s.badge && (
                <div className="inline-flex rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-xs font-semibold text-amber-300">
                  {s.badge}
                </div>
              )}

              <div className="mt-3 text-xl font-semibold text-neutral-100">
                {s.name}
              </div>

              <p className="mt-3 text-sm text-neutral-300">
                {s.description}
              </p>

              {s.discountCode && (
                <div className="mt-4 rounded-xl border border-white/10 bg-neutral-800 px-4 py-3 text-sm">
                  <span className="text-neutral-400">Discount Code: </span>
                  <span className="font-bold text-amber-300">{s.discountCode}</span>
                </div>
              )}

              <a
                href={s.website}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex w-full items-center justify-center rounded-xl bg-white/10 px-4 py-3 text-sm font-semibold text-neutral-100 hover:bg-white/20 transition"
              >
                Visit Sponsor
              </a>
            </div>
          </div>
        ))}
      </div>

      {supportingSponsors.length > 0 && (
        <div className="mt-12 rounded-3xl border border-white/10 bg-neutral-900/40 p-6 md:p-8">
          <h3 className="text-2xl font-bold text-center">Supporting Sponsors</h3>
          <p className="mt-2 text-center text-sm text-neutral-400">
            Additional companies and gear partners helping support the mission.
          </p>

          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {supportingSponsors.map((s) => (
              <div
                key={s.name}
                className="rounded-2xl overflow-hidden border border-white/10 bg-neutral-900/50"
              >
                <div className="h-32 flex items-center justify-center bg-black/30 p-4">
                  <img
                    src={s.img}
                    alt={s.name}
                    className="max-h-20 max-w-full object-contain"
                    loading="lazy"
                  />
                </div>

                <div className="p-5 text-center">
                  {s.badge && (
                    <div className="inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-neutral-300">
                      {s.badge}
                    </div>
                  )}

                  <div className="mt-3 text-lg font-semibold text-neutral-100">
                    {s.name}
                  </div>

                  <p className="mt-2 text-sm text-neutral-300">
                    {s.description}
                  </p>

                  {s.discountCode && (
                    <div className="mt-4 rounded-xl border border-white/10 bg-neutral-800 px-4 py-3 text-sm">
                      <span className="text-neutral-400">Discount Code: </span>
                      <span className="font-bold text-amber-300">{s.discountCode}</span>
                    </div>
                  )}

                  <a
                    href={s.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-white/10 px-4 py-3 text-sm font-semibold text-neutral-100 hover:bg-white/20 transition"
                  >
                    Visit Sponsor
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
