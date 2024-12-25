"use client";

import MobileFooter from "@/components/mobile/MobileFooter";
import { usePathname } from "next/navigation";

import { useScroll, useMotionValueEvent } from "framer-motion";
import { useState } from "react";


const FooterVisibility = () => {
  const pathname = usePathname();
  // const timerRef = useRef<NodeJS.Timeout | null>(null);
  // 定義要顯示Bar路由
  const mainRoutes = ["/fit", "/action", "/record", "/profile", "/post"];
  const shouldShowFooter = mainRoutes.includes(pathname);

  const { scrollY } = useScroll()
  const [scrolled, setScrolled] = useState(false)
  const [lastScrollY, setLastScrollY] = useState(0);

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest === 0) {
      setScrolled(false);
    } else if (latest > lastScrollY) {
      setScrolled(true);
    } else if (latest < lastScrollY) {
      setScrolled(false);
    }

    setLastScrollY(latest);

    // if (timerRef.current) {
    //   clearTimeout(timerRef.current);
    // }
    // timerRef.current = setTimeout(() => {
    //   setScrolled(false);
    // }, 500); 
  })

  return (
    <div>
      {shouldShowFooter ? (
        scrolled ? null : <MobileFooter />
      ) : null
      }
    </div>
  );
};

export default FooterVisibility;
