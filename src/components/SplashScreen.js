import React, { useEffect, useState } from 'react';
import './SplashScreen.css';

const SplashScreen = ({ onComplete }) => {
  const [stage, setStage] = useState('initial');

  useEffect(() => {
    // Initial fade in
    setTimeout(() => setStage('logo-reveal'), 200);
    
    // Show MediCon text
    setTimeout(() => setStage('text-reveal'), 1200);
    
    // Show creators
    setTimeout(() => setStage('creators-reveal'), 2200);
    
    // Fade out and complete
    setTimeout(() => setStage('fade-out'), 4500);
    setTimeout(() => onComplete(), 5000);
  }, [onComplete]);

  return (
    <div className={`splash-screen ${stage}`}>
      <div className="splash-content">
        {/* Animated heart icon */}
        <div className="splash-icon-container">
          <div className="splash-icon">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </div>
          <div className="splash-pulse-ring"></div>
          <div className="splash-pulse-ring-delayed"></div>
        </div>

        {/* MediCon text */}
        <div className="splash-title">
          <h1>MediCon</h1>
        </div>

        {/* Creators */}
        <div className="splash-creators">
          <p>By Lubabalo Dlwathi</p>
          <p>and Thoriso Samson</p>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
