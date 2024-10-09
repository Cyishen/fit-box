"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";


type Props = {
  iconSrc: string;
  href: string;
  title?: string;
};

export const MobileItem = ({ iconSrc, href, title }: Props) => {
  const pathname = usePathname();
  const active = pathname === href;

  return (
    <Link href={href}>
      <div className={`flex flex-col justify-center items-center p-3 w-16 h-16 rounded-full ${active ? "bg-slate-200 rounded-full" : ""}`}>
        <div className={`duration-300 ${active ? "translate-y-[-10px] scale-150" : ""}`}>
          <Image
            src={iconSrc}
            alt={iconSrc}
            height={70}
            width={70}
          />
        </div>
        <p className="text-sm">{title}</p>
      </div>
    </Link>
  );
};