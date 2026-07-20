import React, { useEffect, useRef, useState, useCallback, useLayoutEffect } from 'react';
import './App.css';
import BottomNav from './BottomNav';
import img from './pic.png';
// import pic from './assests/craftp.jpg';
// import file from './assests/eternal.png';
import Preloader from './Preloader';
import CursorFollower from './CursorFollower';
import MagneticButton from './MagneticButton';
import TiltCard from './TiltCard';
import ProjectCoverflow from './ProjectCoverflow';
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
      'Full stack web application to manage mental health services, with secure auth, role-based access for users, admins, and counsellors, and an appointment booking system.',
    tags: ['React', 'Node.js', 'Express', 'MongoDB'],
    live: 'https://mental-health-jn7c.vercel.app/',
    code: 'https://github.com/AkshayaSenthil08/Mental-Health',
  },
  {
    id: 'crud',
    filename: 'crud-app.tsx',
    title: 'Basic CRUD',
    image: 'https://www.shutterstock.com/image-illustration/crud-acronym-create-read-update-600nw-2491959959.jpg',
    description:
      'Full stack web application with complete CRUD functionality, secure authentication, authorization, and role-based access control behind a clean, modern UI.',
    tags: ['React', 'Node.js', 'Express', 'MongoDB'],
    live: 'https://task-amber-zeta.vercel.app/',
    code: 'https://github.com/AkshayaSenthil08/task',
  },
  {
    id: 'railway',
    filename: 'railway-booking.js',
    title: 'Railway Ticket Booking',
    image: 'https://images.pexels.com/photos/1548693/pexels-photo-1548693.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
    description:
      'A dynamic JavaScript web application enabling users to search trains, select seats, make bookings, and view PNR status via client-side logic.',
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
      'A responsive React web app that converts real-time currency values using exchange rate APIs, with dynamic input validation and a modern UI.',
    tags: ['React', 'JavaScript', 'API'],
    live: 'https://converter-three-mu.vercel.app/',
    code: 'https://github.com/AkshayaSenthil08/Converter',
  },
  {
    id: 'crafto',
    filename: 'crafto.html',
    title: 'Crafto Project',
    // image: pic,
    description:
      'A responsive jewellery e-commerce website showcasing modern UI design, product listings, and a user-friendly layout.',
    tags: ['HTML', 'CSS'],
    live: 'https://luxury-project.vercel.app/',
    code: 'https://github.com/AkshayaSenthil08/LuxuryProject',
  },
  {
    id: 'eternal',
    filename: 'eternal.html',
    title: 'Eternal Project',
    // image: file,
    description:
      'A clean, modern multi-section landing page showcasing services, portfolio items, and team information with a fully responsive layout.',
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
                  <li>Software Developer</li>
                  <li>IT Graduate</li>
                  <li>Frontend Developer</li>
                </ul>
              </div>
              <span className="bracket">/&gt;</span>
            </div>

            <p>Passionate about building clean UI and scalable web applications.</p>

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
                <div>&nbsp;&nbsp;<span className="k">"name"</span><span className="c">:</span> <span className="s">"Akshaya Senthilkumar"</span><span className="c">,</span></div>
                <div>&nbsp;&nbsp;<span className="k">"role"</span><span className="c">:</span> <span className="s">"Frontend Developer"</span><span className="c">,</span></div>
                <div>&nbsp;&nbsp;<span className="k">"stack"</span><span className="c">:</span> <span className="c">[</span><span className="s">"React"</span><span className="c">,</span> <span className="s">"Node"</span><span className="c">,</span> <span className="s">"Mongo"</span><span className="c">],</span></div>
                <div>&nbsp;&nbsp;<span className="k">"email"</span><span className="c">:</span>{' '}
                  <a className="s" href="mailto:itaakshayas@gmail.com">"itaakshayas@gmail.com"</a><span className="c">,</span>
                </div>
                <div>&nbsp;&nbsp;<span className="k">"github"</span><span className="c">:</span>{' '}
                  <a className="s" href="https://github.com/akshayasenthil004" target="_blank" rel="noopener noreferrer">"@akshayasenthil004"</a><span className="c">,</span>
                </div>
                <div>&nbsp;&nbsp;<span className="k">"status"</span><span className="c">:</span> <span className="n">available</span></div>
                <div><span className="c">{'}'}</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════ ABOUT ══════════════════ */}
      <section id="about" className="about-section" ref={aboutRef}>
        <div className="prompt">cd ./about<span className="caret" /></div>

        <div className="about-bento">
          <div className="about-text card">
            <h2>Who I am</h2>
            <p>
              I'm <strong>Akshaya S.</strong>, a web developer who bridges the gap between clean, scalable architecture and highly interactive user experiences. With solid hands-on experience in modern front-end engineering, I focus on transforming complex ideas into pixel-perfect, responsive web applications.
            </p>
            <p>
              I have hands-on experience with HTML, CSS, JavaScript, and React.js, and I've
              built real-world projects like a Movie Finder App, Currency Converter, and a
              Rail Ticket Booking system.
            </p>

            <div className="about-skills-badges">
              <span className="badge">HTML5</span>
              <span className="badge">CSS3</span>
              <span className="badge">JavaScript</span>
              <span className="badge">TypeScript</span>
              <span className="badge">React.js</span>
              <span className="badge">Node.js</span>
              <span className="badge">MongoDB</span>
            </div>
          </div>

          <div className="about-illustration card">
            <img src={img} alt="Developer Illustration" />
          </div>

          <div className="about-stack card">
            <h3>package.json</h3>
            <div className="stack-list">
              <div><span className="pkg">react</span> <span className="ver">^18.2.0</span></div>
              <div><span className="pkg">node</span> <span className="ver">^20.0.0</span></div>
              <div><span className="pkg">express</span> <span className="ver">^4.18.0</span></div>
              <div><span className="pkg">mongodb</span> <span className="ver">^6.0.0</span></div>
              <div><span className="pkg">typescript</span> <span className="ver">^5.3.0</span></div>
            </div>
            <div className="status-line">
              <span className="n">&gt;</span> currently exploring motion design, one commit at a time.
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
            <h3 className="category-title">Frontend</h3>
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
            </div>
          </div>

          <div className="skills-category">
            <h3 className="category-title">Backend & Database</h3>
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
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════ PROJECTS ══════════════════ */}
      <div id="projects" className="prodark" ref={projectsRef}>
        <div className="prompt">ls ./projects<span className="caret" /></div>
        <h2>Projects</h2>

        <ProjectCoverflow projects={PROJECTS} />
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