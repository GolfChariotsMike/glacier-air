"use client";
import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { ChevronDown, Menu, Phone, X } from "lucide-react";
import Image from "next/image";
import { projectSectionId } from "@/lib/gallery";

export type NavbarProject = {
  id: string;
  publicTitle: string;
};

type NavItem = {
  label: string;
  href: string;
};

const SERVICE_ITEMS: NavItem[] = [
  { label: "Air Conditioning", href: "#air-conditioning" },
  { label: "Refrigeration", href: "#refrigeration" },
  { label: "Mechanical Services", href: "#mechanical-services" },
  { label: "Panasonic Specialist Support", href: "#panasonic-specialist-support" },
];

function projectItems(projects: NavbarProject[]): NavItem[] {
  if (!projects.length) {
    return [{ label: "Recent projects", href: "#projects" }];
  }
  return projects.map((project) => ({
    label: project.publicTitle,
    href: `#${projectSectionId(project.id)}`,
  }));
}

function DesktopDropdown({ label, href, items }: { label: string; href: string; items: NavItem[] }) {
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

  const focusTrigger = () => {
    wrapRef.current?.querySelector<HTMLAnchorElement>("a[data-nav-trigger]")?.focus();
  };

  const itemLinks = () =>
    Array.from(wrapRef.current?.querySelectorAll<HTMLAnchorElement>("[data-nav-item]") ?? []);

  useEffect(() => () => clearClose(), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        focusTrigger();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const onTriggerKeyDown = (event: KeyboardEvent<HTMLAnchorElement>) => {
    if (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ") {
      if (event.key === "ArrowDown" || event.key === " ") event.preventDefault();
      if (event.key === " ") {
        event.preventDefault();
        setOpen((current) => !current);
        return;
      }
      setOpen(true);
      if (event.key === "ArrowDown") {
        requestAnimationFrame(() => itemLinks()[0]?.focus());
      }
    }
  };

  const onItemKeyDown = (event: KeyboardEvent<HTMLAnchorElement>, index: number) => {
    const links = itemLinks();
    if (event.key === "ArrowDown") {
      event.preventDefault();
      links[(index + 1) % links.length]?.focus();
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      if (index === 0) {
        focusTrigger();
      } else {
        links[index - 1]?.focus();
      }
    } else if (event.key === "Home") {
      event.preventDefault();
      links[0]?.focus();
    } else if (event.key === "End") {
      event.preventDefault();
      links[links.length - 1]?.focus();
    }
  };

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
        data-nav-trigger
        className="nav-link inline-flex items-center gap-1 text-sm text-slate-300 hover:text-white transition-colors duration-200 font-medium py-1"
        aria-expanded={open}
        aria-haspopup="true"
        aria-controls={menuId}
        onClick={() => setOpen(false)}
        onKeyDown={onTriggerKeyDown}
      >
        {label}
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
        <ul className="min-w-[17.5rem] rounded-xl border border-white/10 bg-[#0d1428]/95 backdrop-blur-xl py-2 shadow-xl shadow-black/40">
          {items.map((item, index) => (
            <li key={item.href}>
              <a
                href={item.href}
                data-nav-item
                className="block px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-white/[0.06] border-l-2 border-transparent hover:border-[#E01F26] focus-visible:outline-none focus-visible:text-white focus-visible:bg-white/[0.06] focus-visible:border-[#E01F26] transition-colors"
                onClick={() => setOpen(false)}
                onKeyDown={(event) => onItemKeyDown(event, index)}
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

function MobileAccordion({
  label,
  href,
  items,
  expanded,
  onToggle,
  onNavigate,
}: {
  label: string;
  href: string;
  items: NavItem[];
  expanded: boolean;
  onToggle: () => void;
  onNavigate: () => void;
}) {
  const panelId = useId();
  const buttonId = useId();

  return (
    <div>
      <div className="flex items-center gap-2">
        <a
          href={href}
          className="flex-1 text-slate-300 hover:text-white font-medium transition-colors py-1"
          onClick={onNavigate}
        >
          {label}
        </a>
        <button
          type="button"
          id={buttonId}
          className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
          aria-expanded={expanded}
          aria-controls={panelId}
          aria-label={`${expanded ? "Collapse" : "Expand"} ${label} menu`}
          onClick={onToggle}
        >
          <ChevronDown
            className={`w-4 h-4 transition-transform duration-200 ${
              expanded ? "rotate-180 text-[#E01F26]" : ""
            }`}
            aria-hidden
          />
        </button>
      </div>
      <ul
        id={panelId}
        hidden={!expanded}
        className={`mt-1 mb-1 ml-3 border-l border-white/10 pl-3 ${expanded ? "space-y-1" : ""}`}
      >
        {items.map((item) => (
          <li key={item.href}>
            <a
              href={item.href}
              className="block py-2 text-sm text-slate-400 hover:text-white transition-colors"
              onClick={onNavigate}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Navbar({ projects = [] }: { projects?: NavbarProject[] }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileSection, setMobileSection] = useState<"services" | "projects" | null>(null);
  const projectNavItems = projectItems(projects);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeMenu = () => {
    setOpen(false);
    setMobileSection(null);
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
        <a href="#home" className="flex items-center gap-3 group">
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
            href="#home"
            className="nav-link text-sm text-slate-300 hover:text-white transition-colors duration-200 font-medium py-1"
          >
            Home
          </a>
          <a
            href="#about-us"
            className="nav-link text-sm text-slate-300 hover:text-white transition-colors duration-200 font-medium py-1"
          >
            About
          </a>
          <DesktopDropdown label="Services" href="#services" items={SERVICE_ITEMS} />
          <DesktopDropdown label="Projects" href="#projects" items={projectNavItems} />
          <a
            href="#contact-us"
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
            href="#contact-us"
            className="px-5 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-400 text-white text-sm font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25 hover:-translate-y-0.5"
          >
            Make Enquiry
          </a>
        </div>

        <button
          className="md:hidden text-white p-1 rounded-lg hover:bg-white/5 transition-colors"
          onClick={() => {
            setOpen((current) => !current);
            setMobileSection(null);
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
            href="#home"
            className="text-slate-300 hover:text-white font-medium transition-colors py-1"
            onClick={closeMenu}
          >
            Home
          </a>
          <a
            href="#about-us"
            className="text-slate-300 hover:text-white font-medium transition-colors py-1"
            onClick={closeMenu}
          >
            About
          </a>
          <MobileAccordion
            label="Services"
            href="#services"
            items={SERVICE_ITEMS}
            expanded={mobileSection === "services"}
            onToggle={() => setMobileSection((current) => (current === "services" ? null : "services"))}
            onNavigate={closeMenu}
          />
          <MobileAccordion
            label="Projects"
            href="#projects"
            items={projectNavItems}
            expanded={mobileSection === "projects"}
            onToggle={() => setMobileSection((current) => (current === "projects" ? null : "projects"))}
            onNavigate={closeMenu}
          />
          <a
            href="#contact-us"
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
            href="#contact-us"
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
