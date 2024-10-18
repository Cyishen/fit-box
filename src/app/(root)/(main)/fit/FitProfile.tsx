import { Button } from '@/components/ui/button';
import Link from 'next/link';

import { useWorkoutStore } from '@/lib/store';

import useHonoSession from '@/lib/actions/useSession';
import { useLogout } from '@/lib/actions/user-auth-hook';
import { useSession, signOut } from "next-auth/react"
import Image from 'next/image';


const FitProfile = () => {
  const { workoutSessions } = useWorkoutStore();

  const { isSignedIn, user } = useHonoSession();
  const { mutate: logout } = useLogout();

  // OAuth for google
  const { data: session, status } = useSession()
  const googleImage = session?.user?.image;


  const handleLogout = async () => {
    if (status === "authenticated") {
      await signOut()
    } else {
      await logout();
    }
  };

  return (
    <div className='sticky top-0 flex items-center p-3 bg-gray-100 gap-5 z-50'>
      <div className='min-w-[50px] min-h-[50px] rounded-full border border-gray-800 flex justify-center items-center'>
        <div className='w-full h-full flex justify-center items-center'>
          <Image
            src={googleImage || "/icons/dumbbell.svg"}
            width={46}
            height={46}
            alt="google user"
            className='rounded-full object-contain'
          />
        </div>
      </div>

      <div className='flex flex-col w-full font-bold'>
        <p className="text-sm">健身開始日 2024/10/01</p>

        <div className='flex gap-2'>
          <p className="text-sm">運動持續 21天 🔥 /</p>
          <p className="text-sm">累積訓練 {workoutSessions.length}次 👍︎</p>
        </div>

        {isSignedIn || status === "authenticated"  ? (
          <div className='flex justify-between'>
            <div className='text-sm'>
              <p>用戶 {user?.name || session?.user?.name}</p>
              <p>郵件 {user?.email || session?.user?.email}</p>
            </div>

            <div className='flex items-center'>
              <Button onClick={handleLogout} variant='outline' size='sm'>登出</Button>
            </div>
          </div>
        ) : (
          <div className='flex items-center mt-4'>
            <Link href="/sign-in">
              <Button variant='outline' size='sm'>登入</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default FitProfile