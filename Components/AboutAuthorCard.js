'use client'
import { followUser } from '@/public/util/apiHelpers'
import { source_Sans_Pro } from '@/public/util/fonts'
import Link from 'next/link'
import React, {useState} from 'react'

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
            <Link href={`/${author.username}`}><p className="authorName">{author.name}</p></Link>
            <p className="authorBio">{author.bio}</p>
            {session?.email && !SignedInUserFollowAuthor && author.id !== session?.id ? (
              <button className='btn' onClick={() => handleFollowUser()}>Follow +</button>
            ) : (<button className='btn'>Message</button>)}

            {!session?.email && (
              <Link href='/signup'><button className='btn'>Follow +</button></Link>
            )}
          </div>
        </div>
    </div>
  )
}

export default AboutAuthorCard