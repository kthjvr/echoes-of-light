import { useState, } from "react";
import BoardOne from "./components/BoardOne";
import BoardTwo from "./components/BoardTwo";
import BoardThree from "./components/BoardThree";
import { FinalScore } from "./components/FinalScore";


function App() {
  const [currentBoard, setCurrentBoard] = useState(1);


  const handleBoardComplete = (nextBoard: number) => {
    setCurrentBoard(nextBoard);
  };

  const handleRestart = () => {
    setCurrentBoard(1); // Reset to the first board
  };

  return (
  <div className="px-4 py-6 text-white z-10">
      {currentBoard === 1 && (
        <BoardOne onComplete={() => handleBoardComplete(2)} />
      )}
      {currentBoard === 2 && (
        <BoardTwo onComplete={() => handleBoardComplete(3)} />
      )}
      {currentBoard === 3 && (
        <BoardThree onComplete={() => handleBoardComplete(4)} />
      )}
      {currentBoard === 4 && <FinalScore />}

      <div className="flex justify-center">
        <button
          className="hover:bg-green-500 bg-green-400 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
          onClick={handleRestart}>
          New Game
        </button>
      </div>
  </div>
    
  );
}

export default App;
