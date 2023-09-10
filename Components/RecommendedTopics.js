import Link from 'next/link'
import React from 'react'

function RecommendedTopics({topics, source_Sans_Pro}) {
  return (
    <div className={`recommendedTopicsContainer ${source_Sans_Pro.className}`}>
        <h4>Recommended topics</h4>

        <div className="recTopics">
            {topics.map((topic) => (
                <Link href={`/search?q=${topic}&class=tags`}>
                <div key={topic} className="recTopic">
                    {topic}
                </div>
                </Link>
            ))}
        </div>

        <Link href={'/explore'}><span>Explore more topics</span></Link>
    </div>
  )
}

export default RecommendedTopics