import React from 'react'
import DCard from './DCard'
import { generateFakeCardData } from '@/constants/post-constants'



const PostList = () => {
  const fakePostData = generateFakeCardData()

  return (
    <div className='flex h-full mx-auto w-full max-w-screen-sm overflow-y-scroll sm:rounded-3xl sm:border-[0.5px] custom-scrollbar mb-16 sm:mb-[76px]'>
      <div className='flex flex-col w-full sm:rounded-t-3xl'>
        {fakePostData.map((data) => (
          <div key={data.id}>
            <DCard {...data} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default PostList