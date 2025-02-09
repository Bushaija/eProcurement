import { ColumnDef } from "@tanstack/react-table";
import { TSelectPurchaseOrderReviewSchema, TSelectPurchaseOrderSchema } from "@/db/schema";




export const itemsColumns: ColumnDef<TSelectPurchaseOrderSchema>[] = [
  {
    accessorKey: "item_id",
    header: () => <div className="w-[100px] text-xs font-semibold">Item ID</div>,
    cell: ({ row }) => {
      return <div className="text-[#40474F]">
        {row.original.id}
      </div>
    }
  },
  {
    accessorKey: "itemType",
    header: () => <div className="w-[100px] text-xs font-semibold">
      Item Type
    </div>,
    cell: ({ row }) => {
      return <div className="text-[#40474F]">
        {row.original.itemType}
      </div>
    }
  },
  {
    accessorKey: "category",
    header: () => <div className="w-[100px] text-xs font-semibold">
      Item Category
    </div>,
    cell: ({ row }) => {
      return <div className="text-[#40474F]">
        {row.original.category}
      </div>
    }
  },
  {
    accessorKey: "plannedUnit",
    header: () => <div className="w-[100px] text-xs font-semibold">
      Item Name
    </div>,
    cell: ({ row }) => {
      return <div className="text-[#40474F]">
        {row.original.plannedUnit}
      </div>
    }
  },
  {
    accessorKey: "allocationDepartment",
    header: () => <div className="w-[100px] text-xs font-semibold">
      Division
    </div>,
    cell: ({ row }) => {
      return <div className="text-[#40474F]">
        {row.original.allocationDepartment}
      </div>
    }
  },
  {
    accessorKey: "packSize",
    header: () => <div className="w-[100px] text-xs font-semibold">
      Pack Size
    </div>,
    cell: ({ row }) => {
      return <div className="text-[#40474F]">
        {row.original.packSize}
      </div>
    }
  },
  {
    accessorKey: "plannedOrderDate",
    header: () => <div className="w-[120px] text-xs font-semibold">
      Planned Order Date
    </div>,
    cell: ({ row }) => {
      return <div className="text-[#40474F]">
        {row.original.plannedOrderDate}
      </div>
    }
  },
  {
    accessorKey: "plannedDeliveryDate",
    header: () => <div className="w-[120px] text-xs font-semibold">
      Planned Delivery Date
    </div>,
    cell: ({ row }) => {
      return <div className="text-[#40474F]">
        {row.original.plannedDeliveryDate}
      </div>
    }
  },
  {
    accessorKey: "plannedQuantity",
    header: () => <div className="w-[100px] text-xs font-semibold">Planned QTY</div>,
    cell: ({ row }) => {
      return <div className="text-[#40474F]">
        {row.original.plannedQuantity}
      </div>
    }
  },
  {
    accessorKey: "revisedQuantity",
    header: () => <div className="w-[100px] text-xs font-semibold">
      Revised QTY
    </div>,
    cell: ({ row }) => {
      return <div className="text-[#40474F]">
        {row.original.revisedQuantity}
      </div>
    }
  },
  {
    accessorKey: "secondReview",
    header: () => <div className="w-[100px] text-xs font-semibold">
      Second Review
    </div>,
    cell: ({ row }) => {
      return <div className="text-[#40474F]">
        {row.original.secondReview}
      </div>
    }
  },
  {
    accessorKey: "unitCost",
    header: () => <div className="w-[100px] text-xs font-semibold">
      Unit Cost
    </div>,
    cell: ({ row }) => {
      return <div className="text-[#40474F]">
        {row.original.unitCost}
      </div>
    }
  },
  {
    accessorKey: "totalCost",
    header: () => <div className="w-[100px] text-xs font-semibold">
      Total Cost
    </div>,
    cell: ({ row }) => {
      return <div className="text-[#40474F]">
        {row.original.totalCost}
      </div>
    }
  },
  {
    accessorKey: "fundingSource",
    header: () => <div className="w-[100px] text-xs font-semibold">
      Funding Source
    </div>,
    cell: ({ row }) => {
      return <div className="text-[#40474F]">
        {row.original.fundingSource}
      </div>
    }
  },
  {
    accessorKey: "status",
    header: () => <div className="w-[100px] text-xs font-semibold">
      Status
    </div>,
    cell: ({ row }) => {
      return <div className="text-[#40474F]">
        {row.original.status}
      </div>
    }
  },
];


