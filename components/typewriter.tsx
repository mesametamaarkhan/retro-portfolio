'use client';

import { useEffect, useRef, useState } from 'react';

interface TypewriterProps {
  text: string;
  className?: string;
  speed?: number;
  startDelay?: number;
  cursor?: boolean;
  onDone?: () => void;
}

export function Typewriter({
  text,
  className = '',
  speed = 45,
  startDelay = 0,
  cursor = true,
  onDone,
}: TypewriterProps) {
  const [out, setOut] = useState('');
  const [done, setDone] = useState(false);
  const idx = useRef(0);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  useEffect(() => {
    setOut('');
    setDone(false);
    idx.current = 0;
    let timer: ReturnType<typeof setTimeout>;
    const interval = setInterval(
      () => {
        idx.current += 1;
        setOut(text.slice(0, idx.current));
        if (idx.current >= text.length) {
          clearInterval(interval);
          setDone(true);
          onDoneRef.current?.();
        }
      },
      speed,
    );
    if (startDelay > 0) {
      clearInterval(interval);
      timer = setTimeout(() => {
        const i2 = setInterval(() => {
          idx.current += 1;
          setOut(text.slice(0, idx.current));
          if (idx.current >= text.length) {
            clearInterval(i2);
            setDone(true);
            onDoneRef.current?.();
          }
        }, speed);
      }, startDelay);
    }
    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [text, speed, startDelay]);

  return (
    <span className={className}>
      {out}
      {cursor && <span className="blink text-crt-accent">_</span>}
      {!cursor && done && null}
    </span>
  );
}
