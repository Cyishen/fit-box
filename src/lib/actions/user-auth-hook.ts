import { useMutation } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";

type LoginResponseType = InferResponseType<typeof client.api.hono['sign-in']['$post']>
type LoginRequestType = InferRequestType<typeof client.api.hono['sign-in']['$post']>['json']

type SignUpResponseType = InferResponseType<typeof client.api.hono['sign-up']['$post']>
type SignUpRequestType = InferRequestType<typeof client.api.hono['sign-up']['$post']>['json']

type LogoutResponseType = InferResponseType<typeof client.api.hono['logout']['$post']>

const handleResponse = async (response: Response) => {
  const data = await response.json()
  if (!response.ok) {
    throw new Error(data.message || '操作失敗');
  }
  return data
}

export const useLogin = () => {
  return useMutation<LoginResponseType, Error, LoginRequestType>({
    mutationFn: async (json) => {
      const response = await client.api.hono['sign-in']['$post']({ json })
      return handleResponse(response)
    }
  })
}

export const useSignUp = () => {
  return useMutation<SignUpResponseType, Error, SignUpRequestType>({
    mutationFn: async (json) => {
      const response = await client.api.hono['sign-up']['$post']({ json })
      return handleResponse(response)
    }
  })
}

export const useLogout = () => {
  return useMutation<LogoutResponseType, Error>({
    mutationFn: async () => {
      const response = await client.api.hono['logout']['$post']()
      return handleResponse(response)
    },
    onSuccess: () => {
      window.location.reload()
    }
  })
}