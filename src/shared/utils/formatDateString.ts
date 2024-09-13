export function formatDateString(date: Date | null) {
  if (!date) return "null";
  return new Date(date).toLocaleString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}
