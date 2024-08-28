'use client'
import Link from "next/link";
import React from "react";

function AddPostNavigation({
  savePost,
  stage,
  setstage,
  seteditorState,
  editorState,
  editing = false,
  redirect,
}) {
  return (
    <div className="addPostNavigation">
      <div className="logo">
        <Link href={"/"}>
          <div className="logoImg"></div>
        </Link>
        <span>{editing ? "Edit" : stage} Post</span>
      </div>

      <div className="menuBtns">
        {stage == "preview" ? (
          <button
            className="btn btnDanger"
            onClick={() => {
              setstage("create");
            }}
          >
            Cancel
          </button>
        ) : (
          <Link href={"/"}>
            <button className="btn btnDanger">Cancel</button>
          </Link>
        )}
        {/* <button className="btn btnBlue" onClick={() => setstage('preview')}>Save Draft</button> */}
        {stage !== "preview" && (
          <button
            className="btn"
            onClick={() => {
              setstage("preview");
              seteditorState(editorState);
            }}
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
}

export default AddPostNavigation;
