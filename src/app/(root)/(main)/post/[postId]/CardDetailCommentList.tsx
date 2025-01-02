import React, { useState } from 'react'
import { CommentType, DCardProps } from '../DCard';
import CommentCard from './CommentCard';

import CommentSheet from './CommentSheet';


interface CardDetailProps {
  post: DCardProps | null;
}

const CardDetailCommentList = ({ post }: CardDetailProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const [commentData, setCommentData] = useState<CommentType[]>(post?.comments || []);

  if (!post) return

  const addNewComment = (newComment: CommentType) => {
    const updatedComments = [...commentData as CommentType[], newComment]
    setCommentData(updatedComments)
  }

  return (
    <div className='flex flex-col h-full bg-gray-200'>
      <div className='mt-5 px-2 sm:px-3'>
        <p className='text-[14px]'>留言</p>
      </div>

      <div className='mt-1 px-2 sm:px-3 py-3 bg-white'>
        {commentData?.map((comment) => (
          <div key={comment.id} className='flex flex-col py-2 border-b'>
            <CommentCard commentData={comment} />
          </div>
        ))}
      </div>

      <div className='sticky bottom-0 flex items-center z-20 bg-white p-2 sm:p-3'>
        <div className='flex items-center w-full gap-2'>
          <div className='flex-1 px-3 py-1 rounded-full cursor-pointer bg-gray-100 w-full' >
            <button
              className='flex justify-start text-gray-400 text-sm w-full'
              onClick={() => setIsOpen(true)}
            >
              我要說 ...
            </button>
          </div>
        </div>
      </div>

      <CommentSheet
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        commentData={commentData}
        addNewComment={addNewComment}
      />
    </div>
  )
}

export default CardDetailCommentList