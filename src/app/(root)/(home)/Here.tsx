"use client"

import { Button } from '@/components/ui/button'
import Wrapper from '@/components/Wrapper'
import Link from 'next/link'
import React from 'react'

import { motion } from 'framer-motion';
import { textVariants } from './Features'


const Here = () => {
  return (
    <Wrapper>
      <div className="flex flex-col w-full h-dvh sm:flex-row items-center justify-center relative gap-5" >
        <div className="flex order-1">
          <img src="/imgs/fitbox-fit.png" alt="" className="w-40 sm:w-52 top-0 right-0" />
        </div>

        <motion.div className="flex flex-col items-center order-0 sm:order-2 mt-32 sm:mt-0"
          variants={textVariants}
          initial="initial"
          animate="open"
        >
          <motion.h1 variants={textVariants} className="text-3xl font-bold mb-5">紀錄你的健身旅程，輕鬆追蹤每一次進步</motion.h1>
          <motion.p variants={textVariants} className="sm:text-center text-lg mb-5">
            FitBox 讓你輕鬆記錄每次訓練，隨時查看你的進步
          </motion.p>
          <Link href='/fit' className="w-full sm:w-32">
            <Button variant='outline' className="w-full hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition duration-500 rounded-full">
              開始紀錄
            </Button>
          </Link>
        </motion.div>
      </div>
    </Wrapper>
  )
}

export default Here