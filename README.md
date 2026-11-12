# Sumit Anand — CCTV Operator & Surveillance Specialist

![CCTV command-center portfolio cover](https://sum-boob-github-io.vercel.app/assets/og-cover.jpg)

[![React](https://img.shields.io/badge/React-18.3-149eca?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-3178c6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8-646cff?logo=vite&logoColor=white)](https://vite.dev/)
[![CI](https://github.com/sum-boop/sum-boob.github.io/actions/workflows/ci.yml/badge.svg)](https://github.com/sum-boop/sum-boob.github.io/actions/workflows/ci.yml)
[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?logo=vercel)](https://sum-boob-github-io.vercel.app/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

**Live portfolio:** [sum-boob-github-io.vercel.app](https://sum-boob-github-io.vercel.app/)

**GitHub Pages:** [sum-boop.github.io/sum-boob.github.io](https://sum-boop.github.io/sum-boob.github.io/)

A vivid surveillance command-center portfolio for Sumit Anand. It presents CCTV operations, logistics deployments, work history, technical skills, training, and direct contact details in a responsive single-page experience. Feed and monitoring imagery is illustrative and is not footage from the listed client sites or a personal photograph.

## Features

- React 18 and strict TypeScript, bundled with Vite
- Responsive, high-contrast signal palette with layered aurora, mesh, and camera-feed treatments
- Custom desktop reticle, reduced-motion support, reveal transitions, live India Standard Time clock, and scroll progress
- Animated canvas topology and deployment footprint with operator-location details
- Searchable-by-category camera-feed briefings with keyboard-accessible detail dialogs
- Operational timeline, skills ticker, education, and certification cards
- Mobile navigation with Escape and close-on-navigation support
- Contact terminal with copy-email feedback, email, phone, WhatsApp, and résumé links
- Contact form validation, same-origin Vercel function, Supabase persistence, and a mailto fallback on static hosts
- GitHub Actions pull-request checks and GitHub Pages deployment
- Vercel response security headers and a report-only content security policy

## Technology

| Area            | Stack                                                              |
| --------------- | ------------------------------------------------------------------ |
| UI              | React 18.3.1, TypeScript 6, Vite 8                                 |
| Styling         | CSS design tokens, responsive CSS, motion-safe animations          |
| Icons           | Lucide React                                                       |
| Quality         | ESLint, typescript-eslint, Prettier                                |
| Contact storage | Vercel Function, Supabase REST API, insert-only row-level security |
| Hosting         | Vercel and GitHub Pages                                            |

## Project structure

```text
.
├── .github/
│   ├── ISSUE_TEMPLATE/       # Bug and feature forms
│   ├── workflows/            # CI and Pages deployment
│   ├── CODEOWNERS
│   ├── dependabot.yml
│   └── pull_request_template.md
├── api/contact.js            # Validated Vercel contact function
├── public/
│   ├── assets/                # Existing videos, imagery, and résumé PDF
│   └── favicon.svg
├── src/
│   ├── components/            # Navigation, sections, dialogs, forms, toast, cursor
│   ├── data/                  # Typed profile, experience, skills, projects, credentials, contact
│   ├── hooks/                 # Clock, reveal, media, motion, magnetic, scroll hooks
│   ├── sections/              # Single-page section composition
│   ├── styles/                # Tokens and responsive application stylesheet
│   ├── types/                 # Shared portfolio interfaces
│   └── utils/                  # Public asset URL helper
├── supabase/migrations/       # Contact-message table and insert-only policy
├── index.html                 # SEO metadata, structured data, and Vite entry
├── vite.config.ts
└── vercel.json                # Static output and response headers
```

## Local development

Use Node.js `20.19.0` (see `.nvmrc`) and npm.

```bash
npm ci
npm run dev
```

The Vite development server serves the portfolio at `http://localhost:5173`.

### Scripts

| Script                 | Purpose                                             |
| ---------------------- | --------------------------------------------------- |
| `npm run dev`          | Start the Vite development server                   |
| `npm run build`        | Type-check with `tsc --noEmit`, then create `dist/` |
| `npm run preview`      | Preview the built static site                       |
| `npm run lint`         | Run ESLint                                          |
| `npm run typecheck`    | Run strict TypeScript checking                      |
| `npm run format`       | Format supported source files with Prettier         |
| `npm run format:check` | Check formatting                                    |

The local Vite server does not emulate Vercel Functions. On static hosts, including GitHub Pages and the Vite dev server, the contact form provides a prefilled email draft rather than claiming that a message was stored.

## Deployment

### GitHub Pages

1. Open the repository’s **Settings → Pages** and select **GitHub Actions** as the build and deployment source.
2. Merge changes into `main`. The `Deploy to GitHub Pages` workflow installs dependencies, runs lint/type-check/build, then publishes `dist/`.
3. The repository name differs from the account’s root-site name, so this repository’s project-site URL is `https://sum-boop.github.io/sum-boob.github.io/`.

Vite uses `base: "./"` so built assets load from both the Pages project path and the Vercel domain. This is a single page with anchor navigation; no client-side router or 404 fallback is required. GitHub Pages does not run the contact API, so the form falls back to a mail draft.

### Vercel

The Vercel project builds with `npm run build` and serves `dist/`. The root `api/contact.js` function validates requests and writes to `public.contact_messages` through Supabase using the project’s publishable key and the migration’s insert-only policy.

Configure `SUPABASE_URL` and `SUPABASE_PUBLISHABLE_KEY` in the Vercel project environment for the function. `.env.example` documents the variable names without containing credentials. The `vercel.json` response headers include baseline security headers and a report-only CSP; review deployment reports before tightening the policy.

## Customization

- Edit identity, headline, biography, location, and metrics in `src/data/profile.ts`.
- Update work history and site records in `src/data/experience.ts`.
- Update skill groups and ticker terms in `src/data/skills.ts`.
- Update deployment-card copy, modal briefings, image references, categories, and tags in `src/data/projects.ts`.
- Update the education and certification text in `src/data/certifications.ts`.
- Update public contact details in `src/data/contact.ts`.
- Adjust colors and spacing in `src/styles/tokens.css`; component and responsive styles live in `src/styles/global.css`.
- Keep the contact function’s input validation and the Supabase migration’s insert-only policy aligned when changing form fields.

## Suggested repository topics

`portfolio`, `react`, `typescript`, `vite`, `cctv`, `surveillance`, `github-pages`, `vercel`

## License

MIT. See [LICENSE](LICENSE). Copyright © 2026 Sumit Anand.
