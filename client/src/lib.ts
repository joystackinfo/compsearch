export const typeColors: Record<string, string> = {
  writing: "#38BDF8",
  essay: "#22F2A3",
  fiction: "#A78BFA",
  math: "#FB923C",
  art: "#F472B6",
  business: "#A3E635",
  coding: "#818CF8",
  science: "#2DD4BF",
  mixed: "#94A3B8",
};

export function daysLeft(deadline: string): number {
  const end = new Date(`${deadline}T23:59:59`);
  return Math.ceil((end.getTime() - Date.now()) / 86_400_000);
}

export type Competition = {
  _id: string;
  name: string;
  organizer: string;
  type: string;
  officialUrl: string;
  deadline?: string;
  minAge?: number;
  maxAge?: number;
  cost?: string;
  prize?: string;
  lastChecked: string;
    deadlineTime?: string;
  deadlineTimezone?: string;
  resultDate?: string;
  ageCountedOn?: string;
  minGrade?: number;
  maxGrade?: number;
  checked?: { dates: boolean; eligibility: boolean; theme: boolean; cost: boolean };
};
export const getToken = () => localStorage.getItem("token") ?? "";
export const setToken = (t: string) => localStorage.setItem("token", t);
export const clearToken = () => localStorage.removeItem("token");