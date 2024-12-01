"use client"

import {
  ModalTrashIcon,
  SortIcon,
} from "@/assets/icons/icons";
import { DataTable } from "@/components/table/data-table";
import { Button } from "@/components/ui/button";
import { TSelectPurchaseOrderSchema } from "@/db/schema";
import { useDeletePurchaseOrder } from "@/features/purchase-orders/api/use-delete-order";
import { useGetPurchaseOrders } from "@/features/purchase-orders/api/use-get-orders";

import { ColumnDef } from "@tanstack/react-table";
import { Modal, Skeleton, message } from "antd";
import { Loader2, PencilIcon, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";


const PURCHASE_ORDER_OPTIONS = [
  { value: "ORDERED", label: 'ORDERED'},
  { value: "PLANNED", label: 'PLANNED'},
  { value: "CANCELLED", label: 'CANCELLED'},
  { value: "RECEIVED", label: 'RECEIVED'},
  { value: "HOLD", label: 'HOLD'},
  { value: "PARTIAL RECEIVED", label: 'PARTIAL RECEIVED'},
]



  interface DashboardProps {}
  
  const PurchaseOrdersPage: React.FunctionComponent<DashboardProps> = () => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedOrderID, setSelectedOrderID] = useState<number>();
    const [isDeletingOrder, setIsDeletingOrder] = useState<boolean>(false);
    const [messageApi, contextHolder] = message.useMessage();

    const { data, isPending, error, refetch } = useGetPurchaseOrders()
    const { mutate} = useDeletePurchaseOrder(selectedOrderID);
  
    if (isPending) {
      return (
        <>
          <Skeleton
            className="py-5 px-5 max-sm:px-0"
            active
            paragraph={{ rows: 6 }}
          />
        </>
      );
    }

    if (error) {
      messageApi.open({
        type: "error",
        content: "Error fetching orders",
      });
    }
    
    const handleClick = async () => {
      setIsLoading(true);
      await router.push("/purchase-orders/new");
      setIsLoading(false);
    };
  
    
  
  
    const orderColumns: ColumnDef<TSelectPurchaseOrderSchema>[] = [
      {
        accessorKey: "PURCHASE_ORDER_NUMBER",
        header: () => <div className="text-xs font-semibold w-[130px]">ID</div>,
        cell: ({ row }) => {
          return (
            <div className="max-w-[250px] text-[#40474F]">
              {<span className="">#{row.original.id}</span>}
            </div>
          );
        },
      },
      {
        accessorKey: "CATEGORY",
        header: () => <div className="text-xs font-semibold w-[130px]">Category</div>,
        cell: ({ row }) => {
          return (
            <div className="text-[#40474F]">
              {row.original.category}
            </div>
          );
        },
      },
      {
        accessorKey: "plannedUnit",
        header: () => <div className="text-xs font-semibold w-[130px]">Medical Item</div>,
        cell: ({ row }) => {
          return (
            <div className="text-[#40474F]">
              {row.original.plannedUnit}
            </div>
          );
        },
      },
      {
        accessorKey: "STATUS",
        header: () => <div className="text-xs font-semibold w-[130px] ml-4">Status</div>,
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
        accessorKey: "ALLOCATED_DEPARTMENT",
        header: () => <div className="text-xs font-semibold w-[130px]">Allocated Department</div>,
        cell: ({ row }) => {
          return (
            <div className="text-[#40474F]">
              {row.original.allocationDepartment}
            </div>
          );
        },
      },
      {
        accessorKey: "PACK_SIZE",
        header: () => <div className="text-xs font-semibold w-[130px]">Pack Size</div>,
        cell: ({ row }) => {
          return (
            <div className="text-[#40474F]">
              {row.original.packSize}
            </div>
          );
        },
      },
      {
        accessorKey: "PLANNED_ORDER_DATE",
        header: () => <div className="text-xs font-semibold w-[130px]">Planned Order Date</div>,
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
        header: () => <div className="text-xs font-semibold w-[130px]">Planned Delivery Date</div>,
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
                <span className="text-xs font-bold">Planned Quantity</span>
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
        accessorKey: "REVISED_QUANTITY",
        header: () => <div className="text-xs font-semibold w-[130px]">Revised Quantity</div>,
        cell: ({ row }) => {
          return (
            <div className="text-[#40474F]">
              {row.original.revisedQuantity}
            </div>
          );
        },
      },
      {
        accessorKey: "SECOND_REVIEW",
        header: () => <div className="text-xs font-semibold w-[130px]">Second Review</div>,
        cell: ({ row }) => {
          return (
            <div className="text-[#40474F]">
              {row.original.secondReview}
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
                <span className="text-xs font-bold">Unit Cost (USD)</span>
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
                <span className="text-xs font-bold">Total Cost (USD)</span>
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
        accessorKey: "FUNDING_SOURCE",
        header: () => <div className="text-xs font-semibold w-[130px]">Funding Source</div>,
        cell: ({ row }) => {
          return (
            <div className="text-[#40474F]">
              {row.original.fundingSource}
            </div>
          );
        },
      },
      {
        accessorKey: "action",
        header: () => <div className="text-xs font-semibold w-[130px] ml-4">Action</div>,
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
    
    const handleOrderClick = (id: string) => {
      router.push(`/purchase-orders/${id}`);
    };

    const handleDeletePurchaseOrder = () => {
      mutate(undefined, {
        onSuccess: () => {
          refetch();
          messageApi.open({
            type: "success",
            content: "Purchase order deleted successfully",
          });
          setIsModalOpen(false);
        },
        onError: (err) => {
          messageApi.open({
            type: "error",
            content: err.message || "An error occurred while deleting the purchase order.",
          });
        },
      });
    };
  
    {/* const handleDeletePurchaseOrder = () => {
      setIsDeletingOrder(true);
      fetch(`/api/purchase-orders/${selectedOrderID}`, {
        method: "DELETE",
      })
        .then((res) => {
          refetch();
          messageApi.open({
            type: "success",
            content: "Order deleted successfully",
          });
          setIsModalOpen(false);
          setIsDeletingOrder(false);
        })
        .catch((err) => {
          messageApi.open({
            type: "error",
            content: "Error deleting order",
          });
          setIsDeletingOrder(false);
        });
    }; */}
  
    return (
      <>
        {contextHolder}
        <div className="flex justify-between items-center">
          <div>
            <p className="text-[#121417] text-2xl font-bold max-sm:text-xl">
              Purchase Orders
            </p>
            <p className="text-[#64707D] text-sm font-normal max-sm:text-xs">
              You are viewing all planned purchase orders.
            </p>
          </div>
          <Button
            onClick={handleClick}
            disabled={isLoading}
            className="bg-[rgb(114,1,253)] hover:bg-[#430194] px-4 py-3 rounded-[10px] text-white"
          >
            {
              isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : ("Create Purchase Order")
            }
          </Button>
        </div>

        

        <div className="bg-white rounded-[20px]">
          <div className="mt-10 z-10">
            <DataTable
              columns={orderColumns}
              data={data || []}
              rowClick={(id: string) => handleOrderClick(id)}
              searchBy="plannedUnit"
              filterTitle="Status"
              options={PURCHASE_ORDER_OPTIONS}
            />
          </div>
        </div>
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
                onClick={handleDeletePurchaseOrder}
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
      </>
    );
  };
  
  export default PurchaseOrdersPage;
  