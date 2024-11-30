import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/hono";

type ResponseType = InferResponseType<
  (typeof client.reviews)[":id"]["$delete"]
>;

export const useDeletePurchaseOrderReview = (id: number) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error>({
    mutationFn: async () => {
      const response = await client.reviews[":id"]["$delete"]({
        param: { id },
      });
      return (await response.json()) as ResponseType;
    },
    onSuccess: () => {
      toast.success("Purchase order review deleted");
      queryClient.invalidateQueries({ queryKey: ["orders", { id }] });
    },
    onError: () => {
      toast.error("Failed to delete purchase order review");
    },
  });

  return mutation;
};