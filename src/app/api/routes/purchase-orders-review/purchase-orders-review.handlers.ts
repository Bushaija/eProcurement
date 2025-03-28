import { desc, eq } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HTTPStatusPhrases from "stoker/http-status-phrases";

import { db } from "@/db";
import { purchaseOrderReviewTable } from "@/db/schema";
import type { AppRouteHandler } from "../../lib/types";
import { 
    CreateRoute,
    GetOneRoute, 
    ListRoute, 
    PatchRoute, 
    RemoveRoute
} from "./purchase-orders-review.route";


export const list: AppRouteHandler<ListRoute> = async (c)=> {
    // const reviews = await db.query.purchaseOrderReviewTable.findMany()
    const reviews = await db
        .select()
        .from(purchaseOrderReviewTable)
        .orderBy(desc(purchaseOrderReviewTable.createdAt))
    return c.json(reviews);
};


export const create: AppRouteHandler<CreateRoute> = async (c) => {
    const review = c.req.valid("json");
    const [inserted] = await db.insert(purchaseOrderReviewTable).values(review).returning();
    return c.json(inserted, 200);
};


export const getOne: AppRouteHandler<GetOneRoute> = async (c)=> {
    const { id } = c.req.valid("param");
    const review = await db.query.purchaseOrderReviewTable.findFirst({
        where(fields, operators) {
            return operators.eq(fields.id, id);
        }
    });

    if(!review) {
        return c.json({
            message: HTTPStatusPhrases.NOT_FOUND,
        }, 404);
    }

    return c.json(review, 200);
};


export const patch: AppRouteHandler<PatchRoute> = async (c)=> {
    const { id } = c.req.valid("param");
    const updates = c.req.valid("json");

    console.log("API received update request for ID:", id);
    console.log("Update payload:", JSON.stringify(updates, null, 2));

    try {
        const [review] = await db.update(purchaseOrderReviewTable)
            .set(updates)
            .where(eq(purchaseOrderReviewTable.id, id))
            .returning();

        if(!review) {
            console.log("No review found with ID:", id);
            return c.json({
                message: HTTPStatusPhrases.NOT_FOUND,
            }, 404);
        }

        console.log("Update successful, returning:", JSON.stringify(review, null, 2));
        return c.json(review, 200);
    } catch (error) {
        console.error("Error updating review:", error);
        return c.json({
            message: "Error updating review",
            error: error instanceof Error ? error.message : String(error)
        }, 500);
    }
};

export const remove: AppRouteHandler<RemoveRoute> = async (c)=> {
    const { id } = c.req.valid("param");

    const result = await db.delete(purchaseOrderReviewTable)
        .where(eq(purchaseOrderReviewTable.id, id));
    
    if(result.rowCount === 0) {
        return c.json({
            message: HTTPStatusPhrases.NOT_FOUND,
        }, HttpStatusCodes.NOT_FOUND)
    }
    return c.body(null, HttpStatusCodes.NO_CONTENT)

};
