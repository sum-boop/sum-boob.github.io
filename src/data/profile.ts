import type { PortfolioProfile } from '../types/portfolio';

export const profile = {
  name: 'Sumit Anand',
  role: 'CCTV Operator & Surveillance Specialist',
  headline: 'Sumit Anand — eyes on every hub.',
  location: 'Patli, Haryana, India',
  heroSummary:
    "CCTV Operator & Surveillance Specialist commanding multi-channel CP Plus arrays, high-throughput GIGO gate control, and IP network monitoring across India's largest logistics hubs.",
  aboutHeading: 'Precision Monitoring & Asset Protection',
  aboutParagraphs: [
    'Specializing in real-time multi-camera monitoring, high-accuracy vehicle & driver data logging, and incident review across mega logistics operations — including the Flipkart Kalash Mega Hub and Ekart Logistics.',
    'Expert operator of multi-screen CP Plus CCTV arrays, digital GIGO gate entry systems, and zero-error Excel logging pipelines. Consistent enforcer of loss prevention protocols and fire-safety procedures across high-volume warehouse zones.',
  ],
  heroMetrics: [
    { value: '2+', label: 'Years Ops' },
    { value: '32+', label: 'Cameras Monitored' },
    { value: '100%', label: 'Log Accuracy' },
  ],
  careerMetrics: [
    { value: '2+', label: 'Years Active' },
    { value: '100%', label: 'Log Accuracy' },
    { value: '24/7', label: 'Video Uptime' },
  ],
  metadata: ['India', 'Logistics Security', 'CP Plus / NVR / IP'],
} satisfies PortfolioProfile;
