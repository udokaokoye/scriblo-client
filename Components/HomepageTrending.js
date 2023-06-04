'use client'
import React from 'react'
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
function HomepageTrending({trends}) {
  return (
    <div className='homepageTrendingContainer'>
        <div className="homepageTrendingContainerWrapper">
        <div className="header">
            <div className="headerTexts">
            <h2>Trending on Scriblo</h2>
            <p>Discover trending stroies from writers on any topic</p>
            </div>
            <button className='headerBtn'><ArrowRightAltIcon /></button>
        </div>

        <div className="trends">
            {trends.map((trend, index) => (
                <div key={index} className="trend">
                    <div className="trendRank"><span>#</span>{index+1}</div>
                    <div className="trendArticleAuthor">
                        <div className="authorAvatar"></div>
                        <span className="authorName">{trend.authorName}</span>
                    </div>
                    <h3 className="articleTitle">{trend.title}</h3>
                    <div className="articleDateandReadTime">
                        <span className="articleDate">Aug 20</span>
                        <span className="articleReadTime">{trend.readTime}</span>
                    </div>
                </div>
            ))}

        </div>
        </div>
    </div>
  )
}

export default HomepageTrending