# 🛰️ CCTV Operator & Surveillance Command Center — Portfolio

**A cinematic, dark-glass command console for a CCTV & Surveillance Systems Specialist.**

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![No Framework](https://img.shields.io/badge/Framework-None%20(Vanilla)-0a0f1d?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-00e5ff?style=for-the-badge)

🔗 **Live Deployment:** [sum-boose.github.io](https://sum-boose.github.io/)

---

## 📡 Overview

This repository holds a single-page developer portfolio designed around a **CCTV operator / surveillance command center** aesthetic — deep obsidian backgrounds, neon cyan and green glows, dark glassmorphism panels, and a custom crosshair cursor. It's built entirely with vanilla HTML, CSS and JavaScript on a modular, token-driven architecture, with no build tooling required.

Every surface of the interface — the HUD grid overlay, the "live" camera-feed project cards, the operational logbook timeline, and the secure command-terminal contact form — is designed to feel like a real monitoring console rather than a generic template.

---

## ⚡ Key Features

- **Dark Glassmorphism + Neon Theme** — obsidian surfaces, backdrop blur, and cyan / green / violet glow accents driven entirely by CSS custom properties
- **Tactical HUD Backdrop** — a subtle scanning grid overlay, a moving scanline sweep, and ambient glow orbs
- **Custom Crosshair Cursor** — a precision dot + rotating dashed reticle with a "target-lock" hover state, with automatic fallback on touch devices
- **Live Surveillance Timestamp** — a real-time UTC / IST clock rendered in the header, formatted like an operator console
- **Camera-Feed Project Cards** — glass panels with viewfinder-style corner brackets and a pulsing "LIVE" indicator, filterable by category
- **Interactive Glass Modals** — project briefings and a working "Hire Me" proposal form, closable via overlay click, close button, or <kbd>Esc</kbd>
- **Secure Command Terminal** — a contact form styled as a terminal window, complete with status-light header dots
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
└── README.md                # Project documentation
```

`style.css` only imports the other stylesheets in the order shown above — tokens first, then base resets, then cursor, layout, and components. Do not add rules directly to `style.css`.

---

## 🚀 Getting Started

This is a fully static site — no build step, no package manager.

```bash
git clone https://github.com/sum-boose/sum-boose.github.io.git
cd sum-boose.github.io
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

**GitHub Pages** (recommended — this repo is already named for it)

1. Push your changes to the `main` branch
2. Go to **Settings → Pages**
3. Under **Source**, select `main` branch, root folder
4. Your site will be live at `https://sum-boose.github.io/`

**Netlify / Vercel** (alternative)

1. Import the repository from your Git provider
2. Build command: *none*
3. Publish directory: `/` (repository root)
4. Deploy

---

## 🎨 Customisation Notes

- **Colors, type, spacing** — edit tokens once in `variables.css`; every other file reads from them
- **Content & copy** — update `index.html` sections directly (hero, expertise, deployments, logbook, contact)
- **Project cards** — edit the `opData` object in `script.js` to change modal titles, images, and descriptions
- **Contact routing** — the contact and hire forms send via `mailto:`; update the address in `handleHireSubmit` and `handleDirectMessage` in `script.js`
- **Filter categories** — auto-generated from each card's `.op-card-badge-span` text, no extra config needed

---

## 📄 License

Released under the **MIT License**. You're free to use, modify, and distribute this project with attribution.

```
MIT License — Copyright (c) 2026 Sumit Anand
Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files, to deal in the software
without restriction, including the rights to use, copy, modify, merge,
publish, distribute, sublicense, and/or sell copies of the software.
```
