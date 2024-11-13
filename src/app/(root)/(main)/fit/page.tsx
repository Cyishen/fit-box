import Wrapper from '@/components/Wrapper'

import FitProfile from './FitProfile'
import FitDashboard from './FitDashboard'

import ShowTraining from './ShowTraining'
import ShowMenu from './ShowMenu'

import { getAllMenusByUserId, getAllTemplatesByUserId, getAllWorkoutSessionByUserId } from '@/actions/user-create'
import { auth } from '@/auth'

// import { format } from "date-fns"


const FitPage = async () => {
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

  const userWorkSessionData = await getAllWorkoutSessionByUserId(userId as string);


  const [
    userMenu,
    userTemplates,
    userSessionCard
  ] = await Promise.all([
    userMenuData || [],
    userAllTemplate || [],
    userWorkSessionData
  ]);

  const hasUserMenu = Array.isArray(userMenu) && userMenu.length > 0;
  const hasUserTemplates = Array.isArray(userTemplates) && userTemplates.length > 0;
  const hasUserSessions = Array.isArray(userSessionCard) && userSessionCard.length > 0;


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
              {hasUserSessions ? (
                <ShowTraining sessionData={userSessionCard} />
              ) : (
                <div>今天還沒有訓練紀錄</div>
              )}
            </div>

            <div className='flex flex-col p-2 rounded-lg bg-gray-100 smt-2'>
              {hasUserMenu && hasUserTemplates ? (
                <>
                  <ShowMenu />
                  <div className='overflow-hidden mb-20'>
                    <FitDashboard
                      menusData={userMenu}
                      templatesData={userTemplates}
                    />
                  </div>
                </>
              ) : (
                <div>沒有訓練菜單或模板可顯示</div>
              )}
            </div>
          </div>
        </div>
      </Wrapper>
    </section>
  )
}

export default FitPage