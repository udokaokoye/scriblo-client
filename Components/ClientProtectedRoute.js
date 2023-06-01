import React from 'react'
import {authOptions} from '../app/authentication/[...nextauth]/route.js'
import { getServerSession } from 'next-auth/next'
import { useSession } from 'next-auth/react';
import {redirect} from 'next/navigation'
function ClientProtectedRoute({children}) {
      const { data: session, } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/signup')
    }
  });

  return (
    <>{session && children}</>
  )
}

export default ClientProtectedRoute

// export async function getServerSideProps(context) {
//     const session = await getServerSession(context.req, context.res, authOptions)
//     if (!session) {
//         return {
//             redirect: {
//                 destination: '/signup',
//                 permanent: false
                
//             },
//         }
//     }
//     return {
//         props: {session}
//     }
//     } 