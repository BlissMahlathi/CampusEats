import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind and custom classes.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a number as South African Rand currency.
 */
export function formatCurrency(amount: number): string {
  if (typeof amount !== "number" || isNaN(amount)) return "R0.00";
  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    minimumFractionDigits: 2,
  }).format(amount);
}

/**
 * Generate a WhatsApp link with a pre-filled message.
 * @param phone - The phone number (with or without country code)
 * @param message - The message to send
 * @returns WhatsApp link or empty string if phone is invalid
 */
export function generateWhatsAppLink(phone: string, message: string): string {
  if (!phone) return "";
  // Remove any non-digit characters and trim whitespace
  const cleanPhone = phone.replace(/\D/g, "").trim();

  if (!cleanPhone) return "";

  // Ensure the phone number has the country code (South Africa: 27)
  const formattedPhone = cleanPhone.startsWith("27")
    ? cleanPhone
    : `27${cleanPhone.startsWith("0") ? cleanPhone.substring(1) : cleanPhone}`;

  // Encode the message for URL
  const encodedMessage = encodeURIComponent(message || "");

  return `https://wa.me/${formattedPhone}?text=${encodedMessage}`;
}
