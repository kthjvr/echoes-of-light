import React, { useState, useEffect } from "react";

interface StopwatchProps {
  time: { sec: number; min: number; hr: number };
  isRunning: boolean;
  onReset: () => void;
}

const Stopwatch: React.FC<StopwatchProps> = ({ time, isRunning, onReset }) => {
  const [currentTime, setCurrentTime] = useState(time); // Use state for timer display

  useEffect(() => {
    let interval: number | undefined;
    if (isRunning) {
      interval = setInterval(() => {
        const newTime = { ...currentTime };
        newTime.sec = (newTime.sec + 1) % 60;
        newTime.min += Math.floor((newTime.sec + 1) / 60);
        newTime.hr += Math.floor(newTime.min / 60);
        newTime.min %= 60;
        setCurrentTime(newTime);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, currentTime]);

  useEffect(() => {
    setCurrentTime(time); // Update time when prop changes
  }, [time]);

  return (
    <div>
      <h2>
        {`${currentTime.hr < 10 ? "0" : ""}${currentTime.hr}:${currentTime.min < 10 ? "0" : ""}${currentTime.min}:${currentTime.sec < 10 ? "0" : ""}${currentTime.sec}`}
      </h2>
      <button onClick={onReset}>Reset</button>
    </div>
  );
};

export default Stopwatch;