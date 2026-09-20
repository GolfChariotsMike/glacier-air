"use client";

import type { HTMLAttributes, ReactNode } from "react";
import { useRevealOnScroll } from "@/hooks/useRevealOnScroll";

export default function RevealRoot({
  children,
  ...props
}: HTMLAttributes<HTMLElement> & { children: ReactNode }) {
  const ref = useRevealOnScroll<HTMLElement>();
  return (
    <section ref={ref} {...props}>
      {children}
    </section>
  );
}
