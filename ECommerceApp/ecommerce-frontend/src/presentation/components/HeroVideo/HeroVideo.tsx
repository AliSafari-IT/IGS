import React, { useState, useRef, useEffect, memo } from 'react';
import { useIntersectionObserver } from '../../../utils/performanceHooks';
import './HeroVideo.css';

interface HeroVideoProps {
  className?: string;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
}

const HeroVideo: React.FC<HeroVideoProps> = memo(({
  className = '',
  autoPlay = true,
  muted = true,
  loop = true
}) => {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPlayButton, setShowPlayButton] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Use intersection observer to only load video when in view
  const isInView = useIntersectionObserver(containerRef as React.RefObject<Element>, {
    threshold: 0.3,
    rootMargin: '50px'
  });

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !isInView) return;

    const handleLoadedData = () => {
      setIsVideoLoaded(true);
      if (autoPlay && muted) {
        video.play().catch(console.error);
      }
    };

    const handlePlay = () => {
      setIsPlaying(true);
      setShowPlayButton(false);
    };

    const handlePause = () => {
      setIsPlaying(false);
      setShowPlayButton(true);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setShowPlayButton(true);
    };

    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('ended', handleEnded);
    };
  }, [isInView, autoPlay, muted]);

  const handlePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play().catch(console.error);
    }
  };

  const handleVideoClick = () => {
    if (showPlayButton) {
      handlePlayPause();
    }
  };

  return (
    <div 
      ref={containerRef}
      className={`hero-video-container ${className}`}
      onClick={handleVideoClick}
    >
      {isInView && (
        <>
          <video
            ref={videoRef}
            className={`hero-video ${isVideoLoaded ? 'loaded' : ''}`}
            muted={muted}
            loop={loop}
            playsInline
            preload="metadata"
            poster="https://placehold.co/800x450/1e40af/ffffff?text=IGS-Pharma+Video"
            aria-label="IGS-Pharma introduction video"
          >
            <source 
              src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" 
              type="video/mp4" 
            />
            <source 
              src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.webm" 
              type="video/webm" 
            />
            <p>
              Your browser doesn't support HTML5 video. 
              <a href="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4">
                Download the video
              </a>
            </p>
          </video>
          
          {!isVideoLoaded && (
            <div className="video-loading">
              <div className="video-skeleton">
                <div className="skeleton-animation"></div>
              </div>
              <span className="sr-only">Loading video...</span>
            </div>
          )}

          {showPlayButton && (
            <button
              className="video-play-button"
              onClick={handlePlayPause}
              aria-label={isPlaying ? 'Pause video' : 'Play video'}
              type="button"
            >
              <svg 
                width="64" 
                height="64" 
                viewBox="0 0 24 24" 
                fill="currentColor"
                aria-hidden="true"
              >
                {isPlaying ? (
                  <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                ) : (
                  <path d="M8 5v14l11-7z" />
                )}
              </svg>
            </button>
          )}

          <div className="video-controls">
            <button
              className="video-control-btn"
              onClick={handlePlayPause}
              aria-label={isPlaying ? 'Pause video' : 'Play video'}
              type="button"
            >
              <i className={`fa ${isPlaying ? 'fa-pause' : 'fa-play'}`} aria-hidden="true"></i>
            </button>
          </div>
        </>
      )}
    </div>
  );
});

HeroVideo.displayName = 'HeroVideo';

export default HeroVideo;
