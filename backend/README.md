# Backend Legal API – Fix "Route Not Found"

When you save **Privacy Policy** (or any Legal Content), the admin panel calls your backend at:

- **GET** `http://localhost:5000/api/legal` – load all legal content
- **PUT** `http://localhost:5000/api/legal/:type` – save one type (e.g. `privacyPolicy`)

If you see **"route not found"**, your server is not defining these routes. Use the router in this folder.

## 1. Add the routes to your Express server

In the file where you set up Express (e.g. `server.js`, `app.js`, or `index.js`):

```js
const express = require("express");
const legalRoutes = require("./backend/legalRoutes"); // or your path to legalRoutes.js

const app = express();
app.use(express.json());

// Mount legal API (must be under /api if your frontend uses baseURL ending with /api)
app.use("/api/legal", legalRoutes);

// ... rest of your server (auth, other routes, listen)
```

Make sure:

- `app.use(express.json())` is used so `req.body` is parsed.
- No other route catches `/api/legal` or `/api/legal/:type` before this (e.g. a generic `app.get('/api/*')` that returns 404).

## 2. Run your server

Start your backend on port 5000 (or the port you set in `REACT_APP_API_URL`). The admin panel uses `http://localhost:5000` by default (see `package.json` proxy and `src/utils/api.js`).

## 3. Optional: use a database

`legalRoutes.js` keeps data in memory. For production, replace the `store` object with your database (e.g. read/update a `legal_content` table and keep the same response shapes).

## Response shape your backend should follow

- **GET /api/legal**  
  Response body:  
  `{ privacyPolicy: { content, lastUpdated }, termsOfService: { ... }, cookiePolicy: { ... }, aboutUs: { ... } }`

- **PUT /api/legal/:type**  
  Request body: `{ content: "<html>..." }`  
  Response body:  
  `{ success: true, data: { type, content, lastUpdated }, message: "..." }`  
  or at least: `{ content, lastUpdated }`

The frontend accepts both wrapped (`data`) and direct responses.
