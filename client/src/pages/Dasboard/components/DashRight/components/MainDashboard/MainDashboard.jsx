import React from "react";
import styled from "./MainDashboard.module.css";
import { IoEyeSharp } from "react-icons/io5";
function MainDashboard() {
  return (
    <>
      <div className={styled.mainTop}>
        <div className={styled.quizCreated}>
          <h1>
            12 <span>Quiz</span>
          </h1>
          <h2>Created</h2>
        </div>
        <div className={styled.questionCreated}>
          <h1>
            110 <span>questions</span>
          </h1>
          <h2>Created</h2>
        </div>
        <div className={styled.totalImpression}>
          <h1>
            989 <span>Total</span>
          </h1>
          <h2>Impression</h2>
        </div>
      </div>
      <div className={styled.mainBottom}>
        <div className={styled.bottomHead}>
          <h1>Trending Quiz</h1>
        </div>
        <div className={styled.bottomContent}>
          <div className={styled.quizCard}>
            <div className={styled.quizCardTop}>
              <div className={styled.quizTitle}>Quiz 1</div>
              <div className={styled.quizStats}>
                <span className={styled.views}>
                  667 
                </span>
                <IoEyeSharp className={styled.icon}/>
              </div>
            </div>
            <p className={styled.quizDate}>Created on: 04 Sep, 2023</p>
          </div>
          
        </div>
      </div>
    </>
  );
}

export default MainDashboard;
