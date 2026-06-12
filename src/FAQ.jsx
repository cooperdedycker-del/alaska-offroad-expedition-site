export default function FAQ() {
  const qa = [
    {
      q: "Do I need off-road experience?",
      a: "No—our guides coach you on the trail. We tailor obstacles to your comfort level and conditions.",
    },
    {
      q: "What’s included on overnights?",
      a: "Camp setup and all safety gear are included. Bring personal layers and boots. Gear runs are available if needed.",
    },
    {
      q: "Is food included on the expedition?",
      a: "Not all food is provided. We plan dinners for guests while on the trail. Guests are responsible for breakfast and lunch.",
    },
    {
      q: "Can you pick us up at the airport?",
      a: "Yes. Airport pickup and drop-off, as well as hotel transfers, are available.",
    },
    {
      q: "What about weather & safety?",
      a: "We monitor conditions, carry satellite communications, and build conservative go/no-go plans for each route.",
    },
    {
  q: "What should I pack for the expedition?",
  a: "We provide a recommended packing list after booking. Guests should bring weather-appropriate clothing, sturdy boots, and personal items. All critical expedition gear and safety equipment are provided."
},
{
  q: "How physically demanding are the expeditions?",
  a: "Trips can be tailored to your comfort level. Most experiences are moderate, but some activities like hiking, glacier travel, or technical terrain can be more demanding depending on your selections."
},
{
  q: "Are your vehicles automatic or manual?",
  a: "All expedition vehicles are automatic and equipped for ease of use, even for drivers with limited off-road experience."
},
{
  q: "What happens if weather impacts the trip?",
  a: "Safety is our top priority. We may adjust routes, timing, or activities due to weather conditions. When possible, we provide equal or better alternative experiences."
},
{
  q: "Is there a minimum or maximum group size?",
  a: "We focus on small group experiences to maintain quality and safety. Most trips accommodate 1–2 drivers and up to 6 passengers depending on the package and vehicles."
},
{
  q: "Can we customize our expedition?",
  a: "Yes—every trip is customizable. You can choose your duration, rig, lodging style, and add-on excursions like helicopter flights or glacier tours."
},
{
  q: "Do you provide recovery support if something goes wrong?",
  a: "Yes. All expeditions include professional recovery equipment and trained guides. In the rare case of a mechanical issue or stuck vehicle, we handle recovery and logistics."
},
{
  q: "Is fuel included in the trip cost?",
  a: "Fuel is typically included for guided expeditions. Specific details will be outlined in your final itinerary depending on trip length and route."
},
{
  q: "Can beginners drive the vehicles?",
  a: "Yes. Our vehicles are built for capability and ease of use. Guides provide instruction and support to ensure you are comfortable and confident behind the wheel."
},
{
  q: "Do you operate year-round?",
  a: "Yes. Summer expeditions focus on remote trails and overlanding, while winter offers snow-based adventures such as glacier tours and snowmachine experiences."
},
  ];
  return (
    <section id="faq" className="mx-auto max-w-7xl px-4 py-16">
      <h2 className="text-3xl md:text-4xl font-bold">FAQ</h2>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {qa.map((item, i) => (
          <div key={i} className="rounded-2xl border border-white/10 bg-neutral-900/40 p-5">
            <div className="font-semibold">{item.q}</div>
            <div className="mt-2 text-neutral-300">{item.a}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
