import { useRouter } from "next/navigation";
import { type ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";

import { type DataTableRowAction } from "@/types"
import { DataTableColumnHeader } from "./data-table-column-header";
import { purchaseOrderTable as purchaseOrders, type PurchaseOrder } from "@/db/schema";
import { getStatusIcon } from "../../_lib/utils";
import { PencilIcon, Trash2 } from "lucide-react";
import { formatDate, formatDecimals } from "@/lib/utils";


interface GetColumnsProps {
    setRowAction: React.Dispatch<
    React.SetStateAction<DataTableRowAction<PurchaseOrder> | null>
  >;
  isModalOpen: boolean;
  selectedOrderID: number | undefined;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedOrderID: React.Dispatch<React.SetStateAction<number | undefined>>;
  router: ReturnType<typeof useRouter>;
  }
  
export function getColumns({ 
  setRowAction,
  isModalOpen,
  selectedOrderID,
  setIsModalOpen,
  setSelectedOrderID,
  router
 }: GetColumnsProps): ColumnDef<PurchaseOrder>[] {


return [
    {
    id: "select",
    header: ({ table }) => (
        <Checkbox
        checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-0.5"
        />
    ),
    cell: ({ row }) => (
        <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-0.5"
        />
    ),
    enableSorting: false,
    enableHiding: false,
    },
    {
    accessorKey: "id",
    header: ({ column }) => (
        <DataTableColumnHeader column={column} title="ID" />
    ),
    cell: ({ row }) => <div className="w-20 font-medium text-center">{row.original.id}</div>,
    enableSorting: true,
    enableHiding: true,
    },
    {
        accessorKey: "plannedUnit",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Item Name" />
        ),
        cell: ({ row }) => <div className="flex space-x-2">
            <span className="max-w-[31.25rem] truncate font-medium text-center">
                {row.original.plannedUnit}
            </span>
        </div>,
        enableSorting: true,
        enableHiding: true,
    },
    {
    accessorKey: "itemType",
    header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Item Type" />
    ),
    cell: ({ row }) => <div className="w-20 font-medium text-center">{row.original.itemType}</div>,
    enableSorting: true,
    enableHiding: true,
    },
    {
        accessorKey: "category",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Category" />
        ),
        cell: ({ row }) => <div className="w-20 font-medium text-center">{row.original.category}</div>,
        enableSorting: true,
        enableHiding: true,
    },
    
    {
    accessorKey: "status",
    header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
        const status = purchaseOrders.status.enumValues.find(
        (status) => status === row.original.status
        )

        if (!status) return null

        const Icon = getStatusIcon(status)

        return (

        <div className="flex w-[6.25rem] items-center">
        {row.original.status === "COMPLETED" ? (
        <span className="text-[#10A142] bg-[#EAFFF1] px-3 py-1.5 rounded-[10px] text-xs font-medium text-center">
            {status}
        </span>
        ) : (
        <span className="text-[#F29425] bg-[#FFF9F0] px-3 py-1.5 rounded-[10px] text-xs font-medium text-center">
            {status}
        </span>
        )}
        </div>
        )
    },
    filterFn: (row, id, value) => {
        return Array.isArray(value) && value.includes(row.getValue(id))
    },
    },
    {
    accessorKey: "allocationDepartment",
    header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Department" />
    ),
    cell: ({ row }) => <div className="w-20 font-medium text-center">{row.original.allocationDepartment}</div>,
    enableSorting: true,
    enableHiding: true,
    },
    {
    accessorKey: "packSize",
    header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Pack Size" />
    ),
    cell: ({ row }) => <div className="w-20 font-medium text-center">{row.original.packSize}</div>,
    enableSorting: true,
    enableHiding: true,
    },
    {
    accessorKey: "plannedOrderDate",
    header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Planned Order Date" />
    ),
    cell: ({ row }) => <div className="w-26 font-medium text-center">{formatDate(row.original.plannedOrderDate)}</div>,
    enableSorting: true,
    enableHiding: true,
    },
    {
    accessorKey: "plannedDeliveryDate",
    header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Planned Delivery Date" />
    ),
    cell: ({ row }) => <div className="w-26 font-medium text-center">{formatDate(row.original.plannedDeliveryDate)}</div>,
    enableSorting: true,
    enableHiding: true,
    },
    {
    accessorKey: "plannedQuantity",
    header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Planned Quantity" />
    ),
    cell: ({ row }) => <div className="w-20 font-medium text-center">{row.original.plannedQuantity}</div>,
    enableSorting: true,
    enableHiding: true,
    },
    {
    accessorKey: "revisedQuantity",
    header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Revised Quantity" />
    ),
    cell: ({ row }) => <div className="w-20 font-medium text-center">{row.original.revisedQuantity}</div>,
    enableSorting: true,
    enableHiding: true,
    },
    {
    accessorKey: "secondReview",
    header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Second Review" />
    ),
    cell: ({ row }) => <div className="w-20 font-medium text-center">{row.original.secondReview}</div>,
    enableSorting: true,
    enableHiding: true,
    },
    {
    accessorKey: "unitCost",
    header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Unit Cost" />
    ),
    cell: ({ row }) => <div className="w-20 font-medium text-center">{formatDecimals(row.original.unitCost)}</div>,
    enableSorting: true,
    enableHiding: true,
    },
    {
    accessorKey: "totalCost",
    header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Total Cost" />
    ),
    cell: ({ row }) => <div className="w-20 font-medium text-center">{formatDecimals(Number(row.original.totalCost))}</div>,
    enableSorting: true,
    enableHiding: true,
    },
    {
    accessorKey: "fundingSource",
    header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Funding Source" />
    ),
    cell: ({ row }) => <div className="w-20 font-medium text-center">{row.original.fundingSource}</div>,
    enableSorting: true,
    enableHiding: true,
    },
    {
        accessorKey: "actions",
        header: () => <div className="text-xs font-semibold w-[130px] ml-4">Actions</div>,
        cell: ({ row }) => {
        return (
            <div className="flex gap-2.5">
            {/* <button
                onClick={() =>
                router.push(`/purchase-orders/edit/${row.original.id}`)
                }
            >
                <SearchCheck className="text-[#667185] h-5" />
            </button> */}

            <button
                onClick={() =>
                router.push(`/purchase-orders/edit/${row.original.id}`)
                }
            >
                <PencilIcon className="text-[#667185] h-5" />
            </button>
            
            <button
                onClick={() => {
                setIsModalOpen(true);
                setSelectedOrderID(row.original.id); // here
                }}
            >
                <Trash2 className="text-[#667185] h-5" />
            </button>
            </div>
        );
        },
    },
];
}