import { ChangeEvent, useEffect, useState } from 'react';
import styles from './Clock.module.css';

interface ClockProps {
  time: string;
}

export function Timer() {
  const [time, setTime] = useState<string>(new Date().toISOString());

  useEffect(() => {
    const id = setInterval(
      () => setTime(new Date().toISOString()),
      1000,
    );

    return () => clearInterval(id);
  }, []);

  return <Clock time={time} />;
}

export function Clock({ time }: ClockProps) {
  const [text, setText] = useState('');

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setText(e.target.value);
  }

  return (
    <section className={styles.clock}>
      <h1 className={styles.clock__timer}>{time}</h1>
      <input
        className={styles.clock__input}
        type="text"
        value={text}
        onChange={handleChange}
      />
    </section>
  );
}
