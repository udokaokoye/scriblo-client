"use client";

function CommentInput({
  userAvatar,
  commentInput,
  setcommentInput,
  replyId = null,
  commentPostHandler,
  isSubmitting = false,
}) {
  return (
    <div className="commentInputContainer">
      <div
        className={`userAvatar ${replyId !== null && "userAvatar_sm"}`}
        style={{ background: `url(${userAvatar})` }}
      ></div>
      <div className="inputAndSubmit">
        <textarea
          className="commentInput"
          placeholder="Share your thoughts"
          value={commentInput}
          onChange={(e) => setcommentInput(e.target.value)}
        />
        <button onClick={() => commentPostHandler()} className="btn">
          {isSubmitting ? (
            <span className="loader">...</span>
          ) : replyId == null ? (
            "Comment"
          ) : (
            "Reply"
          )}
        </button>
      </div>
    </div>
  );
}

export default CommentInput;
