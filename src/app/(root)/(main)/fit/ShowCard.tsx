import React from 'react'
import ShowDayTraining from './ShowDayTraining';
// import ShowRecentTraining from './ShowRecentTraining';


interface Props {
  daySession: WorkoutSessionType[];
  weekSession: WorkoutSessionType[];
}

const ShowCard = ({ daySession }: Props) => {

  return (
    <>
      <div className='flex flex-col w-full gap-2 overflow-hidden mt-2'>
        <ShowDayTraining dayCardData={daySession} />
      </div>

      {/* <div className='flex flex-col w-full overflow-hidden'>
        <ShowRecentTraining weekData={weekSession} />
      </div> */}
    </>
  )
}

export default ShowCard