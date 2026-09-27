# 🧩 Focus AI Pro — Landing Page & Showcase Website

This directory contains the source code for the official **Focus AI Pro** product landing page and interactive demonstration website.

Built using **React**, **JavaScript**, and **Tailwind CSS (v4)** with a Cursor-inspired minimal color-blocked design.

---

## ✨ Website Features

- ⚡ **Animated Typewriter & Backspacing Headline**: Dynamic cycling headline highlighting core focus benefits.
- 📦 **1-Click ZIP Downloader**: Embedded client-side `JSZip` bundler that packages extension source files into `Focus-AI-Pro-v2.0.0.zip` instantly upon download click.
- 🎮 **Live Interactive YouTube Simulator**: Interactive playground simulating both YouTube video recommendations and the Chrome extension popup controls in real time.
- 📖 **8-Step Installation Walkthrough**: Detailed step-by-step visual tutorial guiding users through Chrome unpacked extension setup.
- 📊 **Watchtime Analytics Showcase**: Preview of the internal `dashboard.html` metrics and privacy benefits.
- 💡 **Pro Power-User Tips**: Tips for multi-keyword targeting, strict hide mode, and toolbar pinning.

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+ 
- npm v9+

### Installation & Development Server
```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev
```

Open `http://localhost:5173` in your browser.

### Building for Production
```bash
npm run build
```
The optimized production bundle will be generated in the `dist/` directory, ready to deploy to GitHub Pages, Vercel, Netlify, or Cloudflare Pages.

---

## 🎨 Tech Stack & Styling

- **Framework**: React 19 + Vite
- **Styling**: Tailwind CSS v4 + Custom Color Block Tokens
- **Icons**: Lucide React
- **Zip Packaging**: JSZip
- **Effects**: Canvas Confetti
- **Typography**: Plus Jakarta Sans, Outfit & JetBrains Mono (via Google Fonts)
