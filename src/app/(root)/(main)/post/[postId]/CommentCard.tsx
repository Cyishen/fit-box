import React, { useState } from 'react'
import { CommentType, ReplyType } from '../DCard'
import { multiFormatDateString } from '@/lib/TimeFn/Timer'
import ReplyCard from './ReplyCard'
import ReplySheet from './ReplySheet'


interface ChatProps {
  commentData: CommentType
}

const CommentCard = ({ commentData }: ChatProps) => {
  const [isReply, setIsReply] = useState(false);
  const { id, gender, userName, content, createdAt, replies, isAnonymous } = commentData;

  const [replyData, setReplyData] = useState<ReplyType[]>(replies || [])
  const [openCommentId, setOpenCommentId] = useState<string | null>(null);

  const addNewReply = (newReply: ReplyType) => {
    const updatedReply = [...replyData as ReplyType[], newReply]
    setReplyData(updatedReply)
  }

  const handleToggleReplay = (id: string) => {
    setOpenCommentId((prev) => (prev === id ? null : id));
  };

  const isOpenReplay = openCommentId === id;
  const displayName = isAnonymous ? '匿名' : userName;

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

      <div className="flex flex-col w-full">
        <h3 className="font-semibold text-[12px] capitalize">
          {displayName}
        </h3>
        <p className="text-gray-700 text-sm mt-1">
          {content.split('\n').map((line, index) => (
            <React.Fragment key={index}>
              {line}
              <br />
            </React.Fragment>
          ))}
        </p>

        <div className="flex items-end mt-2 justify-between">
          <div className="flex">
            <p className="text-gray-400 text-[12px]">{id}<span>・</span></p>
            <p className="text-gray-400 text-[12px]">
              {multiFormatDateString(createdAt.toLocaleDateString())}
            </p>
          </div>

          <button
            className="text-[12px] text-gray-500 px-2 rounded-sm"
            onClick={() => setIsReply(true)}
          >
            <p>回覆</p>
          </button>
        </div>

        {replyData && replyData?.length > 0 && (
          <div className="flex flex-col items-center mt-1 cursor-pointer" >
            <div
              className="flex items-center w-full gap-1"
              onClick={() => handleToggleReplay(id)}
            >
              <hr className='flex w-10' />
              <p className="text-gray-500 text-[12px] font-semibold" >
                查看 {replyData?.length} 留言
              </p>
            </div>

            {isOpenReplay && (
              replyData.map((reply) => (
                <ReplyCard key={reply.id} reply={reply} addNewReply={addNewReply} replyData={replyData} />
              ))
            )}
          </div>
        )}
      </div>

      <ReplySheet
        id={id}
        isOpen={isReply}
        setIsOpen={setIsReply}
        addNewReply={addNewReply}
        replyData={replyData}
      />
    </div>
  )
}

export default CommentCard