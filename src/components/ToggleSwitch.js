import React from "react";

const ToggleSwitch = ({ isSignUp, handleToggle }) => {
  return (
    <div className="flex flex-col items-center justify-center mb-2 border-2 rounded-xl w-2/3 bg-blue-300">
      <div
        className="relative inline-block w-32 h-8 select-none cursor-pointer"
        onClick={handleToggle}
      >
        <div className="flex items-center justify-between w-full h-full absolute top-0 left-0 ">
          <span
            className={`text-sm z-10 w-1/2 text-center ${!isSignUp ? "text-white" : "text-blue-800"}`}
          >
            Sign In
          </span>
          <span
            className={`text-sm z-10 w-1/2 text-center ${isSignUp ? "text-white" : "text-blue-800"}`}
          >
            Sign Up
          </span>
        </div>
        <div
          className={`absolute top-0 bottom-0 w-1/2 bg-blue-800 rounded-xl shadow-md transform transition-transform duration-300 ease-in-out ${
            isSignUp ? "translate-x-full" : ""
          }`}
        ></div>
      </div>
    </div>
  );
};

export default ToggleSwitch;
