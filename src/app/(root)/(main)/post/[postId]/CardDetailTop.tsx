import React, { useState } from 'react'
import { DCardProps } from '../DCard';
import { multiFormatDateString } from '@/lib/TimeFn/Timer';

interface CardDetailProps {
  post: DCardProps | null;
}


const CardDetailTop = ({ post }: CardDetailProps) => {
  const [followed, setFollowed] = useState(false)

  if (!post) return

  const { title, gender, userName, isAnonymous, createdAt } = post
  const displayName = isAnonymous ? '匿名' : userName;

  const handleFollow = () => {
    setFollowed(!followed)
  }


  return (
    <div className='flex flex-col w-full p-2 sm:p-3 mt-0'>
      <div>
        <h1 className='text-xl font-semibold line-clamp-2'>{title}</h1>
      </div>

      <div className='mt-3 flex gap-2 items-center no-select'>
        <div className="flex w-8 h-8 min-w-8 min-h-8 ring-offset-1 ring-[0.5px] ring-gray-500 rounded-full overflow-hidden">
          <div className={`flex items-center justify-center min-w-8 min-h-8 bg-gray-100
            ${gender === 'male' ? 'bg-blue-100' : 'bg-pink-100'}`}>
            <img
              src={gender === 'male'
                ? '/posts/boy.svg'
                : (gender === 'female'
                  ? '/posts/girl.svg'
                  : '/posts/baby.svg'
                )}
              alt={gender}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className='flex flex-col'>
          <p className='text-[12px] capitalize font-semibold'>{displayName}</p>
          <p className='text-[12px] text-gray-400'>{multiFormatDateString(createdAt.toLocaleDateString())}</p>
        </div>

        {!isAnonymous && (
          <div className='flex items-start cursor-pointer' onClick={handleFollow}>
            <div className=''>
              {followed ? (
                <p className='text-[12px] text-gray-400'>追蹤中</p>
              ) : (
                <p className={`text-[12px] 
                ${gender === 'male' ? 'text-blue-400' : 'text-pink-400'}`}
                >
                  追蹤
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CardDetailTop