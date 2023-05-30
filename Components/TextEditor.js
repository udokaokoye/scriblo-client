"use client";
import React, { useState, useEffect } from "react";
import { EditorState, ContentState, AtomicBlockUtils, convertToRaw } from 'draft-js';
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import draftToHtml from "draftjs-to-html";
// import { Edit } from "@mui/icons-material";

function TextEditor({ uploadImages, setuploadImages}) {
  const [editorState, seteditorState] = useState(EditorState.createEmpty());
  const [content, setcontent] = useState('')

  // useEffect(() => {
  //   console.log("Content: " + content)
  // }, [content])

  function getEmbedLink(url) {
    let embedLink = '';

    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      // YouTube
      const videoId = url.match(/(?:\?v=|\/embed\/|\.be\/)([\w\-\_]+)/)[1];
      embedLink = `https://www.youtube.com/embed/${videoId}`;
    } else if (url.includes('vimeo.com')) {
      // Vimeo
      const videoId = url.match(/vimeo(?:.com\/video\/|\/)(\d+)/)[1];
      embedLink = `https://player.vimeo.com/video/${videoId}`;
    } else if (url.includes('twitter.com')) {
      // Twitter
      const tweetId = url.match(/\/status\/(\d+)/)[1];
      embedLink = `https://twitframe.com/show?url=https://twitter.com/anyuser/status/${tweetId}`;
    } else if (url.includes('facebook.com')) {
      // Facebook
      const postId = url.match(/facebook\.com\/([^\/]+)\/posts\/(\d+)/)[2];
      embedLink = `https://www.facebook.com/plugins/post.php?href=https://www.facebook.com/${postId}`;
    } else if (url.includes('instagram.com')) {
      // Instagram
      const postUrl = url.replace(/(\/\?utm.*)|\/$/, '');
      embedLink = `https://www.instagram.com/p/${postUrl.split('/').pop()}/embed`;
    } else {
      // Unsupported source, return the original URL
      embedLink = url;
    }
  
    return embedLink;
  }

  const blockRendererFn = (contentBlock) => {
    if (contentBlock.getType() === 'atomic') {
      const entityKey = contentBlock.getEntityAt(0);
      if (entityKey) {
        const entity = ContentState.getEntity(entityKey);
        if (entity.getType() === 'iframe') {
          const data = entity.getData();
          const { src, className } = data;
          return {
            component: CustomIFrameComponent,
            editable: false,
            props: {
              src,
              className,
            },
          };
        }
      }
    }
    return null;
  };
  
  const CustomIFrameComponent = ({ src, className }) => (
    <div className={className}>
      <iframe src={src} title="Embedded Content" />
    </div>
  );


  const uploadImageCallBack = (file) => {
    return new Promise((resolve, reject) => {
        const imageObject = {
            file: file,
            localSrc: URL.createObjectURL(file),
          }
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
        
            setuploadImages(prevState => [...prevState, imageObject]);
            resolve( { data: { link: imageObject.localSrc } });
    });

        // return new Promise(
        //   (resolve, reject) => {
        //     resolve({ data: { link: imageObject.localSrc } });
        //   }
        // );
  }
  const embededLinkCallBack = (url) => {
    const embedLink = getEmbedLink(url);
    console.log(embedLink)

    return embedLink;
  }
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
        toolbarClassName="toolbarClassName"
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
            "emoji",
            "image",
          ],
          inline: { inDropdown: true },
          list: { inDropdown: true },
          textAlign: { inDropdown: true },
          link: { inDropdown: true },
          history: { inDropdown: true },
          image: {
            uploadCallback: uploadImageCallBack,
            className: "uploadImage", 
            previewImage: true,
            alignmentEnabled: false,
            // alt: { present: false, mandatory: false },
            defaultSize: {
                height: '100%',
                width: '100%',
                margin: "0 auto",

              },
          },
          embedded: {
            embedCallback: embededLinkCallBack,
            defaultSize: {
              height: 'auto',
              width: 'auto',
            },
          },
        }}
        onEditorStateChange={(editorState) => {
          seteditorState(editorState);
          setcontent(draftToHtml(convertToRaw(editorState.getCurrentContent())));
      }}
      blockRendererFn={blockRendererFn}
        // blockRendererFn={(contentBlock) => {
        //     const type = contentBlock.getType();
        //     if (type === 'atomic') {
        //       return {
        //         component: AtomicImageComponent,
        //         editable: false,
        //       };
        //     }
        //     return null;
        //   }}
      />
    </div>
  );
}

export default TextEditor;
