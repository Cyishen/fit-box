"use client"

import React, { useRef } from 'react'
// import { useScroll, useMotionValueEvent, motion, useTransform } from "framer-motion";
// import { useState } from "react";

import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";


gsap.registerPlugin(useGSAP, ScrollTrigger);


const PostBar = () => {
  const ref = useRef(null)

  gsap.to((ref.current), {
    scrollTrigger: {
      trigger: ref.current,
      start: "top center",
      end: "bottom center",
      scrub: true,
      onUpdate: (self) => {
        if (self.direction === 1) { // 向下滾動

          gsap.to((ref.current), { opacity: 1, y: 0 });
        } else if (self.direction === -1) { // 向上滾動

          gsap.to((ref.current), { opacity: 0, y: -100 });
        }
      },
    },
  });


  // const { scrollY } = useScroll()
  // const [scrolled, setScrolled] = useState(false)
  // const [lastScrollY, setLastScrollY] = useState(0);

  // const windowScroll = window.scroll()
  // console.log(windowScroll)

  // useMotionValueEvent(scrollY, "change", (latest) => {
  //   if (latest === 0) {
  //     setScrolled(false);
  //   } else if (latest > lastScrollY) {
  //     setScrolled(true);
  //   } else if (latest < lastScrollY) {
  //     setScrolled(false);
  //   }

  //   setLastScrollY(latest);
  // })

  return (
    <>
      <div
        ref={ref}
        className="absolute bottom-0 h-10 w-20 z-50 bg-white place-self-center"
      >
        <div className="flex items-center justify-center px-3">
          123
        </div>
      </div>
    </>
  )
}

export default PostBar