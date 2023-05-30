'use client'
import TextEditor from '@/Components/TextEditor'
import React, {useState} from 'react'

function Create() {
  const [uploadImages, setuploadImages] = useState([])
  return (
    <div className='newPostContainer'>
        <h1>Create</h1>
        
        <div className="editorContainer">
        <TextEditor uploadImages={uploadImages} setuploadImages={setuploadImages} />
        </div>
    </div>
  )
}

export default Create