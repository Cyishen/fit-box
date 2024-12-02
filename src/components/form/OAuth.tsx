import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { signIn, useSession } from "next-auth/react"
import { useRouter } from 'next/navigation'


const OAuth = () => {
  const router = useRouter()
  const { status } = useSession()

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/fit");
    }
  }, [status, router]);

  const handleLogin = async () => {
    setIsLoading(true);
    const result = await signIn('google', { redirect: false }); 
    if (result?.ok) {
      router.replace("/fit");
    }
  };

  return (
    <div>
      <div className="flex flex-row justify-center items-center gap-x-3">
        <div className="flex-1 h-[1px] bg-gray-400" />
        <p className="text-base text-gray-400">或</p>
        <div className="flex-1 h-[1px] bg-gray-400" />
      </div>

      <button
        className="w-full flex justify-center items-center mt-3 py-2 rounded-md bg-gray-100 hover:bg-gray-200 font-bold gap-2"
        onClick={handleLogin}
        disabled={isLoading}
      >
        <Image
          src="/media/google.svg"
          width={25}
          height={25}
          alt="google"
          className={isLoading ? 'opacity-50' : ''} 
        />
        {isLoading ? 'Loading...' : '使用 Google 繼續'}
      </button>
    </div>
  )
}

export default OAuth