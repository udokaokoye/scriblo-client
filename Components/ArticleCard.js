"use client";
import React, { useState } from "react";
import { inter, merrweather } from "../public/util/fonts";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import PushPinOutlinedIcon from "@mui/icons-material/PushPinOutlined";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import ShareIcon from "@mui/icons-material/Share";
import { formatDate, limitText } from "@/public/util/helpers";
import Link from "next/link";
import Verified from "./Verified";
import { pinArticle, unpinArticle } from "@/public/util/apiHelpers";
import { useRouter } from "next/navigation";
function ArticleCard({ article, fromProfilePage=false, session }) {
  const [showMoreMenu, setshowMoreMenu] = useState(false);
  const router = useRouter()
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
          </div>
        )}
    </article>
  );
}

export default ArticleCard;
