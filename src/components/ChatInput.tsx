import { useState, useEffect, useRef, useCallback } from "react";
import { Box, TextField, IconButton } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import MicIcon from '@mui/icons-material/Mic';
import StopIcon from '@mui/icons-material/Stop';
import { SpeechToSpeech } from '../lib/speechToSpeech';

// For TypeScript to recognize the Web Speech API
interface SpeechRecognitionEvent extends Event {
  readonly resultIndex: number;
  readonly results: SpeechRecognitionResultList;
}
interface SpeechRecognitionErrorEvent extends Event {
  readonly error: string;
  readonly message: string;
}
declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
  interface SpeechRecognition extends EventTarget {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    start(): void;
    stop(): void;
    onresult: (event: SpeechRecognitionEvent) => void;
    onerror: (event: SpeechRecognitionErrorEvent) => void;
    onend: () => void;
  }
}


interface ChatInputProps {
  onSend: (text: string) => void;
  isLoading: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSend, isLoading }) => {
  const [inputText, setInputText] = useState<string>("");

  const [isRecording, setIsRecording] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const [isSpeechApiSupported, setIsSpeechApiSupported] = useState(false);

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const inputRef = useRef(inputText);

  // 每次更新 state 时，也更新 ref
  useEffect(() => {
    inputRef.current = inputText;
  }, [inputText]);

  const speechToSpeech = new SpeechToSpeech((data: string) => {
    console.log(data);
    setInputText(inputText + " " + data);
  });


  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        let interimTranscript = ''; // 临时
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const transcriptPart = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcriptPart;
          } else {
            interimTranscript += transcriptPart;
          }
        }

        setVoiceTranscript(finalTranscript + interimTranscript);
        // 这个代码块是闭包, 只能拿到初始化useEffect 时的 inputText ""
        setInputText(inputRef.current + "" + finalTranscript)
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
    } else {
      setIsSpeechApiSupported(false);
      console.warn("Speech Recognition API is not supported in this browser.");
    }

    // Cleanup speech synthesis on component unmount
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      if (isRecording) {
        recognitionRef.current?.stop();
        setIsRecording(false);
      }

      onSend(inputText);
      setInputText("");
    }
  };

  const handleToggleListening = useCallback(() => {
    if (!recognitionRef.current) return;

    if (isRecording) {
      recognitionRef.current.stop();
    } else {
      setVoiceTranscript('');
      recognitionRef.current.start();
    }
    setIsRecording(!isRecording);
  }, [isRecording]);

  const handleToggleListeningByApi = useCallback(() => {

    if (isRecording) {
      speechToSpeech.stopStreaming()
    } else {
      speechToSpeech.startStreaming()
    }
    setIsRecording(!isRecording);
  }, [isRecording]);


  return (
    <Box sx={{ display: "flex", padding: "12px", bgcolor: "background.paper" }}>
      <TextField
        fullWidth
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder={"Please describe your symptoms..."}
        variant="outlined"
        size="small"
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: "20px",
            bgcolor: "action.hover",
          },
        }}
      />
      {(
        <button
          type="button"
          onClick={isSpeechApiSupported ? handleToggleListeningByApi : handleToggleListening}
          disabled={isLoading}
          className={`flex-shrink-0 p-3 rounded-full transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed ${isRecording
            ? 'bg-red-500 text-white animate-pulse'
            : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
            }`}
          style={{ width: "40px" }}
          aria-label={isRecording ? 'Stop listening' : 'Start listening'}
        >
          {!isRecording ? <MicIcon /> : <StopIcon />}
        </button>
      )}

      <IconButton
        disabled={isLoading || !inputText.trim()}
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