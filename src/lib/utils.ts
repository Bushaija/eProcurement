import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function calculateDeliveryStatus(plannedDeliveryDate: string | Date): string {
  const today = new Date();
  const deliveryDate = new Date(plannedDeliveryDate);

  // Calculate the difference in time
  const timeDifference = deliveryDate.getTime() - today.getTime();

  // Convert time difference from milliseconds to days
  const dayDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

  if (dayDifference > 0) {
      return `${dayDifference} days remaining before delivery.`;
  } else if (dayDifference < 0) {
      return `Order delivery delayed by ${Math.abs(dayDifference)} days.`;
  } else {
      return `Delivery is scheduled for today.`;
  }
}

// Example usage:
// console.log(calculateDeliveryStatus('2024-12-05'));

