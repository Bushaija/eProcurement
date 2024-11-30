"use client";

import { ArrowLeftIcon, SuccessIcon } from "@/assets/icons/icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
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
import { Input } from "@/components/ui/input";
import { PurchaseOrderDetails, PurchaseOrderReviewStatus } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { Modal, Skeleton, message } from "antd";
import { useParams } from "next/navigation";
import { useState } from "react";
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
  unitPriceDdp: z.coerce.number(),
  totalCostDdp: z.coerce.number(),
  unitPriceCip: z.coerce.number(),
  totalCostCip: z.coerce.number(),
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>();
  const [messageApi, contextHolder] = message.useMessage();
  const { mutate, isPending } = useEditPurchaseOrderReview(Number(params.id));

  const {
    data,
    isLoading,
    isError
  } = useGetPurchaseOrderReview(Number(params.id));

  // const { isPending, data } = useQuery({
  //   queryKey: ["order"],
  //   queryFn: async () => {
  //     const response = await fetch(`/api/reviews/${params.id}`).then((res) =>
  //       res.json()
  //     );
  //     return response.order;
  //   },
  // });


  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    values: {
        purchaseOrderCreationDate:data?.purchaseOrderCreationDate || "",
        purchaseOrderNumber: data?.purchaseOrderNumber || "",
        purchaseOrderIssueDate: data?.purchaseOrderIssueDate || "",
        readTime:data?.readTime || "",
        expectedDeliveryDate:data?.expectedDeliveryDate || "",
        unitPriceDdp: data?.unitPriceDdp || 0,
        totalCostDdp: data?.totalCostDdp || 0,
        unitPriceCip: data?.unitPriceCip || 0,
        totalCostCip: data?.totalCostCip || 0,
        currency:data?.currency || "",
        orderQuantity: data?.orderQuantity || 0,
        receivedQuantity:data?.receivedQuantity || 0,
        receivedDate:data?.receivedDate || "",
        balancedQuantity:data?.balancedQuantity || 0,
        shipmentStatus:data?.shipmentStatus || "PLANNED",
        comments:data?.comments || "",
    },
  });

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    const updatedOrder = {
      purchaseOrderCreationDate: data.purchaseOrderCreationDate,
      purchaseOrderNumber: data.purchaseOrderNumber,
      purchaseOrderIssueDate: data.purchaseOrderIssueDate,
      readTime: data.readTime,
      expectedDeliveryDate: data.expectedDeliveryDate,
      unitPriceDdp: data.unitPriceDdp,
      totalCostDdp: data.totalCostDdp,
      unitPriceCip: data.unitPriceCip,
      totalCostCip: data.totalCostCip,
      currency: data.currency,
      orderQuantity: Number(data.orderQuantity),
      receivedDate: data.receivedDate,
      balancedQuantity: Number(data.balancedQuantity),
      shipmentStatus: data.shipmentStatus as PurchaseOrderReviewStatus,
      comments: data.comments,
    };

    mutate(updatedOrder, {
      onSuccess: () => {
        setIsModalOpen(true);
        form.reset();
      },
      onError: () => {
        messageApi.open({
          type: "error",
          content: "Error updating order",
        });
      },
    });
  };

  if (isPending) {
    return (
      <>
        <Skeleton className="py-5 px-5" active paragraph={{ rows: 6 }} />
      </>
    );
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
    </div>

     <div className="flex gap-5 mt-6 max-sm:flex-wrap">
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
        <FormMessage />
        </FormItem>
        )}
        />

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
        name="unitPriceDdp"
        render={({ field }) => (
          <FormItem className="w-full">
            <FormLabel>Unit price DDP</FormLabel>
            <FormControl>
              <Input
                type="number"
                {...field}
                value={field.value || selectedOrder?.unitPriceDdp || ""}
                onChange={(e) => {
                  const value = parseFloat(e.target.value);
                  form.setValue("unitPriceDdp", value);
                  setSelectedOrder((prev: PurchaseOrderDetails) => ({
                    ...prev,
                    unitPriceDdp: value,
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
  name="totalCostDdp"
  render={({ field }) => (
    <FormItem className="w-full">
      <FormLabel>Total cost DDP</FormLabel>
      <FormControl>
        <Input
          type="number"
          placeholder="Enter planned quantity"
          {...field}
          value={field.value || selectedOrder?.totalCostDdp || ""}
          onChange={(e) => {
            const value = parseFloat(e.target.value); // Parse as a number
            form.setValue("totalCostDdp", value); // Set the value as a number
            setSelectedOrder((prev: PurchaseOrderDetails) => ({
              ...prev,
              totalCostDdp: value,
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
        name="unitPriceCip"
        render={({ field }) => (
          <FormItem className="w-full">
            <FormLabel>Unit price CIP</FormLabel>
            <FormControl>
              <Input
                type="number"
                placeholder="Enter revised quantity"
                {...field}
                value={field.value || selectedOrder?.unitPriceCip || ""}
                onChange={(e) => {
                  const value = parseFloat(e.target.value);
                  form.setValue("unitPriceCip", value);
                  setSelectedOrder((prev: PurchaseOrderDetails) => ({
                    ...prev,
                    unitPriceCip: value,
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
        name="totalCostCip"
        render={({ field }) => (
          <FormItem className="w-full">
            <FormLabel>Total cost CIP</FormLabel>
            <FormControl>
              <Input
                type="number"
                placeholder="Enter Total cost CIP"
                {...field}
                value={field.value || selectedOrder?.totalCostCip || ""}
                onChange={(e) => {
                  const value = parseFloat(e.target.value);
                  form.setValue("totalCostCip", value);
                  setSelectedOrder((prev: PurchaseOrderDetails) => ({
                    ...prev,
                    totalCostCip: value,
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
    </div>

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

    {/* parseFloat */}

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
          value={field.value || selectedOrder?.shipmentStatus || ""}
          onChange={(e) => {
            const value = e.target.value as ShipmentStatus;
            form.setValue("shipmentStatus", value);
            setSelectedOrder((prev: PurchaseOrderDetails) => ({
              ...prev,
              shipmentStatus: value,
            }));
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
              value={field.value || selectedOrder?.comments || ""}
              onChange={(e) => {
                const value = e.target.value;
                form.setValue("comments", value);
                setSelectedOrder((prev: PurchaseOrderDetails) => ({
                  ...prev,
                  comments: value,
                }));
              }}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
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
        </div>
      </Modal>
    </>
  );
};

export default EditOrder;
