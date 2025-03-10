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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input";
import { Modal, message } from "antd";
import { useState } from "react";
import { useCreatePurchaseOrder } from "@/features/purchase-orders/api/use-create-order";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { purchaseOrderStatus } from "@/types";

interface CreatePurchaseOrderProps {}

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

    unitCost: z.coerce.number().positive(),
    totalCost: z.number(),

    fundingSource: z.string({
      required_error: "funding source is required",
      invalid_type_error: "funding source must be a string"
    }).min(2),
});

const CreatePurchaseOrder: React.FunctionComponent<CreatePurchaseOrderProps> = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [plannedOrderDate, setPlannedOrderDate] = useState(
    new Date().toISOString().split("T")[0] 
  );
  const router = useRouter();
  const [messageApi, contextHolder] = message.useMessage();
  const { mutate, isPending } = useCreatePurchaseOrder();


  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      category: "", 
      plannedUnit: "", 
      allocationDepartment: "",
      packSize: "",
      plannedOrderDate: "",
      plannedDeliveryDate: "",
      plannedQuantity: 0,
      revisedQuantity: 0,
      secondReview: 0,
      unitCost: 0.0,
      totalCost: 0.0,
      fundingSource: "",
    },
    });





  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    const newPurchaseOrder = {
        category: data.category, 
        plannedUnit: data.plannedUnit,
        allocationDepartment: data.allocationDepartment,
        packSize: data.packSize,
        plannedOrderDate: data.plannedOrderDate,
        plannedDeliveryDate: data.plannedDeliveryDate,
        plannedQuantity: data.plannedQuantity,
        revisedQuantity: data.revisedQuantity,
        secondReview: data.secondReview,
        unitCost: data.unitCost.toString(),
        totalCost:  (() => {
          if ((!data.revisedQuantity || data.revisedQuantity === 0) && (!data.secondReview || data.secondReview === 0)) {
            return data.unitCost * data.plannedQuantity;
          }
          if ((data.plannedQuantity === 0 || data.plannedQuantity !== null) && (!data.secondReview || data.secondReview === 0)) {
            return data.unitCost * data.revisedQuantity;
          }
          if ((data.plannedQuantity === 0 || data.plannedQuantity !== null) && (data.secondReview !== null && data.secondReview !== 0)) {
            return data.unitCost * data.secondReview;
          }
          return 0; // Default case
        })(),
        fundingSource: data.fundingSource,
        status: "PLANNED" as purchaseOrderStatus,
    };

    mutate(newPurchaseOrder, {
      onSuccess: () => {
        setIsModalOpen(true);
        form.reset();
      },
      onError: () => {
        messageApi.open({
          type: "error",
          content: "Error creating purchase order",
        });
      },
    });
    
  };


  return (
    <>
      {contextHolder}
      <div className="mb-4">
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
      <Card className="mx-auto w-full">
        <CardHeader>
          <CardTitle className="text-left text-lg font-bold">
            Create New Planning Item
          </CardTitle>
        </CardHeader>
        
        <CardContent>
        <div className="bg-white rounded-[10px]">
        

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="">
            <p className="text-[#2B2829] mb-4 text-lg font-semibold">
              Technical Specification
            </p>
            <div >
            <div className="flex gap-5 max-sm:flex-wrap">
              {/* Planning Unit */}
              <FormField
                control={form.control}
                name="plannedUnit"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Item Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter item name or planning unit" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Item Category */}
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Item Category</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter item category" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Pack Size */}
              <FormField
                control={form.control}
                name="packSize"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Pack Size</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter pack size" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              
      </div>
      </div>
      <p className="text-[#2B2829] my-4 text-lg font-semibold">
        Logistics Details
      </p>
      <div className="flex flex-col mt-3 max-sm:flex-wrap w-full">
      <div className="flex gap-5 max-sm:flex-wrap mb-2">

              <FormField
                control={form.control}
                name="allocationDepartment"
                render={({ field }) => {
                  return (
                    <FormItem className="w-full">
                      <FormLabel>Division</FormLabel>
                      <Select onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Division" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="MTD">MTD</SelectItem>
                          <SelectItem value="NCDs">NCDs</SelectItem>
                          <SelectItem value="NRL">NRL</SelectItem>
                          <SelectItem value="PHS_EPR">PHS_EPR</SelectItem>
                          <SelectItem value="RHCC">RHCC</SelectItem>
                          <SelectItem value="RIDS">RIDS</SelectItem>
                          <SelectItem value="SAMU">SAMU</SelectItem>
                          <SelectItem value="TB">TB Nutrition</SelectItem>
                          <SelectItem value="TB">TB Medicine</SelectItem>
                          <SelectItem value="TB">TB Lab</SelectItem>
                          <SelectItem value="BTD">BTD</SelectItem>
                          <SelectItem value="CS">CS</SelectItem>
                          <SelectItem value="HIV/AIDS & STIs D">HIV/AIDS & STIs D</SelectItem>
                          <SelectItem value="MCCH">MCCH</SelectItem>
                          <SelectItem value="MH">MH</SelectItem>
                          <SelectItem value="MOPD">MOPD</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              {/* Planned Order Date */}
              <FormField
                control={form.control}
                name="plannedOrderDate"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Planned Order Date</FormLabel>
                    <FormControl>
                      <Input 
                        // min={new Date().toISOString().split("T")[0]}
                        type="date" {...field} 
                        onChange={(e) => {
                          field.onChange(e.target.value);
                          setPlannedOrderDate(e.target.value); // Update planned order date
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="plannedDeliveryDate"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Planned Delivery Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} min={plannedOrderDate}/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
      </div>
      <div className="flex gap-5 max-sm:flex-wrap mb-2">
            {/* Planned Quantity */}
            <FormField
                control={form.control}
                name="plannedQuantity"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Planned Quantity</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Enter planned quantity" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Planned Quantity */}
            <FormField
                control={form.control}
                name="revisedQuantity"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Revised Quantity</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Enter revised quantity" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Planned Quantity */}
              <FormField
                control={form.control}
                name="secondReview"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Second Review</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Enter second review" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
          </div>
      </div>
                  <p className="text-[#2B2829] my-4 text-lg font-semibold">
                    Financial and Funding Details
                  </p>
              
              
                  <div className="flex gap-5 max-sm:flex-wrap ">

                  {/* Unit Cost (USD) */}
              <FormField
                control={form.control}
                name="unitCost"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Unit Cost (USD)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Enter unit cost in USD" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Total Cost (USD) */}
              <FormField
                control={form.control}
                name="totalCost"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Total Cost (USD)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Total estimated cost in USD"
                        disabled
                        {...field}
                        // value={
                        //   String(Number(form.getValues("unitCost")) * 
                        //   Number(form.getValues("plannedQuantity")))
                        // }
                        value={ (() => {
                          if((!form.getValues("revisedQuantity") || form.getValues("revisedQuantity") === 0) && (!form.getValues("secondReview") || form.getValues("secondReview") === 0)) {
                            return form.getValues("unitCost") * form.getValues("plannedQuantity")
                          }
                          if ((form.getValues("plannedQuantity") === 0 || form.getValues("plannedQuantity") !== null) && (!form.getValues("secondReview") || form.getValues("secondReview") === 0)) {
                            return form.getValues("unitCost") * form.getValues("revisedQuantity");
                          }
                          if ((form.getValues("plannedQuantity") === 0 || form.getValues("plannedQuantity") !== null) && (form.getValues("secondReview") !== null && form.getValues("secondReview") !== 0)) {
                            return form.getValues("unitCost") * form.getValues("secondReview")
                          }
                          return 0;
                        }) ()}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Funding Source */}
              <FormField
                control={form.control}
                name="fundingSource"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Funding Source</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter funding source" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Revised Quantity */}
              {/* <FormField
                control={form.control}
                name="revisedQuantity"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Revised Quantity</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="Enter revised quantity" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}

              {/* Second Review Notes */}
              {/* <FormField
                control={form.control}
                name="secondReview"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Second Review Notes</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="Enter second review notes" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}
            </div>
            <Button
              className="bg-[#7201FD] hover:bg-[#430194] px-12 py-3 rounded-[10px] text-white mt-4"
              type="submit"
              disabled={isPending}
              >
                  Save And Send
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
                  Your purchase order has been saved successfully.
                </p>
              </div>
            </Modal>
            </CardContent>
        </Card>
    </>
  );
};

export default CreatePurchaseOrder;