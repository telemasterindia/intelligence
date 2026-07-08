# Local Development Instructions

Run the frontend only:

```bash
npm run dev:frontend
```

Run the backend only:

```bash
npm run dev:backend
```

Run both:

```bash
npm run dev
```

Development rules:

- Keep UI components focused on rendering and interaction.
- Put API calls in `frontend/src/services`.
- Put business orchestration in `backend/src/services`.
- Put database queries in `backend/src/repositories`.
- Put scoring and intelligence algorithms in `backend/src/engines`.
- Make rules configurable through database-backed settings or rule tables.
- Add audit events for future imports, exports, scoring runs, settings changes, and user actions.
