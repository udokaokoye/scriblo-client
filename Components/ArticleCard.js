'use client'
import React from "react";
import { merrweather } from "../public/util/fonts";
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import ShareIcon from '@mui/icons-material/Share';
import { formatDate, limitText } from "@/public/util/helpers";
function ArticleCard({ article }) {
  return (
    <article className={`articleCardContainer`}>
      <div className="articleCardHeader">
        <div style={{background: `url(${article.authorAvatar})`}} className="authorAvatar"></div>
        <p className="authorName">{article.authorName}</p>
        <span className="articleDate">{formatDate(article.publishDate)}</span>
      </div>

      <div className="articleCardBody">
        <div className="articleCardContent">
          <h1 className="articleCardTitle">
            {article.title}
          </h1>
          <div className="articlecategories">
            {article?.tags.split(",").map((categorie) => (<span key={categorie}>{categorie}</span>))}
          </div>
          <p className={`articleCardSummary ${merrweather.className}`}>
            {limitText(article.summary, 35)}
          </p>
        </div>
        {article.coverImage !== "" && (<div style={{background:`url(${article.coverImage})`}} className="articleCardCoverImage"></div>)}
      </div>

      <div className="articleFooter">
        <span className="articleReadTime">5 mins read time</span>
        <div className="footerActionBtn">
          <span><BookmarkBorderIcon /></span> <span><ShareIcon /></span>
        </div>
      </div>
    </article>
  );
}

export default ArticleCard;
