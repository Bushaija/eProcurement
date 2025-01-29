import { Icons } from '@/components/icons';
import type { ColumnSort, Row } from "@tanstack/react-table"
import { type DataTableConfig } from "@/config/data-table";
import { type filterSchema } from "@/lib/parsers"
import { z } from 'zod';
import { Item } from '@radix-ui/react-select';
import { it } from 'node:test';
import { useGetTotalCostByPlannedOrderDate } from '@/features/analytics/api/cost-analysis/use-get-total-cost-by-planned-order-date';


// file upload

export interface UploadedFile<T = unknown> {
  id: string; // Unique identifier for the file
  name: string; // Original file name
  size: number; // File size in bytes
  type: string; // MIME type of the file
  url: string; // Publicly accessible URL or path to the file
  metadata?: T; // Additional optional metadata (e.g., user info, tags, etc.)
  uploadedAt: Date; // Timestamp of upload
}



// ====


// metrics

// schemas.ts

// Metrics schema for delay responses


export const MetricsSchema = z.array(
  z.object({
    itemId: z.number(),
    itemName: z.string(),
    itemType: z.string(),
    category: z.string(),
    department: z.string(),
    shipmentStatus: z.string(),
    plannedOrderDate: z.date(),
    purchaseOrderCreationDate: z.date(),
    expectedDeliveryDate: z.date(),
    receivedDate: z.date(),
    delay: z.number(),
  })
);


// =======


export type TotalCostByQuarter = {
  quarter: number;
  totalCost: number;
};


export interface NavItem {
  title: string;
  url: string;
  disabled?: boolean;
  external?: boolean;
  shortcut?: [string, string];
  icon?: keyof typeof Icons;
  label?: string;
  description?: string;
  isActive?: boolean;
  items?: NavItem[];
}

export type purchaseOrderStatus = "PLANNED" | "APPROVED" | "REJECTED" | "SUBMITTED" | "COMPLETED";

export type PurchaseOrderReviewStatus = 'ORDERED' | 'PLANNED' | 'CANCELLED' | 'RECEIVED' | 'HOLD' | 'PARTIAL RECEIVED';

// export interface PurchaseOrderDetails {
//   id: string; // Primary key ID as a serial integer
//   procurement_request_id: string; // Foreign key linking to procurementRequestTable
//   po_number: string; // Unique purchase order number
//   po_issue_date?: string; // Issue date of the purchase order in ISO format
//   po_creation_date?: string; // Creation date of the purchase order, defaults to now
//   read_time?: string | null; // Timestamp of when the order was read, optional
//   expected_delivery_date: string; // Expected delivery date in ISO format
//   unit_price_ddp?: number | null; // Unit price delivered duty paid, optional
//   total_cost_ddp?: number | null; // Total cost delivered duty paid, optional
//   unit_price_cip?: number | null; // Unit price cost insurance paid, optional
//   total_cost_cip?: number | null; // Total cost cost insurance paid, optional
//   currency?: string; // Currency, defaults to 'USD' if not specified
//   order_quantity: number; // Total order quantity, required
//   received_quantity?: number; // Quantity received, default is 0 if not provided
//   received_date?: string | null; // Date of receipt in ISO format, optional
//   balanced_quantity?: number | null; // Calculated balanced quantity, optional
//   shipment_status: 'ORDERED' | 'PLANNED' | 'CANCELLED' | 'RECEIVED' | 'HOLD' | 'PARTIAL RECEIVED'; // Shipment status with specific allowed values
//   comments?: string | null; // Additional comments, optional
//   created_at?: string; // Record creation timestamp, defaults to now
//   updated_at?: string; // Record update timestamp, defaults to now
// }

export interface PurchaseOrderDetails {
  category: string;
  plannedUnit: string;
  allocationDepartment: string;
  packSize: string;
  plannedOrderDate: Date;
  plannedDeliveryDate: Date;
  plannedQuantity: number;
  revisedQuantity: number;
  secondReview: number;
  unitCost: number;
  totalCost: number;
  fundingSource: string;
  status: "PLANNED" | "APPROVED" | "REJECTED" | "SUBMITTED" | "COMPLETED"
}

export interface SearchParams {
  [key: string]: string | string[] | undefined
}


// doing: fixing the table

export type FilterOperator = DataTableConfig["globalOperators"][number]

export type ColumnType = DataTableConfig["columnTypes"][number]

export type Prettify<T> = {
  [K in keyof T]: T[K]
} & {}

export type Filter<TData> = Prettify<
  Omit<z.infer<typeof filterSchema>, "id"> & {
    id: StringKeyOf<TData>
  }
>

export interface Option {
  label: string
  value: string
  icon?: React.ComponentType<{ className?: string }>
  count?: number
}

export interface DataTableRowAction<TData> {
  row: Row<TData>
  type: "update" | "delete"
};

export type StringKeyOf<TData> = Extract<keyof TData, string>

export interface DataTableFilterField<TData> {
  id: StringKeyOf<TData>
  label: string
  placeholder?: string
  options?: Option[]
}

export interface ExtendedColumnSort<TData> extends Omit<ColumnSort, "id"> {
  id: StringKeyOf<TData>
}

export type ExtendedSortingState<TData> = ExtendedColumnSort<TData>[]


