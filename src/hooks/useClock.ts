import { useEffect, useState } from 'react';

const formatIndiaTime = (): string =>
  `${new Intl.DateTimeFormat('en-IN', {
    timeZone: 'Asia/Kolkata',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  }).format(new Date())} IST`;

export function useClock(): string {
  const [time, setTime] = useState(formatIndiaTime);

  useEffect(() => {
    const interval = window.setInterval(() => setTime(formatIndiaTime()), 1000);
    return () => window.clearInterval(interval);
  }, []);

  return time;
}
