"use client";
import React, { useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined';
import SearchIcon from '@mui/icons-material/Search';
import Link from "next/link";
import '../Styles/navigation.css'
import { useAppContex } from "../app/contex/store";
function Navigation() {
  const { data: session, update } = useSession();
  const [profileMenuVisible, setprofileMenuVisible] = useState(false)
  const { demo, setdemo } = useAppContex();

  useEffect(() => {
    // console.log(session);
  }, [session]);
  return (
    <div className="navigation">
      <div className="logoSearch">
      <Link href={'/'}><div className="navigation__logo"></div></Link>
      <div className="navSearch"><SearchIcon className="searchIcon" /><input type="text" placeholder="Search Scriblo"/></div>
      </div>

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
            <Link href={'/create'}><button className="btn newPostBtn" style={{width: 150, height: 38}}> <CreateOutlinedIcon className="penIcon" /> Create Post</button> </Link>


            <div style={{background: `url(${session?.avatar})`}} className="userProfile__avatar" onClick={()=> setprofileMenuVisible(!profileMenuVisible)}>
              
            </div>
            {profileMenuVisible && (
                <div className="profileMenu">
                <span className="menuItem profileName">{session?.name} <br /> {session?.email}</span>
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
