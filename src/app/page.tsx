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
  
  const orderColumns: ColumnDef<TSelectPurchaseOrderSchema>[] = [
    {
      accessorKey: "PURCHASE_ORDER_NUMBER",
      header: () => <div className="text-xs font-bold">
        Shipment ID
      </div>,
      cell: ({ row }) => {
        return (
          <div className="min-w-[80px] text-[#40474F]">
            {<span className="">#{row.original.id}</span>}
          </div>
        );
      },
    },
    {
      accessorKey: "ITEM_NAME",
      header: () => <div className="text-xs font-bold">
        Item Name
      </div>,
      cell: ({ row }) => {
        return (
          <div className="w-[80px] text-[#40474F]">
            {<span className="">{(row.original.plannedUnit).split(" ").slice(0,3).join(" ")}</span>}
          </div>
        );
      },
    },
    {
      accessorKey: "category",
      header: () => <div className="text-xs font-bold">Category</div>,
      cell: ({ row }) => {
        return <div className="text-[#40474F]">{row.original.category}</div>;
      },
    },
    {
      accessorKey: "PLANNED_ORDER_DATE",
      header: () => <div className="text-xs font-bold">Order Date</div>,
      cell: ({ row }) => {
        return (
          <div className="text-[#40474F] min-w-[100px]">
            {new Date(row.original.plannedOrderDate).toLocaleDateString()}
          </div>
        );
      },
      
    },
    {
      accessorKey: "PLANNED_DELIVERY_DATE",
      header: () => <div className="text-xs font-bold">Delivery Date</div>,
      cell: ({ row }) => {
        return (
          <div className="text-[#40474F] min-w-[100px]">
            {new Date(row.original.plannedDeliveryDate).toLocaleDateString()}
          </div>
        );
      },
    },
    {
      accessorKey: "PLANNED_QUANTITY",
      header: ({ column }) => {
        return (
          <div className="min-w-[70px] text-xs font-bold">
              Quantity
          </div>
        );
      },
      cell: ({ row }) => {
        return (
          <div className="text-[#40474F]">
            {`${row.original.plannedQuantity.toFixed(2)}`}
          </div>
        );
      },
    },
    {
      accessorKey: "UNIT_COST",
      header: ({ column }) => {
        return (
          <div className="text-xs font-bold min-w-[100px]">
              <span className="">Unit Cost USD</span>
          </div>
        );
      },
      cell: ({ row }) => {
        return (
          <div className="text-[#40474F]">
            {`${row.original.unitCost}`}
          </div>
        );
      },
    },
    {
      accessorKey: "TOTAL_COST",
      header: ({ column }) => {
        return (
          <div className="min-w-[100px] text-xs font-bold">
              Total Cost USD
          </div>
        );
      },
      cell: ({ row }) => {
        return (
          <div className="text-[#40474F]">
            {`${row.original.totalCost}`}
          </div>
        );
      },
    },
    {
      accessorKey: "STATUS",
      header: () => <div className="text-xs text-center font-bold">Status</div>,
      cell: ({ row }) => {
        return (
          <div className="text-[#40474F]">
            {row.original.status === "COMPLETED" ? (
              <span className="text-[#10A142] bg-[#EAFFF1] px-3 py-1.5 rounded-[10px] text-xs font-medium">
                {row.original.status}
              </span>
            ) : (
              <span className="text-[#F29425] text-center bg-[#FFF9F0] px-3 py-1.5 rounded-[10px] text-xs font-medium">
                {row.original.status}
              </span>
            )}
          </div>
        );
      },
    }
  ];
  
  const handleOrderClick = (id: string) => {
    router.push(`/purchase-orders/${id}`);
  };

  const handleDeleteOrder = () => {
    mutate(undefined, {
      onSuccess: () => {
        poReviewRefetch();
        poReviewRefetch();
        messageApi.open({
          type: "success",
          content: "shipment items deleted successfully",
        });
        setIsModalOpen(false);
      },
      onError: (err) => {
        messageApi.open({
          type: "error",
          content: err.message || "An error occurred while deleting the shipment items.",
        });
      },
    });
  };

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
                  order.shipmentStatus.toLowerCase().trim() === "received"
              ).length
            : 0)}
          name={`Received shipment${
            poReviewData && poReviewData.filter(
              (order: TSelectPurchaseOrderReviewSchema) =>
                order.shipmentStatus.toLowerCase().trim() === "received"
            ).length > 1
              ? "s"
              : ""
          }`}
        />
      </div>

    {/* <section className="w-[950px] h-[290px] mt-4">
      <DelaysBarChart />
    </section> */}

    <section className="mt-4">
        <p className="text-[#121417] text-[20px] font-semibold">
          Recent Shipment Items
        </p>
        <p className="text-[#64707D] font-light">
          You are viewing Recent Purchase Orders
        </p>
        <div className="rounded-[20px] mt-4">
          <DataTable
            showPagination={false}
            columns={orderColumns}
            data={shipmentData || []}
            rowClick={(id: string) => handleOrderClick(id)}
            searchBy="category"
          />
        </div>
      {/* <div className="">
        <StatusBarChart />
      </div> */}
    </section>

      <Modal
        closeIcon={null}
        width={338}
        centered
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={() => (
          <div className="flex justify-center">
            <button
              onClick={() => setIsModalOpen(false)}
              className="px-6 py-2 bg-white border border-[rgba(23,23,31,0.10)] shadow-[0px_1px_1px_0px_rgba(18,18,18,0.10),0px_0px_0px_1px_rgba(18,18,18,0.07),0px_1px_3px_0px_rgba(18,18,18,0.10)] border-solid rounded-[10px] border-[#17171f1a]"
            >
              No, Cancel
            </button>
            <button
              onClick={handleDeleteOrder}
              className="px-8 py-2 deleteBtn ml-4"
              disabled={isDeletingOrder}
            >
              {isDeletingOrder ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                "Yes, Delete"
              )}
            </button>
          </div>
        )}
      >
        <div className="text-center">
          <div className="flex justify-center mb-5">
            <ModalTrashIcon />
          </div>
          <p className="text-[#121417] text-lg font-semibold mb-2">
            Delete Purchase Order
          </p>
          <p className="text-sm text-[#64707D] mb-6">
            Are you sure you want to delete this purchase order?
          </p>
        </div>
      </Modal>
    </Layout>
  );
};

export default Dashboard;
