import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { LazyMotion, MotionConfig, domAnimation } from 'framer-motion';
import App from './App';
import './styles/tokens.css';
import './styles/global.css';
import './motion/motion.css';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('The portfolio root element is missing.');

createRoot(rootElement).render(
  <StrictMode>
    <LazyMotion features={domAnimation}>
      <MotionConfig reducedMotion="user">
        <App />
      </MotionConfig>
    </LazyMotion>
  </StrictMode>,
);
