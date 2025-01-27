import { db } from "@/db";
import { purchaseOrderReviewTable, purchaseOrderTable } from "@/db/schema";
import type { AppRouteHandler } from "../../lib/types";
import type { 
  // GetAllItems, 
  // GetPurchaseOrdersByDeliveryDate, 
  // GetPurchaseOrdersByDivision, 
  // GetPurchaseOrdersByFundingSource, 
  // GetPurchaseOrdersByOrderDate, 
  // GetTotalCostByAllocationDepartment, 
  // GetTotalCostByFundingSource, 
  // GetTotalCostByPlannedOrderDate, 
  // GetTotalCostByPlannedDeliveryDate,

  GetTotalCostReport,
  GetPercentagePlannedByShipmentStatus, 
  GetPurchaseOrdersByShipmentStatus, 

  // GetPurchaseOrdersPlannedOrderByShipmentStatus, 
  // GetPurchaseOrdersByDepartmentAndShipmentStatus, 
  // GetPurchaseOrdersByFundingSourceAndShipmentStatus, 
  // GetPurchaseOrdersByDeliveryDateAndShipmentStatus,

  // GetPercentagePlannedByOrderedShipmentPurchaseOrders,
  // GetPercentagePlannedByCancelledShipmentPurchaseOrders,
  // GetPercentagePlannedByReceivedShipmentPurchaseOrders,

  // GetPercentagePlannedByHoldPurchaseOrders,
  // GetPercentageByPartialReceivedPurchaseOrders,
  // GetPercentagePlannedByShipmentStatus
} from "./report.route";
import { sql } from "drizzle-orm";


// export const getAllItems: AppRouteHandler<GetAllItems> = async (c)=> {
//     // const purchaseOrders = await db.query.purchaseOrderTable.findMany()
//     const purchaseOrders = await db
//         .select().from(purchaseOrderTable);
//     return c.json(purchaseOrders);
// };

// export const getPurchaseOrdersByOrderDate: AppRouteHandler<GetPurchaseOrdersByOrderDate> = async (c) => {
//     const results = await db
//       .select({
//         plannedOrderDate: purchaseOrderTable.plannedOrderDate,
//         orderCount: sql`COUNT(${purchaseOrderTable.id})`.as("orderCount"),
//       })
//       .from(purchaseOrderTable)
//       .groupBy(purchaseOrderTable.plannedOrderDate);
  
//     return c.json(results);
// };

// export const getPurchaseOrdersByDivision: AppRouteHandler<GetPurchaseOrdersByDivision> = async (c) => {
//     const results = await db
//       .select({
//         allocationDepartment: purchaseOrderTable.allocationDepartment,
//         orderCount: sql`COUNT(${purchaseOrderTable.id})`.as("orderCount"),
//       })
//       .from(purchaseOrderTable)
//       .groupBy(purchaseOrderTable.allocationDepartment);
  
//     return c.json(results);
// };

// export const getPurchaseOrdersByFundingSource: AppRouteHandler<GetPurchaseOrdersByFundingSource> = async (c) => {
//     const results = await db
//       .select({
//         fundingSource: purchaseOrderTable.fundingSource,
//         orderCount: sql`COUNT(${purchaseOrderTable.id})`.as("orderCount"),
//       })
//       .from(purchaseOrderTable)
//       .groupBy(purchaseOrderTable.fundingSource);
  
//     return c.json(results);
// };

// export const getPurchaseOrdersByDeliveryDate: AppRouteHandler<GetPurchaseOrdersByDeliveryDate> = async (c) => {
//     const results = await db
//       .select({
//         plannedDeliveryDate: purchaseOrderTable.plannedDeliveryDate,
//         orderCount: sql`COUNT(${purchaseOrderTable.id})`.as("orderCount"),
//       })
//       .from(purchaseOrderTable)
//       .groupBy(purchaseOrderTable.plannedDeliveryDate);
  
//     return c.json(results);
// };

// export const getTotalCostByPlannedOrderDate: AppRouteHandler<GetTotalCostByPlannedOrderDate> = async (c) => {
//     const results = await db
//       .select({
//         plannedOrderDate: purchaseOrderTable.plannedOrderDate,
//         totalCost: sql`SUM(${purchaseOrderTable.totalCost})`.as("totalCost"),
//       })
//       .from(purchaseOrderTable)
//       .groupBy(purchaseOrderTable.plannedOrderDate);
  
