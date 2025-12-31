
export const BUNDESLAENDER = [
  "Burgenland",
  "Kärnten",
  "Niederösterreich",
  "Oberösterreich",
  "Salzburg",
  "Steiermark",
  "Tirol",
  "Vorarlberg",
  "Wien"
];

export const SUBSIDIES = {
  base: 7500, // Wärmepumpe Luft/Wasser
  solar: 2500, // Solarbonus
  maxPercentage: 0.30 // Max 30% of costs
};

export const PACKAGES = [
  {
    id: "4kw",
    name: "4kW Einsteiger-Paket",
    price: 20000,
    kw: 4,
    description: "Perfekt für effiziente Neubauten und kleine Einfamilienhäuser.",
    details: "Chofu 4kW R290 Wärmepumpen-Komplettpaket.",
    suitability: ["Neubau", "Niedrigenergiehaus", "Bis ca. 120m²"],
    features: [
      "Chofu 4kW Monoblock Luft/Wasser WP",
      "Kältemittel R290 (Propan) - Volle Förderung!",
      "Inkl. Standard-Montage",
      "Inkl. Inbetriebnahme",
      "Smarte Steuerung via App"
    ]
  },
  {
    id: "6kw",
    name: "6kW Komfort-Paket",
    price: 22000,
    kw: 6,
    description: "Der Allrounder für durchschnittliche Einfamilienhäuser.",
    details: "Chofu 6kW R290 Wärmepumpen-Komplettpaket.",
    suitability: ["Sanierter Altbau", "Standard Einfamilienhaus", "Bis ca. 160m²"],
    features: [
      "Chofu 6kW Monoblock Luft/Wasser WP",
      "Kältemittel R290 (Propan) - Volle Förderung!",
      "Inkl. Standard-Montage",
      "Inkl. Inbetriebnahme",
      "Hohe Vorlauftemperaturen möglich"
    ],
    highlight: true
  },
  {
    id: "10kw",
    name: "10kW Performance-Paket",
    price: 23000,
    kw: 10,
    description: "Maximale Leistung für größere Gebäude oder Bestandsbauten.",
    details: "Leistungsstarkes 10kW Wärmepumpen-System (Mockup).",
    suitability: ["Bestandsgebäude", "Zweifamilienhaus", "Bis ca. 250m²"],
    features: [
      "Hochleistungs-Wärmepumpe 10kW",
      "Ideal für Heizkörper-Systeme",
      "Inkl. Standard-Montage",
      "Inkl. Inbetriebnahme",
      "Leiser Betrieb"
    ]
  }
];

export const PARTNERS = {
  "Burgenland": [
    { name: "EnergieTechnik Mayer", desc: "Ihr Experte im Seewinkel seit 2005." },
    { name: "Solar & Heat Burgenland", desc: "Spezialisiert auf Sanierungen." }
  ],
  "Kärnten": [
    { name: "AlpenKlima Klagenfurt", desc: "Wärmepumpen-Profis für den Süden." }
  ],
  "Niederösterreich": [
    { name: "NÖ Haustechnik GmbH", desc: "Großraum St. Pölten und Weinviertel." },
    { name: "Waldviertel Energie", desc: "Robuste Lösungen für kalte Winter." },
    { name: "Donau-Therm", desc: "Ihr Partner im Mostviertel." }
  ],
  "Oberösterreich": [
    { name: "OÖ Wärmepumpen Zentrum", desc: "Zentralraum Linz & Wels." },
    { name: "Innviertel Installateur", desc: "Handschlagqualität aus Ried." }
  ],
  "Salzburg": [
    { name: "Salzburg Energy", desc: "Nachhaltige Wärme für Stadt & Land." }
  ],
  "Steiermark": [
    { name: "Grüne Wärme Graz", desc: "Innovativ und zuverlässig." },
    { name: "Obersteiermark Haustechnik", desc: "Spezialisten für Bestandsbau." }
  ],
  "Tirol": [
    { name: "Tiroler Wärmepumpen Manufaktur", desc: "Heizen auch bei Minusgraden." }
  ],
  "Vorarlberg": [
    { name: "Ländle Energy", desc: "Effizienz aus dem Rheintal." }
  ],
  "Wien": [
    { name: "Wien Energie-Partner Ost", desc: "Schnelle Umsetzung im Stadtgebiet." },
    { name: "Urban Heat Vienna", desc: "Spezialisiert auf Reihenhäuser." }
  ]
};
