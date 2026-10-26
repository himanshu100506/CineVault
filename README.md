# CineVault (React + Vite) — original theme, real data

Same design as the original project. Dummy data replaced with live data and ratings from TMDB.

## Setup
1. Free API key: https://www.themoviedb.org/settings/api
2. Copy `.env.example` to `.env` and set `VITE_TMDB_API_KEY=your_key`
3. `npm install`
4. `npm run dev`  (restart it after creating/changing `.env`)

## What is real now
- Trending, Hollywood, Bollywood, Web Series and Top Rated rows (TMDB)
- Ratings (TMDB community score /10 + vote count), posters, genres, year
- Detail popup: cast, director, runtime / seasons, where to watch (India), trailer
- Hero slider uses this week's trending backdrops; hero counters are real catalogue sizes
- Genre / Type / Rating filters and live search call the TMDB API ("Load more" for extra pages)
- Per-user watchlist, "watched", "liked" and your own half-star rating (stored in localStorage)

## Structure
- `src/api/tmdb.js` API client | `src/context/` Auth, Library, Genres | `src/components/` UI
- `src/style.css` your original stylesheet + a small block of additions at the bottom

## Class demo: login / signup without a backend
Accounts, the active session and each user's watchlist/ratings are saved in the browser's localStorage.
Click the **Storage** button (bottom-left) to show the stored data live, or open
DevTools -> Application -> Local Storage -> http://localhost:5173 and look at the `cinevault_*` keys.
To hide the button, remove `<StorageViewer />` from `src/App.jsx`.
