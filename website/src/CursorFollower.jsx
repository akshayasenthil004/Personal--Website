import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const TRAIL_COUNT = 4;
const HOVER_CONTEXT = [
  { selector: '.railway-card', label: 'VIEW', accent: '#38bdf8' },
  { selector: '.send, .btn', label: '', accent: '#a78bfa' },
  { selector: 'input, textarea', label: 'TYPE', accent: '#f472b6' },
  { selector: 'a', label: '', accent: '#a78bfa' },
  { selector: '.dock-item', label: '', accent: '#38bdf8' },
];

export default function CursorFollower() {
  const cursorRef = useRef(null);
  const dotRef = useRef(null);
  const labelRef = useRef(null);
  const trailRefs = useRef([]);

  useEffect(() => {
    const cursor = cursorRef.current;
    const dot = dotRef.current;
    const label = labelRef.current;
    if (!cursor || !dot) return;

    const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const pos = { x: mouse.x, y: mouse.y };
    const trailPos = Array.from({ length: TRAIL_COUNT }, () => ({ x: mouse.x, y: mouse.y }));

    const setCursorX = gsap.quickSetter(cursor, 'x', 'px');
    const setCursorY = gsap.quickSetter(cursor, 'y', 'px');
    const setDotX = gsap.quickSetter(dot, 'x', 'px');
    const setDotY = gsap.quickSetter(dot, 'y', 'px');
    const trailSetters = trailRefs.current.map((el) => ({
      x: gsap.quickSetter(el, 'x', 'px'),
      y: gsap.quickSetter(el, 'y', 'px'),
    }));

    const onMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      setDotX(mouse.x);
      setDotY(mouse.y);
    };
    window.addEventListener('mousemove', onMouseMove);

    const tick = () => {
      const dt = 1.0 - Math.pow(1.0 - 0.25, gsap.ticker.deltaRatio());
      pos.x += (mouse.x - pos.x) * dt;
      pos.y += (mouse.y - pos.y) * dt;
      setCursorX(pos.x);
      setCursorY(pos.y);

      // Each trail dot chases the one before it, creating a comet tail
      let leaderX = pos.x;
      let leaderY = pos.y;
      trailPos.forEach((p, i) => {
        const lag = 0.16 - i * 0.02;
        p.x += (leaderX - p.x) * Math.max(lag, 0.06);
        p.y += (leaderY - p.y) * Math.max(lag, 0.06);
        trailSetters[i]?.x(p.x);
        trailSetters[i]?.y(p.y);
        leaderX = p.x;
        leaderY = p.y;
      });
    };
    gsap.ticker.add(tick);

    const onEnterHover = (accent, text) => () => {
      gsap.to(cursor, {
        scale: text ? 1.9 : 1.5,
        backgroundColor: `${accent}1a`,
        borderColor: accent,
        duration: 0.35,
        ease: 'power2.out',
      });
      gsap.to(dot, { scale: 0, duration: 0.2 });
      if (label) {
        label.textContent = text;
        gsap.to(label, { opacity: text ? 1 : 0, duration: 0.25 });
      }
      gsap.to(trailRefs.current, { opacity: 0, duration: 0.2 });
    };

    const onLeaveHover = () => {
      gsap.to(cursor, {
        scale: 1,
        backgroundColor: 'transparent',
        borderColor: 'rgba(167, 139, 250, 0.4)',
        duration: 0.35,
        ease: 'power2.out',
      });
      gsap.to(dot, { scale: 1, duration: 0.2 });
      if (label) gsap.to(label, { opacity: 0, duration: 0.15 });
      gsap.to(trailRefs.current, { opacity: 1, duration: 0.3 });
    };

    const cleanupFns = [];
    const setupInteractions = () => {
      HOVER_CONTEXT.forEach(({ selector, label: text, accent }) => {
        document.querySelectorAll(selector).forEach((el) => {
          const enter = onEnterHover(accent, text);
          el.addEventListener('mouseenter', enter);
          el.addEventListener('mouseleave', onLeaveHover);
          cleanupFns.push(() => {
            el.removeEventListener('mouseenter', enter);
            el.removeEventListener('mouseleave', onLeaveHover);
          });
        });
      });
    };
    const timer = setTimeout(setupInteractions, 1000);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      gsap.ticker.remove(tick);
      clearTimeout(timer);
      cleanupFns.forEach((fn) => fn());
    };
  }, []);

  return (
    <>
      {/* comet trail — furthest first so the lead dot renders on top */}
      {Array.from({ length: TRAIL_COUNT }).map((_, i) => (
        <div
          key={i}
          ref={(el) => (trailRefs.current[i] = el)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: `${4 - i * 0.6}px`,
            height: `${4 - i * 0.6}px`,
            marginLeft: `${-(4 - i * 0.6) / 2}px`,
            marginTop: `${-(4 - i * 0.6) / 2}px`,
            borderRadius: '50%',
            background: i % 2 === 0 ? '#38bdf8' : '#a78bfa',
            opacity: 0.35 - i * 0.06,
            pointerEvents: 'none',
            zIndex: 99997,
            willChange: 'transform',
            filter: 'blur(0.5px)',
          }}
        />
      ))}

      <div
        ref={dotRef}
        style={{
          position: 'fixed',
          top: 0, left: 0,
          width: '6px', height: '6px',
          marginLeft: '-3px', marginTop: '-3px',
          backgroundColor: '#a78bfa',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 99999,
          willChange: 'transform',
          boxShadow: '0 0 8px rgba(167,139,250,0.8)',
        }}
      />
      <div
        ref={cursorRef}
        style={{
          position: 'fixed',
          top: 0, left: 0,
          width: '40px', height: '40px',
          marginLeft: '-20px', marginTop: '-20px',
          border: '1.5px solid rgba(167, 139, 250, 0.4)',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 99998,
          willChange: 'transform, background-color, border-color',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span
          ref={labelRef}
          style={{
            fontFamily: '"PT Mono", monospace',
            fontSize: '9px',
            letterSpacing: '0.08em',
            color: '#fff',
            opacity: 0,
            whiteSpace: 'nowrap',
          }}
        />
      </div>
    </>
  );
}