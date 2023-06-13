"use client";
import React, { useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";
// import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined';
// import SearchIcon from '@mui/icons-material/Search';
import Link from "next/link";
import { source_Sans_Pro } from "@/public/util/fonts";
import '../Styles/navigation.css'
import { useAppContex } from "../app/contex/store";
import { useRouter } from "next/navigation";

function Navigation() {
  const { data: session, update } = useSession();
  const [profileMenuVisible, setprofileMenuVisible] = useState(false)
  const router = useRouter()
  const handleSearch = (e) => {
    if (e.keyCode === 13) {
      e.preventDefault();
      router.push(`/search?q=${e.target.value}&class=articles`)
    }
  }
  return (
    <div className="navigation">
      <div className="logoSearch">
      <Link href={'/'}><div className="navigation__logo"></div></Link>
      <div className="navSearch">
        {/* <SearchIcon className="searchIcon" /> */}
        <input type="search" placeholder="Search Scriblo" onKeyUp={(e) => handleSearch(e)}/></div>
      </div>

      <div className="navigation__menu">
        {!session && (
          <div className={`authButtons ${source_Sans_Pro.className}`}>
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
            <Link href={'/create'}><button className="btn newPostBtn" style={{width: 150, height: 38}}> 
            {/* <CreateOutlinedIcon className="penIcon" />  */}
            Create Post</button> </Link>


            <div style={{background: `url(${session?.avatar})`}} className="userProfile__avatar" onClick={()=> setprofileMenuVisible(!profileMenuVisible)}>
              
            </div>
            {profileMenuVisible && (
                <div className={`profileMenu ${source_Sans_Pro.className}`}>
                <span className="menuItem profileName">{session?.name} <br /> @{session?.username}</span>
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
