'use client'
import { copyToClipboard } from '@/public/util/helpers'
import React from 'react'

function PromoteScriblo() {
  return (
    <div className='promoteScribloContainer'>
        <div className="scribloBanner"></div>
        <h3>Spread the Word, Amplify Your Voice!</h3>
        <p>Help us grow and empower more writers by sharing Scriblo with your network. Together, we can build a vibrant community of readers and creators.</p>

        <button onClick={() => {
          copyToClipboard("https://myscriblo.com")
          alert("Link copied to clipboard")
        }}>Share Scriblo</button>
    </div>
  )
}

export default PromoteScriblo