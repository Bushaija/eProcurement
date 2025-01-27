import { selectPurchaseOrdersSchema } from "@/db/schema";
import { createRoute, z } from "@hono/zod-openapi";

const tags = ["Purchase Orders"];

// export const getAllItems = createRoute({
//     path: "/reports/all-items",
//     method: "get",
//     tags,
//     responses: {
//         200: {
//             content: {
//                 "application/json": {
//                     schema: z.array(selectPurchaseOrdersSchema)
//                 }
//             },
//             description: "Purchase order API Index"
//         }
//     }
// });

// export const getPurchaseOrdersByOrderDate = createRoute({
//     path: "/reports/purchase-orders-by-order-date",
//     method: "get",
//     tags,
//     responses: {
//       200: {
//         content: {
//           "application/json": {
//             schema: z.array(
//               z.object({
//                 plannedOrderDate: z.string(),
//                 orderCount: z.number(),
//               })
//             ),
//           },
//         },
//         description: "Get the number of purchase orders grouped by planned order date",
//       },
//     },
// });

// export const getPurchaseOrdersByDivision = createRoute({
//     path: "/reports/purchase-orders-by-division",
//     method: "get",
//     tags,
//     responses: {
//       200: {
//         content: {
//           "application/json": {
//             schema: z.array(
//               z.object({
//                 allocationDepartment: z.string(),
//                 orderCount: z.number(),
//               })
//             ),
//           },
//         },
//         description: "Get the number of purchase orders grouped by allocation department (division)",
//       },
//     },
// });

// export const getPurchaseOrdersByFundingSource = createRoute({
//     path: "/reports/purchase-orders-by-funding-source",
//     method: "get",
//     tags,
//     responses: {
//       200: {
//         content: {
//           "application/json": {
//             schema: z.array(
//               z.object({
//                 fundingSource: z.string(),
//                 orderCount: z.number(),
//               })
//             ),
//           },
//         },
//         description: "Get the number of purchase orders grouped by funding source",
//       },
//     },
// });

// export const getPurchaseOrdersByDeliveryDate = createRoute({
//     path: "/reports/purchase-orders-by-delivery-date",
//     method: "get",
//     tags,
//     responses: {
//       200: {
//         content: {
//           "application/json": {
//             schema: z.array(
//               z.object({
//                 plannedDeliveryDate: z.string(),
//                 orderCount: z.number(),
//               })
//             ),
//           },
//         },
//         description: "Get the number of purchase orders grouped by planned delivery date",
//       },
//     },
// });

// export const getTotalCostByPlannedOrderDate = createRoute({
//     path: "/reports/total-cost-by-order-date",
//     method: "get",
//     tags,
//     responses: {
//       200: {
//         content: {
//           "application/json": {
//             schema: z.array(
//               z.object({
//                 plannedOrderDate: z.string(),
//                 totalCost: z.number(),
//               })
//             ),
//           },
//         },
//         description: "Get the total cost of purchase orders grouped by planned order date",
//       },
//     },
// });

// export const getTotalCostByAllocationDepartment = createRoute({
//     path: "/reports/total-cost-by-allocation-department",
//     method: "get",
//     tags,
//     responses: {
//       200: {
//         content: {
//           "application/json": {
//             schema: z.array(
//               z.object({
//                 allocationDepartment: z.string(),
//                 totalCost: z.number(),
//               })
//             ),
//           },
//         },
//         description: "Get the total cost of purchase orders grouped by allocation department",
//       },
//     },
//   });

// export const getTotalCostByFundingSource = createRoute({
//     path: "/reports/total-cost-by-funding-source",
//     method: "get",
//     tags,
//     responses: {
//         200: {
//         content: {
//             "application/json": {
//             schema: z.array(
//                 z.object({
//                 fundingSource: z.string(),
//                 totalCost: z.number(),
//                 })
//             ),
//             },
//         },
//         description: "Get the total cost of purchase orders grouped by funding source",
//         },
//     },
// });

// export const getTotalCostByPlannedDeliveryDate = createRoute({
//     path: "/reports/total-cost-by-planned-delivery-date",
//     method: "get",
//     tags,
//     responses: {
//       200: {
//         content: {
//           "application/json": {
//             schema: z.array(
//               z.object({
//                 plannedDeliveryDate: z.string(),
//                 totalCost: z.number(),
//               })
//             ),
//           },
//         },
//         description: "Get the total cost of purchase orders grouped by planned delivery date",
//       },
//     },
//   });

