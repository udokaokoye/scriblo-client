import React from 'react'
import '@/Styles/CTAs.css'
import Link from 'next/link'
function ReadOurBlogCTASide() {
  return (
    <div className='readOurBlogCTASideContainer'>
        <div className="CTAImage"></div>
        <h3 className="ctaTitle">Get Inspired by Captivating Blog Posts</h3>
        <p className="ctaDescription">Dive into a world of insightful articles and thought-provoking stories. Our diverse collection of blog posts covers a wide range of topics to ignite your curiosity and fuel your passion. Explore our carefully curated content and embark on a journey of inspiration.</p>
        <Link href={'/scriblo_19'}><button className="ctaButton">Read Our Blog</button></Link>
    </div>
  )
}

export default ReadOurBlogCTASide