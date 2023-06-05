import Link from 'next/link'
import React from 'react'

function RecommendedTopics({topics, source_Sans_Pro}) {
  return (
    <div className={`recommendedTopicsContainer ${source_Sans_Pro.className}`}>
        <h4>Recommended topics</h4>

        <div className="recTopics">
            {topics.map((topic) => (
                <div key={topic} className="recTopic">
                    {topic}
                </div>
            ))}
        </div>

        <Link href={'/'}><span>Explore more topics</span></Link>
    </div>
  )
}

export default RecommendedTopics