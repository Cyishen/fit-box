import React from 'react'
import BannerUnit from './banner'
import Logout from './Logout'
// import MyBoard from './MyBoard'


const Tool = () => {
  return (
    <>
      {/* <div className='flex flex-col bg-white mt-5 px-3 py-2 rounded-lg'>
        <MyBoard />
      </div> */}

      <div className='flex flex-col bg-white mt-5 px-3 py-2 rounded-lg'>
        <BannerUnit icon='/icons/body.svg' item='身體數據' />
        <BannerUnit icon='/icons/chart.svg' item='數據分析' />
        <BannerUnit icon='/icons/food.svg' item='飲食紀錄' />
        <BannerUnit icon='/icons/protein.svg' item='蛋白質計算' />
        <BannerUnit item='小工具' />
      </div>

      <div className='flex flex-col bg-white mt-5 px-3 py-2 rounded-lg'>
        <BannerUnit item='其他' />
      </div>

      <div>
        <Logout />
      </div>
    </>
  )
}

export default Tool