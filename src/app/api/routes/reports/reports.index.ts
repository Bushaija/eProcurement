import { createRouter } from "../../lib/create-app";

import * as handlers from "./report.handler";
import * as routes from "./report.route";

const router = createRouter()
    // .openapi(routes.getAllItems, handlers.getAllItems)
    
    // .openapi(routes.getTotalCostByPlannedOrderDate, handlers.getTotalCostByPlannedOrderDate)
    // .openapi(routes.getTotalCostByAllocationDepartment, handlers.getTotalCostByAllocationDepartment)
    // .openapi(routes.getTotalCostByFundingSource, handlers.getTotalCostByFundingSource)
    // .openapi(routes.getTotalCostByPlannedDeliveryDate, handlers.getTotalCostByPlannedDeliveryDate)
    
    // .openapi(routes.getPurchaseOrdersPlannedOrderByShipmentStatus, handlers.getPurchaseOrdersPlannedOrderByShipmentStatus)
    // .openapi(routes.getPurchaseOrdersByDepartmentAndShipmentStatus, handlers.getPurchaseOrdersByDepartmentAndShipmentStatus)
    // .openapi(routes.getPurchaseOrdersByFundingSourceAndShipmentStatus, handlers.getPurchaseOrdersByFundingSourceAndShipmentStatus)
    // .openapi(routes.getPurchaseOrdersByDeliveryDateAndShipmentStatus, handlers.getPurchaseOrdersByDeliveryDateAndShipmentStatus)

    // .openapi(routes.getPercentagePlannedByOrderedShipmentPurchaseOrders, handlers.getPercentagePlannedByOrderedShipmentPurchaseOrders)
    // .openapi(routes.getPercentagePlannedByCancelledShipmentPurchaseOrders, handlers.getPercentagePlannedByCancelledShipmentPurchaseOrders)
    // .openapi(routes.getPercentagePlannedByReceivedShipmentPurchaseOrders, handlers.getPercentagePlannedByReceivedShipmentPurchaseOrders)
    // .openapi(routes.getPercentagePlannedByHoldPurchaseOrders, handlers.getPercentagePlannedByHoldPurchaseOrders)
    // .openapi(routes.getPercentageByPartialReceivedPurchaseOrders, handlers.getPercentageByPartialReceivedPurchaseOrders)

    .openapi(routes.getPercentagePlannedByShipmentStatus, handlers.getPercentagePlannedByShipmentStatus)
    .openapi(routes.getPurchaseOrdersByShipmentStatus, handlers.getPurchaseOrdersByShipmentStatus)
    .openapi(routes.getTotalCostReport, handlers.getTotalCostReport);


export default router;


// .openapi(routes.getPurchaseOrdersByOrderDate, handlers.getPurchaseOrdersByOrderDate)
// .openapi(routes.getPurchaseOrdersByDivision, handlers.getPurchaseOrdersByDivision)
// .openapi(routes.getPurchaseOrdersByFundingSource, handlers.getPurchaseOrdersByFundingSource)
// .openapi(routes.getPurchaseOrdersByDeliveryDate, handlers.getPurchaseOrdersByDeliveryDate)
