"use client";
import React, { useState } from "react";
import { Chat } from '@mui/icons-material'
import "../Styles/FeedBack.css";
import { source_Sans_Pro } from "@/public/util/fonts";
import moment from "moment";
import { usePathname } from "next/navigation";
const FeedBack = () => {
  const [showFeedBackForm, setshowFeedBackForm] = useState(false);
  const [feedbackStage, setfeedbackStage] = useState(1);
  const [feedbacknature, setfeedbacknature] = useState("none");
  const [feedbackProblem, setfeedbackProblem] = useState('')
  const [feedbackReproduction, setfeedbackReproduction] = useState('')
  const [loading, setloading] = useState(false)
  const pathName = usePathname()

  const submitFeedback = async () => {
    if (feedbackProblem == '') {
        alert("Enter your problem / suggestion")
        return;
    }
    setloading(true)
    const formData = new FormData()

    formData.append('type', feedbacknature)
    formData.append('problem', feedbackProblem)
    formData.append('reproduction', feedbackReproduction)
    formData.append('date', moment().format("YYYY-MM-DD hh:mm:ss"))
    formData.append('page', pathName)
    const response =  await fetch(`${process.env.NEXT_PUBLIC_API_URL}/utils/Feedback.php`, {
        method: "POST",
        body: formData
    })

    const jsonResponse = await response.json();
    setloading(false)

    if (jsonResponse.status == 200) {
        setfeedbackStage(3)
    } else {
        alert("An error occured, try again")
    }


  }
  return (
    <div className={`feedBackContainer ${source_Sans_Pro.className}`}>
      <div className="feedbackBtn">
        <p onClick={() => setshowFeedBackForm(!showFeedBackForm)}><Chat className="chatIcon" /> Feedback</p>
      
      </div>

      <div
        // style={{ right: showFeedBackForm ? 60 : -500 }}
        className={`feedbackFormContainer ${showFeedBackForm ? 'open' : 'close'}`}
      >
        {feedbackStage == 1 && (
          <div className="stageOne">
            <h3>What's the nature of your feedback?</h3>

            <div className="feedbackOptions">
              <span
                onClick={() => {
                  setfeedbacknature("technical");
                  setfeedbackStage(2);
                }}
              >
                Technical
              </span>
              <span
                onClick={() => {
                  setfeedbacknature("suggestion");
                  setfeedbackStage(2);
                }}
              >
                Suggestion
              </span>
              <span
                onClick={() => {
                  setfeedbacknature("bug");
                  setfeedbackStage(2);
                }}
              >
                Bug
              </span>
              <span
                onClick={() => {
                  setfeedbacknature("not working");
                  setfeedbackStage(2);
                }}
              >
                Somethings not working
              </span>
              <span
                onClick={() => {
                  setfeedbacknature("something else");
                  setfeedbackStage(2);
                }}
              >
                Something else
              </span>
            </div>
                <br />
            <span onClick={() => setshowFeedBackForm(false)} className="close">Close</span>
          </div>
        )}

        {feedbackStage == 2 && (
          <div className="stageTwo">
            <div className="stageHeader">
                <span onClick={() => setfeedbackStage(1)}> {`<`} back</span>
            </div>
            {feedbacknature == "technical" ||
            feedbacknature == "bug" ||
            feedbacknature == "not working" ? (
              <>
                <div className="formField">
                  <h3>What's the problem?</h3>
                  <textarea value={feedbackProblem} onChange={(e) => setfeedbackProblem(e.target.value)}></textarea>
                </div>

                <div className="formField">
                  <h3>How can we reproduce it?</h3>
                  <textarea value={feedbackReproduction} onChange={(e) => setfeedbackReproduction(e.target.value)}></textarea>
                </div>
              </>
            ) : (
              <>
                <div className="formField">
                  <h3>How can we make Scriblo better?</h3>
                  <textarea value={feedbackProblem} onChange={(e) => setfeedbackProblem(e.target.value)}></textarea>
                </div>
              </>
            )}

            <button className="submitBtn" onClick={() => submitFeedback()}>{loading? 'loading...' : 'Submit Feedback'}</button>
          </div>
        )}

        {feedbackStage == 3 && (
            <div className="stageThree">
                <h3>Feedback Received ✅</h3>
                <p>Thanks for your contribution to make scriblo better. Our team will use the information provided to make scriblo better.</p>
                <button onClick={() => setshowFeedBackForm(false)} className="closeBtn">Close</button>
            </div>
        )}
      </div>
    </div>
  );
};

export default FeedBack;
