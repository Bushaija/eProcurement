import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/hono";


export const useGetPurchaseOrdersByFunder = () => {
  const query = useQuery({
    queryKey: ["reports"],
    queryFn: async () => {
      const response = await client.reports["purchase-orders-by-funding-source-shipment-status"].$get();

      if (!response.ok) {
        throw new Error("Failed to fetch purchase orders by funding source shipment status");
      }
      
      return response.json();
    },
  });
  return query;
};
