import { Box, Button } from "@mui/material";

interface QuickQuestionsProps {
  onSend: (text: string) => void;
}

const QuickQuestions: React.FC<QuickQuestionsProps> = ({ onSend }) => {
  const questions = [
    "如何学习 React？",
    "MUI 的主题如何自定义？",
    "什么是 TypeScript？",
    "如何优化前端性能？",
  ];

  return (
    <Box sx={{ padding: "0 16px 12px", display: "flex", flexWrap: "wrap", gap: 1 }}>
      {questions.map((text, index) => (
        <Button
          key={index}
          variant="outlined"
          size="small"
          onClick={() => onSend(text)}
          sx={{
            borderRadius: "20px",
            textTransform: "none",
            bgcolor: "action.hover",
            borderColor: "divider",
          }}
        >
          {text}
        </Button>
      ))}
    </Box>
  );
};

export default QuickQuestions;