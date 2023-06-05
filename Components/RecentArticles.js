"use client";

import React from "react";
import ArticleCard from "./ArticleCard";

function RecentArticles({ topics, source_Sans_Pro, articles }) {
  return (
    <div className={`recentArticlesContainer ${source_Sans_Pro.className}`}>
      <div className="header">
        <h3>Recent Articles</h3>
        <p>Discover recent article from writers on any topic</p>
      </div>

      <div className="topicsBar">
        {topics.map((topic) => (
          <div className="topic">{topic}</div>
        ))}
      </div>
      <small className="seeMoreTopics">See more topics</small>
      <br />
      <br />
      <div className="articleCards">
        {articles.map((article) => (
          <>
            <ArticleCard article={article} />
            <br />
            <br />
          </>
        ))}
      </div>
    </div>
  );
}

export default RecentArticles;
