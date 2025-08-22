import { Box, Typography, Avatar,Button } from "@mui/material";
import React, { useEffect, useState } from "react";

const Header: React.FC = () => {
  const [username, setUsername] = useState("");
  useEffect(() => {
    const savedUser = localStorage.getItem("currentUser");
    if (savedUser) {
      setUsername(savedUser);
    }
  }, []);

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
        Welcome, {username}! 
      </Typography>
    </Box>
  );
};

export default Header;