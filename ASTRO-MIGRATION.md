# Astro Migration – meine-waermepumpe.at

## Überblick

Migration der Landing Page von **React 19 SPA (Vite)** zu **Astro SSG + React Islands**.
Das Express-Backend bleibt unverändert.

## Warum Astro?

| Problem (SPA) | Lösung (Astro) |
|---|---|
| Google sieht leere HTML-Seite | Fertiges HTML, sofort indexierbar |
| Immer gleiche OG-Tags beim Teilen | Individuelle Meta-Tags pro Seite |
| ~300-500 KB JS auf jeder Seite | 0 KB JS auf statischen Seiten |
| Kein `<link rel="canonical">` | Canonical + hreflang pro Seite |
| Langsamer First Contentful Paint | < 0.5s durch vorgerendertes HTML |

## Projektstruktur

```
src/
├── layouts/
│   └── BaseLayout.astro          # SEO Meta-Tags, Header, Footer, Cookie-Banner
├── components/
│   ├── react/
│   │   └── EfficiencyCheck.tsx   # React Island (Startseite Hero-Rechner)
│   └── ui/                       # shadcn/ui Komponenten (für React Islands)
├── pages/
│   ├── index.astro               # Startseite (Astro + React Island)
│   ├── pakete.astro              # Paketpreise (pure Astro)
│   ├── waermepumpen.astro        # Produktvergleich (pure Astro)
│   ├── waermepumpe/
│   │   ├── 4kw.astro             # Produktdetail + JSON-LD Schema
│   │   ├── 6kw.astro
│   │   └── 10kw.astro
│   ├── chofu.astro               # Markenseite (pure Astro)
│   ├── kontakt.astro             # Kontaktformular (Shell für React Island)
│   ├── rechner.astro             # Heizkostenrechner (Shell für React Island)
│   ├── fachpartner.astro         # Partnerliste (Shell für React Island)
│   ├── partner/[slug].astro      # Partnerprofil (SSR)
│   ├── impressum.astro
│   ├── datenschutz.astro
│   ├── agb.astro
│   ├── 404.astro
│   └── admin/
│       ├── login.astro
│       └── partners.astro
├── lib/                          # Shared Utilities (1:1 aus client/)
├── hooks/                        # React Hooks (für Islands)
├── styles/
│   └── global.css                # Tailwind + @font-face (self-hosted)
├── fonts/                        # Inter + Manrope WOFF2 (DSGVO-konform)
└── content/
    └── brand/chofu.de.json       # CMS-artige Inhalte
```

## Seitentypen

### Pure Astro (0 KB JavaScript)
Impressum, Datenschutz, AGB, 404, Pakete, Wärmepumpen-Übersicht,
Produkt-Detailseiten (4/6/10 kW), CHOFU-Markenseite

### Astro + React Island
- **Startseite**: Effizienz-Check Rechner als `client:visible` Island
- **Kontakt**: Formular mit react-hook-form + Turnstile (Shell vorbereitet)
- **Rechner**: 4-Schritt Heizkostenrechner (Shell vorbereitet)
- **Fachpartner**: Filter + dynamische Partnerliste (Shell vorbereitet)

### SSR (Server-Side Rendered)
- **Partner-Profil** (`/partner/[slug]`): Dynamische Route

## Hydration-Strategien

```astro
<!-- Lädt wenn sichtbar (Startseite Rechner) -->
<EfficiencyCheck client:visible />

<!-- Lädt sofort (Formulare) -->
<ContactForm client:load />

<!-- Lädt im Idle (Cookie-Banner) -->
<CookieBanner client:idle />
```

## DSGVO-Fixes (bereits umgesetzt)

- [x] Google Fonts self-hosted (Inter + Manrope als WOFF2)
- [x] Cookie-Banner mit localStorage-Persistierung
- [x] robots.txt + sitemap.xml
- [x] OG-Image korrigiert
- [x] hreflang="de-AT" Tag
- [x] Canonical URL pro Seite

## Build & Deployment

```bash
# Entwicklung
npm run dev:client     # Astro Dev Server (Port 4321)
npm run dev            # Express Backend (Port 5000)

# Build
npm run build          # Astro Frontend + esbuild Backend → dist/

# Produktion
npm run start          # Express serviert Astro-Output aus dist/public/
```

## Konfiguration

- `astro.config.mjs` – Astro mit React, Sitemap, Node-Adapter, Tailwind v4
- `script/build.ts` – Astro build + esbuild für Express-Server

## Offene Punkte

- [ ] React Islands für Kontaktformular, Rechner, Partner-Filter einbinden
- [ ] Admin-Bereich React Islands einbinden
- [ ] `npx astro build` testen und Fehler beheben
- [ ] Altes `client/` Verzeichnis entfernen nach erfolgreichem Test
- [ ] Lighthouse-Audit auf allen Seiten
