'use client';

import React from 'react';
import { DataTable } from '@/components/ui/table/data-table';
import { Button } from '@/components/ui/button';
import { Download, ArrowUpDown } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { DataTableFilterBox } from '@/components/table/data-table-filter-box';
import { Badge } from '@/components/ui/badge';
import { parseAsString, useQueryState } from 'nuqs';
import { exportTableToCSV } from '@/lib/export';

// Define the shipment data type
interface Shipment {
  id: string;
  poNumber: string;
  name: string;
  totalCost: number;
  division: string;
  status: 'DELAYED' | 'CLOSED' | 'OPEN';
  turnaroundTime: number;
  funder: string;
}

// Mock data for shipments
const shipmentData: Shipment[] = [
  {
    id: '1',
    poNumber: 'PO-2023-001',
    name: 'Medical Supplies Q1',
    totalCost: 25000,
    division: 'MCCH',
    status: 'CLOSED',
    turnaroundTime: 15,
    funder: 'WHO'
  },
  {
    id: '2',
    poNumber: 'PO-2023-002',
    name: 'Lab Equipment',
    totalCost: 42000,
    division: 'NLAB',
    status: 'OPEN',
    turnaroundTime: 8,
    funder: 'USAID'
  },
  {
    id: '3',
    poNumber: 'PO-2023-003',
    name: 'Vaccines Batch A',
    totalCost: 18500,
    division: 'HIV/MALARIA',
    status: 'DELAYED',
    turnaroundTime: 30,
    funder: 'GF'
  },
  {
    id: '4',
    poNumber: 'PO-2023-004',
    name: 'Medical Equipment',
    totalCost: 35000,
    division: 'TB',
    status: 'CLOSED',
    turnaroundTime: 12,
    funder: 'ENABEL'
  },
  {
    id: '5',
    poNumber: 'PO-2023-005',
    name: 'Diagnostic Kits',
    totalCost: 15000,
    division: 'NCD',
    status: 'OPEN',
    turnaroundTime: 10,
    funder: 'TBD'
  },
  {
    id: '6',
    poNumber: 'PO-2023-006',
    name: 'Pharmaceuticals',
    totalCost: 28000,
    division: 'MCCH',
    status: 'DELAYED',
    turnaroundTime: 25,
    funder: 'WHO'
  },
  {
    id: '7',
    poNumber: 'PO-2023-007',
    name: 'Surgical Supplies',
    totalCost: 32000,
    division: 'TB',
    status: 'CLOSED',
    turnaroundTime: 18,
    funder: 'ENABEL'
  },
  {
    id: '8',
    poNumber: 'PO-2023-008',
    name: 'Monitoring Devices',
    totalCost: 22000,
    division: 'NCD',
    status: 'OPEN',
    turnaroundTime: 14,
    funder: 'USAID'
  },
  {
    id: '9',
    poNumber: 'PO-2023-009',
    name: 'Testing Kits',
    totalCost: 19000,
    division: 'HIV/MALARIA',
    status: 'CLOSED',
    turnaroundTime: 20,
    funder: 'GF'
  },
  {
    id: '10',
    poNumber: 'PO-2023-010',
    name: 'Research Equipment',
    totalCost: 45000,
    division: 'NLAB',
    status: 'DELAYED',
    turnaroundTime: 28,
    funder: 'TBD'
  },
  {
    id: '11',
    poNumber: 'PO-2023-011',
    name: 'Medical Supplies Q2',
    totalCost: 27000,
    division: 'MCCH',
    status: 'OPEN',
    turnaroundTime: 16,
    funder: 'WHO'
  },
  {
    id: '12',
    poNumber: 'PO-2023-012',
    name: 'Lab Consumables',
    totalCost: 12000,
    division: 'NLAB',
    status: 'CLOSED',
    turnaroundTime: 9,
    funder: 'USAID'
  }
];

