'use client'
import React, { useState } from 'react'
import '@/Styles/popup.css'
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
function Popup({closePopup, profilePhotoRef, popupContent, user}) {
    const [updatedName, setupdatedName] = useState(user?.name)
    const [updatedBio, setupdatedBio] = useState(user?.bio)
  return (
    <div className='popupContainer'>
        <div className="popupcloserdiv" onClick={() => closePopup()}></div>
        <div className="popupContent">
            {
                popupContent === 'editProfile' &&
                <div className="editProfilePopup">
                    <div className="popupHeader">
                    <h3>Profile Information</h3>
                    <span onClick={() => closePopup()}><CloseOutlinedIcon /></span>
                    </div>

                    <div className="updatePhoto">
                        <div style={{background: `url(${user?.avatar})`}} className="currentProfilePhoto"></div>
                        <div className="photoActions"><span>Update</span> <span>Remove</span></div>
                        <input type="file" name="profilephoto" id="profilephoto" ref={profilePhotoRef} style={{display: 'none'}} />
                    </div>

                    <div className="updateField">
                        <span>Name</span>
                        <input type="text" placeholder='Enter updated name' value={updatedName} onChange={(txt) => setupdatedName(txt.target.value)}/>
                        <small>Appears on your profile</small>
                    </div>

                    <div className="updateField">
                        <span>Bio</span>
                        <textarea type="text" placeholder='Enter Bio' value={updatedBio} onChange={(txt) => setupdatedBio(txt.target.value)}/>
                        <small>Appears on your profile</small>
                    </div>

                    <div className="updateProfileBtns">
                        <button onClick={() => closePopup()} className='cancel'>Cancel</button>
                        <button className='save'>Save</button>
                    </div>
                </div>
            }
        </div>
    </div>
  )
}

export default Popup