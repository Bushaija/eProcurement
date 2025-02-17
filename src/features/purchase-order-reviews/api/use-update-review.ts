import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/hono";

type ResponseType = InferResponseType<
  (typeof client.reviews)[":id"]["$patch"]
>;
type RequestType = InferRequestType<
  (typeof client.reviews)[":id"]["$patch"]
>["json"];

export const useEditPurchaseOrderReview = (id: number) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.reviews[":id"]["$patch"]({
        json,
        param: { id },
      });
      return await response.json();
    },
    onSuccess: () => {
      toast.success("Shipment implementation updated");
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
    },
    onError: () => {
      toast.error("Failed to edit shipment Implementation");
    },
  });

  return mutation;
};

