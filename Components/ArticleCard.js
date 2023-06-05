'use client'
import React from "react";
import { merrweather } from "../public/util/fonts";
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import ShareIcon from '@mui/icons-material/Share';
function ArticleCard({ article }) {
  return (
    <article className={`articleCardContainer`}>
      <div className="articleCardHeader">
        <div className="authorAvatar"></div>
        <p className="authorName">{article.authorName}</p>
        <span className="articleDate">{article.publishDate}</span>
      </div>

      <div className="articleCardBody">
        <div className="articleCardContent">
          <h1 className="articleCardTitle">
            {article.title}
          </h1>
          <div className="articlecategories">
            {article?.categories.map((categorie) => (<span key={categorie}>{categorie}</span>))}
          </div>
          <p className={`articleCardSummary ${merrweather.className}`}>
            {article.summary}
          </p>
        </div>
        <div className="articleCardCoverImage"></div>
      </div>

      <div className="articleFooter">
        <span className="articleReadTime">{article.readTime}</span>
        <div className="footerActionBtn">
          <span><BookmarkBorderIcon /></span> <span><ShareIcon /></span>
        </div>
      </div>
    </article>
  );
}

export default ArticleCard;
