import React from 'react'
import { auth } from '@/auth'


const ProfilePage = async () => {
  const session = await auth()

  return (
    <div className='flex flex-col p-10'>
      <p>ProfilePage</p>
      <p></p>
      <div className="whitespace-pre-wrap">
        {JSON.stringify(session, null, 2)}
      </div>
    </div>
  )
}

export default ProfilePage