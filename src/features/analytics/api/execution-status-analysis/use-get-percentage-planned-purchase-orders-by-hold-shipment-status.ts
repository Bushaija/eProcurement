import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/hono";


export const useGetPercentagePlannedPurchaseOrdersByHoldShipmentStatus = () => {
  const query = useQuery({
    queryKey: ["reports"],
    queryFn: async () => {
      const response = await client.reports["percentage-planned-by-hold-shipment-status"].$get();

      if (!response.ok) {
        throw new Error("Failed to percentage planned by hold shipment status");
      }
      
      return response.json();
    },
  });
  return query;
};
