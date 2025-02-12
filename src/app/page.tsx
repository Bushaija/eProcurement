"use client"

import {
  ApprovedOrderIcon,
  ModalTrashIcon,
  PendingOrderIcon,
  SortIcon,
  TotalCostIcon,
  TotalOrderIcon,
} from "@/assets/icons/icons";
import { Input } from "@/components/ui/input"
import { StatusBarChart } from "@/components/charts/bar-chart";
import { DelaysBarChart } from "@/components/charts/histogram";
import Layout from "@/components/Layout";
import StatisticsCard from "@/components/StatisticsCard";
import { DataTable } from "@/components/table/data-table";
import { Button } from "@/components/ui/button";


import { ColumnDef } from "@tanstack/react-table";
import { Modal, Skeleton, message } from "antd";
import { ArrowUpDown, Loader2, Loader2Icon, PencilIcon, Trash2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useDeletePurchaseOrder } from "@/features/purchase-orders/api/use-delete-order";
import { useGetPurchaseOrder } from "@/features/purchase-orders/api/use-get-order";
import { TSelectPurchaseOrderReviewSchema, TSelectPurchaseOrderSchema } from "@/db/schema";
import { useGetPurchaseOrders } from "@/features/purchase-orders/api/use-get-orders";
import { useGetPurchaseOrderReviews } from "@/features/purchase-order-reviews/api/use-get-reviews";
import { SmallDataTable } from "@/components/ui/table/small-data-table";
import { useMergedPurchaseData } from "@/hooks/use-merge-items-data";
import { useTableColumns } from "@/hooks/use-get-table-columns";

const selectedColumns = [
  "id", 
  "plannedUnit",
  "category", 
  "plannedOrderDate",
  "plannedDeliveryDate",
  "plannedQuantity",
  "unitCost",
  "totalCost",
  "shipmentStatus"
];
  
interface DashboardProps {}
  
