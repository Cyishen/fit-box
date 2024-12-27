import BottomCommentSheet from '@/components/BottomCommentSheet'
import React from 'react'

type Props = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const CommentSheet = ({ isOpen, setIsOpen }: Props) => {
  return (
    <BottomCommentSheet isOpen={isOpen} onClose={() => setIsOpen(false)}>
      <div className='px-4'>
        <div className='flex items-center w-full gap-2'>
          <div className='flex-1 px-3 py-2 rounded-lg cursor-pointer bg-gray-200 w-full mb-5' >
            <textarea
              name="message"
              required
              rows={3}
              placeholder="留言"
              className="flex w-full focus:outline-none text-sm bg-gray-200"
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = "auto";
                target.style.height = `${target.scrollHeight}px`;
              }}
            />
          </div>
        </div>
      </div>
    </BottomCommentSheet>
  )
}

export default CommentSheet