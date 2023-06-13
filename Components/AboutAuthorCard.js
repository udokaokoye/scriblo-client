import { source_Sans_Pro } from '@/public/util/fonts'
import React from 'react'

function AboutAuthorCard({author}) {
  return (
    <div className='aboutAuthorCard'>
        <h3>About the Author</h3>
        <div className={`authorContainer ${source_Sans_Pro.className}`}>
          <div className="authorAvatar" style={{background: `url(${author.avatar})`}}></div>
          <div className="authorInfo">
            <p className="authorName">{author.name}</p>
            <p className="authorBio">{author.bio}</p>
            <button className='btn'>Follow +</button>
          </div>
        </div>
    </div>
  )
}

export default AboutAuthorCard