"use client";
import '../Styles/TextEditor.css'
import React, { useState, useEffect, useLayoutEffect } from "react";
import {
  EditorState,
  ContentState,
  AtomicBlockUtils,
  convertToRaw,
} from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import draftToHtml from "draftjs-to-html";
// import { Edit } from "@mui/icons-material";

function TextEditor({ uploadImages, setuploadImages, content, setcontent, setrawEntityContent, editorState, seteditorState }) {
const [isToolBarSticky, setisToolBarSticky] = useState(false)



// useEffect(() => {
//   const handleScroll = () => {
//     const top = window.pageYOffset || document.documentElement.scrollTop;
//     setisToolBarSticky(top > 0);
//   };

//   window.addEventListener('scroll', handleScroll);
//   return () => {
//     window.removeEventListener('scroll', handleScroll);
//   };
// }, []);

  useLayoutEffect(() => {
    // setting all iframes to not scroll
    const iframes = document.querySelectorAll("iframe");

    iframes.forEach((iframe) => {
      iframe.setAttribute("scrolling", "no");
    });
  }, []);

  function getEmbedLink(url) {
    let embedLink = "";

    if (url.includes("youtube.com") || url.includes("youtu.be")) {
      // YouTube
      const videoId = url.match(/(?:\?v=|\/embed\/|\.be\/)([\w\-\_]+)/)[1];
      embedLink = `https://www.youtube.com/embed/${videoId}`;
    } else if (url.includes("vimeo.com")) {
      // Vimeo
      const videoId = url.match(/vimeo(?:.com\/video\/|\/)(\d+)/)[1];
      embedLink = `https://player.vimeo.com/video/${videoId}`;
    } else if (url.includes("twitter.com")) {
      // Twitter
      const tweetId = url.match(/\/status\/(\d+)/)[1];
      embedLink = `https://twitframe.com/show?url=https://twitter.com/anyuser/status/${tweetId}`;
    } else if (url.includes("facebook.com")) {
      // Facebook
      const postId = url.match(/facebook\.com\/([^\/]+)\/posts\/(\d+)/)[2];
      embedLink = `https://www.facebook.com/plugins/post.php?href=https://www.facebook.com/${postId}`;
    } else if (url.includes("instagram.com")) {
      // Instagram
      const postUrl = url.replace(/(\/\?utm.*)|\/$/, "");
      embedLink = `https://www.instagram.com/p/${postUrl
        .split("/")
        .pop()}/embed`;
    } else {
      // Unsupported source, return the original URL
      embedLink = url;
    }

    return embedLink;
  }

  const CustomIFrameComponent = ({ src, className }) => (
    <>
      <h1>Hello World</h1>
      <p>{className}</p>
      <iframe src={src} title="Embedded Content" className={className} />
    </>
  );

//   var stickyToolbar = document.querySelector('.rdw-editor-toolbar');
// var stickyToolbarOffsetTop = stickyToolbar?.offsetTop;

// function handleScroll() {
//   if (window.pageYOffset >= stickyToolbarOffsetTop) {
//     stickyToolbar?.classList.add('fixed');
//   } else {
//     stickyToolbar?.classList.remove('fixed');
//   }
// }

// window.addEventListener('scroll', handleScroll);

  // const handleEmbedLink = (url, className='test_url') => {
  //   // console.log(editorState.getCurrentContent())
  //   // return;

  //   const contentState = editorState.getCurrentContent();
  //   console.log(contentState)
  //   // return;
  //   // const embedLink = getEmbedLink(url);
  //   const contentStateWithEntity = contentState.createEntity('iframe', 'IMMUTABLE', { url, className: "heyyy" });
  //   const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
  //   const newEditorState = EditorState.set(editorState, { currentContent: contentStateWithEntity });

  //   const newContentState = AtomicBlockUtils.insertAtomicBlock(
  //     newEditorState.getCurrentContent(),
  //     entityKey,
  //     ' '
  //   );

  //   const newEditorStateWithEmbed = EditorState.push(
  //     newEditorState,
  //     newContentState,
  //     'insert-fragment'
  //   );

  //   seteditorState(newEditorStateWithEmbed);
  //   return url;
  // };

  const uploadImageCallBack = (file) => {
    return new Promise((resolve, reject) => {
      const imageObject = {
        file: file,
        localSrc: URL.createObjectURL(file),
      };
      // const contentState = editorState.getCurrentContent();
      // const contentStateWithEntity = contentState.createEntity( 'IMAGE', 'IMMUTABLE', { src: imageObject.localSrc, className: 'uploadImage' } );
      // const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
      // const newEditorState = EditorState.set(editorState, { currentContent: contentStateWithEntity });
      // const newBlock = new ContentBlock({
      //     key: genKey(),
      //     type: 'atomic',
      //     text: ' ',
      //     characterList: List(),
      //     data: Map({
      //       entity: entityKey
      //     })
      //   });

      //   const newContentState = contentStateWithEntity.merge({
      //     blockMap: contentStateWithEntity.getBlockMap().set(newBlock.getKey(), newBlock),
      //     selectionAfter: new SelectionState({
      //       anchorKey: newBlock.getKey(),
      //       anchorOffset: 0,
      //       focusKey: newBlock.getKey(),
      //       focusOffset: 0,
      //       isBackward: false,
      //       hasFocus: true
      //     })
      //   });
      //   const newEditorStateWithBlock = EditorState.set(newEditorState, {
      //     currentContent: newContentState
      //   });

      // seteditorState(newEditorStateWithBlock);

      setuploadImages((prevState) => [...prevState, imageObject]);
      resolve({ data: { link: imageObject.localSrc } });
    });

    // return new Promise(
    //   (resolve, reject) => {
    //     resolve({ data: { link: imageObject.localSrc } });
    //   }
    // );
  };
  const embededLinkCallBack = (url) => {
    const embedLink = getEmbedLink(url);
    // console.log(embedLink)

    return embedLink;
  };
  const AtomicImageComponent = (props) => {
    const { block, contentState } = props;
    const entity = contentState.getEntity(block.getEntityAt(0));
    const { src, className } = entity.getData();

    return <img src={src} className={className} alt="uploaded" />;
  };
  return (
    <div>
      <Editor
        editorState={editorState}
        toolbarClassName={`editorToolbar ${isToolBarSticky ? "fixed" :''}`}
        too
        wrapperClassName="editorWrapper"
        editorClassName="editorMain"
        toolbar={{
          options: [
            "inline",
            "blockType",
            "fontSize",
            "list",
            "textAlign",
            "history",
            "embedded",
            "link",
            "emoji",
            "image",
          ],
          inline: { inDropdown: true },
          list: { inDropdown: true },
          textAlign: { inDropdown: true },
          link: { inDropdown: false, popupClassName: "editorPopups" },
          history: { inDropdown: true },
          emoji: {className: 'editorEmoji'},
          image: {
            uploadCallback: uploadImageCallBack,
            className: "uploadImage",
            popupClassName: "editorPopups",
            previewImage: true,
            alignmentEnabled: false,
            inputAccept: "image/jpeg,image/jpg,image/png,image/svg",
            // alt: { present: true, mandatory: true },
            urlEnabled: false,
            // alt: { present: false, mandatory: false },
            defaultSize: {
              height: "100%",
              width: "100%",
              margin: "0 auto",
            },
          },
          embedded: {
            embedCallback: embededLinkCallBack,
            popupClassName: "editorPopups",
            defaultSize: {
              height: "auto",
              width: "auto",
            },
          },
        }}
        onEditorStateChange={(edst) => {
          seteditorState(edst)
          // setcontent(draftToHtml(convertToRaw(edst.getCurrentContent())));
          setrawEntityContent(convertToRaw(edst.getCurrentContent()));
        }}
        placeholder="Write your story..."
      />
    </div>
  );
}

export default TextEditor;
