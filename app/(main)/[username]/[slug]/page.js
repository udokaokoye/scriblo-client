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
import { getComments } from "@/public/util/apiHelpers";
async function Article({ params }) {
  const session = await getServerSession(authOptions);
  let post = {};
  //   let postId = extractIdFromSlug(params.slug);
  let slug = params.slug;
  const res = await fetch(
    `${process.env.API_URL}/posts/index.php?slug=${slug}`,
    { next: { revalidate: 20 } }
  );

  const data = await res.json();
  // console.log(data.data)
  post = data.data;
  // const comments = await getComments(post?.id)
  // console.log(comments)
  return (
    <div className="articleContainer">
      {post ? (
        <>
          <h1>{post.title}</h1>
          <br />
          <ArticleInfoCard
            authorAvatar={post.authorAvatar}
            authorName={post.authorName}
            authorUsername={post.authorUsername}
            articlePublishDate={formatDate(post.createdAt)}
            articleReadTime={"5 mins"}
          />
          <br />
          <ArticleReactionCard postId={post.id} userId={session?.id} session={session} />
          <br />
          {/* {post.coverImage !== "" && (
            <div className="coverImageContainer">
              <Image
                src={post?.coverImage}
                alt={post?.slug}
                width={500}
                height={500}
                className="coverImage"
                // placeholder="blur"
                // blurDataURL=""
              />
            </div>
          )} */}

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
              name: post.authorName,
              avatar: post.authorAvatar,
              username: post.authorUsername,
              bio: post.authorBio
            }}
          />
          <br />
          <br />
          <ArticleReactionCard postId={post.id} userId={session?.id} session={session} />
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
