"use client"

import { DataTable } from '@/components/ui/table/data-table';
import { Button } from "@/components/ui/button";
import { useDeletePurchaseOrder } from "@/features/purchase-orders/api/use-delete-order";
import { useGetPurchaseOrders } from "@/features/purchase-orders/api/use-get-orders";
import { Skeleton, message } from "antd";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { usePurchaseOrderTableFilters } from "./purchase-order-table/use-purchase-order-table-filters";
// fixing the table
import { type DataTableRowAction } from "@/types"
import { getColumns } from "./purchase-order-table/orders-table-columns";
import { PurchaseOrder } from "@/db/schema";

import { DataTableSearch } from "@/components/table/data-table-search";
import { DataTableFilterBox } from "@/components/table/data-table-filter-box";
import { DataTableResetFilter } from "@/components/table/data-table-reset-filter";
import { DataTableExport } from "@/components/table/data-table-export";
import { useReactTable, getCoreRowModel, getPaginationRowModel, getSortedRowModel} from "@tanstack/react-table";
import { useBulkCreateShipments } from "@/features/purchase-orders/api/use-bulk-create-orders";
import { TInsertShipmentsSchema } from "@/db/schema"
import { BATCH_SIZE, CATEGORY_OPTIONS, DIVISION_OPTIONS, orderSchema } from '@/constants/data';
import { CsvImporter } from './csv-importer';

