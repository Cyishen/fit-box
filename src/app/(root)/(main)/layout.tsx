import MobileFooter from "@/components/mobile/MobileFooter";
import { Metadata } from "next";


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

        {/* <div className="h-[30vh]" /> */}
      </main>
      
      <MobileFooter />
    </>
  );
};
 
export default MainLayout;
