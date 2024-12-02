"use client";

import { ArrowLeftIcon, SuccessIcon } from "@/assets/icons/icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useSearchParams } from 'next/navigation'
import { Input } from "@/components/ui/input";
import { Modal, message } from "antd";
import { useState } from "react";
import { useCreatePurchaseOrderReview } from "@/features/purchase-order-reviews/api/use-create-review";
import { PurchaseOrderReviewStatus } from "@/types";

interface CreatePurchaseOrderReviewProps {}

const FormSchema = z.object({
  purchaseOrderId: z.coerce.number().positive(),
  purchaseOrderCreationDate: z.string(),
  purchaseOrderNumber: z.string(),
  purchaseOrderIssueDate: z.string(),
  readTime: z.string(),
  expectedDeliveryDate: z.string({
    required_error: "expected delivery date is required"
  }),
  unitPriceDdp: z.coerce.number(),
  totalCostDdp: z.coerce.number(),
  unitPriceCip: z.coerce.number(),
  totalCostCip: z.coerce.number(),
  currency: z.string(),
  orderQuantity: z.coerce.number(),
  receivedQuantity: z.coerce.number(),
  receivedDate: z.string(),
  balancedQuantity: z.coerce.number(),
  shipmentStatus: z.enum(['ORDERED', 'PLANNED', 'CANCELLED', 'RECEIVED', 'HOLD', 'PARTIAL RECEIVED']),
  comments: z.string()
});

const CreatePurchaseOrder: React.FunctionComponent<CreatePurchaseOrderReviewProps> = () => {
  const { mutate, isPending } = useCreatePurchaseOrderReview();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  const [messageApi, contextHolder] = message.useMessage();
  const searchParams = useSearchParams()
  const purchaseOrderId = searchParams.get("orderId");

  const [creationDate, setCreationDate] = useState(
    new Date().toISOString().split("T")[0] 
  );

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
        purchaseOrderId: Number(purchaseOrderId),
        purchaseOrderCreationDate: "",
        purchaseOrderNumber: "",
        purchaseOrderIssueDate: "",
        readTime: "",
        expectedDeliveryDate: "",

        unitPriceDdp: 0,
        totalCostDdp: 0,
        unitPriceCip: 0,
        totalCostCip: 0,
        
        currency: "USD",
        orderQuantity: 0,
        receivedQuantity: 0,
        receivedDate: "",
        balancedQuantity: 0,
        shipmentStatus: "PLANNED",
        comments: "",
    },
  });


    const onSubmit = async (data: z.infer<typeof FormSchema>) => {
      const newPurchaseOrderReview = {
        purchaseOrderId: Number(data.purchaseOrderId), // Ensure this is a number
        purchaseOrderCreationDate: data.purchaseOrderCreationDate || null,
        purchaseOrderNumber: data.purchaseOrderNumber || "",
        purchaseOrderIssueDate: data.purchaseOrderIssueDate || null,
        readTime: data.readTime || null,
        expectedDeliveryDate: data.expectedDeliveryDate || null,
        unitPriceDdp: data.unitPriceDdp || 0,
        totalCostDdp: data.totalCostDdp || 0,
        unitPriceCip: data.unitPriceCip || 0,
        totalCostCip: data.totalCostCip || 0,
        currency: data.currency || "USD",
        orderQuantity: Number(data.orderQuantity) || 0,
        receivedDate: data.receivedDate || null,
        balancedQuantity: Number(data.balancedQuantity) || 0,
        shipmentStatus: data.shipmentStatus as PurchaseOrderReviewStatus,
        comments: data.comments || null,
      };
  
     mutate(newPurchaseOrderReview, {
      onSuccess: () => {
        setIsModalOpen(true);
        form.reset();
      },
      onError: () => {
        messageApi.open({
          type: "error",
          content: "Error creating purchase order review"
        })
      }
     })
      
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
      <div className="bg-white rounded-[10px] mt-10 p-6 max-sm:mt-4">
        <p className="text-[#2B2829] text-xl mb-2 font-semibold">
          Purchase Order Details
        </p>
        <div className="bg-white rounded-[10px] mt-4 p-6 max-sm:mt-8">
 

  <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)} className="">
    <div className="flex gap-5 mt-6 max-sm:flex-wrap">
        {/* <FormField
          control={form.control}
          name="purchaseOrderId"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Purchase Order ID</FormLabel>
              <FormControl>
                <Input 
                  value={purchaseOrderId || field.value || ""}
                  readOnly
                  type="number" 
                  placeholder="Enter item request ID" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        /> */}
        <FormField
          control={form.control}
          name="purchaseOrderId"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Purchase Order ID</FormLabel>
              <FormControl>
                <Input 
                  readOnly
                  type="number" 
                  placeholder="Enter item request ID" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="purchaseOrderNumber"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Purchase order number</FormLabel>
              <FormControl>
                <Input placeholder="Enter purchase order no" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="purchaseOrderCreationDate"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Purchase order creation date</FormLabel>
              <FormControl>
              <Input 
                min={new Date().toISOString().split("T")[0]}
                type="date" 
                {...field} 
                onChange={(e) => {
                  field.onChange(e.target.value);
                  setCreationDate(e.target.value); // Update planned order date
                }}
              />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />    

       
        <FormField
          control={form.control}
          name="purchaseOrderIssueDate"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Purchase order issue date</FormLabel>
              <FormControl>
                <Input type="date" placeholder="Enter PO issue date" {...field} min={creationDate}/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        


