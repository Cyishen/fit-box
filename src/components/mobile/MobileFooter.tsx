import { MobileItem } from "./MobileItem"


const MobileFooter = () => {
  return (
    <nav className="w-full fixed bottom-0 z-40 bg-transparent sm:bg-transparent sm:py-2">
      <div className="flex items-center justify-center px-3">
        <div className="flex justify-between w-full md:w-fit rounded-full sm:border bg-white/50 backdrop-blur-lg">
          <MobileItem
            href="/fit"
            iconSrc="/icons/barIcon-fit.svg"
            iconHoverSrc="/icons/barIcon-fit-on.svg"
            title="訓練"
          />
          <MobileItem
            href="/action"
            iconSrc="/icons/barIcon-action.svg"
            iconHoverSrc="/icons/barIcon-action-on.svg"
            title="動作"
          />
          {/* <MobileItem
            href="/"
            iconSrc="/icons/dumbbell.svg"
            title="主頁"
          /> */}
          <MobileItem
            href="/record"
            iconSrc="/icons/barIcon-chart.svg"
            iconHoverSrc="/icons/barIcon-chart-on.svg"
            title="記錄"
          />
          <MobileItem
            href="/profile"
            iconSrc="/icons/barIcon-me.svg"
            iconHoverSrc="/icons/barIcon-me-on.svg"
            title="我"
          />
        </div>
      </div>
    </nav>
  )
}

export default MobileFooter