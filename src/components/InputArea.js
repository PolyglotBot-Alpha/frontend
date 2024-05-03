import React, { useState } from "react";
import { Button, Input } from "antd";
import { SendOutlined } from "@ant-design/icons";
import axios from "axios";
import "../App.css";
import { useCollapsed, useMessages, useMobile } from "./Contexts.js";
const { TextArea } = Input;
const InputArea = () => {
  const [input, setInput] = useState("");
  const { collapsed, setCollapsed } = useCollapsed();
  const { isMobile, setIsMobile } = useMobile();
  const { messages, setMessages } = useMessages();

  const handleInputChange = (event) => {
    setInput(event.target.value);
  };

  const handleSend = async () => {
    const userMessage = { text: input, id: Date.now(), sender: "user" };
    setMessages((messages) => [...messages, userMessage]);

    try {
      const response = await axios.post(process.env.REACT_APP_API_URL, {
        user_input: input,
      });
      const { essay, audio_url } = response.data;
      const botMessage = {
        text: essay,
        audioUrl: audio_url,
        id: Date.now() + 1,
        sender: "bot",
      };
      setMessages((messages) => [...messages, botMessage]);
    } catch (error) {
      console.error("Error fetching response:", error);
      const errorMessage = {
        text: "Failed to fetch response from the server.",
        id: Date.now() + 1,
        sender: "bot",
      };
      setMessages((messages) => [...messages, errorMessage]);
    }

    setInput("");
  };

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
        placeholder="Something here..."
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
      >
        <SendOutlined />
      </Button>
    </div>
  );
};

export default InputArea;
