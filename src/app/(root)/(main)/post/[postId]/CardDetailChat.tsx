import React from 'react'
import { DCardProps } from '../DCard';
import ChatCard from './ChatCard';

interface CardDetailProps {
  post: DCardProps | null;
}

const CardDetailChat = ({ post }: CardDetailProps) => {
  if (!post) return
  const { comments } = post

  return (
    <div className='flex flex-col h-dvh bg-gray-200'>
      <div className='mt-5 px-2 sm:px-3'>
        <p className='text-[14px]'>留言</p>
      </div>

      <div className='mt-1 px-2 sm:px-3 py-3 bg-white'>
        {comments.map((data) => (
          <div key={data.id} className='flex flex-col py-2 border-b'>
            <ChatCard data={data}/>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CardDetailChat