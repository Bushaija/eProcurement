import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono";

interface ParamsProps {   
    status?: string;
    fiscal_year?: string;
    division?: string;
    shipment_name?: string;
    page?: string;
    limit?: string;
    sort_by?: string;
    order?: "asc" | "desc";
};

interface ShipmentResponse {
    total_shipments: number;
    shipments: Array<any>; // Ideally, define a Shipment type instead of `any`
    pagination: {
      current_page: number;
      total_pages: number;
      total_items: number;
    };
};
  

export const useGetFullData = (params: Partial<ParamsProps> = {}) => {
    return useQuery<ShipmentResponse>({
      queryKey: ["shipments", params],
      queryFn: async () => {
        const response = await client.analytics["full-data"].$get({ query: params });
  
        if (!response.ok) {
          throw new Error("Failed to fetch shipment data");
        }
  
        return response.json();
      },
      staleTime: 5000,
    //   keepPreviousData: true,
    });
  };
  
