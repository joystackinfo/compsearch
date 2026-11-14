import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import { Competition } from "./models/Competition";

const app = express();


app.get("/api/competitions", async (_req, res) => {
  const all = await Competition.find();
  res.json(all);
});

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, db: mongoose.connection.readyState === 1 });
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