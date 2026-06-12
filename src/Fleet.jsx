export default function Fleet() {
  return (
  <section id="fleet" className="mx-auto max-w-7xl px-4 py-16">
    <div className="mb-10 text-center">
      <h2 className="text-3xl md:text-4xl font-bold">
        Expedition-Ready Rigs
      </h2>
      <p className="mt-3 text-neutral-300 max-w-3xl mx-auto">
        Built expedition vehicles equipped for Alaska’s most demanding terrain.
        37&quot; Lifted &quot; Heavy-duty bumpers &amp; winches • 
        Camping gear &amp; Full recovery.
      </p>
    </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {/* Jeep Gladiator */}
        <div className="rounded-2xl overflow-hidden border border-white/10 bg-neutral-900/40">
          <img
            src="/images/Wrangler140.jpg"
            alt="Jeep Gladiator expedition build on mountain trail"
            className="h-96 md:h-[28rem] w-full object-cover"
            loading="lazy"
          />
          <div className="p-5">
            <h3 className="text-xl font-semibold">
              Jeep Gladiator Expedition Build
            </h3>
            <p className="mt-2 text-neutral-300">
              37&quot; tires, steel bumpers, integrated winch,
              expedition suspension, comms, recovery equipment, and a SmartCap-based
              camp system designed for long-range travel in remote terrain.
            </p>
          </div>
        </div>

        {/* Toyota Tacoma */}
        <div className="rounded-2xl overflow-hidden border border-white/10 bg-neutral-900/40">
          <img
            src="/images/tacomaone40.jpeg"
            alt="Toyota Tacoma expedition build in the mountains"
            className="h-96 md:h-[28rem] w-full object-cover"
            loading="lazy"
          />
          <div className="p-5">
            <h3 className="text-xl font-semibold">
              Toyota Tacoma Expedition Build
            </h3>
            <p className="mt-2 text-neutral-300">
              2019 Tacoma TRD Off-Road on 37&quot; tires with a 6&quot; lift, heavy-duty
              bumper and winch, OVS topper and tent system, satellite comms,
              recovery gear, and cold-weather camping equipment for true off-grid comfort.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}