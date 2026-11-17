import "dotenv/config";
import mongoose from "mongoose";
import { Competition, ICompetition } from "./models/Competition";

const samples: ICompetition[] = [
  {
    name: "Stories From Nigeria",
    organizer: "Stories From Nigeria",
    type: "writing",
    officialUrl: "https://storiesfromnigeria.org/submissions",
    deadline: "2026-11-15",
    countries: ["NG"],
    prize: "1st ₦200,000",
    lastChecked: "2026-11-06",
  },
  {
    name: "Berkeley Math Tournament Online",
    organizer: "Berkeley Math Tournament",
    type: "math",
    officialUrl: "https://berkeley.mt/events/bmt-2026-online/",
    deadline: "2026-11-27",
    cost: "$8 per student in 2025",
    maxGrade: 12,
    prize: "Not listed",
    lastChecked: "2026-11-06",
  },
  {
    name: "IEOx Essay Challenge 2026/27",
    organizer: "IEOx Community",
    type: "essay",
    officialUrl: "https://ieo-official.org",
    deadline: "2026-12-15",
    ageCountedOn: "2027-06-30",
    minGrade: 9,
    maxGrade: 12,
    team: { min: 1, max: 3 },
    maxAge: 19,
    cost: "Free",
    prize: "Not listed",
    lastChecked: "2026-11-06",
  },
  {
    name: "Harvard International Review Writing Contest",
    organizer: "Harvard International Review",
    type: "writing",
    officialUrl: "https://hir.harvard.edu/contest",
    deadline: "2027-01-02",
    minGrade: 7,
    maxGrade: 12,
    prize: "Not listed",
    lastChecked: "2026-11-06",
  },
  {
    name: "Diamond Challenge 2026-27",
    organizer: "Horn Entrepreneurship, University of Delaware",
    type: "business",
    officialUrl: "https://horn.udel.edu",
    deadline: "2027-01-14",
    minAge: 14,
    maxAge: 18,
    ageCountedOn: "2027-01-14",
     minGrade: 9,
      maxGrade: 12,
       team: { min: 2, max: 4, adultAdvisor: true },
    cost: "Free",
    prize: "1st $12,000 per track",
    lastChecked: "2026-11-06",
  },
];

async function seed() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is missing in .env"); // Check for the environment variable
  await mongoose.connect(uri);
  await Competition.deleteMany({}); // Clear existing competitions
  await Competition.insertMany(samples);
  console.log(`Added ${samples.length} competitions`); // Log the number of competitions added
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});