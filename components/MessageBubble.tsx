import { Box, Typography } from "@mui/material";
import { Message } from "../types/chat";

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: message.sender === "user" ? "flex-end" : "flex-start",
        marginBottom: "12px",
      }}
    >
      <Box
        sx={{
          maxWidth: "70%",
          padding: "8px 12px",
          borderRadius: "12px",
          bgcolor: message.sender === "ai" ? "#E3F2FD" : "#BBDEFB",
        }}
      >
        <Typography variant="body1">{message.text}</Typography>
      </Box>
    </Box>
  );
};

export default MessageBubble;