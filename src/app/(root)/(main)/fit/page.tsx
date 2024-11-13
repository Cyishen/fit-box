import Wrapper from '@/components/Wrapper'

import FitProfile from './FitProfile'
import FitDashboard from './FitDashboard'

// import ShowTraining from './ShowTraining'
import ShowMenu from './ShowMenu'

import { getAllMenusByUserId, getAllTemplatesByUserId } from '@/actions/user-create'
import { auth } from '@/auth'

// import { format } from "date-fns"


const FitPage = async() => {
  const session = await auth();
  const userId = session?.user?.id

  const userMenuData = await getAllMenusByUserId(userId);

  const userTemplateData = await getAllTemplatesByUserId();
  const userAllTemplate: TemplateType[] = userTemplateData.map(template => ({
    userId: template.userId,
    menuId: template.menuId,
    templateId: template.id,
    templateCategory: template.templateCategory,
    templateTitle: template.templateTitle,
    templateExercises: template.templateExercises,
    isDeleted: template.isDeleted,
  }));

  // const userWorkSessionData = await getAllWorkoutSessionByUserId(userId as string);

  // const userWorkSessionData = userId
  // ? getAllWorkoutSessionByUserId(userId)
  // : Promise.resolve([]);

  const [ 
    userMenu,
    userTemplates,
    // userSessionCard 
  ] = await Promise.all([ 
    userMenuData || [],
    userAllTemplate || [],
    // userWorkSessionData 
  ]);


  // console.log('所有模板', JSON.stringify(userTemplates, null, 2));

  // TODO: 篩選用戶當天紀錄
  // const todayDate = format(new Date(), 'yyyy-MM-dd');
  // const todayTrainingCard = workoutSessions.filter(session => session.date === todayDate);


  return (
    <section>
      <FitProfile />

      <Wrapper>
        <div className='flex mb-16'>
          <div className="flex flex-col w-full gap-3">
            <div className='flex flex-col w-full gap-2 overflow-hidden mt-2'>
              <h1 className='font-bold'>今日訓練</h1>
              {/* <ShowTraining
                sessionData={userSessionCard}
              /> */}
            </div>

            <div className='flex flex-col p-2 rounded-lg bg-gray-100 smt-2'>
              <ShowMenu />

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