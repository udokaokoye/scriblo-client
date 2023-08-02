"use client";
import "@/Styles/create.css";
import TextEditor from "@/Components/TextEditor";
import React, { useState, useRef, useEffect } from "react";
import { getSession, useSession } from "next-auth/react";
import { notFound, redirect } from "next/navigation";
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import draftToHtml from "draftjs-to-html";
import moment from "moment";
import { useRouter } from "next/navigation";
import {
  EditorState,
  convertFromHTML,
  ContentState,
  convertToRaw,
} from "draft-js";
import { allTags } from "@/public/util/allTags";
import CloseIcon from "@mui/icons-material/Close";
import { source_Sans_Pro, merrweather } from "@/public/util/fonts";
import htmlToDraft from "html-to-draftjs";
import AddPostNavigation from "@/Components/AddPostNavigation";
import { authOptions } from "@/app/authentication/[...nextauth]/route";
import { v4 as uuidv4 } from 'uuid';
import Loading from "@/Components/Loading";
function ArticleEdit({ params }) {
  const [articleToEdit, setarticleToEdit] = useState({});

  const router = useRouter();
  const fileInputRef = useRef(null);
  const { data: session, status } = useSession();
  const [editorState, seteditorState] = useState(EditorState.createEmpty());
  const [uploadImages, setuploadImages] = useState([]);
  const [oldImages, setoldImages] = useState([]);
  const [isArticleVisible, setisArticleVisible] = useState(true);
  const [content, setcontent] = useState();
  const [title, settitle] = useState("");
  const [summary, setsummary] = useState("");
  const [coverImage, setcoverImage] = useState({ file: null, localSrc: "" });
  const [oldCoverImage, setoldCoverImage] = useState("");
  const [tagSearchInput, settagSearchInput] = useState("");
  const [tags, settags] = useState([]);
  const [recommendedTags, setrecommendedTags] = useState([]);
  const [authorId, setauthorId] = useState(session?.id);
  const [rawEntityContent, setrawEntityContent] = useState({});
  const isHidden = useRef(0);
  const oldImagesRef = useRef([]);
  const [mediafiles, setmediafiles] = useState([]);
  const [stage, setstage] = useState(["create"]);
  const [loading, setloading] = useState(false)

  useEffect(() => {
    const fetchArticle = async () => {
      const sessionForValidation = await getSession(authOptions)
      if (!sessionForValidation.id) {
        notFound()
      }
      const res = await fetch(
        `/api/posts/index.php?articleId=${params.articleId}`,
        { next: { revalidate: 20 } }
      );

      const data = await res.json();
      if (data.data.authorId !== sessionForValidation?.id) {
        
        notFound()
      }
      //   console.log(data?.data);
      setarticleToEdit(data?.data);
      settitle(data?.data?.title);
      setsummary(data?.data?.summary);
      const prevTags = data?.data?.tags
        ?.split(",")
        .map((name) => ({ name, id: 0 }));
      settags(prevTags);

      if (data.data.coverImage !== "") {
        setcoverImage({
          file: null,
          localSrc: data.data.coverImage,
        });
      }
      setoldCoverImage(data.data.coverImage);

      console.log(data.data?.isHidden);
      isHidden.current = data.data?.isHidden;
      setisArticleVisible(data.data?.isHidden == 1 ? false : true);

      const blocksFromHTML = htmlToDraft(data.data?.content);
      const editState = ContentState.createFromBlockArray(
        blocksFromHTML.contentBlocks,
        blocksFromHTML.entityMap
      );
      const rawContent = convertToRaw(editState);

      seteditorState(EditorState.createWithContent(editState));
      setrawEntityContent(rawContent);

      const prevUploadedImages = Object.values(rawContent.entityMap).map(
        (item, index) => {
          if (item.type == "IMAGE") {
            return item.data.src;
          } else {
            return null;
          }
        }
      );

      // console.log(prevUploadedImages);
      setoldImages(prevUploadedImages);
      oldImagesRef.current = prevUploadedImages
    };

    // if (session?.id) {
      fetchArticle();
    // }
  }, [params]);
  const stripReplaceSpacesWithDashes = (text) => {
    let strippedText = text.toLowerCase().replace(/[^a-zA-Z0-9]+/g, "-");

    // Remove leading and trailing dashes
    strippedText = strippedText.replace(/^-+|-+$/g, "");
    return strippedText;
  };
  function generateSlug(title) {
    let trimmedSlug;
    if (isHidden.current == 0) {
      // Convert the title to lowercase and replace special characters with dashes
      const slug = title.toLowerCase().replace(/[^a-zA-Z0-9]+/g, "-");

      // Remove leading and trailing dashes
      trimmedSlug = slug.replace(/^-+|-+$/g, "");
    } else {
      trimmedSlug = `${session?.username}-draft-${stripReplaceSpacesWithDashes(
        title
      )}`;
    }

    // Return the final slug
    return trimmedSlug;
  }

  function convertToS3Url(objectKey) {
    const s3Url = `https://scriblo.s3.us-east-2.amazonaws.com/images/${objectKey}.jpg`;

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
      Key: `images/${fileName}_${index}.jpg`,
      Body: file,
      contentType: "image/jpeg",
    };

    const command = new PutObjectCommand(params);

    const s3Result = await s3.send(command);

    return s3Result.$metadata;
  };

  const getFileNameFromS3URL = (url) => {
    const parts = url.split("/");
    const fileNameWithExtension = parts[parts.length - 1];
    const fileName = fileNameWithExtension.split(".")[0];
    return fileName;
  };

  const deleteFromS3 = async (fileName) => {
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
      Key: `images/${getFileNameFromS3URL(fileName)}.jpg`,
    };

    const command = new DeleteObjectCommand(params);

    const s3Result = await s3.send(command);
    console.log(s3Result);

    return s3Result.$metadata;
  };

  const processPost = async () => {
    const formData = new FormData();
    formData.append("action", "updatePost");
    const processRawEntity = new Promise((resolve, reject) => {
      Object.values(rawEntityContent.entityMap).map(async (item, index) => {
        if (item.type == "IMAGE") {
          if (!oldImagesRef.current.includes(item.data.src)) {
            const fileUid = uuidv4();
            const fileToUpload = uploadImages.filter(
              (img) => img.localSrc == item.data.src
            )[0].file;
            item.data.src = convertToS3Url(`${generateSlug(title)}_${index}_${fileUid}`);
            const result = await uploadToS3(
              fileToUpload,
              `${index}_${fileUid}`,
              generateSlug(title)
            );
            resolve("uploaded: " + result);
          } else {
            // remove image from old array where the value is item.data.src
            // console.log("ELSE BLOCK");
            // console.log(item.data.src);
            const updatedOldImages = oldImagesRef.current.filter(
              (img) => img !== item.data.src
            );
            // console.log(updatedOldImages)
            oldImagesRef.current = updatedOldImages;
          }
          //   !DELETE EVERYTHING IN OLDIMAGES ARRAY
          // const oldImagesToDelete = oldImages.filter((img) => img !== item.data.src)
          // console.log("old: " + oldImagesToDelete);

          // oldImagesToDelete.length > 0 && oldImagesToDelete.map((imgToDelete) => {
          //       deleteFromS3(imgToDelete);
          //     });
        } 
        // else {
        //   console.log("STILL HIT")
        //   if (oldImages.length > 0) {
        //     oldImages.map((imgToDel) => {
        //       deleteFromS3(imgToDel)
        //     })
        //   }
        // }
      });
      // console.log(oldImagesRef.current.length)
      // console.log(oldImagesRef.current)
      // console.log("Entity map lenght: " + Object.values(rawEntityContent.entityMap).length)
      // console.log(Object.values(rawEntityContent.entityMap))

      if (oldImagesRef.current.length > 0 || Object.values(rawEntityContent.entityMap).length == 0) {
        
        oldImagesRef.current.map((imgToDel) => {
              if (imgToDel !== null) {
                deleteFromS3(imgToDel)
              }
            })
          
      }

      resolve("Updated Image");
    });

    // return;

    const processCoverImage = new Promise( (resolve, reject) => {

        if (coverImage.localSrc !== "" || coverImage.file !== null) {
          if (
            coverImage.localSrc.includes("scriblo.s3.us-east-2.amazonaws.com")
          ) {
            formData.append("coverImage", coverImage.localSrc);
          } else {
            const fileUid = uuidv4();
            formData.append(
              "coverImage",
              convertToS3Url(`${generateSlug(title)}_cover_${fileUid}`)
            );
            uploadToS3(
              coverImage.file,
              `cover_${fileUid}`,
              generateSlug(title)
            );
             deleteFromS3(oldCoverImage)
          }
  
          // console.log(coverImage);
          // return;
          resolve("Cover Image Uploaded");
        } else {
          formData.append("coverImage", "");
          resolve("Cover Image Uploaded");
        }
      

    });

    // return;
    // // console.log("Processing Article Images");
    await processRawEntity;
    // // console.log("Procced!");
    // // console.log("Processing Cover Image");
    await processCoverImage;
    // // console.log("Procced!");
    // // console.log("All Files Processed");
    let tagsIDs;
    let finalTags = tags.map((tg) => tg.name);

    let tagids = tags.map((tt) => {
      return allTags.filter((td) => td.name == tt.name)[0];
    });
    tagsIDs = tagids.map((tst) => tst.id);
    if (Object.values(rawEntityContent.entityMap).length > 0) {
      Object.values(rawEntityContent.entityMap).map((item) => {
        formData.append("mediaFiles[]", item.data.src);
      });
    } else {
      formData.append("mediaFiles[]", "");
    }
    formData.append(
      "updateRelationshipTable",
      articleToEdit.tags == finalTags.join(",")
    );
    // formData.append('updateRelationshipTableFromVisibility', oldIsHidden !== isHidden)
    formData.append("id", articleToEdit.id);
    formData.append("title", title);
    formData.append("content", draftToHtml(rawEntityContent));
    formData.append("tags", finalTags.join(","));
    formData.append("readTime", calculateReadTime(editorState.getCurrentContent().getPlainText()))
    // console.log(tagsIDs.join(','))
    // return;
    // for tagIDs we need to get the id of the selected tags from the allTags.js file
    formData.append("tagsIDs", tagsIDs.join(","));
    formData.append("authorId", session?.id);
    formData.append("isHidden", isHidden.current);
    formData.append("slug", generateSlug(title));
    formData.append("summary", summary);
    formData.append("createdAt", moment().format("YYYY-MM-DD HH:mm:ss"));
    formData.append("publishDate", moment().format("YYYY-MM-DD HH:mm:ss"));
    formData.append("username", session?.username);

    const res = await fetch(`/api/posts/actions.php`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session.token}`,
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
      isHidden.current = 0;
      setstage(0);
      setmediafiles([]);
      setloading(false)

      router.push(`/`);
    }
    console.log(data);
  };

  const editPost = async () => {
    // isHidden.current = 0;
    // check if all fields are filled
    if (!title || !rawEntityContent || !tags || !summary) {
      alert("Please fill all fields");
      return;
    }

    if (confirm("Updating the post title will affect the previous post URL, this action cannot be undone.")) {
      setloading(true)
      processPost();
    }

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
    const newTags = tags.filter((tag) => tag.name !== tg.name);
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
  function calculateReadTime(article, wordsPerMinute = 200) {
    // Regular expression to count words (excluding whitespace)
    const wordCount = article.trim().split(/\s+/).length;
    
    // Calculate read time in minutes
    const readTimeMinutes = Math.ceil(wordCount / wordsPerMinute);
    
    return readTimeMinutes;
  }
  return loading ? (
    <Loading />
  ) : 
   (
    <div className="editContainer">
      <AddPostNavigation
        // savePost={savePost}
        stage={stage}
        setstage={setstage}
        seteditorState={seteditorState}
        editorState={editorState}
        editing={true}
        redirect={redirect}
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
                      if (uploadImages.length <= 0 && coverImage.localSrc == "") {
                        console.log(coverImage)
                        console.log(oldCoverImage)
                        fileInputRef.current.click();
                      }
                    }}
                  >
                    {coverImage.localSrc == "" && uploadImages.length > 0 && (
                      <button
                        onClick={() => fileInputRef.current.click()}
                        className="coverImage"
                      >
                        Click to select custom Cover Image
                      </button>
                    )}
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

                    {coverImage.localSrc !== "" && (
                      <div
                        className="selectedCoverImage"
                        style={{ background: `url(${coverImage.localSrc})` }}
                      >
                        <div
                          className="delete"
                          onClick={() =>
                            setcoverImage({ file: null, localSrc: "" })
                          }
                        >
                          X
                        </div>
                      </div>
                    )}

                    {coverImage.localSrc == "" && uploadImages.length <= 0 && (
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
                <small>Please confirm all your changes</small>
                <br />
                <br />
                <div className="visiBilityOptions">
                  <input
                    type="checkbox"
                    checked={isArticleVisible}
                    onChange={() => {
                      isHidden.current = isHidden.current == 0 ? 1 : 0;
                      console.log(isHidden.current);
                      setisArticleVisible(!isArticleVisible);
                    }}
                  />{" "}
                  Make article visible
                </div>
                <div className="previewOptionBtns">
                  {/* <button
                    onClick={() => savePost()}
                    className="previewOptionBtn_save"
                  >
                    Save as drafft
                  </button> */}

                  <button
                    onClick={() => editPost()}
                    className="previewOptionBtn_publish"
                  >
                    Edit Article
                  </button>
                </div>
                {/* <div className="previewOptionLinks">
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
                </div> */}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ArticleEdit;
