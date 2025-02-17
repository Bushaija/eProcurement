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
import { Modal, Skeleton, message } from "antd";
import { Suspense, useState } from "react";
import { useCreatePurchaseOrderReview } from "@/features/purchase-order-reviews/api/use-create-review";
import { PurchaseOrderReviewStatus } from "@/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { OrderDetailsComponent } from "@/components/Details";
import { useGetPurchaseOrder } from "@/features/purchase-orders/api/use-get-order";

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
  currency: z.string(),
  orderQuantity: z.coerce.number().int().positive(),
  receivedQuantity: z.coerce.number(),
  receivedDate: z.string(),
  balancedQuantity: z.coerce.number(),
  shipmentStatus: z.enum(['ORDERED', 'PLANNED', 'CANCELLED', 'RECEIVED', 'HOLD', 'PARTIAL RECEIVED']),
  comments: z.string()
});

const CreatePurchaseOrder: React.FunctionComponent<CreatePurchaseOrderReviewProps> = () => {
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [creationDate, setCreationDate] = useState(
    new Date().toISOString().split("T")[0] 
  );
  const router = useRouter();
  const [messageApi, contextHolder] = message.useMessage(); 
  const params = useParams()
  const searchParams = useSearchParams()
  const { mutate, isPending } = useCreatePurchaseOrderReview();
  const purchaseOrderId = searchParams.get("orderId");
  
  const { isPending: isLoading, data } = useGetPurchaseOrder(Number(purchaseOrderId));

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
        purchaseOrderId: Number(purchaseOrderId),
        purchaseOrderCreationDate: "",
        purchaseOrderNumber: "",
        purchaseOrderIssueDate: "",
        readTime: "",
        expectedDeliveryDate: "",
        currency: "USD",
        orderQuantity: 0,
        receivedQuantity: 0,
        receivedDate: "",
        balancedQuantity: 0,
        shipmentStatus: "PLANNED",
        comments: "",
    },
  });

  if (isLoading || isPending ) {
    return (
        <Skeleton
          className="py-5 px-5 max-sm:px-0"
          active
          paragraph={{ rows: 6 }}
        />
    );
  }


    const onSubmit = async (data: z.infer<typeof FormSchema>) => {
      const newPurchaseOrderReview = {
        purchaseOrderId: Number(data.purchaseOrderId),
        purchaseOrderCreationDate: data.purchaseOrderCreationDate || null,
        purchaseOrderNumber: data.purchaseOrderNumber || "",
        purchaseOrderIssueDate: data.purchaseOrderIssueDate || null,
        readTime: data.readTime || null,
        expectedDeliveryDate: data.expectedDeliveryDate || null,
        currency: data.currency || "USD",
        orderQuantity: Number(data.orderQuantity) || 0,
        receivedQuantity: Number(data.receivedQuantity),
        receivedDate: data.receivedDate || null,
        balancedQuantity: Number(data.orderQuantity) - Number(data.receivedQuantity) === Number(data.orderQuantity) ? 
          0 : Number(data.orderQuantity) - Number(data.receivedQuantity),
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
      <div className="bg-white rounded-[10px] mt-4 p-4 max-sm:mt-2">
        <p className="text-[#2B2829] text-xl font-semibold">
          Create Shipment Implementation 
        </p>
        <main className="flex items-start justify-center gap-4 bg-white rounded-[10px] mt- p-2 max-sm:mt-4">
 

  <Form {...form} >
    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col justify-center item -center w-full">
    <div className="flex flex-col gap-5 mt-2 max-sm:flex-wrap">
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
        <div className="flex items-center justify-center gap-4">
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

</div>

       
       

        


</div>
<div className="flex flex-col gap-5 mt-6 max-sm:flex-wrap">

       <div className="flex items-center justify-center gap-4">
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
              <FormLabel>Ordered quantity</FormLabel>
              <FormControl>
                <Input type="number"  placeholder="Enter ordered quantity" {...field} min={0} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />


</div>


</div>
<div className="flex gap-5 mt-6 max-sm:flex-wrap">

        
<div className="w-full flex items-center justify-center gap-4">
        

<FormField
          control={form.control}
          name="receivedQuantity"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Received Quantity</FormLabel>
              <FormControl>
                <Input type="number" placeholder="Enter received quantity" {...field} min={0} />
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

<FormField
  control={form.control}
  name="readTime"
  render={({ field }) => (
    <FormItem className="w-full">
      <FormLabel>Read time</FormLabel>
      <FormControl>
        <Input type="date" placeholder="Enter the read time" {...field} min={new Date().toISOString().split("T")[0]} />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>

</div>


</div>
            <p className="text-[#2B2829] my-4 text-xl font-semibold">
              Quantity and Cost Details
            </p>
            <div className="flex flex-col gap-4">


<div className="flex items-center justify-center gap-4">
            



        <FormField
          control={form.control}
          name="balancedQuantity"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Balanced quantity</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  disabled 
                  value={Number(form.getValues("orderQuantity")) - Number(form.getValues("receivedQuantity"))}
                  // placeholder="Enter planned quantity" {...field} min={0} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>


          )}
        />

{/* <FormField
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
/> */}

              <FormField
                control={form.control}
                name="shipmentStatus"
                render={({ field }) => {
                  return (
                    <FormItem className="w-full">
                      <FormLabel>Shipment status</FormLabel>
                      <Select onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          
                            <SelectItem value="ORDERED">ORDERED</SelectItem>
                            <SelectItem value="PLANNED">PLANNED</SelectItem>
                            <SelectItem value="CANCELLED">CANCELLED</SelectItem>
                            <SelectItem value="RECEIVED">RECEIVED</SelectItem>
                            <SelectItem value="HOLD">HOLD</SelectItem>
                            <SelectItem value="PARTIAL RECEIVED">PARTIAL RECEIVED</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />


</div>

<div className="flex items-center justify-center gap-4">


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
      </div>


      <Button
        className="bg-[#7201FD] mt-4 hover:bg-[#430194] px-12 py-3 rounded-[10px] text-white"
        type="submit"
        disabled={isPending}
        >
            Save
        </Button>
    
    </form>
  </Form>
  <Suspense>
  <section className="w-full">
    <OrderDetailsComponent data={data}/>
  </section>
  </Suspense>
</main>

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