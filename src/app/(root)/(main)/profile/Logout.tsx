"use client"

import React from 'react'
import { useSession, signOut } from "next-auth/react"
import { Button } from '@/components/ui/button'


const Logout = () => {
  const { data: session, status } = useSession()

  const handleLogout = async () => {
    if (status === "authenticated") {
      await signOut()
    }
  };

  return (
    <>
      {session?.user &&
        <div className='flex flex-col bg-white mt-5 px-3 py-2 rounded-lg'>
          <div className='flex items-center w-full'>
            <Button onClick={handleLogout} variant='ghost' size='sm' className='w-full hover:bg-slate-100 hover:text-[#FF3B30]'>
              登出
            </Button>
          </div>
        </div>
      }
    </>
  )
}

export default Logout