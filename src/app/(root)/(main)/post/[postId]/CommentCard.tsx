import React, { useState } from 'react'
import { CommentType } from '../DCard'
import { multiFormatDateString } from '@/lib/TimeFn/Timer'


interface ChatProps {
  data: CommentType
}

const CommentCard = ({ data }: ChatProps) => {
  const { id, gender, userName, content, createdAt, replays } = data;

  const [openCommentId, setOpenCommentId] = useState<string | null>(null);
  const handleToggleExercise = (id: string) => {
    setOpenCommentId((prev) => (prev === id ? null : id));
  };

  const isOpen = openCommentId === id;

  return (
    <div className={`flex gap-2 ${isOpen ? 'h-full' : 'h-fit'}`}>
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
          {userName}
        </h3>
        <p className="text-gray-700 text-sm mt-1">
          {content}
        </p>

        <div className="flex items-end mt-2 justify-between">
          <div className="flex">
            <p className="text-gray-400 text-[12px]">{id}<span>・</span></p>
            <p className="text-gray-400 text-[12px]">
              {multiFormatDateString(createdAt.toLocaleDateString())}
            </p>
          </div>

          <p className="text-[12px] text-gray-500 cursor-pointer px-2 rounded-sm">
            回覆
          </p>
        </div>

        {replays && replays?.length > 0 && (
          <div
            className="flex flex-col items-center mt-1 cursor-pointer"
            onClick={() => handleToggleExercise(id)}
          >
            <div className="flex items-center w-full gap-1">
              <hr className='flex w-10' />
              <p className="text-gray-500 text-[12px] font-semibold" >
                查看 {replays?.length} 留言
              </p>
            </div>

            {isOpen && replays && replays?.length > 0 && (
              replays.map((replay) => (
                <div key={replay.id} className='flex flex-col w-full mt-1'>
                  <div className={`flex gap-2`}>
                    <div className="flex w-8 h-8 min-w-8 min-h-8 rounded-full overflow-hidden">
                      <div className={`flex items-center justify-center min-w-8 min-h-8 ${replay.gender === 'male' ? 'bg-blue-50' : 'bg-pink-50'}`}
                      >
                        <img
                          src={replay.gender === 'male'
                            ? '/posts/boy.svg'
                            : (replay.gender === 'female'
                              ? '/posts/girl.svg'
                              : '/posts/baby.svg'
                            )}
                          alt={replay.gender}
                          className="w-full h-full object-fill"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col w-full">
                      <h3 className="font-semibold text-[12px] capitalize">
                        {replay.userName}
                      </h3>
                      <p className="text-gray-700 text-sm mt-1">
                        {replay.content}
                      </p>

                      <div className="flex items-end mt-2 justify-between">
                        <div className="flex">
                          <p className="text-gray-400 text-[12px]">{replay.id}<span>・</span></p>
                          <p className="text-gray-400 text-[12px]">
                            {multiFormatDateString(replay.createdAt.toLocaleDateString())}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}


      </div>
    </div>
  )
}

export default CommentCard