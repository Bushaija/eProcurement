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
import { PurchaseOrderDetails } from "@/types";
import { Modal, Skeleton, message } from "antd";
import { useParams } from "next/navigation";
import { useState } from "react";
import { useGetPurchaseOrder } from "@/features/purchase-orders/api/use-get-order";
import { useEditPurchaseOrder } from "@/features/purchase-orders/api/use-update-order";
import { Loader2 } from "lucide-react";

interface EditOrderProps {}

const FormSchema = z.object({
  category: z.string({
    required_error: "category is required",
    invalid_type_error: "category must be a string"
  }).min(2),
  plannedUnit: z.string({
    required_error: "planned unit is required",
    invalid_type_error: "planned unit must be a string"
  }).min(2),
  allocationDepartment: z.string({
    required_error: "allocated department is required",
    invalid_type_error: "allocated department must be a string"
  }).min(2),
  packSize: z.string({
    required_error: "pack size is required",
    invalid_type_error: "pack size must be a string"
  }).min(1),
  plannedOrderDate: z.string({
    required_error: "planned order date is required",
    invalid_type_error: "planned order date must be a date"
  }).min(2),
  plannedDeliveryDate: z.string({
    required_error: "planned delivery date is required",
    invalid_type_error: "planned delivery date must be a date"
  }).min(2),

  plannedQuantity: z.coerce.number({
    required_error: "planned quantity is required",
    invalid_type_error: "planned quantity must be a number"
  }).int().positive(),

  revisedQuantity: z.coerce.number({
    required_error: "revised quantity is required",
    invalid_type_error: "revised quantity must be a number"
  }),

  secondReview: z.coerce.number({
    required_error: "second review is required",
    invalid_type_error: "second review must be a number"
  }),

  unitCost: z.coerce.number(),
  totalCost: z.number(),

  fundingSource: z.string({
    required_error: "funding source is required",
    invalid_type_error: "funding source must be a string"
  }).min(2),
});


