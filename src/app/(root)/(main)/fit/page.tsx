"use client"

import Link from 'next/link'
import Wrapper from '@/components/Wrapper'
import { Button } from '@/components/ui/button'

import FitDashboard from './FitDashboard'
import FitProfile from './FitProfile'

import { useMenuStore, useWorkoutStore } from '@/lib/store'
import { useRouter } from 'next/navigation'
import ShowTrainingCard from './ShowTrainingCard'
import { useEffect, useState } from 'react'

// import { format } from "date-fns"

// const boxImage = [
//   '/imgs/cap.png',
//   '/imgs/hulk.png',
//   '/imgs/iron.png',
//   '/imgs/thor.png',
//   '/imgs/girl.png',
// ];

// const randomBoxImage = boxImage[Math.floor(Math.random() * boxImage.length)];

const FixPage = () => {
  const NOT_USER_MAX_MENU = 3
  const menus = useMenuStore((state) => state.menus);
  const router = useRouter();
  const [randomBoxImage, setRandomBoxImage] = useState('');

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

  // TODO: 篩選用戶當天紀錄
  // const todayDate = format(new Date(), 'yyyy-MM-dd');
  // const todayTrainingCard = workoutSessions.filter(session => session.date === todayDate);

  useEffect(() => {
    const images = [
      '/imgs/cap.png',
      '/imgs/hulk.png',
      '/imgs/iron.png',
      '/imgs/thor.png',
      '/imgs/girl.png',
    ];
    const randomIndex = Math.floor(Math.random() * images.length);
    const randomImage = images[randomIndex];
    setRandomBoxImage(randomImage);
  }, []);

  return (
    <section>
      <Wrapper>
        <div className='flex sm:py-0 mb-20'>
          <div className="flex flex-col w-full gap-3">
            <FitProfile />

            <div className='flex flex-col w-full gap-3 overflow-hidden'>
              <h1 className='font-bold'>最近的訓練</h1>

              {workoutSessions.map((session: WorkoutSessionType) => (
                <ShowTrainingCard
                  key={session.sessionId}
                  session={session}
                  handleEditWorkout={handleEditWorkout}
                  handleRemoveWorkoutSession={handleRemoveWorkoutSession}
                />
              ))}
            </div>

            <div
              className='flex items-center justify-between p-3 rounded-lg bg-gray-100 mt-2'
              style={{
                backgroundImage: `url(${randomBoxImage})`,
                backgroundSize: 'contain',
                backgroundPosition: 'center',
                backgroundRepeat: 'repeat',
                backgroundBlendMode: 'overlay',
              }}
            >
              <h1 className='font-bold'>你的訓練</h1>

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

            <div className='overflow-hidden mb-20'>
              <FitDashboard />
            </div>
          </div>
        </div>
      </Wrapper>
    </section>
  )
}

export default FixPage