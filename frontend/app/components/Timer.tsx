'use client';
import { useState, useEffect } from 'react';

function Timer({
  timeDone,
  setTimeDone,
}: {
  timeDone: boolean;
  setTimeDone: (value: boolean) => void;
}) {
  const [time, setTime] = useState((1) * 60); // 30 minutes in seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setTime((prev) => Math.max(prev - 1, 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);


    useEffect(() => {   
    if (time === 0) {
        setTimeDone(true);
    }
    }, [time, setTimeDone]);

  const minutes = Math.floor(time / 60);
  const seconds = time % 60;

  return (
    <div className="flex justify-start w-full mb-4">
      <p className="text-sm text-gray-400 flex items-center gap-2 w-1/2 justify-between">
        الوقت المتبقي:{' '}
        <span className="text-2xl text-white">{`${minutes}:${seconds.toString().padStart(2, '0')}`}</span>
      </p>
    </div>
  );
}

export default Timer;
