export interface NavLink {
  label: string;
  href: string;
}

export interface HeroCommand {
  command: string;
  description?: string;
}

export interface HeroMetric {
  label: string;
  value: string;
}

export interface HeroAction {
  label: string;
  href: string;
}

export interface HeroContent {
  title: string;
  subtitle: string;
  description: string;
  primaryAction: HeroAction;
  secondaryAction: HeroAction;
  metrics: HeroMetric[];
  commands?: HeroCommand[];
  asciiArt?: string[];
}

export interface JoinFormField {
  id: string;
  label: string;
  placeholder?: string;
  type?: string;
  required?: boolean;
}

export interface JoinForm {
  title: string;
  description: string;
  fields: JoinFormField[];
}

export interface SectionMetadata {
  id: string;
  label: string;
  title: string;
  description: string;
  instructions?: string;
  actions?: Array<{
    label: string;
    href: string;
    variant?: 'primary' | 'ghost';
  }>;
}

export interface OrderedItem {
  order?: number;
}

export interface HighlightItem extends OrderedItem {
  title: string;
  description: string;
}

export interface HighlightScene {
  label: string;
  gradient: string;
  accent: string;
}

export interface ActivityItem extends OrderedItem {
  title: string;
  timeframe: string;
  description: string;
}

export interface CourseItem extends OrderedItem {
  title: string;
  detail: string;
  format: string;
  focus: string;
}

export interface ProjectItem extends OrderedItem {
  title: string;
  direction: string;
  description: string;
  outcome: string;
  image?: string;
}

export interface TeamMember extends OrderedItem {
  name: string;
  role: string;
  bio: string;
  image?: string;
}

export interface ResourceItem extends OrderedItem {
  title: string;
  description: string;
  linkLabel: string;
  href: string;
}

export interface FaqItem extends OrderedItem {
  question: string;
  answer: string;
}

export interface GalleryImage {
  src: string;
  alt: string;
}
