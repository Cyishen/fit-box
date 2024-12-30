import BottomCommentSheet from '@/components/BottomCommentSheet'
import React, { useEffect, useRef, useState } from 'react'
import { Sticker, Image } from 'lucide-react';

type Props = {
  id?: string;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const ReplySheet = ({ isOpen, setIsOpen, id }: Props) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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

          <div className='flex px-10 py-2 rounded-lg cursor-pointer w-full mt-3' >
            <textarea
              ref={textareaRef}
              name="message"
              required
              rows={1}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="回覆..."
              className="flex w-full focus:outline-none text-sm bg-white"
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
              <button className='flex px-3 rounded-sm text-sm border'>
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