"use client";
import React, { useEffect, useRef, useState } from "react";
import "@/Styles/preview.css";
import "@/Styles/article.css";
import { getSession, useSession } from "next-auth/react";
import { authOptions } from "@/app/authentication/[...nextauth]/route";
import { source_Sans_Pro } from "@/public/util/fonts";
import ArticleInfoCard from "@/Components/ArticleInfoCard";
import ArticleReactionCard from "@/Components/ArticleReactionCard";
import Link from "next/link";
import AboutAuthorCard from "@/Components/AboutAuthorCard";
import NotFound from "@/Components/NotFound";
import { formatDate } from "@/public/util/helpers";
import Image from "next/image";
import Loading from "@/Components/Loading";
function Preview({ params }) {
  const { data: session } = useSession();
  const [showCodeInput, setshowCodeInput] = useState(true);
  const [post, setpost] = useState({})
  const [token, settoken] = useState(["", "", "", "", ""]);
  const [loading, setloading] = useState(false)
  const verficationcodeRefs = useRef([]);
  useEffect(() => {
    setloading(true)
    checkIfCodeRequiredForPreview();
  }, [params]);

  const checkIfCodeRequiredForPreview = async () => {
    const sessionForValidation = await getSession(authOptions);
    const formData = new FormData();
    formData.append("action", "checkIfCodeRequiredForPreview");
    formData.append("slug", params.previewSlug);

    const res = await fetch(
      `/api/posts/actions.php?data=checkIfCodeRequiredForPreview&slug=${params.previewSlug}`
    );
    const data = await res.json();
    if (data.message == "No data found") {
      alert("No Preview Post Found");
      return;
    }

    const responseData = data.data[0];
    console.log(responseData);
    if (sessionForValidation?.id !== responseData.authorId) {
      setshowCodeInput(true);
    } else {
      setshowCodeInput(false);
      const res = await fetch(`/api/posts/index.php?articleId=${responseData?.postId}`);
      const data = await res.json()
      setpost(data.data)
    }
    setloading(false)
  };
  const handleChange = (index, value) => {
    if (value.length <= 1) {
      const newtoken = [...token];
      newtoken[index] = value;
      settoken(newtoken);
      if (value.length === 1 && index < 4) {
        verficationcodeRefs.current[index + 1].focus();
      }
    }
  };

  const handleBackspace = (index, event) => {
    if (event.key === "Backspace" && !token[index] && index > 0) {
      verficationcodeRefs.current[index - 1].focus();
    }
  };

  const handleCodeSubmit = async () => {
    setloading(true)
    const res = await fetch(
      `/api/posts/actions.php?data=verifyCode&slug=${
        params.previewSlug
      }&code=${token.join("")}`
    );
    const data = await res.json();
    if (data.status == 200) {
      settoken(["", "", "", "", ""])
      setshowCodeInput(false)
      console.log(data.data)
      setpost(data.data)
    } else {
      alert("Incorect Preview Code")
    }
    setloading(false)
  };

  return loading ? (
    <Loading />
  ) : 
   (
    <div className={`previewContainer ${source_Sans_Pro.className}`}>
      {/* {params.previewSlug} */}
      {showCodeInput ? (
        <div className="previewCodeInput">
          <h2>Enter Preview Code</h2>
          <p>
            The author of this article requires a code to preview their article,
            enter the preview code below
          </p>

          <div className="codeForm">
            {token.map((digit, index) => (
              <input
                key={index}
                type="text"
                value={digit}
                maxLength={1}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleBackspace(index, e)}
                ref={(ref) => (verficationcodeRefs.current[index] = ref)}
                pattern="\d*"
              />
            ))}
          </div>

          <button onClick={() => handleCodeSubmit()} className="btn">
            Continue
          </button>
        </div>
      ) : (
        <div className="articleContainer">
      {post ? (
        <>
        {post.coverImage !== '' && <div className="mobileCoverImageTop">
          <Image className="mobileCoverImg" src={post?.coverImage} fill /></div>}
          <h1>{post.title}</h1>
          <br />
          <ArticleInfoCard
            authorAvatar={post.authorAvatar}
            authorName={post.authorName}
            authorUsername={post.authorUsername}
            articlePublishDate={formatDate(post.createdAt)}
            articleReadTime={"5 mins"}
            authorId={post.authorId}
            doesSignedInUserFollowAuthor={false}
            session={session}
            preview={true}
          />
          <br />
          <ArticleReactionCard
            postId={post.id}
            userId={session?.id}
            session={session}
            preview={true}
          />
          <br />

          <article
            dangerouslySetInnerHTML={{ __html: post?.content }}
          ></article>
          <div className={`articleTags ${source_Sans_Pro.className}`}>
            {post?.tags !== "" &&
              post?.tags?.split(",").map((tag, index) => (
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
            doesSignedInUserFollowAuthor={false}
            preview={true}
          />
          <br />
          <br />
          <ArticleReactionCard
            postId={post.id}
            userId={session?.id}
            session={session}
            preview={true}
          />
          <br />
          <br />
          <div id="commentScrollHolder"></div>
          {/* <Comments session={session} postId={post?.id} /> */}
        </>
      ) : (
        <NotFound />
      )}
    </div> 
      )}


    </div>
  );
}

export default Preview;
