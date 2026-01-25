# replit.md

## Overview

This is a multi-page, conversion-optimized landing page system for CHOFU heat pump fixed-price packages targeting Austrian homeowners. The website serves as an information, qualification, and lead generation platform. The operator does not sell installation services directly—installations are handled by regional installation partners, and leads are forwarded to them.

**Core Purpose:**
- Showcase CHOFU heat pump packages (4kW, 6kW, 10kW)
- Build trust through brand storytelling (Japanese quality, Made in Japan)
- Generate qualified leads via contact forms integrated with HubSpot
- Provide heating cost calculators and efficiency tools
- Display funding/subsidy information for Austrian customers

**Target Audience:** Private homeowners (existing buildings & new construction) in Austria, early to mid-stage decision phase, without deep technical knowledge.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework:** React 18 with TypeScript
- **Build Tool:** Vite with custom plugins for Replit integration
- **Routing:** Wouter (lightweight client-side routing)
- **Styling:** Tailwind CSS v4 with CSS variables for theming
- **UI Components:** shadcn/ui (Radix primitives) with New York style variant
- **State Management:** TanStack Query for server state, React useState for local state
- **Animations:** Framer Motion for page transitions and micro-interactions
- **Icons:** Lucide React

**Key Design Decisions:**
- Mobile-first responsive design
- Component-based architecture with separation of UI components (`/components/ui/`) and feature components (`/components/brand/`, `/components/packages/`)
- Content externalized to JSON files (`/content/brand/`) for easy updates
- Path aliases configured: `@/` for client/src, `@shared/` for shared modules, `@assets/` for attached assets

### Backend Architecture
- **Runtime:** Node.js with Express
- **Language:** TypeScript (ESM modules)
- **API Style:** RESTful JSON API
- **Development:** tsx for hot-reloading, Vite dev server proxied through Express

**Key Routes:**
- `POST /api/contact` - Submit contact form (stores in DB, syncs to HubSpot)

### Data Storage
- **Database:** Supabase PostgreSQL (EU servers) via Drizzle ORM
- **Schema Location:** `shared/schema.ts`
- **Migrations:** Drizzle Kit (`npm run db:push`)
- **Connection:** Uses `DATABASE_URL` environment variable (Supabase connection string)
- **ORM:** Drizzle ORM with `postgres-js` driver

**Current Schema:**
- `contact_requests` table: stores lead submissions with HubSpot sync tracking
  - id (varchar, UUID primary key)
  - name, email, phone, bundesland (text fields)
  - message (text, optional)
  - createdAt (timestamp, auto-generated)
  - hubspotContactId (text, set after HubSpot sync)

- `partners` table: stores installation partner information
  - id (varchar, UUID primary key)
  - slug (varchar, unique, URL-friendly name)
  - name, description, bundesland (text, required)
  - website, logoUrl, phone (text, optional)
  - services (text array, optional)
  - createdAt (timestamp, auto-generated)

- `partner_references` table: stores reference photos for partners
  - id (varchar, UUID primary key)
  - partnerId (varchar, foreign key to partners, cascade delete)
  - imageUrl (text, required)
  - caption (text, optional)
  - sortOrder (integer, default 0)
  - createdAt (timestamp, auto-generated)

### Authentication & Authorization
- No user authentication implemented
- Public-facing lead generation site
- API endpoints are open (rate limiting recommended for production)

### Third-Party Integrations
- **Supabase:** PostgreSQL database hosted on EU servers for GDPR compliance
- **HubSpot CRM:** Contact form submissions create CRM contacts via official `@hubspot/api-client`
  - Uses Replit HubSpot connector for automatic OAuth token management
  - Creates contacts with properties: firstname, lastname, email, phone, state, hs_lead_status
  - Links HubSpot contact ID back to Supabase record
- **Fonts:** Google Fonts (Inter, Manrope)

## External Dependencies

### Required Environment Variables
- `DATABASE_URL` - Supabase PostgreSQL connection string (required)
- `SUPABASE_URL` - Supabase project URL (required)
- `SUPABASE_ANON_KEY` - Supabase anon/public API key (required)
- `ADMIN_EMAILS` - Comma-separated list of admin email addresses (required for admin access)
- HubSpot connection managed automatically via Replit connector (no manual token needed)

### Key NPM Dependencies
- `drizzle-orm` + `drizzle-zod` - Database ORM with Zod schema generation
- `postgres` - PostgreSQL driver for Drizzle (postgres-js)
- `@hubspot/api-client` - Official HubSpot CRM client
- `@tanstack/react-query` - Server state management
- `wouter` - Client-side routing
- `framer-motion` - Animations
- `zod` - Runtime validation
- `express` - HTTP server
- `react-hook-form` - Form state management
- Radix UI primitives - Accessible UI components

### Build & Development
- `vite` - Frontend bundler
- `tsx` - TypeScript execution for development
- `esbuild` - Production server bundling
- `tailwindcss` - Utility-first CSS
- `drizzle-kit` - Database migrations

### Database
- Supabase PostgreSQL (EU region for GDPR compliance)
- Connected via Drizzle ORM with `postgres-js` driver
- Schema managed in `shared/schema.ts`, pushed via `npm run db:push`

