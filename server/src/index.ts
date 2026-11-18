import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import { Competition } from "./models/Competition";
import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "./models/User";

const app = express();
app.use(express.json());

// Check for required environment variables
const jwtSecret: string = process.env.JWT_SECRET ?? "";
if (!jwtSecret) throw new Error("JWT_SECRET is missing in .env");

function requireAdmin(req: Request, res: Response, next: NextFunction) { //requireAdmin middleware to check if the user is an admin
  const header = req.headers.authorization ?? "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : ""; //extract the token from the authorization header
  try {
    const data = jwt.verify(token, jwtSecret) as { role?: string };
    if (data.role !== "admin") throw new Error("not admin");
    next();
  } catch {
    res.status(401).json({ error: "Admin only" });
  }
}

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, db: mongoose.connection.readyState === 1 });
});

// Competition routes
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

// Authentication routes
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body ?? {};
  if (typeof email !== "string" || typeof password !== "string") {
    res.status(400).json({ error: "Email and password are required" });
    return;
  }
  const user = await User.findOne({ email: email.toLowerCase().trim() });
  const ok = user ? await bcrypt.compare(password, user.passwordHash) : false;
  if (!user || !ok) {
    res.status(401).json({ error: "Wrong email or password" });
    return;
  }
  const token = jwt.sign({ id: user.id, role: user.role }, jwtSecret, { expiresIn: "7d" });
  res.json({ token, role: user.role });
});

app.get("/api/admin/check", requireAdmin, (_req, res) => {
  res.json({ ok: true });
});

// Helper function to check if all required fields are checked
function allChecked(c: unknown): boolean {
  const k = c as { dates?: boolean; eligibility?: boolean; theme?: boolean; cost?: boolean } | undefined;
  return !!k && k.dates === true && k.eligibility === true && k.theme === true && k.cost === true;
}

const today = () => new Date().toISOString().slice(0, 10);

app.post("/api/admin/competitions", requireAdmin, async (req, res) => {
  if (!allChecked(req.body?.checked)) {
    res.status(400).json({ error: "Tick all four checked boxes before saving" });
    return;
  }
  try {
    const created = await Competition.create({ ...req.body, lastChecked: today() });
    res.status(201).json(created);
  } catch (err) {
    res.status(400).json({ error: err instanceof Error ? err.message : "Could not save" }); //check if the error is an instance of Error and return the message, otherwise return a generic error message
  }
});

app.put("/api/admin/competitions/:id", requireAdmin, async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    res.status(404).json({ error: "Competition not found" });
    return;
  }
  if (!allChecked(req.body?.checked)) {
    res.status(400).json({ error: "Tick all four checked boxes before saving" });
    return;
  }
  try {
    const updated = await Competition.findByIdAndUpdate(
      req.params.id,
      { ...req.body, lastChecked: today() },
      { new: true, runValidators: true }
    );
    if (!updated) {
      res.status(404).json({ error: "Competition not found" });
      return;
    }
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err instanceof Error ? err.message : "Could not save" });
  }
});

app.delete("/api/admin/competitions/:id", requireAdmin, async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    res.status(404).json({ error: "Competition not found" });
    return;
  }
  const gone = await Competition.findByIdAndDelete(req.params.id);
  if (!gone) {
    res.status(404).json({ error: "Competition not found" });
    return;
  }
  res.json({ ok: true });
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