// shipment analytics
// export const getPurchaseOrdersPlannedOrderByShipmentStatus = createRoute({
//   path: "/reports/purchase-orders-by-planned-order-shipment-status",
//   method: "get",
//   tags,
//   responses: {
//     200: {
//       content: {
//         "application/json": {
//           schema: z.array(
//             z.object({
//               plannedOrderDate: z.string(),
//               shipmentStatus: z.string(),
//               orderCount: z.number(),
//             })
//           ),
//         },
//       },
//       description: "Get the number of purchase orders grouped by planned order date and shipment statuses",
//     },
//   },
// });

// export const getPurchaseOrdersByDepartmentAndShipmentStatus = createRoute({
//   path: "/reports/purchase-orders-by-department-shipment-status",
//   method: "get",
//   tags,
//   responses: {
//     200: {
//       content: {
//         "application/json": {
//           schema: z.array(
//             z.object({
//               allocationDepartment: z.string(),
//               shipmentStatus: z.string(),
//               orderCount: z.number(),
//             })
//           ),
//         },
//       },
//       description: "Get the number of purchase orders grouped by allocation department and shipment statuses",
//     },
//   },
// });

// export const getPurchaseOrdersByFundingSourceAndShipmentStatus = createRoute({
//   path: "/reports/purchase-orders-by-funding-source-shipment-status",
//   method: "get",
//   tags,
//   responses: {
//     200: {
//       content: {
//         "application/json": {
//           schema: z.array(
//             z.object({
//               fundingSource: z.string(),
//               shipmentStatus: z.string(),
//               orderCount: z.number(),
//             })
//           ),
//         },
//       },
//       description: "Get the number of purchase orders grouped by funding source and shipment statuses",
//     },
//   },
// });

// export const getPurchaseOrdersByDeliveryDateAndShipmentStatus = createRoute({
//   path: "/reports/purchase-orders-by-delivery-date-shipment-status",
//   method: "get",
//   tags,
//   responses: {
//     200: {
//       content: {
//         "application/json": {
//           schema: z.array(
//             z.object({
//               plannedDeliveryDate: z.string(),
//               shipmentStatus: z.string(),
//               orderCount: z.number(),
//             })
//           ),
//         },
//       },
//       description: "Get the number of purchase orders grouped by planned delivery date and shipment statuses",
//     },
//   },
// });

// aggregated analytics
// export const getPercentagePlannedByOrderedShipmentPurchaseOrders = createRoute({
//   path: "/reports/percentage-planned-by-ordered-shipment-status",
//   method: "get",
//   tags,
//   responses: {
//     200: {
//       content: {
//         "application/json": {
//           schema: z.object({
//             totalPlanned: z.number(),
//             totalOrdered: z.number(),
//             orderedPercentage: z.number(),
//           }),
//         },
//       },
//       description: "Get the percentage of 'ORDERED' purchase orders compared to 'PLANNED' shipment purchase orders",
//     },
//   },
// });

// export const getPercentagePlannedByCancelledShipmentPurchaseOrders = createRoute({
//   path: "/reports/percentage-planned-by-cancelled-shipment-status",
//   method: "get",
//   tags,
//   responses: {
//     200: {
//       content: {
//         "application/json": {
//           schema: z.object({
//             totalPlanned: z.number(),
//             totalCancelled: z.number(),
//             cancelledPercentage: z.number(),
//           }),
//         },
//       },
//       description: "Get the percentage of cancelled purchase orders vs planned purchase orders",
//     },
//   },
// });

// export const getPercentagePlannedByReceivedShipmentPurchaseOrders = createRoute({
//   path: "/reports/percentage-planned-by-received-shipment-status",
//   method: "get",
//   tags,
//   responses: {
//     200: {
//       content: {
//         "application/json": {
//           schema: z.object({
//             totalPlanned: z.number(),
//             totalReceived: z.number(),
//             receivedPercentage: z.number(),
//           }),
//         },
//       },
//       description: "Get the percentage of received purchase orders vs planned purchase orders",
//     },
//   },
// });

// export const getPercentagePlannedByHoldPurchaseOrders = createRoute({
//   path: "/reports/percentage-planned-by-hold-shipment-status",
//   method: "get",
//   tags,
//   responses: {
//     200: {
//       content: {
//         "application/json": {
//           schema: z.object({
//             totalPlanned: z.number(),
//             totalHold: z.number(),
//             holdPercentage: z.number(),
//           }),
//         },
//       },
//       description: "Get the percentage of hold purchase orders vs planned purchase orders",
//     },
//   },
// });

// export const getPercentageByPartialReceivedPurchaseOrders = createRoute({
//   path: "/reports/percentage-planned-by-partial-received-shipment-status",
//   method: "get",
//   tags,
//   responses: {
//     200: {
//       content: {
//         "application/json": {
//           schema: z.object({
//             totalPlanned: z.number(),
//             totalPartialReceived: z.number(),
//             partialReceivedPercentage: z.number(),
//           }),
//         },
//       },
//       description: "Get the percentage of partial received purchase orders vs planned purchase orders",
//     },
//   },
// });

