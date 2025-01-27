import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono";

export const useGetTotalCostReport = (groupBy: string) => {
  return useQuery({
    queryKey: ["reports", groupBy],
    queryFn: async () => {
      const response = await client.reports["total-cost-report"].$get({
        query: { groupBy },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch planned by total cost report");
      }

      return response.json();
    },
    enabled: !! groupBy, 
  });
};
