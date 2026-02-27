# CredComp — Implementation Tracker

## Phase 1: Foundation & MVP
- [ ] Project scaffolding (Next.js 15, App Router, TS, Tailwind v4)
- [ ] TypeScript types (card.ts, issuer.ts, category.ts, compare.ts)
- [ ] Seed data — 8-10 popular Indian credit cards as JSON
- [ ] Data access layer (src/lib/cards.ts)
- [ ] Utility functions (src/lib/utils.ts, constants.ts)
- [ ] UI primitives (Badge, Button, Table, StarRating, SearchInput)
- [ ] Layout components (Header, Footer, Breadcrumbs, MobileNav)
- [ ] Home page — hero, category links, top picks
- [ ] Cards listing page — /cards with CardTile grid
- [ ] Card detail page — /cards/[slug]
- [ ] Category pages — /categories/[category]
- [ ] Issuer pages — /issuers/[bank]

## Phase 2: Interactivity & Comparison
- [ ] Card filters (client component, URL state sync)
- [ ] Card search (autocomplete, fuzzy matching)
- [ ] Comparison tool (/compare?cards=x,y,z)
- [ ] Comparison logic (src/lib/compare.ts)
- [ ] Point calculator
- [ ] MDX integration for card reviews
- [ ] "Compare with" quick action on detail pages

## Phase 3: SEO & AI Compatibility
- [ ] JSON-LD schemas (Product, FAQ, BreadcrumbList, etc.)
- [ ] generateMetadata per page
- [ ] Sitemap & robots
- [ ] llms.txt
- [ ] Semantic HTML audit
- [ ] Internal linking

## Phase 4: Polish & Performance
- [ ] Image optimization
- [ ] Responsive design polish
- [ ] Accessibility audit
- [ ] Error handling (404, invalid slugs)
- [ ] Final QA & Lighthouse

## Review
_(to be filled after implementation)_
