// src/hooks/useTimer.js
import { useEffect, useState } from "react";

export function useTimer(startingMinutes = 90) {
  const [secondsLeft, setSecondsLeft] = useState(startingMinutes * 60);

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const minutes = Math.floor(secondsLeft / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (secondsLeft % 60).toString().padStart(2, "0");

  return { time: `${minutes}:${seconds}`, expired: secondsLeft === 0 };
}
