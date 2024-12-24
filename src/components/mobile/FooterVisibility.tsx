"use client";

import MobileFooter from "@/components/mobile/MobileFooter";
import { usePathname } from "next/navigation";

const FooterVisibility = () => {
  const pathname = usePathname();

  // 定義主要路由
  const mainRoutes = ["/fit", "/action", "/record", "/profile", "/post"];
  const shouldShowFooter = mainRoutes.includes(pathname);

  return shouldShowFooter ? <MobileFooter /> : null;
};

export default FooterVisibility;
