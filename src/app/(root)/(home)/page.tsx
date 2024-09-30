import { Button } from "@/components/ui/button";
import Wrapper from "@/components/Wrapper";
import Link from "next/link";


export default function Home() {
  return (
    <section className="h-screen">
      <Wrapper>
        <div className="flex flex-col items-center justify-center py-32 min-h-full">
          <h1>Record your fit</h1>

          <Link href='/fit'>
            <Button>Start</Button>
          </Link>
        </div>
      </Wrapper>
    </section>
  );
}
