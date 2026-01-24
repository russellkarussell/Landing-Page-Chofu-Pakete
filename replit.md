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

**Important:** Before using image uploads, create a Storage Bucket named `partner-assets` in Supabase Console and set it to public.

**Admin Routes (currently unprotected):**
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