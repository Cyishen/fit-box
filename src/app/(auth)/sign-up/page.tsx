"use client"

import AuthForm from '@/components/form/AuthForm'
import React from 'react'

const SingUpPage = () => {
  return (
    <div className="flex justify-center size-full max-sm:px-6">
      <AuthForm type="sign-up" />
    </div>
  )
}

export default SingUpPage