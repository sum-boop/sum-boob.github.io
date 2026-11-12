import type { CareerSite, ExperienceEntry } from '../types/portfolio';

export const careerSites = [
  {
    id: 'flipkart',
    name: 'Flipkart Kalash Mega Hub',
    client: 'Innovision Limited',
    location: 'Patli, Haryana',
    role: 'Security Systems & Gate Control Operator',
    period: '2025 – Present',
    status: 'active',
    cameras: 32,
    type: 'Mega Hub',
  },
  {
    id: 'ekart',
    name: 'Ekart Logistics',
    client: 'A.P. Securitas Pvt. Ltd.',
    location: 'Haryana, India',
    role: 'Security Guard & Surveillance Operator',
    period: '2023 – 2024',
    status: 'past',
    cameras: 12,
    type: 'Logistics',
  },
] satisfies readonly CareerSite[];

export const experience = [
  {
    id: 'innovision',
    company: 'Innovision Limited',
    role: 'Security Systems & Gate Control Operator',
    site: 'Flipkart Kalash Mega Hub',
    startYear: '2025',
    endYear: 'Present',
    status: 'active',
    responsibilities: [
      "Command end-to-end gate security operations, digital GIGO systems, and IP-based surveillance feeds for India's largest Flipkart hub.",
      'Oversee network connectivity for CCTV cameras, NVRs, and surveillance switches; configure IP addressing and subnet parameters across warehouse security zones.',
      'Execute real-time MS Excel and Google Sheets logging for all inbound/outbound commercial fleets with 100% data accuracy.',
      'Perform active surveillance and network diagnostic checks (ping, ipconfig) to help maintain 24/7 video uptime and reduce stock shrinkage.',
      'Coordinate directly with shift managers, IT support, and safety officers to resolve gate bottlenecks and connectivity issues immediately.',
    ],
    skills: ['CP Plus CCTV', 'IP Networking', 'GIGO Gate Entry', 'Excel Logging'],
  },
  {
    id: 'ap-securitas',
    company: 'A.P. Securitas Pvt. Ltd.',
    role: 'Security Guard & Surveillance Operator',
    site: 'Ekart Logistics',
    startYear: '2023',
    endYear: '2024',
    status: 'past',
    responsibilities: [
      'Monitored multi-camera CCTV feeds, managed DVR/NVR recording channels, and enforced facility safety standards.',
      'Used CLI diagnostics (cmd, ipconfig) and router interface tools to support network connectivity for surveillance workstations.',
      'Used Google Sheets and Excel for visitor verification and digital shift reporting.',
      'Conducted floor patrols, inventory spot checks, and fire safety inspections.',
      'Operated emergency response equipment, participated in fire drills, and maintained daily shift logs.',
    ],
    skills: ['CCTV Monitoring', 'CLI Diagnostics', 'Fire Safety'],
  },
] satisfies readonly ExperienceEntry[];
