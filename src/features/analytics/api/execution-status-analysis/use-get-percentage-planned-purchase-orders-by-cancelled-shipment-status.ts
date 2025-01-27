import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/hono";


export const useGetPercentagePlannedPurchaseOrdersByCancelledShipmentStatus = () => {
  const query = useQuery({
    queryKey: ["reports"],
    queryFn: async () => {
      const response = await client.reports["percentage-planned-by-cancelled-shipment-status"].$get();

      if (!response.ok) {
        throw new Error("Failed to fetch percentage planned by cancelled shipment status");
      }
      
      return response.json();
    },
  });
  return query;
};
