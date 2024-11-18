import Wrapper from '@/components/Wrapper'

import FitProfile from './FitProfile'
import FitDashboard from './FitDashboard'

import ShowTraining from './ShowTraining'
import CreateMenuButton from './CreateMenuButton'

import { getAllMenusByUserId, getAllTemplatesByUserId, getAllWorkoutSessionByUserId, getDaySessionByUserId } from '@/actions/user-create'
import { auth } from '@/auth'
import ShowDayTraining from './ShowDayTraining'
import FitProfileBar from './FitProfileBar'

// import { format } from "date-fns"


const FitPage = async () => {
  const session = await auth();
  const userId = session?.user?.id

  const userMenuData = await getAllMenusByUserId(userId);

  const userTemplateData = await getAllTemplatesByUserId();

  const userWorkSessionData = await getAllWorkoutSessionByUserId(userId as string);

  const userDaySessionData = await getDaySessionByUserId(userId as string);

  const [
    userMenu,
    userTemplates,
    userSessionCard,
    userDayCard
  ] = await Promise.all([
    userMenuData,
    userTemplateData,
    userWorkSessionData,
    userDaySessionData
  ]);

  // console.log('Day?', JSON.stringify(userDayCard, null, 2));

  // TODO: 篩選用戶當天紀錄
  // const todayDate = format(new Date(), 'yyyy-MM-dd');
  // const todayTrainingCard = workoutSessions.filter(session => session.date === todayDate);


  return (
    <section>
      <FitProfile />
      <FitProfileBar />

      <Wrapper>
        <div className='flex mb-16'>
          <div className="flex flex-col w-full gap-3">
            {/* 訓練卡 */}
            <div className='flex flex-col w-full gap-2 overflow-hidden mt-2'>
              <ShowDayTraining sessionData={userDayCard as WorkoutSessionType[]} />
            </div>

            <div className='flex flex-col w-full gap-2 overflow-hidden mt-2'>
              <ShowTraining sessionData={userSessionCard as WorkoutSessionType[]} />
            </div>

            {/* 模板列表 */}
            <div className='flex flex-col p-2 rounded-lg bg-gray-100 smt-2'>
              <CreateMenuButton />

              <div className='overflow-hidden mb-20'>
                <FitDashboard
                  menusData={userMenu}
                  templatesData={userTemplates}
                />
              </div>
            </div>
          </div>
        </div>
      </Wrapper>
    </section>
  )
}

export default FitPage