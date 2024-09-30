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
    <div className={`flex flex-col justify-center items-center p-1 w-16 h-16 ${active ? "bg-gray-200 rounded-full" : ""}`}>
      <div className="p-1">
        <Link href={href}>
          <Image
            src={iconSrc}
            alt={iconSrc}
            height={30}
            width={30}
          />
        </Link>
      </div>

      <p className="text-sm">{title}</p>
    </div>
  );
};