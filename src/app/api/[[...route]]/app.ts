import configureOpenApi from "../lib/configure-open-api";
import createApp from "../lib/create-app";
import index from "../routes/index.route";

import analytics from "../routes/analytics/analytics.index"
import purchaseOrders from "../routes/purchase-orders/purchase-orders.index";
import purchaseOrderReviews from "../routes/purchase-orders-review/purchase-orders-review.index";

const app = createApp();

const routes = [
    index,
    analytics,
    purchaseOrders,
    purchaseOrderReviews,
] as const;

configureOpenApi(app);

routes.forEach((route) => {
    app.route("api/", route);
});

export type AppType = typeof routes[number];

export default app;
