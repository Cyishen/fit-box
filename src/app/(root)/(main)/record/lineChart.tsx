import React from 'react'

const categories = ["胸", "背", "腿", "肩", "二頭", "三頭",];

const LineChart = () => {
  return (
    <div className='flex flex-col bg-white px-3 py-1 rounded-lg mt-1'>
      <div>
        <div className="flex overflow-x-scroll py-2">
          <div className="flex gap-3">
            {categories?.map((item, index) => (
              <button
                key={index}
                type="button"
                className={`flex items-center  cursor-pointer py-1 px-5 text-sm bg-gray-100 whitespace-nowrap rounded-full`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className='text-sm mt-1'>6月-7月</div>

      <div className='w-full h-44 mt-2 border rounded-lg bg-gray-100'>
      </div>
    </div>
  )
}

export default LineChart