## Recent Changes (January 24, 2026)

### Partner Management System
- ✅ Database schema for partners and reference photos
- ✅ Supabase Storage integration for logos and reference photos
- ✅ Admin interface at `/admin/partners` for partner CRUD
- ✅ Public partner overview page at `/fachpartner`
- ✅ Individual partner profile pages at `/partner/:slug`
- ✅ Image upload for logos and reference photos
- ✅ Admin authentication with Supabase Magic Link

**Important:** Before using image uploads, create a Storage Bucket named `partner-assets` in Supabase Console and set it to public.

### Admin Authentication
- **Method:** Supabase Auth with Magic Link (passwordless email login)
- **Authorization:** Only emails listed in `ADMIN_EMAILS` environment variable can access admin APIs
- **Protected Routes:** 
  - Frontend: `/admin/partners` (redirects to `/admin/login` if not authenticated)
  - Backend: All `/api/admin/*` routes require Bearer token + admin email check
- **Auth Flow:**
  1. User visits `/admin/partners`
  2. If not logged in, redirected to `/admin/login`
  3. User enters email, receives magic link via email
  4. Clicking link authenticates user and redirects to admin panel
  5. Session stored in browser, token sent with API requests
  6. Server validates token AND checks email against ADMIN_EMAILS allowlist

**Admin Routes (protected with Bearer token):**
- `POST /api/admin/partners` - Create partner
- `PUT /api/admin/partners/:id` - Update partner
- `DELETE /api/admin/partners/:id` - Delete partner
- `POST /api/admin/partners/:id/logo` - Upload logo
- `POST /api/admin/partners/:id/references` - Upload reference photo
- `DELETE /api/admin/references/:id` - Delete reference photo

**Public Routes:**
- `GET /api/partners` - List all partners
- `GET /api/partners/bundesland/:bundesland` - Filter by state
- `GET /api/partners/:slug` - Get partner with references

### Full-Stack Implementation Completed
- ✅ Converted from frontend prototype to full-stack application
- ✅ Supabase PostgreSQL database integration (EU servers)
- ✅ Contact form backend API with validation
- ✅ HubSpot CRM integration for automatic lead capture
- ✅ End-to-end testing completed successfully

### Contact Form Flow
1. User fills form at `/kontakt`
2. Frontend validates with Zod schema
3. POST to `/api/contact` endpoint
4. Backend saves to Supabase `contact_requests` table
5. Backend creates HubSpot contact via official API client
6. HubSpot contact ID linked back to database record
7. Success response to frontend with toast notification

## Recent Changes (January 25, 2026)

### CHOFU Capacity Module (client/src/lib/chofuCapacity.ts)
- **Module** for CHOFU R290 heat pump capacity calculations
- Bilinear interpolation on capacity data grid (air temp -20 to 7°C, water temp 35-55°C)
- Model recommendation with **3-status logic**:
  - `ok`: Model capacity ≥ requiredW (with 5% safety factor) → suitable
  - `borderline`: Capacity ≥ nominalW but < requiredW → project review recommended
  - `exceeds_10kw_package`: Capacity < nominalW → 16kW model required
- Default designAirTemp = -2°C (typical cold, not extreme)
- Returns model ID, label, capacity, nominalW, requiredW, marginPct, message

### Effizienz-Check (home.tsx) - Suitability Check
- Uses **A-2 temperature** (typical cold conditions) for suitability assessment
- **Default values on load**: Neubau + 120 m² (shows result immediately)
- **3 building type tiles**: Altbau, Teilsaniert, Neubau
- Each type has internal parameters (hidden from user):
  - Altbau: 100 W/m², designWaterTemp=55°C
  - Teilsaniert: 70 W/m², designWaterTemp=45°C
  - Neubau: 40 W/m², designWaterTemp=35°C
- **3 result statuses with positive UI**:
  - Green "Geeignet": CHOFU package is suitable (checkmark icon)
  - Green "Empfohlen": Borderline - positive framing, optimization recommended (checkmark icon)
  - Blue "Mehr Leistung": 16kW model suggested (info icon)
- No A/W technical values displayed to end users
- No warning language or amber/orange styling for borderline cases
- Heat load calculation: heizlastKw = (area × specificHeatLoad) / 1000
- Range display: ±15% around calculated heat load
- **Result tiles**: Heizlast (range), Empfehlung (model), Gebäude (building type)
- **Removed "Auslegung" display** - designWaterTemp is internal only
- 16kW CTA appears when load exceeds 10kW package range

### Heizkostenrechner (calculator.tsx) - Major Fixes
- **Solar thermal fix**: Only reduces hot water portion (warmwasserAnteilPct, default 20%, range 10-35%)
- **Floor heating effect**: anteilFussboden reduces effective flow temperature and improves SCOP
- **"keine" heating system**: Forces area-based calculation, consumption input hidden
- **Auto-defaults**: Price and efficiency auto-update when switching heating systems (unless manually modified)
- **Investment display**: Net investment clamped to ≥0, amortization shows "k.A." when savings ≤0
- **Energy demand**: Derived from specificHeatLoad (100/70/50/40/30 W/m²) × 2000 heating hours
- **Updated building class descriptions**: ~200/140/100/80/60 kWh/m²·a to match derived values