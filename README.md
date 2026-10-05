# FSBO Market

A **For Sale By Owner** real estate platform that combines Zillow-style property browsing with Expedia-style à la carte service shopping. Sellers list their own homes and purchase only the services they need (MLS listing, photography, legal review, marketing, etc.) — no agent commission required.

> Built as a frontend-only single-page application with realistic mock data. No backend; all state is in memory or `localStorage`.

---

## Features

**For buyers**
- Browse 14 mock listings across 14 US cities ($298K–$1.4M)
- Filter by price, beds, baths, property type, and state — all state synced to URL
- **Interactive map view** with price-pin markers; split-view (cards + map) on desktop, toggle on mobile
- Hover a card → highlights its pin; click a pin → scrolls the card into view
- Listing detail pages with photo gallery, specs, seller contact, and open-house info

**For sellers**
- Sign in / create account (mock auth, persisted to `localStorage`)
- Seller dashboard with listing stats and active services
- 5-step create-listing form with drag-and-drop photo upload
- User-created listings appear alongside mock data in Browse / Home / Detail pages

**Services marketplace**
- 25+ à la carte services across 6 categories (MLS, photography, legal, marketing, home prep, offers)
- Add to cart with sticky sidebar; cart persists across refreshes
- 9 mock service providers with profile pages

**Platform**
- Branded error page for route errors (dev mode shows stack trace)
- Mobile-first responsive layout with animated hamburger menu
- Back-navigation preserves filters, pagination, and scroll position

---

## Tech Stack

| | |
|---|---|
| **Framework** | React 18 + Vite 6 |
| **Routing** | react-router-dom v6 (`createBrowserRouter` + `errorElement`) |
| **Styling** | Tailwind CSS 3 (custom navy/amber palette) |
| **Icons** | lucide-react |
| **Maps** | react-leaflet 4 + Leaflet (OpenStreetMap tiles) |
| **State** | React Context (Cart, Seller) + `localStorage` persistence |
| **Data** | Static mock data in `src/data/` — no backend |

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm

### Install & run

```bash
npm install --legacy-peer-deps
npm run dev
```

The dev server starts at **http://localhost:5173** (or **http://localhost:3000** if configured via `.claude/launch.json`).

### Build for production

```bash
npm run build
npm run preview
```

### Demo credentials

```
Email:    marcus@example.com
Password: password
```

Or create a new account via the **Sign In → Create Account** modal.

---

## Project Structure

```
src/
├── data/           Mock listings, services, providers, reviews
├── context/        CartContext, SellerContext (localStorage-backed)
├── layouts/        RootLayout, DashboardLayout
├── pages/          One file per route (Home, BrowseListings, …, ErrorPage)
├── components/
│   ├── navigation/ Navbar, Footer, AuthModal
│   ├── listings/   ListingCard, ListingsMap, PriceMarker, MapListToggle
│   ├── services/   ServiceCard, CartSidebar
│   ├── dashboard/  DashboardStats, listing rows
│   └── forms/      5-step CreateListing wizard
└── utils/          formatters, filter logic
```

---

## Routes

| Path | Page |
|---|---|
| `/` | Home — hero, featured listings, how it works, stats |
| `/listings` | Browse — filter sidebar + list/map/split views |
| `/listings/:id` | Listing detail |
| `/services` | Services marketplace |
| `/providers/:id` | Service provider profile |
| `/how-it-works` | Explainer with seller/buyer tabs |
| `/pricing` | 3-tier packages + à la carte table |
| `/cart` | Checkout summary |
| `/dashboard` | Seller dashboard (requires sign-in) |
| `/dashboard/listings/new` | 5-step create listing form |

---

## Testing

Manual verification only — no automated test suite yet.

- `npm run build` performs a full type-check and production bundle
- `npm run dev` for interactive testing against the mock data

Automated tests (Vitest + React Testing Library) are tracked as a backlog item.

---

## Roadmap

Open issues on GitHub cover upcoming work: mortgage calculator, photo gallery lightbox, open-house RSVP, "Request a Showing" form, comparable sales section, payments/checkout epic, and a provider data-aggregation pipeline for the production directory.

---

## License

Private project — not currently open source.
