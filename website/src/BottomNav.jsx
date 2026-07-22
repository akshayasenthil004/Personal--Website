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
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const AboutIcon = (props) => (
  <svg {...iconProps} {...props}>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21a8 8 0 0 1 16 0" />
  </svg>
);

const ExploreIcon = (props) => (
  <svg {...iconProps} {...props}>
    <circle cx="12" cy="12" r="10" />
    <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
  </svg>
);

const SkillsIcon = (props) => (
  <svg {...iconProps} {...props}>
    <polyline points="16 18 22 12 16 6" />
    <polyline points="8 6 2 12 8 18" />
  </svg>
);

const ProjectsIcon = (props) => (
  <svg {...iconProps} {...props}>
    <path d="M2 17l10 5 10-5" />
    <path d="M2 12l10 5 10-5" />
    <path d="M12 2L2 7l10 5 10-5L12 2z" />
  </svg>
);

const ContactIcon = (props) => (
  <svg {...iconProps} {...props}>
    <path d="M22 13V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-1.5" />
    <polyline points="22 6 12 13 2 6" />
  </svg>
);

const NAV_ITEMS = [
  { id: 'home',     icon: HomeIcon,     label: 'Home'     },
  { id: 'about',    icon: AboutIcon,    label: 'About'    },
  { id: 'explore',  icon: ExploreIcon,  label: 'Explore'  },
  { id: 'skills',   icon: SkillsIcon,   label: 'Skills'   },
  { id: 'projects', icon: ProjectsIcon, label: 'Projects' },
  { id: 'contact',  icon: ContactIcon,  label: 'Contact'  },
];

export default function BottomNav() {
  const [active, setActive] = useState('home');
  const itemRefs = useRef({});
  const [pillStyle, setPillStyle] = useState(null);

  const measure = useCallback((id) => {
    const el = itemRefs.current[id];
    if (el) {
      setPillStyle({
        left: el.offsetLeft,
        width: el.offsetWidth,
      });
    }
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
      { threshold: 0.3 }
    );
    sections.forEach((s) => observer.observe(s));
    return () => sections.forEach((s) => observer.unobserve(s));
  }, []);

  // Measure active position for pill animation
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
      <nav className="dock-bar" aria-label="Primary Navigation">
        <span className="dock-brand" aria-hidden="true">AS</span>

        {/* Sliding active pill indicator */}
        {pillStyle && (
          <div
            className="dock-active-pill"
            style={{
              left: `${pillStyle.left}px`,
              width: `${pillStyle.width}px`,
            }}
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
            <span className="dock-item__text">{label}</span>
            <span className="dock-item__label">{label}</span>
          </a>
        ))}
      </nav>
    </div>
  );
}
