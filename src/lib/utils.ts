import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// place decimals
export function formatStringNumberWithCommas(
  value: string | number | undefined,
  decimals: number = 2
): string {
  if (value === undefined || value === null) return "";

  // Convert number to string if needed
  const num = typeof value === "number" ? value : parseFloat(value);

  if (isNaN(num)) return "";

  return num.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  });
}

export const formatDate = (date: Date) => {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};