//     return c.json(results);
// };

// export const getTotalCostByAllocationDepartment: AppRouteHandler<GetTotalCostByAllocationDepartment> = async (c) => {
//     const results = await db
//       .select({
//         allocationDepartment: purchaseOrderTable.allocationDepartment,
//         totalCost: sql`SUM(${purchaseOrderTable.totalCost})`.as("totalCost"),
//       })
//       .from(purchaseOrderTable)
//       .groupBy(purchaseOrderTable.allocationDepartment);
  
//     return c.json(results);
// };

// export const getTotalCostByFundingSource: AppRouteHandler<GetTotalCostByFundingSource> = async (c) => {
//     const results = await db
//       .select({
//         fundingSource: purchaseOrderTable.fundingSource,
//         totalCost: sql`SUM(${purchaseOrderTable.totalCost})`.as("totalCost"),
//       })
//       .from(purchaseOrderTable)
//       .groupBy(purchaseOrderTable.fundingSource);
  
//     return c.json(results);
// };

// export const getTotalCostByPlannedDeliveryDate: AppRouteHandler<GetTotalCostByPlannedDeliveryDate> = async (c) => {
//     const results = await db
//       .select({
//         plannedDeliveryDate: purchaseOrderTable.plannedDeliveryDate,
//         totalCost: sql`SUM(${purchaseOrderTable.totalCost})`.as("totalCost"),
//       })
//       .from(purchaseOrderTable)
//       .groupBy(purchaseOrderTable.plannedDeliveryDate);
  
//     return c.json(results);
// };

// shipments analytics

// export const getPurchaseOrdersPlannedOrderByShipmentStatus: AppRouteHandler<GetPurchaseOrdersPlannedOrderByShipmentStatus> = async (c) => {
//   const results = await db
//     .select({
//       plannedOrderDate: purchaseOrderTable.plannedOrderDate,
//       shipmentStatus: purchaseOrderReviewTable.shipmentStatus,
//       orderCount: sql`COUNT(${purchaseOrderTable.id})`.as("orderCount"),
//     })
//     .from(purchaseOrderTable)
//     .innerJoin(
//       purchaseOrderReviewTable,
//       sql`${purchaseOrderTable.id} = ${purchaseOrderReviewTable.purchaseOrderId}`
//     )
//     .groupBy(
//       purchaseOrderTable.plannedOrderDate,
//       purchaseOrderReviewTable.shipmentStatus
//     );

//   return c.json(results);
// };

// export const getPurchaseOrdersByDepartmentAndShipmentStatus: AppRouteHandler<
//   GetPurchaseOrdersByDepartmentAndShipmentStatus
// > = async (c) => {
//   const results = await db
//     .select({
//       allocationDepartment: purchaseOrderTable.allocationDepartment,
//       shipmentStatus: purchaseOrderReviewTable.shipmentStatus,
//       orderCount: sql`COUNT(${purchaseOrderTable.id})`.as("orderCount"),
//     })
//     .from(purchaseOrderTable)
//     .innerJoin(
//       purchaseOrderReviewTable,
//       sql`${purchaseOrderTable.id} = ${purchaseOrderReviewTable.purchaseOrderId}`
//     )
//     .groupBy(
//       purchaseOrderTable.allocationDepartment,
//       purchaseOrderReviewTable.shipmentStatus
//     );

//   return c.json(results);
// };

// export const getPurchaseOrdersByFundingSourceAndShipmentStatus: AppRouteHandler<
// GetPurchaseOrdersByFundingSourceAndShipmentStatus
// > = async (c) => {
//   const results = await db
//     .select({
//       fundingSource: purchaseOrderTable.fundingSource,
//       shipmentStatus: purchaseOrderReviewTable.shipmentStatus,
//       orderCount: sql`COUNT(${purchaseOrderTable.id})`.as("orderCount"),
//     })
//     .from(purchaseOrderTable)
//     .innerJoin(
//       purchaseOrderReviewTable,
//       sql`${purchaseOrderTable.id} = ${purchaseOrderReviewTable.purchaseOrderId}`
//     )
//     .groupBy(
//       purchaseOrderTable.fundingSource,
//       purchaseOrderReviewTable.shipmentStatus
//     );

