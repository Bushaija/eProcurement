import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/hono";

type ResponseType = InferResponseType<typeof client.reviews.$post>;
type RequestType = InferRequestType<typeof client.reviews.$post>["json"];

export const useCreatePurchaseOrderReview = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.reviews.$post({ json });
      return await response.json();
    },
    onSuccess: () => {
      toast.success("Purchase order review created");
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
    },
    onError: () => {
      toast.error("Failed to create purchase order review");
    },
  });

  return mutation;
};
