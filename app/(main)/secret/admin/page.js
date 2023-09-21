"use client";
import "@/Styles/Admin.css";
import { source_Sans_Pro } from "@/public/util/fonts";
import moment from "moment";
import React, { useEffect, useState } from "react";

const Admin = () => {
  const [auth, setauth] = useState(false)
  const [feedbacks, setfeedbacks] = useState([]);
  const [renderFeddbacks, setrenderFeddbacks] = useState([]);
  const [userCount, setuserCount] = useState(0);
  const [articleCount, setarticleCount] = useState(0);

  const [tab, settab] = useState(1);

  useEffect(() => {
    if (authAdmin()) {
      getUserCount();
      getFeedbacks();
      getArticleCount();
    }
  }, []);

  function authAdmin() {
    // check if localstorage variable is set to true
    // if true, redirect to admin page
    // else, show password input promt
    // create an input promt with message "enter admin password"
    // check if password is correct
    // set a localstorage variable to true that expires in 1 day
    // redirect to admin page

    const item = JSON.parse(localStorage.getItem("admin"));
    if (!item || new Date().getTime() > item.expiration) {
      let password = prompt("Enter admin password");

      while (password !== process.env.NEXT_PUBLIC_ADMIN_PASS) {
        password = prompt("Enter admin password");
      }

      const authData = {
        auth: true,
        expire: new Date().getTime() + 24 * 60 * 60 * 1000,
      };
      localStorage.setItem("admin", JSON.stringify(authData));
      setauth(true)
      return true;
    }
    setauth(true)
    return true
  }

  async function getUserCount() {
    const response = await fetch("/api/admin/index.php?action=getUsersCount");
    const responseJson = await response.json();
    // console.log(responseJson.data[0].total_records)
    setuserCount(responseJson.data[0].total_records);
  }

  async function getArticleCount() {
    const response = await fetch(
      "/api/admin/index.php?action=getArticlesCount"
    );
    const responseJson = await response.json();
    // console.log(responseJson.data[0].total_records)
    setarticleCount(responseJson.data[0].total_records);
  }

  async function getFeedbacks() {
    const response = await fetch("/api/admin/index.php?action=getFeedbacks");
    const responseJson = await response.json();
    // console.log(responseJson)
    setfeedbacks(responseJson.data);
    setrenderFeddbacks(
      responseJson.data.filter((filt) => filt.solved == "false")
    );
  }

  const handleFilter = (filter) => {
    setrenderFeddbacks(feedbacks.filter((filt) => filt.type == filter));
  };

  const solveFeedback = async (feedbackID) => {
    await fetch(`/api/admin/index.php?action=solve&feedbackID=${feedbackID}`);
    getFeedbacks();
  };

  const unsolveFeedback = async (feedbackID) => {
    await fetch(`/api/admin/index.php?action=unsolve&feedbackID=${feedbackID}`);
    getFeedbacks();
  };

  return (
    <>
    {auth && (<div className={`adminContainer ${source_Sans_Pro.className}`}>
      <div className={`adminHeader`}>
        <span onClick={() => settab(1)}>Dashboard</span>
        <span onClick={() => settab(2)}>Feedback</span>
        <span onClick={() => settab(2)}>Verification Request</span>
      </div>
      {tab == 1 && (
        <div className="tab">
          <br />
          <h1>Metrics</h1>
          <br />

          <div className="metric">
            <h3>Total Number Of Users</h3>
            <span>{userCount}</span>
          </div>

          <div className="metric">
            <h3>Total Number Of Articles Published</h3>
            <span>{articleCount}</span>
          </div>

          <div onClick={() => settab(2)} className="metric">
            <h3>Total Number Of Feedbacks Recived</h3>
            <div className="subMetric">
              <span>
                Bug: {feedbacks.filter((filt) => filt.type == "bug").length}
              </span>
              <span>
                Technical:{" "}
                {feedbacks.filter((filt) => filt.type == "technical").length}
              </span>
              <span>
                Suggestion:{" "}
                {feedbacks.filter((filt) => filt.type == "suggestion").length}
              </span>
              <span>
                SNW:{" "}
                {feedbacks.filter((filt) => filt.type == "not working").length}
              </span>
              <span>
                SE:{" "}
                {
                  feedbacks.filter((filt) => filt.type == "something else")
                    .length
                }
              </span>
            </div>
            <span>{feedbacks.length}</span>

            <div className="subMetric">
              <span style={{ background: "red" }}>
                Unsolved:{" "}
                {feedbacks.filter((filt) => filt.solved == "false").length}{" "}
              </span>
              <span style={{ background: "green" }}>
                Solved:{" "}
                {feedbacks.filter((filt) => filt.solved == "true").length}
              </span>
            </div>
          </div>
        </div>
      )}

      {tab == 2 && (
        <div className="tab">
          <h1>Feedbacks</h1>
          <br />
          <small>filters</small>
          <div className="feedbackType">
            <span onClick={() => setrenderFeddbacks(feedbacks)}>All</span>
            <span onClick={() => handleFilter("technical")}>Technical</span>
            <span onClick={() => handleFilter("suggestion")}>Suggestion</span>
            <span onClick={() => handleFilter("bug")}>Bug</span>
            <span onClick={() => handleFilter("not working")}>SNW</span>
            <span onClick={() => handleFilter("something else")}>SE</span>
          </div>
          <br />
          <br />
          {renderFeddbacks.length > 0 ? (
            renderFeddbacks.map((feed) => (
              <div className="feedback" key={feed.id}>
                <h4>Problem</h4>
                <p>{feed.problem}</p>
                <br />
                <h4>Reproduction</h4>
                <p>{feed.reproduction}</p>
                <br />
                <span>Type: {feed.type} </span>
                <span>Sender: {feed.email} </span>
                <span>Page: {feed.page} </span>
                <span>Date: {moment(feed.created_at).format("MM/DD/YY")}</span>
                <span>
                  Solved: &nbsp;
                  <span
                    style={{
                      background: feed.solved == "false" ? "red" : "green",
                    }}
                    className="circle"
                  ></span>
                </span>
                <br />
                <button
                  onClick={() =>
                    feed.solved == "false"
                      ? solveFeedback(feed.id)
                      : unsolveFeedback(feed.id)
                  }
                >
                  {" "}
                  {feed.solved == "false" ? "Mark Solved" : "Unsolve"}
                </button>
              </div>
            ))
          ) : (
            <h3>No Feedback at this time</h3>
          )}
        </div>
      )}
    </div>)}
    </>
  );
};

export default Admin;
