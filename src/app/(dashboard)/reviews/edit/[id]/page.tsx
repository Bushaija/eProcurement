"use client";

import { ArrowLeftIcon, SuccessIcon } from "@/assets/icons/icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PurchaseOrderDetails, PurchaseOrderReviewStatus } from "@/types";
import { Modal, Skeleton, message } from "antd";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useEditPurchaseOrderReview } from "@/features/purchase-order-reviews/api/use-update-review";
import { useGetPurchaseOrderReview } from "@/features/purchase-order-reviews/api/use-get-review";

interface EditPurchaseOrderProps {}

type ShipmentStatus = "ORDERED" | "PLANNED" | "CANCELLED" | "RECEIVED" | "HOLD" | "PARTIAL RECEIVED";

const FormSchema = z.object({
  purchaseOrderCreationDate: z.string(),
  purchaseOrderNumber: z.string(),
  purchaseOrderIssueDate: z.string(),
  readTime: z.string(),
  expectedDeliveryDate: z.string({
    required_error: "expected delivery date is required"
  }),
  currency: z.string(),
  orderQuantity: z.coerce.number(),
  receivedQuantity: z.coerce.number(),
  receivedDate: z.string(),
  balancedQuantity: z.number(),
  shipmentStatus: z.enum(['ORDERED', 'PLANNED', 'CANCELLED', 'RECEIVED', 'HOLD', 'PARTIAL RECEIVED']),
  comments: z.string()
});

