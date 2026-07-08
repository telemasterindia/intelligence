# Final Folder Structure

```text
TIP/
  frontend/
    src/
      components/
      layouts/
      pages/
      hooks/
      services/
      styles/
      utils/
      config/
  backend/
    src/
      controllers/
      routes/
      services/
      repositories/
      middleware/
      engines/
      database/
      config/
      utils/
      jobs/
  database/
    migrations/
  shared/
  scripts/
  docs/
```

The frontend is presentation-only. Backend controllers handle transport, services coordinate use cases, repositories own SQL access, and engines remain independent plug-in modules.
