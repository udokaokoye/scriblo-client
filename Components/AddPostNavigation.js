import React from 'react'

function AddPostNavigation({savePost, stage, setstage}) {
  return (
    <div className='addPostNavigation'>
        <div className="logo">
            <div className="logoImg"></div>
            <span>Create Post</span>
        </div>

        <div className="menuBtns">
            <button className='btn btnDanger' onClick={()=> setstage('create')}>Cancel</button>
            <button className="btn btnBlue" onClick={() => setstage('preview')}>Save Draft</button>
            <button className="btn" onClick={() => setstage('preview')}>Next</button>
        </div>
    </div>
  )
}

export default AddPostNavigation