import React from "react";
import "../Styles/notFound.css";
import Link from "next/link";
function NotFound({ reason, searchClass }) {
  return (
    <div className="notFoundContainer">
      {reason == "no_category" && (
        <>
          <div
            className="notfoundBG"
            style={{
              background: `url(https://scriblo.s3.us-east-2.amazonaws.com/branding/empty-box.png)`,
            }}
          ></div>
          <h3>Oops! Category Not Found</h3>
          <p>
            Hey lad, we tried but we couldn't find that category you're looking
            for. <br /> Our team will be working to add that soon, mean while
            browse these categories
          </p>
          <small>I promise these ones exist 🥺</small>
          <div className="suggestedCategories">
            <span>category</span>
            <span>category</span>
            <span>category</span>
          </div>
        </>
      )}

      {reason == "no_post_for_category" && (
        <>
          <div
            className="notfoundBG"
            style={{
              background: `url(https://scriblo.s3.us-east-2.amazonaws.com/branding/sad+man.png)`,
            }}
          ></div>
          <h3>Snap! No Post Found For That Category</h3>
          <p>
            Hey lad, we just launched so we do not have any article for that
            category at the moment <br /> Feeling brave? be the first to write
            an article.
          </p>
          <br />
          <small>C'mon you gat this 💪</small>
          <Link href={"/create"}>
            <button className="btn">Write Article</button>
          </Link>
        </>
      )}

      {reason == "no_search_article" && (
        <>
          <div
            className="notfoundBG"
            style={{
              background: `url(${
                searchClass == "articles" || searchClass == "tags"
                  ? "https://scriblo.s3.us-east-2.amazonaws.com/branding/sad+man.png"
                  : "https://scriblo.s3.us-east-2.amazonaws.com/branding/no+user.png"
              })`,
            }}
          ></div>
          {searchClass == "articles" ? (
            <h3>Snap! No Post Found For That Keyword</h3>
          ) : searchClass == "people" ? (
            <h3>Snap! No User Found With That Name</h3>
          ) : searchClass == "tags" ? (<h3>Snap! No Post Found For That Category</h3>) : ''}

          {searchClass == "articles" || searchClass == "people" ? (
              <p>
                Make sure all words are spelled correctly <br /> try searching a
                more general keyword
              </p>
            ) : ''}

            {searchClass == "tags"  && (
              <p>
                Make sure all words are spelled correctly <br /> try searching a
                more general keyword
              </p>
            )
            }
          <br />
          <Link href={"/explore"}>
            <button className="btn">Let's try that again</button>
          </Link>
        </>
      )}
    </div>
  );
}

export default NotFound;
