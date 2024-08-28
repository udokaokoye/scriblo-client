"use client";
import { useState, useEffect, useLayoutEffect } from "react";
import CommentInput from "./CommentInput";
import { source_Sans_Pro } from "@/public/util/fonts";
import CommentDisplayCard from "./CommentDisplayCard";
import Link from "next/link";
import { commentPost, getComments } from "@/public/util/apiHelpers";
  function Comments({ session, postId }) {
    const [allComments, setallComments] = useState([])
  const [commentInput, setcommentInput] = useState("");
  const [isSubmitting, setisSubmitting] = useState(false)
  const commentPostHandler = async () => {
    if (commentInput == "") {
      return;
    }
    setisSubmitting(true)

    const response = await commentPost(postId, commentInput, session?.id, "");
    setcommentInput("");
    setisSubmitting(false)
    fetchCommnets()
  };

  const fetchCommnets = async () => {
    setallComments(await getComments(postId))
    console.log('fetched')
  }
useEffect(() => {
  const getData = async () => {
    await fetchCommnets()
  }
  getData()
}, [])



  return (
    <div className={`commentsContainer ${source_Sans_Pro.className}`}>
      <h1>Comments {allComments?.length > 0 && `(${allComments?.length})`}</h1>
      {allComments == null && (
        <div className="noComment">
        <p>There are no comments for this article</p>
        <span>Be the first to comment and start the conversation</span>
      </div>
      )}
      <br />
      {session?.token ? (
        <>
          <CommentInput
            userAvatar={session?.avatar}
            commentInput={commentInput}
            setcommentInput={setcommentInput}
            commentPostHandler={commentPostHandler}
            isSubmitting={isSubmitting}
          />
          <br />
          <br />
          {allComments?.length > 0 ? (
            allComments?.filter((cmt) => cmt?.replyId == null).map((comment, index) => (
              <div key={index}>
                <CommentDisplayCard session={session} comment={comment} replies={allComments.filter((cmt) => cmt.replyId == comment.id)} fetchCommnets={fetchCommnets} allComments={allComments} />
              </div>
            ))
          ) : (
            ''
          )}
        </>
      ) : (
        <div className="signinToComment">
          <p>Please sign in to comment or view comment</p>
          <Link href={"/signup"}>
            <button className="btn">Sign In</button>
          </Link>
        </div>
      )}
    </div>
  );
}

export default Comments;
