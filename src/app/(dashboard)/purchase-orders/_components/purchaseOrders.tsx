"use client"

import {
  ModalTrashIcon,
} from "@/assets/icons/icons";
import { DataTable } from '@/components/ui/table/data-table';
import { Button } from "@/components/ui/button";
import { useDeletePurchaseOrder } from "@/features/purchase-orders/api/use-delete-order";
import { useGetPurchaseOrders } from "@/features/purchase-orders/api/use-get-orders";
import { Modal, Skeleton, message } from "antd";
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
// import { CsvImporter } from "@/app/(dashboard)/purchase-orders/_components/csv-importer";
import { formatCsvRows, formatInputData, InputData } from "@/lib/utils";

// const PURCHASE_ORDER_OPTIONS = [
//   { value: "ORDERED", label: 'ORDERED'},
//   { value: "PLANNED", label: 'PLANNED'},
//   { value: "CANCELLED", label: 'CANCELLED'},
//   { value: "RECEIVED", label: 'RECEIVED'},
//   { value: "HOLD", label: 'HOLD'},
//   { value: "PARTIAL RECEIVED", label: 'PARTIAL RECEIVED'},
// ]

type ImportDataType = Record<string, any>;


  interface DashboardProps {}
  
  const PurchaseOrdersPage: React.FunctionComponent<DashboardProps> = () => {
    const router = useRouter();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [importData, setImportData] = React.useState<ImportDataType[]>([]);
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
    
    const [isLoading, setIsLoading] = useState(false);
    const [isDeletingOrder, setIsDeletingOrder] = useState<boolean>(false);
    const [messageApi, contextHolder] = message.useMessage();
    const { mutate} = useDeletePurchaseOrder(selectedOrderID);

    // fixing the table
    const purchaseOrdersQuery = useGetPurchaseOrders()
    const data = purchaseOrdersQuery.data || [];
    const isPending = purchaseOrdersQuery.isPending || purchaseOrdersQuery.isLoading;
    const error = purchaseOrdersQuery.error;

    const {
      plannedUnitSearch,
      setPlannedUnitSearch,
      setPage,
  
      allocationDepartmentFilter,
      categoryFilter,
      itemTypeFilter,
      setItemTypeFilter,
      // setCategoryFilter,
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
  
    const departmentOptions = [
      { value: 'CP', label: 'Clinical Practice' },
      { value: 'OP', label: 'Operations' },
      { value: 'Admin', label: 'Administration' },
    ];
  
    const itemTypeOptions = [
      { value: 'medical', label: 'Medical' },
      { value: 'non-medical', label: 'Non-Medical' },
    ];
    
  
    if (isPending) {
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

    const handleDeletePurchaseOrder = () => {
      setIsDeletingOrder(true);
      mutate(undefined, {
        onSuccess: () => {
          purchaseOrdersQuery.refetch();
          messageApi.open({
            type: "success",
            content: "Purchase order deleted successfully",
          });
          setIsModalOpen(false);
          setIsDeletingOrder(false);
        },
        onError: (err) => {
          messageApi.open({
            type: "error",
            content: err.message || "An error occurred while deleting the purchase order.",
          });
        },
      });
    };

    return (
      <>
        {contextHolder}
        <div className="flex justify-between items-center mt-2">
          <div>
            <p className="text-[#121417] text-2xl font-bold max-sm:text-xl">
              Purchase Orders
            </p>
            <p className="text-[#64707D] text-sm font-normal max-sm:text-xs mb-4">
              You are viewing all planned purchase orders.
            </p>
          </div>
          <Button
            onClick={handleClick}
            disabled={isLoading}
            className="bg-[rgb(114,1,253)] hover:bg-[#430194] px-4 py-3 rounded-[10px] text-white"
          >
            {
              isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : ("Create Purchase Order")
            }
          </Button>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 w-full">
            <DataTableSearch
              searchKey="by medicine name"
              searchQuery={plannedUnitSearch}
              setSearchQuery={setPlannedUnitSearch}
              setPage={setPage}
            />

            <DataTableFilterBox
              filterKey="allocationDepartment"
              title="Department"
              options={departmentOptions}
              filterValue={allocationDepartmentFilter}
              setFilterValue={setAllocationDepartmentFilter}
            />

            <DataTableFilterBox
              filterKey="itemType"
              title="Item Type"
              options={itemTypeOptions}
              filterValue={itemTypeFilter}
              setFilterValue={setItemTypeFilter}
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

          {/* <CsvImporter
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
            onImport={(parsedData) => {
              const formattedData = formatCsvRows(parsedData, formatInputData);
              setImportData((prev) => [...prev, ...formattedData])
            }}
            className="self-end"
        /> */}
        </div>

      </div>

      <div className="bg-white rounded-[20px]">
        <div className="mt-10 z-10">
          {/* <DataTable
            columns={columns}
            data={data || []}
            totalItems={data.length}
            rowClick={(id: string) => handleOrderClick(id)}
            // searchBy="plannedUnit"
            // searchByTitle="Medicine"
            filterTitle="Status"
            options={PURCHASE_ORDER_OPTIONS}

            searchKey="plannedUnit"
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            setPage={setPage}
          />  */}
          <DataTable columns={columns} data={filteredData} totalItems={filteredData.length} rowClick={(id: string) => handleOrderClick(id)} />
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
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-2 bg-white border border-[rgba(23,23,31,0.10)] shadow-[0px_1px_1px_0px_rgba(18,18,18,0.10),0px_0px_0px_1px_rgba(18,18,18,0.07),0px_1px_3px_0px_rgba(18,18,18,0.10)] border-solid rounded-[10px] border-[#17171f1a]"
              >
                No, Cancel
              </button>
              <button
                onClick={handleDeletePurchaseOrder}
                className="px-8 py-2 deleteBtn ml-4"
                disabled={isDeletingOrder}
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
  
  export default PurchaseOrdersPage;
  