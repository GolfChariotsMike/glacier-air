"use client";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

const PATH_TO_ID: Record<string, string> = {
  "/about-us": "about-us",
  "/services": "services",
  "/projects": "projects",
};

export default function ScrollToSection() {
  const pathname = usePathname();

  useEffect(() => {
    const id = PATH_TO_ID[pathname];
    if (!id) return;
    const timer = window.setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }, 80);
    return () => window.clearTimeout(timer);
  }, [pathname]);

  return null;
}
