import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import "../App.css";
import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
  SoundOutlined,
  SendOutlined,
  HistoryOutlined,
  GoogleOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { Avatar, Button, Layout, Menu, theme } from "antd";
import { Input } from "antd";
import UserImage from "../user.png";
import { auth, provider } from "../firebase-config.js";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
const { TextArea } = Input;
const { Header, Content, Footer, Sider } = Layout;

function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}

function Main() {
  //const { currentUser } = useContext(AuthContext);
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState(() => {
    // Try to retrieve the chat history from localStorage
    const savedMessages = localStorage.getItem("chatMessages");
    return savedMessages ? JSON.parse(savedMessages) : [];
  });
  const [input, setInput] = useState("");

  useEffect(() => {
    // Listen for changes in messages and update localStorage
    localStorage.setItem("chatMessages", JSON.stringify(messages));
    const unsubscribe = onAuthStateChanged(auth, (User) => {
      if (User) {
        setUser(User);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, [messages]);
  const items = [
    getItem("History", "1", <HistoryOutlined />),
    getItem("Option 1", "2", <PieChartOutlined />),
    getItem("Option 2", "3", <DesktopOutlined />),
    getItem("User", "sub1", <UserOutlined />, [
      getItem("Tom", "4"),
      getItem("Bill", "5"),
      getItem("Alex", "6"),
    ]),
    getItem("Team", "sub2", <TeamOutlined />, [
      getItem("Team 1", "7"),
      getItem("Team 2", "8"),
    ]),
    getItem("Files", "9", <FileOutlined />),
    user
      ? getItem(
          user.displayName,
          "10",
          <Avatar style={{ right: 10 }} src={user.photoURL} />,
          [getItem("Sign Out", "11", <LogoutOutlined />)],
        )
      : getItem("Sign in with Google", "10", <GoogleOutlined />),
  ]; // menu contents
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

  const handleBotResponse = (inputText) => {
    const botMessageText = `Echo: ${inputText}`; // Simulate a bot's response
    const botMessage = {
      text: botMessageText,
      id: Date.now() + 1,
      sender: "bot",
    };
    setTimeout(() => {
      setMessages((messages) => [...messages, botMessage]);
    }, 500); // Simulate network delay
  };

  const playText = (text) => {
    const speech = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(speech);
  };

  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  let InputLeftValue;
  if (isMobile) {
    InputLeftValue = 90;
  } else {
    InputLeftValue = collapsed ? 90 : 280;
  }
  let MessageLeftValue;
  if (isMobile) {
    MessageLeftValue = 40;
  } else {
    MessageLeftValue = collapsed ? 50 : 100;
  }

  const navigate = useNavigate();
  //Handle all the click events of menu
  const handleMenuClick = (e) => {
    console.log("Menu item clicked:", e.key);
    switch (e.key) {
      case "10":
        if (!user) {
          navigate("/GoogleSignIn");
        }
        break;
      case "11":
        handleSignOut();
    }
  };
  const handleSignOut = () => {
    signOut(auth).catch((error) => console.error("Error signing out: ", error));
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setCollapsed(true);
        setIsMobile(true);
      } else {
        setCollapsed(false);
        setIsMobile(false);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <Layout
      style={{
        height: "100vh",
      }}
    >
      <Sider
        className={"sideBar"}
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <div className="demo-logo-vertical" />
        {/*Sidebar menu part*/}
        <Menu
          theme="dark"
          defaultSelectedKeys={["1"]}
          mode="inline"
          items={items}
          onClick={handleMenuClick}
        />
        {/*  Sidebar content*/}
      </Sider>
      <Layout style={{ height: "100%" }}>
        <Header className={"header"} />
        <Content className={"content"}>
          {/*main contents*/}
          <div
            className={"messageArea"}
            style={{
              marginLeft: MessageLeftValue,
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
          {/*</div>*/}
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
        </Content>
      </Layout>
    </Layout>
  );
}

export default Main;
