import { Skeleton } from "@/components/ui/skeleton"

export function SkeletonCard() {
  return (
    <Skeleton className='flex justify-center rounded-2xl px-1 py-4 bg-gray-50'>
      <div className='flex justify-between w-full px-2 gap-3 rounded-2xl' >
        <div className='min-w-14 min-h-14 max-w-14 max-h-14 flex justify-center items-center rounded-full'>
          <Skeleton className="h-full w-full rounded-full" />
        </div>

        <div className='flex w-full'>
          <div className='flex w-full rounded-md'
          >
            <Skeleton className="w-full" />
          </div>
        </div>

        <div className="w-[30%]" />
      </div>
    </Skeleton>
  )
}
