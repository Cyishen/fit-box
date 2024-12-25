import React from 'react'
import PostList from './PostList'
import PostRef from './PostRef'


const PostPage = () => {
  return (
    <section className='flex flex-col bg-white sm:bg-[#f3f2f8] h-full'>
      <PostRef />
      <div className='h-full mx-auto w-full max-w-screen-sm overflow-y-scroll sm:rounded-t-3xl sm:border-[0.5px] custom-scrollbar'>
        <PostList />
      </div>
    </section>
  )
}

export default PostPage