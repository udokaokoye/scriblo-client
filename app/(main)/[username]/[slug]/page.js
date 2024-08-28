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
import { getBookmarks, getLikes } from "@/public/util/apiHelpers";
// import { getComments } from "@/public/util/apiHelpers";
async function Article({ params }) {
  const session = await getServerSession(authOptions);
  // console.log(session)
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

    // const allLikes = await getLikes(post?.id)
    const likeresponse = await fetch(`${process.env.API_URL}/posts/actions.php?data=likes&postId=${post?.id}`)
    const likedata = await likeresponse.json()
    let allLikes = likedata.data;
    if (allLikes == null) {
      allLikes = [];
    }
    let doesSignedInuserLikePost = false;
    let didSignedInUserBookmarkPost = false;




    
  
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

    // !likes and bookmarks logic goes here
    if (allLikes !== null) {
      doesSignedInuserLikePost = allLikes?.filter(like => like?.userId == session?.id).length > 0
    }

    // const allBookmarks = await getBookmarks(session?.id)
    const bookmarkresponse = await fetch(`${process.env.API_URL}/posts/actions.php?data=bookmarks&userId=${session?.id}`)
    const bookmarkdata = await bookmarkresponse.json()
    const allBookmarks = bookmarkdata.data
    
    if (allBookmarks !== null) {
      didSignedInUserBookmarkPost = allBookmarks?.filter(bookmark => bookmark?.id == post?.id).length > 0
    }
  }

  return (
    <div className="articleContainer">
      {post ? (
        <>
        {post.coverImage !== '' && 
        <div className="mobileCoverImageTop">
          <Image alt={post?.title} className="mobileCoverImg" src={post.coverImage} fill /></div>}
          <h1 className="articleTItle" >{post.title}</h1>
          <br />
          <ArticleInfoCard
            authorAvatar={post.authorAvatar}
            authorName={post.authorName}
            authorVerified={post.authorVerified}
            authorUsername={post.authorUsername}
            articlePublishDate={formatDate(post.createdAt)}
            articleReadTime={post?.readTime}
            authorId={post.authorId}
            doesSignedInUserFollowAuthor={doesSignedInUserFollowAuthor}
            session={session}
          />
          <br />
          <ArticleReactionCard
            postId={post.id}
            userId={session?.id}
            session={session}
            authorUsername={post.authorUsername}
            slug={post.slug}
            allLikes={allLikes?.length}
            doesSignedInuserLikePost={doesSignedInuserLikePost}
            didSignedInUserBookmarkPost={didSignedInUserBookmarkPost}
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
              verified: post.authorVerified
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
            authorUsername={post.authorUsername}
            slug={post.slug}
            allLikes={allLikes?.length}
            doesSignedInuserLikePost={doesSignedInuserLikePost}
            didSignedInUserBookmarkPost={didSignedInUserBookmarkPost}
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

export const generateMetadata = async (props) => {
  const { params } = props;
  const res = await fetch(
    `${process.env.API_URL}/posts/index.php?slug=${params.slug}`,
    // { next: { revalidate: 20 } }
  );

  const data = await res.json();
  const post = data.data;
  if (post) {
    return {
      title: post.title,
      desciption: post.summary,
      alternates: {
        canonical: `${process.env.APP_URL}${post.authorUsername}/${params.slug}`
      },
      twitter: {
        card: 'summary_large_image',
        title: post.title,
        description: post.desciption,
        siteId: '1467726470533754880',
        creator: '@myscriblo',
        creatorId: '1467726470533754880',
        images: [
          {
            url: post.coverImage,
            alt: post.title
          }
        ],
      },
      openGraph: {
        title: post.title,
        description: post.summary,
        url: `${process.env.APP_URL}${post.authorUsername}/${params.slug}`,
        siteName: "Scriblo",
        images: [
          {
            url: post.coverImage,
            alt: post.title
          }
        ],
        locale: 'en_US',
        type: 'website',
      },
    }
  } else {
    return {
      title: "Not Found",
      description: "The post you are looking for was not found"
    }
  }
  
};
export default Article;
