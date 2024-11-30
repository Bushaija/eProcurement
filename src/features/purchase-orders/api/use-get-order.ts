import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/hono";
import { selectPurchaseOrdersSchema } from "@/db/schema";

export const useGetPurchaseOrder = (id?: number) => {
  const query = useQuery({
    enabled: !!id,
    queryKey: ["orders", { id }],
    queryFn: async () => {
      const response = await client.orders[":id"].$get({ param: { id: Number(id) } });

      if (!response.ok) {
        throw new Error("Failed to fetch purchase order");
      }

      const json = await response.json();
      const data = selectPurchaseOrdersSchema.parse(json);
      return data;
    },
  });
  return query;
};
