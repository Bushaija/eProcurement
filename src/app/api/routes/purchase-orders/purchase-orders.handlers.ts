import { eq } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HTTPStatusPhrases from "stoker/http-status-phrases";

import { db } from "@/db";
import { purchaseOrderTable } from "@/db/schema";
import type { CreateRoute, GetOneRoute, ListRoute, PatchRoute, RemoveRoute } from "./purchase-orders.route";
import type { AppRouteHandler } from "../../lib/types";


export const list: AppRouteHandler<ListRoute> = async (c)=> {
    // const purchaseOrders = await db.query.purchaseOrderTable.findMany()
    const purchaseOrders = await db
        .select().from(purchaseOrderTable);
    return c.json(purchaseOrders);
};


export const create: AppRouteHandler<CreateRoute> = async (c) => {
    const purchaseOrder = c.req.valid("json");
    const [inserted] = await db.insert(purchaseOrderTable).values(purchaseOrder).returning();
    return c.json(inserted, 200);
}


export const getOne: AppRouteHandler<GetOneRoute> = async (c)=> {
    const { id } = c.req.valid("param");
    const purchaseOrder = await db.query.purchaseOrderTable.findFirst({
        where(fields, operators) {
            return operators.eq(fields.id, id);
        }
    });

    if(!purchaseOrder) {
        return c.json({
            message: HTTPStatusPhrases.NOT_FOUND,
        }, 404);
    }

    return c.json(purchaseOrder, 200);
};


export const patch: AppRouteHandler<PatchRoute> = async (c)=> {
    const { id } = c.req.valid("param");
    const updates = c.req.valid("json");

    const [purchaseOrder] = await db.update(purchaseOrderTable)
        .set(updates)
        .where(eq(purchaseOrderTable.id, id))
        .returning();

    if(!purchaseOrder) {
        return c.json({
            message: HTTPStatusPhrases.NOT_FOUND,
        }, 404);
    }

    return c.json(purchaseOrder, 200);
};

export const remove: AppRouteHandler<RemoveRoute> = async (c)=> {
    const { id } = c.req.valid("param");

    const result = await db.delete(purchaseOrderTable)
        .where(eq(purchaseOrderTable.id, id));
    
    if(result.rowCount === 0) {
        return c.json({
            message: HTTPStatusPhrases.NOT_FOUND,
        }, HttpStatusCodes.NOT_FOUND)
    }
    return c.body(null, HttpStatusCodes.NO_CONTENT)

};