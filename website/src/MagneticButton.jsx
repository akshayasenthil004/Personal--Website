import { useRef, useCallback } from 'react';
import { gsap } from 'gsap';

export default function MagneticButton({ children, className = '', style = {}, ...rest }) {
  const ref = useRef(null);
  const textRef = useRef(null);

  const onMouseEnter = useCallback(() => {
    gsap.to(ref.current, { scale: 1.05, duration: 0.4, ease: 'power3.out' });
  }, []);

  const onMouseMove = useCallback((e) => {
    const el = ref.current;
    if (!el) return;
    const b = el.getBoundingClientRect();
    
    // Magnetic pull
    const cx = b.left + b.width / 2;
    const cy = b.top + b.height / 2;
    const dx = (e.clientX - cx);
    const dy = (e.clientY - cy);
    
    gsap.to(ref.current, {
      x: dx * 0.2,
      y: dy * 0.2,
      duration: 0.4,
      ease: 'power2.out',
    });

    if (textRef.current) {
        gsap.to(textRef.current, {
            x: dx * 0.1,
            y: dy * 0.1,
            duration: 0.4,
            ease: 'power2.out',
        });
    }

    // Glow position via CSS variables
    const x = e.clientX - b.left;
    const y = e.clientY - b.top;
    el.style.setProperty('--mouse-x', `${x}px`);
    el.style.setProperty('--mouse-y', `${y}px`);
  }, []);

  const onMouseLeave = useCallback(() => {
    gsap.to(ref.current, { x: 0, y: 0, scale: 1, duration: 0.7, ease: 'elastic.out(1, 0.4)' });
    if (textRef.current) {
        gsap.to(textRef.current, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.4)' });
    }
  }, []);

  return (
    <div
      ref={ref}
      className={`premium-magnetic-btn ${className}`}
      style={{ 
        ...style 
      }}
      onMouseEnter={onMouseEnter}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      {...rest}
    >
      <div className="premium-magnetic-btn-content" ref={textRef}>
        {children}
      </div>
    </div>
  );
}