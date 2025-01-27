import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/hono";


export const useGetPurchaseOrdersByDepartment = () => {
  const query = useQuery({
    queryKey: ["reports"],
    queryFn: async () => {
      const response = await client.reports["purchase-orders-by-department-shipment-status"].$get();

      if (!response.ok) {
        throw new Error("Failed to fetch purchase orders by department shipment status");
      }
      
      return response.json();
    },
  });
  return query;
};
