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
import { TSelectPurchaseOrderSchema } from "@/db/schema";
import { useGetPurchaseOrders } from "@/features/purchase-orders/api/use-get-orders";

  
  interface DashboardProps {}
  
  const Dashboard: React.FunctionComponent<DashboardProps> = () => {
    const router = useRouter();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedOrderID, setSelectedOrderID] = useState<number>();
    const [isDeletingOrder, setIsDeletingOrder] = useState<boolean>(false);
    const [messageApi, contextHolder] = message.useMessage();
    
    const { mutate } = useDeletePurchaseOrder(selectedOrderID);
    
    const { data, isPending, error, refetch } = useGetPurchaseOrders()

    if (isPending) {
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
  
    if (error) {
      messageApi.open({
        type: "error",
        content: "Error fetching purchase orders",
      });
    }
  
  const orderColumns: ColumnDef<TSelectPurchaseOrderSchema>[] = [
    {
      accessorKey: "PURCHASE_ORDER_NUMBER",
      header: () => <div className="text-xs font-bold">Order ID</div>,
      cell: ({ row }) => {
        return (
          <div className="min-w-[70px] text-[#40474F]">
            {<span className="">#{row.original.id}</span>}
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
      enableColumnFilter: true, // Make sure filtering is enabled for this column
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
          <div className="min-w-[70px]">
            <Button
              variant="ghost"
              className="flex items-center gap-1 p-0 hover:bg-transparent"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              <span className="text-xs font-bold">Quantity</span>
              <SortIcon />
            </Button>
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
          <div className="min-w-[100px]">
            <Button
              variant="ghost"
              className="flex items-center gap-1 p-0 hover:bg-transparent"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              <span className="text-xs font-bold">Unit Cost USD</span>
              <SortIcon />
            </Button>
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
          <div className="min-w-[100px]">
            <Button
              variant="ghost"
              className="flex items-center gap-1 p-0 hover:bg-transparent"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              <span className="text-xs font-bold">Total Cost USD</span>
              <SortIcon />
            </Button>
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
      header: () => <div className="text-xs font-bold">Status</div>,
      cell: ({ row }) => {
        return (
          <div className="text-[#40474F]">
            {row.original.status === "COMPLETED" ? (
              <span className="text-[#10A142] bg-[#EAFFF1] px-3 py-1.5 rounded-[10px] text-xs font-medium">
                {row.original.status}
              </span>
            ) : (
              <span className="text-[#F29425] bg-[#FFF9F0] px-3 py-1.5 rounded-[10px] text-xs font-medium">
                {row.original.status}
              </span>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "action",
      header: () => <div className="text-xs font-bold">Action</div>,
      cell: ({ row }) => {
        return (
          <div className="flex gap-2.5">
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
  
  const handleOrderClick = (id: string) => {
    router.push(`/purchase-orders/${id}`);
  };

  // const handleDeleteOrder = () => {
  //   setIsDeletingOrder(true);

  //   mutate(undefined, {
  //     onSuccess: () => {
  //       refetch();
  //       messageApi.open({
  //         type: "success",
  //         content: "Request deleted successfully",
  //       });
  //       setIsModalOpen(false);
  //       setIsDeletingOrder(false);
  //     },
  //     onError: (err) => {
  //       messageApi.open({
  //         type: "error",
  //         content: err.message,
  //       });
  //       setIsDeletingOrder(false);
  //     },
  //   });
  // };

  const handleDeleteOrder = () => {
    mutate(undefined, {
      onSuccess: () => {
        refetch(); // Ensure refetch is defined and fetches the correct data
        messageApi.open({
          type: "success",
          content: "Purchase order deleted successfully",
        });
        setIsModalOpen(false); // Close the modal after successful deletion
      },
      onError: (err) => {
        messageApi.open({
          type: "error",
          content: err.message || "An error occurred while deleting the purchase order.",
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
            Request and view all procurement requests.
          </p>
        </div>
        {/* <Button
          onClick={handleClick}
          disabled={isLoading}
          className="bg-[rgb(114,1,253)] hover:bg-[#430194] px-4 py-3 rounded-[10px] text-white"
        >
          {
            isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : ("Create Purchase Order")
          }
        </Button> */}
      </div>

      <div className="flex gap-4 mt-4 max-sm:flex-wrap max-sm:gap-5">
        <StatisticsCard
          icon={<TotalOrderIcon />}
          value={(data?.length) ? String(data?.length) : "0"}
          name={`Total order${data && data.length > 1 ? "s" : ""}`}
        />
        <StatisticsCard
        icon={<TotalCostIcon />}
        value={data
          ? data.reduce(
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
          value={String(data
            ? data.filter(
                (order: TSelectPurchaseOrderSchema) =>
                  order.status === "PLANNED"
              ).length
            : 0)}
          name={`Pending order${
            data && data.filter(
              (order: TSelectPurchaseOrderSchema) =>
                order.status === "PLANNED"
            ).length > 1
              ? "s"
              : ""
          }`}
        />
        <StatisticsCard
          icon={<ApprovedOrderIcon />}
          value={String(data
            ? data.filter(
                (order: TSelectPurchaseOrderSchema) =>
                  order.status === "COMPLETED"
              ).length
            : 0)}
          name={`Approved order${
            data && data.filter(
              (order: TSelectPurchaseOrderSchema) =>
                order.status === "COMPLETED"
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
          Recent Purchase Orders
        </p>
        <p className="text-[#64707D] font-light">
          You are viewing Recent Purchase Orders
        </p>
        <div className="rounded-[20px] mt-4">
          <DataTable
            columns={orderColumns}
            data={data || []}
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
