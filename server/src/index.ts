import express from "express";

const app = express();

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.listen(5000, () => console.log("Server on http://localhost:5000"));