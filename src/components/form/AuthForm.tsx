import Link from 'next/link'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

import { Form } from "@/components/ui/form"
import { Button } from '../ui/button'
import { Loader, ChevronLeft } from 'lucide-react';

import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { authFormSchema } from '@/lib/utils'
import CustomInput from './CustomInput'
import OAuth from './OAuth';

import { useLogin, useSignUp } from '@/lib/actions/user-auth-hook';


const AuthForm = ({ type }: { type: string }) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const { mutate: login } = useLogin();
  const { mutate: signUp } = useSignUp();

  const formSchema = authFormSchema(type);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  //TODO: 連結資料庫
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true);

    if (type === 'sign-in') {
      login(data, {
        onSuccess: () => {
          router.push('/fit');
        },
        onError: (error) => {
          alert(error.message);
        },
        onSettled: () => {
          setIsLoading(false);
        }
      });
    } else {
      signUp(data, {
        onSuccess: (data) => {
          alert(data.message);  
          router.push('/sign-in');
        },
        onError: (error) => {
          alert(error.message);
        },
        onSettled: () => {
          setIsLoading(false);
        }
      });
    }

    // todo* other method fetch
    // try {
    //   const response = await fetch(`/api/auth/${type === 'sign-in' ? 'sign-in' : 'sign-up'}`, {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify(data),
    //   });
  
    //   if (response.ok) {
    //     const responseData = await response.json();
    //     console.log(type === 'sign-in' ? '登入成功:' : '註冊成功:', responseData);
  
    //   } else {
    //     console.error(type === 'sign-in' ? '登入失敗' : '註冊失敗');
    //   }
      
    // } catch (error) {
    //   console.log(error)
    // } finally {
    //   setIsLoading(false)
    // }
  }

  return (
    <div className="flex justify-center size-full">
      <div className="flex min-h-screen w-full px-4 sm:max-w-[490px] flex-col justify-center gap-5 md:gap-8">
        <header>
          <Link href="/" className="flex items-center cursor-pointer hover:text-blue-500">
            <ChevronLeft size={20} />
            <h1 className="text-2xl sm:text-3xl font-extrabold">FitBox 運動盒子</h1>
          </Link>
        </header>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            {type === 'sign-up' && (
              <>
                <div className="flex">
                  <CustomInput
                    id='name'
                    control={form.control}
                    name='name'
                    label="Name"
                    placeholder='name'
                    disabled={isLoading}
                  />
                </div>
              </>
            )}

            <CustomInput
              id='email'
              control={form.control}
              name='email'
              label="Email"
              placeholder='email'
              disabled={isLoading}
            />

            <CustomInput
              id='password'
              control={form.control}
              name='password'
              label="Password"
              placeholder='password'
              disabled={isLoading}
            />

            <div className="flex flex-col">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader size={20} className="animate-spin" /> &nbsp;
                    Loading...
                  </>
                ) : type === 'sign-in' ? '登入' : '註冊'}
              </Button>
            </div>
          </form>
        </Form>

        <footer className="flex justify-center gap-2">
          <p className="text-base font-normal text-gray-600">
            {type === 'sign-in'
              ? "還沒有帳號?"
              : "已經有帳號?"}
          </p>
          <Link
            href={type === 'sign-in' ? '/sign-up' : '/sign-in'}
            className="text-base cursor-pointer font-medium text-blue-500"
          >
            {type === 'sign-in' ? 'Sign up' : 'Sign in'}
          </Link>
        </footer>

        <OAuth />
      </div>
    </div>
  )
}

export default AuthForm