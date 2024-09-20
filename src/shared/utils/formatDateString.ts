export function formatDateString(
  date: Date | null,
  options?: {
    month?: "short" | "long";
    day?: "numeric" | "2-digit";
    year?: "numeric" | "2-digit";
  },
) {
  if (!date) return "null";
  return new Date(date).toLocaleString("en-US", {
    month: options?.month || "long",
    day: options?.day || "numeric",
    year: options?.year || "numeric",
  });
}
