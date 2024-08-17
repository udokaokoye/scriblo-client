"use client";
import { useState } from "react";
import MoreHorizOutlinedIcon from "@mui/icons-material/MoreHorizOutlined";
import ReplyOutlinedIcon from "@mui/icons-material/ReplyOutlined";
import FlagOutlinedIcon from "@mui/icons-material/FlagOutlined";
import DeleteSweepOutlinedIcon from "@mui/icons-material/DeleteSweepOutlined";
import CommentInput from "./CommentInput";
import { commentPost, deleteComment } from "@/public/util/apiHelpers";
import { formatDate } from "@/public/util/helpers";
import Link from "next/link";
import Verified from "./Verified";
function CommentDisplayCard({ comment, session, fetchCommnets, replies, nested=false, allComments }) {
  const [showMoreMenu, setshowMoreMenu] = useState(false);
  const [commentInput, setcommentInput] = useState("");
  const [showReplyInput, setshowReplyInput] = useState(false);
  const [showReplies, setshowReplies] = useState(false)
  const commentPostHandler = async () => {
    if (commentInput == "") {
      return;
    }
    await commentPost(comment.postId, commentInput, session?.id, comment.id);
    setcommentInput("");
    fetchCommnets();
  };

  const deleteCommentHandler = async () => {
    if (confirm("Are you sure you want to delte this comment? this action cannot be undone")) {
      await deleteComment(comment.id)
      fetchCommnets()
    }
  }
  return (
    <div className="commentDisplayCardContainer">
      <div className="commentDisplayHeader">
        <Link href={`/${comment.authorUsername}`}><div
          style={{ background: `url(${comment.authorAvatar})` }}
          className={`commentAuthorAvatar ${nested && 'avatar_sm'}`}
        ></div></Link>
        <div className="commentAuthorNameDateContainer">
          <Link href={`/${comment.authorUsername}`}><p className="commentAuthorName"> {comment.authorName} {comment.authorVerified == '1' && <Verified />}</p></Link>
          <span className="commentPublishDate">
            {formatDate(comment.createdAt)}
          </span>
        </div>

        <span
          onClick={() => setshowMoreMenu(!showMoreMenu)}
          className="moreOptionIcon"
        >
          <MoreHorizOutlinedIcon />
        </span>
        <div
          style={{ display: showMoreMenu ? "block" : "none" }}
          className="moreMenu"
        >
          <div className="moreMenuItem">
            <FlagOutlinedIcon /> Report
          </div>
          {session?.id == comment.userID && (
            <div onClick={() => deleteCommentHandler()} className="moreMenuItem deleteMenu">
              <DeleteSweepOutlinedIcon color="red" /> Delete
            </div>
          )}
        </div>
      </div>

        <p className="commentText">{comment.content}</p>
      <div className="repliesActions">
        <span onClick={() =>  setshowReplies(!showReplies)} className="repliesBtn">{replies?.length} replies</span>
        <span
          className="replyBtn"
          onClick={() => setshowReplyInput(!showReplyInput)}
        >
          <ReplyOutlinedIcon className="replyIcon" /> Reply
        </span>
      </div>

      {showReplyInput && (
        <div className="replyCommentContainer">
          <CommentInput
            setcommentInput={setcommentInput}
            commentInput={commentInput}
            replyId={comment.id}
            userAvatar={session?.avatar}
            commentPostHandler={commentPostHandler}
          />
        </div>
      )}

      {
        showReplies && (
          <div className="showReplyContainer">
            {replies?.length > 0 && replies?.map((reply) => (
              <CommentDisplayCard comment={reply} session={session} fetchCommnets={fetchCommnets} replies={allComments?.filter((rp) => rp.replyId == reply.id)} nested={true} allComments={allComments} />
            ))}
          </div>
        )
      }
    </div>
  );
}

export default CommentDisplayCard;
