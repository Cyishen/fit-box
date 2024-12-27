"use client"

import React, { useEffect, useState } from 'react'
import CardDetail from './CardDetail'
import { generateFakeCardData } from '../PostList'
import { DCardProps } from '../DCard'


const PostContentPage = ({ params }: { params: { postId: string } }) => {
  const { postId } = params
  const [post, setPost] = useState<DCardProps | null>(null)

  useEffect(() => {
    if(postId) {
      const fakeCard = generateFakeCardData()
      const findPost = fakeCard.find(post => post.id === postId)
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