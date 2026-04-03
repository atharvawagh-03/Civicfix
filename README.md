# CivicFix

Public issue reporting and resolution platform: citizens report civic issues with photos and map locations; admins assign work, update status, and view analytics.

## Stack

- **Backend:** Node.js, Express, MongoDB (Mongoose), JWT, bcrypt, Multer
- **Frontend:** React (Vite), React Router, Axios, Leaflet

## Requirements

- Node.js 18+
- MongoDB (local or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))

## Setup

### One-command dev (recommended)

From the repo root:

```bash
npm install
npm run install:all
npm run dev
```

### 1. Database

Start MongoDB locally or create a cluster on Atlas and copy the connection string.

### 2. Backend

```bash
cd server
cp .env.example .env
# Edit .env: MONGODB_URI, JWT_SECRET, CLIENT_ORIGIN
npm install
npm run dev
```

API defaults to `http://localhost:5000`.

### 3. Frontend

```bash
cd client
npm install
npm run dev
```

Open `http://localhost:5173`. The dev server proxies API calls to port 5000.

### 4. Tests (backend)

```bash
cd server
npm test
```

## API (per SRD)

| Method | Path | Notes |
|--------|------|--------|
| POST | `/register` | name, email, password, role (citizen \| admin) |
| POST | `/login` | email, password |
| POST | `/issue` | multipart: title, description, image, latitude, longitude (Bearer, citizen) |
| GET | `/issues` | Bearer; citizens see own; admins see all; `?status=` |
| GET | `/issue/:id` | Bearer |
| PUT | `/issue/:id` | Bearer; citizen: title/description; admin: status, assignedTo, comment |
| DELETE | `/issue/:id` | Bearer, admin |
| GET | `/admin-users` | Bearer, admin — list admins for assignment |
| GET | `/analytics` | Bearer, admin |

## Deployment

- **Frontend:** build with `npm run build` in `client/`; host on Vercel/Netlify (set env or API URL if not using same-origin proxy).
- **Backend:** host on Render/Railway; set `MONGODB_URI`, `JWT_SECRET`, `CLIENT_ORIGIN`.
- **Database:** MongoDB Atlas.
