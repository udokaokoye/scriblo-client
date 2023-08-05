import { redirect } from 'next/navigation'
import React from 'react'

function Login() {
  redirect('/signup')
  return (
    <div>Login</div>
  )
}

export default Login