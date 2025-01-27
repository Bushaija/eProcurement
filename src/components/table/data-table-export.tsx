import React from 'react'
import { exportTableToCSV } from "@/lib/export";
import { Button } from '../ui/button';
import { Download } from 'lucide-react';
import { type Table } from '@tanstack/react-table';
import { PurchaseOrder } from '@/db/schema';

interface PurchaseOrderTableProps {
    table: Table<PurchaseOrder>
};

export const DataTableExport = ({ table, }: PurchaseOrderTableProps) => {
  return (
    <div>
        <Button
        variant="outline"
        size="sm"
        onClick={() =>
          exportTableToCSV(table, {
            filename: "purchase-orders",
            excludeColumns: ["select", "actions"]
          })
        }
        className="gap-2"
      >
        <Download className="size-4" aria-hidden="true" />
        Export
      </Button>
    </div>
  )
}
