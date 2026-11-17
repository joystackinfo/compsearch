import { Schema, model } from "mongoose";

export interface IUser {
  email: string;
  passwordHash: string;
  role: "student" | "admin"; //two roles are available: student and admin
}

const userSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ["student", "admin"], default: "student" },
});

export const User = model<IUser>("User", userSchema);