import Image from "next/image";
import { CLIENT_GREY_TILES, imagesForSlot, type GalleryState } from "@/lib/gallery";

const clients = [
  { name: "Alzheimer’s WA", src: "/clients/alzheimers-wa.png" },
  { name: "Cancer Council", src: "/clients/cancer-council.png" },
  { name: "Sandalford Wines", src: "/clients/sandalford-wines.png" },
  { name: "Pirate Life Perth", src: "/clients/pirate-life.png" },
  { name: "Altegra Property Group", src: "/clients/altegra.png" },
  { name: "New West Foods", src: "/clients/new-west-foods.png" },
  { name: "THE MONTAU LIGHTING", src: "/clients/montau-lighting.png" },
  { name: "West Cape Howe Wines", src: "/clients/west-cape-howe.png" },
  { name: "Oakover Wines", src: "/clients/oakover-wines.png" },
  { name: "Luna Palace Cinemas", src: "/clients/luna-palace.png", tile: "grey" },
  { name: "Benara Nurseries", src: "/clients/benara-nurseries.png" },
  { name: "foodfolk AUSTRALIA", src: "/clients/foodfolk.png" },
  { name: "sagewood Early Learning", src: "/clients/sagewood.png" },
  { name: "Uplyft", src: "/clients/uplyft.png" },
  { name: "Ross Scarfone Real Estate", src: "/clients/ross-scarfone.png" },
  { name: "Island Market Trigg", src: "/clients/island-market.png" },
  { name: "TSOKOS", src: "/clients/tsokos.png", tile: "grey" },
  { name: "Forest Hill Vineyard", src: "/clients/forest-hill.png" },
  { name: "Raine & Horne Commercial", src: "/clients/raine-horne.png", tile: "grey" },
  { name: "Margaret River Vintners", src: "/clients/margaret-river-vintners.png" },
  { name: "HOME BASE", src: "/clients/home-base.png" },
  { name: "Cherubino wines", src: "/clients/cherubino.png" },
] as const;

function LogoCard({
  name,
  src,
  tile = "light",
  decorative = false,
}: {
  name: string;
  src: string;
  tile?: "light" | "grey";
  decorative?: boolean;
}) {
  return (
    <div
      className={`flex h-24 w-44 shrink-0 items-center justify-center rounded-xl px-3 ring-1 ${
        tile === "grey"
          ? "bg-[#6d7580] ring-white/10"
          : "bg-[#f4f6f8] ring-black/5"
      }`}
    >
      <Image
        src={src}
        alt={decorative ? "" : name}
        width={160}
        height={72}
        className="max-h-16 w-auto max-w-full object-contain"
      />
    </div>
  );
}

function LogoRow({
  logos,
  duplicate = false,
}: {
  logos: readonly { name: string; src: string; tile?: "light" | "grey" }[];
  duplicate?: boolean;
}) {
  return (
    <div
      className={duplicate ? "client-marquee-dup flex gap-3 pr-3" : "flex gap-3 pr-3"}
      aria-hidden={duplicate || undefined}
    >
      {logos.map((c) => (
        <LogoCard key={`${c.src}${duplicate ? "-dup" : ""}`} {...c} decorative={duplicate} />
      ))}
    </div>
  );
}

export default function Clients({ gallery }: { gallery: GalleryState }) {
  const assigned = imagesForSlot(gallery, "clients");
  const logos =
    assigned.length > 0
      ? assigned.map((img) => ({
          name: img.alt,
          src: img.url,
          tile: CLIENT_GREY_TILES.has(img.url) ? ("grey" as const) : ("light" as const),
        }))
      : clients;
  return (
    <section className="py-16 bg-[#060c1a] border-t border-white/5 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 mb-10 text-center">
        <p className="text-blue-400 text-sm font-semibold uppercase tracking-widest mb-3">
          Trusted clients
        </p>
        <h2 className="text-3xl md:text-4xl font-bold text-white">Our valued clients</h2>
      </div>
      <div className="client-marquee">
        <div className="client-marquee-track">
          <LogoRow logos={logos} />
          <LogoRow logos={logos} duplicate />
        </div>
      </div>
    </section>
  );
}
