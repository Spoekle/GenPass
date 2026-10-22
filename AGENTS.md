<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# AGENTS.md

You are working in the production TypeScript + React / Next.js repository for **GenPass** (Secure, Privacy-Focused Password Generator). Make safe, minimal, maintainable changes that fit the existing architecture.

**Primary rule**: before changing code, read the surrounding files and follow the patterns already present. Prefer the pattern used closest to the code you are editing.

---

## Stack

| Concern         | Tool                                                                |
| --------------- | ------------------------------------------------------------------- |
| Package manager | `npm`                                                               |
| Framework       | Next.js 16 (App Router, Static HTML Export) + React 19 + TypeScript |
| Architecture    | 100% Client-Side Rendering (`output: 'export'`)                     |
| Styling         | Tailwind CSS v4 (`src/app/globals.css`) + Glassmorphic UI          |
| Cryptography    | Web Crypto API (`crypto.getRandomValues`) with rejection sampling   |
| Icons           | `react-icons` (FontAwesome 5/6)                                     |
| Motion          | `framer-motion`                                                     |

---

## Commands

- `npm run dev` — start Next.js development server on port 3000
- `npm run build` — compile and export static production application to `out/`
- `npm run start` — serve production build (`next start`)
- `npm run lint` — run ESLint (`eslint .`)

---

## Security & Client-Side Rendering Guarantee

1. **Client-Only Execution**: GenPass is built with a zero-server-knowledge guarantee. All password generation, dictionary lookups, character substitutions, and entropy calculations MUST run strictly in the user's browser.
2. **Zero Network Transmission**: Never transmit passwords, user-configured dictionaries, or generation preferences to any server or external API.
3. **Static Export**: The application compiles as a fully static web application (`output: 'export'`) deployable to Nginx, static storage buckets, or static CDN edges without any server runtime.
4. **Cryptographic Integrity**: Always use the native Web Crypto API (`crypto.getRandomValues`) with rejection sampling to eliminate modulo bias. Never use `Math.random()` for security-sensitive logic.

---

## Architecture & Project Structure

- `src/app/` — Next.js App Router:
  - `layout.tsx` — Root layout containing metadata, ambient mouse light, particle effect, global `AlertProvider`, `Navbar`, and `Footer`.
  - `page.tsx` — Root home page (renders Generator).
  - `generator/page.tsx` — Password generator route page.
  - `editor/page.tsx` — Custom word list editor route page.
  - `privacy/page.tsx` — Privacy statement route page.
  - `globals.css` — Global CSS importing Tailwind v4, Tailwind animations, and glassmorphic UI classes.
- `src/components/` — Reusable, modular UI components:
  - `generator/` — Password generator view components (`Generator.tsx`).
  - `editor/` — Word list editor and mobile drawer components (`Editor.tsx`, `MobileWordList.tsx`).
  - `privacy/` — Privacy statement content (`PrivacyStatement.tsx`).
  - `layout/` — Shell elements (`Navbar.tsx`, `Footer.tsx`, `Particles.tsx`, `AmbientLight.tsx`).
  - `ui/` — Common primitive components (`Button.tsx`, `Alert.tsx`, `Slider.tsx`, `CustomCheckbox.tsx`).
- `src/context/` — Application contexts (`AlertContext.tsx` providing notifications).
- `src/helper/Passwords/` — Core generation algorithms:
  - `GeneratePass.ts` — Cryptographically secure generation routines, entropy scoring, and standard options.
  - `Editor.ts` — Word list persistence, import, and export helpers.
  - `options/StandardOptions.ts` — Default curated dictionaries for memorable passphrases.
- `src/utils/` — Client utilities:
  - `storage.ts` — `safeLocalStorage` wrapper preventing SSR hydration mismatches.
- `src/types/` — Central TypeScript definitions (`Option`, `AlertItem`, `GenPassOptions`, etc.).
- `public/` — Static assets (icons, logo images in `public/images/`).

---

## TypeScript

- No `any`.
- No casts — help the compiler infer correctness through runtime logic. If a third-party type makes this impossible, cast with a comment explaining why.
- No non-null assertions (`!`) — prefer type guards, optional chaining, and defensive null checks.
- Centralize shared types in `src/types/`.

---

## React

- Add `'use client';` directive to the top of all client components (using hooks, browser APIs, or framer-motion).
- **SSR Hydration Safety**: Always use `safeLocalStorage` from `@/utils/storage` instead of direct `localStorage`. Use lazy state initializers (`useState(() => ...)`) to avoid triggering cascading renders.
- Extract into subcomponents when a component exceeds ~150–200 LOC.
- Keep components pure: do not call impure functions like `Math.random()` during render; precalculate random values in effects or callbacks.
- No global state for local UI concerns.

---

## CSS & Styling

- Style using Tailwind CSS v4 utility classes and glassmorphic styling tokens (`glass`, `glass-dark`, `glass-card`, `glass-button`, `glass-input`).
- Put reusable styles and animations in `src/app/globals.css`.

---

## Scope

- Change only what is necessary for the requested outcome.
- Do not add dependencies unless clearly necessary.
- Preserve comments that explain cryptographic or architectural rationale.
