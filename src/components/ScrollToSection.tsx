"use client";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

/** Scroll to the URL hash after client navigations (e.g. /services#air-conditioning). */
export default function ScrollToSection() {
  const pathname = usePathname();

  useEffect(() => {
    const scrollToHash = () => {
      const hash = window.location.hash.replace(/^#/, "");
      if (!hash) return;
      document.getElementById(hash)?.scrollIntoView({ behavior: "smooth" });
    };

    const timer = window.setTimeout(scrollToHash, 80);
    window.addEventListener("hashchange", scrollToHash);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("hashchange", scrollToHash);
    };
  }, [pathname]);

  return null;
}
