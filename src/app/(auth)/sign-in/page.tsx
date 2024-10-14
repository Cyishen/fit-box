"use client"

import AuthForm from '@/components/form/AuthForm'
import React from 'react'


const SingInPage = () => {
  return (
    <div className="flex justify-center size-full max-sm:px-6">
      <AuthForm type="sign-in" />
    </div>
  )
}

export default SingInPage