import { TSelectPurchaseOrderReviewSchema, TSelectPurchaseOrderSchema } from "@/db/schema";

export function countPlannedItem(poList: TSelectPurchaseOrderSchema[]): number {
    return poList.filter(po => po.status === "PLANNED").length;
};

export function countDelayedItems(
    poList: TSelectPurchaseOrderSchema[],
    reviewList: TSelectPurchaseOrderReviewSchema[],
): { total_delayed_items: number } {
    const totalOrderItems = poList.length;
    const receivedItems = reviewList
        .filter(review => ["RECEIVED", "PARTIAL RECEIVED"].includes(String(review.shipmentStatus)))
        .length;
    const delayedItems = totalOrderItems - receivedItems;
    return { total_delayed_items: delayedItems}
};

export function countReceivedItems(
    reviewList: TSelectPurchaseOrderReviewSchema[],
): { total_received_items: number } {
    const receivedItems = reviewList
        .filter(review => ["RECEIVED", "PARTIAL RECEIVED"].includes(String(review.shipmentStatus)))
        .length;
    return { total_received_items: receivedItems}
};

export function countCancelledItems(
    reviewList: TSelectPurchaseOrderReviewSchema[],
): { total_cancelled_items: number } {
    const cancelledItems = reviewList
        .filter(review => review.shipmentStatus === "CANCELLED")
        .length;
    return { total_cancelled_items: cancelledItems}
};

export function countHoldItems(
    reviewList: TSelectPurchaseOrderReviewSchema[],
): { total_hold_items: number } {
    const holdItems = reviewList
        .filter(review => review.shipmentStatus === "HOLD")
        .length;
    return { total_hold_items: holdItems}
};

export function countOrderedItems(
    reviewList: TSelectPurchaseOrderReviewSchema[],
): { total_ordered_items: number } {
    const orderedItems = reviewList
        .filter(review => review.shipmentStatus === "ORDERED")
        .length;
    return { total_ordered_items: orderedItems}
};

export function countPlannedItems(
    reviewList: TSelectPurchaseOrderReviewSchema[],
): { total_planned_items: number } {
    const plannedItems = reviewList
        .filter(review => review.shipmentStatus === "PLANNED")
        .length;
    return { total_planned_items: plannedItems}
};

export function countPartialReceivedItems(
    reviewList: TSelectPurchaseOrderReviewSchema[],
): { total_partial_received_items: number } {
    const partialReceivedItems = reviewList
        .filter(review => review.shipmentStatus === "PARTIAL RECEIVED")
        .length;
    return { total_partial_received_items: partialReceivedItems}
};

export function countTotalItems(
    poList: TSelectPurchaseOrderSchema[],
): { total_items: number } {
    const totalItems = poList.length;
    return { total_items: totalItems}
};

export function countTotalCost(
    poList: TSelectPurchaseOrderSchema[],
): { total_cost: number } {
    const totalCost = poList.reduce((acc, po) => acc + po.totalCost, 0);
    return { total_cost: totalCost}
};

export function countTotalCostByFundingSource(
    poList: TSelectPurchaseOrderSchema[],
): { total_cost_by_funding_source: number } {
    const totalCostByFundingSource = poList.reduce((acc, po) => acc + po.totalCost, 0);
    return { total_cost_by_funding_source: totalCostByFundingSource}
};

export function countTotalCostByPlannedDeliveryDate(
    poList: TSelectPurchaseOrderSchema[],
): { total_cost_by_planned_delivery_date: number } {
    const totalCostByPlannedDeliveryDate = poList.reduce((acc, po) => acc + po.totalCost, 0);
    return { total_cost_by_planned_delivery_date: totalCostByPlannedDeliveryDate}
};

export function countTotalCostByPlannedOrderDate(
    poList: TSelectPurchaseOrderSchema[],
): { total_cost_by_planned_order_date: number } {
    const totalCostByPlannedOrderDate = poList.reduce((acc, po) => acc + po.totalCost, 0);
    return { total_cost_by_planned_order_date: totalCostByPlannedOrderDate}
};

export function countTotalCostByAllocationDepartment(
    poList: TSelectPurchaseOrderSchema[],
): { total_cost_by_allocation_department: number } {
    const totalCostByAllocationDepartment = poList.reduce((acc, po) => acc + po.totalCost, 0);
    return { total_cost_by_allocation_department: totalCostByAllocationDepartment}
};

export function countTotalCostByDivision(
    poList: TSelectPurchaseOrderSchema[],
): { total_cost_by_division: number } {
    const totalCostByDivision = poList.reduce((acc, po) => acc + po.totalCost, 0);
    return { total_cost_by_division: totalCostByDivision}
};  

export function countTotalCostByOrderDate(
    poList: TSelectPurchaseOrderSchema[],
): { total_cost_by_order_date: number } {
    const totalCostByOrderDate = poList.reduce((acc, po) => acc + po.totalCost, 0);
    return { total_cost_by_order_date: totalCostByOrderDate}
};

export function countTotalCostByPlannedOrderByShipmentStatus(
    reviewList: TSelectPurchaseOrderReviewSchema[],
): { total_cost_by_planned_order_by_shipment_status: number } {
    const totalCostByPlannedOrderByShipmentStatus = reviewList.reduce((acc, review) => acc + review.totalCostDdp, 0);
    return { total_cost_by_planned_order_by_shipment_status: totalCostByPlannedOrderByShipmentStatus}
};  








