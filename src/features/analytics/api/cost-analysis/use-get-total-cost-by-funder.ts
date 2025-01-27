import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/hono";


export const useGetTotalCostByFunder = () => {
  const query = useQuery({
    queryKey: ["reports"],
    queryFn: async () => {
      const response = await client.reports["total-cost-by-funding-source"].$get();

      if (!response.ok) {
        throw new Error("Failed to total cost by funding source");
      }
      
      return response.json();
    },
  });
  return query;
};
