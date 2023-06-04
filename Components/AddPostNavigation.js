import React from 'react'

function AddPostNavigation({savePost, stage, setstage, seteditorState, editorState}) {
  return (
    <div className='addPostNavigation'>
        <div className="logo">
            <div className="logoImg"></div>
            <span>{stage} Post</span>
        </div>

        <div className="menuBtns">
            <button className='btn btnDanger' onClick={()=> setstage('create')}>Cancel</button>
            {/* <button className="btn btnBlue" onClick={() => setstage('preview')}>Save Draft</button> */}
            {stage !== 'preview' && (
              <button className="btn" onClick={() => {
                setstage('preview')
                seteditorState(editorState)
              }}>Next</button>
            )}
            
        </div>
    </div>
  )
}

export default AddPostNavigation