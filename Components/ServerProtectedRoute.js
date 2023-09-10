import React from 'react'
import { getServerSession } from 'next-auth/next'
import {authOptions} from '../app/authentication/[...nextauth]/route.js'
import {redirect} from 'next/navigation'

async function ServerProtectedRoute({children}) {
    const session = await getServerSession(authOptions)
    if (!session) {
        redirect('/signup')
    }
  return (
    <>
        {session && children}
    </>
  )
}

export default ServerProtectedRoute