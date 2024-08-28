import Image from 'next/image'
import React from 'react'
import verifiedImage from '../public/images/verified.png'
function Verified({size=20}) {
  return (
    <Image title='This User Is Verified' src={verifiedImage} width={size} height={size} />
  )
}

export default Verified