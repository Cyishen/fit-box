import React from 'react'
import { CommentType } from '../DCard'
import { multiFormatDateString } from '@/lib/TimeFn/Timer'


interface ChatProps {
  data: CommentType
}

const ChatCard = ({ data }: ChatProps) => {
  const { id, gender, userName, content, createdAt } = data;

  return (
    <div className="flex gap-2">
      <div className="flex w-8 h-8 min-w-8 min-h-8 rounded-full overflow-hidden">
        <div className={`flex items-center justify-center min-w-8 min-h-8 
          ${gender === 'male' ? 'bg-blue-50' : 'bg-pink-50'}`}
        >
          <img
            src={gender === 'male'
              ? '/posts/boy.svg'
              : (gender === 'female'
                ? '/posts/girl.svg'
                : '/posts/baby.svg'
              )}
            alt={gender}
            className="w-full h-full object-fill"
          />
        </div>
      </div>

      <div className='flex flex-col w-full'>
        <h3 className="font-semibold text-[12px] capitalize">
          {userName}
        </h3>
        <p className="text-gray-700 text-sm mt-1">
          {content}
        </p>

        <div className='flex items-end mt-2 justify-between'>
          <div className='flex'>
            <p className="text-gray-400 text-[12px]">{id}<span>・</span></p>
            <p className="text-gray-400 text-[12px]">
              {multiFormatDateString(createdAt.toLocaleDateString())}
            </p>
          </div>

          <p className='text-[12px] text-gray-500 cursor-pointer px-2 rounded-sm'>
            回覆
          </p>
        </div>
      </div>
    </div>
  )
}

export default ChatCard