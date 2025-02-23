import { createRouter } from "../../lib/create-app";
import * as handlers from "./analytics.handler";
import * as routes from "./analytics.route";

const router = createRouter()
    .openapi(routes.list, handlers.list);

export default router;