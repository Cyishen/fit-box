import { Button } from "@/components/ui/button";
import Wrapper from "@/components/Wrapper";
import Link from "next/link";

export default function Home() {
  return (
    <section className="h-full w-full">
      <Wrapper>
        <div className="flex flex-col items-center justify-center w-full mt-10">
          <h1 className="text-3xl font-bold mb-5">紀錄你的健身旅程，輕鬆追蹤每一次進步</h1>
          <p className="text-center text-lg mb-5">
            FitBox 讓你輕鬆記錄每次訓練，隨時查看你的進步
          </p>
          <Link href='/fit' className="w-full sm:w-32">
            <Button variant='outline' className="w-full hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition duration-500">
              開始紀錄
            </Button>
          </Link>
        </div>

        <div className="flex flex-col mt-10 w-full gap-0 justify-center">
          <div className="flex items-center justify-center gap-3">
            <img src="/imgs/fitbox-fit.png" alt="健身記錄" className="w-32" />
            <h2 className="lg:text-5xl md:text-5xl text-3xl font-medium">輕鬆，記錄。</h2>
          </div>

          <div className="flex items-center justify-center gap-3">
            <h2 className="lg:text-5xl md:text-5xl text-3xl font-medium">追蹤，成效。</h2>
            <img src="/imgs/fitbox-record.png" alt="健身進度" className="w-32" />
          </div>

          <div className="flex items-center justify-center gap-3">
            <img src="/imgs/fitbox-workout.png" alt="鍛煉計劃" className="w-32" />
            <h2 className="text-3xl lg:text-5xl font-semibold">個人化，模板。</h2>
          </div>
        </div>

        <div className="flex flex-col mt-10">
          <h2 className="lg:text-5xl md:text-5xl text-3xl font-medium">社群，分享。</h2>
          <div className="flex justify-center mt-5">
            <img src="/imgs/fitbox-chat.png" alt="鍛煉計劃" className="w-32" />
          </div>
        </div>
      </Wrapper>
    </section>
  );
}
