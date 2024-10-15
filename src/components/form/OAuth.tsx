import Image from 'next/image'
import React from 'react'


const OAuth = () => {
  return (
    <div>
      <div className="flex flex-row justify-center items-center gap-x-3">
        <div className="flex-1 h-[1px] bg-gray-400" />
        <p className="text-base text-gray-400">或</p>
        <div className="flex-1 h-[1px] bg-gray-400" />
      </div>

      <button
        className="w-full flex justify-center items-center mt-5 py-2 rounded-md bg-gray-100 hover:bg-gray-200 font-bold gap-2"
        onClick={() => console.log('use Google')}
      >
        <Image
          src="/media/google.svg"
          width={25}
          height={25}
          alt="google"
        />
        使用 Google 繼續
      </button>
    </div>
  )
}

export default OAuth