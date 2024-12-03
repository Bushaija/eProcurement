import { useRouter} from 'next/navigation';
import { Separator } from "@/components/ui/separator";
import React from 'react';
import { calculateDeliveryStatus } from '@/lib/utils';
import { purchaseOrderStatus } from '@/types';


export interface OrderDetailsProps {
    data?: {
      id: number;
      status: purchaseOrderStatus | null;
      plannedDeliveryDate?: string;
      category?: string;
      plannedUnit?: string;
      allocationDepartment?: string;
      packSize?: string;
      plannedOrderDate?: string;
      plannedQuantity?: number;
      revisedQuantity?: number | null;
      secondReview?: string | number | null;
      unitCost?: number;
      totalCost?: number | null;
      fundingSource?: string | null;
      createdAt?: string | null;
      updatedAt?: string | null;
    };
  }

export const PODetails: React.FC<OrderDetailsProps> = ({ data }) => {
    const router = useRouter();

    const msg = data?.plannedDeliveryDate 
    ? calculateDeliveryStatus(data.plannedDeliveryDate)
    : "Planned delivery date is not available.";


  return (
    <section className="bg-[#f8f8f8] rounded-[10px] p-4">
            
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

            {/* <div className="mt-8">
                <Button
                  onClick={() => router.push(`/reviews/new?orderId=${data?.id}`)}
                  className="bg-[#7201FD] hover:bg-[#430194] px-6 py-3 rounded-[10px] text-white"
                >
                  Evaluate
                </Button>
            </div> */}
          </article>

          <article>

          </article>
  
        </section>
  )
}
