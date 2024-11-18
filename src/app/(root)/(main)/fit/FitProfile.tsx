"use client"

import { Button } from '@/components/ui/button';
import Link from 'next/link';

import { useSession, signOut } from "next-auth/react"
import Image from 'next/image';


const FitProfile = () => {
  const { data: session, status } = useSession()

  // OAuth for google
  const googleImage = session?.user?.image;

  const handleLogout = async () => {
    if (status === "authenticated") {
      await signOut()
    }
  };

  return (
    <div className='flex items-center p-3 whitespace-nowrap'>
      <div className='flex w-full'>
        <div
          className='min-w-[50px] min-h-[50px] rounded-full border border-gray-500 flex justify-center items-center'
        >
          <div className='w-full h-full flex justify-center items-center'>
            {session?.user.image ? (
              <Image
                src={googleImage || "/icons/dumbbell.svg"}
                width={46}
                height={46}
                alt="google user"
                className='rounded-full object-contain'
              />
            ) : (
              <p className='rounded-full w-[46px] h-[46px] flex justify-center items-center bg-black text-white text-xl capitalize'>
                {typeof session?.user?.name === 'string' ? session.user.name[0] : 'U'}
              </p>
            )}
          </div>
        </div>

        <div className='w-full flex flex-col justify-center font-bold'>
          {status === "authenticated" ? (
            <div className='flex justify-between pl-3'>
              <div className='text-sm'>
                <p className='capitalize'>{session?.user?.name}</p>
                <p className='text-[10px]'>{session?.user?.email}</p>
              </div>

              {/* TODO: 測試用, 實際要刪除 */}
              <div className='flex items-center'>
                <Button onClick={handleLogout} variant='outline' size='sm'>登出</Button>
              </div>
            </div>
          ) : (
            <div className='flex justify-between items-center pl-3'>
              <div className='text-sm'>
                <p className='capitalize'>Guest</p>
              </div>
              <Link href="/sign-in">
                <Button variant='outline' size='sm'>登入</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default FitProfile