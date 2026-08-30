"use client";
import { useState, useEffect } from "react";
import { Menu, X, Phone } from "lucide-react";
import Image from "next/image";

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about-us" },
  { label: "Services", href: "#services" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact-us" },
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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[#0a0f1e]/90 backdrop-blur-xl shadow-lg shadow-blue-950/30 border-b border-white/5"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <a href="#home" className="flex items-center gap-3 group">
          <Image
            src="/glacier-air-logo.png"
            alt="Glacier Air"
            width={160}
            height={32}
            className="object-contain h-8 w-auto transition-opacity group-hover:opacity-90"
          />
        </a>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="nav-link text-sm text-slate-300 hover:text-white transition-colors duration-200 font-medium py-1"
            >
              {l.label}
            </a>
          ))}
        </div>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-4">
          <a
            href="tel:0892423111"
            className="flex items-center gap-2 text-sm text-slate-200 hover:text-white font-medium transition-colors rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E01F26]/80 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0f1e]"
          >
            <Phone className="w-4 h-4 text-[#E01F26]" />
            (08) 9242 3111
          </a>
          <a
            href="#contact-us"
            className="px-5 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-400 text-white text-sm font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25 hover:-translate-y-0.5"
          >
            Get a Quote
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-white p-1 rounded-lg hover:bg-white/5 transition-colors"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="bg-[#0d1428]/95 backdrop-blur-xl border-t border-white/5 px-6 py-4 flex flex-col gap-4">
          {navLinks.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="text-slate-300 hover:text-white font-medium transition-colors py-1"
              onClick={() => setOpen(false)}
            >
              {l.label}
            </a>
          ))}
          <div className="h-px bg-white/5 my-1" />
          <a
            href="tel:0892423111"
            className="text-slate-200 font-medium flex items-center gap-2"
          >
            <Phone className="w-4 h-4 text-[#E01F26]" /> (08) 9242 3111
          </a>
          <a
            href="#contact-us"
            className="px-4 py-3 rounded-xl bg-blue-500 text-white text-center font-semibold hover:bg-blue-400 transition-colors"
            onClick={() => setOpen(false)}
          >
            Get a Quote
          </a>
        </div>
      </div>
    </nav>
  );
}
