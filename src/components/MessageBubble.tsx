import { Box, Typography } from "@mui/material";
import { MessagePart, Message } from "../types/chat";
import { Person, Android } from '@mui/icons-material';

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
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
          part.text !== undefined ?
            (<Typography variant="body1">{part.text}</Typography>)
            : <></>
        ))}
      </Box>
    </Box>
  );
};

export default MessageBubble;