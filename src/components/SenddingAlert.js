import React, { useState } from "react";
import "./SenddingAlert.css";
import { useNavigate } from "react-router-dom";
const SenddingAlert = ({ setAlertVisible }) => {
  const navigate = useNavigate();
  const handleClose = () => {
    setAlertVisible(false);
  };
  return (
    <div className={"sendAlert"}>
      <p style={{ textAlign: "center" }}>Current account has expired.</p>
      <div className={"alertButton"}>
        <button
          className={"hover:bg-blue-800 hover:text-white"}
          onClick={handleClose}
        >
          Close
        </button>
        <button
          className={"hover:bg-blue-800 hover:text-white"}
          onClick={() => navigate("/payment")}
        >
          Subscribe!
        </button>
      </div>
    </div>
  );
};

export default SenddingAlert;
