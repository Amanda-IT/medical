import { Box, Typography } from "@mui/material";
import { MessagePart, Message } from "../types/chat";
import { Person, Android } from '@mui/icons-material';
import PauseIcon from '@mui/icons-material/Pause';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';

interface MessageBubbleProps {
  message: Message;
  index: number;
  onPlayPauseSpeech: (index: number, text: string) => void;
  isSpeaking: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, index, onPlayPauseSpeech, isSpeaking }) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: message.role === "user" ? "flex-end" : "flex-start",
        marginBottom: "12px",
      }}
    >
      <Box
        sx={{
          maxWidth: "70%",
          padding: "8px 12px",
          borderRadius: "12px",
          bgcolor: message.role === "assistant" ? "#E3F2FD" : "#BBDEFB",
        }}
      >
        {message.role === 'user' ? (
          <Person style={{ marginRight: '8px', color: '#1890ff' }} />
        ) : (
          <Android style={{ marginRight: '8px', color: '#52c41a' }} />
        )}

        {message.parts.map(part => (
          <>
            {
              part.text !== undefined &&
              <div
                style={{
                  whiteSpace: "pre-line",
                  lineHeight: "1.6",
                  fontFamily: "inherit"
                }}
              >
                {part.text}
              </div>
            }
            {
              message.role === 'assistant' &&
              <button
                onClick={() => onPlayPauseSpeech(index, part.text as string)}
                className="self-center p-1.5 text-gray-400 rounded-full hover:bg-gray-200 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                aria-label={isSpeaking ? 'Pause speech' : 'Play speech'}
                style={{ float: "right" }}
              >
                {isSpeaking ? <PauseIcon className="w-5 h-5" /> : <PlayCircleIcon className="w-5 h-5" />}
              </button>
            }
          </>
        ))}
      </Box>
    </Box>
  );
};

export default MessageBubble;