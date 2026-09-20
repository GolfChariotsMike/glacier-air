import { SITE_ORIGIN, absoluteUrl } from "@/lib/site";

export function JsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "HVACBusiness",
    name: "Glacier Air",
    url: SITE_ORIGIN,
    telephone: "+61 8 9242 3111",
    email: "service@glacierair.com.au",
    image: absoluteUrl("/glacier-air-logo.png"),
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: "U10/28 Frobisher St",
      addressLocality: "Osborne Park",
      addressRegion: "WA",
      postalCode: "6017",
      addressCountry: "AU",
    },
    areaServed: [
      { "@type": "City", name: "Perth" },
      { "@type": "AdministrativeArea", name: "South West" },
      { "@type": "AdministrativeArea", name: "Great Southern" },
      { "@type": "State", name: "Western Australia" },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function HireJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Air conditioning and chiller hire",
    url: absoluteUrl("/hire"),
    image: absoluteUrl("/glacier-air-logo.png"),
    description:
      "Hire air conditioning and chillers from Glacier Air across Perth and regional WA.",
    provider: {
      "@type": "HVACBusiness",
      name: "Glacier Air",
      url: SITE_ORIGIN,
      telephone: "+61 8 9242 3111",
    },
    areaServed: [
      { "@type": "City", name: "Perth" },
      { "@type": "AdministrativeArea", name: "South West" },
      { "@type": "AdministrativeArea", name: "Great Southern" },
      { "@type": "State", name: "Western Australia" },
    ],
    serviceType: "Equipment hire",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
