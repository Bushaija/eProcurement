import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/hono";


export const useGetPercentagePlannedPurchaseOrdersByPartiallyReceivedShipmentStatus = () => {
  const query = useQuery({
    queryKey: ["reports"],
    queryFn: async () => {
      const response = await client.reports["percentage-planned-by-partial-received-shipment-status"].$get();

      if (!response.ok) {
        throw new Error("Failed to fetch percentage planned by partial received shipment status");
      }
      
      return response.json();
    },
  });
  return query;
};
