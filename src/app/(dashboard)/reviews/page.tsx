"use client"

import {
  ModalTrashIcon,
} from "@/assets/icons/icons";
import { DataTable } from "@/components/table/data-table";
import { Button } from "@/components/ui/button";
import { useGetPurchaseOrderReviews } from "@/features/purchase-order-reviews/api/use-get-reviews";
import { TSelectPurchaseOrderReviewSchema } from "@/db/schema";

import { ColumnDef } from "@tanstack/react-table";
import { Modal, Skeleton, message } from "antd";
import { Loader2, PencilIcon, SearchCheck, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import React from "react";

// Define shipment status options
const SHIPMENT_STATUS_OPTIONS = [
  { value: 'ORDERED', label: 'Ordered' },
  { value: 'PLANNED', label: 'Planned' },
  { value: 'CANCELLED', label: 'Cancelled' },
  { value: 'RECEIVED', label: 'Received' },
  { value: 'HOLD', label: 'Hold' },
  { value: 'PARTIAL RECEIVED', label: 'Partial Received' }
];

interface DashboardProps {}
  
  const FollowUp: React.FunctionComponent<DashboardProps> = () => {
    const router = useRouter();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedOrderID, setSelectedOrderID] = useState<number>();
    const [isDeletingOrder, setIsDeletingOrder] = useState<boolean>(false);
    const [messageApi, contextHolder] = message.useMessage();
    const [mounted, setMounted] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [statusFilter, setStatusFilter] = useState<string[]>([]);

    // Set mounted state on client-side
    useEffect(() => {
      setMounted(true);
    }, []);

    const { data, isPending, isError: error, refetch } = useGetPurchaseOrderReviews()
    
    // Handle API error with useEffect to avoid calling message in render
    useEffect(() => {
      if (error && mounted) {
        messageApi.open({
          type: "error",
          content: "Error fetching orders",
        });
      }
    }, [error, messageApi, mounted]);

    const handleOrderClick = (id: string) => {
      router.push(`/reviews/${id}`);
    };

    const handleDeleteOrder = () => {
      setIsDeletingOrder(true);
      fetch(`/api/reviews/${selectedOrderID}`, {
        method: "DELETE",
      })
        .then((res) => {
          refetch();
          setTimeout(() => {
            messageApi.open({
              type: "success",
              content: "Order deleted successfully",
            });
          }, 0);
          setIsModalOpen(false);
          setIsDeletingOrder(false);
        })
        .catch((err) => {
          setTimeout(() => {
            messageApi.open({
              type: "error",
              content: "Error deleting order",
            });
          }, 0);
          setIsDeletingOrder(false);
        });
    };
  
  
    const reviewColumns: ColumnDef<TSelectPurchaseOrderReviewSchema>[] = [
      {
        accessorKey: "PROCUREMENT_REQUEST_ID",
        header: () => <div className="w-[170px] text-xs font-bold">Shipment Id</div>,
        cell: ({ row }) => {
          return (
            <div className="text-[#40474F]">
              {<span className="">#{row.original.purchaseOrderId}</span>}
            </div>
          );
        },
      },
      {
        accessorKey: "PO_CREATION_DATE",
        header: () => <div className="w-[170px] text-xs font-bold">Purchase Order creation Date</div>,
        cell: ({ row }) => {
          return (
            <div className="text-[#40474F]">
              {row.original.purchaseOrderCreationDate || "N/A"}
            </div>
          );
        },
      },
      {
        accessorKey: "purchase number",
        header: () => <div className="w-[170px] text-xs font-bold">Purchase Order Number</div>,
        cell: ({ row }) => {
          return (
            <div className="text-[#40474F]">
              {row.original.purchaseOrderNumber}
            </div>
          );
        },
      },
      {
        accessorKey: "PO_ISSUE_DATE",
        header: () => <div className="w-[170px] text-xs font-bold">Purchase Order Issue Date</div>,
        cell: ({ row }) => {
          return (
            <div className="text-[#40474F]">
              {row.original.purchaseOrderIssueDate || "N/A"}
            </div>
          );
        },
      },
      {
        accessorKey: "Read Time",
        header: () => <div className="w-[170px] text-xs font-bold">Read Time</div>,
        cell: ({ row }) => {
          return (
            <div className="text-[#40474F]">
              {row.original.readTime || "N/A"}
            </div>
          );
        },
      },
      {
        accessorKey: "EDD",
        header: () => <div className="w-[170px] text-xs font-bold">Expected Delivery Date(EDD)</div>,
        cell: ({ row }) => {
          return (
            <div className="text-[#40474F] min-w-[100px]">
              {row.original.expectedDeliveryDate}
            </div>
          );
        },
      },
      {
        accessorKey: "CURRENCY",
        header: () => <div className="w-[170px] text-xs font-bold">Currency</div>,
        cell: ({ row }) => {
          return (
            <div className="text-[#40474F] min-w-[100px]">
              {row.original.currency}
            </div>
          );
        },
      },
      {
        accessorKey: "ORDER_QUANTITY",
        header: () => <div className="w-[170px] text-xs font-bold">Order Quantity</div>,
        cell: ({ row }) => {
          return (
            <div className="text-[#40474F] min-w-[100px]">
              {row.original.orderQuantity}
            </div>
          );
        },
      },
      {
        accessorKey: "RECEIVE_QUANTITY",
        header: () => <div className="w-[170px] text-xs font-bold">Received Quantity</div>,
        cell: ({ row }) => {
          return (
            <div className="text-[#40474F] min-w-[100px]">
              {row.original.receivedQuantity}
            </div>
          );
        },
      },
      {
        accessorKey: "RECEIVED_DATE",
        header: () => <div className="w-[170px] text-xs font-bold">Received Date</div>,
        cell: ({ row }) => {
          return (
            <div className="text-[#40474F] min-w-[100px]">
              {row.original?.receivedDate || "N/A"}
            </div>
          );
        },
      },
      {
        accessorKey: "BalancedQuantity",
        header: () => <div className="w-[170px] text-xs font-bold">Balanced Quantity</div>,
        cell: ({ row }) => {
          return (
            <div className="text-[#40474F] min-w-[100px]">
              {row.original.balancedQuantity}
            </div>
          );
        },
      },
      {
        accessorKey: "SHIPMENT_STATUS",
        header: () => <div className="w-[170px] text-xs font-bold">Shipment Status</div>,
        cell: ({ row }) => {
          const status = row.original.shipmentStatus || '';
          
          // Define status colors
          const statusColors: Record<string, { bg: string; text: string }> = {
            'ORDERED': { bg: 'bg-blue-100', text: 'text-blue-800' },
            'PLANNED': { bg: 'bg-purple-100', text: 'text-purple-800' },
            'CANCELLED': { bg: 'bg-red-100', text: 'text-red-800' },
            'RECEIVED': { bg: 'bg-green-100', text: 'text-green-800' },
            'HOLD': { bg: 'bg-yellow-100', text: 'text-yellow-800' },
            'PARTIAL RECEIVED': { bg: 'bg-orange-100', text: 'text-orange-800' },
          };
          
          const { bg, text } = statusColors[status] || { bg: 'bg-gray-100', text: 'text-gray-800' };
          
          return (
            <div className="text-[#40474F] min-w-[100px]">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bg} ${text}`}>
                {status}
              </span>
            </div>
          );
        },
      },
      {
        accessorKey: "COMMENTS",
        header: () => <div className="w-[170px] text-xs font-bold">Comments</div>,
        cell: ({ row }) => {
          return (
            <div className="text-[#40474F] min-w-[100px]">
              {row.original.comments}
            </div>
          );
        },
      },
      {
        accessorKey: "action",
        header: () => <div className="text-xs font-semibold w-[130px] text-center">Action</div>,
        cell: ({ row }) => {
          return (
            <div className="flex gap-2.5">

              <button
                onClick={() =>
                  router.push(`/reviews/edit/${row.original.id}`)
                }
              >
                <PencilIcon className="text-[#667185] h-5" />
              </button>
              
              <button
                onClick={() => {
                  setIsModalOpen(true);
                  setSelectedOrderID(row.original.id); // here
                }}
              >
                <Trash2 className="text-[#667185] h-5" />
              </button>
            </div>
          );
        },
      },

    ];
    
  
    // Render loading state
    const renderLoadingState = () => (
      <Skeleton
        className="py-5 px-5 max-sm:px-0"
        active
        paragraph={{ rows: 6 }}
      />
    );

    // Render main content
    const renderMainContent = () => {
      // Filter data based on search query and status filter
      const filteredData = data ? data.filter(item => {
        // Search query filter
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          
          // Search across multiple fields
          const purchaseOrderNumber = (item.purchaseOrderNumber || "").toLowerCase();
          const purchaseOrderId = (item.purchaseOrderId?.toString() || "").toLowerCase();
          const expectedDeliveryDate = (item.expectedDeliveryDate || "").toLowerCase();
          const purchaseOrderCreationDate = (item.purchaseOrderCreationDate || "").toLowerCase();
          const purchaseOrderIssueDate = (item.purchaseOrderIssueDate || "").toLowerCase();
          
          const matchesSearch = 
            purchaseOrderNumber.includes(query) ||
            purchaseOrderId.includes(query) ||
            expectedDeliveryDate.includes(query) ||
            purchaseOrderCreationDate.includes(query) ||
            purchaseOrderIssueDate.includes(query);
            
          if (!matchesSearch) return false;
        }
        
        // Status filter
        if (statusFilter.length > 0) {
          return statusFilter.includes(item.shipmentStatus || '');
        }
        
        return true;
      }) : [];
      
      return (
        <>
          {contextHolder}
          <div className="flex justify-between items-center">
            <div>
              <p className="text-[#121417] text-2xl font-bold max-sm:text-xl">
                Shipment Implementation Details
              </p>
              <p className="text-[#64707D] text-sm font-normal max-sm:text-xs">
                {data && data.length > 0 ? (
                  <>
                    {filteredData.length === data.length 
                      ? `You're viewing all ${data.length} shipments.` 
                      : `Showing ${filteredData.length} of ${data.length} shipments.`}
                  </>
                ) : (
                  "No shipments available."
                )}
              </p>
            </div>
            {/* <Button
              onClick={() => router.push("/reviews/new")}
              className="bg-[#7201FD] hover:bg-[#430194] px-4 py-3 rounded-[10px] text-white"
            >
              Start PO Evaluation
            </Button> */}
          </div>

          <div className="bg-white rounded-[20px]">
            <div className="mt-10 z-10">
              <DataTable
                columns={reviewColumns as ColumnDef<unknown, unknown>[]}
                data={filteredData}
                rowClick={(id: string) => handleOrderClick(id)}
                searchKey="purchaseOrderNumber"
                searchQuery={searchQuery}
                setSearchQuery={(value) => {
                  setSearchQuery(value as string);
                  return Promise.resolve(new URLSearchParams());
                }}
                setPage={(value) => {
                  setCurrentPage(value as number);
                  return Promise.resolve(new URLSearchParams());
                }}
                totalItems={filteredData.length}
                showPagination={true}
                filterTitle="Shipment Status"
                options={SHIPMENT_STATUS_OPTIONS}
                filterValue={statusFilter.join('.')}
                onFilterChange={(values) => setStatusFilter(values)}
              />
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
                  onClick={handleDeleteOrder}
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

    // Final return statement with conditional rendering
    return (
      <>
        {!mounted ? renderLoadingState() : 
         isPending ? renderLoadingState() : 
         renderMainContent()}
      </>
    );
  };
  
  export default FollowUp;
  