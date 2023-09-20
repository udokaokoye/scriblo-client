"use client";

import React, { useState } from "react";
import "@/Styles/verification.css";
import { source_Sans_Pro } from "@/public/util/fonts";
function Verification() {
  const [email, setemail] = useState("");
  const [username, setusername] = useState("");
  const [additionalInformation, setadditionalInformation] = useState("");
  const [requestRecived, setrequestRecived] = useState(false);
  const [errorOccured, seterrorOccured] = useState(false)

  const submitRequest = async () => {
    if (email == "" || username == "") {
      alert("Email and username is required");
      return;
    }
    const formData = new FormData();

    formData.append("email", email);
    formData.append("username", username);
    formData.append("additionalInformation", additionalInformation);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/utils/verificationRequest.php`,
      {
        method: "POST",
        body: formData,
      }
    );
    const jsonResponse = await response.json();
    if (jsonResponse.status == 201) {
        setrequestRecived(true)
    } else {
        seterrorOccured(true)
    }
  };
  return (
    <div className={`verificationContainer ${source_Sans_Pro.className}`}>
      {!requestRecived ? (
        <>
          <h1>Verification Application</h1>
          <p>
            Get help with your verification request for Scriblo. Information
            shared will only be used to respond to your request.
          </p>

          {errorOccured && <p className="error">An Error Occurred, Try again.</p>}

          <div className="field">
            <span>
              Email address <sup>*</sup>
            </span>
            <input
              onChange={(e) => setemail(e.target.value)}
              value={email}
              type="email"
            />
          </div>

          <div className="field">
            <span>
              Username <sup>*</sup>
            </span>
            <input
              onChange={(e) => setusername(e.target.value)}
              value={username}
              type="email"
            />
            <small>
              The username can be found on an account's Scriblo profile.
            </small>
          </div>

          <div className="field">
            <span>Additional Information</span>
            <textarea
              onChange={(e) => setadditionalInformation(e.target.value)}
              value={additionalInformation}
              type="email"
            />
            <small>Any other information you'll like to share.</small>
          </div>

          <button onClick={submitRequest}>Submit Request</button>
        </>
      ) : (
        <>
        <br /><br /><br /><br />
          <div className="confirmImage">✅</div>
          <h1>Request Recieved!</h1>
          <p>
            Our dedicated team will carefully review your application to ensure
            it aligns with our verification criteria. You should get a response within 3-5 days.
          </p>
        </>
      )}
    </div>
  );
}

export default Verification;
