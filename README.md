# Investing Pal — MVP starter

An iPhone-first, installable web-app starter for educational investment research and paper trading.

## Current functionality
- Responsive iPhone-first dashboard and navigation
- Local starter watchlist with add/search
- $999 virtual cash practice account
- Simple virtual allocation ledger
- Research request interface with a fail-closed API route
- No live prices, generated financial facts, brokerage connection, or real trade execution

## Run locally
Requirements: Node.js 20.9+ and npm.

```bash
npm install
npm run dev
```

Open http://localhost:3000. To test on an iPhone on the same Wi-Fi, run `npm run dev -- --hostname 0.0.0.0` and open the computer's local network IP on Safari.

## Next setup steps
1. Create a private GitHub repository and push this project.
2. Deploy to Vercel.
3. Choose a market-data provider whose contract permits the intended public display and redistribution of data.
4. Add Supabase authentication and database tables with row-level security.
5. Add server-side market-data ingestion, timestamps, caching, provider attribution, and error handling.
6. Add OpenAI research generation using only validated, timestamped source data.
7. Add a proper transaction ledger with fractional units, fees, cash reconciliation, and historical prices before claiming performance returns.
8. Add privacy policy, terms, disclosures, security review, accessibility checks, and legal/regulatory review before public launch.

## Environment variables
Copy `.env.example` to `.env.local` for local development. Keep secrets server-side only. Do not use `NEXT_PUBLIC_` for secret keys.

## Important limitations
This is a software scaffold, not a finished or deployed public product. Watchlist and practice positions are in React state and reset on refresh. Prices and financial facts are not live. The research API intentionally refuses to fabricate data and remains disabled until provider integration is implemented.

## Public product safeguards
- Educational research, not individualized investment advice.
- No brokerage credentials or order execution in MVP.
- Display data source and as-of timestamp for every market fact.
- Clearly label estimates, assumptions, stale data, and simulated performance.
- Obtain qualified legal advice on investment-adviser, broker-dealer, consumer-protection, privacy, and app-store obligations before public release.
