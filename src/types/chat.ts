export interface Message {
    id: number;
    text: string;
    sender: "ai" | "user";
  }
  
  export interface ChatProps {
    messages: Message[];
    onSend: (text: string) => void;
  }