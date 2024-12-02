"use client"

import {
  ArrowLeftIcon,
  ModalTrashIcon,
  ThreeDotsMenuIcon,
} from "@/assets/icons/icons";
import { Button } from "@/components/ui/button";
import { useGetPurchaseOrderReview } from "@/features/purchase-order-reviews/api/use-get-review";
import { useDeletePurchaseOrder } from "@/features/purchase-orders/api/use-delete-order";
import { useGetPurchaseOrder } from "@/features/purchase-orders/api/use-get-order";
import { useGetPurchaseOrders } from "@/features/purchase-orders/api/use-get-orders";
import { Dropdown, MenuProps, Modal, Skeleton, message } from "antd";
import { Loader2, PencilIcon, SearchCheck, Trash2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
  
  interface OrderDetailsProps {}
  
  const OrderDetails: React.FunctionComponent<OrderDetailsProps> = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeletingOrder, setIsDeletingOrder] = useState<boolean>(false);
    const [messageApi, contextHolder] = message.useMessage();
    const router = useRouter();
    const params = useParams();

    const { refetch } = useGetPurchaseOrders();
    const { mutate} = useDeletePurchaseOrder(Number(params.id));
  
    const items: MenuProps["items"] = [
      // {
      //   key: "0",
      //   label: (
      //     <button
      //       onClick={() => router.push(`/reviews/edit/${params.id}`)}
      //       className="flex items-center gap-1"
      //     >
      //       <span>
      //         <SearchCheck className="text-[#667185] h-4" />
      //       </span>
      //       <span>Evaluate Order</span>
      //     </button>
      //   ),
      // },
      {
        key: "1",
        label: (
          <button
            onClick={() => router.push(`/purchase-orders/edit/${params.id}`)}
            className="flex items-center gap-1"
          >
            <span>
              <PencilIcon className="text-[#667185] h-4" />
            </span>
            <span>Edit Request</span>
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

    const {
      data,
      isLoading,
      isError
    } = useGetPurchaseOrder(Number(params.id));
  

    if (isLoading) {
      return (
        <>
          <Skeleton className="py-5 px-5" active paragraph={{ rows: 6 }} />
        </>
      );
    }
  
    if (isError) {
      messageApi.open({
        type: "error",
        content: "Error fetching order",
      });
    }
  
    const handleDeletePurchaseOrder = () => {
      setIsDeletingOrder(true);
    
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
        onSettled: () => {
          setIsDeletingOrder(false);
          router.push("/purchase-orders");
        },
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
              Purchase Order Details
            </p>
            <Dropdown menu={{ items }} placement="bottomLeft" arrow>
              <Button className="bg-white hover:bg-[#EFF4FB] border border-[#D2D6DB] px-2">
                <ThreeDotsMenuIcon />
              </Button>
            </Dropdown>
          </div>
          <div className="flex items-center gap-6 mt-6">
    <p className="text-[#2B2829] font-semibold">
      Order ID: #{data?.id}
    </p>
    <p>
      <span className="text-[#2B2829] font-semibold">Order status:</span>{" "}
      {data?.status === "PLANNED" ? (
        <span className="text-[#F29425] bg-[#FFF9F0] px-3 py-1.5 rounded-[10px] text-xs font-medium">
          {data?.status}
        </span>
      ) : (
        <span className="text-[#10A142] bg-[#EAFFF1] px-3 py-1.5 rounded-[10px] text-xs font-medium">
          {data?.status}
        </span>
      )}
    </p>
  </div>
  
  <div className="mt-10 flex flex-wrap">
    <div>
      <p className="mb-4">
        <span className="font-semibold text-[#2B2829]">Category: </span>
        <span className="text-[#40474F] font-light">
          {data?.category}
        </span>
      </p>
      <p className="mb-4">
        <span className="font-semibold text-[#2B2829]">Planning Unit: </span>
        <span className="text-[#40474F] font-light">
          {data?.plannedUnit}
        </span>
      </p>
      <p className="mb-4">
        <span className="font-semibold text-[#2B2829]">Allocation: </span>
        <span className="text-[#40474F] font-light">
          {data?.allocationDepartment}
        </span>
      </p>
      <p className="mb-4">
        <span className="font-semibold text-[#2B2829]">Pack Size: </span>
        <span className="text-[#40474F] font-light">
          {data?.packSize}
        </span>
      </p>
      <p className="mb-4">
        <span className="font-semibold text-[#2B2829]">Planned Order Date: </span>
        <span className="text-[#40474F] font-light">
          {data?.plannedOrderDate}
        </span>
      </p>
      <p className="mb-4">
        <span className="font-semibold text-[#2B2829]">Planned Delivery Date: </span>
        <span className="text-[#40474F] font-light">
          {data?.plannedDeliveryDate}
        </span>
      </p>
      <p className="mb-4">
        <span className="font-semibold text-[#2B2829]">Planned Quantity: </span>
        <span className="text-[#40474F] font-light">
          {data?.plannedQuantity}
        </span>
      </p>
      <p className="mb-4">
        <span className="font-semibold text-[#2B2829]">Revised Quantity: </span>
        <span className="text-[#40474F] font-light">
          {data?.revisedQuantity !== null ? data?.revisedQuantity : 'N/A'}
        </span>
      </p>
      <p className="mb-4">
        <span className="font-semibold text-[#2B2829]">Second Review: </span>
        <span className="text-[#40474F] font-light">
          {data?.secondReview || 'N/A'}
        </span>
      </p>
    </div>
    
    <div className="ml-[300px] max-sm:ml-0">
      <p className="mb-4">
        <span className="font-semibold text-[#2B2829]">Unit Cost (USD): </span>
        <span className="text-[#40474F] font-light">
          ${data?.unitCost}
        </span>
      </p>
      <p className="mb-4">
        <span className="font-semibold text-[#2B2829]">Total Cost (USD): </span>
        <span className="text-[#40474F] font-light">
          ${data?.totalCost}
        </span>
      </p>
      <p className="mb-4">
        <span className="font-semibold text-[#2B2829]">Funding Source: </span>
        <span className="text-[#40474F] font-light">
          {data?.fundingSource}
        </span>
      </p>
      {/* <p className="mb-4">
        <span className="font-semibold text-[#2B2829]">Created At: </span>
        <span className="text-[#40474F] font-light">
          {data?.created_at || 'N/A'}
        </span>
      </p>
      <p className="mb-4">
        <span className="font-semibold text-[#2B2829]">Updated At: </span>
        <span className="text-[#40474F] font-light">
          {data?.updated_at || 'N/A'}
        </span>
      </p> */}
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
                onClick={handleDeletePurchaseOrder}
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
  
  export default OrderDetails;
  