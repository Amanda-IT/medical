import { Box, Button } from "@mui/material";

interface QuickQuestionsProps {
  onSend: (text: string) => void;
}

const QuickQuestions: React.FC<QuickQuestionsProps> = ({ onSend }) => {
  const questions = [
    "Show my appointments",
    "65-year-old with hypertension, experiencing chest tightness and shortness of breath. Please recommend some expert doctors.",
  ];

  return (
    <Box sx={{ padding: "0 16px 12px", display: "flex", flexWrap: "wrap", gap: 1 }}>
      examples: 
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