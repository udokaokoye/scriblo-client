'use client'
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import React from 'react'
import Button from './Button';
import {useState} from 'react'
import Link from 'next/link';

function Form() {
    const [email, setemail] = useState('')
    const [message, setmessage] = useState('')

    const handleSubmit = () => {


        setmessage("🎉 you've officially become a part of the coolest gang in the blogosphere By joining our waitlist! 🎉")
    }
  return (
    <div>
        <div className="joinWaitlist">
        <h1>Join the wait list</h1>
        <p>Get notified when we launch.</p>
        {message && (<p className='message'>{message}</p>)}
        <input value={email} onChange={(text) => setemail(text.target.value)} type="email" placeholder="example@mail.com" /><br />

        <Button title={"Join"} onClick={() => handleSubmit()} />
        <Link href={'/about'} ><span className='learnMore'>learn more about this product <ArrowRightAltIcon color='red' /></span></Link>
      </div>
    </div>
  )
}

export default Form