export const reviewColumns: ColumnDef<TSelectPurchaseOrderReviewSchema>[] = [
    {
      accessorKey: "purchaseOrderId",
      header: () => <div className="w-[100px] text-xs font-semibold">Request ID</div>,
      cell: ({ row }) => {
        return (
          <div className="text-[#40474F]">
            {<span className="">#{row.original.purchaseOrderId}</span>}
          </div>
        );
      },
    },
    {
      accessorKey: "purchaseOrderCreationDate",
      header: () => <div className="w-[100px] text-xs font-semibold">PO creation Date</div>,
      cell: ({ row }) => {
        return (
          <div className="text-[#40474F]">
            {row.original.purchaseOrderCreationDate || "N/A"}
          </div>
        );
      },
    },
    {
      accessorKey: "purchaseOrderNumber",
      header: () => <div className="w-[100px] text-xs font-semibold">
        PO Number
      </div>,
      cell: ({ row }) => {
        return (
          <div className="text-[#40474F]">
            {row.original.purchaseOrderNumber}
          </div>
        );
      },
    },
    {
      accessorKey: "purchaseOrderIssueDate",
      header: () => <div className="w-[120px] text-xs font-semibold">PO Issue Date</div>,
      cell: ({ row }) => {
        return (
          <div className="text-[#40474F]">
            {row.original.purchaseOrderIssueDate || "N/A"}
          </div>
        );
      },
    },
    {
      accessorKey: "readTime",
      header: () => <div className="w-[100px] text-xs font-semibold">Read Time</div>,
      cell: ({ row }) => {
        return (
          <div className="text-[#40474F]">
            {row.original.readTime || "N/A"}
          </div>
        );
      },
    },
    {
      accessorKey: "expectedDeliveryDate",
      header: () => <div className="w-[100px] text-xs font-semibold">EDD</div>,
      cell: ({ row }) => {
        return (
          <div className="text-[#40474F] min-w-[100px]">
            {row.original.expectedDeliveryDate}
          </div>
        );
      },
    },
    {
      accessorKey: "unitPriceDdp",
      header: () => <div className="w-[100px] text-xs font-semibold">Unit Price DDP</div>,
      cell: ({ row }) => {
        return (
          <div className="text-[#40474F] min-w-[100px]">
            {row.original.unitPriceDdp}
          </div>
        );
      },
    },
    {
      accessorKey: "totalCostDdp",
      header: () => <div className="w-[100px] text-xs font-semibold">Total Cost DDP</div>,
      cell: ({ row }) => {
        return (
          <div className="text-[#40474F] min-w-[100px]">
            {row.original.totalCostDdp}
          </div>
        );
      },
    },
    {
      accessorKey: "unitPriceCip",
      header: () => <div className="w-[100px] text-xs font-semibold">Unit Price CIP</div>,
      cell: ({ row }) => {
        return (
          <div className="text-[#40474F] min-w-[100px]">
            {row.original.unitPriceCip}
          </div>
        );
      },
    },
    {
      accessorKey: "totalCostCip",
      header: () => <div className="w-[100px] text-xs font-semibold">Total Cost CIP</div>,
      cell: ({ row }) => {
        return (
          <div className="text-[#40474F] min-w-[100px]">
            {row.original.totalCostCip}
          </div>
        );
      },
    },
    {
      accessorKey: "currency",
      header: () => <div className="w-[100px] text-xs font-semibold">Currency</div>,
      cell: ({ row }) => {
        return (
          <div className="text-[#40474F] min-w-[100px]">
            {row.original.currency}
          </div>
        );
      },
    },
    {
      accessorKey: "orderQuantity",
      header: () => <div className="w-[100px] text-xs font-semibold">Ordered QTY</div>,
      cell: ({ row }) => {
        return (
          <div className="text-[#40474F] min-w-[100px]">
            {row.original.orderQuantity}
          </div>
        );
      },
    },
    {
      accessorKey: "receivedQuantity",
      header: () => <div className="w-[120px] text-xs font-semibold">Received QTY</div>,
      cell: ({ row }) => {
        return (
          <div className="text-[#40474F] min-w-[100px]">
            {row.original.receivedQuantity}
          </div>
        );
      },
    },
    {
      accessorKey: "receivedDate",
      header: () => <div className="w-[120px] text-xs font-semibold">Received Date</div>,
      cell: ({ row }) => {
        return (
          <div className="text-[#40474F] min-w-[100px]">
            {row.original?.receivedDate || "N/A"}
          </div>
        );
      },
    },
    {
      accessorKey: "balancedQuantity",
      header: () => <div className="w-[120px] text-xs font-semibold">Balanced QTY</div>,
      cell: ({ row }) => {
        return (
          <div className="text-[#40474F] min-w-[100px]">
            {row.original.balancedQuantity}
          </div>
        );
      },
    },
    {
      accessorKey: "shipmentStatus",
      header: () => <div className="w-[100px] text-xs font-semibold">Shipment Status</div>,
      cell: ({ row }) => {
        return (
          <div className="text-[#40474F] min-w-[100px]">
            {row.original.shipmentStatus}
          </div>
        );
      },
    },
    {
      accessorKey: "comments",
      header: () => <div className="w-[100px] text-xs font-semibold">Comments</div>,
      cell: ({ row }) => {
        return (
          <div className="text-[#40474F] min-w-[100px]">
            {row.original.comments}
          </div>
        );
      },
    },
  ];


  