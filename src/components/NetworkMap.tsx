import { useEffect, useRef } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';

const nodes = [
  [0.08, 0.28],
  [0.18, 0.66],
  [0.28, 0.2],
  [0.38, 0.47],
  [0.48, 0.78],
  [0.55, 0.27],
  [0.66, 0.54],
  [0.75, 0.18],
  [0.83, 0.75],
  [0.94, 0.38],
] as const;
const edges = [
  [0, 2],
  [0, 3],
  [1, 3],
  [1, 4],
  [2, 3],
  [2, 5],
  [3, 4],
  [3, 5],
  [3, 6],
  [4, 6],
  [5, 6],
  [5, 7],
  [6, 7],
  [6, 8],
  [6, 9],
  [7, 9],
  [8, 9],
] as const;

export function NetworkMap() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context) return;

    let frame = 0;
    let width = 0;
    let height = 0;

    const draw = (time: number) => {
      context.clearRect(0, 0, width, height);
      context.lineWidth = 1;
      edges.forEach(([from, to], index) => {
        const start = nodes[from];
        const end = nodes[to];
        if (!start || !end) return;
        context.beginPath();
        context.moveTo(start[0] * width, start[1] * height);
        context.lineTo(end[0] * width, end[1] * height);
        context.strokeStyle = index % 4 === 0 ? 'rgba(8, 122, 67, 0.28)' : 'rgba(53, 95, 70, 0.15)';
        context.stroke();
      });
      nodes.forEach(([x, y], index) => {
        const radius = index === 3 ? 5 : index === 6 ? 4 : 2.5;
        const pulse = reducedMotion ? 1 : 0.72 + (Math.sin(time / 760 + index * 0.9) + 1) * 0.14;
        context.beginPath();
        context.arc(x * width, y * height, radius * pulse, 0, Math.PI * 2);
        context.fillStyle = index === 3 ? '#c8ee72' : index % 3 === 0 ? '#087a43' : '#6a9a70';
        context.shadowColor = context.fillStyle;
        context.shadowBlur = index === 3 ? 17 : 9;
        context.fill();
        context.shadowBlur = 0;
      });
    };

    const animate = (time: number) => {
      draw(time);
      if (!reducedMotion) frame = window.requestAnimationFrame(animate);
    };

    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      const ratio = window.devicePixelRatio || 1;
      width = bounds.width;
      height = bounds.height;
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      draw(0);
    };

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    resize();
    if (!reducedMotion) frame = window.requestAnimationFrame(animate);
    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(frame);
    };
  }, [reducedMotion]);

  return <canvas aria-hidden="true" className="network-canvas" ref={canvasRef} />;
}
