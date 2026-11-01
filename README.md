# Last Chad Standing

The website for Last Chad Standing, the first MMA battle royale: landing page, NFT store and bidding on Base, pre-orders, blog, docs and an admin panel.

## Tech stack

- React + TypeScript, built with Vite
- Tailwind CSS and shadcn/ui
- Supabase (Postgres, auth, storage, edge functions in `supabase/functions`)

## Getting started

```sh
git clone <this repo>
cd last-chad-standing
cp .env.example .env   # fill in your own keys
npm install
npm run dev
```

Edge functions read their secrets from the Supabase project's function secrets; see `.env.example` for the names the code expects.

## License

[MIT](./LICENSE)
