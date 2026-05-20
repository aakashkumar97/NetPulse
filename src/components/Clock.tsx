'use client';

import React, { useState, useEffect } from 'react';

export function Clock() {
  const [time, setTime] = useState<string>('');
  const [date, setDate] = useState<string>('');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit', 
        hour12: false 
      }));
      setDate(now.toLocaleDateString('en-US', {
        weekday: 'short',
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }).toUpperCase());
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!time) return <div className="animate-pulse h-16 w-32 bg-white/5 rounded-lg" />;

  return (
    <div className="text-right">
      <div className="text-4xl font-headline font-bold text-primary neon-text tracking-wider">
        {time}
      </div>
      <div className="text-sm font-medium text-muted-foreground mt-1 tracking-widest">
        {date}
      </div>
    </div>
  );
}