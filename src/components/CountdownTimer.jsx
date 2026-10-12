import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

export default function CountdownTimer({ endTime, onExpire }) {
  const [timeLeft, setTimeLeft] = useState('--:--');
  const [isUrgent, setIsUrgent] = useState(false);

  useEffect(() => {
    if (!endTime) return;

    const tick = () => {
      const now = new Date().getTime();
      const target = new Date(endTime).getTime();
      const diff = target - now;

      if (diff <= 0) {
        setTimeLeft('00:00');
        setIsUrgent(true);
        if (onExpire) onExpire();
      } else {
        const mins = Math.floor(diff / (1000 * 60));
        const secs = Math.floor((diff % (1000 * 60)) / 1000);
        setIsUrgent(mins < 3);
        setTimeLeft(`${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`);
      }
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [endTime, onExpire]);

  return (
    <div
      className={`flex items-center gap-1.5 px-3 py-1 rounded-md border font-mono text-xs font-semibold shadow-xs transition ${
        isUrgent
          ? 'bg-status-failBg border-status-fail/30 text-status-fail animate-pulse'
          : 'bg-white border-border-subtle text-content-primary'
      }`}
    >
      <Clock className="w-3.5 h-3.5" />
      <span>{timeLeft}</span>
    </div>
  );
}