"use client";
import PushPinOutlinedIcon from "@mui/icons-material/PushPinOutlined";
import ArticleCard from "./ArticleCard";
function ProfilePinnedArticles({ pinnedArticles, session }) {
  return (
    <div className="profilePinnedArticlesContainer">
      <h3>
        Pinned Articles <PushPinOutlinedIcon className="pinIcon" />
      </h3>
    <br/>
      {pinnedArticles?.length > 0 ? (
        pinnedArticles.map((article, index) => (
            <div>
                <ArticleCard article={article} fromProfilePage={true} session={session}/>
              </div>
        ))
      ) : (
        <p><br /> No pinned articles</p>
      )}
    </div>
  );
}

export default ProfilePinnedArticles;
