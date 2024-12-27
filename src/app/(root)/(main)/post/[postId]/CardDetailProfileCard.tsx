import React from 'react'
import { DCardProps } from '../DCard';

interface CardDetailProps {
  post: DCardProps | null;
}


const CardDetailProfileCard = ({ post }: CardDetailProps) => {
  if (!post) return

  const { isAnonymous, userName, gender } = post

  return (
    <div className='py-1'>
      {!isAnonymous && (
        <div className='flex w-full px-2 sm:px-3 group'>
          <div className='flex border p-3 w-full rounded-lg h-20 gap-2 group-hover:bg-gray-50 cursor-pointer '>
            <div className="flex min-w-fit rounded-full shadow-md overflow-hidden">
              <div className="flex w-full h-full mt-0">
                <img
                  src={gender === 'male'
                    ? '/posts/boy.svg'
                    : (gender === 'female'
                      ? '/posts/girl.svg'
                      : '/posts/baby.svg'
                    )}
                  alt={gender}
                  className={`w-full h-full object-cover overflow-hidden 
                    ${gender === 'male' ? 'group-hover:bg-blue-200' : 'group-hover:bg-pink-200'}`}
                />
              </div>
            </div>

            <div className='flex flex-col justify-center'>
              <p className='text-[12px] capitalize font-semibold'>{userName}</p>
              <p className='text-[12px] text-gray-400'>14 篇文章 ｜ 101 人追蹤</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CardDetailProfileCard