import { useState, useLayoutEffect, useEffect, useRef, useCallback } from 'react';

const iconProps = {
  width: 18,
  height: 18,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};

const HomeIcon = (props) => (
  <svg {...iconProps} {...props}>
    <path d="m3 11 9-8 9 8" />
    <path d="M5 10v10h14V10" />
    <path d="M9 20v-6h6v6" />
  </svg>
);

const ProjectsIcon = (props) => (
  <svg {...iconProps} {...props}>
    <path d="M4 7h7v7H4z" />
    <path d="M13 10h7v7h-7z" />
    <path d="M11 10h2" />
    <path d="M7.5 14v3a2 2 0 0 0 2 2H13" />
  </svg>
);

const UserIcon = (props) => (
  <svg {...iconProps} {...props}>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21a8 8 0 0 1 16 0" />
  </svg>
);

const EnvelopeIcon = (props) => (
  <svg {...iconProps} {...props}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m3 7 9 6 9-6" />
  </svg>
);

const NAV_ITEMS = [
  { id: 'home',     icon: HomeIcon,     label: 'Home'     },
  { id: 'projects', icon: ProjectsIcon, label: 'Projects' },
  { id: 'about',    icon: UserIcon,     label: 'About'    },
  { id: 'contact',  icon: EnvelopeIcon, label: 'Contact'  },
];

export default function BottomNav() {
  const [active, setActive] = useState('home');
  const itemRefs = useRef({});
  const [dot, setDot] = useState(null); // null until first measurement, avoids a mispositioned flash

  const measure = useCallback((id) => {
    const el = itemRefs.current[id];
    if (el) setDot({ center: el.offsetLeft + el.offsetWidth / 2 });
  }, []);

  // Scroll-driven active section
  useEffect(() => {
    const sections = NAV_ITEMS.map(({ id }) => document.getElementById(id)).filter(Boolean);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { threshold: 0.35 }
    );
    sections.forEach((s) => observer.observe(s));
    return () => sections.forEach((s) => observer.unobserve(s));
  }, []);

  // Measure before paint so the dot never flashes at the wrong spot
  useLayoutEffect(() => {
    measure(active);
  }, [active, measure]);

  useEffect(() => {
    const onResize = () => measure(active);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [active, measure]);

  return (
    <div className="dock-wrap">
      <nav className="dock-bar" aria-label="Primary">
        <span className="dock-brand" aria-hidden="true">AS</span>
        {dot && (
          <div
            className="dock-indicator"
            style={{ transform: `translateX(${dot.center}px)` }}
            aria-hidden="true"
          />
        )}
        {NAV_ITEMS.map(({ id, icon: Icon, label }) => (
          <a
            key={id}
            href={`#${id}`}
            ref={(el) => (itemRefs.current[id] = el)}
            className={`dock-item${active === id ? ' dock-item--active' : ''}`}
            aria-current={active === id ? 'page' : undefined}
            onClick={() => setActive(id)}
          >
            <span className="dock-item__icon"><Icon aria-hidden="true" /></span>
            <span className="dock-item__label">{label}</span>
          </a>
        ))}
      </nav>
    </div>
  );
}
