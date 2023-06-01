"use client";
import TextEditor from "@/Components/TextEditor";
import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import {S3Client, PutObjectCommand} from "@aws-sdk/client-s3";
import draftToHtml from "draftjs-to-html";
import AddPostNavigation from "@/Components/AddPostNavigation";

function Create() {

  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/signup");
    },
  });
  const [uploadImages, setuploadImages] = useState([]);
  const [content, setcontent] = useState("");
  const [title, settitle] = useState("");
  const [tags, settags] = useState("");
  const [authorId, setauthorId] = useState(session?.id);
  const [rawEntityContent, setrawEntityContent] = useState({});
  const [isHidden, setisHidden] = useState(0);
  const [mediafiles, setmediafiles] = useState([])

  function generateSlug(title) {
    // Convert the title to lowercase and replace special characters with dashes
    const slug = title.toLowerCase().replace(/[^a-zA-Z0-9]+/g, '-');
  
    // Remove leading and trailing dashes
    const trimmedSlug = slug.replace(/^-+|-+$/g, '');
  
    // Return the final slug
    return trimmedSlug;
  }

  function convertToS3Url(objectKey) {
    const s3Url = `https://scriblo.s3.us-east-2.amazonaws.com/${isHidden ? 'drafts' : 'images'}/${objectKey}.jpg`;
  
    return s3Url;
  }
  const uploadToS3 = async (file, index, fileName) => {

    const bucketName = process.env.NEXT_PUBLIC_AWS_BUCKET_NAME
    const bucketRegion = process.env.NEXT_PUBLIC_AWS_BUCKET_REGION
    const bucketAccessKey = process.env.NEXT_PUBLIC_AWS_ACCESS_KEY
    const bucketSecretKey = process.env.NEXT_PUBLIC_AWS_SECRET_KEY

    const s3 = new S3Client({
      region: bucketRegion,
      credentials: {
        accessKeyId: bucketAccessKey,
        secretAccessKey: bucketSecretKey
      },

  });

  const params = {
    Bucket: bucketName,
    Key: `${isHidden ? 'drafts' : 'images'}/${fileName}_${index}.jpg`,
    Body: file,
    contentType: 'image/jpeg',
  }

  const command = new PutObjectCommand(params)

  const s3Result = await s3.send(command)

  // console.log(s3Result)
}

  const logDetails = () => {

    if (rawEntityContent.entityMap) {

      const blobSrcs = Object.values(rawEntityContent.entityMap)
        .filter((item) => item.data.src.startsWith("blob:"))
        .map((item) => item.data.src);
      console.log("blobUrls: ", blobSrcs)

      if (blobSrcs.length > 0) {
        blobSrcs.forEach((blobSrc, index) => {
          uploadToS3(uploadImages.filter((img) => img.localSrc == blobSrc)[0].file, index, generateSlug(title))
          setmediafiles([...mediafiles, convertToS3Url(`${generateSlug(title)}_${index}`)])
          
          for (const key in rawEntityContent.entityMap) {
            if (rawEntityContent.entityMap[key].data.src === blobSrc) {
              rawEntityContent.entityMap[key].data.src = convertToS3Url(`${generateSlug(title)}_${index}`);
            }
          }
        });
      }
        
      
    }

    console.log("rawEntityContent: ", draftToHtml(rawEntityContent))
    console.log("mediafiles: ", mediafiles)

  };

  const savePost = async () => {
    setisHidden(1)

    let tagsIDs = [1,2,3];

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", draftToHtml(rawEntityContent));
    formData.append("tags", tags);
    // for tagIDs we need to get the id of the selected tags from the allTags.js file
    formData.append("tagsIDs", tagsIDs);
    formData.append("authorId", authorId);
    formData.append("isHidden", 1);
    formData.append("mediafiles", mediafiles);
    formData.append("slug", generateSlug(title));

    const res = await fetch(`http://127.0.0.1/scriblo-server/api/posts`, {
      method: "POST",
      // headers: {
      //   Authorization: `Bearer ${session?.token}`
      // },
      body: formData,
    });
    const data = await res.json();
    console.log(data);

  }
  return (
    <>
    <AddPostNavigation savePost={savePost} />
    <div className="newPostContainer">
      <button onClick={() => logDetails()}>Log Details</button>

      <div className="editorContainer">
        <div className="creatHeader">
          <textarea
            type="text"
            placeholder="Title Here"
            name="title"
            className="articleTitle"
            cols={1}
            onChange={(e) => settitle(e.target.value)}
          />
          <input
            type="text"
            name="tags"
            placeholder="Add 3 tags"
            className="tagInput"
          />
        </div>

        <TextEditor
          uploadImages={uploadImages}
          setuploadImages={setuploadImages}
          content={content}
          setcontent={setcontent}
          setrawEntityContent={setrawEntityContent}
        />
      </div>
    </div>
    </>
  );
}

export default Create;
