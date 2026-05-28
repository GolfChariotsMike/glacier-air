import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Glacier Air | Air Conditioning & Refrigeration | Perth, WA",
  description:
    "Family-owned air conditioning, refrigeration and mechanical services in Perth, SouthWest and Great Southern WA. Design, install, maintain. Call (08) 9242 3111.",
  keywords: ["air conditioning Perth", "refrigeration Perth", "HVAC Perth WA", "winery refrigeration", "Glacier Air"],
  openGraph: {
    title: "Glacier Air | Air Conditioning & Refrigeration",
    description: "Family-owned experts in AC and refrigeration across Perth and WA.",
    url: "https://glacierair.com.au",
    siteName: "Glacier Air",
    locale: "en_AU",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
