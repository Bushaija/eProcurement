import { apiReference } from "@scalar/hono-api-reference";
import type { AppOpenAPI } from "./types";

const OPENAPI_VERSION = "1.0.0";

export default function configureOpenApi(app: AppOpenAPI) {
    app.doc("api/doc", {
        openapi: "3.0.0",
        info: {
            version: OPENAPI_VERSION,
            title: "Procurement API",
        }
    });

    app.get("api/reference", apiReference({
        theme: "kepler",
        layout: "classic",
        spec: {
            url: "/doc",
        }
    }));
};