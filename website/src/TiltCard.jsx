import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';

export default function TiltCard({ children, className = '' }) {
  const cardRef = useRef(null);
  const glareRef = useRef(null);

  useEffect(() => {
    const card = cardRef.current;
    const glare = glareRef.current;
    if (!card || !glare) return;

    const onMouseMove = (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const px = x / rect.width;
      const py = y / rect.height;

      // Max rotation angles
      const rotateX = (py - 0.5) * -15; 
      const rotateY = (px - 0.5) * 15;

      gsap.to(card, {
        rotateX,
        rotateY,
        transformPerspective: 1000,
        ease: 'power2.out',
        duration: 0.5
      });

      // Move glare
      gsap.to(glare, {
        x: px * 100,
        y: py * 100,
        opacity: 1,
        ease: 'power2.out',
        duration: 0.5
      });
    };

    const onMouseLeave = () => {
      gsap.to(card, {
        rotateX: 0,
        rotateY: 0,
        ease: 'power3.out',
        duration: 0.8
      });
      gsap.to(glare, {
        opacity: 0,
        ease: 'power3.out',
        duration: 0.8
      });
    };

    card.addEventListener('mousemove', onMouseMove);
    card.addEventListener('mouseleave', onMouseLeave);

    return () => {
      card.removeEventListener('mousemove', onMouseMove);
      card.removeEventListener('mouseleave', onMouseLeave);
    };
  }, []);

  return (
    <div 
      className={className} 
      ref={cardRef}
      style={{
        position: 'relative',
        transformStyle: 'preserve-3d',
        willChange: 'transform'
      }}
    >
      <div 
        ref={glareRef}
        style={{
          position: 'absolute',
          top: '-50%', left: '-50%',
          width: '200%', height: '200%',
          background: 'radial-gradient(circle at center, rgba(255,255,255,0.15) 0%, transparent 60%)',
          pointerEvents: 'none',
          opacity: 0,
          zIndex: 2,
          mixBlendMode: 'overlay',
          transform: 'translateZ(1px)' // Keeps glare above card contents
        }}
      />
      {children}
    </div>
  );
}