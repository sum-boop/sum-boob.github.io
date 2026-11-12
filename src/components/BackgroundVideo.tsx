import { useEffect, useRef } from 'react';
import { assetPath } from '../utils/assets';

interface BackgroundVideoProps {
  className: string;
  poster: string;
  src: string;
}

export function BackgroundVideo({ className, poster, src }: BackgroundVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;

    if (!video || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const play = () => {
      void video.play().catch(() => undefined);
    };

    if (!('IntersectionObserver' in window)) {
      play();
      return () => video.pause();
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) play();
        else video.pause();
      },
      { rootMargin: '240px 0px', threshold: 0.01 },
    );

    observer.observe(video);

    return () => {
      observer.disconnect();
      video.pause();
    };
  }, []);

  return (
    <video
      aria-hidden="true"
      className={className}
      loop
      muted
      playsInline
      poster={assetPath(poster)}
      preload="none"
      ref={videoRef}
      tabIndex={-1}
    >
      <source src={assetPath(src)} type="video/mp4" />
    </video>
  );
}
