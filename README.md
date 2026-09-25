# Booknest — MERN Frontend

A frontend-only React/Vite reading tracker inspired by the visual language of modern book shelves.

## Stack
- React + Vite
- React Router (ready for future routes)
- lucide-react icons
- Plain CSS with responsive layout
- Mock data in `src/data/books.js`
- API service placeholder in `src/services/api.js`

## Run
1. Install Node.js 18+.
2. In this folder run `npm install`.
3. Run `npm run dev`.
4. Open the local Vite URL shown in the terminal.

## Frontend structure
```
src/
  components/   # Topbar, book cards, modal, settings
  data/         # Mock books/genres
  pages/        # Reserved for future routed pages
  services/     # Future Express API calls
  App.jsx
  main.jsx
  styles.css
public/
```

This package intentionally contains no Express server, MongoDB connection, or authentication because the request was for the frontend only. It is structured so a future MERN backend can replace the mock service without redesigning the UI.