const EditPurchaseOrder: React.FunctionComponent<EditOrderProps> = () => {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>();
  const [messageApi, contextHolder] = message.useMessage();
  const router = useRouter();
  const params = useParams();

  const { mutate, isPending, error } = useEditPurchaseOrder(Number(params.id));
  const {
    data,
    isLoading,
    isError
  } = useGetPurchaseOrder(Number(params.id));

  console.log("error: ", error);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    values: {
      category: data?.category || "",
      plannedUnit: data?.plannedUnit || "",
      allocationDepartment: data?.allocationDepartment || "",
      packSize: data?.packSize || "",
      plannedOrderDate: data?.plannedOrderDate || "",
      plannedDeliveryDate: data?.plannedDeliveryDate || "",
      plannedQuantity: data?.plannedQuantity || 0,

      revisedQuantity: data?.revisedQuantity || 0,
      secondReview: data?.secondReview || 0,
      unitCost: data?.unitCost ? Number(data?.unitCost) : 0,
      totalCost: data?.totalCost ? data?.totalCost : 0.0,
      fundingSource: data?.fundingSource || "",
    },
  });

  // formatDecimals

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    const updatedOrder = {
      category: data.category,
      plannedUnit: data.plannedUnit,
      allocationDepartment: data.allocationDepartment,
      packSize: data.packSize,
      plannedOrderDate: data.plannedOrderDate,
      plannedDeliveryDate: data.plannedDeliveryDate,
      unitCost: data.unitCost.toString(),
      plannedQuantity: data.plannedQuantity,
      revisedQuantity: data.revisedQuantity,
      secondReview: data.secondReview,
      totalCost: (() => {
        if ((!data.revisedQuantity || data.revisedQuantity === 0) && (!data.secondReview || data.secondReview === 0)) {
          return Number(data.unitCost * data.plannedQuantity);
        }
        if ((data.plannedQuantity === 0 || data.plannedQuantity !== null) && (!data.secondReview || data.secondReview === 0)) {
          return Number(data.unitCost * data.revisedQuantity);
        }
        if ((data.plannedQuantity === 0 || data.plannedQuantity !== null) && (data.secondReview !== null && data.secondReview !== 0)) {
          return Number(data.unitCost * data.secondReview);
        }
        return 0; 
      })(),
      fundingSource: data.fundingSource,
      updated_at: new Date(),
    };

    console.log("updated order: ", updatedOrder);

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

  

  if (isLoading) {
    return (
      <>
        <Skeleton className="py-5 px-5" active paragraph={{ rows: 6 }} />
      </>
    );
  }

  return (
    <>
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
      <p className="text-[#2B2829] text-xl mb-8 font-semibold">
        Order Details
      </p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex gap-5 max-sm:flex-wrap">
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter category"
                      {...field}
                      value={field.value || selectedOrder?.category || ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        form.setValue("category", value);
                        setSelectedOrder((prev: PurchaseOrderDetails) => ({
                          ...prev,
                          category: value,
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
              name="plannedUnit"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Planned Unit</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter planning unit"
                      {...field}
                      value={field.value || selectedOrder?.plannedUnit || ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        form.setValue("plannedUnit", value);
                        setSelectedOrder((prev: PurchaseOrderDetails) => ({
                          ...prev,
                          plannedUnit: value,
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
              name="allocationDepartment"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Allocated Department</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter allocationDepartment"
                      {...field}
                      value={field.value || selectedOrder?.allocationDepartment || ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        form.setValue("allocationDepartment", value);
                        setSelectedOrder((prev: PurchaseOrderDetails) => ({
                          ...prev,
                          allocationDepartment: value,
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
              name="packSize"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Pack Size</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter pack size"
                      {...field}
                      value={field.value || selectedOrder?.packSize || ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        form.setValue("packSize", value);
                        setSelectedOrder((prev: PurchaseOrderDetails) => ({
                          ...prev,
                          packSize: value,
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
        name="plannedOrderDate"
        render={({ field }) => (
          <FormItem className="w-full">
            <FormLabel>Planned Order Date</FormLabel>
            <FormControl>
              <Input
                type="date"
                {...field}
                value={field.value || selectedOrder?.plannedOrderDate || ""}
                onChange={(e) => {
                  const value = e.target.value;
                  form.setValue("plannedOrderDate", value);
                  setSelectedOrder((prev: PurchaseOrderDetails) => ({
                    ...prev,
                    plannedOrderDate: value,
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
              name="plannedDeliveryDate"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Planned Delivery Date</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      {...field}
                      value={field.value || selectedOrder?.plannedDeliveryDate || ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        form.setValue("plannedDeliveryDate", value);
                        setSelectedOrder((prev: PurchaseOrderDetails) => ({
                          ...prev,
                          plannedDeliveryDate: value,
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
        name="plannedQuantity"
        render={({ field }) => (
          <FormItem className="w-full">
            <FormLabel>Planned Quantity</FormLabel>
            <FormControl>
              <Input
                type="number"
                placeholder="Enter planned quantity"
                {...field}
                value={field.value || selectedOrder?.plannedQuantity || ""}
                onChange={(e) => {
                  const value = parseFloat(e.target.value); // Parse as a number
                  form.setValue("plannedQuantity", value); // Set the value as a number
                  setSelectedOrder((prev: PurchaseOrderDetails) => ({
                    ...prev,
                    plannedQuantity: value,
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
              name="revisedQuantity"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Revised Quantity</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter revised quantity"
                      {...field}
                      value={field.value || selectedOrder?.revisedQuantity || ""}
                      onChange={(e) => {
                        const value = parseFloat(e.target.value);
                        form.setValue("revisedQuantity", value);
                        setSelectedOrder((prev: PurchaseOrderDetails) => ({
                          ...prev,
                          revisedQuantity: value,
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
              name="secondReview"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Second Review</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter second review"
                      {...field}
                      value={field.value || selectedOrder?.secondReview || ""}
                      onChange={(e) => {
                        const value = parseFloat(e.target.value);
                        form.setValue("secondReview", value);
                        setSelectedOrder((prev: PurchaseOrderDetails) => ({
                          ...prev,
                          secondReview: value,
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
              name="unitCost"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Unit Cost (USD)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter unit cost"
                      {...field}
                      value={field.value || selectedOrder?.unitCost || ""}
                      onChange={(e) => {
                        const value = parseFloat(e.target.value);
                        form.setValue("unitCost", value);
                        setSelectedOrder((prev: PurchaseOrderDetails) => ({
                          ...prev,
                          unitCost: value,
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
              name="totalCost"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Total Cost (USD)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter total cost"
                      {...field}
                      value={field.value || selectedOrder?.totalCost || 0}
                      onChange={(e) => {
                        const value = parseFloat(e.target.value);
                        form.setValue("totalCost", value);
                        setSelectedOrder((prev: PurchaseOrderDetails) => ({
                          ...prev,
                          totalCost: value,
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
            name="fundingSource"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Funding Source</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter funding source"
                    {...field}
                    value={field.value || selectedOrder?.fundingSource || ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      form.setValue("fundingSource", value);
                      setSelectedOrder((prev: PurchaseOrderDetails) => ({
                        ...prev,
                        fundingSource: value,
                      }));
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            className="bg-[#7201FD] hover:bg-[#430194] px-12 py-3 rounded-[10px] text-white mt-6"
            type="submit"
          >
            {
              isPending ?
              (<Loader2 className="mr-2 h-4 w-4 animate-spin" />) : ("Update shipment Item")
            }
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
              onClick={() => router.push("/purchase-orders")}
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
            Your purchase order has been updated successfully.
          </p>
        </div>
      </Modal>
    </>
  );
};

export default EditPurchaseOrder;

