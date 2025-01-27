"use client";

import * as React from "react"

import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  ColumnFiltersState, 
  getFilteredRowModel,
  PaginationState
} from "@tanstack/react-table";

import { Card } from '@/components/ui/card';

import { Input } from "@/components/ui/input"


import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Options } from 'nuqs';

import { useState } from "react";
import { Button } from "../ui/button";
import { ScrollBar } from "../ui/scroll-area";
import { Badge } from "@/components/ui/badge"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"
import { ScrollArea } from "@/components/ui/scroll-area"
import { CheckIcon, ChevronLeftIcon, ChevronRightIcon, PlusCircleIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { parseAsInteger, useQueryState } from 'nuqs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { DoubleArrowLeftIcon, DoubleArrowRightIcon } from "@radix-ui/react-icons";



interface FilterOptions {
  value: string;
  label: string;
  icon?: React.Component<{ className?: string}>;
};

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  totalItems: number;
  pageSizeOptions?: number[];

  rowClick?: (id: string) => void;
  // searchBy?: string;
  // searchByTitle?: string;
  filterTitle?: string;
  options?: FilterOptions[];
  filterValue?: string;

  searchKey: string;
  searchQuery: string;
  setSearchQuery: (
    value: string | ((old: string) => string | null) | null,
    options?: Options<any> | undefined
  ) => Promise<URLSearchParams>;
  setPage: <Shallow>(
    value: number | ((old: number) => number | null) | null,
    options?: Options<Shallow> | undefined
  ) => Promise<URLSearchParams>;
}

const GENDER_OPTIONS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' }
];

