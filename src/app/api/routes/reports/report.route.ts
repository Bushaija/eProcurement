import { selectPurchaseOrdersSchema } from "@/db/schema";
import { createRoute, z } from "@hono/zod-openapi";
import { jsonContent } from "stoker/openapi/helpers";
import { any } from "zod";
import { notFoundSchema } from "../../constants";

const tags = ["Purchase Orders"];

export const getTenderTAT = createRoute({
  path: "/reports/tender-tat",
  method: "get",
  tags,
  responses: {
    200: {
      content: {
        "application/json": {
          schema: z.array(selectPurchaseOrdersSchema),
        },
      },
      description: "Get the TAT for tenders",
    },
    404: jsonContent(
      notFoundSchema,
      "No tenders found"
    )
  },
});

export const getPlannedItems = createRoute({
  path: "/reports/planned-items",
  method: "get",
  tags,
  responses: {
    200: jsonContent(
      selectPurchaseOrdersSchema,
      "The requested purchase order."
    ),
    404: jsonContent(
      notFoundSchema,
      "Purchase order not found."
    )
  },
});

export const getSupplierTAT = createRoute({
  path: "/reports/supplier-tat",
  method: "get",
  tags,
  responses: {
    200: jsonContent(
      selectPurchaseOrdersSchema,
      "The requested supplier TAT."
    ),
    404: jsonContent(
      notFoundSchema,
      "Supplier TAT not found."
    )
  },
});

export const planningTAT = createRoute({
  path: "/reports/planning-tat",
  method: "get",
  tags,
  responses: {
    200: jsonContent(
      selectPurchaseOrdersSchema,
      "The requested planning TAT."
    ),
    404: jsonContent(
      notFoundSchema,
      "Planning TAT not found."
    )
  },
});

export const deliveryTAT = createRoute({
  path: "/reports/delivery-tat",
  method: "get",
  tags,
  responses: {
    200: jsonContent(
      selectPurchaseOrdersSchema,
      "The requested delivery TAT."
    ),
    404: jsonContent(
      notFoundSchema,
      "Delivery TAT not found."
    )
  },
});


// =====================


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

export type GetPlannedItems = typeof getPlannedItems;
export type GetSupplierTAT = typeof getSupplierTAT;
export type PlanningTAT = typeof planningTAT;
export type DeliveryTAT = typeof deliveryTAT;
export type GetTenderTAT = typeof getTenderTAT;

