# telescopetest.io

This is the website for users to upload and view telescope ZIP results. This is built with Astro web framework and hosted on Cloudflare Workers.

## Work Log

- Rebuilt a default astro workers project and moved all my edits into there. Ran with `npm create cloudflare@latest -- telescopetest-io --framework=astro`: https://developers.cloudflare.com/workers/framework-guides/web-apps/astro/#deploy-a-new-astro-project-on-workers
- Added custom domain (astro.telescopetest.io) on Cloudflare Workers UI.
- IMPORTANT: had to disable null rule on telescopetest.io domain to have css render properly

- To create a d1 db, I ran `npx wrangler@latest d1 create [db-name]`: https://developers.cloudflare.com/d1/get-started/.
- Then connected it to a db/schema.sql I made: `npx wrangler d1 execute [db-name] --local --file=./db/schema.sql`. Got some error about FileHandle error 22. This created a local db. I had to fix the error by updating my local wrangler version to the most recent.

- To create a r2 bucket, I ran `npx wrangler r2 bucket create [bucket-name]`: https://developers.cloudflare.com/r2/get-started/workers-api/.

## Directory Structure

```
telescopetest-io/
├── package.json          # Astro + Cloudflare adapter dependencies
├── astro.config.mjs      # Astro config with Cloudflare adapter
├── wrangler.jsonc        # Workers config: binds worker/index.ts to Astro dist/
├── src/
│   └── pages/
│       └── index.astro   # Homepage
└── public/               # Static assets
```

## Testing

- Unit testing will be done with vitest, which should integrate well with this project.
- Testing deployment can be done with a staging env. Run `npm run stage`.

## Deployment

This website shold only be deployed on Cloudflare workers on successful PR into @cloudflare/telescope. To run this deployment automatically, we have a GitHub workflow `.github/workflows/deploy.yml`:

1. Checkout code
2. Install Node.js 20
3. `npm ci` in `telescopetest-io/`
4. `npm run build` (generates `dist/`)
5. `npx wrangler deploy --env production` (uploads worker + dist to Cloudflare)

Once successful, the deployed site can be found on telescopetest.io.
