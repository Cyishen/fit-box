import React from 'react'
import PostCard from './PostCard'


const PostList = () => {
  return (
    <div className='flex h-full mx-auto w-full max-w-screen-sm overflow-y-scroll sm:rounded-t-3xl sm:border-[0.5px] custom-scrollbar'>
      <div className='flex flex-col w-full sm:rounded-t-3xl'>
        {Array.from({ length: 10 }).map((_, index) => (
          <div key={index}>
            <PostCard />
          </div>
        ))}
      </div>
    </div>
  )
}

export default PostList