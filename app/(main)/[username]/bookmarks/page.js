"use client";
import React, { useEffect, useState } from "react";
import "@/Styles/bookmarks.css";
import BookmarkOutlinedIcon from "@mui/icons-material/BookmarkOutlined";
import { source_Sans_Pro } from "@/public/util/fonts";
import { deleteBookmark, getBookmarks } from "@/public/util/apiHelpers";
import { useSession } from "next-auth/react";
import ArticleCard from "@/Components/ArticleCard";
function Bookmark() {
  const { data: session } = useSession();
  const [userBookmarks, setuserBookmarks] = useState([]);
  const fetUserBookmarks = async () => {
    const response = await fetch(`/api/posts/actions.php?data=bookmarks&userId=${session?.id}`)
    const data = await response.json()
    const bookmarks = data.data
    console.log(bookmarks)
    setuserBookmarks(bookmarks);
  };
  useEffect(() => {
    fetUserBookmarks();
  }, [session]);

  const deleteBookmarkhandler = async (bookmarkId) => {
    await deleteBookmark(bookmarkId);
    await fetUserBookmarks();
  };

  return (
    <div className={`${source_Sans_Pro.className} bookmarksContainer`}>
      <h1>
        Your Bookmarks <BookmarkOutlinedIcon />
      </h1>
      <br />
      <br />

      {userBookmarks?.length > 0 ? userBookmarks.map((bookmarkPost, index) => (
        <div key={index}>
          <button className="removeBookmarkBtn" onClick={() => deleteBookmarkhandler(bookmarkPost.bookmarkId)}>Remove Bookmark</button>
          <ArticleCard article={bookmarkPost} />
          <br />
        </div>
      )) : (
        <p>You don't have any saved posts</p>
      )}
    </div>
  );
}

export default Bookmark;
