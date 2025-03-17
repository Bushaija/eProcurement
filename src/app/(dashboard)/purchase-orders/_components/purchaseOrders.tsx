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
import { BATCH_SIZE, CATEGORY_OPTIONS, DIVISION_OPTIONS, orderSchema } from '@/constants/data';
import { CsvImporter } from './csv-importer';



  interface DashboardProps {}
  
  const PurchaseOrdersPage: React.FunctionComponent<DashboardProps> = () => {
    const router = useRouter();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [importData, setImportData] = React.useState<any[]>([]);
    const [selectedOrderID, setSelectedOrderID] = useState<number>();
    const [rowAction, setRowAction] = useState<DataTableRowAction<PurchaseOrder> | null>(null);
    
    // Use useEffect for browser-specific code to avoid hydration mismatches
    const [mounted, setMounted] = React.useState(false);
    React.useEffect(() => {
      setMounted(true);
    }, []);
    
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

    // Handle API error with useEffect to avoid calling message in render
    React.useEffect(() => {
      if (error && mounted) {
        messageApi.open({
          type: "error",
          content: "Error fetching data",
        });
      }
    }, [error, messageApi, mounted]);

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
      
      // Handle multiple selections for allocationDepartment
      const departmentValues = allocationDepartmentFilter ? allocationDepartmentFilter.split('.') : [];
      const matchesDepartment = departmentValues.length === 0 || 
        departmentValues.includes(purchaseOrder.allocationDepartment);
  
      // Handle multiple selections for category
      const categoryValues = categoryFilter ? categoryFilter.split('.') : [];
      const matchesCategory = categoryValues.length === 0 || 
        categoryValues.includes(purchaseOrder.category);
  
      return matchesSearch && matchesDepartment && matchesCategory;
    });

    const table = useReactTable({
      data: filteredData,
      columns,
      enableRowSelection: true,
      getPaginationRowModel: getPaginationRowModel(),
      getSortedRowModel: getSortedRowModel(),
      getCoreRowModel: getCoreRowModel(),
    });    
  
    
  
    const handleClick = async () => {
      setIsLoading(true);
      await router.push("/purchase-orders/new");
      setIsLoading(false);
    };
  
    
    const handleOrderClick = (id: string) => {
      router.push(`/purchase-orders/${id}`);
    };

    // Render loading state for server-side rendering
    const renderLoadingState = () => (
      <div className="py-5 px-5 max-sm:px-0">
        <div className="h-8 w-64 bg-gray-200 rounded animate-pulse mb-4"></div>
        <div className="h-4 w-full bg-gray-200 rounded animate-pulse mb-2"></div>
        <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse mb-2"></div>
        <div className="h-4 w-5/6 bg-gray-200 rounded animate-pulse mb-2"></div>
        <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse"></div>
      </div>
    );

    // Render skeleton loading state
    const renderSkeletonLoading = () => (
      <Skeleton
        className="py-5 px-5 max-sm:px-0"
        active
        paragraph={{ rows: 6 }}
      />
    );

    // Render main content
    const renderMainContent = () => (
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
              onImport={onCsvImport}
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

    // Define the CSV import handler outside of the render function
    const onCsvImport = (parsedData: any[]) => {
      const filteredData = parsedData.filter(row =>
        Object.values(row).some(value => value !== "" && value !== null)
      );
    
      console.log("Filtered Data:", filteredData); // Debugging step

      let errorMessages: string[] = [];
      
      // Pre-validate data to catch common format issues
      const preValidateData = (data: any[]) => {
        let hasWarnings = false;
        let warnings: Array<{type: string, content: string, duration: number}> = [];
        
        // Check for missing required columns
        const requiredColumns = ["category", "plannedUnit", "allocationDepartment", "packSize", 
                                "plannedOrderDate", "plannedDeliveryDate", "plannedQuantity", 
                                "unitCost", "totalCost", "fundingSource"];
        
        const missingColumns = requiredColumns.filter(col => 
          !data.some(row => row[col] !== undefined && row[col] !== null && row[col] !== "")
        );
        
        if (missingColumns.length > 0) {
          warnings.push({
            type: "warning",
            content: `Missing required columns: ${missingColumns.join(", ")}`,
            duration: 8
          });
          hasWarnings = true;
        }
        
        // Check for numeric fields with non-numeric values
        const numericFields = ["plannedQuantity", "revisedQuantity", "secondReview", "totalCost"];
        const numericErrors: Record<string, number> = {};
        
        data.forEach((row, index) => {
          numericFields.forEach(field => {
            if (row[field] !== undefined && row[field] !== null && row[field] !== "" && 
                isNaN(Number(row[field]))) {
              numericErrors[field] = (numericErrors[field] || 0) + 1;
            }
          });
        });
        
        if (Object.keys(numericErrors).length > 0) {
          Object.entries(numericErrors).forEach(([field, count]) => {
            warnings.push({
              type: "warning",
              content: `${count} non-numeric values found in ${field} column`,
              duration: 6
            });
          });
          hasWarnings = true;
        }
        
        // Check for date fields with invalid formats
        const dateFields = ["plannedOrderDate", "plannedDeliveryDate"];
        const dateErrors: Record<string, number> = {};
        
        data.forEach((row, index) => {
          dateFields.forEach(field => {
            if (row[field] !== undefined && row[field] !== null && row[field] !== "") {
              const date = new Date(row[field]);
              if (isNaN(date.getTime())) {
                dateErrors[field] = (dateErrors[field] || 0) + 1;
              }
            }
          });
        });
        
        if (Object.keys(dateErrors).length > 0) {
          Object.entries(dateErrors).forEach(([field, count]) => {
            warnings.push({
              type: "warning",
              content: `${count} invalid date formats found in ${field} column`,
              duration: 6
            });
          });
          hasWarnings = true;
        }
        
        // Display warnings with setTimeout to avoid calling in render
        warnings.forEach((warning, index) => {
          setTimeout(() => {
            messageApi.open({
              type: warning.type as any,
              content: warning.content,
              duration: warning.duration
            });
          }, index * 300); // Stagger warnings
        });
        
        return hasWarnings;
      };
      
      // Run pre-validation
      const hasPreValidationWarnings = preValidateData(filteredData);
      if (hasPreValidationWarnings) {
        setTimeout(() => {
          messageApi.open({
            type: "info",
            content: "Attempting to process data despite warnings...",
            duration: 3,
          });
        }, 0);
      }
    
      // Validate each row using Zod
      const validatedData = filteredData.map((item, index) => {
        // Ensure dates are in the correct format (YYYY-MM-DD)
        const formatDate = (dateStr: string) => {
          if (!dateStr) return "";
          try {
            // Handle different date formats
            const date = new Date(dateStr);
            if (isNaN(date.getTime())) return "";
            return date.toISOString().split('T')[0]; // YYYY-MM-DD format
          } catch (e) {
            return "";
          }
        };

        // Ensure numeric values are properly formatted
        const formatNumber = (value: any): number => {
          if (value === undefined || value === null || value === "") return 0;
          // Remove any non-numeric characters except decimal point
          const cleanedValue = String(value).replace(/[^0-9.]/g, '');
          const num = Number(cleanedValue);
          return isNaN(num) ? 0 : num;
        };

        try {
          const result = orderSchema.safeParse({
            category: (item.category || "").trim(),
            plannedUnit: (item.plannedUnit || "").trim(),
            allocationDepartment: (item.allocationDepartment || "").trim(),
            packSize: (item.packSize || "").trim(),
            plannedOrderDate: formatDate(item.plannedOrderDate),
            plannedDeliveryDate: formatDate(item.plannedDeliveryDate),
            plannedQuantity: formatNumber(item.plannedQuantity),
            revisedQuantity: formatNumber(item.revisedQuantity),
            secondReview: formatNumber(item.secondReview),
            unitCost: String(item.unitCost || "").trim(),
            totalCost: formatNumber(item.totalCost),
            fundingSource: (item.fundingSource || "").trim(),
            status: (item.status || "PLANNED").trim().toUpperCase(),
          });
      
          if (!result.success) {
            const fieldErrors = Object.entries(result.error.format())
                .map(([field, error]) => `${field}: ${Array.isArray(error) ? error.join(", ") : error._errors.join(", ")}`)
                .join(" | ");
                errorMessages.push(`Row ${index + 1}: ${fieldErrors}`);
            return null; // Skip invalid rows
          }
      
          return result.data;
        } catch (error) {
          console.error(`Error validating row ${index + 1}:`, error);
          errorMessages.push(`Row ${index + 1}: Unexpected validation error`);
          return null;
        }
      }).filter(Boolean); // Remove null values
    
      console.log("Validated Data:", validatedData); // Debugging step
    
      if (validatedData.length === 0) {
        // Replace alert with toaster notification - use setTimeout to avoid calling in render
        setTimeout(() => {
          messageApi.open({
            type: "error",
            content: "CSV import failed due to validation errors",
            duration: 5,
          });
          
          // Show detailed errors in separate toasts
          if (errorMessages.length > 0) {
            // Group similar errors to avoid too many toasts
            const groupedErrors = errorMessages.reduce((acc, error) => {
              const errorType = error.split(':')[1]?.trim().split(' ')[0] || 'Unknown';
              if (!acc[errorType]) {
                acc[errorType] = [];
              }
              acc[errorType].push(error);
              return acc;
            }, {} as Record<string, string[]>);
            
            // Show one toast per error type with count
            Object.entries(groupedErrors).forEach(([errorType, errors], index) => {
              setTimeout(() => {
                messageApi.open({
                  type: "warning",
                  content: `${errors.length} ${errorType} error${errors.length > 1 ? 's' : ''} found. Example: ${errors[0].split(':').slice(1).join(':')}`,
                  duration: 8,
                });
              }, 300 + (index * 300)); // Small delay between toasts
            });
          }
        }, 0);
        return;
      }

      // Don't update importData state here as it's causing type issues
      // setImportData((prev) => [...prev, ...validatedData as TInsertShipmentsSchema[]])

      const sendBatches = async (data: any[]) => {
        let successCount = 0;
        let failureCount = 0;
        
        // Additional validation before sending to API
        const validBatches = data.map(item => {
          // Ensure all required fields are present and properly formatted
          return {
            ...item,
            // Ensure status is one of the allowed values
            status: ["PLANNED", "APPROVED", "REJECTED", "SUBMITTED", "COMPLETED"].includes(item.status) 
              ? item.status 
              : "PLANNED",
            // Ensure dates are in YYYY-MM-DD format
            plannedOrderDate: item.plannedOrderDate || new Date().toISOString().split('T')[0],
            plannedDeliveryDate: item.plannedDeliveryDate || new Date().toISOString().split('T')[0],
            // Ensure numeric fields are numbers
            plannedQuantity: typeof item.plannedQuantity === 'number' ? item.plannedQuantity : 0,
            revisedQuantity: typeof item.revisedQuantity === 'number' ? item.revisedQuantity : 0,
            secondReview: typeof item.secondReview === 'number' ? item.secondReview : 0,
            totalCost: typeof item.totalCost === 'number' ? item.totalCost : 0,
          };
        });
        
        for (let i = 0; i < validBatches.length; i += BATCH_SIZE) {
          const batch = validBatches.slice(i, i + BATCH_SIZE);
          try {
            setIsImporting(true);
            
            // Log the batch being sent for debugging
            console.log("Sending batch:", batch);
            
            await createShipments.mutateAsync(batch, {
              onSuccess: () => {
                purchaseOrdersQuery.refetch();
                successCount += batch.length;
              },
              onError: (err) => {
                console.error("API Error:", err);
                // Use setTimeout to avoid calling message in render
                setTimeout(() => {
                  messageApi.open({
                    type: "error",
                    content: err.message || "An error occurred while adding shipment item(s).",
                  });
                }, 0);
                failureCount += batch.length;
              },
            });
          } catch (error) {
            console.error("Error sending batch:", error);
            // Use setTimeout to avoid calling message in render
            setTimeout(() => {
              messageApi.open({
                type: "error",
                content: "An error occurred while adding shipment item(s).",
              });
            }, 0);
            failureCount += batch.length;
          } finally {
            setIsImporting(false);
          }
        }
        
        // Show summary toast with setTimeout to avoid calling in render
        if (successCount > 0 || failureCount > 0) {
          setTimeout(() => {
            messageApi.open({
              type: successCount > 0 ? "success" : "warning",
              content: `Import summary: ${successCount} successful, ${failureCount} failed`,
              duration: 5,
            });
          }, 0);
        }
      };

      sendBatches(validatedData);
    };

    // Final return statement with conditional rendering
    return (
      <>
        {!mounted ? renderLoadingState() : 
         isPending || isImporting ? renderSkeletonLoading() : 
         renderMainContent()}
      </>
    );
  };
  
export default PurchaseOrdersPage;
  