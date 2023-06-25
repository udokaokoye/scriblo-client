"use client";
import PushPinOutlinedIcon from "@mui/icons-material/PushPinOutlined";
function ProfilePinnedArticles({ pinnedArticles }) {
  return (
    <div className="profilePinnedArticlesContainer">
      <h3>
        Pinned Articles <PushPinOutlinedIcon className="pinIcon" />
      </h3>

      {pinnedArticles?.length > 0 ? (
        pinnedArticles.map((article, index) => (
            <p key={index}>pinned article</p>
        ))
      ) : (
        <p><br /> No pinned articles</p>
      )}
    </div>
  );
}

export default ProfilePinnedArticles;
