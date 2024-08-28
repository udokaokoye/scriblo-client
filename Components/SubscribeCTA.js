'use client'
import React, {useState} from 'react'

function SubscribeCTA({source_Sans_Pro}) {
    const [email, setemail] = useState(null)
    const [userSubscribed, setuserSubscribed] = useState(false)
    const [error, seterror] = useState(null)
    const [successMessage, setsuccessMessage] = useState('')

    const subscribe = async () => {

        if (email =='' || email == null || email == ' ') {
            seterror('Please enter a valid email.')
            return;
        }

        const formData = new FormData
        formData.append('action', 'subscribe')
        formData.append('email', email)

        const res = await fetch('/api/users/actions.php', {
            method: "POST",
            body: formData
        })

        const data = await res.json()

        if (data?.status == 200) {
            seterror(null)
                setuserSubscribed(true)
            setsuccessMessage(data.message)
            
        } else {
            seterror('Hmm... something happend, try again.');
        }
    }
  return (
    <div className={`subscribeCtaContainer ${source_Sans_Pro.className}`}>
        <h1>Inside the Blog: Exclusive stories and interviews.</h1>
        <p>Subscribe to stay updated on the latest articles, blogging tips, and content inspiration.</p>
        {error ? (<p>{error}</p>) : ''}
        {!userSubscribed ? (
            <div className="subscribeForm">
            <input onChange={(txt) => setemail(txt.target.value)} value={email} type="email" name="email" placeholder="Enter your email" />
            <button onClick={subscribe}>Subscribe</button>
        </div>
        ): (
            <div className="successDiv">
                <h3>{successMessage}</h3>
                <a href="/signup"><button>Create an account</button></a>
            </div>
        )}
    </div>
  )
}

export default SubscribeCTA