import Wrapper from '@/components/Wrapper'
import Info from './Info';
import Tool from './Tool';
import { getAllWorkoutSessionByUserId, getFirstWorkoutSessionDay } from '@/actions/user-create';
import { auth } from "@/auth";

const ProfilePage = async () => {
  const session = await auth();
  const userId = session?.user?.id

  const userWorkSessionData = getAllWorkoutSessionByUserId(userId as string);
  const userFirstTrainingData = getFirstWorkoutSessionDay()

  const [ 
    userSessionCard,
    userFirstSession 
  ] = await Promise.all([ 
    userWorkSessionData,
    userFirstTrainingData 
  ]);

  return (
    <section className='flex flex-col bg-[#f3f2f8] pb-32'>
      <Wrapper>
        <h1 className='text-2xl font-bold mt-5'>設定</h1>
        <Info 
          cardsCount={userSessionCard as WorkoutSessionType[]}
          userFirstDay={userFirstSession as WorkoutSessionType}
        />

        <Tool />
      </Wrapper>
    </section>
  )
}

export default ProfilePage