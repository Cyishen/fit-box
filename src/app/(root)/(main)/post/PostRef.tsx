import React from 'react'

const PostRef = () => {
  return (
    <div>
      <div className='flex sm:hidden'>
        <div className='flex flex-col justify-center w-full min-h-[60px] bg-white border-b'>
          <div className='p-2'>
            <h2 className='font-bold'>推薦</h2>
          </div>
        </div>
      </div>

      <div className='hidden sm:block'>
        <div className='flex justify-center items-center w-full mx-auto min-h-[60px] max-w-screen-sm'>
          <div className='p-2'>
            <h2 className='font-bold'>推薦</h2>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PostRef