export function DataTable<TData, TValue>({
  columns,
  data,
  totalItems,
  pageSizeOptions = [10, 20, 30, 40, 50],


  rowClick,
  filterTitle,
  // searchBy,
  // searchByTitle,
  options,
  filterValue,

  searchKey,
  searchQuery,
  setSearchQuery,
  setPage
  
}: DataTableProps<TData, TValue>) {
  const [isLoading, startTransition] = React.useTransition();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );


  const [selectedValuesSet, setSelectedValuesSet] = React.useState<Set<string>>(
    new Set(filterValue ? filterValue.split('.') : [])
  );

  const [currentPage, setCurrentPage] = useQueryState(
    'page',
    parseAsInteger.withOptions({ shallow: false }).withDefault(1)
  );

  const [pageSize, setPageSize] = useQueryState(
    'limit',
    parseAsInteger
      .withOptions({ shallow: false, history: 'push' })
      .withDefault(10)
  );

  const paginationState = {
    pageIndex: currentPage - 1, // zero-based index for React Table
    pageSize: pageSize
  };

  const pageCount = Math.ceil(totalItems / pageSize);

  const handlePaginationChange = (
    updaterOrValue:
      | PaginationState
      | ((old: PaginationState) => PaginationState)
  ) => {
    const pagination =
      typeof updaterOrValue === 'function'
        ? updaterOrValue(paginationState)
        : updaterOrValue;

    setCurrentPage(pagination.pageIndex + 1); // converting zero-based index to one-based
    setPageSize(pagination.pageSize);
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value, { startTransition });
    setPage(1); // Reset page to 1 when search changes
  };

  const table = useReactTable({
    data,
    columns,
    pageCount: pageCount,
    onPaginationChange: handlePaginationChange,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
      pagination: paginationState
    },
    manualPagination: true,
    manualFiltering: true
  });

  // const selectedValuesSet = React.useMemo(() => {
  //   if (!filterValue) return new Set<string>();
  //   const values = filterValue.split('.');
  //   return new Set(values.filter((value) => value !== ''));
  // }, [filterValue]);

  const handleFilterSelect = (value: string) => {
    setSelectedValuesSet((prevSelectedValues) => {
      const updatedValues = new Set(prevSelectedValues);
      if (updatedValues.has(value)) {
        updatedValues.delete(value);
      } else {
        updatedValues.add(value);
      }
      return updatedValues;
    });

    // Apply filter to the table
    table.getColumn(filterTitle || '')?.setFilterValue(
      Array.from(selectedValuesSet).join('.')
    );
  };

  const resetFilter = () => {
    table.setColumnFilters([]);
    setColumnFilters([]);
  };
  

  return (
  <div className="space-y-4">
    
    <Card className="outline-none border-none">
      <div className="rounded-md p-4 bg-white flex flex-col gap-4">
        <section className="flex gap-8 px-4">
        <Input
          placeholder={`Search ${searchKey}...`}
          value={searchQuery ?? ''}
          onChange={(e) => handleSearch(e.target.value)}
          className={cn('w-full md:max-w-sm', isLoading && 'animate-pulse')}
        />
        {/* {
          searchBy && (
            <Input
              placeholder={`Search by ${searchByTitle}...`}
              value={(table.getColumn(searchBy)?.getFilterValue() as string) ?? ""}
              onChange={(event) =>
                table.getColumn(searchBy || "")?.setFilterValue(event.target.value)
              }
              className={"rounded-md w-[350px] h-[36px]"}
            />
          )
        } */}
       { 
        filterTitle &&
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="border-dashed">
              <PlusCircleIcon className="mr-2 h-4 w-4" />
                <p className="text-sm font-normal">{filterTitle}</p>
              <>
              {
                Array.from(selectedValuesSet).map((value) => (
                  <Badge
                    variant={"secondary"}
                    key={value}
                    className="rounded-sm px-1 font-normal"
                  >
                    {options?.find((option) => option.value === value)?.label || value}
                  </Badge>
                ))
              }
              </>
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <Command>
              <CommandInput placeholder={filterTitle} />
              <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup>
                  {
                    options?.map((option) => (
                      <CommandItem 
                        key={option.value}
                        onSelect={() => handleFilterSelect(option.value)}
                      >
                        <div
                          className={cn(
                            'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                            selectedValuesSet.has(option.value)
                              ? 'bg-primary text-primary-foreground'
                              : 'opacity-50 [&_svg]:invisible'
                          )}
                        >
                          <CheckIcon className="h-4 w-4" aria-hidden="true" />
                        </div>
                        {option.label}
                      </CommandItem>
                    ))}
                </CommandGroup>
                {selectedValuesSet.size > 0 && (
                  <>
                    <CommandSeparator />
                    <CommandGroup>
                      <CommandItem
                        onSelect={resetFilter}
                        className="justify-center text-center"
                      >
                        Clear filters
                      </CommandItem>
                    </CommandGroup>
                  </>
                )}
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        }
        </section>
        <div className="rounded-md px-4 bg-white">
      <ScrollArea className="grid h-[calc(80vh-220px)] rounded-md border md:h-[calc(90dvh-240px)] ">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel()?.rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  className="cursor-pointer"
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      onClick={() => {
                        if (!cell.id.includes("action")) {
                          rowClick?.((row.original as {id: string}).id);
                        }
                      }}
                      key={cell.id}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <ScrollBar orientation="horizontal" />
        </ScrollArea>
        </div>
        <div className="flex flex-col items-center justify-end gap-2 space-x-2 p-4 sm:flex-row">
        <div className="flex w-full items-center justify-between">
          <div className="flex-1 text-sm text-muted-foreground">
            {totalItems > 0 ? (
              <>
                Showing{' '}
                {paginationState.pageIndex * paginationState.pageSize + 1} to{' '}
                {Math.min(
                  (paginationState.pageIndex + 1) * paginationState.pageSize,
                  totalItems
                )}{' '}
                of {totalItems} entries
              </>
            ) : (
              'No entries found'
            )}
          </div>
          
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-6 lg:gap-8">
            <div className="flex items-center space-x-2">
              <p className="whitespace-nowrap text-sm font-medium">
                Rows per page
              </p>
              <Select
                value={`${paginationState.pageSize}`}
                onValueChange={(value) => {
                  table.setPageSize(Number(value));
                }}
              >
                <SelectTrigger className="h-8 w-[70px]">
                  <SelectValue placeholder={paginationState.pageSize} />
                </SelectTrigger>
                <SelectContent side="top">
                  {pageSizeOptions.map((pageSize) => (
                    <SelectItem key={pageSize} value={`${pageSize}`}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

        </div>
        <div className="flex w-full items-center justify-between gap-2 sm:justify-end">
          <div className="flex w-[150px] items-center justify-center text-sm font-medium">
            {totalItems > 0 ? (
              <>
                Page {paginationState.pageIndex + 1} of {table.getPageCount()}
              </>
            ) : (
              'No pages'
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              aria-label="Go to first page"
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <DoubleArrowLeftIcon className="h-4 w-4" aria-hidden="true" />
            </Button>
            <Button
              aria-label="Go to previous page"
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeftIcon className="h-4 w-4" aria-hidden="true" />
            </Button>
            <Button
              aria-label="Go to next page"
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <ChevronRightIcon className="h-4 w-4" aria-hidden="true" />
            </Button>
            <Button
              aria-label="Go to last page"
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <DoubleArrowRightIcon className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
        </div>
        </div>  
      </div>
    </Card>
  </div>
  );
}
