import Button from '../Components/Button'
import React from 'react'

function About() {
  return (
    <div className='aboutContainer'>
        <div className="brand_logo">

        </div>

    <h1>Welcome to Scriblo!</h1>
    <p>A revolution in the world of blogging and creative expression.</p>


  <main>
    <section>
      <h2>About Scriblo</h2>
      <p>Scriblo is a groundbreaking platform that brings together writers, bloggers, and readers from around the globe. We believe that everyone has a story to tell and that the world deserves to hear it.</p>
      <p>With Scriblo, you can unleash your creativity, connect with fellow wordsmiths, and explore a universe of captivating blog posts and articles that cover a wide range of topics.</p>
    </section>

    <section>
      <h2>Key Features</h2>
      <ul>
        <li>Discover a diverse collection of high-quality blog posts, articles, and stories.</li>
        <li>Connect with a global community of writers and readers who share your passions.</li>
        <li>Showcase your own writing skills and gain recognition for your work.</li>
        <li>Explore different genres and topics to expand your knowledge and perspectives.</li>
        <li>Engage in discussions, leave comments, and provide feedback to fellow writers.</li>
        <li>Stay updated with personalized recommendations based on your interests.</li>
      </ul>
    </section>

    <section>
      <h2>How It Works</h2>
      <ol>
        <li>Create a personal profile to showcase your writing style and interests.</li>
        <li>Explore a vast collection of blog posts and articles across various categories.</li>
        <li>Connect with writers and readers who inspire you and build meaningful connections.</li>
        <li>Showcase your own work by publishing your stories and articles.</li>
        <li>Receive feedback and engage in discussions to improve your writing skills.</li>
        <li>Stay connected with the latest updates, events, and competitions in the writing community.</li>
      </ol>
    </section>
  </main>
  <br /><br />
        <Button title='Join the waitlist' clickable link={'/'} />
    </div>
    
  )
}

export default About