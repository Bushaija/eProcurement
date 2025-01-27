import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/hono";


export const useGetPurchaseOrdersByDeliveryDate = () => {
  const query = useQuery({
    queryKey: ["reports"],
    queryFn: async () => {
      const response = await client.reports["purchase-orders-by-delivery-date-shipment-status"].$get();

      if (!response.ok) {
        throw new Error("Failed to fetch purchase orders by delivery date shipment status");
      }
      
      return response.json();
    },
  });
  return query;
};
