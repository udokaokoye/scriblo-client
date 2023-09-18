import React from 'react'
import '@/Styles/verification.css'
import { source_Sans_Pro } from '@/public/util/fonts'
function Verification() {
  return (
    <div className={`verificationContainer ${source_Sans_Pro.className}`}>
        <h3>Requirements to apply for a verified badge on Scriblo </h3>

        <p>We appreciate your interest in becoming a verified user on our platform. Verification is a mark of authenticity and trustworthiness, enhancing your profile's credibility and distinguishing you as a respected member of our community. To ensure the integrity of our verification process, please review and meet the following requirements:</p>

        <h5>1. Authenticity:</h5>
        <ul>
            <li>You must be a real individual, organization, or entity.</li>
            <li>Avoid the use of fake names or impersonation of others.</li>
        </ul>

        <h5>2. Profile Completeness:</h5>
        <ul>
            <li>Your profile should be informative and complete.</li>
            <li>Include a profile picture, a bio or description, and relevant information about yourself or your organization.</li>
        </ul>

        <h5>3. Activity:</h5>
        <ul>
            <li>Maintain an active presence on our platform.</li>
            <li>Consistently contribute to our community through posting and engagement.</li>
        </ul>

        <h5>4. Relevance:</h5>
        <ul>
            <li>Your presence and content should align with the niche or topic of our platform.</li>
            <li>Your interests and contributions should be relevant to our community's focus.</li>
        </ul>


        <h5>5. Content Contribution:</h5>
        <ul>
            <li>Publish a minimum of 10 articles or have written at least 100 minutes worth of articles on our platform. Quality and relevance are key.</li>
        </ul>

        <h5>6.  Minimum of 50 Followers:</h5>
        <ul>
            <li>Build a following of at least 50 engaged users who find value in your contributions.</li>
        </ul>
    </div>
  )
}

export default Verification