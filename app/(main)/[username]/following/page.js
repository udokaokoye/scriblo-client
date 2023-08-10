import React from "react";
import "@/Styles/profile.css";
import ProfileHeadCard from "@/Components/ProfileHeadCard";
import { source_Sans_Pro } from "@/public/util/fonts";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/authentication/[...nextauth]/route";
import ProfilePinnedArticles from "@/Components/ProfilePinnedArticles";
import NotFound from "@/Components/NotFound";

import ArticleCard from "@/Components/ArticleCard";
import Link from "next/link";
import FollowUserCard from "@/Components/FollowUserCard";
async function Followers({ params }) {
  const session = await getServerSession(authOptions);

  const userResponse = await fetch(
    `${process.env.API_URL}/users/actions.php?action=getUser&username=${params.username}`
  );
  const userData = await userResponse.json();
  const user = userData.data;
  // console.log(user)

  const userPostsResponse = await fetch(
    `${process.env.API_URL}/posts/actions.php?data=posts_username&username=${params.username}`
  );
  const userPostsData = await userPostsResponse.json();
  const userPosts = userPostsData.data?.filter((pst) => pst.isHidden !== "1");

  const userFollowsResponse = await fetch(
    `${process.env.API_URL}/users/actions.php?action=getUserFollows&userId=${user?.id}`
  );
  const userFollowsData = await userFollowsResponse.json();
  const userFollows = userFollowsData.data;
  console.log(userFollows);
  let ServerdoesSignedInUserFollowProfile = false;
  if (session?.id) {
    ServerdoesSignedInUserFollowProfile = userFollows.followers.some(
      (userFollow) => userFollow.user_id == session?.id
    );
    console.log(ServerdoesSignedInUserFollowProfile);
  }

  // }
  return (
    <div className={`profileContainer ${source_Sans_Pro.className}`}>
      <Link href={`/${user?.username}`}>
        <div className="followsOverlayCloser"></div>
      </Link>
      <div className="followsContainer">
        <div className="followsHeader">
          <span className="headerText">Following</span>
          <span className="closeFollows"><Link href={`/${user?.username}`}>x</Link></span>
        </div>
        <div className="followWrapper">
          {userFollows.followings.length > 0 &&
            userFollows.followings.map((follow) => (
              <>
              <FollowUserCard user={follow.user_details} profileId={user.id} userId={session?.id} type={'following'} />
                  </>

              
            ))}
        </div>
      </div>
      <div className="profileContainerWrapper">
        {/* {params.username} */}
        {user !== null ? (
          <div>
            <ProfileHeadCard
              session={session}
              profile={user}
              follows={userFollows}
              ServerdoesSignedInUserFollowProfile={
                ServerdoesSignedInUserFollowProfile
              }
            />
            <div style={{ padding: 40 }}>
              <ProfilePinnedArticles
                pinnedArticles={userPosts?.filter(
                  (post) => post.pinned == "true"
                )}
              />
              <br />
              <br />
              <h3>Articles</h3>
              <br />
              <br />

              {userPosts?.length > 0 ? (
                userPosts.map((post, index) => (
                  <>
                    <ArticleCard key={index} article={post} />
                    <br />
                  </>
                ))
              ) : (
                <NotFound reason={"no_post_for_user"} />
              )}
            </div>
          </div>
        ) : (
          "NO USER FOUND"
        )}
      </div>
    </div>
  );
}

export const generateMetadata = async (props) => {
  const { params } = props;
  const userResponse = await fetch(
    `${process.env.API_URL}/users/actions.php?action=getUser&username=${params.username}`
  );
  const userData = await userResponse.json();
  const user = userData.data;

  if (user) {
    return {
      title: user.name,
      desciption: user.bio !== "" ? user.bio : user.name,
      alternates: {
        canonical: `${process.env.APP_URL}${params.username}`,
      },
      twitter: {
        card: "summary_large_image",
        title: user.name,
        description: user.bio !== "" ? user.bio : user.name,
        siteId: "1467726470533754880",
        creator: "@myscriblo",
        creatorId: "1467726470533754880",
        images: [
          {
            url: user.avatar,
            alt: user.name,
          },
        ],
      },
      openGraph: {
        title: user.name,
        description: user.bio !== "" ? user.bio : user.name,
        url: `${process.env.APP_URL}${user.authorUsername}`,
        siteName: "Scriblo",
        images: [
          {
            url: user.avatar,
            alt: user.name,
          },
        ],
        locale: "en_US",
        type: "website",
      },
    };
  } else {
    return {
      title: "User Not Found",
      description: "The user you are looking for was not found",
    };
  }
};

export default Followers;
