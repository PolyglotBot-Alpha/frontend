import React, { createContext, useContext, useState, useEffect } from "react";

// Collapsed Context
const CollapsedContext = createContext({
  collapsed: false,
  setCollapsed: () => {},
});

export const useCollapsed = () => useContext(CollapsedContext);

const CollapsedProvider = ({ children, value }) => (
  <CollapsedContext.Provider value={value}>
    {children}
  </CollapsedContext.Provider>
);

// Mobile Context
const MobileContext = createContext({
  isMobile: false,
  setIsMobile: () => {},
});

export const useMobile = () => useContext(MobileContext);

const MobileProvider = ({ children, value }) => (
  <MobileContext.Provider value={value}>{children}</MobileContext.Provider>
);

// Messages Context
const MessagesContext = createContext({
  messages: [],
  setMessages: () => {},
});

export const useMessages = () => useContext(MessagesContext);

const MessagesProvider = ({ children, value }) => (
  <MessagesContext.Provider value={value}>{children}</MessagesContext.Provider>
);

// Combined Provider
export const AppContextProvider = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [messages, setMessages] = useState(() => {
    const savedMessages = localStorage.getItem("chatMessages");
    return savedMessages ? JSON.parse(savedMessages) : [];
  });

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      setCollapsed(mobile);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    localStorage.setItem("chatMessages", JSON.stringify(messages));
  }, [messages]);

  const collapsedValue = { collapsed, setCollapsed };
  const mobileValue = { isMobile, setIsMobile };
  const messagesValue = { messages, setMessages };

  return (
    <CollapsedProvider value={collapsedValue}>
      <MobileProvider value={mobileValue}>
        <MessagesProvider value={messagesValue}>{children}</MessagesProvider>
      </MobileProvider>
    </CollapsedProvider>
  );
};

// export default Contexts;
