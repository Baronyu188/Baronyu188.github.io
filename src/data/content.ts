import type {
  ActivityItem,
  CourseItem,
  FaqItem,
  GalleryImage,
  HighlightItem,
  HighlightScene,
  HeroContent,
  HeroCommand,
  JoinForm,
  NavLink,
  ProjectItem,
  ResourceItem,
  SectionMetadata,
  TeamMember
} from './types';
import { getLocalDocuments, type DocumentEntry } from '../utils/documents';

import siteConfigJson from '../content/sections/site/config.json';
import highlightsConfigJson from '../content/sections/highlights/config.json';
import activitiesConfigJson from '../content/sections/activities/config.json';
import coursesConfigJson from '../content/sections/courses/config.json';
import projectsConfigJson from '../content/sections/projects/config.json';
import teamConfigJson from '../content/sections/team/config.json';
import resourcesConfigJson from '../content/sections/resources/config.json';
import faqsConfigJson from '../content/sections/faqs/config.json';
import galleryConfigJson from '../content/sections/gallery/config.json';
import blogConfigJson from '../content/sections/blog/config.json';

const galleryAssetModules = import.meta.glob('../content/sections/gallery/media/*.{png,jpg,jpeg,webp,avif,svg}', {
  eager: true,
  import: 'default'
}) as Record<string, string>;

const projectAssetModules = import.meta.glob('../content/sections/projects/media/*', {
  eager: true,
  import: 'default'
}) as Record<string, string>;

const teamAssetModules = import.meta.glob('../content/sections/team/media/*', {
  eager: true,
  import: 'default'
}) as Record<string, string>;

const toFileName = (filePath: string) => filePath.split('/').pop() ?? filePath;

const mapAssets = (modules: Record<string, any>) =>
  Object.fromEntries(Object.entries(modules).map(([key, value]) => {
    const fileName = toFileName(key);
    // 处理 import.meta.glob 返回的对象结构
    const imagePath = typeof value === 'object' && value.src ? value.src : value;
    return [fileName, imagePath];
  })) as Record<string, string>;

const galleryAssets = mapAssets(galleryAssetModules);
const projectAssets = mapAssets(projectAssetModules);
const teamAssets = mapAssets(teamAssetModules);

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value));
const toOrderValue = (value?: number) => (value ?? Number.MAX_SAFE_INTEGER);

const sortByOrder = <T extends { order?: number }>(entries: T[]) =>
  [...entries].sort((a, b) => toOrderValue(a.order) - toOrderValue(b.order));

interface SiteConfig {
  navLinks: NavLink[];
  hero: HeroContent & { commands?: HeroCommand[] };
  projectDirections: string[];
  joinForm: JoinForm;
}

interface HighlightsConfig {
  metadata: SectionMetadata;
  scenes: HighlightScene[];
  items: HighlightItem[];
}

interface ActivitiesConfig {
  metadata: SectionMetadata;
  items: ActivityItem[];
}

interface CoursesConfig {
  metadata: SectionMetadata;
  items: CourseItem[];
}

interface ProjectsConfig {
  metadata: SectionMetadata;
  items: (ProjectItem & { image: string })[];
}

interface TeamConfig {
  metadata: SectionMetadata;
  fallbackImage: string;
  members: (TeamMember & { image?: string })[];
}

interface ResourcesConfig {
  metadata: SectionMetadata;
  items: ResourceItem[];
}

interface FaqsConfig {
  metadata: SectionMetadata;
  items: FaqItem[];
}

interface GalleryConfig {
  metadata: SectionMetadata;
}

interface BlogConfig {
  metadata: {
    title: string;
    description: string;
    searchPlaceholder: string;
    sortOptions: Array<{ label: string; value: string }>;
  };
}

const siteConfig = siteConfigJson as SiteConfig;
const highlightsConfig = highlightsConfigJson as HighlightsConfig;
const activitiesConfig = activitiesConfigJson as ActivitiesConfig;
const coursesConfig = coursesConfigJson as CoursesConfig;
const projectsConfig = projectsConfigJson as ProjectsConfig;
const teamConfig = teamConfigJson as TeamConfig;
const resourcesConfig = resourcesConfigJson as ResourcesConfig;
const faqsConfig = faqsConfigJson as FaqsConfig;
const galleryConfig = galleryConfigJson as GalleryConfig;
const blogConfig = blogConfigJson as BlogConfig;

