import Image from 'next/image'
import { ChevronRight } from 'lucide-react';
import { auth } from "@/auth";
import { calculateDaysSinceStart } from '@/lib/TimeFn/Timer';


interface Props {
  sessionData: WorkoutSessionType[];
  userFirstSession: WorkoutSessionType;
}

const Info = async ({ sessionData, userFirstSession }: Props) => {
  const session = await auth()

  const firstDay = userFirstSession?.createdAt
    ? new Date(userFirstSession.createdAt).toLocaleString().replace(/\//g, '-').slice(0, 10)
    : 'N/A';

  return (
    <div className='flex items-center gap-3 mt-5 bg-white px-3 py-1 rounded-lg'>
      <div className='min-w-[50px] min-h-[50px] rounded-full border border-gray-500 flex justify-center items-center'>
        <div className='w-full h-full flex justify-center items-center'>
          {session?.user.image ? (
            <Image
              src={session?.user?.image || "/icons/dumbbell.svg"}
              width={46}
              height={46}
              alt="google user"
              className='rounded-full object-contain'
            />
          ) : (
            <p className='rounded-full w-[46px] h-[46px] flex justify-center items-center bg-black text-white text-xl capitalize'>
              {typeof session?.user?.name === 'string' ? session.user.name[0] : 'U'}
            </p>
          )}
        </div>
      </div>

      <div className='flex flex-col w-full'>
        <div className='flex flex-col leading-4 font-bold'>
          {session?.user ? (
            <p className='capitalize'>{session?.user.name}</p>
          ) : (
            <p>Guest<span className='text-[10px] pl-3 text-gray-500'>註冊與登入預防資料遺失</span></p>
          )}
        </div>

        <div className='text-[12px] text-gray-500 mt-1'>
          {session?.user ? (
            <div>
              <p>健身開始日 {firstDay as string}</p>
              <p>健齡 {calculateDaysSinceStart(userFirstSession.createdAt) || 0} 日</p>
              <p>已累積 {sessionData?.length || 0} 次訓練 🔥</p>
            </div>
          ) : ('')}
        </div>
      </div>

      <div className='text-gray-300'>
        <ChevronRight size={20} />
      </div>
    </div>
  )
}

export default Info