import { Box, Typography, Avatar } from "@mui/material";

const Header: React.FC = () => {
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
        AI 助手
      </Typography>
      <Typography variant="body2">用户名</Typography>
    </Box>
  );
};

export default Header;