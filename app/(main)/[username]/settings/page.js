'use client'
import "@/Styles/settings.css";
import { useEffect, useRef, useState } from "react";
import { source_Sans_Pro } from "@/public/util/fonts";
import ClientProtectedRoute from "@/Components/ClientProtectedRoute";
import Popup from "@/Components/Popup";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
function Settings({params}) {
    const { data: session } = useSession()
    const [user, setuser] = useState({})
    const [settingsTab, setsettingsTab] = useState('account')
    const [popupActive, setpopupActive] = useState(false)
    const [popupContent, setpopupContent] = useState('')
    const profilePhotoRef = useRef(null)
    

    useEffect(() => {
        const getuserInfo = async () => {
            const userResponse = await fetch(
                `/api/users/actions.php?action=getUser&username=${session?.username}`
              );
              const userData = await userResponse.json();
              setuser(userData.data)
        }

        getuserInfo()
    }, [session])

    useEffect(() => {
      if (session?.username !== params?.username) {
        redirect('/')
      }
    }, [session])
    
    
  return (
    <ClientProtectedRoute>
        <div className={`settingsContainer ${source_Sans_Pro.className}`}>
            {popupActive && <Popup profilePhotoRef={profilePhotoRef} closePopup={() => setpopupActive(false)} popupContent={popupContent} user={user} />}
            
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
                    <span>{user ? user.email : '...'}</span>
                </div>
                
                <div className="accountField">
                    <span>Username</span>
                    <span>@{user ? user.username : '...'}</span>
                </div>
                <div className="accountField">
                    <span>Profile Information</span>
                    <span>{user ? user.email : '...'}</span>
                </div>
                <div className="deleteAccount">
                    <span>Delete Account</span>
                    <small>Permanently delete you account and all it's content including articles and comments</small>
                </div>
                {/* <button onClick={() => setpopupActive(true)}>popup</button> */}
                </>
        }

{settingsTab === 'publishing' && (
    <h4>Accessibility Feature Coming Soon</h4>
)


    }

{settingsTab === 'notification' && (
    <h4>Accessibility Feature Coming Soon</h4>
)


    }
        </div>
                    
            </div>
        </div>
    </ClientProtectedRoute>
  );
}

export default Settings;
