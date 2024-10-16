import { useMutation } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<typeof client.api.auth['sign-in']['$post']>
type RequestType = InferRequestType<typeof client.api.auth['sign-in']['$post']>['json']


export const useLogin = () => {
  const mutation = useMutation<
    ResponseType, Error, RequestType
  >({
      mutationFn: async (json) => {
        const response = await client.api.auth['sign-in']['$post']({ json })

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || '登入失敗');
        }

        return await response.json()
      }
    })

  return mutation
}