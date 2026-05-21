# SpacedOut ⚡

A flashcard app powered by the SM-2 Spaced Repetition Algorithm.

<!-- Add screenshot here -->

## How to Run

**Prerequisites:** 
- Node.js 18+
- Git

**Commands:**
```bash
git clone https://github.com/Mohammad-Ali-Soomro/miniApp.git
cd miniApp
npm install
npm run dev
```
Then open [http://localhost:5173](http://localhost:5173) in your browser.

## Features

- **Full Deck CRUD**: Create, read, update, and delete structured study decks.
- **Full Card CRUD**: Fast markdown-enabled prompt and answer insertions cleanly scoped per deck.
- **SM-2 Spaced Repetition Algorithm**: Automatically spaces out cards dynamically based on your explicit ratings (Blackout, Hard, Good, Perfect).
- **Interactive Study Sessions**: 3D animated flashcard reviews with keyboard shortcut bindings.
- **Streak & Analytics Tracking**: Comprehensive stats evaluating total deck loads, items tracking due bounds, and study streak evaluation natively!
- **Neobrutalism UI**: A fully custom styling language built flawlessly matching pixel-perfect color/outline boundaries relying entirely native on React/Tailwind.

## Tech Stack

- **Frontend**: React, Vite, Tailwind CSS v3, React Router DOM
- **Backend**: Node.js, Express, CORS
- **Database**: SQLite (via `better-sqlite3`)
