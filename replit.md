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
- **Database:** PostgreSQL via Drizzle ORM
- **Schema Location:** `shared/schema.ts`
- **Migrations:** Drizzle Kit (`drizzle-kit push`)
- **Connection:** Uses `DATABASE_URL` environment variable

**Current Schema:**
- `contact_requests` table: stores lead submissions with HubSpot sync tracking

### Authentication & Authorization
- No user authentication implemented
- Public-facing lead generation site
- API endpoints are open (rate limiting recommended for production)

### Third-Party Integrations
- **HubSpot CRM:** Contact form submissions create CRM contacts via HubSpot API (`HUBSPOT_ACCESS_TOKEN` env var)
- **Fonts:** Google Fonts (Inter, Manrope)

## External Dependencies

### Required Environment Variables
- `DATABASE_URL` - PostgreSQL connection string (required)
- `HUBSPOT_ACCESS_TOKEN` - HubSpot API token for CRM integration (optional, graceful fallback)

### Key NPM Dependencies
- `drizzle-orm` + `drizzle-zod` - Database ORM with Zod schema generation
- `@tanstack/react-query` - Server state management
- `wouter` - Client-side routing
- `framer-motion` - Animations
- `zod` - Runtime validation
- `express` - HTTP server
- Radix UI primitives - Accessible UI components

### Build & Development
- `vite` - Frontend bundler
- `tsx` - TypeScript execution for development
- `esbuild` - Production server bundling
- `tailwindcss` - Utility-first CSS

### Database
- PostgreSQL (configured via Drizzle, connection via `postgres` package)
- Schema managed in `shared/schema.ts`, pushed via `npm run db:push`