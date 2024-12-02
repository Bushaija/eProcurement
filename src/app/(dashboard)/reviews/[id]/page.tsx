"use client"

import {
  ArrowLeftIcon,
  ModalTrashIcon,
  ThreeDotsMenuIcon,
} from "@/assets/icons/icons";
import { Button } from "@/components/ui/button";
import { useGetPurchaseOrderReview } from "@/features/purchase-order-reviews/api/use-get-review";
import { Dropdown, MenuProps, Modal, Skeleton, message } from "antd";
import { Loader2, PencilIcon, Trash2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

  export interface PurchaseOrderType {
    id: number
    purchaseOrderId: number;
    purchaseOrderCreationDate: string;
    purchaseOrderNumber: string;
    purchaseOrderIssueDate: string;
    readTime: string; // check here
    expectedDeliveryDate: string;
    unitPriceDdp: number;
    totalCostDdp: number;
    unitPriceCip: number;
    totalCostCip: number;
    currency: string;
    orderQuantity: number;
    receivedQuantity: number;
    receivedDate: string;
    balancedQuantity: number;
    shipmentStatus: "PLANNED" | "APPROVED" | "REJECTED" | "SUBMITTED" | "COMPLETED";
    comments: string;
    createdAt: string;
    updatedAt: string;
  }
  
  
  interface PurchaseOrderDetails {}
  
  const purchaseOrderReviewDetails: React.FunctionComponent<PurchaseOrderDetails> = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeletingOrder, setIsDeletingOrder] = useState<boolean>(false);
    const [messageApi, contextHolder] = message.useMessage();
    const router = useRouter();
    const params = useParams();

    const { data, isPending, error, refetch} = useGetPurchaseOrderReview(Number(params.id));
  
    const items: MenuProps["items"] = [
      {
        key: "1",
        label: (
          <button
            onClick={() => router.push(`/reviews/edit/${params.id}`)}
            className="flex items-center gap-1"
          >
            <span>
              <PencilIcon className="text-[#667185] h-4" />
            </span>
            <span>Edit Order</span>
          </button>
        ),
      },
      {
        key: "2",
        label: (
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1"
          >
            <span>
              <Trash2 className="text-[#B30101] h-4" />
            </span>
            <span className="text-[#B30101]">Delete Order</span>
          </button>
        ),
      },
    ];
  

    if (isPending) {
      return (
        <>
          <Skeleton className="py-5 px-5" active paragraph={{ rows: 6 }} />
        </>
      );
    }
  
    if (error) {
      messageApi.open({
        type: "error",
        content: "Error fetching order",
      });
    }
  
    const handleDeleteOrder = () => {
      setIsDeletingOrder(true);
      fetch(`/api/reviews/${params.id}`, {
        method: "DELETE",
      })
        .then((res) => {
          refetch()
          messageApi.open({
            type: "success",
            content: "Order deleted successfully",
          });
          setIsModalOpen(false);
          setIsDeletingOrder(false);
          router.push("/reviews")
        })
        .catch((err) => {
          messageApi.open({
            type: "error",
            content: "Error deleting order",
          });
          setIsDeletingOrder(false);
        });
    };
  
    return (
      <>
        {contextHolder}
        <div>
          <button
            className="flex items-center gap-1"
            onClick={() => router.back()}
          >
            <span>
              <ArrowLeftIcon />
            </span>
            <span className="text-[#2D3339] font-semibold">Back</span>
          </button>
        </div>
        <div className="bg-white rounded-[10px] mt-10 p-6">
          <div className="flex items-center w-full justify-between">
            <p className="text-[#2B2829] text-xl font-semibold">
              Purchase Order Review Details
            </p>
            <Dropdown menu={{ items }} placement="bottomLeft" arrow>
              <Button className="bg-white hover:bg-[#EFF4FB] border border-[#D2D6DB] px-2">
                <ThreeDotsMenuIcon />
              </Button>
            </Dropdown>
          </div>

          <div className="flex items-center gap-6 mt-6">
            <p className="text-[#2B2829] font-semibold">
              Order ID: #{data?.purchaseOrderId}
            </p>
            <p>
              <span className="text-[#2B2829] font-semibold">Shipment status:</span>{" "}
              {data?.shipmentStatus === "PLANNED" ? (
                <span className="text-[#F29425] bg-[#FFF9F0] px-3 py-1.5 rounded-[10px] text-xs font-medium">
                  {data?.shipmentStatus || "N/A"}
                </span>
              ) : (
                <span className="text-[#10A142] bg-[#EAFFF1] px-3 py-1.5 rounded-[10px] text-xs font-medium">
                  {data?.shipmentStatus || "N/A"}
                </span>
              )}
            </p>
          </div>
  
          <div className="mt-10 flex flex-col gap-4 flex-wrap">
            <div className="flex gap-8">
              <div className="flex flex-col text-sm w-[280px]">
                <p className="font-semibold text-[#98A2B3]">Purchase Order Creation Date: </p>
                <p className="text-[#40474F] font-medium">
                  {data?.purchaseOrderCreationDate || "N/A"}
                </p>
              </div>
              <div className="flex flex-col text-sm w-[280px]">
                <p className="font-semibold text-[#98A2B3]">Purchase Order Number: </p>
                <p className="text-[#40474F] font-medium">
                  {data?.purchaseOrderNumber || "N/A"}
                </p>
              </div>
              <div className="flex flex-col text-sm w-[280px]">
                <p className="font-semibold text-[#98A2B3]">Purchase Order Issue Date: </p>
                <p className="text-[#40474F] font-medium">
                  {data?.purchaseOrderIssueDate || "N/A"}
                </p>
              </div>
            </div>

            <div className="flex gap-8">
              <div className="flex flex-col text-sm w-[280px]">
                <p className="font-semibold text-[#98A2B3]">Read Time: </p>
                <p className="text-[#40474F] font-medium">
                  {data?.readTime || "N/A"}
                </p>
              </div>
              <div className="flex flex-col text-sm w-[280px]">
                <p className="font-semibold text-[#98A2B3]">Expected Delivery Date(EDD): </p>
                <p className="text-[#40474F] font-medium">
                  {data?.expectedDeliveryDate || "N/A"}
                </p>
              </div>
              <div className="flex flex-col text-sm w-[280px]">
                <p className="font-semibold text-[#98A2B3]">Unit Price DDP: </p>
                <p className="text-[#40474F] font-medium">
                  {data?.unitPriceDdp || "N/A"}
                </p>
              </div>
            </div>

            <div className="flex gap-8">
              <div className="flex flex-col text-sm w-[280px]">
                <p className="font-semibold text-[#98A2B3]">Total Cost DDP: </p>
                <p className="text-[#40474F] font-medium">
                  {data?.totalCostDdp || "N/A"}
                </p>
              </div>
              <div className="flex flex-col text-sm w-[280px]">
                <p className="font-semibold text-[#98A2B3]">Unit Price CIP: </p>
                <p className="text-[#40474F] font-medium">
                  {/* {data?.revisedQuantity !== null ? data?.revisedQuantity : 'N/A'} */}
                  {data?.unitPriceCip || "N/A"}
                </p>
              </div>
              <div className="flex flex-col text-sm w-[280px]">
                <p className="font-semibold text-[#98A2B3]">Total Cost CIP: </p>
                <p className="text-[#40474F] font-medium">
                  {data?.totalCostCip || "N/A"}
                </p>
              </div>
            </div>
  
          <div className="flex flex-col gap-4">
             <div className="flex gap-8">
              <div className="flex flex-col text-sm w-[280px]">
                <p className="font-semibold text-[#98A2B3]">CURRENCY (USD): </p>
                <p className="text-[#40474F] font-medium">
                  {data?.currency || "N/A"}
                </p>
              </div>
              <div className="flex flex-col text-sm w-[280px]">
                <p className="font-semibold text-[#98A2B3]">Order Quantity: </p>
                <p className="text-[#40474F] font-medium">
                  ${data?.orderQuantity || "N/A"}
                </p>
              </div>
              <div className="flex flex-col text-sm w-[280px]">
                <p className="font-semibold text-[#98A2B3]">Received Quantity: </p>
                <p className="text-[#40474F] font-medium">
                  {data?.receivedQuantity || "N/A"}
                </p>
              </div>
            </div>

             <div className="flex gap-8">
              <div className="flex flex-col text-sm w-[280px]">
                <p className="font-semibold text-[#98A2B3]">Received Date: </p>
                <p className="text-[#40474F] font-medium">
                  {data?.receivedDate}
                </p>
              </div>
              <div className="flex flex-col text-sm w-[280px]">
                <p className="font-semibold text-[#98A2B3]">Balanced Quantity: </p>
                <p className="text-[#40474F] font-medium">
                  {data?.balancedQuantity || "N/A"}
                </p>
              </div>
              <div className="flex flex-col text-sm w-[280px]">
                <p className="font-semibold text-[#98A2B3]">Comments: </p>
                <p className="text-[#40474F] font-medium">
                  {data?.receivedQuantity || "N/A"}
                </p>
              </div>
            </div>

             <div className="flex gap-8">
              <div className="flex flex-col text-sm w-[280px]">
                <p className="font-semibold text-[#98A2B3]">Created At: </p>
                <p className="text-[#40474F] font-medium">
                  {data?.createdAt || 'N/A' || "N/A"}
                </p> 
              </div>
              <div className="flex flex-col text-sm w-[280px]">
                <p className="font-semibold text-[#98A2B3]">Updated At: </p>
                <p className="text-[#40474F] font-medium">
                  {data?.updatedAt || 'N/A' || "N/A"}
                </p>
              </div>
            </div>
          </div>


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
                className="px-6 py-2 bg-white border border-[rgba(23,23,31,0.10)] shadow-[0px_1px_1px_0px_rgba(18,18,18,0.10),0px_0px_0px_1px_rgba(18,18,18,0.07),0px_1px_3px_0px_rgba(18,18,18,0.10)] border-solid border-[#17171f1a] rounded-[10px]"
              >
                No, Cancel
              </button>
              <button
                onClick={handleDeleteOrder}
                disabled={isDeletingOrder}
                className="px-8 py-2 deleteBtn ml-4"
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
  
  export default purchaseOrderReviewDetails;
  