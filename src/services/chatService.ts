import { Message, ChatApiPayload, ChatMessagePart } from '../types/chat';

import config from "../config";

export const getChatResponse = async (history: Message[]): Promise<string> => {
  try {
    const payload: ChatApiPayload = {
      contents: history,
    };

    const response = await fetch(`${config.apiUrl}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API Error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const responseData: ChatApiPayload = await response.json();

    // The API returns the whole history, so we get the last message which is the assistant's new response.
    const lastMessage = responseData.contents[responseData.contents.length - 1];

    if (lastMessage && lastMessage.role === 'assistant' && lastMessage.parts.length > 0) {
      let part = lastMessage.parts[0];
      return (part as ChatMessagePart).text;
    }

    throw new Error('Invalid response format from API');

  } catch (error) {
    console.error('Failed to fetch chat response:', error);
    if (error instanceof Error) {
      // Add a more descriptive message for the likely CORS issue.
      if (error.message.includes('Failed to fetch')) {
        return "Sorry, I could not connect to the health assistant. This might be a network issue or a server configuration problem.";
      }
      return `Sorry, I encountered an error: ${error.message}. Please try again later.`;
    }
    return 'An unknown error occurred. Please try again.';
  }
};
