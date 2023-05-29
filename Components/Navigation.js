'use client'
import React, { useEffect } from "react";
import { signOut, useSession } from 'next-auth/react'
import Link from "next/link";
function Navigation() {
  const { data: session } = useSession()

  useEffect(() => {
    console.log(session?.user)
  }, [session])
  return (
    <div className="navigation">
      <div className="navigation__logo"></div>
      <div className="navigation__menu">
        <div className="authButtons">
          {/* <Link href={'/login'}> */}
            <span onClick={() => signOut()} className="signInButton">Login</span>
            {/* </Link> */}
          <Link href={'/signup'}><button className="getStartedButton">Get Started</button></Link>
        </div>

        <div className="userProfile">
          {session?.user && (<p>{session.user.name}</p>)}
          
        </div>
      </div>
    </div>
  );
}

export default Navigation;
