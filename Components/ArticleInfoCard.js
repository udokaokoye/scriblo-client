
import { source_Sans_Pro } from '@/public/util/fonts'
import Link from 'next/link'
import Verified from './Verified'
function ArticleInfoCard({authorAvatar, authorUsername, authorName, authorId, articlePublishDate, articleReadTime, session, doesSignedInUserFollowAuthor, authorVerified}) {
  return (
    <div className={`${source_Sans_Pro.className} articleInfoCardContainer`}>
        <div className="authorAvatar" style={{background: `url(${authorAvatar})`}}></div>
        <div className="articleAuthorInfo">
            <div className="authorNameAndFollowButton">
                <p className="authorName"> <Link href={`/${authorUsername}`}>By {authorName} {authorVerified == '1' && <Verified />}</Link> - <Link href={`/${authorUsername}`}><span className='authorUsername'>@{authorUsername}</span></Link> </p>
                {session?.email && !doesSignedInUserFollowAuthor && authorId !== session?.id && (
              <span>Follow</span>
            )}

            {!session?.email && (
              <Link href='/signup'><span>Follow</span></Link>
            )}
            </div>
            <div className="publishDateAndReadTime">
                <span className="articlePublishedDate">published {articlePublishDate}</span> &nbsp; | &nbsp; <span className="articleReadTime">{articleReadTime} mins read time</span>
            </div>
        </div>
    </div>
  )
}

export default ArticleInfoCard