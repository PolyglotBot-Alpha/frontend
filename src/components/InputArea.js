import React, { useEffect, useState } from "react";
import { Button, Input } from "antd";
import { SendOutlined } from "@ant-design/icons";
import axios from "axios";
import "../App.css";
import { useCollapsed, useMessages, useMobile } from "./Contexts.js";
import { useSelector, useDispatch } from 'react-redux'
import { addMsg, delMsg, pendMsg, removePendMsg, clearPendMsg, addUnsync, syncUnsync, setRetry, changeChat } from './messageSlice.js'
import { setChat } from './chatSlice.js'

import { useTranslation } from "react-i18next";
const { TextArea } = Input;
const InputArea = () => {
  const { t, i18n } = useTranslation();
  const [input, setInput] = useState("");
  const { collapsed, setCollapsed } = useCollapsed();
  const { isMobile, setIsMobile } = useMobile();
  // const { messages, setMessages } = useMessages();
  // const message = useSelector((state) => state.msgs.msgs)
  const dispatch = useDispatch();
  const currChat = useSelector((state) => state.msgs.selectedChat);

  // user input handler
  const handleInputChange = (event) => {
    setInput(event.target.value);
  };

  // user click send button
  const handleSend = async () => {
    // store user message to local database
    const pendId = Date.now();
    const userMessage = { 
      text: input, 
      id: pendId, 
      sender: "user", 
      chatId: currChat,
    };
    dispatch(clearPendMsg());
    dispatch(pendMsg(userMessage));

    try {
      // communicate with essay generation api for result
      const response = await axios.post(process.env.REACT_APP_API_URL, {
        user_input: input,
      });
      const { essay, audio_url } = response.data;
      const botMessage = {
        text: essay,
        audioUrl: audio_url,
        id: pendId + 1,
        sender: "bot",
        chatId: currChat,
      };
      // pass result to context for display and save to local
      // setMessages((messages) => [...messages, botMessage]);
      dispatch(removePendMsg(pendId));
      dispatch(addUnsync(userMessage));
      dispatch(addUnsync(botMessage));
    } catch (error) {
      console.error("Error fetching response:", error);
      const errorMessage = {
        text: "Failed to fetch response from the server.",
        id: pendId + 1,
        sender: "bot",
      };
      // pass error result for display
      // setMessages((messages) => [...messages, errorMessage]);
      dispatch(pendMsg(errorMessage));
    }

    setInput("");  // clear user input, ready for next message from user
  };

  const unsyncedMsgs = useSelector((state) => state.msgs.unsyncedMsgs);
  const hasUnsync = useSelector((state)=>state.msgs.hasUnsync);
  const user = useSelector(state=>state.user.user);
  const retrying = useSelector(s=>s.msgs.retrying);
  useEffect(() => {
    if (!hasUnsync) return
    if (!user) return
    if (retrying) return

    console.log("start to sync msg")

    async function r(){
      const unsyncedKeys = Object.keys(unsyncedMsgs)
      unsyncedKeys.sort()
      var newChat = null;
      if (unsyncedKeys.length && unsyncedMsgs[unsyncedKeys[0]].chatId == -1){
        // user sent messages when not login, create a chat to store them
        try{
          await axios.post(process.env.REACT_APP_DB_URL + '/chats', {
            'userId': user,
            'chatName': "New Chat",
          })
          const resp = await axios.get(
            process.env.REACT_APP_DB_URL + "/chats/" + user
          )
          dispatch(setChat(resp.data.data));
          const data = resp.data.data;
          const idList = data.map((x)=>x.chatId);
          newChat = idList.reduce((x,y)=>Math.max(x,y), -Infinity);
          if (newChat == -Infinity) throw new RangeError("Can't find the newly created Chat Id");
          dispatch(changeChat(newChat));
        }catch(e){
          console.log("Failed to create a new Chat")
          console.log(e)
          return;
        }
      }
      for(const pendId of unsyncedKeys){
        var tryCount = 0;
        var delay = 1100;
        const maxRetry = 2;
        while(tryCount < maxRetry){
          try{
            const currMsg = unsyncedMsgs[pendId]
            const resu = await axios.post(process.env.REACT_APP_DB_URL +'/messages', {
              "chatId": newChat ? newChat : currMsg.chatId,
              "userId": currMsg.sender == 'user' ? user: 'bot',
              "messageContent": currMsg.text,
              "audio": currMsg.audioUrl,
            })
            
            dispatch(syncUnsync({pendId, messageId: pendId}))
            break;
          }catch(e){
            tryCount += 1;
            console.log(e)
            if (tryCount === maxRetry){
              console.log('Max retries reached when syncing message');
              console.log(unsyncedMsgs[pendId])
              return
            }
            console.warn('Retry ', tryCount ,' failed. Waiting ', delay, 'ms before next attempt')
            await new Promise((resolve)=>setTimeout(resolve, delay))
            delay *= 2;
          }
        }
      }
      dispatch(setRetry(false));
    }

    r()
  }, [hasUnsync, user]);

  // initialize ui value
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
        placeholder={t("input_holder")}
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
        // disabled={currChat==null}
      >
        <SendOutlined />
      </Button>
    </div>
  );
};

export default InputArea;
