// @ts-nocheck
import { db } from "@/db";
import { purchaseOrderTable, purchaseOrderReviewTable } from "@/db/schema";
import { eq, and, like, sql } from "drizzle-orm";

export interface shipmentFilters {
    fiscal_year?: string;
    status?: string;
    division?: string;
    shipment_name?: string;
    page?: number;
    limit?: number;
    sort_by?: keyof typeof purchaseOrderTable;
    order?: "asc" | "desc";
};

// fetch shipments with filtering, pagination, and sorting

export const getShipments = async ({
    fiscal_year,
    status,
    division,
    shipment_name,
    page = 1,
    limit = 10,
    sort_by,
    order,
}: shipmentFilters ) => {
    const offset = (page - 1) * limit;
    let conditions = [];

    if (fiscal_year) {
        conditions.push(eq(sql`EXTRACT (YEAR FROM purchase_order.created_at)`, fiscal_year));
    }

    if (status) {
        conditions.push(eq(purchaseOrderTable.status, status as "PLANNED" | "APPROVED" | "REJECTED" | "SUBMITTED" | "COMPLETED"));
    }

    if (division) {
        conditions.push(eq(purchaseOrderTable.allocationDepartment, division));
    }
    
    if (shipment_name) {
        conditions.push(like(purchaseOrderTable.plannedUnit, `%${shipment_name}%`));
    }

    const shipmentData = await db
    .select({
      id: purchaseOrderTable.id,
      category: purchaseOrderTable.category,
      shipmentName: purchaseOrderTable.plannedUnit,
      division: purchaseOrderTable.allocationDepartment,
      packSize: purchaseOrderTable.packSize,
      plannedOrderDate: purchaseOrderTable.plannedOrderDate,
      plannedDeliveryDate: purchaseOrderTable.plannedDeliveryDate,
      plannedQuantity: purchaseOrderTable.plannedQuantity,
      revisedQuantity: purchaseOrderTable.revisedQuantity,
      unitCost: purchaseOrderTable.unitCost,
      totalCost: purchaseOrderTable.totalCost,
      fundingSource: purchaseOrderTable.fundingSource,
      status: purchaseOrderTable.status,
      fiscalYear: sql`EXTRACT(YEAR FROM purchase_order.created_at)`,
      shipmentImplementation: {
        purchaseOrderNumber: purchaseOrderReviewTable.purchaseOrderNumber,
        orderedQuantity: purchaseOrderReviewTable.orderQuantity,
        receivedQuantity: purchaseOrderReviewTable.receivedQuantity,
        balancedQuantity: purchaseOrderReviewTable.balancedQuantity,
        shipmentStatus: purchaseOrderReviewTable.shipmentStatus,
        expectedDeliveryDate: purchaseOrderReviewTable.expectedDeliveryDate,
        receivedDate: purchaseOrderReviewTable.receivedDate,
      },
    })
    .from(purchaseOrderTable)
    .leftJoin(purchaseOrderReviewTable, eq(purchaseOrderTable.id, purchaseOrderReviewTable.purchaseOrderId))
    .where(and(...conditions))
    .orderBy(sort_by ? (order === "asc" ? purchaseOrderTable[sort_by] : sql`${purchaseOrderTable[sort_by]} DESC`) : purchaseOrderTable.createdAt)
    .limit(limit)
    .offset(offset);

    const totalShipments = await db
    .select({ count: sql<number>`COUNT(*)` })
    .from(purchaseOrderTable)
    .where(and(...conditions));

    return {
        total_shipments: Number(totalShipments[0]?.count),
        shipments: shipmentData,
        pagination: {
          current_page: page,
          total_pages: Math.ceil((Number(totalShipments[0]?.count)) / limit),
          total_items: Number(totalShipments[0]?.count),
        },
    };
}