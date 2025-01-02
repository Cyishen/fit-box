import BottomCommentSheet from '@/components/BottomCommentSheet'
import React, { ChangeEvent, useEffect, useRef, useState } from 'react'
import { Sticker, Image } from 'lucide-react';
import { ReplyType } from '../DCard';

type Props = {
  id?: string;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  addNewReply: (newReply: ReplyType) => void;
  replyData: ReplyType[]
}

const ReplySheet = ({ isOpen, setIsOpen, id, addNewReply, replyData }: Props) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target;
    setMessage(value);
  };

  useEffect(() => {
    if (id) {
      setMessage(`${id} `);
    }
  }, [id]);

  useEffect(() => {
    if (isOpen && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isOpen]);

  const newId = id?.split('-')?.[0] || '';

  const handleSubmit = () => {
    if (!message.trim()) return;

    const newReply: ReplyType = {
      id: `${newId}-${replyData.length + 1}`, 
      userId: 'a1',
      userName: 'User',  
      userImage: '',
      isAnonymous: false,
      gender: 'male',       
      content: message,  
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    addNewReply(newReply);

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
              ref={textareaRef}
              name="message"
              required
              rows={1}
              value={message}
              onChange={handleChange}
              placeholder="回覆..."
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
              <button className='flex px-3 rounded-sm text-sm border' onClick={handleSubmit}>
                送出
              </button>
            </div>
          </div>
        </div>
      </div>
    </BottomCommentSheet>
  )
}

export default ReplySheet