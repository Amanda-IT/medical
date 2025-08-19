import React, { useState, useRef, useEffect } from "react";
import { Box } from "@mui/material";
import Header from "./Header";
import MessageBubble from "./MessageBubble";
import QuickQuestions from "./QuickQuestions";
import ChatInput from "./ChatInput";
import { Message } from "../types/chat";
import { getChatResponse } from '../services/chatService';

const ChatPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: 'assistant',
      parts: [{ text: "Hello! I'm your AI Health Assistant. To get started, please describe your symptoms." }],
    },
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 自动滚动到底部
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };



  useEffect(() => {
    scrollToBottom();
  }, [messages]);


  const handleSendMessage = async (userInput: string) => {
    if (!userInput.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      role: 'user',
      parts: [{ text: userInput }],
    };

    const updatedHistory = [...messages, userMessage];
    setMessages(updatedHistory);
    setIsLoading(true);

    const assistantResponseText = await getChatResponse(updatedHistory);

    const assistantMessage: Message = {
      id: Date.now(),
      role: 'assistant',
      parts: [{ text: assistantResponseText }],
    };

    setMessages((prevMessages) => [...prevMessages, assistantMessage]);
    setIsLoading(false);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <Header />

      {/* 对话区域 */}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          padding: "16px",
          bgcolor: "background.default",
        }}
      >
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
        <div ref={messagesEndRef} />
      </Box>

      {/* 快捷提问 + 输入框 */}
      <QuickQuestions onSend={handleSendMessage} />
      <ChatInput onSend={handleSendMessage} />
    </Box>
  );
};

export default ChatPage;