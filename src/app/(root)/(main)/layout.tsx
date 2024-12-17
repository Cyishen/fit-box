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

      <FooterVisibility />
    </>
  );
};

export default MainLayout;
