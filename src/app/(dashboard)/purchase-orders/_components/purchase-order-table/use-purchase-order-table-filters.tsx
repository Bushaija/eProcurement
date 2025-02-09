'use client';

import { searchParams } from '@/lib/searchParams';
import { useQueryState } from 'nuqs';
import { useCallback, useMemo } from 'react';

export function usePurchaseOrderTableFilters() {
  // State for searching by plannedUnit
  const [plannedUnitSearch, setPlannedUnitSearch] = useQueryState(
    'q',
    searchParams.q
      .withOptions({ shallow: false, throttleMs: 1000 })
      .withDefault('')
  );

  // State for filtering by allocationDepartment
  const [allocationDepartmentFilter, setAllocationDepartmentFilter] = useQueryState(
    'allocationDepartment',
    searchParams.allocationDepartment.withOptions({ shallow: false }).withDefault('')
  );

  // State for filtering by category
  const [categoryFilter, setCategoryFilter] = useQueryState(
    'category',
    searchParams.category.withOptions({ shallow: false }).withDefault('')
  );

  const [itemTypeFilter, setItemTypeFilter] = useQueryState(
    'itemType',
    searchParams.itemType.withOptions({ shallow: false }).withDefault('')
  );

  // State for pagination
  const [page, setPage] = useQueryState(
    'page',
    searchParams.page.withDefault(1)
  );

  // Reset all filters
  const resetFilters = useCallback(() => {
    setPlannedUnitSearch(null);
    setAllocationDepartmentFilter(null);
    setCategoryFilter(null);
    setItemTypeFilter(null);
    setPage(1);
  }, [setPlannedUnitSearch, setAllocationDepartmentFilter, setCategoryFilter, setPage]);

  // Check if any filter or search query is active
  const isAnyFilterActive = useMemo(() => {
    return !!plannedUnitSearch || !!allocationDepartmentFilter || !!categoryFilter;
  }, [plannedUnitSearch, allocationDepartmentFilter, categoryFilter]);

  return {
    plannedUnitSearch,
    setPlannedUnitSearch,
    allocationDepartmentFilter,
    setAllocationDepartmentFilter,
    categoryFilter,
    itemTypeFilter,
    setItemTypeFilter,
    setCategoryFilter,
    page,
    setPage,
    resetFilters,
    isAnyFilterActive,
  };
}
