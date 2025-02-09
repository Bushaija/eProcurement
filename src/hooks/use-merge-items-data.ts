import { useMemo } from "react";
import { useGetPurchaseOrders } from "@/features/purchase-orders/api/use-get-orders";
import { useGetPurchaseOrderReviews } from "@/features/purchase-order-reviews/api/use-get-reviews";
import { TSelectPurchaseOrderReviewSchema, TSelectPurchaseOrderSchema } from "@/db/schema";

export const useMergedPurchaseData = (selectedColumns: string[]) => {
  const purchaseOrdersQuery = useGetPurchaseOrders();
  const purchaseOrderReviewsQuery = useGetPurchaseOrderReviews();

  const isLoading = purchaseOrdersQuery.isLoading || purchaseOrderReviewsQuery.isLoading;
  const error = purchaseOrdersQuery.error || purchaseOrderReviewsQuery.error;

  const purchaseOrders: Array<TSelectPurchaseOrderSchema> = (purchaseOrdersQuery.data as unknown as Array<TSelectPurchaseOrderSchema>) || [];
  
  const purchaseReviews: Array<TSelectPurchaseOrderReviewSchema> = purchaseOrderReviewsQuery.data || [];

  // Memoized merge logic for better performance
  const mergedData = useMemo(() => {
    if (!purchaseOrders.length) return [];

    // Convert purchaseReviews into a lookup object { purchaseOrderId: reviewData }
    const reviewLookup = new Map<number, any>();
    purchaseReviews.forEach((review) => {
      if (review.purchaseOrderId !== null) {
        reviewLookup.set(review.purchaseOrderId, review);
      }
    });

    return purchaseOrders.map((order) => {
      // Find matching review using purchaseOrderId
      const reviewData = reviewLookup.get(order.id) || {};

      // Merge order and review data, keeping only selectedColumns
      return selectedColumns.reduce((acc, column) => {
        acc[column] = (order as Record<string, any>)[column] ?? (reviewData as Record<string, any>)[column] ?? null; // Handle missing values
        return acc;
      }, {} as Record<string, any>);
    });
  }, [purchaseOrders, purchaseReviews, selectedColumns]);

  return { data: mergedData, isLoading, error };
};
