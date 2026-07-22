import React, { useEffect, useRef, useState, useCallback, useLayoutEffect } from 'react';
import './App.css';
import BottomNav from './BottomNav';
import img from './pic.png';
import photoBgRef from './assets/photo_bg_reference.png';
// import pic from './assests/craftp.jpg';
// import file from './assests/eternal.png';
import Preloader from './Preloader';
import CursorFollower from './CursorFollower';
import MagneticButton from './MagneticButton';
import TiltCard from './TiltCard';
import ProjectBentoGrid from './ProjectBentoGrid';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from '@studio-freight/lenis';
import SplitType from 'split-type';

gsap.registerPlugin(ScrollTrigger);

/* ─── Particles – stable random values ──────────────────────────── */
const PARTICLE_DATA = Array.from({ length: 40 }, (_, i) => ({
  id: i,
  left: `${(i * 2.5 + 7) % 100}%`,
  delay: `${(i * 0.27) % 10}s`,
}));

/* ─── Floating code symbols – reinforces the terminal signature ─── */
const SYMBOLS = ['{ }', '< >', ';', '( )', '=>', '#', '/>', '&&'];
const SYMBOL_DATA = Array.from({ length: 16 }, (_, i) => ({
  id: i,
  left: `${(i * 6.3 + 4) % 100}%`,
  size: `${12 + (i % 4) * 4}px`,
  duration: `${18 + (i % 5) * 4}s`,
  delay: `${(i * 0.9) % 14}s`,
  symbol: SYMBOLS[i % SYMBOLS.length],
}));

/* ─── Projects – data-driven so tags/tech stay in sync with the cards ─── */
const PROJECTS = [
  {
    id: 'mental-health',
    filename: 'mental-health.tsx',
    title: 'Mental Health Management',
    image: 'https://images.indianexpress.com/2022/02/mental-health_1200_gettyimages.jpg',
    description:
      'Developed a full stack web application using React.js, Node.js, Express.js, and MongoDB to manage mental health services. Implemented secure user authentication and authorization, role-based access for users, admins, and counsellors, and an appointment booking and management system.',
    summary: 'Role-based healthcare portal with appointment booking & secure auth.',
    year: '2025',
    category: 'Full Stack',
    tags: ['React', 'Node.js', 'Express', 'MongoDB'],
    live: 'https://mental-health-jn7c.vercel.app/',
    code: 'https://github.com/AkshayaSenthil08/Mental-Health',
  },
  {
    id: 'railway',
    filename: 'railway-booking.js',
    title: 'Railway Ticket Booking',
    image: 'https://images.pexels.com/photos/1548693/pexels-photo-1548693.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
    description:
      'A JavaScript web application that enables users to search trains, select seats, make bookings and view PNR status via client-side logic. Managed client-side state (localStorage) for booking history, implemented form validation, error handling and loading states for improved UX.',
    summary: 'Interactive train reservation system & PNR lookup.',
    year: '2024',
    category: 'Web App',
    tags: ['JavaScript', 'HTML', 'CSS', 'LocalStorage'],
    live: 'https://railway-reservation-nu.vercel.app/',
    code: 'https://github.com/AkshayaSenthil08/RailwayReservation',
  },
  {
    id: 'converter',
    filename: 'currency-converter.js',
    title: 'Currency Converter',
    image: 'https://media.istockphoto.com/id/483424683/photo/euro-and-dollar-symbol-eur-usd-pair.jpg?s=612x612&w=0&k=20&c=sxpJ59whk1IQbv2O22UE0zYEmZ9zZA76-iJBsrsAa_I=',
    description:
      'A responsive React web app that converts real-time currency values using exchange rate APIs with dynamic input validation and modern UI. Built a Currency Converter App in React that fetches live exchange rates from a public API (like Exchange Rate API or Free CurrencyAPI).',
    summary: 'Real-time FX rates converter with clean input validation.',
    year: '2024',
    category: 'React App',
    tags: ['React', 'JavaScript', 'API'],
    live: 'https://converter-three-mu.vercel.app/',
    code: 'https://github.com/AkshayaSenthil08/Converter',
  },
  {
    id: 'crud',
    filename: 'crud-app.tsx',
    title: 'Basic CRUD',
    image: 'https://www.shutterstock.com/image-illustration/crud-acronym-create-read-update-600nw-2491959959.jpg',
    description:
      'Full stack web application with complete CRUD functionality, secure authentication, authorization, and role-based access control behind a clean, modern UI.',
    summary: 'Full stack task management system with auth & RBAC.',
    year: '2025',
    category: 'Full Stack',
    tags: ['React', 'Node.js', 'Express', 'MongoDB'],
    live: 'https://task-amber-zeta.vercel.app/',
    code: 'https://github.com/AkshayaSenthil08/task',
  },
  {
    id: 'crafto',
    filename: 'crafto.html',
    title: 'Crafto Project',
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=80',
    description:
      'A responsive jewellery e-commerce website showcasing modern UI design, product listings, and a user-friendly layout.',
    summary: 'Luxury jewellery e-commerce showcase & dynamic layout.',
    year: '2024',
    category: 'UI/UX',
    tags: ['HTML', 'CSS'],
    live: 'https://luxury-project.vercel.app/',
    code: 'https://github.com/AkshayaSenthil08/LuxuryProject',
  },
  {
    id: 'eternal',
    filename: 'eternal.html',
    title: 'Eternal Project',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
    description:
      'A clean, modern multi-section landing page showcasing services, portfolio items, and team information with a fully responsive layout.',
    summary: 'Multi-section corporate agency landing page.',
    year: '2024',
    category: 'Landing Page',
    tags: ['HTML', 'CSS'],
    live: 'https://eternal-project.vercel.app/',
    code: 'https://github.com/AkshayaSenthil08/EternalProject',
  },
];

