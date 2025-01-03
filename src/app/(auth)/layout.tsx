import { Metadata } from "next";
import React, { Suspense } from "react";


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

const AuthLayout = ({ children }: Props) => {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-screen-xl flex justify-center">
        <Suspense fallback={<div>Loading...</div>}>
          {children}
        </Suspense>
      </div>
    </main>
  );
};

export default AuthLayout;
