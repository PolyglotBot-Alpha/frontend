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
import { Avatar, Button, Layout, List, Menu, Skeleton } from "antd";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebase-config.js";
import { useNavigate } from "react-router-dom";
import { useCollapsed } from "./Contexts.js";
import GoogleSignIn from "./GoogleSignIn.js";
import { useTranslation } from "react-i18next";
import i18n from "../translations/i18n.js";
import { useSelector, useDispatch } from 'react-redux'
import { setUser, delUser } from './userSlice.js'
import { addChat, setChat } from './chatSlice.js'
import { changeChat } from './messageSlice.js'
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
      if (User) {
        // setUser(User);
        dispatch(setUser(User));
        loadChat().then(()=>{});
      } else {
        // setUser(null);
        dispatch(delUser());
      }
    });
    return () => unsubscribe();
  }, []);

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

  async function loadChat() {
    if (user && user.uid) {
      axios.get(
        process.env.REACT_APP_DB_URL + "/chats/" + user.uid
      ).then((resp) => {
        dispatch(setChat(resp.data.data));
      }).catch((e) => {
        console.log("Load chat history from server failed");
        console.log(e)
      })
    }
  }


  async function loadTest(uid) {
    if (uid) {
      axios.get(
        process.env.REACT_APP_DB_URL + "/chats/" + uid
      ).then((resp) => {
        dispatch(setChat(resp.data.data));
      }).catch((e) => {
        console.log("Load chat history from server failed");
        console.log(e)
      })
    }
  }

  useEffect(()=>{
    loadChat().then(()=>{});
    loadTest('azsfcjo3of').then(()=>{});
  }, [])

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

      <List
        footer={<GoogleSignIn />}
        dataSource={chats}
        renderItem={(item, idx) => (
          <List.Item key={item.chatId}>
            <Button href="#" onClick={()=>{dispatch(changeChat(item.chatId))}}>
              {item.chatName}
            </Button>
          </List.Item>
        )}
      />

      {/*  Sidebar content*/}
      {/*<GoogleSignIn style={{ width: "auto", height: "auto" }} />*/}
      {/* <GoogleSignIn /> */}
    </Sider>
  );
};

export default Sidebar;
