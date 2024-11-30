import { createRouter } from "../../lib/create-app";

import * as handlers from "./purchase-orders-review.handlers";
import * as routes from "./purchase-orders-review.route";

const router = createRouter()
    .openapi(routes.list, handlers.list)
    .openapi(routes.create, handlers.create)
    .openapi(routes.getOne, handlers.getOne)
    .openapi(routes.patch, handlers.patch)
    .openapi(routes.remove, handlers.remove);

export default router;