// consolidated routes

export const getPercentagePlannedByShipmentStatus = createRoute({
  path: "/reports/percentage-planned-by-shipment-status",
  method: "get",
  tags,
  query: z.object({
    status: z.enum(["ORDERED", "CANCELLED", "RECEIVED", "HOLD", "PARTIAL RECEIVED"]),
  }),
  responses: {
    200: {
      content: {
        "application/json": {
          schema: z.object({
            totalPlanned: z.number(),
            totalStatus: z.number(),
            percentage: z.number(),
          }),
        },
      },
      description: "Get the percentage of a specific shipment status compared to planned purchase orders",
    },
  },
});

// consolidated costs analytics

export const getTotalCostReport = createRoute({
  path: "/reports/total-cost-report",
  method: "get",
  tags,
  query: z.object({
    groupBy: z.enum([
      "plannedOrderDate",
      "allocationDepartment",
      "fundingSource",
      "plannedDeliveryDate",
    ]),
  }),
  responses: {
    200: {
      content: {
        "application/json": {
          schema: z.array(
            z.object({
              groupValue: z.string(),
              totalCost: z.number(),
            })
          ),
        },
      },
      description: "Get the total cost of purchase orders grouped by the specified field",
    },
  },
});

// consolidated shipment analytics

export const getPurchaseOrdersByShipmentStatus = createRoute({
  path: "/reports/shipments-report",
  method: "get",
  tags,
  query: {
    groupBy: z
      .enum([
        "plannedOrderDate",
        "allocationDepartment",
        "fundingSource",
        "plannedDeliveryDate",
      ])
      .optional(),
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: z.array(
            z.object({
              groupValue: z.string(),
              shipmentStatus: z.string(),
              orderCount: z.number(),
            })
          ),
        },
      },
      description:
        "Get the number of purchase orders grouped by a specific field and shipment statuses",
    },
  },
});


export type GetPurchaseOrdersByShipmentStatus = typeof getPurchaseOrdersByShipmentStatus;

export type GetTotalCostReport = typeof getTotalCostReport;

export type GetPercentagePlannedByShipmentStatus = typeof getPercentagePlannedByShipmentStatus;

// export type GetPercentageByPartialReceivedPurchaseOrders = typeof getPercentageByPartialReceivedPurchaseOrders;
// export type GetPercentagePlannedByHoldPurchaseOrders = typeof getPercentagePlannedByHoldPurchaseOrders;
// export type GetPercentagePlannedByReceivedShipmentPurchaseOrders = typeof getPercentagePlannedByReceivedShipmentPurchaseOrders;
// export type GetPercentagePlannedByCancelledShipmentPurchaseOrders = typeof getPercentagePlannedByCancelledShipmentPurchaseOrders;
// export type GetPercentagePlannedByOrderedShipmentPurchaseOrders = typeof getPercentagePlannedByOrderedShipmentPurchaseOrders;

// export type GetPurchaseOrdersByDeliveryDateAndShipmentStatus = typeof getPurchaseOrdersByDeliveryDateAndShipmentStatus;
// export type GetPurchaseOrdersByFundingSourceAndShipmentStatus = typeof getPurchaseOrdersByFundingSourceAndShipmentStatus;
// export type GetPurchaseOrdersByDepartmentAndShipmentStatus = typeof getPurchaseOrdersByDepartmentAndShipmentStatus;
// export type GetPurchaseOrdersPlannedOrderByShipmentStatus = typeof getPurchaseOrdersPlannedOrderByShipmentStatus;

// export type GetTotalCostByPlannedDeliveryDate = typeof getTotalCostByPlannedDeliveryDate;
// export type GetTotalCostByFundingSource = typeof getTotalCostByFundingSource;  
// export type GetTotalCostByAllocationDepartment = typeof getTotalCostByAllocationDepartment;
// export type GetTotalCostByPlannedOrderDate = typeof getTotalCostByPlannedOrderDate;

// export type GetPurchaseOrdersByDeliveryDate = typeof getPurchaseOrdersByDeliveryDate;
// export type GetPurchaseOrdersByFundingSource = typeof getPurchaseOrdersByFundingSource;
// export type GetPurchaseOrdersByDivision = typeof getPurchaseOrdersByDivision;
// export type GetPurchaseOrdersByOrderDate = typeof getPurchaseOrdersByOrderDate;

// export type GetAllItems = typeof getAllItems;
