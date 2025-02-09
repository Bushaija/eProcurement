import { parse } from "csv-parse/sync"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatBytes(
  bytes: number,
  opts: {
    decimals?: number
    sizeType?: "accurate" | "normal"
  } = {}
) {
  const { decimals = 0, sizeType = "normal" } = opts

  const sizes = ["Bytes", "KB", "MB", "GB", "TB"]
  const accurateSizes = ["Bytes", "KiB", "MiB", "GiB", "TiB"]
  if (bytes === 0) return "0 Byte"
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return `${(bytes / Math.pow(1024, i)).toFixed(decimals)} ${
    sizeType === "accurate"
      ? (accurateSizes[i] ?? "Bytest")
      : (sizes[i] ?? "Bytes")
  }`
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
export interface Transaction {
  label: string;
  note: string;
  category: string;
  amount: number;
  date: Date;
};

export const filters = ["7D", "1M", "6M", "1Y", "All"];

export function filterData(data: Transaction[], filter: string) {
  const now = new Date();
  let startDate: Date;

  switch(filter) {
    case "7D":
      startDate = new Date(now.setDate(now.getDate() - 7));
      break;
    case "1M":
      startDate = new Date(now.setMonth(now.getMonth() - 1));
      break;
    case "6M":
      startDate = new Date(now.setMonth(now.getMonth() - 6));
      break;
    case "1Y":
      startDate = new Date(now.setMonth(now.getFullYear() - 1));
      break;
    case "ALL":
      startDate = new Date(0);
      break;
    default:
      startDate = new Date(0);

    return data 
      .filter((item) => new Date(item.date) >= startDate)
      .sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  }
}

export function formatDate(
  date: Date | string | number,
  opts: Intl.DateTimeFormatOptions = {}
) {
  return new Intl.DateTimeFormat("en-US", {
    month: opts.month ?? "long",
    day: opts.day ?? "numeric",
    year: opts.year ?? "numeric",
    ...opts,
  }).format(new Date(date))
}

/**
 * Formats a given value to 4 decimal places.
 *
 * @param value - The number to be formatted.
 * @returns The formatted number with 4 decimal places.
 */
export function formatDecimals(value: number): number {
  return parseFloat(value.toFixed(4));
}

export const toTitleCase = (input: string): string => {
  return input
    .toLowerCase() // Convert the entire string to lowercase
    .split(" ") // Split the string into words
    .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize the first letter of each word
    .join(" "); // Join the words back together
};



// Example usage:
// console.log(calculateDeliveryStatus('2024-12-05'));


export interface InputData {
  category: string;
  plannedUnit: string;
  allocationDepartment: string;
  packSize: string;
  plannedOrderDate: string; // Format as "YYYY-MM-DD"
  plannedDeliveryDate: string; // Format as "YYYY-MM-DD"
  plannedQuantity: number;
  revisedQuantity: number;
  secondReview: number;
  unitCost: number;
  totalCost?: number;
  fundingSource?: string;
  status: string;
}

export function formatInputData(data: InputData): Record<string, any> {
  return {
    category: data.category.trim(),
    plannedUnit: data.plannedUnit.trim(),
    allocationDepartment: data.allocationDepartment.trim(),
    packSize: data.packSize.trim(),
    plannedOrderDate: new Date(data.plannedOrderDate).toISOString().split("T")[0], // Ensure YYYY-MM-DD
    plannedDeliveryDate: new Date(data.plannedDeliveryDate).toISOString().split("T")[0],
    plannedQuantity: Math.max(0, data.plannedQuantity), // Prevent negative values
    revisedQuantity: Math.max(0, data.revisedQuantity), // Prevent negative values
    secondReview: Math.max(0, data.secondReview), // Prevent negative values
    unitCost: parseFloat(data.unitCost.toFixed(2)), // Ensure 2 decimal places
    totalCost: data.totalCost ? parseFloat(data.totalCost.toFixed(2)) : undefined,
    fundingSource: data.fundingSource?.trim() || null,
    status: data.status.toUpperCase(), // Normalize enum value to uppercase
  };
}

export function formatCsvRows(csvData: any, formatFn: (data: InputData) => Record<string, any>) {
  // Parse CSV into an array of objects
  const parsedRows: InputData[] = parse(csvData, {
    columns: true, // Parse header row as object keys
    skip_empty_lines: true,
  });

  // Map each row to the formatting function
  return parsedRows.map((row) => formatFn(row));
}


export function aggregateByKey<T>(
  data: T[],
  key: keyof T,
  valueKey: keyof T
): T[] {
  return Object.values(
    data.reduce((acc, item) => {
      const groupKey = item[key] as string; // Convert key value to string
      const value = Number(item[valueKey]); // Convert value to number

      acc[groupKey] = acc[groupKey] || { ...item, [valueKey]: 0 };
      acc[groupKey][valueKey] = (acc[groupKey][valueKey] as number) + value;
      
      return acc;
    }, {} as Record<string, T>)
  );
}


export function transformAggregatedData<T extends Record<string, any>>(
  data: T[],
  key: keyof T,
  valueKey: keyof T
): Record<string, number> {
  return data.reduce((acc, item) => {
    const formattedKey = formatKey(item[key] as string);
    acc[formattedKey] = item[valueKey] as number;
    return acc;
  }, {} as Record<string, number>);
}

// Helper function to format keys (e.g., convert 'non-medical' to 'nonMedical')
function formatKey(key: string): string {
  return key.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase()); // Convert kebab-case to camelCase
}


export function transformDeliveryDates<T extends Record<string, any>>(
  data: T[],
  dateKey: keyof T
): T[] {
  return data.map((item) => {
    const dateStr = item[dateKey] as string;
    const [year, month] = dateStr.split("-");
    const shortYear = year.slice(-2); // Get last two digits of the year
    const monthAbbr = new Date(`${year}-${month}-01`).toLocaleString("en-US", { month: "short" });

    return { ...item, [dateKey]: `${monthAbbr}-${shortYear}` };
  });
}




