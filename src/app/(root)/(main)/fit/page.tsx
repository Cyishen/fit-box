"use client"

import Link from 'next/link'
import Wrapper from '@/components/Wrapper'
import { Button } from '@/components/ui/button'

import FitDashboard from './FitDashboard'
import FitProfile from './FitProfile'

import { useMenuStore, useWorkoutStore } from '@/lib/store'
import { useRouter } from 'next/navigation'
import ShowTrainingCard from './ShowTrainingCard'


const FixPage = () => {
  const NOT_USER_MAX_MENU = 3
  const menus = useMenuStore((state) => state.menus);
  const router = useRouter();

  const canCreateNewMenu = menus.length < NOT_USER_MAX_MENU;

  const { workoutSessions, removeWorkoutSession } = useWorkoutStore();

  const handleEditWorkout = (sessionId: string) => {
    const sessionToEdit = workoutSessions.find(session => session.sessionId === sessionId);
    if (sessionToEdit) {
      router.push(`/fit/workout/${sessionToEdit.menuId}/${sessionToEdit.templateId}/${sessionId}`);
    }
  };

  const handleRemoveWorkoutSession = (sessionId: string) => {
    removeWorkoutSession(sessionId);
  };


  return (
    <section>
      <Wrapper>
        <div className='flex sm:py-0 mb-20'>
          <div className="flex flex-col w-full gap-3">
            <FitProfile />

            {workoutSessions.map((session: WorkoutSessionType) => (
              <ShowTrainingCard
                key={session.sessionId}
                session={session}
                handleEditWorkout={handleEditWorkout}
                handleRemoveWorkoutSession={handleRemoveWorkoutSession}
              />
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

            <div className='mt-5 overflow-hidden mb-20'>
              <FitDashboard />
            </div>
          </div>
        </div>
      </Wrapper>
    </section>
  )
}

export default FixPage