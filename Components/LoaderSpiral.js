import React from 'react'
import '@/Styles/LoaderSpiral.css'
function LoaderSpiral({size}) {
  return (
    <div class={`loader-container`} style={{width: size == 'small' && '30px', height: size == 'small' && '30px'}}>
        <div class="loader"></div>
    </div>
  )
}

export default LoaderSpiral