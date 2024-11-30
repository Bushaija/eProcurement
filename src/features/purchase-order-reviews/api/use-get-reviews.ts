import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/hono";


export const useGetPurchaseOrderReviews = () => {
  const query = useQuery({
    queryKey: ["reviews"],
    queryFn: async () => {
      const response = await client.reviews.$get();

      if (!response.ok) {
        throw new Error("Failed to fetch purchase order review");
      }
      
      return response.json();
    },
  });
  return query;
};
