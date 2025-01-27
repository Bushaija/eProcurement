import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/hono";


export const useGetTotalCostByFunder = () => {
  const query = useQuery({
    queryKey: ["reports"],
    queryFn: async () => {
      const response = await client.reports["total-cost-by-allocation-department"].$get();

      if (!response.ok) {
        throw new Error("Failed to fetch total cost by department");
      }
      
      return response.json();
    },
  });
  return query;
};
