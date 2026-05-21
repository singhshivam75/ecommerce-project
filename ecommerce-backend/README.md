# Ecommerce Backend

API backend for the ecommerce monorepo using NestJS and TypeORM.

Prerequisites
- Node.js (v18+ recommended)
- npm
- PostgreSQL (or configured DB via environment variables)

Install

```powershell
npm install
```

Run (development)

```powershell
npm run start:dev
```

Build & Run (production)

```powershell
npm run build
npm run start:prod
```

Notes
- Configure database and secrets via `.env` or your environment provider.
- Tests: `npm run test` (unit), `npm run test:e2e` (end-to-end).
