import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono";

export const useGetPurchaseOrders = () => {
  const query = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const response = await client.orders.$get();
      if (!response.ok) {
        throw new Error("Failed to fetch purchase orders");
      }
      
      return response.json();
    },
  });
  return query;
};

// import { useQuery } from "@tanstack/react-query";
// import { client } from "@/lib/hono";

// export const useGetPurchaseOrders = (filters) => {
//   const query = useQuery({
//     queryKey: ["orders", filters], // Include filters in the query key to ensure caching works correctly
//     queryFn: async () => {
//       const response = await client.orders.$get({ query: filters }); // Pass filters as query params
//       if (!response.ok) {
//         throw new Error("Failed to fetch purchase orders");
//       }
//       return response.json();
//     },
//   });
//   return query;
// };

