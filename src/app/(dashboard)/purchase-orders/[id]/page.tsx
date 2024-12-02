"use client"

import {
  ArrowLeftIcon,
  ModalTrashIcon,
  ThreeDotsMenuIcon,
} from "@/assets/icons/icons";
import { Button } from "@/components/ui/button";
import { useDeletePurchaseOrder } from "@/features/purchase-orders/api/use-delete-order";
import { useGetPurchaseOrder } from "@/features/purchase-orders/api/use-get-order";
import { useGetPurchaseOrders } from "@/features/purchase-orders/api/use-get-orders";
import { Dropdown, MenuProps, Modal, Skeleton, message } from "antd";
import { Separator } from "@/components/ui/separator"
import { Loader2, PencilIcon, Trash2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { calculateDeliveryStatus } from "@/lib/utils";
  
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

    const msg = data?.plannedDeliveryDate 
    ? calculateDeliveryStatus(data.plannedDeliveryDate) 
    : "Planned delivery date is not available.";

    console.log("message: ", msg);
  

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
        <section>
          <button
            className="flex items-center gap-1"
            onClick={() => router.back()}
          >
            <span>
              <ArrowLeftIcon />
            </span>
            <span className="text-[#2D3339] font-semibold">Back</span>
          </button>
        </section>

        <section className="bg-white rounded-[10px] mt-10 p-6">
          <div className="flex items-center w-full justify-between mb-2">
            <p className="text-[#40474F] text-2xl font-semibold">Summary</p>
            <Dropdown menu={{ items }} placement="bottomLeft" arrow>
              <Button className="bg-white hover:bg-[#EFF4FB] border border-[#D2D6DB] px-2">
                <ThreeDotsMenuIcon />
              </Button>
            </Dropdown>
          </div>
            
          <Separator />

          <article>
            <div className="flex items-start gap-6 mt-6 h-5">
              {/* <div> */}
                <div className="flex  gap-4 text-[#98A2B3] font-semibold">
                  <p>Order ID: </p>
                  <span className="text-[#40474F]">#{data?.id}</span>
                </div>

                <Separator orientation="vertical" />
                
                <div>
                  <span className="text-[#98A2B3] font-semibold">Order status</span>
                  {" "}
                  {
                    data?.status === "PLANNED" 
                    ? ( <span className="text-[#F29425] bg-[#FFF9F0] px-3 py-1.5 rounded-[10px] text-xs font-medium">{data?.status}</span>) 
                    : ( 
                        <span className="text-[#10A142] bg-[#EAFFF1] px-3 py-1.5 rounded-[10px] text-xs font-medium">
                          {data?.status}
                        </span>
                    )
                  }
                </div>

                <Separator orientation="vertical" />

                <div className="text-">
                  <span
                    className={`${
                      msg.includes("delayed")
                        ? "text-[#D32F2F] bg-[#FEEAEA]" // Red for overdue
                        : "text-[#10A142] bg-[#EAFFF1]" // Green for ongoing
                    } px-3 py-1.5 rounded-[10px] text-sm font-medium`}
                  >
                    {msg}
                  </span>
                </div>

                <div>

                </div>
              {/* </div> */}
            </div>
    
            <div className="mt-10 flex flex-col gap-4 flex-wrap">
              <div className="flex gap-8">
                <div className="flex flex-col text-sm w-[180px]">
                  <p className="font-semibold text-[#98A2B3]">Category </p>
                  <p className="text-[#40474F] font-medium">
                    {data?.category}
                  </p>
                </div>
                <div className="flex flex-col text-sm w-[180px]">
                  <p className="font-semibold text-[#98A2B3]">Planning Unit </p>
                  <p className="text-[#40474F] font-medium">
                    {data?.plannedUnit}
                  </p>
                </div>
                <div className="flex flex-col text-sm w-[180px]">
                  <p className="font-semibold text-[#98A2B3]">Allocation </p>
                  <p className="text-[#40474F] font-medium">
                    {data?.allocationDepartment}
                  </p>
                </div>
              </div>

              <div className="flex gap-8">
                <div className="flex flex-col text-sm w-[180px]">
                  <p className="font-semibold text-[#98A2B3]">Pack Size </p>
                  <p className="text-[#40474F] font-medium">
                    {data?.packSize}
                  </p>
                </div>
                <div className="flex flex-col text-sm w-[180px]">
                  <p className="font-semibold text-[#98A2B3]">Planned Order Date</p>
                  <p className="text-[#40474F] font-medium">
                    {data?.plannedOrderDate}
                  </p>
                </div>
                <div className="flex flex-col text-sm w-[180px]">
                  <p className="font-semibold text-[#98A2B3]">Planned Delivery Date</p>
                  <p className="text-[#40474F] font-medium">
                    {data?.plannedDeliveryDate}
                  </p>
                </div>
              </div> 

              <div className="flex gap-8">
                <div className="flex flex-col text-sm w-[180px]">
                  <p className="font-semibold text-[#98A2B3]">Planned Quantity</p>
                  <p className="text-[#40474F] font-medium">
                    {data?.plannedQuantity}
                  </p>
                </div>
                <div className="flex flex-col text-sm w-[180px]">
                  <p className="font-semibold text-[#98A2B3]">Revised Quantity</p>
                  <p className="text-[#40474F] font-medium">
                    {data?.revisedQuantity !== null ? data?.revisedQuantity : 'N/A'}
                  </p>
                </div>
                <div className="flex flex-col text-sm w-[180px]">
                  <p className="font-semibold text-[#98A2B3]">Second Review</p>
                  <p className="text-[#40474F] font-medium">
                    {data?.secondReview || 'N/A'}
                  </p>
                </div>
              </div>
              
              <div className="">
                <div className="flex gap-8">
                  <div className="flex flex-col text-sm w-[180px]">
                    <p className="font-semibold text-[#98A2B3]">Unit Cost (USD)</p>
                    <p className="text-[#40474F] font-medium">
                      ${data?.unitCost}
                    </p>
                  </div>
                  <div className="flex flex-col text-sm w-[180px]">
                    <p className="font-semibold text-[#98A2B3]">Total Cost (USD)</p>
                    <p className="text-[#40474F] font-medium">
                      ${data?.totalCost?.toFixed(4)}
                    </p>
                  </div>
                  <div className="flex flex-col text-sm w-[180px]">
                    <p className="font-semibold text-[#98A2B3]">Funding Source</p>
                    <p className="text-[#40474F] font-medium">
                      {data?.fundingSource}
                    </p>
                  </div>
                </div> 

                <div className="flex gap-8 mt-4">
                  <div className="flex flex-col text-sm w-[180px]">
                    <p className="font-semibold text-[#98A2B3]">Created At</p>
                    <p className="text-[#40474F] font-medium">
                      {data?.createdAt || 'N/A'}
                    </p>
                  </div>
                  <div className="flex flex-col text-sm w-[180px]">
                    <p className="font-semibold text-[#98A2B3]">Updated At</p>
                    <p className="text-[#40474F] font-medium">
                      {data?.updatedAt || 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8">
                <Button
                  onClick={() => router.push(`/reviews/new?orderId=${data?.id}`)}
                  className="bg-[#7201FD] hover:bg-[#430194] px-6 py-3 rounded-[10px] text-white"
                >
                  Evaluate
                </Button>
            </div>
          </article>

          <article>

          </article>
  
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
  