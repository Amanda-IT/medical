import { useState } from "react";
import { Box, TextField, IconButton } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

interface ChatInputProps {
  onSend: (text: string) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSend }) => {
  const [inputText, setInputText] = useState<string>("");

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      onSend(inputText);
      setInputText("");
    }
  };

  return (
    <Box sx={{ display: "flex", padding: "12px", bgcolor: "background.paper" }}>
      <TextField
        fullWidth
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Please insert your symptoms..."
        variant="outlined"
        size="small"
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: "20px",
            bgcolor: "action.hover",
          },
        }}
      />
      <IconButton
        onClick={() => {
          onSend(inputText);
          setInputText("");
        }}
        sx={{ marginLeft: "8px", color: "primary.main" }}
      >
        <SendIcon />
      </IconButton>
    </Box>
  );
};

export default ChatInput;