import { Schema, model } from "mongoose";

export interface ICompetition {
  name: string;
  organizer: string;
  type: "essay" | "writing" | "fiction" | "math" | "coding" | "business" | "science" | "art" | "mixed";
  officialUrl: string;
  deadline?: string;
  minAge?: number;
  maxAge?: number;
  cost?: string;
  prize?: string;
  lastChecked: string;
}

const competitionSchema = new Schema<ICompetition>({
  name: { type: String, required: true },
  organizer: { type: String, required: true },
  type: {
    type: String,
    enum: ["essay", "writing", "fiction", "math", "coding", "business", "science", "art", "mixed"],
    required: true,
  },
  officialUrl: { type: String, required: true },
  deadline: String,
  minAge: Number,
  maxAge: Number,
  cost: String,
  prize: String,
  lastChecked: { type: String, required: true },
});

export const Competition = model<ICompetition>("Competition", competitionSchema);