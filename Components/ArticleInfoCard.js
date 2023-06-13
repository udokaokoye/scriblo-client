import React from 'react'
import { Source_Sans_Pro } from 'next/font/google'
import { source_Sans_Pro } from '@/public/util/fonts'
function ArticleInfoCard({authorAvatar, authorUsername, authorName, articlePublishDate, articleReadTime}) {
  return (
    <div className={`${source_Sans_Pro.className} articleInfoCardContainer`}>
        <div className="authorAvatar" style={{background: `url(${authorAvatar})`}}></div>
        <div className="articleAuthorInfo">
            <div className="authorNameAndFollowButton">
                <p className="authorName"> By {authorName} - <span className='authorUsername'>@{authorUsername}</span></p>
                <span>Follow</span>
            </div>
            <div className="publishDateAndReadTime">
                <span className="articlePublishedDate">published {articlePublishDate}</span> . <span className="articleReadTime">{articleReadTime}</span>
            </div>
        </div>
    </div>
  )
}

export default ArticleInfoCard