import useSession from '@/lib/actions/useSession';
import { useWorkoutStore } from '@/lib/store';


const FitProfile = () => {
  const { workoutSessions } = useWorkoutStore();

  const { isSignedIn, user } = useSession();

  return (
    <div className='sticky top-0 flex items-center p-3 bg-gray-100 gap-5 z-50'>
      <div className='min-w-14 min-h-14 rounded-full border border-gray-600 flex justify-center items-center'>
        <p className="w-[50px] h-[50px] rounded-full flex justify-center items-center bg-blue-100">
          CY
        </p>
      </div>

      <div className='flex flex-col w-full font-bold'>
        <p className="text-sm">健身開始日 2024/10/01</p>

        <div className='flex gap-2'>
          <p className="text-sm">運動持續 21天 🔥 /</p>
          <p className="text-sm">累積訓練 {workoutSessions.length}次 👍︎</p>
        </div>

        {isSignedIn ? (
          <div className='text-sm'>
            <p>用戶: {user?.name}</p>
            <p>電子郵件: {user?.email}</p>
          </div>
        ) : (
          ''
        )}

        <p className="text-sm mt-5">基本資料</p>
      </div>
    </div>
  )
}

export default FitProfile