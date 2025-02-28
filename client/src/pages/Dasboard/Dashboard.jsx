import React, {useState} from 'react'
import LeftDashboard from './components/DashLeft/LeftDashboard'
import RightDashboard from './components/DashRight/RightDashboard'  
import styled from './Dashboard.module.css'

function Dashboard() {
  const [select, setSelect] = useState("mainDashboard")
  return (
    <div className={styled.main}>
      <LeftDashboard select={select} setSelect={setSelect}/>
      <RightDashboard select={select} />
    </div>
  )
}

export default Dashboard