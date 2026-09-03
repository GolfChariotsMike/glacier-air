export function JsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "HVACBusiness",
    name: "Glacier Air",
    url: "https://glacierair.com.au",
    telephone: "+61 8 9242 3111",
    email: "service@glacierair.com.au",
    image: "https://glacierair.com.au/glacier-air-logo.png",
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
