import React from 'react'
import { DCardProps } from '../DCard';

interface CardDetailProps {
  post: DCardProps | null;
}


const CardDetailContent = ({ post }: CardDetailProps) => {
  if (!post) return

  const { content, contentImage, tags } = post

  return (
    <>
      <div className='flex flex-col w-full p-2 sm:p-3 mt-2'>
        <div className='flex flex-col rounded-lg py-1 gap-1'>
          <p className='text-[14px] leading-6'>
            {content.split('\n').map((line, index) => (
              <React.Fragment key={index}>
                {line}
                <br />
              </React.Fragment>
            ))}
          </p>
        </div>
      </div>

      <div className='mt-3 space-y-2'>
        {contentImage && contentImage.length > 0 && (
          contentImage.map((contentImage, index) => (
            <div key={index}>
              <img
                src={contentImage}
                alt='contentImage'
                className='w-full h-full object-cover'
              />
            </div>
          ))
        )}
      </div>

      <div className='flex p-2 sm:p-3 mt-3'>
        {tags && tags.length > 0 && (
          <div className='flex flex-wrap gap-1'>
            {tags?.map((tag, index) => (
              <div
                key={index}
                className='px-2 py-1 rounded-full bg-gray-100'
              >
                <p className='text-[12px]'>{tag}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}

export default CardDetailContent