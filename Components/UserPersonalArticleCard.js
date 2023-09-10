import React from 'react'
import '@/Styles/userPersonalArticleCard.css'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteSweepOutlinedIcon from '@mui/icons-material/DeleteSweepOutlined';
import { formatDate } from '@/public/util/helpers';
import Link from 'next/link';
function UserPersonalArticleCard({userArticle, deleteArticle}) {
  return (
    <div className='userArticleCardContainer'>
        <div style={{background: `url(${userArticle.coverImage})`}} className="articleCover">{userArticle?.coverImage == '' && 'No Cover Image'}</div>
        <div className="articleInformation">
            <h3 className="articleTitle">{userArticle?.title}</h3>

            <p className="articleSummary">{userArticle?.summary}</p>

            <span className="articleDate">{formatDate(userArticle?.createdAt)}</span>
        </div>
        <div className="articleOptions">
          <Link href={`/edit/${userArticle.id}`}><span className='editIcon'><EditOutlinedIcon /></span></Link>
          <span className='deleteIcon' onClick={() => deleteArticle(userArticle?.id, userArticle?.content, userArticle?.coverImage)}><DeleteSweepOutlinedIcon /></span>
        </div>
    </div>
  )
}

export default UserPersonalArticleCard