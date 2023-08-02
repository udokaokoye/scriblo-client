import React, { use } from "react";
import { source_Sans_Pro } from "@/public/util/fonts";
import "../../../Styles/home.css";
import "../../../Styles/search.css";
import OptionsBar from "../../../Components/OptionsBar";
import PromoteScriblo from "@/Components/PromoteScriblo";
import ArticleShowcase from "@/Components/ArticleShowcase";
import ArticleCard from "@/Components/ArticleCard";
import NotFound from "@/Components/NotFound";
import UserCard from "@/Components/UserCard";
async function Search({ searchParams }) {
  const options = ["Articles", "People"];
  let searchResult = [];

  const query = searchParams.q;
  const searchClass = searchParams.class;
  const res = await fetch(
    `${process.env.API_URL}/posts/index.php?search=${query}&class=${searchClass}`,  {next: {revalidate: 20}}
  );

  const data = await res.json();
  console.log(data.data)
  searchResult = data.data;

  return (
    <div className={`${source_Sans_Pro.className} searchContainer`}>
      <div className="searchResultContainer">
        <h1>
          Search Results For <span>{query}</span>
        </h1>
        <OptionsBar options={options} source="/search" searchQuery={query} />
        <br />
        {/* checking if there is a search result before rendering anything */}
        {searchResult?.length > 0 ? (
            // if the user is searching for an article we will return the articleShowcase and articleCard
          searchClass == "articles" || searchClass == 'tags' ? (
            <>
              <ArticleShowcase article={searchResult[0]} />
              <br />
              <br />

              {searchResult?.map((article, index) => (
                <div key={index}>
                  <ArticleCard article={article} />
                  <br />
                </div>
              ))}
            </>
          ) : 
          // if the user is searching for an user we will return the userCard
          searchResult.map((user, index) => (
            <div key={index}>
                <UserCard user={user}  />
                <br />
                <br />
                <br />
            </div>
          ))
        ) : (
          <NotFound reason={"no_search_article"} searchClass={searchClass} />
        )}
      </div>

      <div className="searchSideBar">
        <PromoteScriblo />
      </div>
    </div>
  );
}

export default Search;
