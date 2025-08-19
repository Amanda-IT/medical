
export interface ChatMessagePart {
  text: string;
}

export interface FunctionCallPart {
  name: string;
  args: {
    options: any[];
  };
}

export interface Message {
  id: number;
  role: 'user' | 'assistant';
  parts: (ChatMessagePart | FunctionCallPart)[];
}

export interface ChatApiPayload {
  contents: Message[];
}
