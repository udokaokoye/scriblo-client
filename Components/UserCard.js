import React from 'react'
import '../Styles/home.css'
import { limitText } from '@/public/util/helpers'
import Link from 'next/link'
import Verified from './Verified'
function UserCard({user, page}) {
  return (
    <div className='userCardContainer'>
        {/* <div className="userCardHeader">
            <div className="userAvatar" style={{background: `url(${user.avatar})`}}></div>
            <h3>{user.name}</h3>
        </div>
        <div className="userIntrests">
            {user.interests?.split(',').map((interest, index) => (
                <span key={index}>{interest}</span>
            ))}
        </div>
        <p className='userBio'>{user?.bio !== '' || user?.bio !== null ? user?.bio : "No bio available"}</p>
        <button className='followUser'>Follow</button> */}
        
        <div className="userAvatar" style={{background: `url(${user.avatar})`}}></div>
        <div className="userInfo">
        <Link href={`/${user.username}`}><h3>{user.name} {user.verified == '1' && <Verified />}</h3> </Link>
        <div className="userIntrests">
            {user.interests?.split(',').map((interest, index) => (
                <span key={index}>{interest}</span>
            ))}
        </div>
        <p className='userBio'>
            {user?.bio !== '' || user?.bio !== null ? limitText(user?.bio, 10) : "No bio available"}
            </p>

        </div>
        {/* <button className='followUser'>Follow</button> */}

    </div>
  )
}

export default UserCard