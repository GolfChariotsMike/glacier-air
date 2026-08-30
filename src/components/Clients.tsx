const clients = [
  { name: "Home Base Perth", src: "/images/clients/home-base-perth.png" },
  { name: "Forest Hill Vineyard", src: "/images/clients/forest-hill-vineyard.png" },
  { name: "Cancer Council WA", src: "/images/clients/cancer-council-wa.png" },
  { name: "Bower / Wanslea", src: "/images/clients/bower-wanslea.png" },
  { name: "Accolade Wines", src: "/images/clients/accolade-wines.png" },
  { name: "West Cape Howe", src: "/images/clients/west-cape-howe.png" },
  { name: "Primero", src: "/images/clients/primero.png" },
  { name: "Luna Palace Cinemas", src: "/images/clients/luna-palace-cinemas.png" },
  { name: "Smile Time Orthodontics", src: "/images/clients/smile-time-orthodontics.png" },
];

function LogoRow({ duplicate = false }: { duplicate?: boolean }) {
  return (
    <div
      className={duplicate ? "client-marquee-dup flex" : "flex"}
      aria-hidden={duplicate || undefined}
    >
      {clients.map((c) => (
        <div
          key={`${c.name}${duplicate ? "-dup" : ""}`}
          className="flex h-16 w-44 shrink-0 items-center justify-center px-6"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={c.src}
            alt={duplicate ? "" : c.name}
            className="max-h-12 w-auto max-w-full object-contain invert opacity-80"
          />
        </div>
      ))}
    </div>
  );
}

export default function Clients() {
  return (
    <section className="py-16 bg-[#060c1a] border-t border-white/5 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 mb-10 text-center">
        <p className="text-blue-400 text-sm font-semibold uppercase tracking-widest mb-3">
          Trusted By
        </p>
        <h2 className="text-3xl md:text-4xl font-bold text-white">Our valued clients</h2>
      </div>
      <div className="client-marquee">
        <div className="client-marquee-track">
          <LogoRow />
          <LogoRow duplicate />
        </div>
      </div>
    </section>
  );
}
