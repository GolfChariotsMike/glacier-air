import Image from "next/image";

const links = {
  Services: ["Air Conditioning", "Refrigeration", "Mechanical Services", "Maintenance"],
  Company: ["About Us", "Projects", "Contact"],
};

export default function Footer() {
  return (
    <footer className="bg-[#050a18] border-t border-white/5 py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <Image
                src="/glacier-air-logo.png"
                alt="Glacier Air"
                width={160}
                height={32}
                className="object-contain h-8 w-auto"
              />
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs mb-4">
              Family-owned air conditioning, refrigeration and mechanical
              services across Perth, SouthWest and Great Southern WA.
            </p>
            <p className="text-slate-500 text-xs">
              ARC Licence AU18839 · AIRAH Member · HIA Member
            </p>
          </div>

          {Object.entries(links).map(([cat, items]) => (
            <div key={cat}>
              <p className="text-white font-semibold text-sm mb-4">{cat}</p>
              <ul className="space-y-2">
                {items.map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-slate-400 hover:text-white text-sm transition-colors"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} Glacier Air. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm">
            <a href="tel:0892423111" className="text-slate-400 hover:text-white transition-colors">
              (08) 9242 3111
            </a>
            <a
              href="mailto:service@glacierair.com.au"
              className="text-slate-400 hover:text-white transition-colors"
            >
              service@glacierair.com.au
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
