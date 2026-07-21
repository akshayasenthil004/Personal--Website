import React, { useState, useEffect } from 'react';
import './ProjectBentoGrid.css';

const slugify = (str = '') =>
  str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const getCardSpanClass = (idx) => {
  const pattern = idx % 6;
  switch (pattern) {
    case 0:
      return 'bento-card--tall-left';
    case 1:
      return 'bento-card--top-right';
    case 2:
      return 'bento-card--bottom-right';
    case 3:
      return 'bento-card--third';
    case 4:
      return 'bento-card--third';
    case 5:
      return 'bento-card--third';
    default:
      return 'bento-card--half';
  }
};

const ProjectBentoGrid = ({ projects }) => {
  const [selectedProject, setSelectedProject] = useState(null);

  // Close modal on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setSelectedProject(null);
      }
    };
    if (selectedProject) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedProject]);

  return (
    <div className="bento-container">
      {/* Dynamic Bento Layout */}
      <div className="bento-grid">
        {projects.map((project, idx) => {
          const spanClass = getCardSpanClass(idx);

          return (
            <div
              key={project.id || idx}
              className={`bento-card ${spanClass}`}
              onClick={() => setSelectedProject(project)}
            >
              {/* Card Media Background */}
              <div className="bento-card__media">
                <img src={project.image} alt={project.title} loading="lazy" />
                <div className="bento-card__overlay" />
              </div>

              {/* Floating Glass Badge (Bottom Left overlay) */}
              <div className="bento-card__badge">
                {project.summary && (
                  <p className="bento-card__summary">{project.summary}</p>
                )}
                <div className="bento-card__meta">
                  <h3 className="bento-card__title">{project.title}</h3>
                  <div className="bento-card__tags">
                    <span className="bento-card__year">{project.year || '2026'}</span>
                    <span className="bento-card__dot">•</span>
                    <span className="bento-card__category">
                      {project.category || project.tags?.[0] || 'App'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Lightweight Modal for Full Details */}
      {selectedProject && (
        <div className="bento-modal-backdrop" onClick={() => setSelectedProject(null)}>
          <div className="bento-modal" onClick={(e) => e.stopPropagation()}>
            <button className="bento-modal__close" onClick={() => setSelectedProject(null)} aria-label="Close modal">
              &times;
            </button>
            <div className="bento-modal__body">
              <span className="bento-modal__tag">~/projects/{selectedProject.filename || `${slugify(selectedProject.title)}.tsx`}</span>
              <h2>{selectedProject.title}</h2>
              <p>{selectedProject.description}</p>
              
              <div className="bento-modal__tech">
                {selectedProject.tags?.map((t, i) => (
                  <span key={i} className="bento-tech-chip">{t}</span>
                ))}
              </div>

              <div className="bento-modal__links">
                {selectedProject.live && (
                  <a href={selectedProject.live} target="_blank" rel="noreferrer" className="bento-btn primary">
                    Live Demo ↗
                  </a>
                )}
                {selectedProject.code && (
                  <a href={selectedProject.code} target="_blank" rel="noreferrer" className="bento-btn secondary">
                    Source Code
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectBentoGrid;
