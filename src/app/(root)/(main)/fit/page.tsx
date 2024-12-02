import Wrapper from '@/components/Wrapper'

import FitProfile from './FitProfile'
import FitProfileBar from './FitProfileBar'

import ShowCard from './ShowCard'
import FitDashboard from './FitDashboard'

import CreateMenuButton from './CreateMenuButton'

import { getAllMenusByUserId, getAllTemplatesByUserId, getDaySessionByUserId, getWeekSessionByUserId } from '@/actions/user-create'
import { auth } from '@/auth'



const FitPage = async () => {
  const session = await auth();
  const userId = session?.user?.id

  const userMenuData = getAllMenusByUserId(userId as string);
  const userTemplateData = getAllTemplatesByUserId();

  const userDayCardData = getDaySessionByUserId(userId as string);


  const userWeekCardData = getWeekSessionByUserId(userId as string);

  const [
    userMenu,
    userTemplates,
    userDayCard,
    userWeekCard,
  ] = await Promise.all([
    userMenuData,
    userTemplateData,
    userDayCardData,
    userWeekCardData
  ]);

  // console.log('Day?', JSON.stringify(userDayCard, null, 2));


  return (
    <section>
      <FitProfile />
      <FitProfileBar />

      <Wrapper>
        <div className='flex mb-16'>
          <div className="flex flex-col w-full gap-3">
            {/* 訓練卡 */}
            <ShowCard 
              daySession={userDayCard as WorkoutSessionType[]} 
              weekSession={userWeekCard as WorkoutSessionType[]}
            />

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