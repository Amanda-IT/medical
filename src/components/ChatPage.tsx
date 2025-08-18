import React, { useState, useRef, useEffect } from "react";
import { Box } from "@mui/material";
import Header from "./Header";
import MessageBubble from "./MessageBubble";
import QuickQuestions from "./QuickQuestions";
import ChatInput from "./ChatInput";
import { Message } from "../types/chat";

const ChatPage: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([
      { id: 1, text: "Hello! I'm your AI Health Assistant. To get started,Please describe your symptoms.", sender: "ai" },
    ]);
    const messagesEndRef = useRef<HTMLDivElement>(null);
  
    // 自动滚动到底部
    const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };
  
    useEffect(() => {
      scrollToBottom();
    }, [messages]);
  
    // 发送消息（用户或快捷问题）
    const handleSend = (text: string) => {
      if (!text.trim()) return;
  
      // 用户消息
      const userMessage: Message = {
        id: Date.now(),
        text,
        sender: "user",
      };
      setMessages((prev) => [...prev, userMessage]);
  
      // AI 回复（模拟）
      setTimeout(() => {
        const aiReply: Message = {
          id: Date.now() + 1,
          text: "这是 AI 的回复：" + text,
          sender: "ai",
        };
        setMessages((prev) => [...prev, aiReply]);
      }, 800);
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
        <QuickQuestions onSend={handleSend} />
        <ChatInput onSend={handleSend} />
      </Box>
    );
  };

export default ChatPage;