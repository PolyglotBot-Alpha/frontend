import React, { useEffect, useState } from "react";
import { auth, provider } from "../firebase-config.js";
import { signInWithPopup, onAuthStateChanged, signOut } from "firebase/auth";
import DefaultAvatar from "../DefaultAvatar.jpeg";
import { Avatar, Card, Tooltip, ConfigProvider } from "antd";
import { LogoutOutlined, GoogleOutlined } from "@ant-design/icons";
// import { Avatar, Button } from "antd";
const { Meta } = Card;
function GoogleSignIn({ style }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });
  }, []);

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
                <Tooltip title="Sign Out">
                  <LogoutOutlined
                    key="SignOut"
                    style={{ color: "#f8f8f8" }}
                    onClick={handleSignOut}
                  />
                </Tooltip>,
              ]
            : [
                <Tooltip title="Sign in with Google">
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
          //description="This is the description"
        />
      </Card>
    </ConfigProvider>
  );
}

export default GoogleSignIn;
