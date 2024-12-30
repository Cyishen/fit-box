import { multiFormatDateString } from '@/lib/TimeFn/Timer'
import React, { useState } from 'react'
import { ReplyType } from '../DCard'
import ReplySheet from './ReplySheet'


type Props = {
  reply: ReplyType
}

const ReplyCard = ({ reply }: Props) => {
  const [isReply, setIsReply] = useState(false);
  const [replyId, setReplyId] = useState<string | null>(null);

  const handleReplyClick = (id: string) => {
    setIsReply(true);
    setReplyId(id);
  };

  const displayName = reply.isAnonymous ? '匿名' : reply.userName;

  return (
    <div className='flex flex-col w-full mt-1'>
      <div className={`flex gap-2`}>
        <div className="flex w-8 h-8 min-w-8 min-h-8 rounded-full overflow-hidden">
          <div className={`flex items-center justify-center min-w-8 min-h-8 ${reply.gender === 'male' ? 'bg-blue-50' : 'bg-pink-50'}`}
          >
            <img
              src={reply.gender === 'male'
                ? '/posts/boy.svg'
                : (reply.gender === 'female'
                  ? '/posts/girl.svg'
                  : '/posts/baby.svg'
                )}
              alt={reply.gender}
              className="w-full h-full object-fill"
            />
          </div>
        </div>

        <div className="flex flex-col w-full">
          <h3 className="font-semibold text-[12px] capitalize">
            {displayName}
          </h3>
          <p className="text-gray-700 text-sm mt-1">
            {reply.content}
          </p>

          <div className="flex mt-2">
            <div className="flex">
              <p className="text-gray-400 text-[12px]">{reply.id}<span>・</span></p>
              <p className="text-gray-400 text-[12px]">
                {multiFormatDateString(reply.createdAt.toLocaleDateString())}
              </p>

              <button
                className="text-[12px] text-gray-500 px-2 rounded-sm"
                onClick={() => handleReplyClick(reply.id)}
              >
                回覆
              </button>
            </div>
          </div>
        </div>

        {isReply && replyId && (
          <ReplySheet
            isOpen={isReply}
            setIsOpen={setIsReply}
            id={replyId}
          />
        )}
      </div>
    </div>
  )
}

export default ReplyCard