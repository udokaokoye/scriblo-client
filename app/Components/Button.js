import React from 'react'
import Link from 'next/link'
function Button({title, onClick, className, clickable=false, disabled=false, link}) {
  return (
    <>
    {clickable && (<Link href={link}><button className={className} onClick={onClick} disabled={disabled}>{title}</button></Link>)}
    {!clickable && (<button className={className} onClick={onClick} disabled={disabled}>{title}</button>)}
    </>
  )
}

export default Button