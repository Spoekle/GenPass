# GenPass - Secure Password Generator

A modern, privacy-focused password generator built with **Next.js 16**, **React 19**, **TypeScript**, and **Tailwind CSS v4**.

GenPass is designed with a **100% client-side execution guarantee**: all cryptographic random number generation, entropy calculations, and dictionary manipulations run entirely in your web browser. No passwords, user preferences, or custom dictionaries ever touch a server.

---

## Features

- **Memorable & Secure Passphrases**: Combines words from standard or custom word lists with optional symbol replacements.
- **Advanced Mode**: High-entropy password generation with customizable segment counts, lengths, numbers, symbols, and uppercase characters.
- **Cryptographically Secure**: Powered by the Web Crypto API (`crypto.getRandomValues`) with rejection sampling to eliminate modulo bias.
- **Word List Editor**: Create, weight, import, and export custom word lists using browser local storage.
- **One-Click Actions**: Easily copy to clipboard and download generated credentials as `.txt` files.
- **Zero-Knowledge Privacy**: Pure client-side static rendering (`output: 'export'`) with no backend tracking, cookies, or telemetry.

---

## Tech Stack

- **Framework**: Next.js 16 (App Router, Static Export)
- **UI Library**: React 19
- **Styling**: Tailwind CSS v4 + Glassmorphic Design System
- **Language**: TypeScript (strict mode)
- **Animations**: Framer Motion
- **Icons**: React Icons

---

## Installation & Development

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Spoekle/genpass.git
   cd genpass
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:3000`.

---

## Building for Production

To create a static production build:

```bash
npm run build
```

This generates a fully static export in the `out/` directory, ready to deploy to any static host (Nginx, Vercel, Cloudflare Pages, S3, etc.).

### Docker Deployment

To build and run using Docker with Nginx:

```bash
docker compose up --build
```

---

## License

This project is licensed under the MIT License.
