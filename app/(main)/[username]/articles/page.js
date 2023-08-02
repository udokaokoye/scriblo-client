"use client";
import ClientProtectedRoute from "@/Components/ClientProtectedRoute";
import { useSession } from "next-auth/react";
import "@/Styles/userArticles.css";
import { useEffect, useState } from "react";
import { source_Sans_Pro } from "@/public/util/fonts";
import UserPersonalArticleCard from "@/Components/UserPersonalArticleCard";
import { deletePost } from "@/public/util/apiHelpers";
import { DeleteObjectCommand, S3Client } from "@aws-sdk/client-s3";
import htmlToDraft from "html-to-draftjs";
import { ContentState, convertToRaw } from "draft-js";
import { copyToClipboard, limitText } from "@/public/util/helpers";
import Head from "next/head";
import Loading from "@/Components/Loading";

function userArticles({ params }) {
  const { data: session } = useSession();
  const [tab, settab] = useState("drafts");
  const [allposts, setallposts] = useState([]);
  const [drafts, setdrafts] = useState([]);
  const [published, setpublished] = useState([]);
  const [loading, setloading] = useState(false);
  //   useEffect(() => {
  //     if (session?.username !== params?.username) {
  //       redirect("/");
  //     }
  //   }, [session]);

  const fetchPosts = async () => {
    setloading(true);
    const userPostsResponse = await fetch(
      `/api/posts/actions.php?data=posts_username&username=${params.username}`
    );
    const userPostsData = await userPostsResponse.json();
    console.log(userPostsData.data);
    setallposts(userPostsData.data);
    setdrafts(userPostsData.data?.filter((data) => data.isHidden == 1));
    setpublished(userPostsData?.data?.filter((data) => data.isHidden == 0));
    setloading(false);
  };

  useEffect(() => {
    if (params?.username) {
      fetchPosts();
    }
  }, [params?.username]);
  const getFileNameFromS3URL = (url) => {
    const parts = url.split("/");
    const fileNameWithExtension = parts[parts.length - 1];
    const fileName = fileNameWithExtension.split(".")[0];
    return fileName;
  };

  const deleteFromS3 = async (fileName) => {
    const bucketName = process.env.NEXT_PUBLIC_AWS_BUCKET_NAME;
    const bucketRegion = process.env.NEXT_PUBLIC_AWS_BUCKET_REGION;
    const bucketAccessKey = process.env.NEXT_PUBLIC_AWS_ACCESS_KEY;
    const bucketSecretKey = process.env.NEXT_PUBLIC_AWS_SECRET_KEY;

    const s3 = new S3Client({
      region: bucketRegion,
      credentials: {
        accessKeyId: bucketAccessKey,
        secretAccessKey: bucketSecretKey,
      },
    });

    const params = {
      Bucket: bucketName,
      Key: `images/${getFileNameFromS3URL(fileName)}.jpg`,
    };

    const command = new DeleteObjectCommand(params);

    const s3Result = await s3.send(command);
    console.log(s3Result);

    return s3Result.$metadata;
  };

  const deletePostHandler = async (postId, content, coverImage) => {
    if (
      confirm(
        "Are you sure you want to delete this article? this action cannot be undone"
      )
    ) {
      setloading(true);
      const blocksFromHTML = htmlToDraft(content);
      const editState = ContentState.createFromBlockArray(
        blocksFromHTML.contentBlocks,
        blocksFromHTML.entityMap
      );
      const rawContent = convertToRaw(editState);
      Object.values(rawContent.entityMap).map((item, index) => {
        if (item.type == "IMAGE") {
          deleteFromS3(item.data.src);
        }
      });

      if (coverImage !== "") {
        deleteFromS3(coverImage);
      }
      await deletePost(postId, session?.token);
      setloading(false);
      fetchPosts();
    }
  };

  return loading ? (
    <Loading />
  ) : (
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
            {drafts?.length > 0 ? (
              drafts.map((post) => (
                <div key={post.id}>
                  <UserPersonalArticleCard
                    deleteArticle={deletePostHandler}
                    userArticle={post}
                  />
                  <br />
                  {post.previewSlug !== null && (
                    <>
                      <h4>Preview Details</h4>
                      <br />
                      <div className="previewDetails">
                        <span className="previewCode">{post?.previewCode}</span>{" "}
                        <span
                          className="previewUrl"
                          onClick={() => {
                            copyToClipboard(
                              `myscriblo.com/preview/${post?.previewSlug}`
                            );
                            alert("url copied");
                          }}
                        >
                          myscriblo.com/preview/{post?.previewSlug}
                        </span>{" "}
                        <button>view code</button>
                      </div>
                    </>
                  )}
                  <br />
                  <br />
                </div>
              ))
            ) : (
              <h3>No Articles In Draft</h3>
            )}
          </div>
        )}

        {tab == "published" && (
          <div className="publishedTab">
            {published?.length > 0 ? (
              published.map((post) => (
                <div key={post.id}>
                  <UserPersonalArticleCard
                    deleteArticle={deletePostHandler}
                    userArticle={post}
                  />
                  <br />
                </div>
              ))
            ) : (
              <h3>No Published Article</h3>
            )}
          </div>
        )}
      </div>
    </ClientProtectedRoute>
  );
}

export default userArticles;