type ImportDataType = Record<string, any>;


  interface DashboardProps {}
  
  const PurchaseOrdersPage: React.FunctionComponent<DashboardProps> = () => {
    const router = useRouter();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [importData, setImportData] = React.useState<TInsertShipmentsSchema[]>([]);
    const [selectedOrderID, setSelectedOrderID] = useState<number>();
    const [rowAction, setRowAction] = useState<DataTableRowAction<PurchaseOrder> | null>(null);
    const columns = React.useMemo(() => getColumns({ 
      setRowAction,
      isModalOpen,
      selectedOrderID,
      setIsModalOpen,
      setSelectedOrderID,
      router,
     }),[setRowAction, isModalOpen, selectedOrderID, setIsModalOpen, setSelectedOrderID, router]);

     const createShipments = useBulkCreateShipments();
    
    const [isLoading, setIsLoading] = useState(false);
    
    const [isImporting, setIsImporting] = useState<boolean>(false);
    const [messageApi, contextHolder] = message.useMessage();
    const { mutate} = useDeletePurchaseOrder(selectedOrderID);

    // fixing the table
    const purchaseOrdersQuery = useGetPurchaseOrders()
    const data = purchaseOrdersQuery.data || [];
    const isPending = purchaseOrdersQuery.isPending || purchaseOrdersQuery.isLoading;
    const error = purchaseOrdersQuery.error;

    React.useEffect(() => {
      if (data.length > 0) {
        setImportData(data);
      }
    }, [data]);

    const {
      plannedUnitSearch,
      setPlannedUnitSearch,
      setPage,
  
      allocationDepartmentFilter,
      categoryFilter,
      setCategoryFilter,
      setAllocationDepartmentFilter,
      isAnyFilterActive,
      resetFilters
    } = usePurchaseOrderTableFilters();

    const filteredData = data.filter((purchaseOrder) => {
      const matchesSearch = purchaseOrder.plannedUnit
        .toLowerCase()
        .includes(plannedUnitSearch.toLowerCase());
      
      const matchesDepartment = allocationDepartmentFilter
        ? purchaseOrder.allocationDepartment === allocationDepartmentFilter
        : true;
  
      return matchesSearch && matchesDepartment;
    });

    const table = useReactTable({
      data: filteredData,
      columns,
      enableRowSelection: true,
      getPaginationRowModel: getPaginationRowModel(),
      getSortedRowModel: getSortedRowModel(),
      getCoreRowModel: getCoreRowModel(),
    });    
  
    
  
    if (isPending || isImporting) {
      return (
        <>
          <Skeleton
            className="py-5 px-5 max-sm:px-0"
            active
            paragraph={{ rows: 6 }}
          />
        </>
      );
    }

    if (error) {
      messageApi.open({
        type: "error",
        content: "Error fetching data",
      });
    }
    
    const handleClick = async () => {
      setIsLoading(true);
      await router.push("/purchase-orders/new");
      setIsLoading(false);
    };
  
    
    const handleOrderClick = (id: string) => {
      router.push(`/purchase-orders/${id}`);
    };

    return (
      <>
        {contextHolder}
        <div className="flex justify-between items-center mt-2">
          <div>
            <p className="text-[#121417] text-2xl font-bold max-sm:text-xl">
              Planned Shipment Items
            </p>
            <p className="text-[#64707D] text-sm font-normal max-sm:text-xs mb-4">
              You are viewing all planned shipment items
            </p>
          </div>
          <Button
            onClick={handleClick}
            disabled={isLoading}
            className="bg-[rgb(114,1,253)] hover:bg-[#430194] px-4 py-3 rounded-[10px] text-white"
          >
            {
              isLoading ?
              (<Loader2 className="mr-2 h-4 w-4 animate-spin" />) : ("Create Shipment Item")
            }
          </Button>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 w-full">
            <DataTableSearch
              searchKey="by Item name"
              searchQuery={plannedUnitSearch}
              setSearchQuery={setPlannedUnitSearch}
              setPage={setPage}
            />

            <DataTableFilterBox
              filterKey="allocationDepartment"
              title="Division"
              options={DIVISION_OPTIONS}
              filterValue={allocationDepartmentFilter}
              setFilterValue={setAllocationDepartmentFilter}
            />

            <DataTableFilterBox
              filterKey="category"
              title="category"
              options={CATEGORY_OPTIONS}
              filterValue={categoryFilter}
              setFilterValue={setCategoryFilter}
            />

            <DataTableResetFilter
              isFilterActive={isAnyFilterActive}
              onReset={resetFilters}
            />
        </div>
        <div className="flex items-center gap-4">
          <DataTableExport 
            table={table}
          />

          <CsvImporter
            fields={[
              { label: "Category", value: "category", required: true},
              { label: "Medicine", value: "plannedUnit", required: true},
              { label: "Department", value: "allocationDepartment", required: true},
              { label: "Pack size", value: "packSize", required: true},
              { label: "Planned Order Date", value: "plannedOrderDate", required: true},
              { label: "Planned Delivery Date", value: "plannedDeliveryDate", required: true},
              { label: "Planned Quantity", value: "plannedQuantity", required: true},
              { label: "Revised Quantity", value: "revisedQuantity", required: true},
              { label: "Second Review", value: "secondReview", required: true},
              { label: "Unit Cost", value: "unitCost", required: true},
              { label: "Total Cost", value: "totalCost", required: true},
              { label: "Funding Source", value: "fundingSource", required: true},
              { label: "Status", value: "status", required: true},
            ]}
            // onImport={() => {}}
            onImport={
              (parsedData: any[]) => {
                const filteredData = parsedData.filter(row =>
                  Object.values(row).some(value => value !== "" && value !== null)
                );
              
                console.log("Filtered Data:", filteredData); // Debugging step
    
                let errorMessages: string[] = [];
              
                // Validate each row using Zod
                const validatedData = filteredData.map((item, index) => {
                  const result = orderSchema.safeParse({
                    category: item.category || "",
                    plannedUnit: item.plannedUnit || "",
                    allocationDepartment: item.allocationDepartment || "",
                    packSize: item.packSize || "",
                    plannedOrderDate: item.plannedOrderDate || "",
                    plannedDeliveryDate: item.plannedDeliveryDate || "",
                    plannedQuantity: Number(item.plannedQuantity) || 0,
                    revisedQuantity: item.revisedQuantity ? Number(item.revisedQuantity) : 0, // Convert empty to null
                    secondReview: item.secondReview ? Number(item.secondReview) : 0,
                    unitCost: String(item.unitCost) || "",
                    totalCost: Number(item.totalCost) || 0,
                    fundingSource: item.fundingSource || "",
                    status: item.status || "PLANNED",
                  });
              
                  if (!result.success) {
                    const fieldErrors = Object.entries(result.error.format())
                        .map(([field, error]) => `${field}: ${Array.isArray(error) ? error.join(", ") : error._errors.join(", ")}`)
                        .join(" | ");
                        errorMessages.push(`Row ${index + 1}: ${fieldErrors}`);
                    return null; // Skip invalid rows
                  }
              
                  return result.data;
                }).filter(Boolean); // Remove null values
              
                console.log("Validated Data:", validatedData); // Debugging step
              
                if (validatedData.length === 0) {
                  alert(`Import failed! The following errors were found:\n\n${errorMessages.join("\n")}`);
                  return;
                }
    
                setImportData((prev) => [...prev, ...validatedData as TInsertShipmentsSchema[]])
    
                const sendBatches = async (data: TInsertShipmentsSchema[]) => {
                  for (let i = 0; i < data.length; i += BATCH_SIZE) {
                    const batch = data.slice(i, i + BATCH_SIZE);
                    try {
                      await createShipments.mutateAsync(batch, {
                        onSuccess: () => {
                          setIsImporting(true)
                          purchaseOrdersQuery.refetch();
                          messageApi.open({
                            type: "success",
                            content: "Shipment added successfully",
                          });
                          setIsImporting(false)
                        },
                        onError: (err) => {
                          messageApi.open({
                            type: "error",
                            content: err.message || "An error occurred while adding shipment item(s).",
                          });
                        },
                      });
                    } catch (error) {
                      console.error("Error sending batch:", error);
                    }
                  }
                };
    
                sendBatches(validatedData);
            }}
            className="self-end"
        />
        </div>

      </div>

      <div className="bg-white rounded-[20px]">
        <div className="mt-10 z-10">
          <DataTable columns={columns} data={filteredData} totalItems={filteredData.length} rowClick={(id: string) => handleOrderClick(id)} />
        </div>
      </div>
      </>
    );
  };
  
  export default PurchaseOrdersPage;
  