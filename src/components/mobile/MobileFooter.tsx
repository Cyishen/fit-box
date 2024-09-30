import Wrapper from "../Wrapper"
import { MobileItem } from "./MobileItem"

const MobileFooter = () => {
  return (
    <nav className="w-full fixed bottom-2 z-50 right-0">
      <Wrapper className="flex items-center justify-center">
        <div className="flex justify-between w-full md:w-fit rounded-full border bg-gray-50/10 backdrop-blur-lg">
          <MobileItem
            href="/fit"
            iconSrc="/icons/workout.svg"
            title="訓練"
          />
          <MobileItem
            href="/action"
            iconSrc="/icons/workout.svg"
            title="動作"
          />
          <MobileItem
            href="/"
            iconSrc="/icons/workout.svg"
            title="主頁"
          />
          <MobileItem
            href="/record"
            iconSrc="/icons/workout.svg"
            title="記錄"
          />
          <MobileItem
            href="/profile"
            iconSrc="/icons/workout.svg"
            title="我"
          />
        </div>
      </Wrapper>
    </nav>
  )
}

export default MobileFooter