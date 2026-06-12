export default function About() {
  return (
    <section id="about" className="mx-auto max-w-7xl px-4 py-16">
      <div className="grid md:grid-cols-2 gap-10 items-start">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold">Alaskans. Guides. Expedition Leaders.</h2>
          <p className="mt-3 text-neutral-300">We’ve spent years pushing deep into the backcountry—recoveries, remote routes, winter crossings. Alaska Offroad Expedition was built to share that world with guests who want the real thing—rugged, safe, and unforgettable.</p>
          <ul className="mt-5 list-disc pl-5 text-neutral-300 space-y-2">
            <li>Wilderness first aid & recovery trained</li>
            <li>Permits & partnerships across key regions</li>
            <li>Small groups, high guide-to-guest ratio</li>
          </ul>
        </div>
        <div className="rounded-2xl overflow-hidden border border-white/10 bg-neutral-900/40">
          <img src="/images/expedition2.bmp" alt="Glacier valley" className="w-full h-72 object-cover" loading="lazy" />
          <div className="p-5 text-neutral-300">“Not a tour—an expedition. The team handled everything. We just showed up and lived Alaska.”</div>
        </div>
      </div>
    </section>
  );
}