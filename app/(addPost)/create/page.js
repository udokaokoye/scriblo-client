"use client";
import TextEditor from "@/Components/TextEditor";
import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import draftToHtml from "draftjs-to-html";
import AddPostNavigation from "@/Components/AddPostNavigation";
import moment from "moment";

function Create() {
  const { data: session } = useSession();
  const [uploadImages, setuploadImages] = useState([]);
  const [content, setcontent] = useState();
  const [title, settitle] = useState("");
  const [summary, setsummary] = useState("");
  const [coverImage, setcoverImage] = useState("");
  const [tags, settags] = useState("");
  const [authorId, setauthorId] = useState(session?.id);
  const [rawEntityContent, setrawEntityContent] = useState({});
  const [isHidden, setisHidden] = useState(0);
  const [mediafiles, setmediafiles] = useState([]);
  const [stage, setstage] = useState(["create"]);
  function generateSlug(title) {
    // Convert the title to lowercase and replace special characters with dashes
    const slug = title.toLowerCase().replace(/[^a-zA-Z0-9]+/g, "-");

    // Remove leading and trailing dashes
    const trimmedSlug = slug.replace(/^-+|-+$/g, "");

    // Return the final slug
    return trimmedSlug;
  }

  function convertToS3Url(objectKey) {
    const s3Url = `https://scriblo.s3.us-east-2.amazonaws.com/${
      isHidden ? "drafts" : "images"
    }/${objectKey}.jpg`;

    return s3Url;
  }
  const uploadToS3 = async (file, index, fileName) => {
    const bucketName = process.env.NEXT_PUBLIC_AWS_BUCKET_NAME;
    const bucketRegion = process.env.NEXT_PUBLIC_AWS_BUCKET_REGION;
    const bucketAccessKey = process.env.NEXT_PUBLIC_AWS_ACCESS_KEY;
    const bucketSecretKey = process.env.NEXT_PUBLIC_AWS_SECRET_KEY;

    const s3 = new S3Client({
      region: bucketRegion,
      credentials: {
        accessKeyId: bucketAccessKey,
        secretAccessKey: bucketSecretKey,
      },
    });

    const params = {
      Bucket: bucketName,
      Key: `${isHidden == 1 ? "drafts" : "images"}/${fileName}_${index}.jpg`,
      Body: file,
      contentType: "image/jpeg",
    };

    const command = new PutObjectCommand(params);

    const s3Result = await s3.send(command);

    // console.log(s3Result)
  };

  const processRawEntity = async () => {
    Object.values(rawEntityContent.entityMap).map(async (item, index) => {
      uploadToS3(
        uploadImages.filter((img) => img.localSrc == item.data.src)[0].file,
        index,
        generateSlug(title)
      );
      item.data.src = convertToS3Url(`${generateSlug(title)}_${index}`);
    });
    // console.log(draftToHtml(rawEntityContent))

    // console.log(rawEntityContent.entityMap)
    // console.log(rawEntityContent)
    // return;

    // const blobSrcs = Object.values(rawEntityContent.entityMap)
    //   .filter((item) => item.data.src.startsWith("blob:"))
    //   .map((item) => item.data.src);
    // // console.log("blobUrls: ", blobSrcs)

    // if (blobSrcs.length > 0) {
    //   blobSrcs.forEach(async (blobSrc, index) => {
    //     await uploadToS3(uploadImages.filter((img) => img.localSrc == blobSrc)[0].file, index, generateSlug(title))
    //     // await mediaPromisedState(convertToS3Url(`${generateSlug(title)}_${index}`));
    //     // setmediafiles([...mediafiles, convertToS3Url(`${generateSlug(title)}_${index}`)]);

    //     for (const key in rawEntityContent.entityMap) {
    //       if (rawEntityContent.entityMap[key].data.src === blobSrc) {
    //         rawEntityContent.entityMap[key].data.src = convertToS3Url(`${generateSlug(title)}_${index}`);
    //       }
    //     }
    //   });
    // }
  };

  const logDetails = async () => {
    // const res = await fetch(`/api/posts/index.php`,)
    // const reJson = await res.json();
    console.log(session?.token);
    return;
  };

  const processPost = async () => {
    processRawEntity();

    let tagsIDs = [1, 2, 3];

    const formData = new FormData();

    Object.values(rawEntityContent.entityMap).map((item) => {
      formData.append("mediaFiles[]", item.data.src);
    });
    formData.append("title", title);
    formData.append("content", draftToHtml(rawEntityContent));
    formData.append("tags", tags);
    // for tagIDs we need to get the id of the selected tags from the allTags.js file
    formData.append("tagsIDs", tagsIDs);
    formData.append("authorId", session?.id);
    formData.append("isHidden", isHidden);
    formData.append("slug", generateSlug(title));
    formData.append("createdAt", moment().format("YYYY-MM-DD HH:mm:ss"));
    formData.append("publishDate", moment().format("YYYY-MM-DD HH:mm:ss"));

    const res = await fetch(`/api/posts/index.php`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session?.token}`,
      },
      body: formData,
    });
    const data = await res.json();
    console.log(data);
  };

  const publishPost = async () => {
    setisHidden(0);
    // check if all fields are filled
    if (!title || !rawEntityContent || !tags || !coverImage || !summary) {
      alert("Please fill all fields");
      return;
    }

    processPost();
  };

  const savePost = async () => {
    setisHidden(1);
    if (!title || !rawEntityContent) {
      alert("Please fill in a title and content before saving");
      return;
    }
    processPost();
  };
  return (
    <>
      <AddPostNavigation
        savePost={savePost}
        stage={stage}
        setstage={setstage}
      />
      <div className="newPostContainer">
        {/* <button onClick={() => logDetails()}>Log Details</button> */}

        {stage == "create" && (
          <div className="editorContainer">
            <div className="creatHeader">
              <textarea
                type="text"
                placeholder="Title Here"
                name="title"
                className="articleTitle"
                cols={1}
                value={title}
                onChange={(e) => settitle(e.target.value)}
              />
              {/* <input
                    type="text"
                    name="tags"
                    placeholder="Add 3 tags"
                    className="tagInput"
                  /> */}
            </div>

            <TextEditor
              uploadImages={uploadImages}
              setuploadImages={setuploadImages}
              content={content}
              setrawEntityContent={setrawEntityContent}
            />
          </div>
        )}

        {stage == "preview" && (
          <div className="previewContainer">
            <h1>Article Preview</h1>
            <div className="previewWrapper">
              <div className="previewForms">
                <div className="selectCoverImage">
                  <small className="inputLabel">Select cover image</small>
                  <div className="coverImageContainer">
                    {coverImage == "" &&
                      uploadImages.map((img, index) => (
                        <div
                          key={index}
                          onClick={() => setcoverImage(img.localSrc)}
                          className="coverImage"
                          style={{ background: `url(${img.localSrc})` }}
                        ></div>
                      ))}

                    {coverImage !== "" && (
                      <div
                        className="selectedCoverImage"
                        style={{ background: `url(${coverImage})` }}
                      >
                        <div
                          className="delete"
                          onClick={() => setcoverImage("")}
                        >
                          X
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="previewFormElement">
                  <small className="inputLabel">Title</small>
                  <input
                    type="text"
                    name="title"
                    value={title}
                    onChange={(txt) => settitle(txt.target.value)}
                  />
                  <small className="inputMessage"></small>
                </div>
                <div className="previewFormElement">
                  <small className="inputLabel">Preview Subtitle</small>
                  <textarea
                    type="text"
                    name="title"
                    value={summary}
                    onChange={(txt) => setsummary(txt.target.value)}
                    maxLength={200}
                  />
                  <small className="inputMessage">
                    Please enter preview subtitle, this will be visible
                    alongside the article title and cover image{" "}
                  </small>
                </div>
                <div className="previewFormElement">
                  <small className="inputLabel">Tags</small>
                  <input type="text" name="tags" onChange={(txt)=> settags(txt.target.value)} />
                  <small className="inputMessage">
                    Select categories that best describe your article
                  </small>
                </div>
              </div>

              <div className="previewOptions">
                <h1>Options</h1>
                <div className="previewOptionBtns">
                  <button onClick={() => savePost()} className="previewOptionBtn_save">
                    Save as drafft
                  </button>
                  <button onClick={() => publishPost()} className="previewOptionBtn_publish">Publish</button>
                </div>
                <div className="previewOptionLinks">
                  <div className="optionLink">
                    <span>View live preview</span>
                    <small>Click to view live preview of your article</small>
                  </div>
                  <div className="optionLink">
                    <span>Share preview link</span>
                    <small>
                      Share preview link with someone for review, code will be
                      required to view preview
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Create;
