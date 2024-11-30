import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono";

export const useGetPurchaseOrders = () => {
  const query = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const response = await client.orders.$get();
      
      if (!response.ok) {
        throw new Error("Failed to fetch purchase orders");
      }
      
      return response.json();
    },
  });
  return query;
};
