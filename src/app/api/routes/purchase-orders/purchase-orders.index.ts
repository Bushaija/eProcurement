import { createRouter } from "../../lib/create-app";

import * as handlers from "./purchase-orders.handlers";
import * as routes from "./purchase-orders.route";

const router = createRouter()
    .openapi(routes.list, handlers.list)
    .openapi(routes.create, handlers.create)
    .openapi(routes.getOne, handlers.getOne)
    .openapi(routes.patch, handlers.patch)
    .openapi(routes.remove, handlers.remove)
    .openapi(routes.uploadCSV, handlers.uploadCSV);

export default router;