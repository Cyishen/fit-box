"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type Props = {
  iconSrc: string | React.ReactNode;
  iconHoverSrc?: string | React.ReactNode;
  href: string;
  title?: string;
};

export const MobileItem = ({ iconSrc, href, title, iconHoverSrc }: Props) => {
  const pathname = usePathname();
  const active = pathname === href;

  const [currentIcon, setCurrentIcon] = useState<string | React.ReactNode>(iconSrc);

  useEffect(() => {
    if(pathname === href && iconHoverSrc) {
      setCurrentIcon(iconHoverSrc);
    } else {
      setCurrentIcon(iconSrc);
    }
  }, [href, iconHoverSrc, iconSrc, pathname]);


  return (
    <Link href={href}>
      <div className={`flex flex-col justify-center items-center p-3 w-16 h-16 rounded-full`} >
        {typeof currentIcon === "string" ? (
          <div className={`duration-300 ${active ? "" : ""}`}>
            <Image
              src={currentIcon}
              alt={typeof currentIcon === "string" ? currentIcon : "icon"}
              height={24}
              width={24}
            />
          </div>
        ) : (
          <div className={`m-1 ${active ? "text-blue-500" : "text-gray-400"}`}>
            {currentIcon}
          </div>
        )}
        <p className={`text-[12px] ${active ? "text-black" : "text-gray-400"}`}>{title}</p>
      </div>
    </Link>
  );
};
