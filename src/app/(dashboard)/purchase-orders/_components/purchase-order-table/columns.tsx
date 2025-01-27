'use client';
import { Checkbox } from '@/components/ui/checkbox';
import { type PurchaseOrder } from '@/db/schema';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';

export const columns: ColumnDef<PurchaseOrder>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: 'purchase_order_number',
    header: 'Purchase Order Number'
  },
  {
    accessorKey: 'category',
    header: 'Category'
  },
  {
    accessorKey: 'plannedUnit',
    header: 'Item Name'
  },
  {
    accessorKey: 'status',
    header: 'Status'
  },
  {
    accessorKey: 'allocationDepartment',
    header: 'Department'
  },
  {
    accessorKey: 'packSize',
    header: 'Pack Size'
  },
  {
    accessorKey: 'plannedOrderDate',
    header: 'Planned Order Date'
  },
  {
    accessorKey: 'plannedDeliveryDate',
    header: 'Planned Delivery Date'
  },
  {
    accessorKey: 'plannedQuantity',
    header: 'Planned Quantity'
  },
  {
    accessorKey: 'revisedQuantity',
    header: 'Revised Quantity'
  },
  {
    accessorKey: 'secondReview',
    header: 'Second Review'
  },
  {
    accessorKey: 'unitCost',
    header: 'Unit Cost'
  },
  {
    accessorKey: 'totalCost',
    header: 'Total Cost'
  },
  {
    accessorKey: 'fundingSource',
    header: 'Funding Source'
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
