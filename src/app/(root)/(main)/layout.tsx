import MobileFooter from "@/components/mobile/MobileFooter";
import { Metadata } from "next";
import React from "react";


type Props = {
  children: React.ReactNode;
};

export const metadata: Metadata = {
  title: "FitBox",
  description: "FitBox App",
  icons: {
    icon: "/icons/workout.svg"
  }
};

const MainLayout = ({ children }: Props) => {
  return (
    <>
      <main>
        <div>
          {children}
        </div>
      </main>
      
      <MobileFooter />
    </>
  );
};
 
export default MainLayout;
