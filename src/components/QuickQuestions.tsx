import { Box, Button } from "@mui/material";

interface QuickQuestionsProps {
  onSend: (text: string) => void;
}

const QuickQuestions: React.FC<QuickQuestionsProps> = ({ onSend }) => {
  const questions = [
    "Show my appointments",
    "65 years,有高血压病史，最近3天出现胸闷，气短症状，请推荐几位上海专家医生",
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