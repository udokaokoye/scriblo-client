"use client";
import React, { useState, useEffect } from "react";
import { inter, merrweather } from "../public/util/fonts";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import PushPinOutlinedIcon from "@mui/icons-material/PushPinOutlined";
import EditOutlined from "@mui/icons-material/EditOutlined";
import DeleteSweepOutlined from "@mui/icons-material/DeleteSweepOutlined";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import ShareIcon from "@mui/icons-material/Share";
import { formatDate, limitText } from "@/public/util/helpers";
import Link from "next/link";
import Verified from "./Verified";
import { deletePost, pinArticle, unpinArticle } from "@/public/util/apiHelpers";
import { useRouter } from "next/navigation";
import { ContentState, convertToRaw } from "draft-js";
import { DeleteObjectCommand, S3Client } from "@aws-sdk/client-s3";
// import htmlToDraft from "html-to-draftjs";

function ArticleCard({ article, fromProfilePage=false, session,handleDelete }) {
  const [showMoreMenu, setshowMoreMenu] = useState(false);
  const [loading, setloading] = useState(false)
  const router = useRouter()
let htmlToDraft;
let blocksFromHTML;
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
      if (typeof window !== "undefined") {
        htmlToDraft = require("html-to-draftjs").default;
       blocksFromHTML = htmlToDraft(content);
      }
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

    //  alert("Deleted")
     setshowMoreMenu(false)
     router.refresh()
    }
  };
  return (
    <article className={`articleCardContainer`}>
      <div className="articleCardHeader">
        <Link href={`/${article.authorUsername}`}>
          <div
            style={{ background: `url(${article.authorAvatar})` }}
            className="authorAvatar"
          ></div>
        </Link>
        <Link href={`/${article.authorUsername}`}>
          <p className="authorName">{article.authorName}</p>{" "}
        </Link>
        {article.authorVerified == "1" && <Verified />}
      </div>
      <span className="articleDate">{formatDate(article.createdAt)}</span>

      <div className="articleCardBody">
        <div
          style={{ width: `${article.coverImage == "" ? "100%" : "70%"}` }}
          className="articleCardContent"
        >
          <Link href={`/${article.authorUsername}/${article.slug}`}>
            <h1 className="articleCardTitle">{article.title}</h1>
          </Link>
          <div className="articlecategories">
            {article?.tags
              .split(",")
              .slice(0, 3)
              .map((categorie, index) => (
                <Link
                  key={index}
                  href={`/search/?q=${categorie}&class=articles`}
                >
                  <span key={categorie}>{categorie}</span>
                </Link>
              ))}
          </div>
          <Link href={`/${article.authorUsername}/${article.slug}`}>
            <p className={`articleCardSummary ${inter.className}`}>
              {limitText(article.summary, 35)}
            </p>
          </Link>
        </div>
        {article.coverImage !== "" && (
          <div
            style={{ background: `url(${article.coverImage})` }}
            className="articleCardCoverImage"
          ></div>
        )}
      </div>

      <div className="Mobilearticlecategories">
        {article?.tags
          .split(",")
          .slice(0, 3)
          .map((categorie, index) => (
            <Link  key={index} href={`/search/?q=${categorie}&class=articles`}>
              <span  key={categorie}>{categorie}</span>
            </Link>
          ))}
      </div>

      <div className="articleFooter">
        <span className="articleReadTime">{article?.readTime} mins read time</span>
        <div className="footerActionBtn">
          <span>
            <BookmarkBorderIcon className="ftIcon" />
          </span>{" "}
          <span>
            <ShareIcon className="ftIcon" />
          </span>
          <span onClick={() => setshowMoreMenu(!showMoreMenu)}>
            <MoreHorizIcon className="ftIcon" />
          </span>
        </div>
      </div>

  {
    fromProfilePage && session && session.id == article.authorId && showMoreMenu && (
          <div className="moreMenu">
            <span className="moreMenuItem" onClick={() => {
              article?.pinned == 'true' ? unpinArticle(article?.id) : pinArticle(article?.id)
              router.refresh()
              setshowMoreMenu(false)
            }}><PushPinOutlinedIcon className="pinIcon" /> {article?.pinned == 'true' ? 'Unpin' : 'Pin' }</span>
            <a href={`/edit/${article?.id}`}><span> <EditOutlined /> Edit Article</span></a>
            <span onClick={() => deletePostHandler(article?.id, article?.content, article?.coverImage)} style={{color: 'red'}}> <DeleteSweepOutlined color='warning' /> Delete</span>
          </div>
        )}
    </article>
  );
}

export default ArticleCard;
