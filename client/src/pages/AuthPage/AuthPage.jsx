import React from 'react'
import { useState } from 'react'
import styled from './AuthPage.module.css'
import AuthHead from './components/AuthComponent/AuthHead'
import Register from './components/Register/Register'
import Login from './components/Login/Login'

function AuthPage({URL}) {
  const [selected, setSelected] = useState("signup");
  return (
    <div className={styled.main}>
        <div className={styled.container}>
            <div className={styled.wrapper}>
                <AuthHead selected={selected} setSelected={setSelected}/>
               <div className={styled.bodyWrapper}>
                    {selected === "signup" ? <Register URL={URL}/> : <Login URL={URL}/>}
                </div>
            </div>
        </div>
    </div>
  )
}

export default AuthPage