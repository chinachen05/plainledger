# PlainLedger — Independent Personal Finance Guides & Calculators

PlainLedger is a lightweight, fast-loading English personal finance publication built with React, TypeScript, Vite, and Tailwind CSS, pre-configured for GitHub + Vercel (`*.vercel.app`) deployment and Google AdSense review.

## Included Highlights

- **26 Original, Math-Backed Articles** across 5 pillars: Budgeting (5), Saving (5), Debt & Credit (5), Investing (6), and Tax & Retirement (5).
- **4 Interactive Browser Calculators**: Compound Wealth & Inflation, Debt Payoff (Avalanche vs. Snowball), 50/30/20 Budget & Emergency Runway, and Mortgage Amortization.
- **AdSense-Ready Compliance & Technical Files**:
  - Google AdSense `<script>` & `<meta name="google-adsense-account">` in `index.html` (`ca-pub-2936167858814999`)
  - `public/ads.txt`, `public/robots.txt`, and `public/sitemap.xml`
  - `vercel.json` SPA rewrites so direct URLs (`/articles/...`, `/privacy-policy`, `/about`, `/contact`) return HTTP 200
  - Full `About`, `Editorial Policy`, `Privacy & Cookie Policy`, `Terms & Disclaimer`, and `Contact` (`chinachen05@gmail.com`)

## Deploying to GitHub & Vercel

1. Push this repository to a GitHub repository.
2. Import the repository in **Vercel** (Framework Preset: **Vite**, Build Command: `npm run build`, Output Directory: `dist`).
3. Once Vercel assigns your `https://<your-project>.vercel.app` URL, update the domain inside `public/sitemap.xml` if your subdomain is not `plainledger.vercel.app`, then submit your site in Google AdSense.
