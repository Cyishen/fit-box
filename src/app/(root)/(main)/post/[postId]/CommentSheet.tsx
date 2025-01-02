import BottomCommentSheet from '@/components/BottomCommentSheet'
import React, { ChangeEvent, useState } from 'react'
import { Sticker, Image } from 'lucide-react';
import { CommentType } from '../DCard';


type Props = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  addNewComment: (newComment: CommentType) => void;
  commentData: CommentType[]
}

const CommentSheet = ({ isOpen, setIsOpen, addNewComment, commentData }: Props) => {
  const [message, setMessage] = useState('');

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target;
    setMessage(value);
  };

  const handleSubmit = () => {
    if (!message.trim()) return;

    const newCommentData: CommentType = {
      id: `B${commentData.length + 1}`, 
      userId: 'a1',
      userName: 'User',  
      userImage: '',
      isAnonymous: false,
      gender: 'male',       
      content: message,  
      createdAt: new Date(),
      updatedAt: new Date(),
      replies: []
    };

    addNewComment(newCommentData);

    setMessage('');
    setIsOpen(false);
  };

  return (
    <BottomCommentSheet isOpen={isOpen} onClose={() => setIsOpen(false)}>
      <div className='flex flex-col px-4 py-2'>
        <div className='rounded-lg'>
          <div className='flex gap-2 items-center'>
            <div className="flex w-8 h-8 min-w-8 min-h-8 rounded-full overflow-hidden">
              <div className={`flex items-center justify-center min-w-8 min-h-8 bg-gray-100`}
              >
                U
              </div>
            </div>
            <div>
              <p className='text-sm'>User</p>
            </div>
          </div>

          <div className='flex px-10 py-2 rounded-lg cursor-pointer w-full mt-2 bg-gray-50' >
            <textarea
              name="message"
              required
              rows={1}
              value={message}
              onChange={handleChange}
              placeholder="留言..."
              className="flex w-full focus:outline-none text-sm p-1 rounded-sm"
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = "auto";
                target.style.height = `${target.scrollHeight}px`;
              }}
            />
          </div>

          <div className='flex items-center justify-between mt-3'>
            <div className='flex gap-5'>
              <div className='cursor-pointer text-gray-400'>
                <Sticker />
              </div>
              <div className='cursor-pointer text-gray-400'>
                {/* eslint-disable-next-line jsx-a11y/alt-text */}
                <Image />
              </div>
            </div>
            <div>
              <button className='px-3 py-0 rounded-lg text-sm' onClick={handleSubmit}>
                送出
              </button>
            </div>
          </div>
        </div>
      </div>
    </BottomCommentSheet>
  )
}

export default CommentSheet