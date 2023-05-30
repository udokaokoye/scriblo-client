"use client";
import React, { useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined';
import Link from "next/link";
import { useAppContex } from "../app/contex/store";
function Navigation() {
  const { data: session, update } = useSession();
  const [profileMenuVisible, setprofileMenuVisible] = useState(false)
  const { demo, setdemo } = useAppContex();

  useEffect(() => {
    console.log(session);
  }, [session]);
  return (
    <div className="navigation">
      <div className="navigation__logo"></div>
      <div className="navigation__menu">
        {!session && (
          <div className="authButtons">
            <Link href={'/login'}>
            <span  className="signInButton">
              Login
            </span>
            </Link>
            <Link href={"/signup"}>
              <button className="getStartedButton">Get Started</button>
            </Link>
          </div>
        )}

        {session && (
          <div className="userProfile">
            <button className="btn flex_center" style={{width: 150, height: 38}}> <CreateOutlinedIcon /> Create Post</button>


            <div style={{background: `url(${session?.avatar})`}} className="userProfile__avatar" onClick={()=> setprofileMenuVisible(!profileMenuVisible)}>
              
            </div>
            {profileMenuVisible && (
                <div className="profileMenu">
                <span className="menuItem profileName">{session?.name} <br /> @username</span>
                <hr />
                <span className="menuItem">Dashboard</span>
                <span className="menuItem">Create Post</span>
                <span className="menuItem">Saved Post</span>
                <span className="menuItem">Settings</span>
                <hr />
                <span className="menuItem" onClick={()=> signOut()}>Sign Out</span>
                </div>
              )
              }
          </div>
        )}
      </div>
    </div>
  );
}

export default Navigation;
