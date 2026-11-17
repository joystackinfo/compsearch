import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import { Competition } from "./models/Competition";

const app = express();

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, db: mongoose.connection.readyState === 1 });
});

app.get("/api/competitions", async (req, res) => {
  const { type, open, sort } = req.query;
  const filter: Record<string, unknown> = {};
  if (typeof type === "string") filter.type = type;
  if (open === "true") {
    filter.deadline = { $gte: new Date().toISOString().slice(0, 10) };
  }
  const order: Record<string, 1 | -1> = sort === "deadline" ? { deadline: 1 } : {};
  const list = await Competition.find(filter).sort(order);
  res.json(list);
});

app.get("/api/competitions/:id", async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    res.status(404).json({ error: "Competition not found" });
    return;
  }
  const one = await Competition.findById(req.params.id);
  if (!one) {
    res.status(404).json({ error: "Competition not found" });
    return;
  }
  res.json(one);
});

async function start() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is missing in .env");
  await mongoose.connect(uri);
  console.log("Database connected");
  app.listen(5000, () => console.log("Server on http://localhost:5000"));
}

start().catch((err) => {
  console.error(err);
  process.exit(1);
});