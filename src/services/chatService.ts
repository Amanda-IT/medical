import { Message, ChatApiPayload } from '../types/chat';

import config from "../config";

export const getChatResponse = async (history: Message[]): Promise<Message> => {
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

    return lastMessage;

  } catch (error) {
    console.error('Failed to fetch chat response:', error);
    let msg = 'An unknown error occurred. Please try again.';
    if (error instanceof Error) {
      msg = `Sorry, I encountered an error: ${error.message}. Please try again later.`;
    }
    return {

      id: 500,
      role: 'assistant',

      parts: [{
        text: msg
      }]
    }
  }
};
