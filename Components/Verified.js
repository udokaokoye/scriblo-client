import Image from 'next/image'
import React from 'react'

function Verified({size=20}) {
  return (
    <Image src={'/../public/images/verified.png'} width={size} height={size} />
  )
}

export default Verified