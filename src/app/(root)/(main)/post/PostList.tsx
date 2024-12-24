import React from 'react'
import PostCard from './PostCard'


const PostList = () => {
  return (
    <div className='flex flex-col w-full sm:rounded-t-3xl'>
      <div className='flex sm:hidden'>
        <div className='flex flex-col justify-center w-full min-h-[60px] bg-white border-b'>
          <div className='p-2'>
            <h2 className='font-bold'>推薦</h2>
          </div>
        </div>
      </div>

      {Array.from({ length: 10 }).map((_, index) => (
        <div key={index}>
          <PostCard />
        </div>
      ))}
    </div>
  )
}

export default PostList