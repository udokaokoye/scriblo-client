'use client'
import "@/Styles/settings.css";
import { useEffect, useRef, useState } from "react";
import { source_Sans_Pro } from "@/public/util/fonts";
import ClientProtectedRoute from "@/Components/ClientProtectedRoute";
import Popup from "@/Components/Popup";
import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { useSession } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";
import Loading from "../loading";
function Settings({params}) {
    const { data: session, update } = useSession()
    const [user, setuser] = useState({})
    const [settingsTab, setsettingsTab] = useState('account')
    const [popupActive, setpopupActive] = useState(false)
    const [popupContent, setpopupContent] = useState('')
    const [loading, setloading] = useState(false)
    const profilePhotoRef = useRef(null)
    const router = useRouter()

    // ! popup form elemnents
    const [updatedName, setupdatedName] = useState(user?.name);
    const [updateUsername, setupdateUsername] = useState(user?.username);
    const [updatedBioUrl, setupdatedBioUrl] = useState(user?.url);
    const [updatedBio, setupdatedBio] = useState(user?.bio);
    
    const uploadAvatarToS3 = async (file) => {
        const bucketName = process.env.NEXT_PUBLIC_AWS_BUCKET_NAME;
        const bucketRegion = process.env.NEXT_PUBLIC_AWS_BUCKET_REGION;
        const bucketAccessKey = process.env.NEXT_PUBLIC_AWS_ACCESS_KEY;
        const bucketSecretKey = process.env.NEXT_PUBLIC_AWS_SECRET_KEY;
    
        const s3 = new S3Client({
          region: bucketRegion,
          credentials: {
            accessKeyId: bucketAccessKey,
            secretAccessKey: bucketSecretKey,
          },
        });
    
        const params = {
          Bucket: bucketName,
          Key: `avatars/${user?.email}_avatar.jpg`,
          Body: file,
          contentType: "image/jpeg",
        };
    
        const command = new PutObjectCommand(params);
    
        await s3.send(command);
      };
      const deleteFromS3 = async (fileName) => {
        const bucketName = process.env.NEXT_PUBLIC_AWS_BUCKET_NAME;
        const bucketRegion = process.env.NEXT_PUBLIC_AWS_BUCKET_REGION;
        const bucketAccessKey = process.env.NEXT_PUBLIC_AWS_ACCESS_KEY;
        const bucketSecretKey = process.env.NEXT_PUBLIC_AWS_SECRET_KEY;
    
        const s3 = new S3Client({
          region: bucketRegion,
          credentials: {
            accessKeyId: bucketAccessKey,
            secretAccessKey: bucketSecretKey,
          },
        });
    
        const params = {
          Bucket: bucketName,
          Key: `images/${getFileNameFromS3URL(fileName)}.jpg`,
        };
    
        const command = new DeleteObjectCommand(params);
    
        const s3Result = await s3.send(command);
        console.log(s3Result);
    
        return s3Result.$metadata;
      };
      function convertToS3Url(objectKey) {
        const s3Url = `https://scriblo.s3.us-east-2.amazonaws.com/avatars/${objectKey}.jpg`;
    
        return s3Url;
      }
      const getFileNameFromS3URL = (url) => {
        const parts = url.split("/");
        const fileNameWithExtension = parts[parts.length - 1];
        const fileName = fileNameWithExtension.split(".")[0];
        return fileName;
      };

    useEffect(() => {
      console.log(session)
        getuserInfo()
    }, [session])

    useEffect(() => {
      if (session?.username !== params?.username) {
        redirect('/')
      }
    }, [session])

    const getuserInfo = async () => {
      const userResponse = await fetch(
          `/api/users/actions.php?action=getUser&username=${session?.username}`
        );
        let userData = await userResponse.json();
        userData = userData.data
      //   console.log(userData)
        setuser(userData)
        setupdatedName(userData?.name)
        setupdateUsername(userData?.username)
        setupdatedBio(userData?.bio)
        setupdatedBioUrl(userData?.url)

  }


    const updateProfile = async (newprofileData) => {
        const formData = new FormData()
        console.log(newprofileData)
        // return;
        setloading(true)
        profilePhotoRef.current = user?.avatar
        if (newprofileData.file !== null) {
            await deleteFromS3(user?.avatar)
            await uploadAvatarToS3(newprofileData.file)
            profilePhotoRef.current = convertToS3Url(`${user?.email}_avatar`)
            // upload new profile picture
        }
        newprofileData.username = newprofileData.username.replaceAll(" ", "");
        formData.append('action', 'updateProfile')
        formData.append("userId", session?.id)
        formData.append("name", newprofileData.name)
        formData.append("username", newprofileData.username)
        formData.append('bio', newprofileData.bio)
        formData.append('url', newprofileData.url)
        formData.append('avatar', profilePhotoRef.current)
        formData.append('allowEmails', user?.allowEmails)

        const response = await fetch('/api/users/actions.php', {
            method: "POST",
            body: formData
        })

        const responseJson = await response.json()
        console.log(responseJson)
        // redirect(`/${user?.username}`)
        await update({
          ...session,
          name: newprofileData.name,
          username: newprofileData.username,
          bio: newprofileData.bio,
          url: newprofileData.url,
          avatar: profilePhotoRef.current,
        })
        setloading(false)
        alert('Profile Updated, refresh page to see changes')
        setpopupActive(false)
        getuserInfo()



    }
    
    
  return loading ? (
    <Loading />
  ) : (
    <ClientProtectedRoute>
        <div className={`settingsContainer ${source_Sans_Pro.className}`}>
            {popupActive && <Popup
            closePopup={() => setpopupActive(false)} 
            popupContent={popupContent}  
            user={user}
            updateProfile={updateProfile}
            setloading={setloading}
            // updatedBio={updatedBio}
            // updatedName={updatedName}
            // updatedBioUrl={updatedBioUrl}
            // updateUsername={updateUsername}

            setupdateUsername={setupdateUsername}
             />}
            
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
                    <span>Bio</span>
                    <span>Edit</span>
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
