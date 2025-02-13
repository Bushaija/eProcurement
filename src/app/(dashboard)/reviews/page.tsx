"use client"

import {
  ModalTrashIcon,
} from "@/assets/icons/icons";
import { DataTable } from "@/components/table/data-table";
import { Button } from "@/components/ui/button";
import { useGetPurchaseOrderReviews } from "@/features/purchase-order-reviews/api/use-get-reviews";
import { TSelectPurchaseOrderReviewSchema } from "@/db/schema";

import { ColumnDef } from "@tanstack/react-table";
import { Modal, Skeleton, message } from "antd";
import { Loader2, PencilIcon, SearchCheck, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";


interface DashboardProps {}
  
  const FollowUp: React.FunctionComponent<DashboardProps> = () => {
    const router = useRouter();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedOrderID, setSelectedOrderID] = useState<number>();
    const [isDeletingOrder, setIsDeletingOrder] = useState<boolean>(false);
    const [messageApi, contextHolder] = message.useMessage();

    const { data, isPending, isError: error, refetch } = useGetPurchaseOrderReviews()
    
  
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

    const handleOrderClick = (id: string) => {
      router.push(`/reviews/${id}`);
    };

    const handleDeleteOrder = () => {
      setIsDeletingOrder(true);
      fetch(`/api/reviews/${selectedOrderID}`, {
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
    };
  
  
    const reviewColumns: ColumnDef<TSelectPurchaseOrderReviewSchema>[] = [
      {
        accessorKey: "PROCUREMENT_REQUEST_ID",
        header: () => <div className="w-[170px] text-xs font-bold">Request ID</div>,
        cell: ({ row }) => {
          return (
            <div className="text-[#40474F]">
              {<span className="">#{row.original.purchaseOrderId}</span>}
            </div>
          );
        },
      },
      {
        accessorKey: "PO_CREATION_DATE",
        header: () => <div className="w-[170px] text-xs font-bold">Purchase Order creation Date</div>,
        cell: ({ row }) => {
          return (
            <div className="text-[#40474F]">
              {row.original.purchaseOrderCreationDate || "N/A"}
            </div>
          );
        },
      },
      {
        accessorKey: "purchase number",
        header: () => <div className="w-[170px] text-xs font-bold">Purchase Order Number</div>,
        cell: ({ row }) => {
          return (
            <div className="text-[#40474F]">
              {row.original.purchaseOrderNumber}
            </div>
          );
        },
      },
      {
        accessorKey: "PO_ISSUE_DATE",
        header: () => <div className="w-[170px] text-xs font-bold">Purchase Order Issue Date</div>,
        cell: ({ row }) => {
          return (
            <div className="text-[#40474F]">
              {row.original.purchaseOrderIssueDate || "N/A"}
            </div>
          );
        },
      },
      {
        accessorKey: "Read Time",
        header: () => <div className="w-[170px] text-xs font-bold">Read Time</div>,
        cell: ({ row }) => {
          return (
            <div className="text-[#40474F]">
              {row.original.readTime || "N/A"}
            </div>
          );
        },
      },
      {
        accessorKey: "EDD",
        header: () => <div className="w-[170px] text-xs font-bold">Expected Delivery Date(EDD)</div>,
        cell: ({ row }) => {
          return (
            <div className="text-[#40474F] min-w-[100px]">
              {row.original.expectedDeliveryDate}
            </div>
          );
        },
      },
      {
        accessorKey: "UNIT_PRICE_DDP",
        header: () => <div className="w-[170px] text-xs font-bold">Unit Price DDP</div>,
        cell: ({ row }) => {
          return (
            <div className="text-[#40474F] min-w-[100px]">
              {row.original.unitPriceDdp}
            </div>
          );
        },
      },
      {
        accessorKey: "TOTAL_COST_DDP",
        header: () => <div className="w-[170px] text-xs font-bold">Total Cost DDP</div>,
        cell: ({ row }) => {
          return (
            <div className="text-[#40474F] min-w-[100px]">
              {row.original.totalCostDdp}
            </div>
          );
        },
      },
      {
        accessorKey: "UNIT_PRICE_CIP",
        header: () => <div className="w-[170px] text-xs font-bold">Unit Price CIP</div>,
        cell: ({ row }) => {
          return (
            <div className="text-[#40474F] min-w-[100px]">
              {row.original.unitPriceCip}
            </div>
          );
        },
      },
      {
        accessorKey: "TOTAL_COST_CIP",
        header: () => <div className="w-[170px] text-xs font-bold">Total Cost CIP</div>,
        cell: ({ row }) => {
          return (
            <div className="text-[#40474F] min-w-[100px]">
              {row.original.totalCostCip}
            </div>
          );
        },
      },
      {
        accessorKey: "CURRENCY",
        header: () => <div className="w-[170px] text-xs font-bold">Currency</div>,
        cell: ({ row }) => {
          return (
            <div className="text-[#40474F] min-w-[100px]">
              {row.original.currency}
            </div>
          );
        },
      },
      {
        accessorKey: "ORDER_QUANTITY",
        header: () => <div className="w-[170px] text-xs font-bold">Order Quantity</div>,
        cell: ({ row }) => {
          return (
            <div className="text-[#40474F] min-w-[100px]">
              {row.original.orderQuantity}
            </div>
          );
        },
      },
      {
        accessorKey: "RECEIVE_QUANTITY",
        header: () => <div className="w-[170px] text-xs font-bold">Received Quantity</div>,
        cell: ({ row }) => {
          return (
            <div className="text-[#40474F] min-w-[100px]">
              {row.original.receivedQuantity}
            </div>
          );
        },
      },
      {
        accessorKey: "RECEIVED_DATE",
        header: () => <div className="w-[170px] text-xs font-bold">Received Date</div>,
        cell: ({ row }) => {
          return (
            <div className="text-[#40474F] min-w-[100px]">
              {row.original?.receivedDate || "N/A"}
            </div>
          );
        },
      },
      {
        accessorKey: "BalancedQuantity",
        header: () => <div className="w-[170px] text-xs font-bold">Balanced Quantity</div>,
        cell: ({ row }) => {
          return (
            <div className="text-[#40474F] min-w-[100px]">
              {row.original.balancedQuantity}
            </div>
          );
        },
      },
      {
        accessorKey: "SHIPMENT_STATUS",
        header: () => <div className="w-[170px] text-xs font-bold">Shipment Status</div>,
        cell: ({ row }) => {
          return (
            <div className="text-[#40474F] min-w-[100px]">
              {row.original.shipmentStatus}
            </div>
          );
        },
      },
      {
        accessorKey: "COMMENTS",
        header: () => <div className="w-[170px] text-xs font-bold">Comments</div>,
        cell: ({ row }) => {
          return (
            <div className="text-[#40474F] min-w-[100px]">
              {row.original.comments}
            </div>
          );
        },
      },
      {
        accessorKey: "action",
        header: () => <div className="text-xs font-semibold w-[130px] text-center">Action</div>,
        cell: ({ row }) => {
          return (
            <div className="flex gap-2.5">

              <button
                onClick={() =>
                  router.push(`/reviews/edit/${row.original.id}`)
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
    
  
    return (
      <>
        {contextHolder}
        <div className="flex justify-between items-center">
          <div>
            <p className="text-[#121417] text-2xl font-bold max-sm:text-xl">
              Shipment implementation details
            </p>
            <p className="text-[#64707D] text-sm font-normal max-sm:text-xs">
              You're viewing all shipments.
            </p>
          </div>
          {/* <Button
            onClick={() => router.push("/reviews/new")}
            className="bg-[#7201FD] hover:bg-[#430194] px-4 py-3 rounded-[10px] text-white"
          >
            Start PO Evaluation
          </Button> */}
        </div>

        

        <div className="bg-white rounded-[20px]">
          <div className="mt-10 z-10">
            <DataTable
              columns={reviewColumns}
              data={data || []}
              rowClick={(id: string) => handleOrderClick(id)}
              searchBy="purchase number"
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
      </>
    );
  };
  
  export default FollowUp;
  