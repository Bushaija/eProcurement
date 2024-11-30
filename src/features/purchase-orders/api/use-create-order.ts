import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/hono";

type ResponseType = InferResponseType<typeof client.orders.$post>;
type RequestType = InferRequestType<typeof client.orders.$post>["json"];

export const useCreatePurchaseOrder = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.orders.$post({ json });
      return await response.json();
    },
    onSuccess: () => {
      toast.success("Purchase order created!");
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
    onError: () => {
      toast.error("Failed to create a purchase order");
    },
  });

  return mutation;
};
