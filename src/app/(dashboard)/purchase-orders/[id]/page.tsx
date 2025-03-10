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
import { calculateDeliveryStatus, formatDateTime, formatDecimals, getShipmentStatus } from "@/lib/utils";
import { useGetPurchaseOrderReviews } from "@/features/purchase-order-reviews/api/use-get-reviews";

interface CardCellProps {
  title?: string;
  value: any;
  isMainTitle?: boolean;
}

const CardCell = ({ title, value, isMainTitle = false }: CardCellProps) => {
  return <div className={`${isMainTitle ? "" : "border-black w-[200px]"}`}>
    <p className="font-semibold text-[#98A2B3]">{title}</p>
    <p className={`${isMainTitle ? "font-bold p-2 text-[#10A142]" : "font-medium text-[#40474F]"}`}>
      {value}
    </p>
  </div>
}

export const ShipmentStatusCell: React.FC<{ status: string }> = ({ status }) => {
  if(status === "PLANNED") {
    return <span className="text-[#F29425] bg-[#FFF9F0] px-3 py-1.5 rounded-[10px] text-xs font-medium">{status}</span>
  }
  
  return <div className="text-[#22a8dd] bg-[#EAFFF1] px-3 py-1.5 rounded-[10px] text-xs font-medium">{status}</div>
}
  
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
      data: shipmentItemData,
      isLoading,
      isError
    } = useGetPurchaseOrder(Number(params.id));
    const {
      data: poReviewData,
      isLoading: isPoReviewDataLoading,
      isError: isPoReviewDataError,
    } = useGetPurchaseOrderReviews()

    const msg = shipmentItemData?.plannedDeliveryDate 
    ? calculateDeliveryStatus(shipmentItemData.plannedDeliveryDate) 
    : "Planned delivery date is not available.";

    const shipmentStatus = getShipmentStatus(shipmentItemData, poReviewData);

    if (isLoading || isPoReviewDataLoading) {
      return (
        <>
          <Skeleton className="py-5 px-5" active paragraph={{ rows: 6 }} />
        </>
      );
    }
  
    if (isError || isPoReviewDataError) {
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

        <section className="bg-white rounded-[10px] mt-6 mb-4 p-6">
          <div className="flex items-center w-full justify-between mb-2">
            <p className="text-[#40474F] text-2xl font-semibold">Summary</p>
            <Dropdown menu={{ items }} placement="bottomLeft" arrow>
              <Button className="bg-white hover:bg-[#EFF4FB] border border-[#D2D6DB] px-2">
                <ThreeDotsMenuIcon />
              </Button>
            </Dropdown>
          </div>
            
          <Separator />

          <article className="w-full"> 
            <CardCell value={shipmentItemData?.plannedUnit} isMainTitle={true} />
            <div className="flex items-start gap-6 mt-4 h-5">
              <div className="flex  gap-4 text-[#98A2B3] font-semibold">
                <p>Shipment ID: </p>
                <span className="text-[#40474F]">#{shipmentItemData?.id}</span>
              </div>
              <Separator orientation="vertical" />
              <div>
                <span className="text-[#98A2B3] font-semibold">Shipment status</span>
                <ShipmentStatusCell status = {String(shipmentStatus)} />
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
                  {!(shipmentStatus?.toLocaleLowerCase().trim() === "planned") && msg}
                </span>
              </div>
            </div>
    
            <div className="mt-10 flex flex-col gap-4 flex-wrap">
              <div className="flex gap-8 w-full">
                <CardCell title="Shipment Category" value={shipmentItemData?.category} />
                <CardCell title="Division" value={shipmentItemData?.allocationDepartment} />
                <CardCell title="Pack Size" value={shipmentItemData?.packSize} />
                <CardCell title="Funding Source" value={shipmentItemData?.fundingSource} />
              </div>
              <div className="flex gap-8">
                <CardCell title="Unit Cost" value={formatDecimals(Number(shipmentItemData?.unitCost))} />
                <CardCell title="Planned Quantity" value={shipmentItemData?.plannedQuantity} />
                <CardCell title="Revised Quantity" value={shipmentItemData?.revisedQuantity ? shipmentItemData?.revisedQuantity : "N/A"} />
                <CardCell title="Second Review" value={shipmentItemData?.secondReview ? shipmentItemData?.secondReview : "N/A"} />
              </div>
              <div className="flex gap-8">
                <CardCell title="Total Cost" value={formatDecimals(Number(shipmentItemData?.totalCost))} />
                <CardCell title="Planned Order Date" value={shipmentItemData?.plannedOrderDate} />
                <CardCell title="Planned Delivery Date" value={shipmentItemData?.plannedDeliveryDate} />
              </div>
              <div className="flex gap-8">
                <CardCell title="Created At" value={formatDateTime(String(shipmentItemData?.createdAt))} />
                <CardCell title="Updated At" value={formatDateTime(String(shipmentItemData?.updatedAt))} />
              </div>
            </div>

            <div className="mt-8">
                <Button
                  onClick={() => router.push(`/reviews/new?orderId=${shipmentItemData?.id}`)}
                  className="bg-[#7201FD] hover:bg-[#430194] px-6 py-3 rounded-[10px] text-white"
                >
                  Implement Shipment{` (${shipmentItemData?.id})`}
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
  