//   return c.json(results);
// };

// export const getPurchaseOrdersByDeliveryDateAndShipmentStatus: AppRouteHandler<
//   GetPurchaseOrdersByDeliveryDateAndShipmentStatus
// > = async (c) => {
//   const results = await db
//     .select({
//       plannedDeliveryDate: purchaseOrderTable.plannedDeliveryDate,
//       shipmentStatus: purchaseOrderReviewTable.shipmentStatus,
//       orderCount: sql`COUNT(${purchaseOrderTable.id})`.as("orderCount"),
//     })
//     .from(purchaseOrderTable)
//     .innerJoin(
//       purchaseOrderReviewTable,
//       sql`${purchaseOrderTable.id} = ${purchaseOrderReviewTable.purchaseOrderId}`
//     )
//     .groupBy(
//       purchaseOrderTable.plannedDeliveryDate,
//       purchaseOrderReviewTable.shipmentStatus
//     );

//   return c.json(results);
// };

// aggregated analytics
// export const getPercentagePlannedByOrderedShipmentPurchaseOrders: AppRouteHandler<GetPercentagePlannedByOrderedShipmentPurchaseOrders> = async (c) => {
//   const totalPlannedResult = await db
//     .select({
//       totalPlanned: sql`COUNT(${purchaseOrderTable.id})`.as("totalPlanned"),
//     })
//     .from(purchaseOrderTable)
//     .where(sql`${purchaseOrderTable.status} = 'PLANNED'`);

//   const totalPlanned = totalPlannedResult[0]?.totalPlanned ?? 0;

//   const totalOrderedResult = await db
//     .select({
//       totalOrdered: sql`COUNT(${purchaseOrderReviewTable.id})`.as("totalOrdered"),
//     })
//     .from(purchaseOrderReviewTable)
//     .where(sql`${purchaseOrderReviewTable.shipmentStatus} = 'ORDERED'`);

//   const totalOrdered = totalOrderedResult[0]?.totalOrdered ?? 0;

//   const orderedPercentage = Number(totalPlanned) > 0 ? (Number(totalOrdered) / Number(totalPlanned)) * 100 : 0;

//   return c.json({
//     totalPlanned: Number(totalPlanned),
//     totalOrdered: Number(totalOrdered),
//     orderedPercentage: parseFloat(orderedPercentage.toFixed(2)),
//   });
// };

// export const getPercentagePlannedByCancelledShipmentPurchaseOrders: AppRouteHandler<GetPercentagePlannedByCancelledShipmentPurchaseOrders> = async (c) => {
//   const totalPlannedResult = await db
//     .select({
//       totalPlanned: sql`COUNT(${purchaseOrderTable.id})`.as("totalPlanned"),
//     })
//     .from(purchaseOrderTable)
//     .where(sql`${purchaseOrderTable.status} = 'PLANNED'`);

//   const totalPlanned = totalPlannedResult[0]?.totalPlanned ?? 0;

//   const totalCancelledResult = await db
//     .select({
//       totalCancelled: sql`COUNT(${purchaseOrderReviewTable.id})`.as("totalCancelled"),
//     })
//     .from(purchaseOrderReviewTable)
//     .where(sql`${purchaseOrderReviewTable.shipmentStatus} = 'CANCELLED'`);

//   const totalCancelled = totalCancelledResult[0]?.totalCancelled ?? 0;

//   const cancelledPercentage = Number(totalPlanned) > 0 ? (Number(totalCancelled) / Number(totalPlanned)) * 100 : 0;

//   return c.json({
//     totalPlanned: Number(totalPlanned),
//     totalCancelled: Number(totalCancelled),
//     cancelledPercentage: parseFloat(cancelledPercentage.toFixed(2)), // Rounded to 2 decimal places
//   });
// };

// export const getPercentagePlannedByReceivedShipmentPurchaseOrders: AppRouteHandler< GetPercentagePlannedByReceivedShipmentPurchaseOrders> = async (c) => {
//   const totalPlannedResult = await db
//     .select({
//       totalPlanned: sql`COUNT(${purchaseOrderTable.id})`.as("totalPlanned"),
//     })
//     .from(purchaseOrderTable)
//     .where(sql`${purchaseOrderTable.status} = 'PLANNED'`);

