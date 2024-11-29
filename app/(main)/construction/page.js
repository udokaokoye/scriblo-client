'use client'
import Image from 'next/image'
import React, {useState, useEffect} from 'react'
import '../../../Styles/construction.css'
import moment from 'moment';
function Construction() {

    const [hoursDisplay, sethoursDisplay] = useState('')
    const [minDisplay, setminDisplay] = useState('')
    const [secondsDisplay, setsecondsDisplay] = useState('')
    const [intervalIdd, setintervalIdd] = useState(0)
    const targetTime = moment("2024-11-30 18:00:00", "YYYY-MM-DD HH:mm:ss")

// Function to update the countdown
function updateCountdown() {
  const now = moment();
  const duration = moment.duration(targetTime.diff(now));

  if (duration.asMilliseconds() <= 0) {
    // document.getElementById('countdown').innerText = 'Countdown Complete!';
    clearInterval(intervalId); // Stop the countdown
    return;
  }

  const hours = Math.floor(duration.asHours());
  const minutes = Math.floor(duration.minutes());
  const seconds = Math.floor(duration.seconds());

  // Format and display the countdown
  sethoursDisplay(hours.toString().padStart(2, '0'))
  setminDisplay(minutes.toString().padStart(2, '0'))
  setsecondsDisplay(seconds.toString().padStart(2, '0'))
}

// Update the countdown every second


useEffect(() => {
    updateCountdown();

    const intervalId = setInterval(updateCountdown, 1000);
setintervalIdd(intervalId)
}, [])

  return (
    <div className='constructionContainer' style={{width: '100%', height: '100vh'}}>
        <h1>Scriblo Is Currently Under Maintenance</h1>
        <h3>Estimated Uptime in: <span>{hoursDisplay} hrs {minDisplay} mins  {secondsDisplay} secs</span></h3>
        <div style={{ maxWidth: '100%', height: 'auto', overflow: 'hidden', marginTop: 50 }}>
      <Image
        src='https://scriblo.s3.us-east-2.amazonaws.com/branding/construction.png' // Path to your image
        alt="Descriptive Alt Text"
        layout="responsive" // Ensures the image auto-resizes
        width={16} // Aspect ratio width
        height={9} // Aspect ratio height
        priority={true} // Optional: Preloads image for above-the-fold content
      />
    </div>

   <a href="mailto:leviokoye@gmail.com"><button>Contact Us</button></a> 
    </div>
  )
}

export default Construction