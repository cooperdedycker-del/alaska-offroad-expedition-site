export default function Experiences() {
  return (
    <section id="experiences" className="mx-auto max-w-7xl px-4 py-16">
      <div className="mb-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold">
          See the Expedition
        </h2>

        <p className="mt-3 text-neutral-300 max-w-3xl mx-auto">
          Get a look at what Alaska Offroad Expedition is all about — remote
          trails, glaciers, river crossings, camping, and fully guided Alaska
          adventure.
        </p>
      </div>

      <div className="w-full overflow-hidden rounded-3xl border border-white/10 bg-neutral-900/40 shadow-2xl">
        <div className="relative aspect-video w-full">
          <iframe
            className="absolute inset-0 h-full w-full"
            src="https://www.youtube.com/embed/YOUR_VIDEO_ID"
            title="Alaska Offroad Expedition video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
      </div>
    </section>
  );
}