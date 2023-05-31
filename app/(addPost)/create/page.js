"use client";
import TextEditor from "@/Components/TextEditor";
import React, { useState } from "react";

function Create() {
  const [uploadImages, setuploadImages] = useState([]);
  const [content, setcontent] = useState('')
  const [title, settitle] = useState('')
  const [tags, settags] = useState('')
  const [category, setcategory] = useState('')
  const [rawEntityContent, setrawEntityContent] = useState({})
  const logDetails = () => { 
    // console.log("title: ", title)
    // console.log("tags: ", tags)
    // console.log("category: ", category)
    // console.log("content: ", content)
    // console.log("uploadImages: ", uploadImages)
    rawEntityContent.entityMap[0].data.src = "https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png"
    console.log("rawEntityContent: ", rawEntityContent.entityMap)

    // TODO:
    // 1. process images
    // make a function that gets all the images from the rawEntityContent (rawEntityContent.entityMap)
    // the result from rawEntityContent.entityMap will have an array of all the images including url uploaded images
    // we need to get only the manually uploaded images
    // we can get that by checking if the image src is a url or a base64 string (rawEntityContent.entityMap[0].data.src)
    // once we get that we can try and see if we can upload that directly to the s3 bucket
    // if not, then we'll have to get the image file from image object int the uploadImages array
    // we might need to run a loop to get all the images in the rawEntityContent.entityMap from the uploadImages array
    // then we'll have to upload each image to the s3 bucket
    // then we'll have to replace the image src in the rawEntityContent.entityMap with the s3 bucket url
    // then we convert the rawEntityContent to html and send it to the server


  }
  return (
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
  );
}


export default Create;


