import React from 'react'
// import PostCard from './PostCard'
import DCard from './DCard'


const PostList = () => {
  return (
    <div className='flex h-full mx-auto w-full max-w-screen-sm overflow-y-scroll sm:rounded-3xl sm:border-[0.5px] custom-scrollbar mb-16 sm:mb-[76px]'>
      <div className='flex flex-col w-full sm:rounded-t-3xl'>
        {Array.from({ length: 10 }).map((_, index) => (
          <div key={index}>
            {/* <PostCard /> */}
            <DCard />
          </div>
        ))}
      </div>
    </div>
  )
}

export default PostList