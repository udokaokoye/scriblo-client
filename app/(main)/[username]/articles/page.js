"use client";
import ClientProtectedRoute from "@/Components/ClientProtectedRoute";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import "@/Styles/userArticles.css";
import { useEffect, useState } from "react";
import { source_Sans_Pro } from "@/public/util/fonts";
import ArticleCard from "@/Components/ArticleCard";
import UserArticleCard from "@/Components/UserPersonalArticleCard";
import UserPersonalArticleCard from "@/Components/UserPersonalArticleCard";

function userArticles({ params }) {
  const { data: session } = useSession();
  const [tab, settab] = useState("drafts");
  const [allposts, setallposts] = useState([]);
  //   useEffect(() => {
  //     if (session?.username !== params?.username) {
  //       redirect("/");
  //     }
  //   }, [session]);

  useEffect(() => {
    if (params?.username) {
      const fetchPosts = async () => {
        const userPostsResponse = await fetch(
          `/api/posts/actions.php?data=posts_username&username=${params.username}`
        );
        const userPostsData = await userPostsResponse.json();
        // console.log(userPostsData.data);
        setallposts(userPostsData.data);
      };
      fetchPosts();
    }
  }, [params?.username]);

  return (
    <ClientProtectedRoute>
      <div className={`userArticlesContainer ${source_Sans_Pro.className}`}>
        <h1>Your Articles</h1>

        <div className="tabs">
          <span
            className={`${tab == "drafts" ? "active" : ""}`}
            onClick={() => settab("drafts")}
          >
            Drafts
          </span>
          <span
            className={`${tab == "published" ? "active" : ""}`}
            onClick={() => settab("published")}
          >
            Published
          </span>
        </div>

        {tab == "drafts" && (
          <div className="draftsTab">
            {allposts.length > 0 &&
              allposts
                .filter((pst) => pst.isHidden == 1)
                .map((post) => (
                  <div key={post.id}>
                    <UserPersonalArticleCard userArticle={post} />
                    <br />
                  </div>
                ))}
          </div>
        )}

        {tab == "published" && (
          <div className="publishedTab">
            {allposts.length > 0 &&
              allposts
                .filter((pst) => pst.isHidden == 0)
                .map((post) => (
                  <div key={post.id}>
                    <UserPersonalArticleCard userArticle={post} />
                    <br />
                  </div>
                ))}
          </div>
        )}
      </div>
    </ClientProtectedRoute>
  );
}

export default userArticles;
