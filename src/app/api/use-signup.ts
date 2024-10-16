import { useMutation } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<typeof client.api.auth['sign-up']['$post']>
type RequestType = InferRequestType<typeof client.api.auth['sign-up']['$post']>['json']


export const useSignUp = () => {
  const mutation = useMutation<
    ResponseType, Error, RequestType
  >({
      mutationFn: async (json) => {
        const response = await client.api.auth['sign-up']['$post']({ json })

        const data = await response.json()
        if (!response.ok) {
          throw new Error(data.message || '註冊失敗');
        }
        return data
      }
    })

  return mutation
}