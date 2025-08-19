import React from 'react';

interface ChooseOptionsProps {
  options: any[];
  onChoose: (option: any) => void;
  isLoading: boolean;
}

const ChooseOptions: React.FC<ChooseOptionsProps> = ({ options, onChoose, isLoading }) => {
  return (
    <div className="p-4 bg-gray-700/50 rounded-xl transition-all duration-300">
      <p className="text-center text-gray-300 mb-3 font-medium">The AI wants you to Choose one:</p>
      <div className="flex justify-center flex-wrap gap-3">
        {options.map((option, index) => (
          <button
            key={option}
            onClick={() => onChoose(index +1)}
            disabled={isLoading}
            className="px-6 py-2 bg-purple-600 text-white font-semibold rounded-full shadow-md transition-all transform hover:scale-105 hover:bg-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-75 disabled:bg-gray-500 disabled:cursor-not-allowed"
          >
            {JSON.stringify( option)}
          </button>
        ))}
      </div>
    </div>
  );
}

export default ChooseOptions;