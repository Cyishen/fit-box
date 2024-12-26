import React, { useState } from 'react'
import { DCardProps } from '../DCard';
import { Bookmark, Heart, MessageCircle } from 'lucide-react';

interface CardDetailProps {
  post: DCardProps | null;
}

const CardDetailLike = ({ post }: CardDetailProps) => {
  if (!post) return null
  const { like, comment, bookmark } = post

  const [likeCount, setLikeCount] = useState(like);
  const [isLiked, setIsLiked] = useState(false)
  const [saveCount, setSaveCount] = useState(bookmark);
  const [isSaved, setIsSaved] = useState(false)

  const handleLike = () => {
    if (!isLiked) {
      setLikeCount((prev) => prev + 1);
    } else {
      setLikeCount((prev) => Math.max(prev - 1, 0));
    }
    setIsLiked(!isLiked);
  };

  const handleSave = () => {
    if(!isSaved) {
      setSaveCount((prev) => prev + 1)
    } else {
      setSaveCount((prev) => Math.max(prev - 1, 0));
    }
    setIsSaved(!isSaved)
  }

  return (
    <div className='flex items-center h-10 w-full px-2 sm:px-3 mt-3'>
      <div className='flex py-2 w-full justify-between'>
        <div className="flex gap-5 text-[12px]">
          <div className="flex items-center gap-1">
            <Heart size={18} fill='#f87171' stroke='#f87171' />
            <p>{likeCount}</p>
          </div>

          <div className="flex items-center gap-1">
            <MessageCircle size={18} className='transform -scale-x-100' />
            <p>{comment}</p>
          </div>

          <div className="flex items-center gap-1">
            <Bookmark size={18} fill='#f3f3f3' />
            <p>{saveCount}</p>
          </div>
        </div>
      </div>

      <div className='flex gap-5'>
        <div className="flex items-center gap-1 cursor-pointer" onClick={handleLike}>
          {!isLiked ? (
            <Heart size={24} fill='#d1d5db' stroke='#d1d5db' />
          ) : (
            <Heart size={24} fill='#f87171' stroke='#f87171' />
          )}
        </div>

        <div className="flex items-center gap-1 cursor-pointer" onClick={handleSave}>
          {!isSaved ? (
            <Bookmark size={24} fill='#d1d5db' stroke='#d1d5db' />
          ) : (
            <Bookmark size={24} fill='#38CDFF' stroke='#38CDFF' />
          )}
        </div>
      </div>
    </div>
  )
}

export default CardDetailLike