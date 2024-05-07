import React, { useEffect, useState } from "react";
import { auth, provider } from "../firebase-config.js";
import { signInWithPopup, onAuthStateChanged, signOut } from "firebase/auth";
import DefaultAvatar from "../DefaultAvatar.jpeg";
import { Avatar, Card, Tooltip, ConfigProvider } from "antd";
import { LogoutOutlined, GoogleOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import axios, { interceptors } from "axios";
// import { Avatar, Button } from "antd";
const { Meta } = Card;

function GoogleSignIn({ style }) {
  const [user, setUser] = useState(null);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });
  }, []);

  // const [messages, setMessages] = useState([]);
  // useEffect(() => {
  //   const fetchMessages = async () => {
  //     if (user && user.uid) {
  //       const chatId = user.uid;
  //       console.log("!!!");
  //       console.log(user.id);
  //       console.log(chatId);
  //       console.log(user);
  //       try {
  //         const response = await axios.get(
  //           `http://localhost:8081/chats/${chatId}`,
  //         );
  //         // const response = await axios.get(
  //         //   `https://chat-message-service-a19d7ac6f5fa.herokuapp.com/chats/${chatId}`,
  //         // );
  //         setMessages(response.data);
  //       } catch (error) {
  //         console.error("Error fetching messages:", error);
  //       }
  //     } else {
  //       console.log("user id undefined");
  //       console.log(user);
  //     }
  //   };
  //
  //   fetchMessages();
  // }, []);

  const handleSignIn = () => {
    signInWithPopup(auth, provider).catch((error) =>
      console.error("Error signing in: ", error),
    );
  };

  const handleSignOut = () => {
    signOut(auth).catch((error) => console.error("Error signing out: ", error));
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorTextHeading: "#f8f8f8",
          colorBorderSecondary: "#4E4F97",
        },
        components: {
          Card: {
            actionsBg: "#0F2540",
          },
        },
      }}
    >
      <Card
        // style={style}
        //size="small"

        style={{
          backgroundColor: "#0F2540",
          //border: "1px solid #4E4F97",
        }}
        actions={
          user
            ? [
                <Tooltip title={t("SignOut")}>
                  <LogoutOutlined
                    key="SignOut"
                    style={{ color: "#f8f8f8" }}
                    onClick={handleSignOut}
                  />
                </Tooltip>,
              ]
            : [
                <Tooltip title={t("GoogleSignIn")}>
                  <GoogleOutlined
                    key="GoogleSignIn"
                    style={{ color: "#f8f8f8" }}
                    onClick={handleSignIn}
                  />
                </Tooltip>,
              ]
        }
      >
        <Meta
          avatar={
            user ? (
              <Avatar src={user.photoURL} />
            ) : (
              <Avatar src={DefaultAvatar} />
            )
          }
          title={user ? user.displayName : "Visitor"}
          // title={
          //   <div>
          //     {messages.map((message) => (
          //       <div key={message.id}>
          //         <p>
          //           {message.sender}: {message.text}
          //         </p>
          //       </div>
          //     ))}
          //   </div>
          // }
          //description="This is the description"
        />
      </Card>
      {/*<div>*/}
      {/*  {messages.map((message) => (*/}
      {/*    <div key={message.id}>*/}
      {/*      <p>*/}
      {/*        {message.sender}: {message.text}*/}
      {/*      </p>*/}
      {/*    </div>*/}
      {/*  ))}*/}
      {/*</div>*/}
    </ConfigProvider>
  );
}

export default GoogleSignIn;
