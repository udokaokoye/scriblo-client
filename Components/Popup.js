"use client";
import React, { useState } from "react";
import "@/Styles/popup.css";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import InsertLinkIcon from "@mui/icons-material/InsertLink";
import Link from "next/link";
function Popup({
  closePopup,
  profilePhotoRef,
  popupContent,
  user,
  previewArticleDetails,
  copyPreviewLink,
}) {
  const [updatedName, setupdatedName] = useState(user?.name);
  const [updatedBio, setupdatedBio] = useState(user?.bio);
  return (
    <div
      className="popupContainer"
    style={{
        height: popupContent == "followList" && '100%', 
        // background: popupContent == "followList" && "transparent" 
    }}
    >
      <div className="popupcloserdiv" onClick={() => closePopup()}></div>
      <div className="popupContent">
        {popupContent === "editProfile" && (
          <div className="editProfilePopup">
            <div className="popupHeader">
              <h3>Profile Information</h3>
              <span onClick={() => closePopup()}>
                <CloseOutlinedIcon />
              </span>
            </div>

            <div className="updatePhoto">
              <div
                style={{ background: `url(${user?.avatar})` }}
                className="currentProfilePhoto"
              ></div>
              <div className="photoActions">
                <span>Update</span> <span>Remove</span>
              </div>
              <input
                type="file"
                name="profilephoto"
                id="profilephoto"
                ref={profilePhotoRef}
                style={{ display: "none" }}
              />
            </div>

            <div className="updateField">
              <span>Name</span>
              <input
                type="text"
                placeholder="Enter updated name"
                value={updatedName}
                onChange={(txt) => setupdatedName(txt.target.value)}
              />
              <small>Appears on your profile</small>
            </div>

            <div className="updateField">
              <span>Bio</span>
              <textarea
                type="text"
                placeholder="Enter Bio"
                value={updatedBio}
                onChange={(txt) => setupdatedBio(txt.target.value)}
              />
              <small>Appears on your profile</small>
            </div>

            <div className="updateProfileBtns">
              <button onClick={() => closePopup()} className="cancel">
                Cancel
              </button>
              <button className="save">Save</button>
            </div>
          </div>
        )}

        {popupContent === "previewCodeUrl" && (
          <div className="editProfilePopup previewCodeUrlPopup">
            <h1 className="previewCodeUrlTitle">Your Preview Link Is Ready!</h1>
            <p>Share this link with friends/editors to look at your article.</p>

            <span className="previewCodeText">Preview Code</span>
            <p className="previewCode">{previewArticleDetails.code}</p>

            <span className="previewLink">{previewArticleDetails.url}</span>

            <small>
              *You can still access these details in your Drafts page.
            </small>
            <div className="previewCodeUrlBtns">
              <button
                onClick={() => copyPreviewLink(previewArticleDetails.url)}
              >
                {" "}
                <InsertLinkIcon /> Copy Url
              </button>
              <Link href={"/"}>
                <button className="cancelBtn" onClick={() => closePopup()}>
                  {" "}
                  Close
                </button>
              </Link>
            </div>
          </div>
        )}

        {popupContent === "followList" && (
          <div className="followsContainer">
            <div className="followsHeader">
              <span>Followers</span>
              <span>x</span>
            </div>

            <div className="followItem">
              <div className="followAvatar"></div>
              <div className="followInfo">
                <span className="followName">Demo Name</span>
                <span className="followUsername">@demoUsername</span>
              </div>

              <div className="followActionBtn">Action</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Popup;
