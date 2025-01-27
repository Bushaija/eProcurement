import {
    createSearchParamsCache,
    // parseAsArrayOf,
    parseAsInteger,
    parseAsString,
    // parseAsStringEnum,
  } from "nuqs/server"
  import * as z from "zod"

// import { purchaseOrderTable as purchaseOrders, type PurchaseOrder } from "@/db/schema"
// import { getFiltersStateParser, getSortingStateParser } from "@/lib/parsers"

export const searchParamsCache = createSearchParamsCache({
    // flags: parseAsArrayOf(z.enum(["advancedTable", "floatingBar"])).withDefault(
    //     []
    // ),
    // page: parseAsInteger.withDefault(1),
    // perPage: parseAsInteger.withDefault(10),
    // sort: getSortingStateParser<PurchaseOrder>().withDefault([
    //     { id: "createdAt", desc: true },
    // ]),
    // title: parseAsString.withDefault(""),
    // status: parseAsArrayOf(z.enum(purchaseOrders.status.enumValues)).withDefault([]),
    // priority: parseAsArrayOf(z.enum(purchaseOrders.priority.enumValues)).withDefault([]),
    // from: parseAsString.withDefault(""),
    // to: parseAsString.withDefault(""),
    // // advanced filter
    // filters: getFiltersStateParser().withDefault([]),
    // joinOperator: parseAsStringEnum(["and", "or"]).withDefault("and"),
    page: parseAsInteger.withDefault(1),
    limit: parseAsInteger.withDefault(10),
    q: parseAsString,
    department: parseAsString,
    categories: parseAsString
})