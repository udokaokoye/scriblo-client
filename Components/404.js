import React from 'react'
import '@/Styles/404.css'
import Link from 'next/link'
function NotFound404() {
  return (
    <div className='notFoundContainer'>
      <h2>Page Not Found</h2>
    <div className='notFoundImageContainer'>
    </div>
      <Link href={'/'}><button className='btn'>Go Home</button></Link>
    </div>
  )
}

export default NotFound404