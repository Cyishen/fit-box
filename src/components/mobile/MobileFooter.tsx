import { MobileItem } from "./MobileItem"

const MobileFooter = () => {
  return (
    <nav className="w-full fixed bottom-0 z-50 bg-transparent sm:bg-transparent sm:py-2">
      <div className="flex items-center justify-center px-3">
        <div className="flex justify-between w-full md:w-fit rounded-full sm:border bg-white/50 backdrop-blur-lg">
          <MobileItem
            href="/fit"
            iconSrc="/imgs/hulk.png"
            title="訓練"
          />
          <MobileItem
            href="/action"
            iconSrc="/imgs/iron.png"
            title="動作"
          />
          <MobileItem
            href="/"
            iconSrc="/icons/dumbbell.svg"
            title="主頁"
          />
          <MobileItem
            href="/record"
            iconSrc="/imgs/thor.png"
            title="記錄"
          />
          <MobileItem
            href="/profile"
            iconSrc="/imgs/cap2.png"
            title="我"
          />
        </div>
      </div>
    </nav>
  )
}

export default MobileFooter