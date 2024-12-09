import { Button } from "@/components/ui/button";
import Wrapper from "@/components/Wrapper";
import Link from "next/link";


export default function Home() {
  return (
    <section className="h-screen">
      <Wrapper>
        <div className="flex flex-col items-center justify-center py-32 min-h-full">
          <h1 className="text-3xl font-bold mb-5">開始紀錄</h1>

          <Link href='/fit' className="w-full">
            <Button variant='outline' className="w-full hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition duration-500">Start</Button>
          </Link>
        </div>
      </Wrapper>
    </section>
  );
}
