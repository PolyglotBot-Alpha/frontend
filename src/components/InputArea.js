import React, { useState } from "react";
import { Button, Input } from "antd";
import { SendOutlined } from "@ant-design/icons";
import axios from "axios";
import "../App.css";
import { useCollapsed, useMessages, useMobile } from "./Contexts.js";
import { useSelector, useDispatch } from 'react-redux'
import { addMsg, delMsg, pendMsg, removePendMsg, clearPendMsg } from './messageSlice.js'

import { useTranslation } from "react-i18next";
const { TextArea } = Input;
const InputArea = () => {
  const { t, i18n } = useTranslation();
  const [input, setInput] = useState("");
  const { collapsed, setCollapsed } = useCollapsed();
  const { isMobile, setIsMobile } = useMobile();
  // const { messages, setMessages } = useMessages();
  // const message = useSelector((state) => state.msgs.msgs)
  const dispatch = useDispatch();
  const currChat = useSelector((state) => state.msgs.selectedChat);

  // user input handler
  const handleInputChange = (event) => {
    setInput(event.target.value);
  };

  // user click send button
  const handleSend = async () => {
    // store user message to local database
    const pendId = Date.now();
    const userMessage = { 
      text: input, 
      id: pendId, 
      sender: "user", 
      synced: false 
    };
    dispatch(clearPendMsg());
    dispatch(pendMsg(userMessage));

    try {
      // communicate with essay generation api for result
      const response = await axios.post(process.env.REACT_APP_API_URL, {
        user_input: input,
      });
      const { essay, audio_url } = response.data;
      const botMessage = {
        text: essay,
        audioUrl: audio_url,
        id: pendId + 1,
        sender: "bot",
        synced: false,
      };
      // pass result to context for display and save to local
      // setMessages((messages) => [...messages, botMessage]);
      dispatch(removePendMsg(pendId));
      dispatch(addMsg(userMessage));
      dispatch(addMsg(botMessage));
    } catch (error) {
      console.error("Error fetching response:", error);
      const errorMessage = {
        text: "Failed to fetch response from the server.",
        id: pendId + 1,
        sender: "bot",
        synced: false,
      };
      // pass error result for display
      // setMessages((messages) => [...messages, errorMessage]);
      dispatch(pendMsg(errorMessage));
    }

    setInput("");  // clear user input, ready for next message from user
  };

  // initialize ui value
  let InputLeftValue;
  if (isMobile) {
    InputLeftValue = 90;
  } else {
    InputLeftValue = collapsed ? 90 : 280;
  }
  return (
    <div
      className={"inputBox"}
      style={{
        left: InputLeftValue,
        margin: "auto",
      }}
    >
      <TextArea
        placeholder={t("input_holder")}
        autoSize={{ minRows: 1, maxRows: 4 }}
        value={input}
        onChange={handleInputChange}
        style={{
          backgroundColor: "#f8f7f7",
          //color: "white",
        }}
      />
      <Button
        ghost
        onClick={handleSend}
        className={"buttonStyle"}
        style={{
          marginLeft: 10,
        }}
        disabled={currChat==null}
      >
        <SendOutlined />
      </Button>
    </div>
  );
};

export default InputArea;
