import React, { useState } from 'react'
import { DCardProps } from '../DCard';
import CommentCard from './CommentCard';

import CommentSheet from './CommentSheet';



interface CardDetailProps {
  post: DCardProps | null;
}

const CardDetailCommentList = ({ post }: CardDetailProps) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!post) return
  const { comments } = post

  return (
    <div className='flex flex-col h-full bg-gray-200'>
      <div className='mt-5 px-2 sm:px-3'>
        <p className='text-[14px]'>留言</p>
      </div>

      <div className='mt-1 px-2 sm:px-3 py-3 bg-white'>
        {comments?.map((comment) => (
          <div key={comment.id} className='flex flex-col py-2 border-b'>
            <CommentCard commentData={comment} setIsOpen={setIsOpen}/>
          </div>
        ))}
      </div>

      <div className='sticky bottom-0 flex items-center z-20 bg-white p-2 sm:p-3'>
        <div className='flex items-center w-full gap-2'>
          <div className='flex-1 px-3 py-1 rounded-full cursor-pointer bg-gray-100 w-full' >
            <input
              placeholder='留言'
              className="text-base placeholder:text-sm placeholder:text-gray-400 bg-gray-100 outline-none"
              type={'text'}
              onClick={() => setIsOpen(true)}
            />
          </div>
        </div>
      </div>

      <CommentSheet
        isOpen={isOpen}
        setIsOpen={setIsOpen} 
      />
    </div>
  )
}

export default CardDetailCommentList