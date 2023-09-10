import { limitText } from "@/public/util/helpers";
import Link from "next/link";
import React from "react";

function ArticleShowcase({ article }) {
  return (
    <div
      className="articleShowcaseContainer"
      style={{ background: `url(${article?.coverImage})` }}
    >
      <Link href={`/${article?.authorUsername}/${article?.slug}`}>
        <div className="artileContent">
          <h1>{limitText(article.title, 6)}</h1>
          <p>{limitText(article.summary, 30)}</p>
          <span>5 mins read time</span>
        </div>
      </Link>
    </div>
  );
}

export default ArticleShowcase;
