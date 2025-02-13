"use client"

import { Skeleton, message } from "antd";
import { SmallDataTable } from "@/components/ui/table/small-data-table";
import { useTableColumns } from "@/hooks/use-get-table-columns";
import { useMergedPurchaseData } from "@/hooks/use-merge-items-data";
// import PlannedDeliveryByMonth from "./sections/budget-per-division";
import { DonutChart } from "./charts/donut-chart";
import { RadialChart } from "./charts/RadialChart";
import { CostBySourceFund } from "./sections/cost-by-source-fund";
// import { PlannedDeliveryByMonth } from "./sections/budget-per-division";
import { InteractiveBarChart } from "./charts/Interactive-bar";

const selectedColumns = [
  "plannedUnit", 
  "purchasseOrderNumber",
  "category", 
  "allocationDepartment",
  "plannedQuantity",
  "orderQuantity",
  "receivedQuantity",
  "balancedQuantity",
  "plannedOrderDate",
  "plannedDeliveryDate",
  "purchaseOrderIssueDate",
  "expectedDeliveryDate",
  "receivedDate",
];

const Dashboard = () => {
  const [messageApi, contextHolder] = message.useMessage();
  // const purchaseOrdersQuery = useGetPurchaseOrder();
  // const purchaseOrderReviewsQuery = useGetPurchaseOrderReviews();
  const {
    data: filteredData,
    isLoading,
    error,
  } = useMergedPurchaseData(selectedColumns);
  const columns = useTableColumns({
    tableType: "merged",
    selectedColumns,
  })

  // const purchaseOrders = purchaseOrdersQuery.data || [];
  // const purchaseReviews = purchaseOrderReviewsQuery.data || [];
  

  // const isPending = purchaseOrdersQuery.isLoading || purchaseOrderReviewsQuery.isLoading;
  // const error = purchaseOrdersQuery.error || purchaseOrderReviewsQuery.error;

  if (isLoading) {
    return <Skeleton className="py-5 px-5 max-sm:px-0" active paragraph={{ rows: 6}} />;
  }

  if (error) {
    messageApi.open({
        type: "error",
        content: "Error fetching data",
    });
  }

  return (
    <>
    {contextHolder}
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <div className="aspect-video rounded-xl bg-muted/50"> <DonutChart /></div>
            {/* {/* <div className="aspect-video rounded-xl bg-muted/50"> <RadialChart /> </div> */}
            <div className="aspect-video rounded-xl bg-muted/50"> <CostBySourceFund/> </div>
        </div>

        <div className="min-h-[100vh] flex-1rounded-xl bg-muted/50">
            <InteractiveBarChart />
            <SmallDataTable
                data={filteredData}
                columns={columns}
                totalItems={0}
            /> 
        </div>
    </div>
    </>
  )
}

export default Dashboard