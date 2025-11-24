// lib/format.ts
export function formatCurrency(value: number | string) {
  const number = typeof value === "string" ? parseFloat(value) : value;

  if (isNaN(number)) return "Rp0";

  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(number);
}
