"use client";
import { useEffect, useId, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, Phone, X } from "lucide-react";
import Image from "next/image";

const HOME_SURFACES = new Set(["/", "/about-us", "/services", "/projects"]);

type ServiceItem = { label: string; href: string };

function serviceItems(sectionHref: (hash: string) => string): ServiceItem[] {
  return [
    { label: "Air Conditioning", href: sectionHref("#air-conditioning") },
    { label: "Refrigeration", href: sectionHref("#refrigeration") },
    { label: "Mechanical Services", href: sectionHref("#mechanical-services") },
    { label: "Equipment Hire", href: "/hire" },
  ];
}

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const onHomeSurface = HOME_SURFACES.has(pathname);
  const sectionHref = (hash: string) => (onHomeSurface ? hash : `/${hash}`);
  const services = serviceItems(sectionHref);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeMenu = () => {
    setOpen(false);
    setServicesOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[#0a0f1e]/90 backdrop-blur-xl shadow-lg shadow-blue-950/30 border-b border-white/5"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <a href={sectionHref("#home")} className="flex items-center gap-3 group">
          <Image
            src="/glacier-air-logo.png"
            alt="Glacier Air"
            width={160}
            height={32}
            className="object-contain h-8 w-auto transition-opacity group-hover:opacity-90"
          />
        </a>

        <div className="hidden md:flex items-center gap-8">
          <a
            href={sectionHref("#home")}
            className="nav-link text-sm text-slate-300 hover:text-white transition-colors duration-200 font-medium py-1"
          >
            Home
          </a>
          <a
            href={sectionHref("#about-us")}
            className="nav-link text-sm text-slate-300 hover:text-white transition-colors duration-200 font-medium py-1"
          >
            About
          </a>
          <ServicesDropdown href={sectionHref("#services")} items={services} />
          <a
            href={sectionHref("#projects")}
            className="nav-link text-sm text-slate-300 hover:text-white transition-colors duration-200 font-medium py-1"
          >
            Projects
          </a>
          <a
            href={sectionHref("#contact-us")}
            className="nav-link text-sm text-slate-300 hover:text-white transition-colors duration-200 font-medium py-1"
          >
            Contact
          </a>
        </div>

        <div className="hidden md:flex items-center gap-4">
          <a
            href="tel:0892423111"
            className="flex items-center gap-2 text-sm text-slate-200 hover:text-white font-medium transition-colors rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E01F26]/80 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0f1e]"
          >
            <Phone className="w-4 h-4 text-[#E01F26]" />
            (08) 9242 3111
          </a>
          <a
            href={sectionHref("#contact-us")}
            className="px-5 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-400 text-white text-sm font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25 hover:-translate-y-0.5"
          >
            Make Enquiry
          </a>
        </div>

        <button
          className="md:hidden text-white p-1 rounded-lg hover:bg-white/5 transition-colors"
          onClick={() => {
            setOpen((current) => !current);
            setServicesOpen(false);
          }}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          open ? "max-h-[min(32rem,80vh)] opacity-100 overflow-y-auto" : "max-h-0 opacity-0"
        }`}
      >
        <div className="bg-[#0d1428]/95 backdrop-blur-xl border-t border-white/5 px-6 py-4 flex flex-col gap-3">
          <a
            href={sectionHref("#home")}
            className="text-slate-300 hover:text-white font-medium transition-colors py-1"
            onClick={closeMenu}
          >
            Home
          </a>
          <a
            href={sectionHref("#about-us")}
            className="text-slate-300 hover:text-white font-medium transition-colors py-1"
            onClick={closeMenu}
          >
            About
          </a>
          <div>
            <div className="flex items-center gap-2">
              <a
                href={sectionHref("#services")}
                className="flex-1 text-slate-300 hover:text-white font-medium transition-colors py-1"
                onClick={closeMenu}
              >
                Services
              </a>
              <button
                type="button"
                className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
                aria-expanded={servicesOpen}
                aria-label={`${servicesOpen ? "Collapse" : "Expand"} Services menu`}
                onClick={() => setServicesOpen((current) => !current)}
              >
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    servicesOpen ? "rotate-180 text-[#E01F26]" : ""
                  }`}
                  aria-hidden
                />
              </button>
            </div>
            {servicesOpen && (
              <ul className="mt-1 mb-1 ml-3 border-l border-white/10 pl-3 space-y-1">
                {services.map((item) => (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      className="block py-2 text-sm text-slate-400 hover:text-white transition-colors"
                      onClick={closeMenu}
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <a
            href={sectionHref("#projects")}
            className="text-slate-300 hover:text-white font-medium transition-colors py-1"
            onClick={closeMenu}
          >
            Projects
          </a>
          <a
            href={sectionHref("#contact-us")}
            className="text-slate-300 hover:text-white font-medium transition-colors py-1"
            onClick={closeMenu}
          >
            Contact
          </a>
          <div className="h-px bg-white/5 my-1" />
          <a href="tel:0892423111" className="text-slate-200 font-medium flex items-center gap-2">
            <Phone className="w-4 h-4 text-[#E01F26]" /> (08) 9242 3111
          </a>
          <a
            href={sectionHref("#contact-us")}
            className="px-4 py-3 rounded-xl bg-blue-500 text-white text-center font-semibold hover:bg-blue-400 transition-colors"
            onClick={closeMenu}
          >
            Make Enquiry
          </a>
        </div>
      </div>
    </nav>
  );
}

function ServicesDropdown({ href, items }: { href: string; items: ServiceItem[] }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<number | null>(null);
  const menuId = useId();

  const clearClose = () => {
    if (closeTimer.current != null) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  const scheduleClose = () => {
    clearClose();
    closeTimer.current = window.setTimeout(() => setOpen(false), 140);
  };

  useEffect(() => () => clearClose(), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div
      ref={wrapRef}
      className="relative"
      onMouseEnter={() => {
        clearClose();
        setOpen(true);
      }}
      onMouseLeave={scheduleClose}
      onFocus={() => {
        clearClose();
        setOpen(true);
      }}
      onBlur={(event) => {
        if (!wrapRef.current?.contains(event.relatedTarget as Node | null)) {
          setOpen(false);
        }
      }}
    >
      <a
        href={href}
        className="nav-link inline-flex items-center gap-1 text-sm text-slate-300 hover:text-white transition-colors duration-200 font-medium py-1"
        aria-expanded={open}
        aria-haspopup="true"
        aria-controls={menuId}
        onClick={() => setOpen(false)}
      >
        Services
        <ChevronDown
          className={`w-3.5 h-3.5 shrink-0 text-slate-400 transition-transform duration-200 ${
            open ? "rotate-180 text-[#E01F26]" : ""
          }`}
          aria-hidden
        />
      </a>
      <div
        id={menuId}
        hidden={!open}
        className={`absolute left-1/2 -translate-x-1/2 top-full z-10 pt-3 ${
          open ? "" : "pointer-events-none"
        }`}
      >
        <ul className="min-w-[16rem] rounded-xl border border-white/10 bg-[#0d1428]/95 backdrop-blur-xl py-2 shadow-xl shadow-black/40">
          {items.map((item) => (
            <li key={item.label}>
              <a
                href={item.href}
                className="block px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-white/[0.06] border-l-2 border-transparent hover:border-[#E01F26] focus-visible:outline-none focus-visible:text-white focus-visible:bg-white/[0.06] focus-visible:border-[#E01F26] transition-colors"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
