import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { User } from "./models/User";

async function main() {
  const [rawEmail, password] = process.argv.slice(2);
  if (!rawEmail || !password || password.length < 12) {
    throw new Error("Usage: npx tsx src/createAdmin.ts EMAIL PASSWORD (12 or more characters)"); // error message if email or password is missing or password is too short
  }
  const email = rawEmail.toLowerCase().trim();
  const uri = process.env.MONGODB_URI; 
  if (!uri) throw new Error("MONGODB_URI is missing in .env");
  await mongoose.connect(uri);
  const passwordHash = await bcrypt.hash(password, 12);
  await User.findOneAndUpdate(
    { email },
    { email, passwordHash, role: "admin" },
    { upsert: true }
  );
  console.log("Admin ready:", email);
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});