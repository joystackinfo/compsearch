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