const EditOrder: React.FunctionComponent<EditPurchaseOrderProps> = () => {
  const router = useRouter();
  const params = useParams();
  const queryClient = useQueryClient();

  // State Hooks
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>();

  // Ant Design Message Hook
  const [messageApi, contextHolder] = message.useMessage();

  // React Query Hooks (Fetching & Mutating Data)
  const { data, isLoading, isError } = useGetPurchaseOrderReview(Number(params.id));
  const { mutate, isPending } = useEditPurchaseOrderReview(Number(params.id));

  // React Hook Form Setup (Must Be Called Before Any Conditional Returns)
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    values: {
      purchaseOrderCreationDate: data?.purchaseOrderCreationDate || "",
      purchaseOrderNumber: data?.purchaseOrderNumber || "",
      purchaseOrderIssueDate: data?.purchaseOrderIssueDate || "",
      readTime: data?.readTime || "",
      expectedDeliveryDate: data?.expectedDeliveryDate || "",
      currency: data?.currency || "",
      orderQuantity: data?.orderQuantity || 0,
      receivedQuantity: data?.receivedQuantity || 0,
      receivedDate: data?.receivedDate || "",
      balancedQuantity: data?.balancedQuantity || 0,
      shipmentStatus: data?.shipmentStatus || "PLANNED",
      comments: data?.comments || "",
    },
  });

  // Handle Error State (Ensure It's Not Inside a Conditional Return)
  useEffect(() => {
    if (isError) {
      messageApi.open({
        type: "error",
        content: "Error fetching order",
      });
    }
  }, [isError, messageApi]);

  // Submit Handler
  const onSubmit = async (formData: z.infer<typeof FormSchema>) => {
    try {
      console.log("Form data received:", formData);
      
      // Create a clean object with only the fields that have values
      const updatedOrder: Record<string, any> = {};
      
      // Only include fields that have values
      if (formData.purchaseOrderCreationDate) updatedOrder.purchaseOrderCreationDate = formData.purchaseOrderCreationDate;
      if (formData.purchaseOrderNumber) updatedOrder.purchaseOrderNumber = formData.purchaseOrderNumber;
      if (formData.purchaseOrderIssueDate) updatedOrder.purchaseOrderIssueDate = formData.purchaseOrderIssueDate;
      if (formData.readTime) updatedOrder.readTime = formData.readTime;
      if (formData.expectedDeliveryDate) updatedOrder.expectedDeliveryDate = formData.expectedDeliveryDate;
      if (formData.currency) updatedOrder.currency = formData.currency;
      
      // Always include numeric fields, even if they're 0
      updatedOrder.orderQuantity = Number(formData.orderQuantity || 0);
      updatedOrder.receivedQuantity = Number(formData.receivedQuantity || 0);
      updatedOrder.balancedQuantity = Number(formData.balancedQuantity || 0);
      
      // Include other fields
      if (formData.receivedDate) updatedOrder.receivedDate = formData.receivedDate;
      if (formData.shipmentStatus) updatedOrder.shipmentStatus = formData.shipmentStatus;
      if (formData.comments) updatedOrder.comments = formData.comments;

      console.log("Submitting update:", updatedOrder);

      // Call the mutation
      mutate(updatedOrder, {
        onSuccess: (responseData) => {
          console.log("Update successful:", responseData);
          // Invalidate queries to refetch data
          queryClient.invalidateQueries({ queryKey: ["reviews", { id: Number(params.id) }] });
          queryClient.invalidateQueries({ queryKey: ["reviews"] });
          setIsModalOpen(true);
        },
        onError: (error) => {
          console.error("Update error:", error);
          messageApi.open({
            type: "error",
            content: "Error updating order: " + error.message,
          });
        },
      });
    } catch (error) {
      console.error("Form submission error:", error);
      messageApi.open({
        type: "error",
        content: "Error in form submission",
      });
    }
  };

  // Handle Loading & Pending State After Hooks Are Called
  if (isLoading || isPending) {
    return <Skeleton className="py-5 px-5" active paragraph={{ rows: 6 }} />;
  }

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
        <p className="text-[#2B2829] text-xl mb-8 font-semibold">Order Details</p>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex gap-5 max-sm:flex-wrap">
              <FormField
                control={form.control}
                name="purchaseOrderCreationDate"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Purchase order creation date</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        placeholder="Enter Purchase creation date"
                        {...field}
                        value={field.value || selectedOrder?.purchaseOrderCreationDate || ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          form.setValue("purchaseOrderCreationDate", value);
                          setSelectedOrder((prev: PurchaseOrderDetails) => ({
                            ...prev,
                            purchaseOrderCreationDate: value,
                          }));
                        }}
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
                      <Input
                        type="text"
                        placeholder="Enter purchase order no"
                        {...field}
                        value={field.value || selectedOrder?.purchaseOrderNumber || ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          form.setValue("purchaseOrderNumber", value);
                          setSelectedOrder((prev: PurchaseOrderDetails) => ({
                            ...prev,
                            purchaseOrderNumber: value,
                          }));
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
                      <Input
                        type="date"
                        placeholder="Enter purchaseOrderIssueDate"
                        {...field}
                        value={field.value || selectedOrder?.purchaseOrderIssueDate || ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          form.setValue("purchaseOrderIssueDate", value);
                          setSelectedOrder((prev: PurchaseOrderDetails) => ({
                            ...prev,
                            purchaseOrderIssueDate: value,
                          }));
                        }}
                      />
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
                    <FormLabel>Read Time</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        placeholder="Enter read time"
                        {...field}
                        value={field.value || selectedOrder?.readTime || ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          form.setValue("readTime", value);
                          setSelectedOrder((prev: PurchaseOrderDetails) => ({
                            ...prev,
                            readTime: value,
                          }));
                        }}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <div className="flex gap-5 mt-6 max-sm:flex-wrap">
              <FormField
                control={form.control}
                name="expectedDeliveryDate"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Expected Delivery Date (EDD)</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        {...field}
                        value={field.value || selectedOrder?.expectedDeliveryDate || ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          form.setValue("expectedDeliveryDate", value);
                          setSelectedOrder((prev: PurchaseOrderDetails) => ({
                            ...prev,
                            expectedDeliveryDate: value,
                          }));
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex gap-5 mt-6 max-sm:flex-wrap">
              <FormField
                control={form.control}
                name="currency"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Currency</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Enter unit cost"
                        {...field}
                        value={field.value || selectedOrder?.currency || ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          form.setValue("currency", value);
                          setSelectedOrder((prev: PurchaseOrderDetails) => ({
                            ...prev,
                            currency: value,
                          }));
                        }}
                      />
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
                    <FormLabel>Order Quantity</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter order quantity"
                        {...field}
                        value={field.value || selectedOrder?.orderQuantity || 0}
                        onChange={(e) => {
                          const value = parseInt(e.target.value);
                          form.setValue("orderQuantity", value);
                          setSelectedOrder((prev: PurchaseOrderDetails) => ({
                            ...prev,
                            orderQuantity: value,
                          }));
                        }}
                        disabled
                      />
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
                    <FormLabel>Recieved quantity</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter received quantity"
                        {...field}
                        value={field.value || selectedOrder?.receivedQuantity || ""}
                        onChange={(e) => {
                          const value = parseInt(e.target.value)
                          form.setValue("receivedQuantity", value);
                          setSelectedOrder((prev: PurchaseOrderDetails) => ({
                            ...prev,
                            receivedQuantity: value,
                          }));
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex gap-5 mt-6 max-sm:flex-wrap">
              <FormField
                control={form.control}
                name="receivedDate"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Recieved date</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        placeholder="Enter received date"
                        {...field}
                        value={field.value || selectedOrder?.receivedDate || ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          form.setValue("receivedDate", value);
                          setSelectedOrder((prev: PurchaseOrderDetails) => ({
                            ...prev,
                            receivedDate: value,
                          }));
                        }}
                      />
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
                      <Input
                        type="number"
                        placeholder="Enter balance quantity"
                        {...field}
                        value={field.value || selectedOrder?.balancedQuantity || ""}
                        onChange={(e) => {
                          const value = parseInt(e.target.value);
                          form.setValue("balancedQuantity", value);
                          setSelectedOrder((prev: PurchaseOrderDetails) => ({
                            ...prev,
                            balancedQuantity: value,
                          }));
                        }}
                      />
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
                        className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md"
                        onChange={(e) => {
                          field.onChange(e.target.value as ShipmentStatus);
                        }}
                      >
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
                      <Input
                        type="text"
                        placeholder="Enter comments"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e.target.value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button
              type="submit"
              className="bg-[#7201FD] hover:bg-[#430194] px-12 py-3 rounded-[10px] text-white mt-6"
            >
              Save
            </Button>
          </form>
        </Form>
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
            Your purchase order review has been updated successfully.
          </p>
          <Button 
            onClick={() => {
              // Refresh the data
              queryClient.invalidateQueries({ queryKey: ["reviews", { id: Number(params.id) }] });
              setIsModalOpen(false);
            }}
            className="bg-[#7201FD] hover:bg-[#430194] px-6 py-2 rounded-[10px] text-white mb-4"
          >
            Continue Editing
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default EditOrder;