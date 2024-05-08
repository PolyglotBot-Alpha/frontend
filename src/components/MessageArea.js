import React, { useEffect, useState } from "react";
import InputArea from "./InputArea.js";
import "../App.css";
import { Button, Layout, Spin } from "antd";
import { SoundOutlined, LoadingOutlined } from "@ant-design/icons";
import { useCollapsed, useMessages, useMobile } from "./Contexts.js";
import { useSelector, useDispatch } from 'react-redux'
import { populateMsg } from './messageSlice.js'
import axios from "axios";

const { Content } = Layout;
const MessageArea = () => {
  const { collapsed, setCollapsed } = useCollapsed();
  const { isMobile, setIsMobile } = useMobile();
  // const { messages, setMessages } = useMessages();
  const messages = useSelector((state) => state.msgs.msgs)
  const currChat = useSelector((state) => state.msgs.selectedChat)
  const pendingMsgs = useSelector((state) => state.msgs.pendingMsg)
  const dispatch = useDispatch();

  useEffect(() => {
    // load messages from DB when switch chat
    if (currChat){
      if (messages[currChat]) {return}

      axios.get(
        process.env.REACT_APP_DB_URL + "/messages/" + currChat
      ).then((resp) => {
        dispatch(populateMsg({chatId: currChat, msgs: resp.data.data}))
        console.log(resp.data.data)
      }).catch((e) => {
        console.log("Load message from DB failed")
        console.log(e)
      })
    }
  }, [currChat])

  // useEffect(() => {
  //   // Listen for changes in messages and update localStorage
  //   // localStorage.setItem("chatMessages", JSON.stringify(messages));
  //   localStorage.setItem("msgs", JSON.stringify(messages));

  //   // check for login status
  //   // if (!login) return;

  //   // find which data need to be synced
    
  //   // const delayHandle = setTimeout(()=>{
  //   //   // sync local data with remote database

  //   //   axios.post(process.env.REACT_APP_DB_URL, {
  //   //     user_input: input,
  //   //   }).then((response => {
  //   //     
  //   //   })).catch(error => {
  //   //     console.error("Error fetching response:", error);
  //   //   
  //   //   });
      
  //   // }, 1500);

  //   // return ()=>{
  //   //   clearTimeout(delayHandle);
  //   // }
  // }, [messages,currChat]);

  const playText = (text) => {
    const speech = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(speech);
  };

  let MessageLeftValue;
  if (isMobile) {
    MessageLeftValue = 40;
  } else {
    MessageLeftValue = collapsed ? 50 : 100;
  }
  return (
    <Content className={"content"}>
      {/*main contents*/}
      <div
        className={"messageArea"}
        style={{
          marginLeft: MessageLeftValue,
          paddingBottom: 900,
        }}
      >
        {/*<div>*/}
        {currChat && messages[currChat] && messages[currChat].map((message) => (
          // set one Q&A as a group
          <div key={message.id}>
            <div
              className={"messageBox"}
              key={message.id}
              style={{
                float: message.sender === "bot" ? "left" : "right",
                textAlign: message.sender === "bot" ? "left" : "right",
                backgroundColor:
                  message.sender === "bot"
                    ? "rgba(134,193,102,0.61)"
                    : "rgba(51,166,184,0.53)",
              }}
            >
              {message.text}
              {message.sender === "bot" && (
                <Button
                  ghost
                  onClick={() => playText(message.text)}
                  className={"buttonStyle"}
                >
                  <SoundOutlined />
                </Button>
              )}
            </div>
            {/*  clear the float attribute ensures that new message groups are displayed on newlines*/}
            <div style={{ clear: "both" }}></div>
          </div>
        ))}

        {/* show generating message */}
        {Object.keys(pendingMsgs).map((msgId, idx) => (
          <div key={pendingMsgs[msgId].id}>
          <div
            className={"messageBox"}
            key={pendingMsgs[msgId].id}
            style={{
              float: "right",
              textAlign: "right",
              backgroundColor: "rgba(51,166,184,0.53)",
            }}
          >
            {pendingMsgs[msgId].text}
          </div>
          {/*  clear the float attribute ensures that new message groups are displayed on newlines*/}
          <div style={{ clear: "both" }}></div>
        </div>
        ))}
      </div>
      <InputArea />
    </Content>
  );
};

export default MessageArea;
