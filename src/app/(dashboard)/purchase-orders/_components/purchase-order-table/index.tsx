'use client';

import { DataTable } from '@/components/ui/table/data-table';
import { DataTableFilterBox } from '@/components/ui/table/data-table-filter-box';
import { DataTableResetFilter } from '@/components/ui/table/data-table-reset-filter';
import { DataTableSearch } from '@/components/ui/table/data-table-search';

import { type PurchaseOrder } from '@/db/schema';
import { columns } from './columns';
import { getColumns } from './orders-table-columns';



import { usePurchaseOrderTableFilters } from './use-purchase-order-table-filters';





export default function PurchaseOrderTable({
  data,
  totalData
}: {
  data: PurchaseOrder[];
  totalData: number;
}) {
  const {
    plannedUnitSearch,
    setPlannedUnitSearch,
    setPage,

    allocationDepartmentFilter,
    setAllocationDepartmentFilter,

    isAnyFilterActive,
    resetFilters
  } = usePurchaseOrderTableFilters();

  const departmentOptions = [
    { value: 'CP', label: 'Clinical Practice' },
    { value: 'OP', label: 'Operations' },
    { value: 'Admin', label: 'Administration' },
  ];

  const categoryOptions = [
    { value: 'ARV', label: 'Antiretrovirals' },
    { value: 'Other', label: 'Other Medicines' },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-4">
        <DataTableSearch
          searchKey="planned unit"
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

          // setFilterValue={(value) => {
          //   setAllocationDepartmentFilter(value);
          //   setPage(1); // Reset page to 1 when the filter changes
          // }}
        />

        <DataTableResetFilter
          isFilterActive={isAnyFilterActive}
          onReset={resetFilters}
        />
      </div>
      <DataTable columns={columns} data={data} totalItems={totalData} />
    </div>
  );
}
