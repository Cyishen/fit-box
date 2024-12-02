import React from 'react'
import ShowDayTraining from './ShowDayTraining';
import ShowTraining from './ShowTraining';


interface Props {
  daySession: WorkoutSessionType[];
  weekSession: WorkoutSessionType[];
}

const ShowCard = ({ daySession, weekSession }: Props) => {

  return (
    <>
      <div className='flex flex-col w-full gap-2 overflow-hidden mt-2'>
        <ShowDayTraining dayCardData={daySession} />
      </div>

      <div className='flex flex-col w-full gap-2 overflow-hidden mt-2'>
        <ShowTraining weekData={weekSession} />
      </div>
    </>
  )
}

export default ShowCard