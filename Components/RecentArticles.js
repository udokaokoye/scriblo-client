"use client";

import React, { useEffect, useState } from "react";
import ArticleCard from "./ArticleCard";
import ArticleShowcase from "./ArticleShowcase";
import Link from "next/link";
import { getTagID } from "@/public/util/helpers";
import NotFound from "./NotFound";
import OptionsBar from "./OptionsBar";

function RecentArticles({ topics, source_Sans_Pro, articles, session }) {
  const [loadMore, setloadMore] = useState(false);
  const [visibleArticles, setvisibleArticles] = useState(articles);
  useEffect(() => {
   setvisibleArticles(articles?.slice(1, 7));
    setloadMore(articles?.length > 7);
  }, []);

  const handleLoadMore = () => {
    const nextVisiblePosts = articles.slice(1, visibleArticles.length + 7);
    setvisibleArticles(nextVisiblePosts);
    setloadMore(nextVisiblePosts.length < articles.length);
  };

  return (
    <div className={`recentArticlesContainer ${source_Sans_Pro.className}`}>
      <div className="header">
      <span id="articles"></span>
        <h3>Recent Articles</h3>
        <p>Discover recent article from writers on any topic</p>
      </div>

      <OptionsBar options={topics} source={"/"} />
      <Link href={"/explore"}>
        <small className="seeMoreTopics">See more topics</small>
      </Link>
      <br />
      
      <br />
      {articles?.length > 0 && <ArticleShowcase article={articles[0]} />}
      <br />
      <br />
      <div className="articleCards">
        {articles?.length > 0 ? (
          visibleArticles?.map((article, index) => (
              <React.Fragment key={index}>
                <ArticleCard article={article} />
                <br />
              </React.Fragment>
            ))
            // (<button>load more</button>)
        ) : (
          <NotFound reason={"no_post_for_category"} />
        )}
        {loadMore && <button className="loadMoreBtn" onClick={() => handleLoadMore()}>load more...</button>}
      </div>
    </div>
  );
}

export default RecentArticles;
