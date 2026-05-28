"use client";
import { useState, useEffect } from "react";
import { Menu, X, Phone } from "lucide-react";
import Image from "next/image";

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#0a0f1e]/95 backdrop-blur-md shadow-lg shadow-blue-950/20"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <a href="#home" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center group-hover:border-blue-400/50 transition-colors overflow-hidden">
            <Image
              src="https://glacierair.com.au/wp-content/uploads/2022/09/LOGO-white-transparent-glacierair.png"
              alt="Glacier Air Logo"
              width={36}
              height={36}
              className="object-contain"
              unoptimized
            />
          </div>
          <span className="font-semibold text-white text-lg tracking-tight">
            Glacier<span className="text-blue-400">Air</span>
          </span>
        </a>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="text-sm text-slate-300 hover:text-white transition-colors font-medium"
            >
              {l.label}
            </a>
          ))}
        </div>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-4">
          <a
            href="tel:0892423111"
            className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 font-medium"
          >
            <Phone className="w-4 h-4" />
            (08) 9242 3111
          </a>
          <a
            href="#contact"
            className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-400 text-white text-sm font-semibold transition-colors"
          >
            Get a Quote
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-white"
          onClick={() => setOpen(!open)}
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-[#0d1428] border-t border-white/5 px-6 py-4 flex flex-col gap-4">
          {navLinks.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="text-slate-300 hover:text-white font-medium"
              onClick={() => setOpen(false)}
            >
              {l.label}
            </a>
          ))}
          <a
            href="tel:0892423111"
            className="text-blue-400 font-medium flex items-center gap-2"
          >
            <Phone className="w-4 h-4" /> (08) 9242 3111
          </a>
          <a
            href="#contact"
            className="px-4 py-2 rounded-lg bg-blue-500 text-white text-center font-semibold"
            onClick={() => setOpen(false)}
          >
            Get a Quote
          </a>
        </div>
      )}
    </nav>
  );
}
