import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono";

import { selectPurchaseOrderReviewSchema } from "@/db/schema";

export const useGetPurchaseOrderReview = (id: number) => {
  const query = useQuery({
    enabled: !!id,
    queryKey: ["requests", { id }],
    queryFn: async () => {
      const response = await client.reviews[":id"].$get({ param: { id } });

      if (!response.ok) {
        throw new Error("Failed to fetch purchase order review");
      }

      const json = await response.json();
      const data = selectPurchaseOrderReviewSchema.parse(json);
      return data;
    },
  });
  return query;
};
