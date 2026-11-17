import { Schema, model } from "mongoose";

export interface ICompetition {
  name: string;
  organizer: string;
  type: "essay" | "writing" | "fiction" | "math" | "coding" | "business" | "science" | "art" | "mixed";
  officialUrl: string;
  deadline?: string;
  deadlineTime?: string;
  deadlineTimezone?: string;
  resultDate?: string;
  timeline?: { date: string; label: string }[];
  minAge?: number;
  maxAge?: number;
    ageCountedOn?: string;
  minGrade?: number;
  maxGrade?: number;
  countries?: string[];
  team?: { min: number; max: number; adultAdvisor?: boolean };
  notes?: string[];
  cost?: string;
  prize?: string;
  checked?: { dates: boolean; eligibility: boolean; theme: boolean; cost: boolean };
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
  deadlineTime: String,
  deadlineTimezone: String,
  resultDate: String,
  timeline: { type: [{ _id: false, date: String, label: String }], default: [] },
  minAge: Number,
  maxAge: Number,
  ageCountedOn: String,
  minGrade: Number, // Added minGrade field
  maxGrade: Number,
  countries: { type: [String], default: [] },
  team: { min: Number, max: Number, adultAdvisor: Boolean },
  notes: { type: [String], default: [] },
  cost: String,
  prize: String,
  checked: {
    dates: { type: Boolean, default: false },
    eligibility: { type: Boolean, default: false },
    theme: { type: Boolean, default: false },
    cost: { type: Boolean, default: false },
  },
  lastChecked: { type: String, required: true },
});

export const Competition = model<ICompetition>("Competition", competitionSchema);