// Define the status badge component
function StatusBadge({ status }: { status: Shipment['status'] }) {
  const statusStyles = {
    DELAYED: 'bg-red-100 text-red-800 border-red-200',
    CLOSED: 'bg-green-100 text-green-800 border-green-200',
    OPEN: 'bg-blue-100 text-blue-800 border-blue-200'
  };

  return (
    <Badge className={`${statusStyles[status]} font-medium`}>
      {status}
    </Badge>
  );
}

export function ShipmentTable() {
  // Filter states
  const [divisionFilter, setDivisionFilter] = useQueryState('division', parseAsString.withDefault(''));
  const [funderFilter, setFunderFilter] = useQueryState('funder', parseAsString.withDefault(''));
  const [statusFilter, setStatusFilter] = useQueryState('status', parseAsString.withDefault(''));

  // Define column definitions
  const columns: ColumnDef<Shipment, any>[] = [
    {
      accessorKey: 'poNumber',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="font-semibold"
        >
          PO Number
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: 'name',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="font-semibold"
        >
          Shipment Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: 'totalCost',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="font-semibold"
        >
          Total Cost
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue('totalCost'));
        const formatted = new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
        }).format(amount);
        return <div className="font-medium">{formatted}</div>;
      },
    },
    {
      accessorKey: 'division',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="font-semibold"
        >
          Division
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: 'status',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="font-semibold"
        >
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <StatusBadge status={row.getValue('status')} />,
    },
    {
      accessorKey: 'turnaroundTime',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="font-semibold"
        >
          Turnaround Time
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const days = parseInt(row.getValue('turnaroundTime'));
        return <div className="font-medium">{days} days</div>;
      },
    },
    {
      accessorKey: 'funder',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="font-semibold"
        >
          Funder
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
  ];

  // Filter the data based on selected filters
  const filteredData = React.useMemo(() => {
    return shipmentData.filter(shipment => {
      const divisionMatch = !divisionFilter || divisionFilter.split('.').includes(shipment.division);
      const funderMatch = !funderFilter || funderFilter.split('.').includes(shipment.funder);
      const statusMatch = !statusFilter || statusFilter.split('.').includes(shipment.status);
      return divisionMatch && funderMatch && statusMatch;
    });
  }, [divisionFilter, funderFilter, statusFilter]);

  // Get unique values for filters
  const divisions = [...new Set(shipmentData.map(item => item.division))].map(value => ({ value, label: value }));
  const funders = [...new Set(shipmentData.map(item => item.funder))].map(value => ({ value, label: value }));
  const statuses = [...new Set(shipmentData.map(item => item.status))].map(value => ({ value, label: value }));

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold">Shipments</h2>
        <div className="flex flex-wrap gap-2">
          <DataTableFilterBox
            filterKey="division"
            title="Division"
            options={divisions}
            setFilterValue={setDivisionFilter}
            filterValue={divisionFilter}
          />
          <DataTableFilterBox
            filterKey="funder"
            title="Funder"
            options={funders}
            setFilterValue={setFunderFilter}
            filterValue={funderFilter}
          />
          <DataTableFilterBox
            filterKey="status"
            title="Status"
            options={statuses}
            setFilterValue={setStatusFilter}
            filterValue={statusFilter}
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              // Create a simplified table object for CSV export
              const table = {
                getFilteredRowModel: () => ({ 
                  rows: filteredData.map(item => ({ 
                    getValue: (key: string) => item[key as keyof Shipment] 
                  })) 
                }),
                getAllLeafColumns: () => {
                  return columns.map(column => ({
                    id: String(column.id)
                  }));
                }
              };
              exportTableToCSV(table as any, {
                filename: "shipments",
                excludeColumns: []
              });
            }}
            className="p-4 border-gray-400 text-gray-700"
          >
            <Download className="size-4 mr-2" aria-hidden="true" />
            Export
          </Button>
        </div>
      </div>
      <DataTable
        columns={columns}
        data={filteredData}
        totalItems={filteredData.length}
        pageSizeOptions={[10, 20, 30, 50]}
      />
    </div>
  );
} 