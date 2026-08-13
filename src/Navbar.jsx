import React, { useState, useEffect } from 'react';
import './App.css';

const STEPS = [
  { id: 1, label: '1. Hours Input' },
  { id: 2, label: '2. Hours Summary' },
  { id: 3, label: '3. Tip Tally' },
  { id: 4, label: '4. Tip Rounding' },
  { id: 5, label: '5. Final Results' },
];

function Navbar({ currentStep, onNavigateStep, theme, onToggleTheme }) {
  const [isOpen, setIsOpen] = useState(false);
  const [history, setHistory] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);

  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem('tipHistory')) || [];
    setHistory(savedHistory);
  }, [isOpen]);

  const handleStepClick = (stepId) => {
    onNavigateStep(stepId);
    setIsOpen(false);
  };

  return (
    <>
      {/* Top Header Navigation Bar */}
      <div className="navbar-top">
        <button className="theme-toggle-btn" onClick={onToggleTheme} title="Toggle Theme">
          {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
        </button>

        <button className="hamburger-btn" onClick={() => setIsOpen(true)} title="Open Menu">
          ☰ Menu
        </button>
      </div>

      {/* Slide-Out Drawer & Overlay */}
      {isOpen && (
        <div className="drawer-overlay" onClick={() => setIsOpen(false)}>
          <div className="drawer-content" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-header">
              <h3>Navigation & Tools</h3>
              <button className="drawer-close-btn" onClick={() => setIsOpen(false)}>
                ✕
              </button>
            </div>

            {/* Light / Dark Mode Toggle */}
            <div className="drawer-section">
              <h4>Theme Preference</h4>
              <button className="mode-toggle-action-btn" onClick={onToggleTheme}>
                Switch to {theme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode'}
              </button>
            </div>

            {/* Current Step Tracker */}
            <div className="drawer-section">
              <h4>Calculation Steps</h4>
              <ul className="step-nav-list">
                {STEPS.map((step) => {
                  const isActive = step.id === currentStep;
                  return (
                    <li
                      key={step.id}
                      className={`step-nav-item ${isActive ? 'active-step' : ''}`}
                      onClick={() => handleStepClick(step.id)}
                    >
                      <span>{step.label}</span>
                      {isActive && <span className="active-badge">Current</span>}
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Past Tip Reports History (Last 3-4 Runs) */}
            <div className="drawer-section">
              <h4>Past Tip Reports (History)</h4>
              {history.length > 0 ? (
                <ul className="history-list">
                  {history.slice(0, 4).map((report, idx) => (
                    <li
                      key={idx}
                      className="history-item"
                      onClick={() => setSelectedReport(report)}
                    >
                      <div className="history-date">{report.date}</div>
                      <div className="history-summary">
                        ${report.totalTips?.toFixed(2) || '0.00'} distributed • {report.totalHours?.toFixed(2) || '0.00'} hrs
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="no-history-text">No past tip reports saved yet.</p>
              )}
            </div>

            {/* GitHub Repository Link */}
            <div className="drawer-section">
              <h4>Source Code</h4>
              <a
                href="https://github.com/EjCabada/sbuxTipCalc"
                target="_blank"
                rel="noopener noreferrer"
                className="github-link-btn"
              >
                📦 GitHub: sbuxTipCalc
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Formatted Report Modal for History Items */}
      {selectedReport && (
        <div className="modal-overlay" onClick={() => setSelectedReport(null)}>
          <div className="modal-content report-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Tip Report ({selectedReport.date})</h3>
            <div className="report-text-view">
              <pre>{selectedReport.formattedText}</pre>
            </div>
            <div className="modal-actions">
              <button onClick={() => setSelectedReport(null)} className="modal-cancel-btn">
                Close Report
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;
