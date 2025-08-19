  import { Person, Android } from '@mui/icons-material';

  const TypingIndicator: React.FC = () => (
    <div className="flex justify-start items-start gap-3 mb-4">
      <div className="flex-shrink-0">
        <Android className="w-8 h-8 text-blue-500" />
      </div>
      <div className="flex items-center space-x-2 px-4 py-3 rounded-2xl bg-white shadow-sm">
          <span className="text-sm text-gray-500">Assistant is typing</span>
          <div className="flex space-x-1">
            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
          </div>
      </div>
    </div>
  );

  export default TypingIndicator
  