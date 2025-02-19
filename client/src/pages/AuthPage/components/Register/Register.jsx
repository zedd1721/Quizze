import React, { useState } from "react";
import styled from "./Register.module.css";
import {  toast } from 'react-toastify';
import axios from 'axios';

function Register({URL}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, seterror] = useState({});


  const validateForm = () => {
    const newError = {};
    if (!name.trim()) {
      newError.name = "Name is required";
      toast.error('Name is required');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      newError.email = "Email is required";
    } else if (!emailRegex.test(email)) {
      newError.email = "Email is not valid";
      toast.error('Email is not valid');
    }

    if (!password.trim()) {
      newError.password = "Password is required";
    } else if (password.length < 6) {
      newError.password = "Password must be at least 6 characters";
      toast.error('Password must be at least 6 characters');
    }

    if (!confirmPassword.trim()) {
      newError.confirmPassword = "Confirm Password is required";
    } else if (password !== confirmPassword) {
      newError.confirmPassword = "Password do not match";
      toast.error('Password do not match');
    }

    seterror(newError);
    return Object.keys(newError).length === 0; //Returns an array of all property names (keys) inside newErrors
    //Returns True | False
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    if(!validateForm()) return;

    try{
      const response = await axios.post(`${URL}/api/users/register`, {name, email, password});
      if(response.status === 201){
        toast.success(response.data.msg);
        setName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
      }
    }catch(error){
      console.error("Error:", error);
      if (error.response) {
          // Server responded with an error
          toast.error(error.response.data.msg || "Registration failed");
      } 
    }
  };
  return (
    <>
      <div className={styled.bodyTop}>
        <div className={styled.input1}>
          <div className={styled.input1Left}>
            <h3>Name</h3>
          </div>
          <div className={styled.input1Right}>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error.name) {
                  seterror({ ...error, name: "" });
                }
              }}
              placeholder={error.name ? error.name : ""}
              className={error.name && styled.errorInput}
            />
          </div>
        </div>
        <div className={styled.input2}>
          <div className={styled.input2Left}>
            <h3>Email</h3>
          </div>
          <div className={styled.input2Right}>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error.email) {
                  seterror({ ...error, email: "" });
                }
              }} //If error.email is true then set error.email to empty string
              placeholder={error.email ? error.email : ""}
              className={error.email && styled.errorInput}
            />
          </div>
        </div>
        <div className={styled.input3}>
          <div className={styled.input3Left}>
            <h3>Password</h3>
          </div>
          <div className={styled.input3Right}>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error.password) {
                  seterror({ ...error, password: "" });
                }
              }}
              placeholder={error.password ? error.password : ""}
              className={error.password && styled.errorInput}
            />
          </div>
        </div>
        <div className={styled.input4}>
          <div className={styled.input4Left}>
            <h3>Confirm Password</h3>
          </div>
          <div className={styled.input4Right}>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (error.confirmPassword) {
                  seterror({ ...error, confirmPassword: "" });
                }
              }}
              placeholder={error.confirmPassword ? error.confirmPassword : ""}
              className={error.confirmPassword && styled.errorInput}
            />
          </div>
        </div>
      </div>
      <div className={styled.bodyBottom}>
        <button onClick={handleSubmit}>Sign-Up</button>
      </div>
    </>
  );
}

export default Register;
