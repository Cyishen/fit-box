import { MobileItem } from "./MobileItem"

const MobileFooter = () => {
  return (
    <nav className="w-full fixed bottom-0 z-50 bg-slate-200 sm:bg-white py-1">
      <div className="flex items-center justify-center px-3">
        <div className="flex justify-between w-full md:w-fit rounded-full border bg-white backdrop-blur-lg">
          <MobileItem
            href="/fit"
            iconSrc="/icons/dumbbell.svg"
            title="訓練"
          />
          <MobileItem
            href="/action"
            iconSrc="/icons/dumbbell.svg"
            title="動作"
          />
          <MobileItem
            href="/"
            iconSrc="/icons/dumbbell.svg"
            title="主頁"
          />
          <MobileItem
            href="/record"
            iconSrc="/icons/dumbbell.svg"
            title="記錄"
          />
          <MobileItem
            href="/profile"
            iconSrc="/icons/dumbbell.svg"
            title="我"
          />
        </div>
      </div>
    </nav>
  )
}

export default MobileFooter