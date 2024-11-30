import { insertPurchaseOrderSchema, patchPurchaseOrderSchema, selectPurchaseOrdersSchema } from "@/db/schema";
import { createRoute, z } from "@hono/zod-openapi";
import { jsonContent, jsonContentOneOf, jsonContentRequired } from "stoker/openapi/helpers";
import { createErrorSchema, IdParamsSchema } from "stoker/openapi/schemas";
import { notFoundSchema } from "../../constants";

const tags = ["Purchase Orders"];

export const list = createRoute({
    path: "/orders",
    method: "get",
    tags,
    responses: {
        200: {
            content: {
                "application/json": {
                    schema: z.array(selectPurchaseOrdersSchema)
                }
            },
            description: "Purchase order API Index"
        }
    }
});
 
export const create = createRoute({
    path: "/orders",
    method: "post",
    request: {
        body: jsonContentRequired(
            insertPurchaseOrderSchema,
            "The purchase order to create",
        ),
    },
    tags,
    responses: {
        200: jsonContent(
            selectPurchaseOrdersSchema,
            "The created purchase order",
        ),
        422: jsonContent(
            createErrorSchema(insertPurchaseOrderSchema),
            "The validation error(s)",
        )
    },
});

export const getOne = createRoute({
    path: "/orders/{id}",
    method: "get",
    request: {
        params: IdParamsSchema,
    },
    tags,
    responses: {
        200: jsonContent(
            selectPurchaseOrdersSchema,
            "The requested purchase order",
        ),
        404: jsonContent(
            notFoundSchema,
            "Purchase order not found"
        ),
        422: jsonContent(
            createErrorSchema(IdParamsSchema),
            "Invalid Id Error(s)"
        )
    },
});

export const patch = createRoute({
    path: "/orders/{id}",
    method: "patch",
    request: {
        params: IdParamsSchema,
        body: jsonContentRequired(
            patchPurchaseOrderSchema,
            "The purchase order update",
        ),
    },
    tags,
    responses: {
        200: jsonContent(
            selectPurchaseOrdersSchema,
            "The updated purchase order",
        ),
        404: jsonContent(
            notFoundSchema,
            "purchase order not found"
        ),
        422: jsonContentOneOf(
            [ 
                createErrorSchema(IdParamsSchema),
                createErrorSchema(patchPurchaseOrderSchema)
            ],
            "The validation error(s)",
        )
    },
});

export const remove = createRoute({
    path: "/orders/{id}",
    method: "delete",
    request: {
        params: IdParamsSchema,
    },
    tags,
    responses: {
        204: {
            description: "The updated purchase order",
        },
        404: jsonContent(
            notFoundSchema,
            "purchase order not found"
        ),
        422: jsonContent(
            createErrorSchema(IdParamsSchema),
            "Invalid id error",
        )
    },
});

export type ListRoute = typeof list;

export type CreateRoute = typeof create;

export type GetOneRoute = typeof getOne;

export type PatchRoute = typeof patch;

export type RemoveRoute = typeof remove;