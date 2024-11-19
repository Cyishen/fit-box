import React from 'react'
import ShowDayTraining from './ShowDayTraining';
import ShowTraining from './ShowTraining';


interface Props {
  daySession: WorkoutSessionType[];
  allSession: WorkoutSessionType[];
}

const ShowCard = ({ daySession, allSession }: Props) => {
  return (
    <>
      <div className='flex flex-col w-full gap-2 overflow-hidden mt-2'>
        <ShowDayTraining sessionData={daySession} />
      </div>

      <div className='flex flex-col w-full gap-2 overflow-hidden mt-2'>
        <ShowTraining sessionData={allSession} />
      </div>
    </>
  )
}

export default ShowCard