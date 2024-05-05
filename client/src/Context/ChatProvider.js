import React, { createContext, useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import {  useSelector } from 'react-redux'

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const [selectedChat, setSelectedChat] = useState();
  const user = useSelector((state) => state?.auth?.user)
  const [notification, setNotification] = useState([]);
  const [chats, setChats] = useState();

  return (
    <ChatContext.Provider
      value={{
        selectedChat,
        setSelectedChat,
        user,
        notification,
        setNotification,
        chats,
        setChats,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const ChatState = () => {
  return useContext(ChatContext);
};

export default ChatProvider;
