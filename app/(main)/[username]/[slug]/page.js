import "../../../../Styles/article.css";
import NotFound404 from "@/Components/404";
import ArticleInfoCard from "@/Components/ArticleInfoCard";
import { formatDate } from "@/public/util/helpers";
import ArticleReactionCard from "@/Components/ArticleReactionCard";
// import Image from "next/image";
import Link from "next/link";
import { source_Sans_Pro } from "@/public/util/fonts";
import AboutAuthorCard from "@/Components/AboutAuthorCard";
import Comments from "@/Components/Comments";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/authentication/[...nextauth]/route";
import Image from "next/image";
// import { getComments } from "@/public/util/apiHelpers";
async function Article({ params }) {
  const session = await getServerSession(authOptions);
  let post = {};
  //   let postId = extractIdFromSlug(params.slug);
  let slug = params.slug;
  let readTime = 0;
  const res = await fetch(
    `${process.env.API_URL}/posts/index.php?slug=${slug}`,
    { next: { revalidate: 20 } }
  );

  const data = await res.json();
  // console.log(data.data)
  post = data.data;
  let doesSignedInUserFollowAuthor = false;
  if (session?.id) {
    const userFollowsResponse = await fetch(
      `${process.env.API_URL}/users/actions.php?action=getUserFollows&userId=${post?.authorId}`
    );
    const userFollowsData = await userFollowsResponse.json();
    const userFollows = userFollowsData.data;
    doesSignedInUserFollowAuthor = userFollows.followers.some(
      (userFollow) => userFollow.user_id == session?.id
    );
  }

  return (
    <div className="articleContainer">
      {post ? (
        <>
        {post.coverImage !== '' && <div className="mobileCoverImageTop"><Image className="mobileCoverImg" src={post.coverImage} fill /></div>}
          <h1>{post.title}</h1>
          <br />
          <ArticleInfoCard
            authorAvatar={post.authorAvatar}
            authorName={post.authorName}
            authorUsername={post.authorUsername}
            articlePublishDate={formatDate(post.createdAt)}
            articleReadTime={"5 mins"}
            authorId={post.authorId}
            doesSignedInUserFollowAuthor={doesSignedInUserFollowAuthor}
            session={session}
          />
          <br />
          <ArticleReactionCard
            postId={post.id}
            userId={session?.id}
            session={session}
          />
          <br />

          <article
            dangerouslySetInnerHTML={{ __html: post?.content }}
          ></article>
          <div className={`articleTags ${source_Sans_Pro.className}`}>
            {post.tags !== "" &&
              post.tags.split(",").map((tag, index) => (
                <Link href={"/"}>
                  <span key={index}>{tag}</span>
                </Link>
              ))}
          </div>
          <br />
          <br />
          <br />
          <AboutAuthorCard
            author={{
              id: post.authorId,
              name: post.authorName,
              avatar: post.authorAvatar,
              username: post.authorUsername,
              bio: post.authorBio,
            }}
            session={session}
            doesSignedInUserFollowAuthor={doesSignedInUserFollowAuthor}
          />
          <br />
          <br />
          <ArticleReactionCard
            postId={post.id}
            userId={session?.id}
            session={session}
          />
          <br />
          <br />
          <div id="commentScrollHolder"></div>
          <Comments session={session} postId={post?.id} />
        </>
      ) : (
        <NotFound404 />
      )}
    </div>
  );
}

export default Article;
