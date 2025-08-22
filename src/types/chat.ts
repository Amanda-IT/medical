
// export interface TextMessage{
//   text: string;
// }
export interface MessagePart {
  text?: string;
  functionCall?: FunctionCall
  functionResponse?: FunctionResponse
}

export interface FunctionCall {
  name: string;
  args: {
    options: any[];
  };
}

export interface Message {
  id: number;
  role: 'user' | 'assistant';
  parts: MessagePart[];
}

export interface ChatApiPayload {
  contents: Message[];
}

export interface FunctionResponse {
  name: string;
  response: string;
}
