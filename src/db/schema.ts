import * as zod from "zod";
import { relations } from "drizzle-orm";
import { doublePrecision, integer, pgEnum, pgTable, serial, timestamp, varchar, text, date, numeric } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod"

export const statusEnum = pgEnum("status", ["PLANNED", "APPROVED", "REJECTED", "SUBMITTED", "COMPLETED"])
export const shipmentEnum = pgEnum("shipment_status", ['ORDERED', 'PLANNED', 'CANCELLED', 'RECEIVED', 'HOLD', 'PARTIAL RECEIVED'])


// purchase order table

export const purchaseOrderTable = pgTable("purchase_order", {
  id: serial("id").primaryKey(),
  // TODO: Remove itemType
  // itemType: varchar("item_type", { length: 255 }),
  category: varchar("category", { length: 255 }).notNull(),
  plannedUnit: varchar("planned_unit", { length: 255 }).notNull(),
  allocationDepartment: varchar("allocation_department", { length: 255 }).notNull(),
  packSize: varchar("pack_size", { length: 255 }).notNull(),
  plannedOrderDate: date("planned_order_date").notNull(),
  plannedDeliveryDate: date("planned_delivery_date").notNull(),
  plannedQuantity: integer("planned_quantity").notNull(),
  revisedQuantity: integer("revised_quantity").default(0),
  secondReview: integer("second_review").default(0),
  unitCost: numeric("unit_cost").notNull(),
  totalCost: doublePrecision("total_cost"),
  fundingSource: varchar("funding_source", { length: 255 }),
  status: statusEnum().default("PLANNED"),
  createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow(),
});
// category,plannedUnit,allocationDepartment,packSize,plannedOrderDate,plannedDeliveryDate,plannedQuantity,revisedQuantity,secondReview,unitCost,totalCost,fundingSource, status

// purchase order review table

export const purchaseOrderReviewTable = pgTable("purchase_order_review", {
  id: serial("id").primaryKey(),
  purchaseOrderId: integer("purchase_order_review_id").unique().references(() => purchaseOrderTable.id, { onDelete: 'cascade' }),
  purchaseOrderCreationDate: date("purchase_order_creation_date"),
  purchaseOrderNumber: varchar("purchase_order_number", { length: 255 }),
  purchaseOrderIssueDate: date("purchase_order_issue_date"),
  readTime: date("read_time"),
  expectedDeliveryDate: date("expected_delivery_date"),
  unitPriceDdp: doublePrecision("unit_price_ddp").default(0),
  totalCostDdp: doublePrecision("total_cost_ddp").default(0),
  unitPriceCip: doublePrecision("unit_price_cip").default(0),
  totalCostCip: doublePrecision("total_cost_cip").default(0),
  currency: varchar("currency", { length: 100 }).default('USD'),
  orderQuantity: integer("order_quantity").default(0),
  receivedQuantity: integer("received_quantity", ).default(0),
  receivedDate: date("received_date"),
  balancedQuantity: integer("balanced_quantity").default(0),
  shipmentStatus: shipmentEnum("shipment_status").default("PLANNED"),
  comments: text("comments"),
  createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow(),
});


// relationships

export const purchaseOrderRelations = relations(purchaseOrderTable, ({ one }) => ({
  purchaseOrder: one(purchaseOrderReviewTable, {
    fields: [purchaseOrderTable.id],
    references: [purchaseOrderReviewTable.purchaseOrderId],
  }),
}));


export const purchaseOrderReviewRelations = relations(purchaseOrderReviewTable, ({ one }) => ({
  purchaseOrder: one(purchaseOrderTable, {
    fields: [purchaseOrderReviewTable.purchaseOrderId],
    references: [purchaseOrderTable.id],
  }),
}));


// purchase order validation types

export const selectPurchaseOrdersSchema = createSelectSchema(purchaseOrderTable);

export const insertPurchaseOrderSchema = createInsertSchema(purchaseOrderTable, {
  // itemType: schema => schema.itemType.min(1).max(500),
  category: schema => schema.category.min(1).max(500),
  plannedUnit: schema => schema.plannedUnit.min(1).max(500),
  allocationDepartment: schema => schema.allocationDepartment.min(1).max(500),
  packSize: schema => schema.packSize.min(1).max(500),
  plannedQuantity: schema => schema.plannedQuantity.min(1),
  unitCost: schema => schema.unitCost.min(1),
  totalCost: schema => schema.totalCost.min(1),
  fundingSource: schema => schema.fundingSource.min(1).max(500),
})
  .required({
    // itemType: true,
    category: true,
    plannedUnit: true,
    allocationDepartment: true,
    packSize: true,
    plannedOrderDate: true,
    plannedDeliveryDate: true,
    plannedQuantity: true,
    unitCost: true,
    totalCost: true,
    fundingSource: true,
  })
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  });

export const patchPurchaseOrderSchema = insertPurchaseOrderSchema.partial();


// purchase order review validation types

export const selectPurchaseOrderReviewSchema = createSelectSchema(purchaseOrderReviewTable);

export const insertPurchaseOrderReviewSchema = createInsertSchema(purchaseOrderReviewTable).omit({
  id: true, 
  createdAt: true,
  updatedAt: true,
});

export const patchPurchaseOrderReviewSchema = insertPurchaseOrderReviewSchema.partial();



// custom types
export type TSelectPurchaseOrderSchema = zod.infer<typeof selectPurchaseOrdersSchema>;

export type TSelectPurchaseOrderReviewSchema = zod.infer<typeof selectPurchaseOrderReviewSchema>

// export const selectPurchaseOrdersArraySchema = zod.array(selectPurchaseOrdersSchema);

// // Infer the type for the array
// export type TSelectPurchaseOrdersArraySchema = zod.infer<typeof selectPurchaseOrdersArraySchema>;


// fixing table

export type PurchaseOrder = typeof purchaseOrderTable.$inferSelect
export type NewPurchaseOrder = typeof purchaseOrderTable.$inferInsert
