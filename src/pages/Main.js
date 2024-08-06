import React, { useState, useEffect } from "react";
import axios from "axios";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { Spin, FloatButton, Avatar, Input, Dropdown, Menu } from "antd";
import {
  CustomerServiceOutlined,
  SoundOutlined,
  AudioOutlined,
  GlobalOutlined,
} from "@ant-design/icons";

const Main = () => {
  const [userId, setUserId] = useState("");
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState([]);
  const [chatHistory, setChatHistory] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [userPhotoURL, setUserPhotoURL] = useState("");
  const [language, setLanguage] = useState("en-US");
  const auth = getAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate("/login");
      } else {
        setUserId(user.uid);
        console.log(userId);
      }
    });

    return () => unsubscribe();
  }, [auth, navigate]);

  useEffect(() => {
    if (userId) {
      fetchChatHistory();
    }
  }, [userId]);

  const fetchChatHistory = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/history/${userId}`,
      );
      setChatHistory(response.data);
    } catch (error) {
      console.error("Error fetching chat history", error);
    }
  };

  const handleSendMessage = async () => {
    if (!prompt.trim()) return;

    const userInput = { userId, prompt };
    const newMessage = {
      userMessage: prompt,
      botResponse: "",
      isGenerating: true,
    };
    setMessages([...messages, newMessage]);
    setPrompt("");
    setIsGenerating(true);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/chat/chat`,
        userInput,
      );
      const updatedMessages = [
        ...messages,
        { ...newMessage, botResponse: response.data, isGenerating: false },
      ];
      setMessages(updatedMessages);
      setIsGenerating(false);
      fetchChatHistory(); // Update chat history after sending message
    } catch (error) {
      console.error("Error sending message", error);
      setIsGenerating(false);
    }
  };

  const handleSpeak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  };

  const startVoiceRecognition = (lang) => {
    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = lang;
    recognition.onresult = (event) => {
      setPrompt(event.results[0][0].transcript);
    };
    recognition.start();
  };

  const languageMenu = (
    <Menu onClick={({ key }) => setLanguage(key)}>
      <Menu.Item key="en-US">English (US)</Menu.Item>
      <Menu.Item key="zh-CN">Chinese (Simplified)</Menu.Item>
      <Menu.Item key="es-ES">Spanish (Spain)</Menu.Item>
      <Menu.Item key="ja-JP">Japanese</Menu.Item>
      <Menu.Item key="de-DE">German</Menu.Item>
      {/* Add more languages as needed */}
    </Menu>
  );

  const inputSuffix = (
    <div style={{ display: "flex", alignItems: "center" }}>
      <AudioOutlined
        onClick={() => startVoiceRecognition(language)}
        style={{ marginRight: 8 }}
      />
      <Dropdown overlay={languageMenu} trigger={["click"]}>
        <GlobalOutlined className="cursor-pointer" />
      </Dropdown>
    </div>
  );

  return (
    <div
      className={"rounded-xl mt-4 mx-auto w-10/12"}
      style={{
        backgroundImage: `url(${process.env.PUBLIC_URL}/Login.jpg)`,
      }}
    >
      <div className="container bg-black border-4 border-black bg-opacity-60 rounded-xl">
        <div className="chat-history mb-4">
          <FloatButton.Group
            trigger="hover"
            type="primary"
            style={{ insetInlineEnd: 94 }}
            icon={<CustomerServiceOutlined />}
            tooltip={<div>Theme</div>}
          >
            <FloatButton />
            <FloatButton className={"bg-black"} />
          </FloatButton.Group>
          <h2 className="text-2xl text-white font-bold mb-2">Chat History</h2>
          {chatHistory.map((message, index) => (
            <div key={index} className="mb-2">
              <div className="flex justify-end mr-4">
                <div className="bg-blue-200 p-2 rounded-lg max-w-md">
                  <p className={"text-justify"}>
                    {message.userMessage}{" "}
                    {userPhotoURL == "" ? (
                      <Avatar size={40}>USER</Avatar>
                    ) : (
                      <Avatar size={40} src={userPhotoURL}>
                        USER
                      </Avatar>
                    )}
                  </p>
                </div>
              </div>
              <div className="flex justify-start ml-4 mt-1">
                <div className="bg-gray-200 p-2 rounded-lg max-w-md">
                  <p className={"text-justify"}>
                    <Avatar size={40}>BOT</Avatar> {message.botResponse}
                    <SoundOutlined
                      className="ml-2 cursor-pointer"
                      onClick={() => handleSpeak(message.botResponse)}
                    />
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Chat with Bot</h2>
          <div className="messages mb-4">
            {messages.map((message, index) => (
              <div key={index} className="mb-2">
                <div className="flex justify-end mr-4">
                  <div className="bg-blue-200 p-2 rounded-lg max-w-md">
                    {userPhotoURL == "" ? (
                      <Avatar size={40}>USER</Avatar>
                    ) : (
                      <Avatar size={40} src={userPhotoURL}>
                        USER
                      </Avatar>
                    )}
                  </div>
                </div>
                {message.isGenerating ? (
                  <div className="flex justify-start ml-4 mt-1">
                    <div className="bg-gray-200 p-2 rounded-lg max-w-md">
                      <Spin size="small" />
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-start ml-4 mt-1">
                    <div className="bg-gray-200 p-2 rounded-lg max-w-md">
                      <p className={"text-justify"}>
                        <Avatar size={40}>BOT</Avatar> {message.botResponse}
                      </p>
                      <SoundOutlined
                        className="ml-2 cursor-pointer"
                        onClick={() => handleSpeak(message.botResponse)}
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="flex items-center mb-2">
            <Input
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Type your message..."
              className="flex-grow p-2 border border-gray-300 rounded-l-lg"
              suffix={inputSuffix}
            />
            <button
              onClick={handleSendMessage}
              disabled={isGenerating}
              className="bg-blue-500 text-white p-2 rounded-r-lg"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Main;
