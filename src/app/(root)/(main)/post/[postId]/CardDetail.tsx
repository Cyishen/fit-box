import { ChevronLeft, Ellipsis } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React from 'react'
import { DCardProps } from '../DCard'

import CardDetailTop from './CardDetailTop'
import CardDetailContent from './CardDetailContent'
import CardDetailProfileCard from './CardDetailProfileCard'
import CardDetailLike from './CardDetailLike'
import CardDetailChat from './CardDetailChat'


interface CardDetailProps {
  post: DCardProps | null;
}


const CardDetail = ({ post }: CardDetailProps) => {
  const router = useRouter()

  if (!post) return


  return (
    <div className='flex flex-col h-full mx-auto w-full max-w-screen-sm overflow-y-scroll sm:rounded-3xl sm:border-[0.5px] custom-scrollbar sm:mt-[60px] pb-20 bg-white'>
      <div className='sticky top-0 flex items-center justify-between bg-white p-2 sm:p-3'>
        <div
          onClick={() => router.back()}
          className='p-2 rounded-full cursor-pointer bg-gray-100'
        >
          <ChevronLeft size={16} />
        </div>

        <div
          className='p-2 rounded-full cursor-pointer'
        >
          <Ellipsis size={16} />
        </div>
      </div>

      <CardDetailTop post={post} />
      <CardDetailContent post={post} />
      <CardDetailProfileCard post={post} />
      <CardDetailLike post={post}/>
      <CardDetailChat post={post}/>
    </div>
  )
}

export default CardDetail