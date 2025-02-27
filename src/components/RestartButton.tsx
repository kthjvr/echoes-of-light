import React from "react";

interface RestartButtonProps {
  onRestart: () => void;
  disabled?: boolean; 
}

const RestartButton: React.FC<RestartButtonProps> = ({ onRestart, disabled }) => {
  return (
    <div className="flex justify-end mt-4 ">
      <button
        className="hover:bg-blue-400 bg-blue-300 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
        onClick={onRestart}
        disabled={disabled}
      >
        Restart Board
      </button>
    </div>
  );
};

export default RestartButton;
