import Link from 'next/link'
import React from 'react'
import { ChevronLeft } from 'lucide-react';

const AuthError = () => {
  return (
    <div className="flex justify-center size-full">
    <div className="flex min-h-screen w-full px-4 sm:max-w-[490px] flex-col justify-center gap-3 md:gap-8">
      <header>
        <Link href="/sign-in" className="flex items-center cursor-pointer hover:text-blue-500">
          <ChevronLeft size={20} />
          <h1 className="text-2xl sm:text-3xl font-extrabold">返回</h1>
        </Link>
      </header>

      <div className='flex items-center justify-center'>
        <h1>Opp! 郵件重複</h1>
      </div>
    </div>
  </div>
  )
}

export default AuthError