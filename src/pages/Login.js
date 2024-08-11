import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Tooltip } from "antd";
import ToggleSwitch from "../components/ToggleSwitch.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  getAdditionalUserInfo,
} from "firebase/auth";
import { auth, provider, signInWithPopup } from "../firebase-config.js";
import { GoogleOutlined } from "@ant-design/icons";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [confirmFocused, setConfirmFocused] = useState(false);
  const [error, setError] = useState("");
  const [isConfirm, setIsConfirm] = useState(false);
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();
  const auth = getAuth();
  const currentDate = new Date();
  const subscriptionExpiryDate = new Date(
    currentDate.setDate(currentDate.getDate() + 1),
  ).toISOString();
  auth.languageCode = "it";

  useEffect(() => {}, []);

  const handleToggle = () => {
    setIsSignUp(!isSignUp);
    setError("");
  };

  const checkPasswordRequirements = (password) => {
    const length = password.length >= 8;
    const upper = /[A-Z]/.test(password);
    const lower = /[a-z]/.test(password);
    const number = /\d/.test(password);
    const special = /[@$!%*?&]/.test(password);
    return { length, upper, lower, number, special };
  };

  const passwordRequirements = checkPasswordRequirements(password);
  const confirmMatched = confirmPassword === password;

  const passwordTooltip = (
    <div>
      <p
        className={
          passwordRequirements.length ? "text-green-500" : "text-red-500"
        }
      >
        at least 8 characters
      </p>
      <p
        className={
          passwordRequirements.upper ? "text-green-500" : "text-red-500"
        }
      >
        Uppercase letter
      </p>
      <p
        className={
          passwordRequirements.lower ? "text-green-500" : "text-red-500"
        }
      >
        Lowercase letter
      </p>
      <p
        className={
          passwordRequirements.number ? "text-green-500" : "text-red-500"
        }
      >
        Number
      </p>
      <p
        className={
          passwordRequirements.special ? "text-green-500" : "text-red-500"
        }
      >
        Special character
      </p>
    </div>
  );

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );
      // Signed in
      const user = userCredential.user;
      console.log("User signed in:", user);
      navigate("/");
    } catch (error) {
      console.error("Error signing in:", error);
      setError(error.message);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const user = userCredential.user;
      console.log("User registered:", user);

      await axios.post(`${process.env.REACT_APP_API_BASE_URL}/user/users`, {
        id: user.uid,
        username: userName,
        email: user.email,
        createdAt: new Date().toISOString(),
        updateAt: new Date().toISOString(),
        subscriptionExpiryDate: subscriptionExpiryDate,
      });

      navigate("/");
    } catch (error) {
      console.error("Error signing up:", error);
      setError(error.message);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log("Google user:", user);
      const { isNewUser } = getAdditionalUserInfo(result);
      if (isNewUser) {
        await axios.post(`${process.env.REACT_APP_API_BASE_URL}/user/users`, {
          id: user.uid,
          username: user.displayName,
          email: user.email,
          createdAt: new Date().toISOString(),
          updateAt: new Date().toISOString(),
          subscriptionExpiryDate: subscriptionExpiryDate,
        });
      }
      navigate("/");
    } catch (error) {
      console.error("Google loginError:", error.message);
    }
  };

  return (
    <div
      className="flex items-center justify-center h-screen bg-fixed flex-col"
      style={{
        backgroundImage: `url(${process.env.PUBLIC_URL}/Login.jpg)`,
        backgroundRepeat: "no-repeat",
      }}
    >
      <div
        className={`p-8 w-2/6 bg-white border-2 border-black rounded-2xl flex flex-col items-center shadow-lg transition-all duration-500 ${isSignUp ? "h-auto" : "h-auto"}`}
      >
        <div>
          <img
            src={`${process.env.PUBLIC_URL}/wolfLogo2.gif`}
            alt={"sef"}
            className={"h-20"}
          />
        </div>
        <form
          onSubmit={isSignUp ? handleSignUp : handleSignIn}
          className="w-full"
        >
          <div className="flex items-center justify-center mb-4">
            <ToggleSwitch isSignUp={isSignUp} handleToggle={handleToggle} />
          </div>
          <div
            className={`mb-4 transition-all duration-500 ${isSignUp ? "max-h-14 opacity-100" : "max-h-0 opacity-0"}`}
          >
            {isSignUp && (
              <input
                className="w-full p-3 placeholder-gray-500 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-800 transition-all duration-500"
                // type="password"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="User Name"
                required
              />
            )}
          </div>
          <div className="mb-4">
            <input
              className="w-full p-3 border placeholder-gray-500 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-800 transition-all duration-500"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
            />
          </div>
          <Tooltip
            title={passwordTooltip}
            open={isFocused && isSignUp}
            color={"#112A46"}
            placement={"bottom"}
          >
            <div className="mb-4">
              <input
                className="w-full p-3 placeholder-gray-500 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-800 transition-all duration-500"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder="Password"
                required
              />
            </div>
          </Tooltip>
          <div
            className={`mb-4 transition-all duration-500 ${isSignUp ? "max-h-14 opacity-100" : "max-h-0 opacity-0"}`}
          >
            {isSignUp && (
              <Tooltip
                title={
                  <p
                    className={
                      confirmMatched ? "text-green-500" : "text-red-500"
                    }
                  >
                    {confirmMatched
                      ? "Password matched"
                      : "Password did not match"}
                  </p>
                }
                open={confirmFocused}
                color={"#112A46"}
                placement={"bottom"}
              >
                <input
                  className="w-full p-3 placeholder-gray-500 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-800 transition-all duration-500"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onFocus={() => setConfirmFocused(true)}
                  onBlur={() => setConfirmFocused(false)}
                  placeholder="Confirm Password"
                  required
                />
              </Tooltip>
            )}
          </div>
          {error && <div className="text-red-500 mb-4">{error}</div>}
          <div className="flex justify-center">
            <button
              className={`bg-blue-300 text-blue-800 p-2 rounded-lg hover:bg-blue-800 hover:text-white transition-all duration-500 ${isSignUp ? "w-36" : "w-32"}`}
              type="submit"
            >
              <div className="flex justify-center items-center">
                <span
                  className={`transition-transform duration-500 ${isSignUp ? "w-16" : "w-14"}`}
                >
                  {isSignUp ? "Sign Up" : "Sign In"}
                </span>
              </div>
            </button>
          </div>
        </form>
        <Tooltip title="Sign in with Google" placement="bottom" color={"blue"}>
          <GoogleOutlined
            style={{ color: "#000000" }}
            className={"pt-4"}
            onClick={handleGoogleSignIn}
          />
        </Tooltip>
      </div>
    </div>
  );
};

export default Login;
