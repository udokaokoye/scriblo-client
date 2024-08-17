'use client'
import React from 'react'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import Link from 'next/link';

function HomepageShowcase() {
  return (
    <div className='homepageShowcaseContainer'>
        <h1 className='showcaseHeading'>Stay Curious.</h1>
        <div className="showcaseBannerImg"></div>
        <p className='showcaseMessage'> Discover stories, thinking, and expertise from writers on any topic</p>
        <Link href={'/#articles'}><button className='showcaseBtn'>Explore Articles <ArrowDropDownIcon /></button></Link>
    </div>
  )
}

export default HomepageShowcase