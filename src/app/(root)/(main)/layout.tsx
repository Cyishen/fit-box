import React from "react";
import { Metadata } from "next";
import FooterVisibility from "@/components/mobile/FooterVisibility";


type Props = {
  children: React.ReactNode;
};

export const metadata: Metadata = {
  title: "FitBox",
  description: "FitBox App",
  icons: {
    icon: "/icons/workout.svg"
  },
  viewport: "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
};

const MainLayout = ({ children }: Props) => {
  return (
    <>
      <main>
        <div>
          {children}
        </div>
      </main>

      <FooterVisibility />
    </>
  );
};

export default MainLayout;
