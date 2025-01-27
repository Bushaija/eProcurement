import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono";

export const useGetShipmentReport = (groupBy: string) => {
  return useQuery({
    queryKey: ["reports", groupBy],
    queryFn: async () => {
      const response = await client.reports["shipments-report"].$get({
        query: { groupBy },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch shipments report");
      }

      return response.json();
    },
    enabled: !! groupBy, 
  });
};
