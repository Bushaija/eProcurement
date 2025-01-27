import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/hono";


export const useGetTotalCostByPlannedDeliveryDate = () => {
  const query = useQuery({
    queryKey: ["reports"],
    queryFn: async () => {
      const response = await client.reports["total-cost-by-planned-delivery-date"].$get();

      if (!response.ok) {
        throw new Error("Failed to fetch total cost by planned delivery date");
      }
      
      return response.json();
    },
  });
  return query;
};