function App() {
  const [loading, setLoading] = useState(true);

  /* refs for GSAP targets */
  const heroRef = useRef(null);
  const heroAvatarRef = useRef(null);
  const heroTextRef = useRef(null);
  const aboutRef = useRef(null);
  const skillsRef = useRef(null);
  const projectsRef = useRef(null);
  const contactRef = useRef(null);
  const scrollIndicatorRef = useRef(null);
  const parallaxBgRef = useRef(null);

  /* Mouse parallax state for hero */
  const mouseRef = useRef({ x: 0, y: 0 });

  const handlePreloaderDone = useCallback(() => setLoading(false), []);

  /* Smooth Scroll Setup (Lenis) */
  useLayoutEffect(() => {
    if (loading) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove(lenis.raf);
    };
  }, [loading]);

  /* Hero mouse parallax */
  useEffect(() => {
    if (loading) return;
    const hero = heroRef.current;
    if (!hero) return;

    const onMove = (e) => {
      const { innerWidth: w, innerHeight: h } = window;
      mouseRef.current = {
        x: (e.clientX / w - 0.5) * 2,
        y: (e.clientY / h - 0.5) * 2,
      };

      // Floating terminal panel — subtle 3D tilt
      if (heroAvatarRef.current) {
        gsap.to(heroAvatarRef.current, {
          x: mouseRef.current.x * 18,
          y: mouseRef.current.y * 14,
          rotationY: mouseRef.current.x * 8,
          rotationX: -mouseRef.current.y * 8,
          duration: 1,
          ease: 'power3.out',
        });
      }

      // Counter-movement for text
      if (heroTextRef.current) {
        gsap.to(heroTextRef.current, {
          x: mouseRef.current.x * -10,
          y: mouseRef.current.y * -6,
          duration: 1.2,
          ease: 'power3.out',
        });
      }
    };

    hero.addEventListener('mousemove', onMove);
    return () => hero.removeEventListener('mousemove', onMove);
  }, [loading]);

  /* GSAP scroll animations & Text Splitting */
  useEffect(() => {
    if (loading) return;

    /* ── Hero entrance ── */
    const heroTl = gsap.timeline({ delay: 0.2 });

    const heroTitle = heroTextRef.current.querySelector('.hero-title');
    const splitTitle = new SplitType(heroTitle, { types: 'words, chars' });

    heroTl
      .fromTo(
        heroAvatarRef.current,
        { opacity: 0, scale: 0.94, y: 40, rotateX: 8 },
        { opacity: 1, scale: 1, y: 0, rotateX: 0, duration: 1.2, ease: 'back.out(1.4)' }
      )
      .fromTo(
        splitTitle.chars,
        { opacity: 0, y: 40, rotateX: -90 },
        { opacity: 1, y: 0, rotateX: 0, stagger: 0.02, duration: 0.8, ease: 'power3.out' },
        '-=0.8'
      )
      .fromTo(
        heroTextRef.current.querySelectorAll('.hero-eyebrow, p, .role-container, .buttons'),
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, stagger: 0.1, duration: 0.8, ease: 'power3.out' },
        '-=0.4'
      );

    /* ── Scroll indicator fade out ── */
    ScrollTrigger.create({
      start: 'top -80px',
      onEnter: () => gsap.to(scrollIndicatorRef.current, { opacity: 0, y: -20, duration: 0.4 }),
      onLeaveBack: () => gsap.to(scrollIndicatorRef.current, { opacity: 1, y: 0, duration: 0.4 }),
    });

    /* ── About Section ── */
    const aboutTitle = aboutRef.current.querySelector('h2');
    const splitAboutTitle = new SplitType(aboutTitle, { types: 'chars' });

    gsap.fromTo(
      splitAboutTitle.chars,
      { opacity: 0, y: 20 },
      {
        opacity: 1, y: 0, stagger: 0.03, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: aboutRef.current, start: 'top 75%' },
      }
    );

    gsap.fromTo(
      aboutRef.current.querySelectorAll('.about-text p'),
      { opacity: 0, y: 30, clipPath: 'inset(100% 0 0 0)' },
      {
        opacity: 1, y: 0, clipPath: 'inset(0% 0 0 0)', stagger: 0.15, duration: 1, ease: 'power4.out',
        scrollTrigger: { trigger: aboutRef.current, start: 'top 70%' },
      }
    );

    gsap.fromTo(
      aboutRef.current.querySelectorAll('.about-illustration.card, .about-stack.card'),
      { opacity: 0, y: 40, scale: 0.96 },
      {
        opacity: 1, y: 0, scale: 1, stagger: 0.15, duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: aboutRef.current, start: 'top 70%' },
      }
    );

    gsap.fromTo(
      aboutRef.current.querySelector('.about-illustration img'),
      { y: 30, scale: 1.08 },
      {
        y: -30, scale: 1, ease: 'none',
        scrollTrigger: { trigger: aboutRef.current, start: 'top bottom', end: 'bottom top', scrub: 1 },
      }
    );

    /* ── Skills ── */
    gsap.fromTo(
      skillsRef.current.querySelectorAll('.skill-card'),
      { opacity: 0, y: 30 },
      {
        opacity: 1, y: 0, stagger: 0.06, duration: 0.7, ease: 'power3.out',
        scrollTrigger: { trigger: skillsRef.current, start: 'top 80%' },
      }
    );

    /* ── Projects Section ── */
    const projectTitle = projectsRef.current.querySelector('h2');
    const splitProjectTitle = new SplitType(projectTitle, { types: 'chars' });
    gsap.fromTo(
      splitProjectTitle.chars,
      { opacity: 0, y: 30, scale: 0.8 },
      {
        opacity: 1, y: 0, scale: 1, stagger: 0.05, duration: 0.8, ease: 'back.out(1.5)',
        scrollTrigger: { trigger: projectsRef.current, start: 'top 80%' },
      }
    );

    const coverflowStage = projectsRef.current.querySelector('.coverflow-stage');
    if (coverflowStage) {
      gsap.fromTo(
        coverflowStage,
        { opacity: 0, y: 80, scale: 0.9 },
        {
          opacity: 1, y: 0, scale: 1, duration: 1.2, ease: 'power3.out',
          scrollTrigger: { trigger: projectsRef.current, start: 'top 75%' },
        }
      );
    }

    /* ── Contact Section ── */
    gsap.fromTo(
      contactRef.current.querySelector('.contact-form'),
      { opacity: 0, x: -60, rotateY: -10 },
      {
        opacity: 1, x: 0, rotateY: 0, duration: 1.2, ease: 'power3.out',
        scrollTrigger: { trigger: contactRef.current, start: 'top 75%' },
      }
    );

    gsap.fromTo(
      contactRef.current.querySelectorAll('.nebula-input'),
      { opacity: 0, x: -30 },
      {
        opacity: 1, x: 0, stagger: 0.1, duration: 0.8, ease: 'power2.out',
        scrollTrigger: { trigger: contactRef.current, start: 'top 70%' },
      }
    );

    gsap.fromTo(
      contactRef.current.querySelector('.contact-info'),
      { opacity: 0, x: 60, rotateY: 10 },
      {
        opacity: 1, x: 0, rotateY: 0, duration: 1.2, ease: 'power3.out',
        scrollTrigger: { trigger: contactRef.current, start: 'top 75%' },
      }
    );

    /* ── Global Background Parallax ── */
    gsap.to(parallaxBgRef.current, {
      yPercent: -20,
      rotate: 5,
      ease: 'none',
      scrollTrigger: { trigger: 'body', start: 'top top', end: 'bottom bottom', scrub: 1 },
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
      splitTitle.revert();
      splitAboutTitle.revert();
      splitProjectTitle.revert();
    };
  }, [loading]);

  if (loading) return <Preloader onComplete={handlePreloaderDone} />;

  return (
    <>
      {/* NOISE OVERLAY */}
      <div className="noise-overlay" />

      {/* CURSOR */}
      <CursorFollower />

      {/* SCROLL INDICATOR */}
      <div className="scroll-indicator" ref={scrollIndicatorRef}>
        <div className="scroll-indicator__mouse">
          <div className="scroll-indicator__wheel" />
        </div>
        <span>Scroll</span>
      </div>

      {/* NAVBAR */}
      <BottomNav />

      {/* AMBIENT BACKGROUND */}
      <div className="bg-grid" aria-hidden="true" />
      <div className="floating-bg" ref={parallaxBgRef} aria-hidden="true">
        <div className="floating-bg__orb floating-bg__orb--1" />
        <div className="floating-bg__orb floating-bg__orb--2" />
        <div className="floating-bg__orb floating-bg__orb--3" />
      </div>

      {/* PARTICLES */}
      <div className="particles">
        {PARTICLE_DATA.map(({ id, left, delay }) => (
          <span key={id} style={{ left, animationDelay: delay }} />
        ))}
      </div>

      {/* FLOATING CODE SYMBOLS */}
      <div className="code-symbols" aria-hidden="true">
        {SYMBOL_DATA.map(({ id, left, size, duration, delay, symbol }) => (
          <span
            key={id}
            style={{ left, fontSize: size, animationDuration: duration, animationDelay: delay }}
          >
            {symbol}
          </span>
        ))}
      </div>

      {/* ══════════════════ HERO ══════════════════ */}
      <section id="home" className="hero" ref={heroRef}>
        <div className="hero-content">

          {/* Text */}
          <div className="hero-contents" ref={heroTextRef}>
            <div className="prompt hero-eyebrow">whoami<span className="caret" /></div>

            <h1 className="hero-title">
              Hi, I'm <span className="word">Akshaya Senthilkumar</span>
            </h1>

            <div className="role-container">
              <span className="bracket">&lt;</span>
              <div className="role-wrapper">
                <ul className="role-list">
                  <li>Full Stack Developer</li>
                  <li>IT Graduate</li>
                  <li>React & Node Engineer</li>
                </ul>
              </div>
              <span className="bracket">/&gt;</span>
            </div>

            <p>IT Graduate with a passion for problem solving. Full Stack Developer with practical experience in both frontend and backend development.</p>

            <div className="buttons">
              <MagneticButton>
                <a href="#contact" className="btn primary">
                  Contact Me
                  <span className="btn-shine" />
                </a>
              </MagneticButton>

              <MagneticButton>
                <a href="#projects" className="btn secondary">
                  View Projects
                  <span className="btn-shine" />
                </a>
              </MagneticButton>

              <MagneticButton>
                {/* <a
                  href={process.env.PUBLIC_URL + '/resume.pdf'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn resume-btn"
                >
                  <span className="resume-icon">↗</span> View Resume
                </a> */}
              </MagneticButton>
            </div>
          </div>

          {/* Terminal panel — signature element, replaces the old avatar */}
          <div className="pic" ref={heroAvatarRef} style={{ transformStyle: 'preserve-3d' }}>
            <div className="term">
              <div className="term-bar">
                <span /><span /><span />
                <div className="term-tab">profile.json</div>
              </div>
              <div className="term-body">
                <div><span className="c">{'{'}</span></div>
                <div>&nbsp;&nbsp;<span className="k">"name"</span><span className="c">:</span> <span className="s">"Akshaya S"</span><span className="c">,</span></div>
                <div>&nbsp;&nbsp;<span className="k">"role"</span><span className="c">:</span> <span className="s">"Full Stack Developer"</span><span className="c">,</span></div>
                <div>&nbsp;&nbsp;<span className="k">"specialization"</span><span className="c">:</span> <span className="s">"MERN Stack & REST APIs"</span><span className="c">,</span></div>
                <div>&nbsp;&nbsp;<span className="k">"status"</span><span className="c">:</span> <span className="n">available_for_opportunities</span></div>
                <div><span className="c">{'}'}</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════ ABOUT ══════════════════ */}
     <section id="about" className="about-section" ref={aboutRef}>
        <div className="about-bg-glows">
          <div className="glow-orb orb-1" />
          <div className="glow-orb orb-2" />
        </div>

        <div className="prompt">cd ./about-me<span className="caret" /></div>

        <div className="about-bento">
          {/* Card 1: Main Bio Card (Layered depth with status chips) */}
          <div className="about-card about-main-card">
            <div className="card-tag">~/bio/overview.md</div>
            <h2>Profile Summary</h2>
            <p>
              Full Stack Developer with practical experience in both frontend and backend development. Proficient in React.js, REST APIs, Node.js, Express.js, and MongoDB. Strong understanding of application flow, authentication, and database operations. Capable of delivering responsive, scalable, and maintainable web solutions.
            </p>

            <div className="about-skills-badges">
              <span className="badge">Html</span>
              <span className="badge">Css</span>
              <span className="badge">JavaScript</span>
              <span className="badge">React</span>
              <span className="badge">Node JS</span>
              <span className="badge">Express JS</span>
              <span className="badge">Github</span>
              <span className="badge">WordPress</span>
              <span className="badge">Mongo DB</span>
            </div>
          </div>

          {/* Card 2: Profile Photo Card */}
          <div className="about-card about-profile-card">
            <div className="card-tag">~/assets/avatar.svg</div>
            <div className="exact-photo-container">
              <svg
                viewBox="0 0 518 509"
                className="exact-photo-svg"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <clipPath id="exactStadiumClip">
                    <rect x="85" y="138" width="348" height="356" rx="135" ry="135" />
                  </clipPath>
                </defs>
                <image href={photoBgRef} width="518" height="509" />
                <image
                  href={img}
                  x="85"
                  y="138"
                  width="348"
                  height="356"
                  preserveAspectRatio="xMidYMin slice"
                  clipPath="url(#exactStadiumClip)"
                />
              </svg>
            </div>
          </div>
        </div>
      </section>


      {/* ══════════════════ EXPLORE ME / EDUCATION & EXPERIENCE ══════════════════ */}
      <section id="explore" className="explore-section">
        <div className="explore-container">
          {/* Left Column: Personal Info & Action Badges */}
          <div className="explore-left">
            <div className="prompt">cat ./personal-info<span className="caret" /></div>
            <h2 className="explore-title">Explore Me.</h2>
            <p className="explore-bio">
              Full Stack Developer with practical experience in both frontend and backend development.
              Proficient in React.js, REST APIs, Node.js, Express.js, and MongoDB. Strong understanding of
              application flow, authentication, and database operations. Capable of delivering responsive,
              scalable, and maintainable web solutions.
            </p>

            <div className="explore-meta-list">
              <div className="meta-item">
                <span className="meta-label">Location:</span>
                <span className="meta-value">Coimbatore</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Languages:</span>
                <span className="meta-value">Tamil, English</span>
              </div>
            </div>

            <div className="explore-actions">
              <a href="#projects" className="explore-btn primary">
                VIEW MY WORK
              </a>
              <a href="#contact" className="explore-btn secondary">
                CONTACT ME
              </a>
            </div>
          </div>

          {/* Right Column: Experience & Education Timeline */}
          <div className="explore-right">
            <div className="timeline-header">
              <span className="timeline-badge">EXPERIENCE & EDUCATION</span>
            </div>

            <div className="timeline">
              {/* Item 1: Experience */}
              <div className="timeline-item">
                <div className="timeline-node">
                  <span className="node-dot" />
                </div>
                <div className="timeline-content card">
                  <div className="timeline-header-line">
                    <span className="timeline-type">EXPERIENCE</span>
                    <span className="timeline-date">Mar 2026 – June 2026</span>
                  </div>
                  <h3 className="timeline-role">Junior Web Developer</h3>
                  <div className="timeline-org">Sai Techno Solutions</div>
                  <ul className="timeline-bullets">
                    <li>Developed and maintained responsive UI components using React.js and JavaScript for client-facing web applications.</li>
                    <li>Integrated REST APIs with the frontend to fetch and display dynamic data, handling loading states and error scenarios.</li>
                    <li>Collaborated with the team on bug fixes, code reviews, and improving overall application performance and UX.</li>
                  </ul>
                </div>
              </div>

              {/* Item 2: Education B.Tech */}
              <div className="timeline-item">
                <div className="timeline-node">
                  <span className="node-dot" />
                </div>
                <div className="timeline-content card">
                  <div className="timeline-header-line">
                    <span className="timeline-type">EDUCATION</span>
                    <span className="timeline-date">2021 – 2025</span>
                  </div>
                  <h3 className="timeline-role">B.Tech – Information Technology</h3>
                  <div className="timeline-org">
                    <span>Mahendra Engineering College, Namakkal</span>
                    <span className="timeline-score">83%</span>
                  </div>
                  <p className="timeline-desc">
                    Specialized in IT with a focus on web development, full-stack architecture, software engineering, and database management.
                  </p>
                </div>
              </div>

              {/* Item 3: Education HSC */}
              <div className="timeline-item">
                <div className="timeline-node">
                  <span className="node-dot" />
                </div>
                <div className="timeline-content card">
                  <div className="timeline-header-line">
                    <span className="timeline-type">EDUCATION</span>
                    <span className="timeline-date">2020 – 2021</span>
                  </div>
                  <h3 className="timeline-role">HSC</h3>
                  <div className="timeline-org">
                    <span>Dayananda Vidyalaya Matric Higher Secondary School</span>
                    <span className="timeline-score">91.8%</span>
                  </div>
                </div>
              </div>

              {/* Item 4: Education SSLC */}
              <div className="timeline-item">
                <div className="timeline-node">
                  <span className="node-dot" />
                </div>
                <div className="timeline-content card">
                  <div className="timeline-header-line">
                    <span className="timeline-type">EDUCATION</span>
                    <span className="timeline-date">2018 – 2019</span>
                  </div>
                  <h3 className="timeline-role">SSLC</h3>
                  <div className="timeline-org">
                    <span>Government High School</span>
                    <span className="timeline-score">90.3%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════ SKILLS ══════════════════ */}
      <section id="skills" className="skills-section" ref={skillsRef}>
        <div className="prompt" style={{ justifyContent: 'center' }}>ls ./skills<span className="caret" /></div>
        <h2 className="skills-title">Professional Skillset</h2>

        <div className="skills-container">
          <div className="skills-category">
            <h3 className="category-title">Frontend & CMS</h3>
            <div className="skills-grid">
              <div className="skill-card">
                <img src="https://dev-portfolio-template.netlify.app/static/media/react.2b6a0717.svg" alt="React" />
                <h4>React</h4>
              </div>
              <div className="skill-card">
                <img src="https://dev-portfolio-template.netlify.app/static/media/javascript.e9360603.svg" alt="JavaScript" />
                <h4>JavaScript</h4>
              </div>
              <div className="skill-card">
                <img src="https://dev-portfolio-template.netlify.app/static/media/html.6a342d61.svg" alt="HTML" />
                <h4>HTML</h4>
              </div>
              <div className="skill-card">
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/CSS3_logo.svg/2048px-CSS3_logo.svg.png" alt="CSS" />
                <h4>CSS</h4>
              </div>
              <div className="skill-card">
                <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/wordpress/wordpress-plain.svg" alt="WordPress" />
                <h4>WordPress</h4>
              </div>
            </div>
          </div>

          <div className="skills-category">
            <h3 className="category-title">Backend, Database & Tools</h3>
            <div className="skills-grid">
              <div className="skill-card">
                <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/nodejs/nodejs-original.svg" alt="Node JS" />
                <h4>Node JS</h4>
              </div>
              <div className="skill-card">
                <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/express/express-original.svg" alt="Express JS" className="invert-icon" />
                <h4>Express JS</h4>
              </div>
              <div className="skill-card">
                <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/mongodb/mongodb-original.svg" alt="Mongo DB" />
                <h4>Mongo DB</h4>
              </div>
              <div className="skill-card">
                <img src="https://github.githubassets.com/assets/GitHub-Mark-ea2971cee799.png" alt="Github" />
                <h4>Github</h4>
              </div>
            </div>
          </div>

          <div className="skills-category">
            <h3 className="category-title">AI Tools & Workflows</h3>
            <div className="skills-grid">
              <div className="skill-card">
                <img src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2310a37f'><path d='M22.28 9.82a5.98 5.98 0 0 0-.52-4.91 6.05 6.05 0 0 0-6.51-2.9 6.07 6.07 0 0 0-4.33-1.93 6.04 6.04 0 0 0-5.83 4.14 6 6 0 0 0-4 2.89 6.05 6.05 0 0 0 .74 7.1 5.98 5.98 0 0 0 .51 4.91 6.05 6.05 0 0 0 6.51 2.9 5.98 5.98 0 0 0 4.33 1.93 6.06 6.06 0 0 0 5.77-4.2 5.99 5.99 0 0 0 4-2.9 6.06 6.06 0 0 0-.75-7.07zm-9.02 12.6a4.48 4.48 0 0 1-2.88-1.04l.14-.08 4.78-2.76a.79.79 0 0 0 .39-.68v-6.74l2.02 1.17a.07.07 0 0 1 .04.05v5.58a4.5 4.5 0 0 1-4.49 4.5zm-8.62-3.83a4.48 4.48 0 0 1-.54-3l.14.08 4.78 2.76a.79.79 0 0 0 .79 0l5.83-3.37v2.34a.07.07 0 0 1-.03.06l-4.83 2.79a4.5 4.5 0 0 1-6.14-1.66zm-1.23-9.42a4.48 4.48 0 0 1 2.34-1.96l-.001.16v5.52a.79.79 0 0 0 .39.68l5.83 3.37-2.02 1.17a.07.07 0 0 1-.07 0l-4.83-2.79a4.5 4.5 0 0 1-1.64-6.15zm16.7 3.12l-5.83-3.37 2.02-1.17a.07.07 0 0 1 .07 0l4.83 2.79a4.5 4.5 0 0 1 1.64 6.15 4.48 4.48 0 0 1-2.34 1.96l.001-.16v-5.52a.79.79 0 0 0-.39-.68zm1.65-5.59a4.48 4.48 0 0 1 .53 3l-.14-.08-4.78-2.76a.79.79 0 0 0-.79 0l-5.83 3.37V8.98a.07.07 0 0 1 .03-.06l4.83-2.79a4.5 4.5 0 0 1 6.14 1.66zm-11.46-5.33a4.48 4.48 0 0 1 2.88 1.04l-.14.08-4.78 2.76a.79.79 0 0 0-.39.68v6.74l-2.02-1.17a.07.07 0 0 1-.04-.05V6.44a4.5 4.5 0 0 1 4.49-4.5z'/></svg>" alt="ChatGPT" />
                <h4>ChatGPT</h4>
              </div>
              <div className="skill-card">
                <img src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none'><circle cx='12' cy='12' r='10' fill='url(%23agGlow)'/><path d='M12 4L14.5 9.5L20 12L14.5 14.5L12 20L9.5 14.5L4 12L9.5 9.5L12 4Z' fill='%23ffffff'/><defs><linearGradient id='agGlow' x1='0' y1='0' x2='24' y2='24'><stop offset='0%25' stop-color='%237c3aed'/><stop offset='100%25' stop-color='%2338bdf8'/></linearGradient></defs></svg>" alt="Antigravity" />
                <h4>Antigravity</h4>
              </div>
              <div className="skill-card">
                <img src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23d97706'><path d='M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 3.5a1.5 1.5 0 0 1 1.41 1.01l.9 2.7a1.5 1.5 0 0 0 .95.95l2.7.9a1.5 1.5 0 0 1 0 2.84l-2.7.9a1.5 1.5 0 0 0-.95.95l-.9 2.7a1.5 1.5 0 0 1-2.84 0l-.9-2.7a1.5 1.5 0 0 0-.95-.95l-2.7-.9a1.5 1.5 0 0 1 0-2.84l2.7-.9a1.5 1.5 0 0 0 .95-.95l.9-2.7A1.5 1.5 0 0 1 12 5.5z'/></svg>" alt="Claude" />
                <h4>Claude</h4>
              </div>
              <div className="skill-card">
                <img src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2338bdf8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><rect x='3' y='3' width='18' height='18' rx='4' fill='%23100e18' stroke='%23f472b6'/><path d='m8 10 3 2-3 2'/><path d='m13 14 3 0'/></svg>" alt="OpenCode AI" />
                <h4>OpenCode AI</h4>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════ PROJECTS ══════════════════ */}
      <div id="projects" className="prodark" ref={projectsRef}>
        <div className="prompt">ls ./projects<span className="caret" /></div>
        <h2>Projects</h2>

        <ProjectBentoGrid projects={PROJECTS} />
      </div>

      {/* ══════════════════ CONTACT ══════════════════ */}
      <section className="contact-section" id="contact" ref={contactRef}>
        <div className="contact-wrapper">

          <div className="contact-form">
            <div className="prompt">send --message<span className="caret" /></div>

            {/* NAME */}
            <div className="nebula-input">
              <input type="text" id="name" name="name" className="input" placeholder=" " autoComplete="off" />
              <label htmlFor="name" className="user-label">Name</label>
              <div className="nebula-particle" style={{ '--x': 0.2, '--y': -0.4, '--delay': '0.1s' }} />
              <div className="nebula-particle" style={{ '--x': 0.5, '--y': -0.2, '--delay': '0.3s' }} />
              <div className="nebula-particle" style={{ '--x': 0.3, '--y': 0.3, '--delay': '0.5s' }} />
              <div className="nebula-particle" style={{ '--x': 0.7, '--y': 0.1, '--delay': '0.2s' }} />
              <div className="nebula-particle" style={{ '--x': 0.1, '--y': -0.7, '--delay': '0.4s' }} />
              <div className="nebula-particle" style={{ '--x': 0.6, '--y': 0.4, '--delay': '0.6s' }} />
            </div>

            {/* EMAIL */}
            <div className="nebula-input">
              <input type="email" id="email" name="email" className="input" placeholder=" " autoComplete="off" />
              <label htmlFor="email" className="user-label">Mail ID</label>
              <div className="nebula-particle" style={{ '--x': 0.2, '--y': -0.4, '--delay': '0.1s' }} />
              <div className="nebula-particle" style={{ '--x': 0.5, '--y': -0.2, '--delay': '0.3s' }} />
              <div className="nebula-particle" style={{ '--x': 0.3, '--y': 0.3, '--delay': '0.5s' }} />
              <div className="nebula-particle" style={{ '--x': 0.7, '--y': 0.1, '--delay': '0.2s' }} />
              <div className="nebula-particle" style={{ '--x': 0.1, '--y': -0.7, '--delay': '0.4s' }} />
              <div className="nebula-particle" style={{ '--x': 0.6, '--y': 0.4, '--delay': '0.6s' }} />
            </div>

            {/* MESSAGE */}
            <div className="nebula-input nebula-textarea">
              <textarea id="message" name="message" className="input textarea" placeholder=" " autoComplete="off" rows="4"></textarea>
              <label htmlFor="message" className="user-label">Message</label>
              <div className="nebula-particle" style={{ '--x': 0.2, '--y': -0.4, '--delay': '0.1s' }} />
              <div className="nebula-particle" style={{ '--x': 0.5, '--y': -0.2, '--delay': '0.3s' }} />
              <div className="nebula-particle" style={{ '--x': 0.3, '--y': 0.3, '--delay': '0.5s' }} />
              <div className="nebula-particle" style={{ '--x': 0.7, '--y': 0.1, '--delay': '0.2s' }} />
              <div className="nebula-particle" style={{ '--x': 0.1, '--y': -0.7, '--delay': '0.4s' }} />
              <div className="nebula-particle" style={{ '--x': 0.6, '--y': 0.4, '--delay': '0.6s' }} />

              <MagneticButton>
                <button type="submit" className="send">
                  <span /><span /><span /><span />
                  Send
                </button>
              </MagneticButton>
            </div>
          </div>

          {/* CONTACT INFO */}
          <div className="contact-info">
            <div className="info-row">
              <span>@</span>
              <p>itaakshayas@gmail.com</p>
            </div>
            <div className="info-row">
              <span>📞</span>
              <p>+91 9344528302</p>
            </div>
            <div className="socials">
              <MagneticButton>
                <a href="https://www.linkedin.com/in/akshaya-s-it/" target="_blank" rel="noopener noreferrer">
                  <img src="https://i.pinimg.com/736x/2d/6f/cb/2d6fcb4ffd51802b261abd7e0d5d2b05.jpg" alt="LinkedIn" />
                </a>
              </MagneticButton>
              <MagneticButton>
                <a href="https://github.com/akshayasenthil004" target="_blank" rel="noopener noreferrer">
                  <img src="https://github.githubassets.com/assets/GitHub-Mark-ea2971cee799.png" alt="GitHub" />
                </a>
              </MagneticButton>
            </div>
          </div>
        </div>
      </section>

      <footer>
        <p>// © 2025 Akshaya. All rights reserved.</p>
      </footer>
    </>
  );
}

export default App;