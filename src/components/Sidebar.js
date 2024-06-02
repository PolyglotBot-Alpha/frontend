import React, { useContext, useState, useEffect } from "react";
import "../App.css";
import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
  HistoryOutlined,
  GoogleOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { Avatar, Button, Layout, List, Menu, Skeleton, Input, Space, ConfigProvider } from "antd";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebase-config.js";
import { useNavigate } from "react-router-dom";
import { useCollapsed } from "./Contexts.js";
import GoogleSignIn from "./GoogleSignIn.js";
import { useTranslation } from "react-i18next";
import i18n from "../translations/i18n.js";
import { useSelector, useDispatch } from 'react-redux'
import { setUser, delUser } from './userSlice.js'
import { addChat, setChat, logoutChat } from './chatSlice.js'
import { changeChat, logoutMsg } from './messageSlice.js'
import axios from "axios";

const { Sider } = Layout;
function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}
const Sidebar = () => {
  // const [user, setUser] = useState(null);
  const { collapsed, setCollapsed } = useCollapsed();
  const { t, i18n } = useTranslation();

  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const chats = useSelector((state) => state.chats.chats);
  const selectedChat = useSelector((state) => state.msgs.selectedChat);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (User) => {
      if (User && User.uid) {
        // setUser(User);
        dispatch(setUser(User.uid));
      } else {
        // setUser(null);
        dispatch(delUser());
        dispatch(logoutChat());
        dispatch(logoutMsg());
      }
    });
    return () => unsubscribe();
  }, []);

  const updateChat = async ()=>{
    try{
      const resp = await axios.get(
        process.env.REACT_APP_DB_URL + "chats/" + user
      )
      dispatch(setChat(resp.data.data));
      return resp.data.data;
    }catch(e){
      console.log("Load chat history from server failed");
      console.log(e)
    }
  }
  useEffect(()=>{
    // fetch chat list from database when user login
    if (!user) return

    updateChat().then(()=>{});
    
  }, [user])

  const [chatNameIpt, setChatNameIpt] = useState("");
  const handleAddChat =  (chatName) => {
    if (!chatName) return
    if (!user) return
    axios.post(process.env.REACT_APP_DB_URL + 'chats', {
      'userId': user,
      'chatName': chatName,
    }).then(()=>{
      updateChat().then((resp)=>{
        const chatIds = resp.map((x)=>x.chatId);
        const newId = chatIds.reduce((x,y)=>Math.max(x,y), -Infinity);
        dispatch(changeChat(newId));
        setChatNameIpt("");
      });
      
    })
  }

  const items = [
    getItem(t("History"), "1", <HistoryOutlined />),
    getItem(t("Option 1"), "2", <PieChartOutlined />),
    getItem(t("Option 2"), "3", <DesktopOutlined />),
    getItem(t("User"), "sub1", <UserOutlined />, [
      getItem("Tom", "4"),
      getItem("Bill", "5"),
      getItem("Alex", "6"),
    ]),
    getItem(t("Team"), "sub2", <TeamOutlined />, [
      getItem("Team 1", "7"),
      getItem("Team 2", "8"),
    ]),
    getItem(t("Files"), "9", <FileOutlined />),
  ]; // menu contents

  const navigate = useNavigate();
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
  return (
    <Sider
      className={"sideBar"}
      collapsible
      collapsed={collapsed}
      onCollapse={(value) => setCollapsed(value)}
    >
      <div className="demo-logo-vertical" />
      {/*Sidebar menu part*/}
      {/* <Menu
        theme="dark"
        defaultSelectedKeys={["1"]}
        mode="inline"
        items={items}
        onClick={handleMenuClick}
      /> */}
      <Input.Search placeholder="Chat Name" enterButton={t("New Chat")} onSearch={(val)=>{handleAddChat(val)}} value={chatNameIpt} onChange={(e)=>{setChatNameIpt(e.target.value)}} disabled={user == null} style={{display: user==null?'none':''}} />
      
      <ConfigProvider
        theme={{
          components:{
            List:{
              itemPadding: "2px 0",
            }
          }
      }}>
      <List
        footer={<GoogleSignIn />}
        dataSource={chats}
        renderItem={(item, idx) => (
          <List.Item key={item.chatId}>
            <Button 
            type="text" block 
            href="#" 
            onClick={()=>{dispatch(changeChat(item.chatId))}}
            style={{border: "1px solid #4e4f97",
              background: "#0f2540",
              color: "#f8f8f8",
            }}
            
            >
              {item.chatName}
            </Button>
          </List.Item>
        )}
      />
      </ConfigProvider>

      {/*  Sidebar content*/}
      {/*<GoogleSignIn style={{ width: "auto", height: "auto" }} />*/}
      {/* <GoogleSignIn /> */}
    </Sider>
  );
};

export default Sidebar;
