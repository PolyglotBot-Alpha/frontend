import React, { useState, useEffect, useRef, useContext } from "react";
import axios from "axios";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { Spin, FloatButton, Avatar, Input, Dropdown, Menu } from "antd";
import {
  CustomerServiceOutlined,
  SoundOutlined,
  AudioOutlined,
  GlobalOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { format } from "date-fns";
import SenddingAlert from "../components/SenddingAlert.js";
import { AuthContext } from "../components/AuthContext.js";
import { signOut } from "firebase/auth";

const Main = () => {
  const { user, Token } = useContext(AuthContext);
  const [userId, setUserId] = useState("");
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [userPhotoURL, setUserPhotoURL] = useState("");
  const [language, setLanguage] = useState("en-US");
  const [expiryDate, setExpiryDate] = useState(null);
  const [formattedDate, setFormattedDate] = useState("");
  const [alertVisible, setAlertVisible] = useState(false);
  const auth = getAuth();
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!user && !Token) {
      navigate("/login");
    } else {
      setUserId(user.uid);
      setUserPhotoURL(user.photoURL);
    }
  }, [user, Token, navigate]);

  useEffect(() => {
    if (userId && Token) {
      getSubscriptionExpiryDate(userId);
      fetchChatHistory();
    }
  }, [userId]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const fetchChatHistory = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/chat/chat/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${Token}`,
          },
        },
      );
      setMessages(response.data);
    } catch (error) {
      console.error("Error fetching chat history", error);
    }
  };

  const handleSendMessage = async () => {
    if (!prompt.trim()) return;
    const currentDate = new Date();

    if (currentDate > expiryDate) {
      setAlertVisible(true);
      return;
    }

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
        `${process.env.REACT_APP_API_BASE_URL}/chat/chat/chat`,
        userInput,
        {
          headers: {
            Authorization: `Bearer ${Token}`,
          },
        },
      );
      const updatedMessages = [
        ...messages,
        { ...newMessage, botResponse: response.data, isGenerating: false },
      ];
      setMessages(updatedMessages);
      setIsGenerating(false);
      await fetchChatHistory(); // Update chat history after sending message
    } catch (error) {
      console.error("Error fetching chat history:", error.message);
      if (error.response) {
        console.error("Response data:", error.response.data);
      }
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

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("logout error：", error);
    }
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

  const getSubscriptionExpiryDate = async (userId) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/user/users/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${Token}`,
          },
        },
      );
      const user = response.data;
      const expiryDate = new Date(user.subscriptionExpiryDate);
      setExpiryDate(expiryDate);
      const formattedExpiryDate = format(expiryDate, "MMMM dd, yyyy");
      setFormattedDate(formattedExpiryDate);
      console.log(`Subscription Expiry Date for user ${userId}:`, expiryDate);
    } catch (error) {
      console.error("Error fetching user data:", error);
      throw error;
    }
  };

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
      className={
        "mx-auto mt-4 h-[80vh] w-10/12 bg-cover bg-center rounded-xl bg-no-repeat"
      }
      style={{
        backgroundImage: `url(${process.env.PUBLIC_URL}/Login.jpg)`,
      }}
    >
      {alertVisible && <SenddingAlert setAlertVisible={setAlertVisible} />}
      <div className="bg-black bg-opacity-60 border-4 border-black rounded-xl h-full flex flex-col">
        {/* 聊天内容区域 */}
        <div className="flex-grow overflow-y-auto p-4">
          <div className={"flex items-center justify-between"}>
            <h2 className="text-2xl text-white font-bold mb-2">Chat History</h2>
            <div>
              <button
                className={
                  "text-white bg-blue-600 rounded-md mr-4 p-0.5 hover:bg-white hover:text-blue-600 transition-all duration-500"
                }
                onClick={() => navigate("/payment")}
              >
                Subscribe
              </button>
              <button
                className={"text-white"}
                onClick={() => navigate("/payment")}
              >
                Expiry date: {formattedDate}
              </button>
            </div>
          </div>
          <div className="messages mb-4 overflow-y-auto">
            {messages.map((message, index) => (
              <div key={index} className="mb-2">
                <div className="flex justify-end mr-4">
                  <div className="bg-blue-200 p-2 rounded-lg max-w-md">
                    {userPhotoURL === "" ? (
                      <p>
                        <Avatar size={40}>USER</Avatar> {message.userMessage}
                      </p>
                    ) : (
                      <p>
                        <Avatar size={40} src={userPhotoURL}>
                          USER
                        </Avatar>{" "}
                        {message.userMessage}
                      </p>
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
            <div ref={messagesEndRef}></div>
          </div>
        </div>

        <div className="bg-black bg-opacity-60 flex items-center p-4">
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
      <div className="flex-grow mb-4 overflow-y-auto">
        <FloatButton.Group
          trigger="hover"
          type="primary"
          style={{ insetInlineEnd: 94 }}
          icon={<CustomerServiceOutlined />}
          tooltip={<div>Theme</div>}
        >
          <FloatButton
            onClick={handleLogout}
            icon={<LogoutOutlined />}
            tooltip={<div>Log out</div>}
          />
          <FloatButton className={"bg-black"} />
        </FloatButton.Group>
      </div>
    </div>
  );
};

export default Main;
