# Sumit Anand — CCTV Operator Portfolio

**A cinematic, dark-glass command console for a CCTV & Surveillance Systems Specialist.**

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![No Framework](https://img.shields.io/badge/Framework-None%20(Vanilla)-0a0f1d?style=for-the-badge)
**Vercel:** [sum-boob-github-io.vercel.app](https://sum-boob-github-io.vercel.app/)

**GitHub Pages project URL:** `https://sum-boop.github.io/sum-boob.github.io/` (when Pages is enabled for this repository).

---

## 📡 Overview

This repository holds a single-page developer portfolio designed around a **CCTV operator / surveillance command center** aesthetic — deep obsidian backgrounds, neon cyan and green glows, dark glassmorphism panels, and a custom crosshair cursor. It's built entirely with vanilla HTML, CSS and JavaScript on a modular, token-driven architecture, with no build tooling required.

The portfolio uses a restrained teal control-room palette, camera-feed styling, an operational logbook timeline, and a contact form that stores submissions through a same-origin Vercel Function. The imagery is illustrative and does not represent the named client sites or a personal photograph.

---

## ⚡ Key Features

- **Dark Teal Control-Room Theme** — layered teal-black surfaces with teal, green, and amber signal accents driven by CSS custom properties
- **Tactical HUD Backdrop** — a subtle scanning grid overlay, a moving scanline sweep, and ambient glow orbs
- **Custom Crosshair Cursor** — a precision dot + rotating dashed reticle with a "target-lock" hover state, with automatic fallback on touch devices
- **Live Surveillance Timestamp** — a real-time UTC / IST clock rendered in the header, formatted like an operator console
- **Illustrative Camera-Feed Cards** — glass panels with viewfinder-style corner brackets, clearly separated from factual work-history details, filterable by category
- **Interactive Glass Modals** — project briefings and a working "Hire Me" proposal form, closable via overlay click, close button, or <kbd>Esc</kbd>
- **Contact Form** — Vercel submissions are validated server-side and stored in Supabase; static-only hosts offer a prefilled email-draft fallback
- **Operational Logbook Timeline** — a vertical work-history log with online/archived status markers
- **Scroll Progress + Reveal Animations** — a top progress bar and IntersectionObserver-driven section reveals
- **Accessibility-Minded** — respects `prefers-reduced-motion`, keyboard-focus states, and disables custom cursor / tilt effects on coarse pointers

---

## 🧰 Tech Stack

| Layer | Details |
|---|---|
| **Markup** | Semantic HTML5 |
| **Styling** | CSS3 — custom-property design tokens, Grid & Flexbox, `backdrop-filter` glassmorphism, keyframe animations |
| **Scripting** | Vanilla JavaScript (ES6+) — Canvas API, `IntersectionObserver`, `requestAnimationFrame`, `Date` |
| **Icons** | Font Awesome 6 |
| **Type** | Google Fonts — Inter & JetBrains Mono |
| **Build tooling** | None — static files, zero dependencies |

---

## 🗂️ Project Structure

```
.
├── index.html            # Semantic page structure & content
├── style.css              # Central importer — loads all modules in order
├── variables.css          # Design tokens: color, type scale, spacing, motion
├── base.css                # Resets, typography, scrollbars, HUD grid overlay
├── cursor.css              # Custom crosshair / reticle cursor system
├── sections-layout.css     # Section-level layout: hero, feeds, timeline, contact
├── components.css          # Reusable UI: buttons, badges, cards, modals, nav
├── script.js                # Interactivity: cursor, clock, filters, modals, forms
├── api/contact.js           # Same-origin Vercel Function for Supabase inserts
└── README.md                # Project documentation
```

`style.css` only imports the other stylesheets in the order shown above — tokens first, then base resets, then cursor, layout, and components. Do not add rules directly to `style.css`.

---

## 🚀 Getting Started

This is a fully static site — no build step, no package manager.

```bash
git clone https://github.com/sum-boop/sum-boob.github.io.git
cd sum-boob.github.io
```

Then either:

- Open `index.html` directly in your browser, **or**
- Serve it locally for a closer-to-production experience:

```bash
npx serve .
```

> Google Fonts and Font Awesome are loaded from CDNs, so an internet connection is needed for full styling.

---

## 🌐 Deployment Guide

**GitHub Pages**

Configure Pages for this repository and serve the repository root. Because the repository name differs from the account name, its project-site URL is `https://sum-boop.github.io/sum-boob.github.io/` when Pages is enabled.

**Vercel**

The repository is connected to Vercel and deploys as a static site from the repository root, with no build command. The stable production alias is `https://sum-boob-github-io.vercel.app/`. The `/api/contact.js` function uses the connected Supabase environment variables; GitHub Pages has no serverless runtime, so the form provides an email-draft fallback there.

---

## 🎨 Customisation Notes

- **Colors, type, spacing** — edit tokens once in `variables.css`; every other file reads from them
- **Content & copy** — update `index.html` sections directly (hero, expertise, deployments, logbook, contact)
- **Project cards** — edit the `opData` object in `script.js` to change modal titles, images, and descriptions
- **Contact routing** — the Vercel Function writes to `public.contact_messages` using the public Supabase key and the table's INSERT-only RLS policy. On hosts without `/api/contact`, the form offers a prefilled `mailto:` draft. The recipient address is defined once in `script.js`.
- **Filter categories** — generated from each card's `data-category` attribute, no extra configuration needed
