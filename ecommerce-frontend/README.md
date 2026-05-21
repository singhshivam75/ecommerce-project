# Ecommerce Frontend

Customer-facing storefront for the ecommerce monorepo. Built with Next.js, this app handles product browsing, cart management, orders, and user interactions.

Project
- Purpose: Serve the public storefront and interact with the backend API for product data, cart, and orders.
- Responsibilities: rendering product pages, client-side cart, wishlist, checkout flows, and authentication UI.
- Data flow: UI -> API client -> backend API (see `NEXT_PUBLIC_API_URL` environment variable).

Tech stack
- Next.js (App Router)
- React 19, TypeScript
- TailwindCSS
- Axios for HTTP (`src/lib/api.ts`).

Key folders
- `src/app`: Next.js routes and pages.
- `src/components`: UI components (cart, product, layout).
- `src/lib`: API client and helpers. See [ecommerce-frontend/src/lib/api.ts](ecommerce-frontend/src/lib/api.ts#L1).

Prerequisites
- Node.js (v18+ recommended)
- npm or pnpm

Install

```powershell
npm install
```

Run (development)

```powershell
npm run dev
```

Build & Start (production)

```powershell
npm run build
npm run start
```

Environment variables
- `NEXT_PUBLIC_API_URL`: base URL for the backend API (e.g., `http://localhost:3000`).
- Add other variables as needed in a `.env` file at the project root.

Notes & pointers
- The backend API lives in [ecommerce-backend](ecommerce-backend/README.md).
- Admin dashboard is in [ecommerce-admin-dashboard](ecommerce-admin-dashboard/README.md).
- For debugging API requests, check `src/lib/axios.ts` and `src/lib/api.ts`.
