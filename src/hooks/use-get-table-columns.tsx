import { useMemo } from "react";
import { itemsColumns, reviewColumns } from "./table-columns";
import { ColumnDef } from "@tanstack/react-table";
import { TSelectPurchaseOrderReviewSchema, TSelectPurchaseOrderSchema } from "@/db/schema";

// Define valid table types for type safety
type TableType = "items" | "reviews" | "merged";

// Define column map for better maintainability
const columnsMap: Record<TableType, ColumnDef<any>[]> = {
  items: itemsColumns,
  reviews: reviewColumns,
  merged: [...itemsColumns, ...reviewColumns],
};

// Hook to get table columns dynamically
export const useTableColumns = ({
  tableType,
  selectedColumns,
}: {
  tableType: TableType;
  selectedColumns?: string[];
}) => {
  return useMemo(() => {
    let columns = columnsMap[tableType] ?? [];

    // Filter and reorder columns if selectedColumns is provided
    if (selectedColumns?.length) {
      columns = selectedColumns
        .map((col) => columns.find((column) => column.accessorKey === col))
        .filter((col): col is ColumnDef<any> => !!col); // Remove undefined values
    }

    return columns;
  }, [tableType, selectedColumns]);
};
