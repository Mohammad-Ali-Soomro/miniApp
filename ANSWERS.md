# Project Answers

## Q1: How to run the application
**Prerequisites:** Node.js 18+, Git

From your terminal run:
```bash
git clone https://github.com/Mohammad-Ali-Soomro/miniApp.git
cd miniApp
npm install
npm run dev
```
The server will bind to port `3001` and Vite handles the proxy routing out over port `5173`. When spinning up the backend, `better-sqlite3` will automatically spin-up and provision the local `./server/spaced_out.db` SQLite schema instantly to your drive!

## Q2: Choice of Tech Stack
For the frontend, I chose **React + Vite**. I wanted to build a fast Single Page Application (SPA), and Vite made the development process incredibly quick. I paired it with Tailwind CSS to nail down the strict Neo-brutalism design style. This made it much easier for me to manage complex UI states and component animations, like the 3D flipping effects on the flashcards, without writing bloated custom CSS.

For the backend, I went with **Express + SQLite**. As I was planning the project, I realized the data is highly relational—decks cascade into cards, and each card tracks its own specific repetition intervals. I initially thought about using a NoSQL database like MongoDB, but I realized it would be a poor choice here. Trying to manage updates across unstructured collections would force me to write awkward aggregation pipelines just to generate basic stats or safely handle cascading deletes. SQLite was the perfect fit: it removed the headache of configuring a massive database server while giving me the strict relational integrity and local storage that the algorithm requires!

## Q3: Addressing an Edge Case
Inside the SM-2 algorithm located at `server/sm2.js`, if a user continually rates a flashcard poorly utilizing metrics < `3` (e.g. `2` or `0`), the math dynamically lowers the structural `ease_factor`. However, if the algorithm is executed mathematically blindly, eventually the mathematical ease ratio calculates downward scaling toward negative numbers driving the multiplier formula directly mapping the `interval` directly to `0` continually forcing an impossible daily review overlap.

To prevent this breaking context, a hard threshold clamp is included:
```javascript
ease_factor = Math.max(1.3, ease_factor); // SM-2 minimum ease factor guard
```
This single validation mathematically guarantees a card retains a core default separation even when consistently rated difficult!

## Q4: AI Usage 
To kick off the project, I only used Claude to research the initial idea and brainstorm how spaced repetition apps function conceptually. Because I really wanted to challenge myself to build this project from the ground up, I wrote the actual code, wired up the React components, and configured the Express routing manually without relying on AI scaffolding. 

However, during my initial research phase, I asked Claude to explain the math behind the `SM-2 Spaced Repetition` algorithm. I quickly noticed that the AI's explanation was actually flawed and failed to match the original 1990 definitions. The AI's explanation assumed a pass boundary of `>= 4` and completely missed the crucial baseline standard limiting tracking (`Math.max(1.3, ...)`). I caught this mistake by comparing the logic directly against Piotr Wozniak's original algorithm paper. From there, I stepped away from the AI and explicitly wrote the `sm2.js` module myself, ensuring the math correctly tracks `quality >= 3` and enforces the strict minimum thresholds needed for the app to actually function!

## Q5: Honest Gap
The streak calculation logic inside `GET /api/stats` executes via an approximate scan of the local system's SQLite `last_reviewed` timestamps parsing tracking via `date('now')` and decrementing backward. 

However, because timezone variances track arbitrarily depending entirely on specific regional UTC configurations locally scaling offsets, calculating actual daily bounds may result in broken consecutive matching overlaps across midnight rotations. 

Given more time, structurally adapting a wholly independent `daily_review_logs` SQL table mapping exact time tracking instances bound against exact user interaction counts explicitly logging out absolute metrics mapped directly into user profiles would drastically increase reliability outscaling these specific date parsing limits entirely.
