'use client'
import { formatDate, limitText } from "@/public/util/helpers";
import { ArrowForward } from "@mui/icons-material";
import Image from "next/image";
import Link from "next/link";
import React from "react";

function ArticleShowcase({ article }) {
  return (
    <div
      className="articleShowcaseContainer"
      // style={{ background: `url(${article?.coverImage})` }}
    >
      <div className="articleCover">
    <Image src={article?.coverImage} fill={true}  alt={`IMAGE - ${article?.title}`}  />
      </div>
      <div className="articleAuthorandDate">
        <span>{article?.authorName}</span> • <span>{formatDate(article.createdAt)}</span>
      </div>
      <Link href={`/${article?.authorUsername}/${article?.slug}`}>
        <div className="artileContent">
          <div className="title-arrow">
          <h1>{limitText(article.title, 6)}</h1>
          <ArrowForward className="arrowForward" />
          </div>
          <p>{limitText(article.summary, 20)}</p>
          <span>{article?.readTime} mins read time</span>
        </div>
      </Link>

      <div className="articleTags">
        {article?.tags?.split(',').length >= 1 ? article?.tags?.split(',').slice(0,3).map((tg, index) => (
          <a className="tags" href={`/search/?q=${tg}&class=tags`} key={index}>{tg}</a>
        )) : <span>no tag</span>}
      </div>
    </div>
  );
}

export default ArticleShowcase;
