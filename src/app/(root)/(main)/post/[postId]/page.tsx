"use client"

import React, { useEffect, useState } from 'react'
import CardDetail from './CardDetail'
import { FakeCardData } from '../PostList'
import { DCardProps } from '../DCard'


const PostContentPage = ({ params }: { params: { postId: string } }) => {
  const { postId } = params
  const [post, setPost] = useState<DCardProps | null>(null)

  useEffect(() => {
    if(postId) {
      const findPost = FakeCardData.find(post => post.id === postId)
      setPost(findPost || null)
    }
  }, [postId])

  return (
    <section className='flex flex-col bg-white sm:bg-[#f3f2f8] h-dvh relative'>
      <CardDetail post={post}/>
    </section>
  )
}

export default PostContentPage