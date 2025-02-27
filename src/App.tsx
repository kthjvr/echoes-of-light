import { useState, } from "react";
import BoardOne from "./components/BoardOne";
import BoardTwo from "./components/BoardTwo";
import BoardThree from "./components/BoardThree";
// import Stopwatch from "./components/Stopwatch"; 



function App() {
  const [currentBoard, setCurrentBoard] = useState(1);

  const handleBoardComplete = (nextBoard: number) => {
    setCurrentBoard(nextBoard);
  };

  const handleRestart = () => {
    setCurrentBoard(1); // Reset to the first board
  };


  return (
    <div className="z-10">
      {currentBoard === 1 && (
        <BoardOne onComplete={() => handleBoardComplete(2)}/>
      )}
      {currentBoard === 2 && (
        <BoardTwo onComplete={() => handleBoardComplete(3)} />
      )}
      {currentBoard === 3 && <BoardThree />}

      <div className="flex justify-end mt-4">
        <button
          className="hover:bg-red-500 bg-red-400 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
          onClick={handleRestart}>
          Restart Game
        </button>
      </div>

      {/* <Stopwatch time={time} isRunning={gameStarted} onReset={() => setTime({ sec: 0, min: 0, hr: 0 })} /> */}

    </div>
  );
}

export default App;
