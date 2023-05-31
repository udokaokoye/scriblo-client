import React from 'react'

function AddPostNavigation() {
  return (
    <div className='addPostNavigation'>
        <div className="logo">
            <div className="logoImg"></div>
            <span>Create Post</span>
        </div>

        <div className="menuBtns">
            <button className='btn btnDanger'>Cancel</button>
            <button className="btn btnBlue">Save Draft</button>
            <button className="btn">Publish</button>
        </div>
    </div>
  )
}

export default AddPostNavigation