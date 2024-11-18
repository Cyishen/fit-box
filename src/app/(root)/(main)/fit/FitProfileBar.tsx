"use client"

import { useScroll, useMotionValueEvent, motion } from "framer-motion"
import { useState } from 'react'
import { useSession } from "next-auth/react"
import Image from "next/image"


const FitProfileBar = () => {
  const { data: session } = useSession()

  const googleImage = session?.user?.image;

  const { scrollY } = useScroll()
  const [scrolled, setScrolled] = useState(false)

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > 74 && !scrolled) {
      setScrolled(true)
    } else if (latest <= 74) {
      setScrolled(false)
    }
  })

  return (
    <div className='fixed top-1 sm:top-4 z-[90] w-full px-4'>
      <div className="w-full flex justify-end">
        {scrolled && (
          <motion.div
            className='flex justify-center items-center'
            initial={{ scale: 0.5, y: -30 }}
            animate={{ scale: 1, y: 0 }}
            transition={{
              type: "tween",
              duration: 0.3,
            }}
          >
            <div
              className='min-w-[50px] min-h-[50px] rounded-full border border-gray-500 flex justify-center items-center'
            >
              <div className='w-full h-full flex justify-center items-center'>
                {session?.user.image ? (
                  <Image
                    src={googleImage || "/icons/dumbbell.svg"}
                    width={46}
                    height={46}
                    alt="google user"
                    className='rounded-full object-contain'
                  />
                ) : (
                  <p className='rounded-full w-[46px] h-[46px] flex justify-center items-center bg-black text-white text-xl capitalize'>
                    {typeof session?.user?.name === 'string' ? session.user.name[0] : 'U'}
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default FitProfileBar