'use client'
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import React from 'react'
import Button from './Button';
import {useState, useEffect} from 'react'
import Link from 'next/link';

function Form() {
    const [email, setemail] = useState('')
    const [message, setmessage] = useState('')
    const [message2, setmessage2] = useState('')
    const [errormessage, seterrormessage] = useState('')

    useEffect(() => {
      if (message !== '') {
        setTimeout(() => {
          setmessage('')
        }, 15000);
      }
    }, [message])
    function isValidEmail(email) {
      // Regular expression pattern for validating email
      var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      
      // Check if the email matches the pattern
      return emailPattern.test(email);
    }
    

    const handleSubmit = () => {
      if (email === '') {
        seterrormessage('please enter your email')
        return;
      }
      if (!isValidEmail(email)) {
        seterrormessage('please enter a valid email')
        return;
      }

      const formData = new FormData();
      formData.append('email', email);
      seterrormessage('')
      fetch('https://api.myscriblo.com/waitlist/index.php', {
        method: 'POST',
        body: formData,
      }).then((response) => response.json()).then((data) => {
        // console.log(data)
        if (data.status == 200) {
          setmessage("🎉 Thanks for joining 🎉")
          setmessage2("you've officially become a part of the coolest gang in the blogosphere By joining our waitlist! 🌚")
        } else if (data.status == 400) {
          setmessage("you've already joined our waitlist! 🌚")
          setmessage2("I know you're excited lad, but you can only join once! 😂")
        }
         else {
          setmessage("😢 something went wrong, please try again later")
        }
      }).catch((error) => {
        console.error('Error:', error);
      });
    }
  return (
    <div>
        <div className="joinWaitlist">
        <h1>Join the wait list</h1>
        <p>Get notified when we launch.</p>
        {message && (<div className='message'><p className='message_bold'>{message}</p> <p className='message_small'>{message2}</p></div>)}
        {errormessage && (<p className='errMsg'>{errormessage}</p>)}
        <input value={email} onChange={(text) => setemail(text.target.value)} type="email" placeholder="example@mail.com" /><br />

        <Button title={"Join"} onClick={() => handleSubmit()} />
        <Link href={'/about'} ><span className='learnMore'>learn more about this product <ArrowRightAltIcon color='red' /></span></Link>
      </div>
    </div>
  )
}

export default Form