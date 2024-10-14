import Link from 'next/link'
import React, { useState } from 'react'
// import { useRouter } from 'next/navigation'

import { Form } from "@/components/ui/form"
import { Button } from '../ui/button'
import { Loader } from 'lucide-react';

import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { authFormSchema } from '@/lib/utils'
import CustomInput from './CustomInput'

// import { signIn, signUp } from '@/lib/actions/user.actions'


const AuthForm = ({ type }: { type: string }) => {
  const [isLoading, setIsLoading] = useState(false);
  // const router = useRouter();

  const formSchema = authFormSchema(type);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  //TODO: 連結資料庫
  const onSubmit = async () => {
    setIsLoading(true)

    // try {
    //   if(type === 'sign-up') {
    //     const userData = {
    //       userName: data.userName!,
    //       email: data.email,
    //       password: data.password
    //     }

    //     const newUser = await signUp(userData)

    //     setUser(newUser)
    //   }

    //   if(type === 'sign-in') {
    //     const response = await signIn({
    //       email: data.email,
    //       password: data.password,
    //     })

    //     if(response) router.push('/fit')
    //   }

    // } catch (error) {
    //   console.log(error)
    // } finally {
    //   setIsLoading(false)
    // }
  }

  return (
    <section className="flex min-h-screen w-full px-4 sm:max-w-[490px] flex-col justify-center gap-5 md:gap-8">
      <header className='flex flex-col gap-5 md:gap-8'>
        <Link href="/" className="cursor-pointer flex items-center gap-1">
          <h1 className="text-3xl font-bold">FitBox</h1>
        </Link>
      </header>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {type === 'sign-up' && (
            <>
              <div className="flex">
                <CustomInput
                  id='userName'
                  control={form.control}
                  name='userName'
                  label="UserName"
                  placeholder='username'
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
          />

          <CustomInput
            id='password'
            control={form.control}
            name='password'
            label="Password"
            placeholder='password'
          />

          <div className="flex flex-col gap-4">
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
        <Link href={type === 'sign-in' ? '/sign-up' : '/sign-in'} className="text-base cursor-pointer font-medium text-blue-400">
          {type === 'sign-in' ? 'Sign up' : 'Sign in'}
        </Link>
      </footer>
    </section>
  )
}

export default AuthForm