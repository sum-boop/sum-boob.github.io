export type DeploymentStatus = 'active' | 'past';

export interface PortfolioProfile {
  name: string;
  role: string;
  headline: string;
  location: string;
  heroSummary: string;
  aboutHeading: string;
  aboutParagraphs: readonly string[];
  heroMetrics: readonly { value: string; label: string }[];
  careerMetrics: readonly { value: string; label: string }[];
  metadata: readonly string[];
}

export interface ExperienceEntry {
  id: string;
  company: string;
  role: string;
  site: string;
  startYear: string;
  endYear: string;
  status: DeploymentStatus;
  responsibilities: readonly string[];
  skills: readonly string[];
}

export interface CareerSite {
  id: string;
  name: string;
  client: string;
  location: string;
  role: string;
  period: string;
  status: DeploymentStatus;
  cameras: number;
  type: string;
}

export interface SkillCategory {
  name: string;
  accent: 'cyan' | 'violet' | 'lime' | 'amber';
  skills: readonly string[];
}

export interface DeploymentBriefing {
  id: string;
  cardTitle: string;
  title: string;
  eyebrow: string;
  site: string;
  cardPeriod: string;
  period: string;
  cardCameras: number;
  cameras: number | null;
  status: DeploymentStatus;
  category: string;
  cardMetric?: string;
  cardDescription: string;
  structuredBrief: string;
  description: string;
  cardImage: string;
  image: string;
  imageAlt: string;
  tags: readonly string[];
  gallery: readonly string[];
}

export interface Certification {
  title: string;
  description: string;
}

export interface ContactDetails {
  email: string;
  phone: string;
  whatsappUrl: string;
  location: string;
  mapUrl: string;
  resumePath: string;
  availability: string;
  hireAvailability: string;
  responseTime: string;
}