</div>
<div className="flex gap-5 mt-6 max-sm:flex-wrap">

       



        <FormField
          control={form.control}
          name="totalCostDdp"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Total cost (DDP)</FormLabel>
              <FormControl>
                <Input type="number" placeholder="Enter total cost DDP" {...field} min={0}/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="unitPriceCip"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Unit Price CIP</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="totalCostCip"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Total cost CIP</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

</div>
<div className="flex gap-5 mt-6 max-sm:flex-wrap">

        {/* Planned Delivery Date */}
        <FormField
          control={form.control}
          name="currency"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Currency</FormLabel>
              <FormControl>
                <Input type="text" placeholder="Enter currency" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="orderQuantity"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Order quantity</FormLabel>
              <FormControl>
                <Input type="text" placeholder="Enter order quantity" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

<FormField
          control={form.control}
          name="receivedQuantity"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Received Quantity</FormLabel>
              <FormControl>
                <Input type="number" placeholder="Enter received quantity" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

       

<FormField
  control={form.control}
  name="receivedDate"
  render={({ field }) => (
    <FormItem className="w-full">
      <FormLabel>Received Date</FormLabel>
      <FormControl>
        <Input type="date" placeholder="Enter received data" {...field} />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>


</div>
            <p className="text-[#2B2829] mb-10 mt-10 text-xl font-semibold">
              Quantity and Cost Details
            </p>
            <div className="flex gap-5 max-sm:flex-wrap">

            <FormField
  control={form.control}
  name="readTime"
  render={({ field }) => (
    <FormItem className="w-full">
      <FormLabel>Read time</FormLabel>
      <FormControl>
        <Input type="date" placeholder="Enter the read time" {...field} />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>



        <FormField
          control={form.control}
          name="balancedQuantity"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Balanced quantity</FormLabel>
              <FormControl>
                <Input type="number" placeholder="Enter planned quantity" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>


          )}
        />

<FormField
  control={form.control}
  name="shipmentStatus"
  render={({ field }) => (
    <FormItem className="w-full">
      <FormLabel>Shipment status</FormLabel>
      <FormControl>
        <select
          {...field}
          className="form-select w-full"
          onChange={(e) => field.onChange(e.target.value)}
        >
          <option value="">Select Status</option>
          <option value="ORDERED">ORDERED</option>
          <option value="PLANNED">PLANNED</option>
          <option value="CANCELLED">CANCELLED</option>
          <option value="RECEIVED">RECEIVED</option>
          <option value="HOLD">HOLD</option>
          <option value="PARTIAL RECEIVED">PARTIAL RECEIVED</option>
        </select>
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>


        <FormField
          control={form.control}
          name="comments"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Comments</FormLabel>
              <FormControl>
                <Input type="text" placeholder="Any comments" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>


      <Button
        className="bg-[#7201FD] mt-4 hover:bg-[#430194] px-12 py-3 rounded-[10px] text-white"
        type="submit"
        >
            Save
        </Button>
    
    </form>
  </Form>
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
            <Button
              onClick={() => router.push("/reviews")}
              className="bg-[#7201FD] hover:bg-[#430194] px-6 py-3 rounded-[10px] text-white"
            >
              Go To Dashboard
            </Button>
          </div>
        )}
      >
        <div className="text-center">
          <div className="flex justify-center mb-5">
            <SuccessIcon />
          </div>
          <p className="text-[#121417] text-lg font-semibold mb-2">
            Congratulations!
          </p>
          <p className="text-sm text-[#64707D] mb-6">
            Your purchase order reviews has been submitted successfully.
          </p>
        </div>
      </Modal>
    </>
  );
};

export default CreatePurchaseOrder;