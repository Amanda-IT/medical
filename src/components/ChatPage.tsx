import React, { useState, useRef, useEffect, useCallback } from "react";
import { Box } from "@mui/material";
import Header from "./Header";
import MessageBubble from "./MessageBubble";
import QuickQuestions from "./QuickQuestions";
import ChatInput from "./ChatInput";
import { Message, FunctionCall, FunctionResponse } from "../types/chat";
import { getChatResponse } from '../services/chatService';
import ChooseOptions from "./ChooseOptions"
import TypingIndicator from "./TypingIndicator"

const ChatPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);

  const initialMessage: Message = {
    id: 1,
    role: 'assistant',
    parts: [{ text: "Hello! I'm your AI Health Assistant. To get started, please describe your symptoms." }],
  }
  const [messages, setMessages] = useState<Message[]>([initialMessage]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [activeToolCall, setActiveToolCall] = useState<FunctionCall | null>(null);

  // 自动滚动到底部
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };


  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleStartOver = () => {
    setMessages([initialMessage])
    setIsLoading(false);
  }

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
    setActiveToolCall(null);

    const assistantMessage = await getChatResponse(updatedHistory);


    assistantMessage.parts.forEach((part, index) => {
      if (part.functionCall != null) {
        setActiveToolCall(part.functionCall)
      }
    });

    setMessages((prevMessages) => [...prevMessages, assistantMessage]);
    setIsLoading(false);

  };

  const handleToolResponse = useCallback(async (userSelection: number) => {
    if (!activeToolCall) return;

    const userMessage: Message = {
      id: 1,
      role: 'user',
      parts: [{
        functionResponse: {
          name: activeToolCall?.name,
          response: `user choose the ${userSelection}`
        }
      }],
    }

    setMessages(prev => [...prev, userMessage]);

    handleSendMessage(`I choose ${userSelection}`)
  }, [activeToolCall]);

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

        {isLoading && <TypingIndicator />}
        <div ref={messagesEndRef} />

        <div ref={messagesEndRef} />
      </Box>

      {
        messages.length <= 1 &&
        <QuickQuestions onSend={handleSendMessage} />

      }

      <div className="max-w-3xl mx-auto">
        {activeToolCall?.name === 'show_recommendation' &&
          (
            <ChooseOptions
              options={activeToolCall.args.options}
              onChoose={handleToolResponse}
              isLoading={isLoading}
            />
          )

        }
      </div>

      <ChatInput onSend={handleSendMessage} />
    </Box>
  );
};

export default ChatPage;