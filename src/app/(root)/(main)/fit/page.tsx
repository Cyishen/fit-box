"use client"

import Link from 'next/link'
import Wrapper from '@/components/Wrapper'
import { Button } from '@/components/ui/button'

import FitDashboard from './FitDashboard'
import FitProfile from './FitProfile'

import { useMenuStore, useWorkoutStore } from '@/lib/store'
import { useRouter } from 'next/navigation'


const FixPage = () => {
  const NOT_USER_MAX_MENU = 3
  const menus = useMenuStore((state) => state.menus);
  const router = useRouter();

  const canCreateNewMenu = menus.length < NOT_USER_MAX_MENU;

  const { workoutSessions } = useWorkoutStore();
  console.log(workoutSessions)
  const handleEditWorkout = (sessionId: string) => {
    const sessionToEdit = workoutSessions.find(session => session.sessionId === sessionId);
    if (sessionToEdit) {
      router.push(`/fit/workout/${sessionToEdit.menuId}/${sessionToEdit.templateId}/${sessionId}`);
    }
  };


  return (
    <section>
      <Wrapper>
        <div className='flex sm:py-0 mb-20'>
          <div className="flex flex-col w-full gap-3">
            <FitProfile />

            {workoutSessions.map((session) => (
              <div 
                key={session.sessionId} 
                className='flex flex-col p-3 rounded-lg bg-slate-100'
                onClick={() => handleEditWorkout(session.sessionId)}
              >
                <p className='font-bold'>{session.templateTitle}</p>
                <div className='flex gap-1 text-[10px] text-muted-foreground'>
                  <p>{session.exercises.length} 動作 /</p>
                  <p>共 {session.exercises.reduce((total, e) => total + e.sets.length, 0)} 組</p>
                </div>
              </div>
            ))}
            
            <div className='flex items-center justify-between p-3 rounded-lg bg-gray-100'>
              <h1 className='font-bold text-lg'>你的訓練</h1>

              {canCreateNewMenu ? (
                <Link href='/fit/create-menu'>
                  <Button className='w-fit self-end'>+ 新盒子</Button>
                </Link>
              ) : (
                <Button variant='outline' className='w-fit self-end' disabled>
                  註冊獲得更多盒子🤗
                </Button>
              )}
            </div>

            <div className='mt-5 overflow-hidden'>
              <FitDashboard />
            </div>
          </div>
        </div>
      </Wrapper>
    </section>
  )
}

export default FixPage