
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferResponseType } from "hono";

import { client } from "@/lib/hono";

type ResponseType = InferResponseType<
  (typeof client.orders)[":id"]["$delete"]
>;

export const useDeletePurchaseOrder = (id?: number ) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error>({
    mutationFn: async () => {
      const response = await client.orders[":id"]["$delete"]({
        param: { id: Number(id) },
      });
      // return await response.json();
      return (await response.json()) as ResponseType;
    },
    onSuccess: () => {
      toast.success("Request deleted");
      queryClient.invalidateQueries({ queryKey: ["requests"] });
    },
    onError: () => {
      toast.error("Failed to delete request.");
    },
  });

  return mutation;
};

