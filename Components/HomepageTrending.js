'use client'
import React from 'react'
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import { formatDate } from '@/public/util/helpers';
import Link from 'next/link';
function HomepageTrending({trends, source_Sans_Pro}) {
  return (
    <div className={`homepageTrendingContainer ${source_Sans_Pro.className}`}>
        <div className="homepageTrendingContainerWrapper">
        <div className="header">
            <div className="headerTexts">
            <h2>Trending on Scriblo</h2>
            <p>Discover trending stroies from writers on any topic</p>
            </div>
            <button className='headerBtn'><ArrowRightAltIcon /></button>
        </div>

        <div className="trends">
            {trends?.length >=6 ? trends.slice(0,5).map((trend, index) => (
                <div key={index} className="trend">
                    <div className="trendRank"><span>#</span>{index+1}</div>
                    <Link href={`/${trend.authorUsername}`}><div className="trendArticleAuthor">
                        {/* <div style={{background: `url(${trend.authorAvatar})`}} className="authorAvatar"></div> */}
                        <span className="authorName">{trend.authorName}</span>
                    </div>
                    </Link>
                    <Link href={`/${trend.authorUsername}/${trend.slug}`}><h3 className="articleTitle">{trend.title}</h3></Link>
                    <div className="articleDateandReadTime">
                        <span className="articleDate">{formatDate(trend.createdAt)}</span>
                        <span className="articleReadTime">{trend.readTime} min read time</span>
                    </div>
                </div>
            )) : ""
        
        }

        </div>
        </div>
    </div>
  )
}

export default HomepageTrending