//   const totalPlanned = totalPlannedResult[0]?.totalPlanned ?? 0;

//   const totalReceivedResult = await db
//     .select({
//       totalReceived: sql`COUNT(${purchaseOrderReviewTable.id})`.as("totalReceived"),
//     })
//     .from(purchaseOrderReviewTable)
//     .where(sql`${purchaseOrderReviewTable.shipmentStatus} = 'RECEIVED'`);

//   const totalReceived = totalReceivedResult[0]?.totalReceived ?? 0;

//   const receivedPercentage = Number(totalPlanned) > 0 ? (Number(totalReceived) / Number(totalPlanned)) * 100 : 0;

//   return c.json({
//     totalPlanned: Number(totalPlanned),
//     totalReceived: Number(totalReceived),
//     receivedPercentage: parseFloat(receivedPercentage.toFixed(2)), // Rounded to 2 decimal places
//   });
// };

// export const getPercentagePlannedByHoldPurchaseOrders: AppRouteHandler<GetPercentagePlannedByHoldPurchaseOrders> = async (c) => {
//   const totalPlannedResult = await db
//     .select({
//       totalPlanned: sql`COUNT(${purchaseOrderTable.id})`.as("totalPlanned"),
//     })
//     .from(purchaseOrderTable)
//     .where(sql`${purchaseOrderTable.status} = 'PLANNED'`);

//   const totalPlanned = totalPlannedResult[0]?.totalPlanned ?? 0;

//   const totalHoldResult = await db
//     .select({
//       totalHold: sql`COUNT(${purchaseOrderReviewTable.id})`.as("totalHold"),
//     })
//     .from(purchaseOrderReviewTable)
//     .where(sql`${purchaseOrderReviewTable.shipmentStatus} = 'HOLD'`);

//   const totalHold = totalHoldResult[0]?.totalHold ?? 0;

//   const holdPercentage = Number(totalPlanned) > 0 ? (Number(totalHold) / Number(totalPlanned)) * 100 : 0;

//   return c.json({
//     totalPlanned: Number(totalPlanned),
//     totalHold: Number(totalHold),
//     holdPercentage: parseFloat(holdPercentage.toFixed(2)), // Rounded to 2 decimal places
//   });
// };

// export const getPercentageByPartialReceivedPurchaseOrders: AppRouteHandler<GetPercentageByPartialReceivedPurchaseOrders> = async (c) => {
//   const totalPlannedResult = await db
//     .select({
//       totalPlanned: sql`COUNT(${purchaseOrderTable.id})`.as("totalPlanned"),
//     })
//     .from(purchaseOrderTable)
//     .where(sql`${purchaseOrderTable.status} = 'PLANNED'`);

//   const totalPlanned = totalPlannedResult[0]?.totalPlanned ?? 0;

//   const totalPartialReceivedResult = await db
//     .select({
//       totalPartialReceived: sql`COUNT(${purchaseOrderReviewTable.id})`.as("totalPartialReceived"),
//     })
//     .from(purchaseOrderReviewTable)
//     .where(sql`${purchaseOrderReviewTable.shipmentStatus} = 'PARTIAL RECEIVED'`);

//   const totalPartialReceived = totalPartialReceivedResult[0]?.totalPartialReceived ?? 0;

//   const partialReceivedPercentage = Number(totalPlanned) > 0 ? (Number(totalPartialReceived) / Number(totalPlanned)) * 100 : 0;

//   return c.json({
//     totalPlanned: Number(totalPlanned),
//     totalPartialReceived: Number(totalPartialReceived),
//     partialReceivedPercentage: parseFloat(partialReceivedPercentage.toFixed(2)), // Rounded to 2 decimal places
//   });
// };

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

  // if (!groupBy || !(groupBy in groupByMap)) {
  //   return c.status(400).json({
  //     error: "Invalid or missing groupBy parameter. Valid options are: plannedOrderDate, allocationDepartment, fundingSource, plannedDeliveryDate.",
  //   });
  // }

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