const normaliseAlt = (value: string) => {
  const withoutExt = value.replace(/\.[^.]+$/, '');
  return withoutExt.replace(/[-_]+/g, ' ').trim();
};

export async function getNavLinks(): Promise<NavLink[]> {
  return clone(siteConfig.navLinks);
}

export async function getHeroContent(): Promise<HeroContent> {
  return clone(siteConfig.hero);
}

export async function getJoinForm(): Promise<JoinForm> {
  return clone(siteConfig.joinForm);
}

export async function getProjectDirections(): Promise<string[]> {
  return [...new Set(siteConfig.projectDirections)];
}

export async function getIntroHighlights(): Promise<HighlightItem[]> {
  return sortByOrder(highlightsConfig.items.map((item) => clone(item)));
}

export async function getHighlightsMetadata(): Promise<SectionMetadata> {
  return clone(highlightsConfig.metadata);
}

export async function getHighlightScenes(): Promise<HighlightScene[]> {
  return highlightsConfig.scenes.map((scene) => clone(scene));
}

export async function getActivities(): Promise<ActivityItem[]> {
  return sortByOrder(activitiesConfig.items.map((item) => clone(item)));
}

export async function getActivitiesMetadata(): Promise<SectionMetadata> {
  return clone(activitiesConfig.metadata);
}

export async function getCourseTracks(): Promise<CourseItem[]> {
  return sortByOrder(coursesConfig.items.map((item) => clone(item)));
}

export async function getCoursesMetadata(): Promise<SectionMetadata> {
  return clone(coursesConfig.metadata);
}

export async function getProjectContent() {
  const resolvedProjects = sortByOrder(
    projectsConfig.items.map((item) => ({
      ...clone(item),
      image: item.image ? projectAssets[item.image] ?? '' : ''
    }))
  ) as ProjectItem[];

  const baseDirections = await getProjectDirections();
  const dynamicDirections = resolvedProjects.map((project) => project.direction);
  const directions = Array.from(new Set(['全部', ...baseDirections, ...dynamicDirections]));

  return {
    metadata: clone(projectsConfig.metadata),
    directions,
    projects: resolvedProjects
  };
}

export async function getTeamMembers(): Promise<TeamMember[]> {
  return sortByOrder(
    teamConfig.members.map((member) => ({
      ...clone(member),
      image: member.image ? teamAssets[member.image] ?? '' : undefined
    }))
  );
}

export async function getTeamMetadata(): Promise<SectionMetadata> {
  return clone(teamConfig.metadata);
}

export function getTeamFallbackImage(): string {
  const fallback = teamConfig.fallbackImage;
  return fallback ? teamAssets[fallback] ?? '' : '';
}

export async function getResourceCards(): Promise<Array<ResourceItem | DocumentEntry>> {
  const baseCards = sortByOrder(resourcesConfig.items.map((item) => clone(item)));
  const localDocs = await getLocalDocuments();
  if (localDocs && localDocs.length > 0) {
    return [...baseCards, ...localDocs];
  }
  return baseCards;
}

export async function getResourcesMetadata(): Promise<SectionMetadata> {
  return clone(resourcesConfig.metadata);
}

export async function getFaqs(): Promise<FaqItem[]> {
  return sortByOrder(faqsConfig.items.map((item) => clone(item)));
}

export async function getFaqMetadata(): Promise<SectionMetadata> {
  return clone(faqsConfig.metadata);
}

export async function getGalleryImages(): Promise<GalleryImage[]> {
  const entries = Object.entries(galleryAssets).map(([fileName, src]) => ({
    src,
    alt: normaliseAlt(fileName)
  }));
  return entries.sort((a, b) => a.alt.localeCompare(b.alt, 'zh-CN'));
}

export async function getGalleryMetadata(): Promise<SectionMetadata> {
  return clone(galleryConfig.metadata);
}

export async function getBlogMetadata() {
  return clone(blogConfig.metadata);
}
