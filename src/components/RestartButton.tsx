import React from "react";

interface RestartButtonProps {
  onRestart: () => void; // Function to call when the button is clicked
}

const RestartButton: React.FC<RestartButtonProps> = ({ onRestart }) => {
  return (
    <div className="flex justify-center mt-4">
      <button
        className="hover:bg-blue-700 bg-blue-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        onClick={onRestart}
      >
        Restart Game
      </button>
    </div>
  );
};

export default RestartButton;
