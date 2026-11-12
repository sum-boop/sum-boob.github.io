import type { DeploymentBriefing } from '../types/portfolio';

const unsplash = (id: string, width: number) =>
  `https://images.unsplash.com/${id}?q=80&w=${width}&auto=format&fit=crop`;

export const deployments = [
  {
    id: 'op1',
    cardTitle: 'CP Plus Multi-Channel Surveillance',
    title: 'CP Plus Multi-Channel Surveillance',
    eyebrow: 'Innovision Limited · Flipkart Kalash Mega Hub',
    site: 'Flipkart Kalash Mega Hub',
    cardPeriod: '2025–PRESENT',
    period: '2025 — Present',
    cardCameras: 32,
    cameras: 32,
    status: 'active',
    category: 'Surveillance',
    cardMetric: '32+',
    cardDescription:
      '24/7 perimeter coverage across 32 cameras. Real-time monitoring, footage playback, and shrink prevention across warehouse zones.',
    structuredBrief:
      '24/7 perimeter coverage across 32 cameras. Real-time monitoring, footage playback and archiving, and shrink prevention across warehouse zones.',
    description:
      'Real-time monitoring across a 32-camera CP Plus array covering warehouse zones, dock areas, and perimeter. Responsible for playback investigation, footage archiving, and shrink prevention.',
    cardImage: unsplash('photo-1557597774-9d273605dfa9', 900),
    image: unsplash('photo-1557597774-9d273605dfa9', 1200),
    imageAlt: 'Illustrative reference image of security monitoring displays in a warehouse',
    tags: ['CP Plus', 'Multi-Channel Monitoring', 'Playback & Archiving', 'Loss Prevention'],
    gallery: [
      unsplash('photo-1557597774-9d273605dfa9', 500),
      unsplash('photo-1551288049-bebda4e38f71', 500),
      unsplash('photo-1518186285589-2f7649de83e0', 500),
    ],
  },
  {
    id: 'op2',
    cardTitle: 'Digital GIGO Gate Control',
    title: 'Digital GIGO Gate Control & Data Terminal',
    eyebrow: 'Innovision Limited · Flipkart Kalash Mega Hub',
    site: 'Flipkart Kalash Mega Hub',
    cardPeriod: '2025–PRESENT',
    period: '2025 — Present',
    cardCameras: 32,
    cameras: 4,
    status: 'active',
    category: 'Gate Control',
    cardMetric: '100%',
    cardDescription:
      'High-volume commercial fleet entry/exit logging with 100% data accuracy, credential checks, and synchronized Excel gate tracking.',
    structuredBrief:
      'High-volume commercial fleet entry/exit logging with 100% data accuracy, credential checks, and synchronized Excel gate tracking.',
    description:
      'High-density commercial vehicle logging for India’s largest Flipkart hub. Gate-in/gate-out entry synchronization, driver credential checks, and 100% accurate MS Excel logging.',
    cardImage: unsplash('photo-1551288049-bebda4e38f71', 900),
    image: unsplash('photo-1551288049-bebda4e38f71', 1200),
    imageAlt: 'Illustrative reference image of a data logging workstation',
    tags: ['GIGO Gate Entry', 'MS Excel', 'Vehicle Logs', 'Badge Verification'],
    gallery: [
      unsplash('photo-1551288049-bebda4e38f71', 500),
      unsplash('photo-1563986768609-322da13575f3', 500),
      unsplash('photo-1557597774-9d273605dfa9', 500),
    ],
  },
  {
    id: 'op3',
    cardTitle: 'Loss Prevention & Shrink Control',
    title: 'Loss Prevention & Shrink Control',
    eyebrow: 'Innovision Limited · Flipkart Kalash Mega Hub',
    site: 'Flipkart Kalash Mega Hub',
    cardPeriod: '2025–PRESENT',
    period: '2025 — Present',
    cardCameras: 32,
    cameras: null,
    status: 'active',
    category: 'Loss Prevention',
    cardMetric: '24/7',
    cardDescription:
      'Badge-access enforcement, camera maintenance, and fire-safety drill coordination for an audited mega-hub facility.',
    structuredBrief:
      'Badge-access enforcement, camera maintenance, and fire-safety drill coordination for an audited mega-hub facility.',
    description:
      'Continuous monitoring of high-value inventory zones, anomaly flagging, and coordinated escalation to shift managers. Zero-incident operational accuracy maintained across the current posting.',
    cardImage: unsplash('photo-1563986768609-322da13575f3', 900),
    image: unsplash('photo-1563986768609-322da13575f3', 1200),
    imageAlt: 'Illustrative reference image of a security access control system',
    tags: ['Loss Prevention', 'Incident Flagging', 'Escalation Protocols', 'Site Coordination'],
    gallery: [
      unsplash('photo-1563986768609-322da13575f3', 500),
      unsplash('photo-1557597774-9d273605dfa9', 500),
      unsplash('photo-1518186285589-2f7649de83e0', 500),
    ],
  },
  {
    id: 'op4',
    cardTitle: 'Incident Forensic Review',
    title: 'Incident Forensic Review',
    eyebrow: 'Innovision Limited · Flipkart Kalash Mega Hub',
    site: 'Flipkart Kalash Mega Hub',
    cardPeriod: '2025–PRESENT',
    period: '2025 — Present',
    cardCameras: 32,
    cameras: 32,
    status: 'active',
    category: 'Forensics',
    cardDescription:
      'Time-stamped footage extraction and cross-camera playback to flag and document incidents for shift managers.',
    structuredBrief:
      'Time-stamped footage extraction and cross-camera playback to flag and document incidents for shift managers.',
    description:
      'Timestamped footage extraction, chain-of-custody documentation, and cross-camera timeline reconstruction for internal loss investigations.',
    cardImage: unsplash('photo-1518186285589-2f7649de83e0', 900),
    image: unsplash('photo-1518186285589-2f7649de83e0', 1200),
    imageAlt: 'Illustrative reference image of an operator reviewing multiple screens',
    tags: ['Footage Playback', 'Forensic Review', 'Chain of Custody', 'Reporting'],
    gallery: [
      unsplash('photo-1518186285589-2f7649de83e0', 500),
      unsplash('photo-1557597774-9d273605dfa9', 500),
      unsplash('photo-1563986768609-322da13575f3', 500),
    ],
  },
  {
    id: 'op5',
    cardTitle: 'Perimeter & Dock Security',
    title: 'Perimeter & Dock Security',
    eyebrow: 'A.P. Securitas Pvt. Ltd. · Ekart Logistics',
    site: 'Ekart Logistics',
    cardPeriod: '2023–2024',
    period: '2023 — 2024',
    cardCameras: 12,
    cameras: 12,
    status: 'past',
    category: 'Perimeter',
    cardDescription:
      'Dock-movement verification, patrol oversight, and multi-camera CCTV monitoring for facility perimeter security.',
    structuredBrief:
      'Dock-movement verification, patrol oversight, and multi-camera CCTV monitoring for facility perimeter security.',
    description:
      'Perimeter monitoring, dock-movement verification, and patrol oversight at an Ekart Logistics facility. Coordinated with shift supervisors on access control and visitor verification.',
    cardImage: unsplash('photo-1587293852726-70cdb56c2866', 900),
    image: unsplash('photo-1587293852726-70cdb56c2866', 1200),
    imageAlt: 'Illustrative reference image of a warehouse loading dock',
    tags: ['Perimeter Monitoring', 'Dock Verification', 'Patrol Oversight', 'Visitor Access'],
    gallery: [
      unsplash('photo-1587293852726-70cdb56c2866', 500),
      unsplash('photo-1563986768609-322da13575f3', 500),
      unsplash('photo-1581092918056-0c4c3acd3789', 500),
    ],
  },
  {
    id: 'op6',
    cardTitle: 'Emergency Response Coordination',
    title: 'Emergency Response Coordination',
    eyebrow: 'A.P. Securitas Pvt. Ltd. · Ekart Logistics',
    site: 'Ekart Logistics',
    cardPeriod: '2023–2024',
    period: '2023 — 2024',
    cardCameras: 12,
    cameras: null,
    status: 'past',
    category: 'Emergency',
    cardDescription:
      'Fire-drill participation, emergency equipment operation, and daily shift-log maintenance under CCTV oversight.',
    structuredBrief:
      'Fire-drill participation, emergency equipment operation, and daily shift-log maintenance under CCTV oversight.',
    description:
      'Alarm-to-action dispatch, evacuation routing under live surveillance, fire safety inspections, and post-incident shift reporting.',
    cardImage: unsplash('photo-1581092918056-0c4c3acd3789', 900),
    image: unsplash('photo-1581092918056-0c4c3acd3789', 1200),
    imageAlt: 'Illustrative reference image of an emergency coordination control station',
    tags: ['Fire Safety', 'First Aid', 'Emergency Escalation', 'Shift Reporting'],
    gallery: [
      unsplash('photo-1581092918056-0c4c3acd3789', 500),
      unsplash('photo-1587293852726-70cdb56c2866', 500),
      unsplash('photo-1518186285589-2f7649de83e0', 500),
    ],
  },
] satisfies readonly DeploymentBriefing[];
