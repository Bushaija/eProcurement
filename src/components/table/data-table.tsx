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
  getFilteredRowModel
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
import { CheckIcon, PlusCircleIcon } from "lucide-react";
import { cn } from "@/lib/utils";


interface FilterOptions {
  value: string;
  label: string;
  icon?: React.Component<{ className?: string}>;
};

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  rowClick?: (id: string) => void;
  searchBy?: string;
  filterTitle?: string;
  options?: FilterOptions[];
  filterValue?: string;
}

const GENDER_OPTIONS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' }
];

export function DataTable<TData, TValue>({
  columns,
  data,
  rowClick,
  filterTitle,
  searchBy,
  options,
  filterValue
  
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );


  const [selectedValuesSet, setSelectedValuesSet] = React.useState<Set<string>>(
    new Set(filterValue ? filterValue.split('.') : [])
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
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
      <div className="rounded-md p-4 bg-white flex gap-4">
        {
          searchBy && (
            <Input
              placeholder={`Filter by ${searchBy}...`}
              value={(table.getColumn(searchBy ? searchBy : "")?.getFilterValue() as string) ?? ""}
              onChange={(event) =>
                table.getColumn(searchBy || "")?.setFilterValue(event.target.value)
              }
              className={"rounded-md w-[250px] h-[36px]"}
            />
          )
        }
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
        </Popover>}
      </div>
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
      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="flex items-center space-x-2 px-4">
          {/* <Button
            variant="outline"
            size="sm"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            First
          </Button> */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
          {/* <Button
            variant="outline"
            size="sm"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            Last
          </Button> */}
        </div>
        {/* <span className="text-sm">
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
        </span>
        <div className="flex items-center space-x-2">
          <span className="text-sm">Go to page:</span>
          <input
            type="number"
            min={1}
            max={table.getPageCount()}
            defaultValue={table.getState().pagination.pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              table.setPageIndex(page);
            }}
            className="w-16 p-1 border rounded"
          />
        </div> */}
        {/* <select
          value={table.getState().pagination.pageSize}
          onChange={(e) => {
            table.setPageSize(Number(e.target.value));
          }}
          className="p-1 border rounded"
        >
          {[10, 20, 30, 40, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select> */}
      </div>
    </Card>
  </div>
  );
}
