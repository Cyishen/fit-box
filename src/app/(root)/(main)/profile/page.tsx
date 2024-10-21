import React from 'react'
import { auth } from '@/auth'


const ProfilePage = async() => {
  const session = await auth()

  return (
    <div>
      {JSON.stringify(session)}
      <p>ProfilePage</p>
    </div>
  )
}

export default ProfilePage