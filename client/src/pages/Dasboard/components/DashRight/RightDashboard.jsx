import React from 'react'
import styled from './RightDashboard.module.css'
import MainDashboard from './components/MainDashboard/MainDashboard'
import Analytics from './components/Analytics/Analytics'
import CreateQuiz from './components/CreateQuiz/CreateQuiz'

function RightDashboard({select}) {
  return (
    <div className={styled.main}>
      {select === "mainDashboard" && <MainDashboard />}
      {select === "analytics" && <Analytics />}
      {select ==="createQuiz" && <CreateQuiz />}
    </div>
  )
}

export default RightDashboard