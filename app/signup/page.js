"use client";
import Link from "next/link";
import { signIn, signOut } from "next-auth/react";
import { useState, useRef } from "react";
import moment from "moment";
// import { ArrowBackIos } from '@mui/icons-material';
function Signup() {
  const [useralreadyExists, setuseralreadyExists] = useState(false);
  const [stage, setstage] = useState(["signup", "signup"]);
  const [email, setemail] = useState("");
  const [token, settoken] = useState(["", "", "", "", ""]);
  const [fullName, setfullName] = useState("");
  const [avatar, setavatar] = useState("");
  const [bio, setbio] = useState("");
  const [selectedInterests, setselectedInterests] = useState([]);
  const verficationcodeRefs = useRef([]);

  // !Error messages
  const [emailError, setemailError] = useState("");
  const [tokenError, settokenError] = useState("");
  const [fullNameError, setfullNameError] = useState("");
  const [selectedInterestsError, setselectedInterestsError] = useState("");

  const fetchDemo = async () => {
    // const res = await fetch(`/api/users/checkIfUserExists.php?email=leviokoye@gmail.com`, {method: "POST"})
    // const json = await res.json()
    // console.log(json)
    signOut();
  };

  const interests = [
    {"name": "Tech", "emoji": "📱"},
    {"name": "Science", "emoji": "🔬"},
    {"name": "Health", "emoji": "🌿"},
    {"name": "Travel", "emoji": "✈️"},
    {"name": "Food", "emoji": "🍔"},
    {"name": "Fashion", "emoji": "👗"},
    {"name": "Fitness", "emoji": "💪"},
    {"name": "Decor", "emoji": "🏠"},
    {"name": "Finance", "emoji": "💰"},
    {"name": "Parenting", "emoji": "👪"},
    {"name": "Self-Improve", "emoji": "📚"},
    {"name": "Art", "emoji": "🎨"},
    {"name": "Books", "emoji": "📖"},
    {"name": "Entertainment", "emoji": "🎬"},
    {"name": "Sports", "emoji": "⚽"},
    {"name": "Environment", "emoji": "🌍"},
    {"name": "Business", "emoji": "💼"},
    {"name": "Photography", "emoji": "📷"},
    {"name": "Music", "emoji": "🎵"},
    {"name": "Lifestyle", "emoji": "🌆"},
    {"name": "Gaming", "emoji": "🎮"},
    {"name": "Beauty", "emoji": "💄"},
    {"name": "Education", "emoji": "🎓"},
    {"name": "Motivation", "emoji": "💡"},
    {"name": "Comedy", "emoji": "😂"},
    {"name": "Politics", "emoji": "🗳️"},
    {"name": "History", "emoji": "📜"},
    {"name": "Crafts", "emoji": "🎨"},
    {"name": "Gardening", "emoji": "🌱"},
    {"name": "Pets", "emoji": "🐾"},
    {"name": "Relationships", "emoji": "💑"},
    {"name": "Technology", "emoji": "💻"},
    {"name": "Design", "emoji": "🎨"},
    {"name": "Movies", "emoji": "🎥"},
    {"name": "Cooking", "emoji": "🍳"},
    {"name": "Nature", "emoji": "🌳"},
    {"name": "Writing", "emoji": "✍️"},
    {"name": "Career", "emoji": "💼"},
    {"name": "Fitness", "emoji": "💪"},
    {"name": "Inspiration", "emoji": "💡"},
    {"name": "Spirituality", "emoji": "🧘"},
    {"name": "Hobbies", "emoji": "🎯"},
    {"name": "Artificial Intelligence", "emoji": "🤖"},
    {"name": "Travel Tips", "emoji": "✈️"},
    {"name": "Parenting Tips", "emoji": "👪"},
    {"name": "DIY Projects", "emoji": "🔨"},
    {"name": "Entrepreneurship", "emoji": "🚀"},
    {"name": "Photography Tips", "emoji": "📸"},
  ];
  const avatarList = [
    "https://scriblo.s3.us-east-2.amazonaws.com/avatars/av1.jpg",
    "https://scriblo.s3.us-east-2.amazonaws.com/avatars/av2.jpg",
    "https://scriblo.s3.us-east-2.amazonaws.com/avatars/av3.jpg",
    "https://scriblo.s3.us-east-2.amazonaws.com/avatars/av4.jpg",
    "https://scriblo.s3.us-east-2.amazonaws.com/avatars/av5.jpg",
  ];

  const handleSelectedInterests = (interest) => {
    if (selectedInterests.includes(interest)) {
      setselectedInterestsError("");
      const index = selectedInterests.indexOf(interest);
      selectedInterests.splice(index, 1);
      setselectedInterests([...selectedInterests]);
    } else if (selectedInterests.length >= 3) {
      setselectedInterestsError("You can only select 3 interests. You can search for more interests later on in the application.");
    } else {
      setselectedInterestsError("");
      setselectedInterests([...selectedInterests, interest]);
    }
  };

  const checkIfUserExists = async () => {
    if (email == "") {
      setemailError("Please enter your email");
      return;
    }

    if (!isValidEmail(email)) {
      setemailError("Please enter a valid email");
      return;
    }

    setemailError("");
    const res = await fetch(`/api/users/checkIfUserExists.php?email=${email}`);
    const json = await res.json();
    console.log(json);
    setuseralreadyExists(json.message);
    const tokenSent = await sendToken();
    if (tokenSent) {
      settokenError("");
      settoken(["", "", "", "", ""]);
      setstage(["signup", "verification"]);
    }
  };

  function isTokenComplete() {
    return token.every((digit) => digit.length === 1);
  }

  const handleSignup = async () => {
    const formData = new FormData();
    formData.append("email", email);
    formData.append("name", fullName);
    formData.append("avatar", avatar);
    formData.append("bio", bio);
    formData.append("interests", selectedInterests.join(","));
    formData.append("createdAt", moment().format("YYYY-MM-DD HH:mm:ss"));

    const res = await fetch(`/api/users/index.php`, {
      method: "POST",
      body: formData,
    });
    const json = await res.json();
    console.log(json);

  };

  const handleVerification = async () => {
    const formData = new FormData();
    formData.append("email", email);
    formData.append("token", token.join(""));
    const res = await fetch(`/api/users/verifyToken.php`, {
      method: "POST",
      body: formData,
    });
    const json = await res.json();
    // ! if token is verfied and useralreadyExists is true, then login
    // ! if token is verfied and useralreadyExists is false, then signup
    console.log(json);
    if (json.status == 200 && json.message == "Token verified") {
      if (useralreadyExists) {
        // signIn("credentials", {
        //   email,
        //   password: json.password,
        //   callbackUrl: "/",
        // });
        console.log("login");
      } else {
        setstage(["verfication", "personal-information"]);
      }
    } else {
      settokenError(json.message + " Please try resending token");
      settoken(["", "", "", "", ""]);
    }
  };

  const sendToken = async (resend = false) => {
    const formData = new FormData();
    formData.append("email", email);
    const res = await fetch(`/api/users/sendToken.php`, {
      method: "POST",
      body: formData,
    });
    const json = await res.json();
    if (json.status == 200) {
      if (resend) {
        settokenError("Token resent");
      }
      return true;
    } else {
      setemailError(json.message);
      return false;
    }
  };

  const handlePersonalInfo = async () => {
    // ! check if all fields are filled
    if (fullName == "") {
      setfullNameError("Please enter your full name");
      return;
    }
    setstage(["personal-information", "select-interest"])
  };

  function isValidEmail(email) {
    // Regular expression pattern for validating email
    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Check if the email matches the pattern
    return emailPattern.test(email);
  }

  const handleChange = (index, value) => {
    if (value.length <= 1) {
      const newtoken = [...token];
      newtoken[index] = value;
      settoken(newtoken);
      if (value.length === 1 && index < 4) {
        verficationcodeRefs.current[index + 1].focus();
      }
    }
  };

  const handleBackspace = (index, event) => {
    if (event.key === "Backspace" && !token[index] && index > 0) {
      verficationcodeRefs.current[index - 1].focus();
    }
  };

  return (
    <div className="signup">
      {stage[1] == "signup" && (
        <div className="signupContainer">
          <h1 className="signupHeading">Signup for Scriblo</h1>
          <p className="signupSubHeading">
            Scriblo is a powerful and intuitive blogging platform that empowers
            writers
          </p>
          <div className="signupForm">
            <label className="signupEmailLabel">Enter email address</label>
            <input
              type="email"
              name="email"
              placeholder="example@mail.com"
              className="signupEmailInput"
              onChange={(e) => setemail(e.target.value)}
            />
            {emailError && <p className="emailError">{emailError}</p>}
            <button
              onClick={() => checkIfUserExists()}
              className="btn"
              style={{ width: "100%" }}
            >
              Continue
            </button>
            <p className="signInLink">
              Have an account?{" "}
              <Link href={"/login"}>
                <span>Log In</span>
              </Link>
            </p>
            <div className="textBreaker">
              <div className="dash"></div>
              or
              <div className="dash"></div>
            </div>

            <div className="socialLoginButtons">
              <button className="socialbutton">
                <span
                  style={{
                    backgroundImage: `url('https://scriblo.s3.us-east-2.amazonaws.com/branding/apple_logo_white.png')`,
                  }}
                  className="sociallogo"
                ></span>
                Continue with Apple
              </button>
              <br />
              <br />
              <button onClick={() => signIn("google")} className="socialbutton">
                <span
                  style={{
                    backgroundImage: `url('https://scriblo.s3.us-east-2.amazonaws.com/branding/google_logo.png')`,
                  }}
                  className="sociallogo"
                ></span>
                Continue with Google
              </button>
            </div>
          </div>
        </div>
      )}

      {stage[1] == "verification" && (
        <div className={`verification`}>
          <h1 className="verificationHeading">Verify Your Email Address</h1>
          <hr />
          <p className="subheading">
            We sent a verification code to <span className="bold">{email}</span>
          </p>
          <p className="verificationInstructions">
            Please check your inbox and enter the verification code below to
            verify your email address. The code will expire in 15 mins
          </p>

          {tokenError && <p className="tokenError">{tokenError}</p>}

          <div className="verificationForm">
            {token.map((digit, index) => (
              <input
                key={index}
                type="text"
                value={digit}
                maxLength={1}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleBackspace(index, e)}
                ref={(ref) => (verficationcodeRefs.current[index] = ref)}
              />
            ))}
          </div>
          <button
            disabled={!isTokenComplete()}
            className={`${!isTokenComplete() ? "btnDisabled" : ""} btn`}
            onClick={() => handleVerification()}
          >
            Verify
          </button>

          <div className="verificationFooter">
            <p className="resendCode" onClick={() => sendToken(true)}>
              Resend Code
            </p>
            <p
              className="changeEmail"
              onClick={() => setstage(["signup", "signup"])}
            >
              Change email
            </p>
          </div>
        </div>
      )}

      {stage[1] == "personal-information" && (
        <div
          className={`personalInformation ${
            stage[1] == "personal-information" ? "active" : ""
          }`}
        >
          <div className="profileHead">
            {/* <span className='backArrow' onClick={() => setstage(['signup', 'signup'])}><ArrowBackIos className="backArrow" /></span> */}
            <div className="profileheadinfos">
              <h1 className="personalInformationHeading">
                Personal Information
              </h1>
              <p className="personalInformationSubHeading">
                Help Us Customize Your Experience
              </p>
            </div>
          </div>

          <div className="personalInformationForm">
            <label>Select an Avatar</label>
            <div className="avatars">
              <div
                onClick={() =>
                  setavatar(
                    "https://scriblo.s3.us-east-2.amazonaws.com/avatars/avDefault.jpg"
                  )
                }
                className="avatar customAvatar"
                style={{
                  background:
                    "url(https://scriblo.s3.us-east-2.amazonaws.com/avatars/avDefault.jpg)",
                }}
              ></div>
              {avatarList.map((avatarLink, index) => (
                <div
                  onClick={() => setavatar(avatarLink)}
                  className={`avatar ${
                    avatar == avatarLink ? "selectedAvatar" : " "
                  }`}
                  key={index}
                  style={{ background: `url(${avatarLink})` }}
                ></div>
              ))}
            </div>
            <label>Full Name</label>
            <input
              className="personalInformationInput"
              type="text"
              name="firstName"
              placeholder="John Doe"
              onChange={(e) => setfullName(e.target.value)}
            />
            {fullNameError && <p className="fullNameError">{fullNameError}</p>}
            <label>Email</label>
            <input
              className="personalInformationInput"
              type="email"
              name="email"
              readOnly
              value={email}
            />
            <label>Bio</label>
            <textarea
              placeholder="Tell us a bit about yourself..."
              onChange={(e) => setbio(e.target.value)}
            />
            <button
              onClick={() => handlePersonalInfo()}
              className="btn"
              style={{ width: "100%" }}
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {stage[1] == "select-interest" && (
        <div className="selectInterest">
          <div className="profileHead">
            {/* <span className='backArrow' onClick={() => setstage(['signup', 'signup'])}><ArrowBackIos className="backArrow" /></span> */}
            <div className="profileheadinfos">
              <h1>Select Your Interests</h1>
              <p>Discover Personalized Content Tailored to Your Preferences</p>
            </div>
          </div>
            {selectedInterestsError && ( <p className="selectedInterestsError">{selectedInterestsError}</p>) }

          <div className="interests">
            {interests.map((interest, index) => (
              <div
                onClick={() => handleSelectedInterests(interest.name)}
                className={`${
                  selectedInterests.includes(interest.name) ? "selected" : ""
                } interest`}
                key={index}
              >
                {interest.emoji} {interest.name}
              </div>
            ))}
          </div>
          <button disabled={selectedInterests.length < 3} className={`${selectedInterests.length < 3 ? 'btnDisabled' : ''} btn`} onClick={() => handleSignup()}>Continue</button>
        </div>
      )}
    </div>
  );
}

export default Signup;
