import { useEffect, useState } from "react";

export function useTimer(initialSeconds = 90 * 60) {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);

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
  }, []); // Runs once on mount

  const minutes = Math.floor(secondsLeft / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (secondsLeft % 60).toString().padStart(2, "0");

  return { time: `${minutes}:${seconds}`, expired: secondsLeft === 0 };
}
