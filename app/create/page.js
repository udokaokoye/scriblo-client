import TextEditor from '@/Components/TextEditor'
import React from 'react'

function Create() {
  return (
    <div className='newPostContainer'>
        <h1>Create</h1>
        
        <div className="editorContainer">
        <TextEditor />
        </div>
    </div>
  )
}

export default Create