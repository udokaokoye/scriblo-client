'use client'
import React from 'react'
import Verified from './Verified'
import Link from 'next/link'

function FollowUserCard({user, profileId, userId, type}) {
  return (
    <div className="followItem">
                <div
                  style={{ background: `url(${user.avatar})` }}
                  className="followAvatar"
                  ></div>
                <Link href={`/${user?.username}`}>
                <div className="followInfo">
                  <span className="followName">{user.name} {user.verified == '1' && <Verified size={20} />}</span>
                  <span className="followUsername">
                    @{user.username}
                  </span>
                </div>
                </Link>

                {userId == profileId && <button onClick={()=> alert("Currently In Developement")} className="followActionBtn">{type == 'following' ? 'unfollow' : 'remove'}</button>}
              </div>
  )
}

export default FollowUserCard