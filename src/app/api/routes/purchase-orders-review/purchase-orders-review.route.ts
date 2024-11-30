import { 
    jsonContent, 
    jsonContentOneOf, 
    jsonContentRequired 
} from "stoker/openapi/helpers";
import { createRoute, z } from "@hono/zod-openapi";
import { createErrorSchema, IdParamsSchema } from "stoker/openapi/schemas";
import * as HttpStatusCodes from "stoker/http-status-codes";

import { 
    insertPurchaseOrderReviewSchema, 
    patchPurchaseOrderReviewSchema,
    selectPurchaseOrderReviewSchema,
} from "@/db/schema";
import { notFoundSchema } from "../../constants";

const tags = ["Purchase Order Review"];

export const list = createRoute({
    path: "/reviews",
    method: "get",
    tags,
    responses: {
        [HttpStatusCodes.OK]: {
            content: {
                "application/json": {
                    schema: z.array(selectPurchaseOrderReviewSchema),
                }
            },
            description: "Purchase order review API Index"
        }
    }
});

export const create = createRoute({
    path: "/reviews",
    method: "post",
    request: {
        body: jsonContentRequired(
            insertPurchaseOrderReviewSchema,
            "The purchase order review to create.",
        )
    },
    tags,
    responses: {
        [HttpStatusCodes.OK]: jsonContent(
            insertPurchaseOrderReviewSchema,
            "The purchase order review to create",
        ),
        [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
            createErrorSchema(insertPurchaseOrderReviewSchema),
            "The validation error(s)",
        ),
    },
});

export const getOne = createRoute({
    path: "/reviews/{id}",
    method: "get",
    request: {
        params: IdParamsSchema,
    },
    tags,
    responses: {
        200: jsonContent(
            selectPurchaseOrderReviewSchema,
            "The requested purchase order review",
        ),
        404: jsonContent(
            notFoundSchema,
            "Purchase order review not found"
        ),
        422: jsonContent(
            createErrorSchema(IdParamsSchema),
            "Invalid Id Error(s)"
        )
    },
});

export const patch = createRoute({
    path: "/reviews/{id}",
    method: "patch",
    request: {
        params: IdParamsSchema,
        body: jsonContentRequired(
            patchPurchaseOrderReviewSchema,
            "The purchase order review update",
        ),
    },
    tags,
    responses: {
        200: jsonContent(
            selectPurchaseOrderReviewSchema,
            "The updated purchase order review",
        ),
        404: jsonContent(
            notFoundSchema,
            "purchase order review not found"
        ),
        422: jsonContentOneOf(
            [ 
                createErrorSchema(IdParamsSchema),
                createErrorSchema(patchPurchaseOrderReviewSchema)
            ],
            "The validation error(s)",
        )
    },
});

export const remove = createRoute({
    path: "/reviews/{id}",
    method: "delete",
    request: {
        params: IdParamsSchema,
    },
    tags,
    responses: {
        204: {
            description: "The updated purchase order review",
        },
        404: jsonContent(
            notFoundSchema,
            "purchase order review not found"
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