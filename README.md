# AURA Store

This repository is an npm-workspace monorepo orchestrated with Turborepo:

- `fashion-store-frontend` — Angular storefront
- `fashion-store-backend` — Express API

## Local development

Use Node.js 22.12 or newer and npm 11.6.2:

```bash
npm install
npm run dev
```

The Angular app runs at `http://localhost:4200`; the API runs at
`http://localhost:5001` when using the provided backend environment example. Create
`fashion-store-backend/.env` from `.env.example` and provide the required database,
Auth0, and Cloudinary values before starting the backend.

Build both workspaces with `npm run build`. Turborepo caches each workspace's
`dist` output. Backend seed commands are available as `npm run seed` and
`npm run seed:reset`.

## Deploy as one Vercel project

The root `vercel.json` configures one Vercel project with two services. The
Angular storefront is public at `/`, and Vercel routes `/api/*` to the Express
backend. The frontend uses `/api/v1` in production, so both services share the
same domain. No service binding is needed: the Angular app runs in the browser
and calls the public `/api/*` route, rather than making a server-to-server call.

1. Push this repository to GitHub.
2. Import the repository into Vercel as a **single project** and leave **Root
   Directory** set to `.` (the repository root). Vercel should detect the two
   services from `vercel.json`; do not import either workspace as a separate
   project.
3. Set the Vercel project Node.js version to 22.12 or newer.
4. Add the backend environment variables from
   `fashion-store-backend/.env.example` in Vercel's Production environment. At
   minimum, configure `MONGODB_URI`, `AUTH0_DOMAIN`, `AUTH0_AUDIENCE`,
   `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET`.
5. Configure the deployed Vercel domain in Auth0's Allowed Callback URLs, Allowed
   Web Origins, and Allowed Logout URLs.
6. Deploy. Preview and Production deployments are built from this same monorepo
   root and served as one project.

For local development, the production frontend uses `/api/v1` on its current
origin, while the development environment continues to target the local backend.
Run `npm run dev` to start both workspaces with Turborepo.
