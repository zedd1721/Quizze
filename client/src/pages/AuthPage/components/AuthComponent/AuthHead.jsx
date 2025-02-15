import React, { useState } from "react";
import styled from "./AuthHead.module.css";
function AuthHead({selected, setSelected}) {
  return (
    <div className={styled.headWrapper}>
      <div className={styled.headTop}>
        <h1>QUIZZE</h1>
      </div>
      <div className={styled.headBottom}>
        <div
          className={`${styled.headBottomLeft} ${
            selected === "signup" ? styled.active : ""
          }`}
          onClick={() => setSelected("signup")}
        >
          <h3>Sign Up</h3>
        </div>
        <div
          className={`${styled.headBottomRight} ${
            selected === "login" ? styled.active : ""
          }`}
          onClick={() => setSelected("login")}
        >
          <h3>Log In</h3>
        </div>
      </div>
    </div>
  );
}

export default AuthHead;
