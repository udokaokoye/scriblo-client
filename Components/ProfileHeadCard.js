"use client";
import { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import InsertLinkOutlinedIcon from "@mui/icons-material/InsertLinkOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { formatDate, limitText } from "@/public/util/helpers";
import { followUser } from "@/public/util/apiHelpers";
import Link from "next/link";
import Verified from "./Verified";
import Popup from "./Popup";
function ProfileHeadCard({
  session,
  profile,
  follows,
  ServerdoesSignedInUserFollowProfile,
}) {

  const [doesSignedInUserFollowProfile, setdoesSignedInUserFollowProfile] =
    useState(ServerdoesSignedInUserFollowProfile);

  const followUserHandler = async () => {
    if (session?.id) {
      setdoesSignedInUserFollowProfile(!doesSignedInUserFollowProfile);
      const followUserResponse = await followUser(profile?.id, session?.id);
      if (followUserResponse.message == "followed") {
        setdoesSignedInUserFollowProfile(true);
      } else if (followUserResponse.message == "unfollowed") {
        setdoesSignedInUserFollowProfile(false);
      }
    }
  };
  console.log(follows)
  return (
    <div className="profileHeadCardContainer">
      {/* {showFollowList && <Popup popupContent={'followList'} closePopup={() => setshowFollowList(false)} />} */}
      <div className="profileCoverImage">
        <div className="overlay"></div>
        {session?.email && session.id == profile?.id && (
          <div className="changeCoverInput" style={{ display: "none" }}>
            Change cover image
          </div>
        )}
      </div>
      <div
        style={{ background: `url(${profile?.avatar})` }}
        className="profileAvatar"
      ></div>
      <div className="profileInfo">
        <div className="profileNameAndFollowBtn">
          <h3>{profile?.name} {profile.verified == '1' && <Verified size={25} />}</h3>
          {session?.id !== profile?.id ? (
            <div className="followAndEmailBtn">
              <button
                className="followBtn btn"
                onClick={() => followUserHandler()}
              >
                <AddIcon className="profileIcon" />
                {doesSignedInUserFollowProfile ? "Unfollow" : "Follow"}
              </button>
              <button className="emailBtn btn">
                <EmailOutlinedIcon className="profileIcon" /> Email
              </button>
            </div>
          ) : (
            <div className="followAndEmailBtn">
              <Link href={`/${profile.username}/settings`}>
                <button className="emailBtn btn">
                  <EditOutlinedIcon className="profileIcon" />
                  Edit Profile
                </button>
              </Link>
            </div>
          )}
        </div>




        <div className="follows">
          <Link href={`/${profile?.username}/followers`}><span>{follows?.followers?.length} Followers</span></Link>
          <Link href={`/${profile?.username}/following`}><span>{follows?.followings?.length} Following</span></Link>
        </div>



        <p className="profileBio">{profile?.bio}</p>
        <div className="profileDateAndUrl">
          <span>
            {" "}
            <CalendarTodayOutlinedIcon className="profileIcon" /> Joined{" "}
            {formatDate(profile?.createdAt)}
          </span>
          {profile?.url ? (
            <span>
              <InsertLinkOutlinedIcon className="profileIcon" />{" "}
              {limitText(profile?.url, 10)}
            </span>
          ) : (
            <Link href={`/${session?.username}/settings`}><span>
              <InsertLinkOutlinedIcon className="profileIcon" />{" "}
              {session?.id == profile?.id
                ? "Add a link to your profile"
                : "No link added"}
            </span></Link>
          )}
        </div>
        <div className="profileInterests">
          {profile?.interests.split(",").map((interest, index) => (
            <span key={index}>{interest}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProfileHeadCard;
