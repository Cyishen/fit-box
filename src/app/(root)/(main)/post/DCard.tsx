"use client"

import React from 'react'
import { Heart, MessageCircle, Bookmark, Ellipsis } from 'lucide-react'
import Link from 'next/link';
import { postMultiFormatDateString } from '@/lib/TimeFn/Timer';

export type ReplyType = {
  id: string,
  userId: string,
  userName: string,
  userImage?: string,
  isAnonymous: boolean;
  gender?: 'male' | 'female';
  content: string,
  createdAt: Date | string,
  updatedAt: Date,
}

export type CommentType = {
  id: string,
  userId: string,
  userName: string,
  userImage?: string,
  isAnonymous: boolean;
  gender?: 'male' | 'female';
  content: string,
  createdAt: Date | string,
  updatedAt: Date,
  replies?: ReplyType[]
}

export interface DCardProps {
  id: string;
  userId: string;
  userName: string;
  userImage?: string;
  isAnonymous: boolean;
  gender?: 'male' | 'female';
  title: string;
  content: string;
  contentImage: string[];
  like: number;
  bookmark: number;
  createdAt: Date | string;
  updatedAt: Date;
  tags?: string[];
  comments?: CommentType[]
}

const DCard = (props: DCardProps) => {
  const { userName, isAnonymous, title, content, contentImage, like, bookmark, gender, comments, createdAt } = props

  const displayName = isAnonymous ? '匿名' : userName;
  const timeChange = typeof createdAt === 'string'
    ? createdAt 
    : createdAt instanceof Date ? createdAt.toLocaleString() : new Date().toLocaleString();

  return (
    <Link
      href={`/post/${props.id}`}
      className="flex flex-col w-full h-full py-3 border-b-[0.5px] bg-white hover:bg-gray-50"
    >
      <div className="flex flex-col w-full">
        <div className="flex flex-col px-3 sm:px-6">
          <div className="flex gap-2 py-0">
            <div className="flex items-center justify-center w-5 h-5 min-w-5 min-h-5 ring-offset-1 ring-[0.5px] ring-gray-500 rounded-full overflow-hidden">
              <div className={`flex items-center justify-center min-w-5 min-h-5
                ${gender === 'male' ? 'bg-blue-100' : 'bg-pink-100'}`}>
                <img
                  src={gender === 'male'
                    ? '/posts/boy.svg'
                    : (gender === 'female'
                      ? '/posts/girl.svg'
                      : '/posts/baby.svg'
                    )}
                  alt="gender"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="flex w-full">
              <div className="flex justify-between w-full">
                <div className="flex gap-2">
                  <p className="text-[12px] font-bold capitalize">{displayName}</p>
                  <p className="text-gray-400 text-[12px]">
                    {postMultiFormatDateString(timeChange)}
                  </p>
                </div>
                <div className="flex justify-end rounded-full w-5 h-5 overflow-hidden cursor-pointer">
                  <div className='flex justify-center items-center w-5 h-5 hover:bg-gray-100'>
                    <Ellipsis size={14} className="text-gray-500" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col mt-3 gap-1 px-3 sm:px-6 max-h-20 min-h-20">
          <div className='flex justify-between gap-1'>
            <div className='flex flex-col'>
              <div className="flex flex-col">
                <p className="text-base line-clamp-1 font-bold">{title}</p>
                <p className="text-sm line-clamp-1">{content}</p>
              </div>

              <div className={`flex gap-5  text-[10px] ${contentImage.length > 0 ? 'mt-auto' : 'mt-3'}`}>
                <div className="flex items-center gap-1">
                  <Heart size={16} fill='#f87171' stroke='#f87171' />
                  <p>{like}</p>
                </div>

                <div className="flex items-center gap-1">
                  <MessageCircle size={16} className='transform -scale-x-100' />
                  <p>{comments?.length}</p>
                </div>

                <div className="flex items-center gap-1">
                  <Bookmark size={16} fill='#f3f3f3' />
                  <p>{bookmark}</p>
                </div>
              </div>
            </div>

            {contentImage.length > 0 && (
              <div className="h-20 min-w-20 max-w-20 bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={contentImage.length > 0 ? contentImage[0] : ''}
                  alt="setting"
                  className='w-full h-full object-cover'
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}

export default DCard