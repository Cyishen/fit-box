import React from 'react'
import PostList from './PostList'
import PostRef from './PostRef'


const PostPage = () => {
  return (
    <section className='flex flex-col bg-white sm:bg-[#f3f2f8] h-full relative'>
      <PostRef />
      <PostList />
    </section>
  )
}

export default PostPage