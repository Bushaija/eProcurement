import { createRoute, z } from "@hono/zod-openapi";

const tags = ["analytics"];

export const list = createRoute({
    path: "/analytics/full-data",
    method: "get",
    tags,
    request: {
        query: z.object({
            fiscal_year: z.string().optional(),
            status: z.string().optional(),
            division: z.string().optional(),
            shipment_name: z.string().optional(),
            page: z.string().default("1"),
            limit: z.string().default("10"),
            sort_by: z.string().default("plannedDeliveryDate"),
            order: z.enum(["asc", "desc"]).default("desc"),
        }),
    },
    responses: {
        200: {
            content: {
                "application/json": {
                    schema: z.object({
                        total_shipments: z.coerce.number(),
                        shipments: z.array(z.any()),
                        pagination: z.object({
                          current_page: z.number(),
                          total_pages: z.coerce.number(),
                          total_items: z.coerce.number(),
                        }),
                    }),
                },
            },
            description: "List all shipments with filtering, pagination, and sorting."
        }
    }
});

export type ListRoute = typeof list;