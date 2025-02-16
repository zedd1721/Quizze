import React, { useState } from "react";
import styled from "./Login.module.css";
import { FaCopy } from "react-icons/fa";
import { toast } from "react-toastify";

function Login() {
  const sampleEmail = "john.doe@example.com";
  const samplePassword = "password123";
  const [isEmailCopied, setIsEmailCopied] = useState(false);
  const [isPasswordCopied, setIsPasswordCopied] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, seterror] = useState({});

  const handleCopyEmail = () => {
    navigator.clipboard
      .writeText(sampleEmail)
      .then(() => {
        setIsEmailCopied(true);
        setTimeout(() => {
          setIsEmailCopied(false);
        }, 1500);
      })
      .catch((err) => console.log(err));
  };

  const handleCopyPassword = () => {
    navigator.clipboard
      .writeText(samplePassword)
      .then(() => {
        setIsPasswordCopied(true);
        setTimeout(() => {
          setIsPasswordCopied(false);
        }, 1500);
      })
      .catch((err) => console.log(err));
  };

  const validateForm = () => {
    const newError = {};

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      newError.email = "Email is required";
    } else if (!emailRegex.test(email)) {
      newError.email = "Email is not valid";
      toast.error("Email is not valid");
    }

    if (!password.trim()) {
      newError.password = "Password is required";
    }

    seterror(newError);
    return Object.keys(newError).length === 0; //Returns an array of all property names (keys) inside newErrors
    //Returns True | False
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log({ email, password });
      console.log("Submitted");

      //******************* */
      //API CAllssssssssssss
      //******************** */

      setEmail("");
      setPassword("");
    } else {
      console.log("Form has errors");
    }
  };
  return (
    <>
      <div className={styled.bodyTop}>
        <div className={styled.input1}>
          <div className={styled.input1Left}>
            <h3>Email</h3>
          </div>
          <div className={styled.input1Right}>
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
        <div className={styled.input2}>
          <div className={styled.input2Left}>
            <h3>Password</h3>
          </div>
          <div className={styled.input2Right}>
            <input type="password" 
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
      </div>
      <div className={styled.bodyBottom}>
        <button onClick={handleSubmit}>Log In</button>
      </div>
      <div className={styled.bodyFooter}>
        <div className={styled.sampleHead}>
          <p>Sample Login Details</p>
        </div>
        <div className={styled.sampleEmail}>
          <p>Email: {sampleEmail}</p>
          <FaCopy className={styled.copyIcon} onClick={handleCopyEmail} />
          {isEmailCopied && <span className={styled.copyMessage}>Copied!</span>}
        </div>
        <div className={styled.samplePassword}>
          <p>Password: {samplePassword}</p>
          <FaCopy className={styled.copyIcon} onClick={handleCopyPassword} />
          {isPasswordCopied && (
            <span className={styled.copyMessage}>Copied!</span>
          )}
        </div>
      </div>
    </>
  );
}

export default Login;
