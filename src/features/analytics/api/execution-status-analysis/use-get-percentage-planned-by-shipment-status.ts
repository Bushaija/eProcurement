import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono";

export const useGetPercentagePlannedByShipmentStatus = (status: string) => {
  return useQuery({
    queryKey: ["reports", status],
    queryFn: async () => {
      const response = await client.reports["percentage-planned-by-shipment-status"].$get({
        query: { status },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch planned by shipment status");
      }

      return response.json();
    },
    enabled: !!status, 
  });
};
