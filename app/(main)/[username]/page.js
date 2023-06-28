import React from "react";
import "@/Styles/profile.css";
import ProfileHeadCard from "@/Components/ProfileHeadCard";
import { source_Sans_Pro } from "@/public/util/fonts";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/authentication/[...nextauth]/route";
import ProfilePinnedArticles from "@/Components/ProfilePinnedArticles";
import NotFound from "@/Components/NotFound";
import ArticleCard from "@/Components/ArticleCard";
async function Profile({ params }) {
  const session = await getServerSession(authOptions);

  const userResponse = await fetch(
    `${process.env.API_URL}/users/actions.php?action=getUser&username=${params.username}`
  );
  const userData = await userResponse.json();
  const user = userData.data;

  const userPostsResponse = await fetch(
    `${process.env.API_URL}/posts/actions.php?data=posts_username&username=${params.username}`
  );
  const userPostsData = await userPostsResponse.json();
  const userPosts = userPostsData.data;


  const userFollowsResponse = await fetch(`${process.env.API_URL}/users/actions.php?action=getUserFollows&userId=${user?.id}`)
  const userFollowsData = await userFollowsResponse.json()
  const userFollows = userFollowsData.data
  let ServerdoesSignedInUserFollowProfile = false
  if (session?.id) {
    ServerdoesSignedInUserFollowProfile = userFollows.followers.some((userFollow) => userFollow.user_id == session?.id)
    console.log(ServerdoesSignedInUserFollowProfile)
  }


  // }
  return (
    <div className={`profileContainer ${source_Sans_Pro.className}`}>
      {/* {params.username} */}
      {user !== null ? (
        <>
          <ProfileHeadCard session={session} profile={user} follows={userFollows} ServerdoesSignedInUserFollowProfile={ServerdoesSignedInUserFollowProfile}/>
          <div style={{ padding: 40 }}>
            <ProfilePinnedArticles pinnedArticles={userPosts?.filter((post) => post.pinned == 'true')} />
            <br /><br />
            <h3>Articles</h3>
            <br /><br />

            {userPosts?.length > 0 ? (
              userPosts.map((post, index) => (
              <>
              <ArticleCard key={index} article={post} />
              <br />
              </>
                ))
            ) : (
              <NotFound reason={'no_post_for_user'} />
            )}
          </div>
        </>
      ) : (
        "NO USER FOUND"
      )}
    </div>
  );
}

export default Profile;
