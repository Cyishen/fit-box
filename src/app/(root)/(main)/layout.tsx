import React from "react";
import { Metadata } from "next";
import FooterVisibility from "@/components/mobile/FooterVisibility";
import type { Viewport } from 'next/types'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover'
}


type Props = {
  children: React.ReactNode;
};

export const metadata: Metadata = {
  title: "FitBox",
  description: "FitBox App",
  icons: {
    icon: "/icons/workout.svg"
  },
  viewport: viewport
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
