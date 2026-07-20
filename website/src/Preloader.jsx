import { useEffect, useRef, useState } from 'react';
import './App.css';

export default function Preloader({ onComplete }) {
  const [phase, setPhase] = useState('enter'); // enter → hold → exit
  const barRef = useRef(null);

  useEffect(() => {
    // Animate progress bar
    let start = null;
    const duration = 1400;
    const raf = (ts) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      if (barRef.current) {
        barRef.current.style.width = `${progress * 100}%`;
      }
      if (progress < 1) requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);

    const holdTimer = setTimeout(() => setPhase('exit'), 1500);
    const doneTimer = setTimeout(() => onComplete && onComplete(), 2100);
    return () => {
      clearTimeout(holdTimer);
      clearTimeout(doneTimer);
    };
  }, [onComplete]);

  return (
    <div className={`preloader ${phase === 'exit' ? 'preloader--exit' : ''}`}>
      <div className="preloader__bg" />

      {/* Animated logo mark */}
      <div className="preloader__center">
        <div className="preloader__ring preloader__ring--outer" />
        <div className="preloader__ring preloader__ring--inner" />
        <div className="preloader__glyph">
          <span>&lt;</span>
          <span className="preloader__slash">/</span>
          <span>&gt;</span>
        </div>
      </div>

      <div className="preloader__name">
        {'Akshaya'.split('').map((ch, i) => (
          <span key={i} className="preloader__letter" style={{ animationDelay: `${i * 0.06}s` }}>
            {ch}
          </span>
        ))}
      </div>

      <div className="preloader__bar-wrap">
        <div className="preloader__bar" ref={barRef} />
      </div>
    </div>
  );
}