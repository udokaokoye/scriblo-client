'use client'
import { followUser } from '@/public/util/apiHelpers'
import { source_Sans_Pro } from '@/public/util/fonts'
import Link from 'next/link'
import React, {useState} from 'react'
import Verified from './Verified'

function AboutAuthorCard({author, session, doesSignedInUserFollowAuthor}) {
  const [SignedInUserFollowAuthor, setSignedInUserFollowAuthor] = useState(doesSignedInUserFollowAuthor)
  const handleFollowUser = async () => {
    const response = await followUser(author?.id, session?.id)
    if (response.message == 'followed') {
      setSignedInUserFollowAuthor(true)
    } else {
      setSignedInUserFollowAuthor(false)
    }
  }
  return (
    <div className='aboutAuthorCard'>
        <h3>About the Author</h3>
        <div className={`authorContainer ${source_Sans_Pro.className}`}>
          <Link href={`/${author.username}`}><div className="authorAvatar" style={{background: `url(${author.avatar})`}}></div></Link>
          <div className="authorInfo">
            <Link href={`/${author.username}`}><p className="authorName">{author.name} {author.verified == '1' && <Verified />}</p></Link>
            <p className="authorBio">{author.bio}</p>
            <div className="aboutbtns">

            {session?.email && !SignedInUserFollowAuthor && author.id !== session?.id ? (
              <button className='aboutbtn' onClick={() => handleFollowUser()}>Follow +</button>
            ) : (<button className='aboutbtn'>Message</button>)}

            {!session?.email && (
              <Link href='/signup'><button className='aboutbtn'>Follow +</button></Link>
            )}
            </div>
          </div>
        </div>
    </div>
  )
}

export default AboutAuthorCard