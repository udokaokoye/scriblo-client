"use client";
import "../../../Styles/create.css";
import TextEditor from "@/Components/TextEditor";
import React, { useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import draftToHtml from "draftjs-to-html";
import AddPostNavigation from "@/Components/AddPostNavigation";
import moment from "moment";
import { useRouter } from "next/navigation";
import { EditorState } from "draft-js";
import { allTags } from "@/public/util/allTags";
import CloseIcon from "@mui/icons-material/Close";
import { source_Sans_Pro, merrweather } from "@/public/util/fonts";
function Create() {
  const router = useRouter();
  const fileInputRef = useRef(null);
  const { data: session } = useSession();
  const [editorState, seteditorState] = useState(EditorState.createEmpty());
  const [uploadImages, setuploadImages] = useState([]);
  const [content, setcontent] = useState();
  const [title, settitle] = useState("");
  const [summary, setsummary] = useState("");
  const [coverImage, setcoverImage] = useState("");
  const [tagSearchInput, settagSearchInput] = useState("");
  const [tags, settags] = useState([]);
  const [recommendedTags, setrecommendedTags] = useState([]);
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

    return(s3Result.$metadata)
  };

  const processRawEntity = async () => {

    Object.values(rawEntityContent.entityMap).map(async (item, index) => {
      if (item.type == "IMAGE") {
        const result = uploadToS3(
          uploadImages.filter((img) => img.localSrc == item.data.src)[0].file,
          index,
          generateSlug(title)
        );
          item.data.src = convertToS3Url(`${generateSlug(title)}_${index}`);
        return result
      }
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

  const processCoverImage = async (formData) => {
    if (coverImage !== '') {
      const result = uploadToS3(coverImage.file, 'cover', generateSlug(title))
      formData.append('coverImage', convertToS3Url(`${generateSlug(title)}_cover`))
      return result
    } else {
      formData.append('coverImage', '')
      return true
    }

  }

  const processPost = async () => {
    const formData = new FormData();
    await processRawEntity();
    await processCoverImage(formData);

    // return;

    let tagsIDs = tags.map((tg) => tg.id);
    let finalTags = tags.map((tg) => tg.name);



    if (rawEntityContent.entityMap.length > 0) {
      Object.values(rawEntityContent.entityMap).map((item) => {
        formData.append("mediaFiles[]", item.data.src);
      });
    } else {
      formData.append("mediaFiles[]", "");
    }
    formData.append("title", title);
    formData.append("content", draftToHtml(rawEntityContent));
    formData.append("tags", finalTags.join(","));
    // for tagIDs we need to get the id of the selected tags from the allTags.js file
    formData.append("tagsIDs", tagsIDs);
    formData.append("authorId", session?.id);
    formData.append("isHidden", isHidden);
    formData.append("slug", generateSlug(title));
    formData.append("summary", summary);
    // formData.append("coverImage", uploadCoverImage);
    formData.append("createdAt", moment().format("YYYY-MM-DD HH:mm:ss"));
    formData.append("publishDate", moment().format("YYYY-MM-DD HH:mm:ss"));

    const res = await fetch(`/api/posts/index.php`, {
      method: "POST",
      headers: {
        authorization: `Bearer ${session.token}`,
      },
      body: formData,
    });
    const data = await res.json();
    if (data.status == 200) {
      // clear all states
      settitle("");
      seteditorState(EditorState.createEmpty());
      setrawEntityContent({ entityMap: {}, blocks: [] });
      settags("");
      setuploadImages([]);
      setcoverImage("");
      setsummary("");
      setisHidden(0);
      setstage(0);
      setmediafiles([]);

      router.push(`/`);
    }
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
    setisHidden(0);
    if (!title || !rawEntityContent) {
      alert("Please fill in a title and content before saving");
      return;
    }
    processPost();
  };

  function textAreaAdjust(element) {
    element.style.height = "1px";
    element.style.height = 25 + element.scrollHeight + "px";
  }

  const handleTagChange = (e) => {
    settagSearchInput(e.target.value);
    if (e.target.value.length >= 2) {
      const tagrec = allTags.filter((tag) =>
        tag.name.toLowerCase().includes(e.target.value.toLowerCase())
      );
      setrecommendedTags(tagrec);
    } else {
      setrecommendedTags([]);
    }
  };
  const handleTagSelect = (tg) => {
    if (tags.includes(tg)) {
      alert("You have selectef this tag already");
      return;
    }
    settags([...tags, tg]);
    settagSearchInput("");
    setrecommendedTags([]);
  };

  const handleTagDelete = (tg) => {
    const newTags = tags.filter((tag) => tag.id !== tg.id);
    settags(newTags);
  };
  const handleCoverUpload = (event) => {
    const file = event.target.files[0];
    const localSrc = URL.createObjectURL(file);
    setcoverImage({
      file,
      localSrc,
    });
  };
  return (
    <>
      <AddPostNavigation
        savePost={savePost}
        stage={stage}
        setstage={setstage}
        seteditorState={seteditorState}
        editorState={editorState}
      />
      <div className={`newPostContainer ${source_Sans_Pro.className}`}>
        {/* <button onClick={() => logDetails()}>Log Details</button> */}

        {stage == "create" && (
          <div className="editorContainer">
            <div className="creatHeader">
              <textarea
                type="text"
                placeholder="Title Here"
                name="title"
                className={`articleTitle ${merrweather.className}`}
                cols={1}
                value={title}
                onChange={(e) => settitle(e.target.value)}
                onKeyUp={(e) => textAreaAdjust(e.target)}
              />
            </div>

            <TextEditor
              uploadImages={uploadImages}
              setuploadImages={setuploadImages}
              content={content}
              setrawEntityContent={setrawEntityContent}
              editorState={editorState}
              seteditorState={seteditorState}
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
                  <div
                    className="coverImageContainer"
                    onClick={() => {
                      if (uploadImages.length <= 0 && coverImage == "") {
                        fileInputRef.current.click();
                      }
                    }}
                  >
                    {coverImage == "" &&
                      uploadImages.length > 0 && (<button onClick={() => fileInputRef.current.click()} className="coverImage">Click to select custom Cover Image</button>)}
                    {coverImage == "" &&
                      uploadImages.length > 0 &&
                      uploadImages.map((img, index) => (
                        <div
                          key={index}
                          onClick={() => setcoverImage(img)}
                          className="coverImage"
                          style={{ background: `url(${img.localSrc})` }}
                        ></div>
                      ))}

                    {coverImage !== "" && (
                      <div
                        className="selectedCoverImage"
                        style={{ background: `url(${coverImage.localSrc})` }}
                      >
                        <div
                          className="delete"
                          onClick={() => setcoverImage("")}
                        >
                          X
                        </div>
                      </div>
                    )}

                    {coverImage == "" && uploadImages.length <= 0 && (
                      <span>Click to add a Cover Image</span>
                    )}
                    <input
                      type="file"
                      accept="image/jpeg, image/png"
                      onChange={handleCoverUpload}
                      style={{ display: "none" }}
                      ref={fileInputRef}
                    />
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
                    placeholder="Enter article preview"
                    onChange={(txt) => setsummary(txt.target.value)}
                    maxLength={400}
                    onKeyUp={(e) => textAreaAdjust(e.target)}
                  />
                  <small className="inputMessage">
                    Please enter preview subtitle, this will be visible
                    alongside the article title and cover image{" "}
                  </small>
                </div>
                <div className="previewFormElement">
                  <small className="inputLabel">Tags</small>
                  <small className="inputMessage">
                    Select categories that best describe your article
                  </small>
                  <div className="allSelectedTags">
                    {tags.length > 0 &&
                      tags.map((tg, index) => (
                        <span key={index}>
                          {tg.name}{" "}
                          <label onClick={() => handleTagDelete(tg)}>
                            <CloseIcon className="closeIcon" />
                          </label>
                        </span>
                      ))}
                  </div>
                  <input
                    type="text"
                    name="tags"
                    className="tagsearchInput"
                    value={tagSearchInput}
                    onChange={(e) => handleTagChange(e)}
                    placeholder="Enter category"
                  />
                  {recommendedTags.length > 0 && (
                    <div className="tagsRecommendations">
                      {recommendedTags.map((rectag, index) => (
                        <span
                          key={index}
                          onClick={() => handleTagSelect(rectag)}
                        >
                          {rectag.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <br />
                <br />
                <br />
                <br />
              </div>

              <div className="previewOptions">
                <h1>Options</h1>
                <div className="previewOptionBtns">
                  <button
                    onClick={() => savePost()}
                    className="previewOptionBtn_save"
                  >
                    Save as drafft
                  </button>
                  <button
                    onClick={() => publishPost()}
                    className="previewOptionBtn_publish"
                  >
                    Publish
                  </button>
                </div>
                <div className="previewOptionLinks">
                  <div className="optionLink">
                    <span>View live preview</span>
                    <small>
                      Click to generate a live preview of your article
                    </small>
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
