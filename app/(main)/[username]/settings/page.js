'use client'
import "@/Styles/settings.css";
import { useRef, useState } from "react";
import { source_Sans_Pro } from "@/public/util/fonts";
import ClientProtectedRoute from "@/Components/ClientProtectedRoute";
import Popup from "@/Components/Popup";
function Settings() {
    const [settingsTab, setsettingsTab] = useState('account')
    const [popupActive, setpopupActive] = useState(false)
    const [popupContent, setpopupContent] = useState('')

    const profilePhotoRef = useRef(null)
  return (
    <ClientProtectedRoute>
        <div className={`settingsContainer ${source_Sans_Pro.className}`}>
            {popupActive && <Popup profilePhotoRef={profilePhotoRef} closePopup={() => setpopupActive(false)} popupContent={popupContent} />}
            
            <div className="settingsWrapper">
            <h1 className="settingsHeaderText">Settings</h1>
            <div className="SettingsTabs">
                <span className={`settingsTab ${settingsTab === 'account' ? 'activeTab' : ''}`} onClick={() => setsettingsTab('account')}>Account</span>
                <span className={`settingsTab ${settingsTab === 'publishing' ? 'activeTab' : ''}`} onClick={() => setsettingsTab('publishing')}>Publishing</span>
                <span className={`settingsTab ${settingsTab === 'notification' ? 'activeTab' : ''}`} onClick={() => setsettingsTab('notification')}>Notifications</span>
            </div>

            <div className="settingsContent">
                {settingsTab === 'account' && 
                <>
                <div onClick={() => {
                    setpopupContent('editProfile')
                    setpopupActive(true)
                }} className="accountField">
                    <span>Email Address</span>
                    <span>leviokoye@gmail.com</span>
                </div>
                
                <div className="accountField">
                    <span>Username</span>
                    <span>@leviokoye</span>
                </div>
                <div className="accountField">
                    <span>Profile Information</span>
                    <span>leviokoye@gmail.com</span>
                </div>
                <div className="deleteAccount">
                    <span>Delete Account</span>
                    <small>Permanently delete you account and all it's content including articles and comments</small>
                </div>
                <button onClick={() => setpopupActive(true)}>popup</button>
                </>
        }
        </div>
                    
            </div>
        </div>
    </ClientProtectedRoute>
  );
}

export default Settings;
