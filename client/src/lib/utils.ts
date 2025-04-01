import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns";

/**
 * Combine and merge class names with Tailwind CSS
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a date to a more readable format
 */
export function formatDate(date: Date): string {
  return format(date, "EEEE, MMMM d, yyyy");
}

/**
 * Get greeting based on time of day
 */
export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

/**
 * Format time (HH:MM) to 12-hour format with AM/PM
 */
export function formatTime(timeString: string | null): string {
  if (!timeString) return "Any time";
  
  const [hours, minutes] = timeString.split(':');
  const hour = parseInt(hours, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const formattedHour = hour % 12 || 12;
  
  return `${formattedHour}:${minutes} ${ampm}`;
}

/**
 * Calculate streak emoji based on streak length
 */
export function getStreakEmoji(streak: number): string {
  if (streak <= 0) return "🔥";
  if (streak < 5) return "🔥";
  if (streak < 10) return "🔥🔥";
  if (streak < 20) return "🔥🔥🔥";
  return "🔥🔥🔥🔥";
}

/**
 * Truncate text with ellipsis if longer than maxLength
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}
