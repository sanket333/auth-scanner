import { useState, useEffect } from "react";

const CountdownTimer = () => {
  const INITIAL_TIME = 10 * 60; // 10 minutes in seconds
  const [timeLeft, setTimeLeft] = useState(INITIAL_TIME);
  const [key, setKey] = useState(0); // Used to force re-render

  useEffect(() => {
    if (timeLeft <= 0) return; // Stop the timer when it reaches 0

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timer); // Cleanup on component unmount
  }, [timeLeft]);

  // Convert seconds to MM:SS format
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
  };

  const handleReset = () => {
    setKey((prevKey) => prevKey + 1); // Force re-render by incrementing key
    setTimeLeft(INITIAL_TIME); // Reset the timer
  };

  return (
    <div key={key}>
      <p>Expires in {formatTime(timeLeft)}</p>
      <button onClick={handleReset}>Refresh Timer</button>
    </div>
  );
};

export default CountdownTimer;
