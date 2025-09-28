# Crypto Price Arbitrage Finder

Template repo that compares token quotes across DEX aggregators (0x and 1inch) and reports percent spreads.

## How it works
- Backend script `src/arbitrage.js` reads `config/pairs.config.json` for token pairs to check.
- Queries 0x and 1inch quote endpoints to obtain quote prices for a sample sell amount.
- Computes percentage spread between available sources and writes a JSON report to `reports/`.

## Quickstart
1. Copy `.env.example` to `.env` and set `CHAIN_ID` if needed.
2. Install deps:
   ```
   npm install
   ```
3. Run scanner:
   ```
   npm run scan
   ```
4. Schedule via GitHub Actions (workflow included).

## Frontend
A minimal `/web` Next.js frontend can read `sample_reports/report-sample.json` to display a "Top 5 Arbitrage Pairs" chart. Deploy `/web` to Vercel for visualization.
