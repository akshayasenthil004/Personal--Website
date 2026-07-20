import React, { useState, useEffect, useRef, useCallback } from 'react';
import './ProjectCoverflow.css';

const ProjectCoverflow = ({ projects }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isAutoplay, setIsAutoplay] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartX = useRef(0);
  const dragOffsetX = useRef(0);

  const total = projects.length;

  const nextSlide = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % total);
  }, [total]);

  const prevSlide = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isModalOpen) return;
      if (e.key === 'ArrowLeft') prevSlide();
      if (e.key === 'ArrowRight') nextSlide();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide, isModalOpen]);

  // Autoplay timer
  useEffect(() => {
    if (!isAutoplay) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 3500);
    return () => clearInterval(timer);
  }, [isAutoplay, nextSlide]);

  const handleCardClick = (index) => {
    if (index === activeIndex) {
      // Open modal if center card clicked
      setSelectedProject(projects[index]);
      setIsModalOpen(true);
    } else {
      setActiveIndex(index);
    }
  };

  const handleExpandClick = () => {
    setSelectedProject(projects[activeIndex]);
    setIsModalOpen(true);
  };

  const toggleAutoplay = () => {
    setIsAutoplay((prev) => !prev);
  };

  // Drag / Swipe handling
  const handleTouchStart = (e) => {
    dragStartX.current = e.touches ? e.touches[0].clientX : e.clientX;
    setIsDragging(true);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const currentX = e.touches ? e.touches[0].clientX : e.clientX;
    dragOffsetX.current = currentX - dragStartX.current;
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    if (dragOffsetX.current < -50) {
      nextSlide();
    } else if (dragOffsetX.current > 50) {
      prevSlide();
    }
    dragOffsetX.current = 0;
  };

  return (
    <div className="coverflow-container">
      {/* Background Soft Glow matching image */}
      <div className="coverflow-glow" />

      {/* Main 3D Carousel Stage */}
      <div
        className="coverflow-stage"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleTouchStart}
        onMouseMove={handleTouchMove}
        onMouseUp={handleTouchEnd}
        onMouseLeave={handleTouchEnd}
      >
        {projects.map((project, index) => {
          let offset = index - activeIndex;
          if (offset > Math.floor(total / 2)) offset -= total;
          if (offset < -Math.floor(total / 2)) offset += total;

          const absOffset = Math.abs(offset);
          const isCenter = offset === 0;

          // CSS variables for positioning
          const style = {
            '--offset': offset,
            '--abs-offset': absOffset,
            zIndex: 20 - absOffset * 4,
          };

          return (
            <div
              key={project.id}
              className={`coverflow-card ${isCenter ? 'active' : ''} ${
                absOffset > 2 ? 'hidden' : ''
              }`}
              style={style}
              onClick={() => handleCardClick(index)}
            >
              <div className="coverflow-card__image-container">
                <img
                  src={project.image}
                  alt={project.title}
                  loading="lazy"
                  className="coverflow-card__image"
                />

                {/* Gradient vignette overlay */}
                <div className="coverflow-card__overlay" />

                {/* Circular Play/Action Badge (matching user image bottom-right play button) */}
                <div className="coverflow-card__badge" title="View Project Details">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>

                {/* Card Title & Info Overlay for Active Card */}
                {isCenter && (
                  <div className="coverflow-card__info">
                    <span className="coverflow-card__tag">
                      {project.tags?.[0] || 'Web App'}
                    </span>
                    <h3 className="coverflow-card__title">{project.title}</h3>
                    <div className="coverflow-card__links">
                      {project.live && (
                        <a
                          href={project.live}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="coverflow-card__link"
                          onClick={(e) => e.stopPropagation()}
                          title="Live Demo"
                        >
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                            <polyline points="15 3 21 3 21 9"></polyline>
                            <line x1="10" y1="14" x2="21" y2="3"></line>
                          </svg>
                        </a>
                      )}
                      {project.code && (
                        <a
                          href={project.code}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="coverflow-card__link"
                          onClick={(e) => e.stopPropagation()}
                          title="GitHub Code"
                        >
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polyline points="16 18 22 12 16 6"></polyline>
                            <polyline points="8 6 2 12 8 18"></polyline>
                          </svg>
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Centered Prev / Next Circular Arrows (matching reference image) */}
      <div className="coverflow-nav">
        <button
          className="coverflow-nav__btn"
          onClick={prevSlide}
          aria-label="Previous Project"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
        </button>

        <button
          className="coverflow-nav__btn"
          onClick={nextSlide}
          aria-label="Next Project"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </button>
      </div>

      {/* Floating Action Buttons (bottom-right matching reference image) */}
      <div className="coverflow-floating-controls">
        {/* Expand / Fullscreen Button */}
        <button
          className="coverflow-floating-btn"
          onClick={handleExpandClick}
          aria-label="Expand Project Details"
          title="Fullscreen / View Details"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="15 3 21 3 21 9" />
            <polyline points="9 21 3 21 3 15" />
            <line x1="21" y1="3" x2="14" y2="10" />
            <line x1="3" y1="21" x2="10" y2="14" />
          </svg>
        </button>

        {/* Rotate / Sparkle Autoplay Button */}
        <button
          className={`coverflow-floating-btn ${isAutoplay ? 'active-autoplay' : ''}`}
          onClick={toggleAutoplay}
          aria-label="Toggle Auto Rotate"
          title={isAutoplay ? 'Pause Auto Rotate' : 'Auto Rotate Projects'}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
          </svg>
        </button>
      </div>

      {/* Project Detail Lightbox Modal */}
      {isModalOpen && selectedProject && (
        <div className="coverflow-modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div
            className="coverflow-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="coverflow-modal-close"
              onClick={() => setIsModalOpen(false)}
              aria-label="Close modal"
            >
              &times;
            </button>

            <div className="coverflow-modal-grid">
              <div className="coverflow-modal-image-col">
                <img src={selectedProject.image} alt={selectedProject.title} />
              </div>

              <div className="coverflow-modal-info-col">
                <span className="coverflow-modal-tag-chip">
                  {selectedProject.filename || 'Project'}
                </span>
                <h2>{selectedProject.title}</h2>
                <p>{selectedProject.description}</p>

                <div className="coverflow-modal-tech-list">
                  <h4>Technologies Used:</h4>
                  <div className="coverflow-modal-tech-tags">
                    {selectedProject.tags?.map((tag, i) => (
                      <span key={i} className="tech-badge">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="coverflow-modal-actions">
                  {selectedProject.live && (
                    <a
                      href={selectedProject.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="modal-btn modal-btn--primary"
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                        <polyline points="15 3 21 3 21 9" />
                        <line x1="10" y1="14" x2="21" y2="3" />
                      </svg>
                      Live Demo
                    </a>
                  )}
                  {selectedProject.code && (
                    <a
                      href={selectedProject.code}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="modal-btn modal-btn--secondary"
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <polyline points="16 18 22 12 16 6" />
                        <polyline points="8 6 2 12 8 18" />
                      </svg>
                      View Source
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectCoverflow;