
import { source_Sans_Pro } from '@/public/util/fonts'
import Link from 'next/link'
function ArticleInfoCard({authorAvatar, authorUsername, authorName, authorId, articlePublishDate, articleReadTime, session, doesSignedInUserFollowAuthor}) {
  return (
    <div className={`${source_Sans_Pro.className} articleInfoCardContainer`}>
        <div className="authorAvatar" style={{background: `url(${authorAvatar})`}}></div>
        <div className="articleAuthorInfo">
            <div className="authorNameAndFollowButton">
                <p className="authorName"> By {authorName} - <Link href={`/${authorUsername}`}><span className='authorUsername'>@{authorUsername}</span></Link></p>
                {session?.email && !doesSignedInUserFollowAuthor && authorId !== session?.id && (
              <span>Follow</span>
            )}

            {!session?.email && (
              <Link href='/signup'><span>Follow</span></Link>
            )}
            </div>
            <div className="publishDateAndReadTime">
                <span className="articlePublishedDate">published {articlePublishDate}</span> . <span className="articleReadTime">{articleReadTime}</span>
            </div>
        </div>
    </div>
  )
}

export default ArticleInfoCard