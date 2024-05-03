import React, { useEffect } from "react";
import "../App.css";
import { Layout } from "antd";
import Sidebar from "../components/Sidebar.js";
import Headbar from "../components/Headbar.js";
import MessageArea from "../components/MessageArea.js";
import { useCollapsed, useMobile } from "../components/Contexts.js";

function Main() {
  const { collapsed, setCollapsed } = useCollapsed();
  const { isMobile, setIsMobile } = useMobile();

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
      <Sidebar />
      <Layout style={{ height: "100%" }}>
        <Headbar />
        <MessageArea />
      </Layout>
    </Layout>
  );
}

export default Main;
