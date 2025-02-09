import { db } from "@/db";
import { purchaseOrderReviewTable, purchaseOrderTable } from "@/db/schema";
import type { AppRouteHandler } from "../../lib/types";
import type { 
  GetTotalCostReport,
  GetPercentagePlannedByShipmentStatus, 
  GetPurchaseOrdersByShipmentStatus,
  GetTenderTAT, 
} from "./report.route";
import { sql } from "drizzle-orm";


export const getTenderTAT: AppRouteHandler<GetTenderTAT> = async (c) => {
  const results = await db
    .select({
      tenderId: purchaseOrderTable.tenderId,
      tenderTAT: sql`DATEDIFF(${purchaseOrderTable.plannedOrderDate}, ${purchaseOrderTable.tenderDate})`.as("tenderTAT"),
    })
    .from(purchaseOrderTable)
    .where(sql`${purchaseOrderTable.tenderDate} IS NOT NULL`);

  return c.json(results);
}

// Consolidated percentage analytics

export const getPercentagePlannedByShipmentStatus: AppRouteHandler<
  GetPercentagePlannedByShipmentStatus
> = async (c) => {
  const status = c.req.query("status");

  const totalPlannedResult = await db
    .select({
      totalPlanned: sql`COUNT(${purchaseOrderTable.id})`.as("totalPlanned"),
    })
    .from(purchaseOrderTable)
    .where(sql`${purchaseOrderTable.status} = 'PLANNED'`);

  const totalPlanned = totalPlannedResult[0]?.totalPlanned ?? 0;

  const totalStatusResult = await db
    .select({
      totalStatus: sql`COUNT(${purchaseOrderReviewTable.id})`.as("totalStatus"),
    })
    .from(purchaseOrderReviewTable)
    .where(sql`${purchaseOrderReviewTable.shipmentStatus} = ${status}`);

  const totalStatus = totalStatusResult[0]?.totalStatus ?? 0;

  const percentage = Number(totalPlanned) > 0 ? (Number(totalStatus) / Number(totalPlanned)) * 100 : 0;

  return c.json({
    totalPlanned: Number(totalPlanned),
    totalStatus: Number(totalStatus),
    percentage: parseFloat(percentage.toFixed(2)), // Rounded to 2 decimal places
  });
};

// consolidate costs analysis
export const getTotalCostReport: AppRouteHandler<GetTotalCostReport> = async (c) => {
  const groupBy = c.req.query("groupBy") as string

  // Map to column names for grouping
  const groupByMap: Record<string, any> = {
    plannedOrderDate: purchaseOrderTable.plannedOrderDate,
    allocationDepartment: purchaseOrderTable.allocationDepartment,
    fundingSource: purchaseOrderTable.fundingSource,
    plannedDeliveryDate: purchaseOrderTable.plannedDeliveryDate,
  };

  const groupColumn = groupByMap[groupBy];

  // if (!groupBy || !(groupBy in groupByMap)) {
  //   return c.json({ error: "Invalid or missing groupBy value" }, 404);
  // }

  const results = await db
    .select({
      groupValue: groupColumn,
      totalCost: sql`SUM(${purchaseOrderTable.totalCost})`.as("totalCost"),
    })
    .from(purchaseOrderTable)
    .groupBy(groupColumn);

  return c.json(results);
};


// consolidated shipment analytics

export const getPurchaseOrdersByShipmentStatus: AppRouteHandler<
GetPurchaseOrdersByShipmentStatus
> = async (c) => {
  const groupBy = c.req.query("groupBy") as string;

  const groupByMap: Record<string, any> = {
    plannedOrderDate: purchaseOrderTable.plannedOrderDate,
    allocationDepartment: purchaseOrderTable.allocationDepartment,
    fundingSource: purchaseOrderTable.fundingSource,
    plannedDeliveryDate: purchaseOrderTable.plannedDeliveryDate,
  };

  const groupColumn = groupByMap[groupBy];

  const results = await db
    .select({
      groupValue: groupColumn,
      shipmentStatus: purchaseOrderReviewTable.shipmentStatus,
      orderCount: sql`COUNT(${purchaseOrderTable.id})`.as("orderCount"),
    })
    .from(purchaseOrderTable)
    .innerJoin(
      purchaseOrderReviewTable,
      sql`${purchaseOrderTable.id} = ${purchaseOrderReviewTable.purchaseOrderId}`
    )
    .groupBy(groupColumn, purchaseOrderReviewTable.shipmentStatus);

  return c.json(results);
};






