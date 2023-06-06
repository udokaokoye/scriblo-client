"use client";

import React, {useState} from "react";
import ArticleCard from "./ArticleCard";
import ArticleShowcase from "./ArticleShowcase";
import { Key } from "@mui/icons-material";

function RecentArticles({ topics, source_Sans_Pro, articles }) {
  const [topic, settopic] = useState('Recommended')
  return (
    <div className={`recentArticlesContainer ${source_Sans_Pro.className}`}>
      <div className="header">
        <h3>Recent Articles</h3>
        <p>Discover recent article from writers on any topic</p>
      </div>

      <div className="topicsBar">
        <div className="topic">Recommended</div>
        {topics?.length > 0 && topics.map((topic, index) => (
          <div key={index} className="topic">{topic}</div>
        ))}
      </div>
      <small className="seeMoreTopics">See more topics</small>
      <br />
      <br />
      <ArticleShowcase />
      <br /><br />
      <div className="articleCards">
        {articles.map((article, index) => (
          <React.Fragment key={index}>
            <ArticleCard article={article} />
            <br />
            <br />
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

export default RecentArticles;
