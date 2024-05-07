import React, { useEffect, useState } from "react";
import InputArea from "./InputArea.js";
import "../App.css";
import { Button, Layout, Spin } from "antd";
import { SoundOutlined, LoadingOutlined } from "@ant-design/icons";
import { useCollapsed, useMessages, useMobile } from "./Contexts.js";
const { Content } = Layout;
const MessageArea = () => {
  const { collapsed, setCollapsed } = useCollapsed();
  const { isMobile, setIsMobile } = useMobile();
  const { messages, setMessages } = useMessages();

  useEffect(() => {
    // Listen for changes in messages and update localStorage
    localStorage.setItem("chatMessages", JSON.stringify(messages));
  }, [messages]);

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
        {messages.map((message) => (
          // set one Q&A as a group
          <div>
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
      </div>
      <InputArea />
    </Content>
  );
};

export default MessageArea;
