"use client";

import React, {useState} from "react";
import ArticleCard from "./ArticleCard";
import ArticleShowcase from "./ArticleShowcase";
import Link from "next/link";
import { getTagID } from "@/public/util/helpers";
import NotFound from "./NotFound";
import OptionsBar from './OptionsBar'

function RecentArticles({ topics, source_Sans_Pro, articles, session }) {



  return (
    <div className={`recentArticlesContainer ${source_Sans_Pro.className}`}>
      <div className="header">
        <h3>Recent Articles</h3>
        <p>Discover recent article from writers on any topic</p>
      </div>

      <OptionsBar options={topics} source={'/'} />
      <Link href={'/explore'}><small className="seeMoreTopics">See more topics</small></Link>
      <br />
      <br />
      {articles?.length > 0 && <ArticleShowcase 
      article={articles[0]} 
      />}
      <br /><br />
      <div className="articleCards">
        {articles?.length >0 ? articles?.slice(1, articles?.length).map((article, index) => (
          <React.Fragment key={index}>
            <ArticleCard article={article} />
            <br />
            <br />
          </React.Fragment>
        )) : <NotFound reason={'no_post_for_category'} />
        }
      </div>
    </div>
  );
}

export default RecentArticles;
