import type { Metadata } from "next";
import { Inter } from "next/font/google";
import ScrollToSection from "@/components/ScrollToSection";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL("https://glacierair.com.au"),
  title: "Glacier Air | Air Conditioning & Refrigeration | Perth, WA",
  description:
    "Family-owned air conditioning, refrigeration and mechanical services in Perth, SouthWest and Great Southern WA. Design, install, maintain. Call (08) 9242 3111.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Glacier Air | Air Conditioning & Refrigeration",
    description: "Family-owned experts in AC and refrigeration across Perth and WA.",
    url: "https://glacierair.com.au",
    siteName: "Glacier Air",
    locale: "en_AU",
    type: "website",
    images: [
      {
        url: "/og.jpg",
        width: 1200,
        height: 630,
        alt: "Glacier Air — air conditioning and refrigeration across Western Australia",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Glacier Air | Air Conditioning & Refrigeration",
    description: "Family-owned experts in AC and refrigeration across Perth and WA.",
    images: ["/og.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-AU">
      <body className={inter.className}>
        <ScrollToSection />
        {children}
      </body>
    </html>
  );
}
