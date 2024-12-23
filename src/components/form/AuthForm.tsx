import Link from 'next/link'
import React, { useState } from 'react'

import { Form } from "@/components/ui/form"
import { Button } from '../ui/button'
import { Loader, ChevronLeft } from 'lucide-react';

import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { authFormSchema } from '@/lib/utils'
import CustomInput from './CustomInput'

import OAuth from './OAuth';

import { loginAuth, signUpAuth } from '@/actions/user-actions';
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from 'next/navigation';


const AuthForm = ({ type }: { type: string }) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();



  const searchParams = useSearchParams();
  const urlError = searchParams.get('error') === 'OAuthAccountNotLinked' ? "Email already in use" : "";

  const { update } = useSession();

  const formSchema = authFormSchema(type);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: type === 'sign-up' ? '' : undefined,
      email: '',
      password: '',
    },
  })


  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true);

    if (type === 'sign-up') {
      const result = await signUpAuth(data);
      if (result.success) {
        router.push('/sign-in');
      } else {
        alert(result.error);
      }
    }

    if (type === 'sign-in') {
      const result = await loginAuth(data);
      if (result.success) {
        await update();

        router.push('/fit');
      } else {
        alert(result.error);
      }
    }
    // todo* 客戶端登入
    // if (type === 'sign-in') {
    //   try {
    //     const result = await signIn('credentials', {
    //       email: data.email,
    //       password: data.password,
    //       redirect: false,
    //     })

    //     if (result?.error) {
    //       alert('帳號或密碼錯誤')
    //     } else {
    //       alert('登入成功')
    //       router.push('/fit')
    //     }
    //   } catch (error) {
    //     console.error("授權過程中出錯:", error)
    //   }
    // }
  }

  return (
    <div className="flex justify-center size-full h-dvh">
      <div className="flex flex-col w-full px-4 sm:max-w-[490px] gap-3 md:gap-8">
        <header className='mt-10 md:mt-20'>
          <Link href="/" className="flex items-center cursor-pointer hover:text-blue-500">
            <ChevronLeft size={20} />
            <h1 className="text-2xl sm:text-3xl font-extrabold">FitBox 運動盒</h1>
          </Link>

          <div className='flex w-full mt-4'>
            <AnimatedTabsHover
              onChange={(tab) => {
                router.push(tab === '登入' ? '/sign-in' : '/sign-up');
              }}
              activeTab={type === 'sign-in' ? '登入' : '註冊'}
            />
          </div>
        </header>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-1">
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

            <div className="flex flex-col pt-2">
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
        {urlError && <p className="text-sm text-red-500">{urlError}</p>}

        {/* 其他方式登入 */}
        <OAuth />
      </div>
    </div>
  )
}

export default AuthForm


interface AnimatedTabsHoverProps {
  activeTab: '登入' | '註冊'
  onChange: (tab: '登入' | '註冊') => void;
}

function AnimatedTabsHover({ activeTab, onChange }: AnimatedTabsHoverProps) {
  const TABS = [
    { label: '登入' },
    { label: '註冊' },
  ];

  return (
    <div className='flex space-x-2 p-1 bg-slate-200 rounded-lg w-full'>
      <div
        defaultValue={activeTab}
        className='flex rounded-lg bg-opacity-80 w-full'
      >
        {TABS.map((tab) => (
          <Link
            href={tab.label === '登入' ? '/sign-in' : '/sign-up'}
            key={tab.label}
            data-id={tab.label}
            onClick={() => onChange(tab.label as '登入' | '註冊')}
            className={`inline-flex h-8 w-full items-center justify-center transition-colors duration-100 z-10 ${activeTab === tab.label ? 'text-black bg-white rounded-lg' : 'text-gray-500'}`}
          >
            <p className='flex items-center justify-center text-sm'>
              <span>{tab.label}</span>
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}