import { Box, Typography, Avatar,Button } from "@mui/material";
import AutorenewIcon from '@mui/icons-material/Autorenew';

const Header: React.FC = () => {
 
  const handleStartOver = () => {
    const confirmReset = window.confirm('Are you sure you want to clear the chat history?');
    if (confirmReset) {
      // clearMessages();
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        padding: "12px 16px",
        bgcolor: "primary.main",
        color: "white",
        gap: 2,
      }}
    >
      <Avatar sx={{ bgcolor: "white", color: "primary.main" }}>🤖</Avatar>
      <Typography variant="h6" sx={{ flex: 1 }}>
        AI Health Assistant
      </Typography>
      <Typography variant="body2">
          Admin 
          <Button onClick={handleStartOver} variant="contained" sx={{marginLeft: "1rem",}} color="success" startIcon={<AutorenewIcon />}>
            start over
          </Button>
      </Typography>
    </Box>
  );
};

export default Header;