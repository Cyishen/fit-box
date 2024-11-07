import Wrapper from '@/components/Wrapper'

import FitProfile from './FitProfile'
import FitDashboard from './FitDashboard'

import ShowTraining from './ShowTraining'
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
    exercises: template.exercises,
  }));

  const [ 
    userMenu,
    userTemplates 
  ] = await Promise.all([ 
    userMenuData,
    userAllTemplate 
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
            <div className='flex flex-col w-full gap-3 overflow-hidden mt-1'>
              <h1 className='font-bold'>最近的訓練</h1>
              <ShowTraining />
            </div>

            <div className='flex flex-col p-2 rounded-lg bg-gray-100 mt-2'>
              <ShowMenu />

              <div className='overflow-hidden mb-20'>
                <FitDashboard 
                  menusData={userMenu} 
                  templatesData={userTemplates} 
                  userId={userId || null} 
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