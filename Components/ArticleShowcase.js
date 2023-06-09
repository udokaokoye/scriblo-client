import { limitText } from '@/public/util/helpers'
import React from 'react'

function ArticleShowcase({article}) {
  return (
    <div className='articleShowcaseContainer' style={{background: `url(${article?.coverImage})`}}>
        <div className="artileContent">
            <h1>{article.title}</h1>
            <p>{limitText(article.summary, 30)}</p>
            <span>5 mins read time</span>
        </div>
    </div>
  )
}

export default ArticleShowcase