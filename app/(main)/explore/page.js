'use client'
import React from 'react'
import SearchIcon from '@mui/icons-material/Search';
import { source_Sans_Pro } from '@/public/util/fonts';
import '../../../Styles/explore.css'
import { allTags } from '@/public/util/allTags'
import Link from 'next/link';
function Explore() {
  return (
    <div className={`${source_Sans_Pro.className} exploreContainer`}>
        <h1>Search Topics</h1>
        <div className="searchInput">
            <SearchIcon />
            <input type="text" placeholder='Search all topics' />
        </div>

        <div className="allTopics">
            {
                allTags.map((tag, index) => (
                    <Link href={`/search?q=${tag.name}&class=tags`} >
                        <span key={index}>{tag.emoji} {tag.name}</span>
                        </Link>
                ))
            }
        </div>
    </div>
  )
}

export default Explore