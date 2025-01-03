"use client"

import Wrapper from '@/components/Wrapper'
import React, { useRef } from 'react'
import { motion, useInView } from 'framer-motion';

export const textVariants = {
  initial: {
    y: 50,
    opacity: 0,
    filter: 'blur(10px)'
  },
  open: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 1,
      staggerChildren: 0.3,
    },
    filter: 'blur(0px)'
  },
  closed: {
    opacity: 0,
    transition: { duration: 0.5 }
  }
}

const Features = () => {
  const jumpRef = useRef(null);
  const isInView = useInView(jumpRef, { once: false })

  const firstWordRef = useRef(null);
  const firstView = useInView(firstWordRef, { once: true })

  return (
    <>
      <div className="flex flex-col w-full h-screen mt-10 sm:mt-0 bg-gray-50 py-10">
        <Wrapper>
          <div className="flex flex-col gap-5">
            <div className="flex items-center justify-center gap-3" >
              <motion.h2 className="lg:text-5xl md:text-5xl text-3xl font-medium"
                variants={textVariants}
                initial="initial"
                animate={firstView ? "open" : "closed"}
                ref={firstWordRef}
              >
                追蹤，成效。
              </motion.h2>
              <img src="/imgs/fitbox-record.png" alt="健身進度" className="w-32 sm:w-40" />
            </div>

            <div className="flex items-center justify-center gap-3">
              <img src="/imgs/fitbox-workout.png" alt="鍛煉計劃" className="w-32 sm:w-40" />
              <motion.h2 className="lg:text-5xl md:text-5xl text-3xl font-medium"
                variants={textVariants}
                initial="initial"
                animate={firstView ? "open" : "closed"}
                ref={firstWordRef}
              >
                個人化，模板。
              </motion.h2>
            </div>
          </div>
        </Wrapper>
      </div>

      <Wrapper>
        <div className="flex flex-col w-full h-screen mt-10">
          <motion.h2 className="lg:text-5xl md:text-5xl text-3xl font-medium"
            variants={textVariants}
            initial="initial"
            animate={isInView ? "open" : "closed"}
            ref={jumpRef}
          >
            社群，分享。
          </motion.h2>
          <div className="flex items-center justify-center mt-5">
            <img src="/imgs/fitbox-chat.png" alt="鍛煉計劃" className="w-40" />
          </div>
        </div>
      </Wrapper>
    </>
  )
}

export default Features