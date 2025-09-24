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
  const [enableRecording, setEnableRecording] = useState<boolean>(true);

  const initialMessage: Message = {
    id: 1,
    role: 'assistant',
    parts: [{ text: "Hello! I'm your AI Health Assistant. To get started, please describe your symptoms." }],
  }
  const [messages, setMessages] = useState<Message[]>([initialMessage]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [speakingMessageIndex, setSpeakingMessageIndex] = useState<number | null>(null);
  const [isSpeechPaused, setIsSpeechPaused] = useState(false);



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



  const handlePlayPauseSpeech = useCallback((index: number, text: string) => {
    const speech = window.speechSynthesis;

    if (speakingMessageIndex === index && speech.speaking) {
      if (speech.paused) {
        speech.resume();
        setIsSpeechPaused(false);
      } else {
        speech.pause();
        setIsSpeechPaused(true);
      }
    } else {
      speech.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'zh-CN'; // Set to Chinese for example prompts, will fallback if not available

      utterance.onstart = () => {
        setSpeakingMessageIndex(index);
        setIsSpeechPaused(false);
      };
      utterance.onend = () => {
        setSpeakingMessageIndex(null);
        setIsSpeechPaused(false);
      };
      utterance.onerror = (e) => {
        console.error('Speech Synthesis Error:', e);
        setSpeakingMessageIndex(null);
        setIsSpeechPaused(false);
      };
      speech.speak(utterance);
    }
  }, [speakingMessageIndex]);

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

  const handleToolResponse = useCallback(async (data: any) => {
    if (!activeToolCall) return;

    let { option, num } = data;
    const [firstKey, firstValue] = Object.entries(option)[0];

    const userMessage: Message = {
      id: 1,
      role: 'user',
      parts: [{
        functionResponse: {
          name: activeToolCall?.name,
          response: `user choose the option ${num}`
        }
      }],
    }

    setMessages(prev => [...prev, userMessage]);

    handleSendMessage(`I choose option ${num}, ${firstValue}`)
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
        {messages.map((msg, index) => (
          <MessageBubble key={msg.id} message={msg}
            index={index}
            onPlayPauseSpeech={(isSpeak) => { setEnableRecording(!isSpeak); }}
            isSpeaking={speakingMessageIndex === index && !isSpeechPaused}
          />
        ))}

        {isLoading && <TypingIndicator />}
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
              tip={activeToolCall.args.tip}
            />
          )

        }
      </div>

      <ChatInput onSend={handleSendMessage}
        isLoading={isLoading}
        enableRecording={enableRecording}
      />
    </Box>
  );
};

export default ChatPage;