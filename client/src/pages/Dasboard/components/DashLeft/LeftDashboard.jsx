import React, { useState } from "react";
import styled from "./LeftDashboard.module.css";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoMdClose } from "react-icons/io";

function LeftDashboard({ select, setSelect }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      {/* ✅ Hide Hamburger When Sidebar is Open */}
      {!isOpen && (
        <div className={styled.hamburger} onClick={() => setIsOpen(true)}>
          <GiHamburgerMenu />
        </div>
      )}
      <div className={`${styled.wrapper} ${isOpen && styled.open}`}>
        <div className={styled.closeBotton} onClick={() => setIsOpen(false)}>
          <IoMdClose />
        </div>
        <div className={styled.head}>
          <h1>QUIZZIE</h1>
        </div>
        <div className={styled.body}>
          <div
            className={`${styled.dashboard} ${
              select === "mainDashboard" ? styled.active : ""
            }`}
            onClick={() => {
              setSelect("mainDashboard");
              setIsOpen(false);
            }}
          >
            <h3>Dashboard</h3>
          </div>
          <div
            className={`${styled.analytics} ${
              select === "analytics" ? styled.active : ""
            }`}
            onClick={() => {
              setSelect("analytics");
              setIsOpen(false);
            }}
          >
            <h3>Analytics</h3>
          </div>
          <div
            className={`${styled.createQuiz} ${
              select === "createQuiz" ? styled.active : ""
            }`}
            onClick={() => {
              setSelect("createQuiz");
              setIsOpen(false);
            }}
          >
            <h3>Create Quiz</h3>
          </div>
        </div>
        <div className={styled.bottom}>
          <h2>LOGOUT</h2>
        </div>
      </div>
    </>
  );
}

export default LeftDashboard;
