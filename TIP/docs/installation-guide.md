# Installation Guide

Prerequisites:

- Node.js 20+
- PostgreSQL 15+
- npm 10+

Setup:

```bash
cd TIP
cp .env.example .env
npm install
```

Create a local PostgreSQL database:

```bash
createdb tip
```

Update `.env` with the correct local PostgreSQL credentials.

Run migrations:

```bash
npm run db:migrate
```

Start local development:

```bash
npm run dev
```

Default local URLs:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:4000`
- API health: `http://localhost:4000/api/health`
