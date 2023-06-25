"use client";
import React from "react";
import { merrweather } from "../public/util/fonts";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import ShareIcon from "@mui/icons-material/Share";
import { formatDate, limitText } from "@/public/util/helpers";
import Link from "next/link";
function ArticleCard({ article }) {
  return (
    <article className={`articleCardContainer`}>
      <div className="articleCardHeader">
        <Link href={`/${article.authorUsername}`}><div
          style={{ background: `url(${article.authorAvatar})` }}
          className="authorAvatar"
        ></div></Link>
        <Link href={`/${article.authorUsername}`}><p className="authorName">{article.authorName}</p></Link>
        <span className="articleDate">{formatDate(article.publishDate)}</span>
      </div>

      <div className="articleCardBody">
        <div style={{width: `${article.coverImage == "" ? '100%' : '70%'}`}} className="articleCardContent">
          <Link href={`/${article.authorUsername}/${article.slug}`}>
            <h1 className="articleCardTitle">{article.title}</h1>
          </Link>
          <div className="articlecategories">
            {article?.tags.split(",").map((categorie, index) => (
              <Link key={index} href={`/search/?q=${categorie}&class=articles`}><span key={categorie}>{categorie}</span></Link>
            ))}
          </div>
          <Link href={`/${article.authorUsername}/${article.slug}`}><p className={`articleCardSummary ${merrweather.className}`}>
            {limitText(article.summary, 35)}
          </p></Link>
        </div>
        {article.coverImage !== "" && (
          <div
            style={{ background: `url(${article.coverImage})` }}
            className="articleCardCoverImage"
          ></div>
        )}
      </div>

      <div className="articleFooter">
        <span className="articleReadTime">5 mins read time</span>
        <div className="footerActionBtn">
          <span>
            <BookmarkBorderIcon />
          </span>{" "}
          <span>
            <ShareIcon />
          </span>
        </div>
      </div>
    </article>
  );
}

export default ArticleCard;
