import type { Certification } from '../types/portfolio';

export const education = 'B.S.A.M. Panchitthri Sr. Sec. School';

export const certifications = [
  {
    title: 'Networking & IP Surveillance Fundamentals',
    description:
      'IPv4 addressing, subnetting, router/switch setup, NVR/DVR integration, TCP/IP, and CLI diagnostics.',
  },
  {
    title: 'CCTV & Technical Systems Training',
    description:
      'CP Plus equipment configuration, camera installation, playback analysis, and maintenance.',
  },
  {
    title: 'Fire Safety & First Aid (CPR)',
    description: 'Evacuation procedures, fire extinguisher operation, and workplace CPR.',
  },
  {
    title: 'Computer & Version Control Fundamentals',
    description: 'Command-line and terminal basics, Git, and cloud-based collaboration tools.',
  },
] satisfies readonly Certification[];