const Dashboard: React.FunctionComponent<DashboardProps> = () => {
    const router = useRouter();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedOrderID, setSelectedOrderID] = useState<number>();
    const [isDeletingOrder, setIsDeletingOrder] = useState<boolean>(false);
    const [messageApi, contextHolder] = message.useMessage();
    
    const { mutate } = useDeletePurchaseOrder(selectedOrderID);
    const { 
       data: shipmentData,
       isPending: shipmentIsPending,
       error: shipmentError,
       refetch: shipmentRefetch 
    } = useGetPurchaseOrders()
    const {
        data: filteredData,
        isLoading,
        error,
    } = useMergedPurchaseData(selectedColumns);

    const columns = useTableColumns({
      tableType: "merged",
      selectedColumns,
    });

    const { 
      data: poReviewData, 
      isPending: poReviewIsPending, 
      error: poReviewEror, 
      refetch: poReviewRefetch 
    } = useGetPurchaseOrderReviews()

    if (shipmentIsPending || poReviewIsPending) {
      return (
        <Layout>
          <Skeleton
            className="py-5 px-5 max-sm:px-0"
            active
            paragraph={{ rows: 6 }}
          />
        </Layout>
      );
    }

  
    if (shipmentError || poReviewEror) {
      messageApi.open({
        type: "error",
        content: "Error fetching shipment items",
      });
    }
  
  // const orderColumns: ColumnDef<TSelectPurchaseOrderSchema | TSelectPurchaseOrderReviewSchema>[] = [
  //   {
  //     accessorKey: "id",
  //     header: () => <div className="text-xs font-bold">
  //       Shipment ID
  //     </div>,
  //     cell: ({ row }) => {
  //       return (
  //         <div className="min-w-[80px] text-[#40474F]">
  //           {<span className="">#{row.original.id}</span>}
  //         </div>
  //       );
  //     },
  //   },
  //   {
  //     accessorKey: "plannedUnit",
  //     header: () => <div className="text-xs font-bold">
  //       Item Name
  //     </div>,
  //     cell: ({ row }) => {
  //       return (
  //         <div className="w-[80px] text-[#40474F]">
  //           {
  //             "plannedUnit" in row.original && 
  //             row.original.plannedUnit && 
  //             <span className="">{(row.original.plannedUnit).split(" ").slice(0,3).join(" ")}</span>
  //           }
  //         </div>
  //       );
  //     },
  //   },
  //   {
  //     accessorKey: "category",
  //     header: () => <div className="text-xs font-bold">Category</div>,
  //     cell: ({ row }) => {
  //       return (<div className="text-[#40474F]">
  //         {
  //           "category" in row.original &&
  //           row.original.category &&
  //           <span>{row.original.category}</span>
  //         }
  //       </div>);
  //     },
  //   },
  //   {
  //     accessorKey: "PLANNED_ORDER_DATE",
  //     header: () => <div className="text-xs font-bold">Order Date</div>,
  //     cell: ({ row }) => {
  //       return (
  //         <div className="text-[#40474F] min-w-[100px]">
  //           {
  //             "plannedOrderDate" in row.original &&
  //             new Date(row.original.plannedOrderDate).toLocaleDateString() &&
  //             <span>{new Date(row.original.plannedOrderDate).toLocaleDateString()}</span>
  //           }
  //         </div>
  //       );
  //     },
      
  //   },
  //   {
  //     accessorKey: "PLANNED_DELIVERY_DATE",
  //     header: () => <div className="text-xs font-bold">Delivery Date</div>,
  //     cell: ({ row }) => {
  //       return (
  //         <div className="text-[#40474F] min-w-[100px]">
  //           {
  //             "plannedDeliveryDate" in row.original &&
  //             new Date(row.original.plannedDeliveryDate).toLocaleDateString() &&
  //             <span>{new Date(row.original.plannedOrderDate).toLocaleDateString()}</span>
  //           }
  //         </div>
  //       );
  //     },
  //   },
  //   {
  //     accessorKey: "PLANNED_QUANTITY",
  //     header: ({ column }) => {
  //       return (
  //         <div className="min-w-[70px] text-xs font-bold">
  //             Quantity
  //         </div>
  //       );
  //     },
  //     cell: ({ row }) => {
  //       return (
  //         <div className="text-[#40474F]">
  //           {
  //             "plannedQuantity" in row.original &&
  //             row.original.plannedQuantity.toFixed(2) &&
  //             <span>{row.original.plannedQuantity.toFixed(2)}</span>
  //           }
  //         </div>
  //       );
  //     },
  //   },
  //   {
  //     accessorKey: "UNIT_COST",
  //     header: ({ column }) => {
  //       return (
  //         <div className="text-xs font-bold min-w-[100px]">
  //             <span className="">Unit Cost USD</span>
  //         </div>
  //       );
  //     },
  //     cell: ({ row }) => {
  //       return (
  //         <div className="text-[#40474F]">
  //           {
  //             "unitCost" in row.original &&
  //             row.original.unitCost &&
  //             <span>{row.original.unitCost}</span>
  //           }
  //         </div>
  //       );
  //     },
  //   },
  //   {
  //     accessorKey: "TOTAL_COST",
  //     header: ({ column }) => {
  //       return (
  //         <div className="min-w-[100px] text-xs font-bold">
  //             Total Cost USD
  //         </div>
  //       );
  //     },
  //     cell: ({ row }) => {
  //       return (
  //         <div className="text-[#40474F]">
  //           {
  //             "totalCost" in row.original &&
  //             row.original.totalCost &&
  //             <span>{row.original.totalCost}</span>
  //           }
  //         </div>
  //       );
  //     },
  //   },
  //   {
  //     accessorKey: "shipmentStatus",
  //     header: () => <div className="text-xs text-center font-bold">Status</div>,
  //     cell: ({ row }) => {
  //       return (
  //         <div className="text-[#40474F]">
  //           {
  //               "shipmentStatus" in row.original &&
  //               row.original.shipmentStatus &&
  //               row.original.shipmentStatus
  //           }
  //         </div>
  //       );
  //     },
  //   }
  // ];
  
  return (
    <Layout>
      {contextHolder}
      <div className="flex justify-between items-center">
        <div>
          <p className="text-[#121417] text-2xl font-bold max-sm:text-xl">
            Dashboard
          </p>
          <p className="text-[#64707D] text-sm font-normal max-sm:text-xs">
            Request and view all shipments.
          </p>
        </div>
        
      </div>

      <div className="flex gap-4 mt-4 max-sm:flex-wrap max-sm:gap-5">
        <StatisticsCard
          icon={<TotalOrderIcon />}
          value={(shipmentData?.length) ? String(shipmentData?.length) : "0"}
          name={`Total Shipment item${shipmentData && shipmentData.length > 1 ? "s" : ""}`}
        />
        
        <StatisticsCard
          icon={<TotalCostIcon />}
          value={shipmentData
            ? shipmentData.reduce(
                (acc: number, curr: TSelectPurchaseOrderSchema) =>
                  acc + (curr.totalCost ? curr.totalCost : 0),
                0
              ).toLocaleString("en-US")
            : ""}
          name="Total cost incurred"
          isUSD
        />

        <StatisticsCard
          icon={<PendingOrderIcon />}
          value={String(poReviewData
            ? poReviewData.filter(
                (order: TSelectPurchaseOrderReviewSchema) =>
                  order.shipmentStatus?.toLowerCase().trim() === "planned"
              ).length
            : 0)}
          name={`Planned shipment${
            poReviewData && poReviewData.filter(
              (order: TSelectPurchaseOrderReviewSchema) =>
                order.shipmentStatus?.toLowerCase().trim() === "planned"
            ).length > 1
              ? "s"
              : ""
          }`}
        />

        <StatisticsCard
            icon={<ApprovedOrderIcon />}
            value={String(poReviewData
              ? poReviewData.filter(
                  (order: TSelectPurchaseOrderReviewSchema) =>
                    order.shipmentStatus?.toLowerCase().trim() === "received"
                ).length
              : 0)}
            name={`Received shipment${
              poReviewData && poReviewData.filter(
                (order: TSelectPurchaseOrderReviewSchema) =>
                  order.shipmentStatus?.toLowerCase().trim() === "received"
              ).length > 1
                ? "s"
                : ""
            }`}
        />

      </div>

    <section className="mt-4">
        <p className="text-[#121417] text-[20px] font-semibold">
          Recent Shipment Items
        </p>
        <p className="text-[#64707D] font-light">
          You are viewing Recent Shipment Items
        </p>
        <div className="rounded-[20px] mt-4">
          <SmallDataTable 
            data = {filteredData}
            columns = {columns}
            totalItems = {filteredData.length}
          />
          {/* <DataTable
            showPagination={false}
            columns={orderColumns}
            data={shipmentData || []}
            rowClick={(id: string) => handleOrderClick(id)}
            searchBy="category"
          /> */}
        </div>
    </section>

    </Layout>
  );
};

export default Dashboard;
