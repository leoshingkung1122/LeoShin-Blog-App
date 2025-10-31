import React from 'react';
// @ts-ignore - PNG file import
import LoadingToastImage from '../../assets/Yuna pose02.PNG';
import './LoadingToast.css';

interface LoadingToastProps {
  size?: 'small' | 'medium' | 'large' | 'extra-large';
  text?: string;
  className?: string;
}

const LoadingToast: React.FC<LoadingToastProps> = ({ 
  size = 'extra-large', 
  className = '' 
}) => {
  const sizeClasses = {
    small: 'loading-toast-small',
    medium: 'loading-toast-medium',
    large: 'loading-toast-large',
    'extra-large': 'loading-toast-extra-large'
  };

  return (
    <div className={`loading-toast-container ${sizeClasses[size]} ${className}`}>
      <div className="loading-toast-image-wrapper">
        <div className="loading-toast-glow-effect"></div>
        <img 
          src={LoadingToastImage} 
          alt="Loading" 
          className="loading-toast-image"
        />
        <div className="loading-toast-sparkles">
          <div className="sparkle sparkle-1"></div>
          <div className="sparkle sparkle-2"></div>
          <div className="sparkle sparkle-3"></div>
          <div className="sparkle sparkle-4"></div>
        </div>
      </div>
      <div className="loading-toast-text">
        <span className="text-letter">L</span>
        <span className="text-letter">o</span>
        <span className="text-letter">a</span>
        <span className="text-letter">d</span>
        <span className="text-letter">i</span>
        <span className="text-letter">n</span>
        <span className="text-letter">g</span>
        <span className="loading-dots">
          <span className="dot">.</span>
          <span className="dot">.</span>
          <span className="dot">.</span>
        </span>
      </div>
    </div>
  );
};

export default LoadingToast;
