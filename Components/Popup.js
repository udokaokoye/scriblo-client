'use client'
import React from 'react'
import '@/Styles/popup.css'
function Popup({closePopup, profilePhotoRef, popupContent}) {
  return (
    <div className='popupContainer'>
        <div className="popupcloserdiv" onClick={() => closePopup()}></div>
        <div className="popupContent">
            {
                popupContent === 'editProfile' &&
                <div className="editProfilePopup">
                    <h3>Profile Information</h3>

                    <div className="updatePhoto">
                        <div className="currentProfilePhoto"></div>
                        <div className="photoActions"><span>Update</span> <span>Remove</span></div>
                        <input type="file" name="profilephoto" id="profilephoto" ref={profilePhotoRef} style={{display: 'none'}} />
                    </div>

                    <div className="updateField">
                        <span>Name</span>
                        <input type="text" placeholder='Udoka Okoye' value={'Udoka Okoye'}/>
                        <small>Appears on your profile</small>
                    </div>

                    <div className="updateField">
                        <span>Bio</span>
                        <textarea type="text" placeholder='Udoka Okoye' value={'Udoka Okoye'}/>
                        <small>Appears on your profile</small>
                    </div>

                    <div className="updateProfileBtns">
                        <button className='cancel'>Cancel</button>
                        <button className='save'>Save</button>
                    </div>
                </div>
            }
        </div>
    </div>
  )
}

export default Popup