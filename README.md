# FetchUp · Higher Together

A responsive five-page company website built from the supplied FetchUp Scroll Edition design. Next.js App Router, TypeScript, CSS, Motion, locally served Space Grotesk/Manrope, and approved local Figma artwork.

## Production

- Website: https://fetchup-eta.vercel.app
- Source: https://github.com/Its-sriramhere/fetchup
- Vercel project: `fetchup`, connected to the repository's `main` branch.

The requested `fetchup.vercel.app` alias was unavailable because it is already in use. `SITE_URL` is configured for the assigned production address. Enquiry email delivery still requires the owner's email and Redis configuration described below.

## Run locally

Requires Node.js 20.9 or newer (Node 24 LTS recommended).

```sh
npm ci
npm run dev
```

Open http://localhost:3000. For the production build:

```sh
npm run build
npm start
```

## Routes

| Route | Content |
| --- | --- |
| `/` | Hero, services, process, product concepts, approach, project invitation |
| `/services` | Five services, six-step process and project questions |
| `/about` | Approach, principles and brand meaning |
| `/work` | Three illustrative concepts, explicitly not client work |
| `/contact` | Project enquiry, service/concept context and confirmation/error states |

Editable copy is in `data/content.ts` and route components. Shared sections are in `components/sections/`. Colours, typography, spacing and responsive rules are in `styles/`. Artwork is in `public/` and is independent of Figma URLs at runtime.

## Scroll journey

`ArrowJourneyProvider` in the persistent root layout owns exactly one travelling figure. Motion observes the real scroll position; interpolation is reversible and stops immediately with visitor input. Semantic anchors are measured after fonts load and when layout or viewport dimensions change. Scroll frames reuse cached measurements. Route changes preserve the element and briefly transition its pose; history navigation uses the restored scroll position. A subtle document-space SVG rail is derived from the same checkpoints.

Desktop and mobile poses are in `data/journey.config.ts`. The fixed figure uses viewport-space coordinates, with no extra scroll-offset subtraction. Reduced motion and the footer motion control disable decorative movement. The preference is stored locally as `fetchup-motion-paused`.

## Enquiry delivery

Copy `.env.example` to `.env.local` and populate the variables. Never place server credentials in variables prefixed with `NEXT_PUBLIC_`.

| Variable | Purpose |
| --- | --- |
| `SITE_URL` | Canonical deployment origin, e.g. your final HTTPS domain. Used for metadata, sitemap and same-origin validation. |
| `RESEND_API_KEY` | Server-side Resend API key |
| `ENQUIRY_FROM_EMAIL` | Sender on a domain verified with Resend |
| `ENQUIRY_TO_EMAIL` | Approved receiving inbox |
| `UPSTASH_REDIS_REST_URL` | Upstash Redis REST endpoint for shared production rate limits |
| `UPSTASH_REDIS_REST_TOKEN` | Server-side Redis token |

Delivery is intentionally unavailable until the three email settings are present. Production also requires Redis rate limiting; development has a bounded in-memory limiter. The form preserves input on failures and never reports success unless the email provider returns an acceptance identifier. Provider acceptance does not guarantee inbox placement. Retry idempotency prevents duplicate delivery of an unchanged submission.

The endpoint validates fields, caps actual request bodies, checks origin, rejects a honeypot, limits submissions to five per ten minutes, and sends plain-text email. It does not store enquiry contents in an application database or print them to logs. Rate-limit keys hash the address reported by the deployment proxy and expire. Deploy behind a trusted proxy that overwrites forwarded-IP headers; Vercel's dedicated forwarded header is preferred. Establish the receiving inbox's retention policy and confirm legal/privacy wording before accepting live enquiries.

## Verification

```sh
npm run typecheck
npm test
npx playwright install chromium
npm run build
npm run test:browser
```

Unit tests cover reversible journey interpolation, bounds, merged checkpoints, validation and delivery acceptance/failure. Browser tests cover all five pages at 320, 390, 768, 1024, 1440 and 1920px, persistent arrow identity, resize, history, motion preferences, keyboard menu dismissal, form validation, input preservation and API rejection paths. The success browser test mocks provider acceptance; a real inbox test still requires the owner's delivery settings.

## Deployment

1. Import the project into Vercel, or another Node.js host supporting Next.js App Router and server endpoints.
2. Configure the environment variables above. Set `SITE_URL` to the deployed origin before building.
3. Run `npm ci` and `npm run build`; the Node.js start command is `npm start`.
4. Configure the domain, verified email sender and Redis. Confirm forwarding headers at the host.
5. Test the contact form against the approved inbox, including invalid input and provider failure. Check page metadata, deep links, mobile menu and scroll reversal on the deployed site.
6. Keep the previous working deployment available for rollback.

No analytics or tracking service is enabled. See `THIRD_PARTY_NOTICES.md` for design-asset attribution and React Bits licence terms.

See `QUALITY.md` for the completed verification, local Lighthouse results and remaining release checks.

## Owner inputs still needed for launch

- Final domain, hosting and approved receiving inbox.
- Resend verified sender/API key and Upstash Redis credentials.
- Final company/service wording and legal/privacy/retention wording.
- Approved real case studies if illustrative concepts are to be replaced.
