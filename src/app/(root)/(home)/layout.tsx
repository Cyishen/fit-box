import Navbar from "@/components/navbar-style/Navbar";
import Footer from "@/components/Footer";

import { Metadata } from "next";


type Props = {
  children: React.ReactNode
}

export const metadata: Metadata = {
  title: "FitBox",
  description: "FitBox App",
  icons: {
    icon: "/icons/workout.svg"
  }
};

const HomeLayout = ({ children }: Props ) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 flex flex-col items-center justify-center">
        {children}
      </main>
      
      <Footer />
    </div>
  )
}

export default HomeLayout