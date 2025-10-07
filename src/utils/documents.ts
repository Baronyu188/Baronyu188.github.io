import { promises as fs } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const documentUrlMap = import.meta.glob('../content/sections/resources/library/*', {
  eager: true,
  import: 'default'
}) as Record<string, string>;

export interface DocumentEntry {
  title: string;
  description: string;
  linkLabel: string;
  href: string;
  ext?: string;
}

const SUPPORTED_EXTENSIONS = ['.pdf', '.doc', '.docx', '.ppt', '.pptx', '.txt', '.md', '.rtf'];

const LIBRARY_DIR = fileURLToPath(new URL('../content/sections/resources/library', import.meta.url));

const formatBytes = (bytes: number) => {
  if (!Number.isFinite(bytes) || bytes <= 0) return '';
  const units = ['B', 'KB', 'MB', 'GB'];
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / Math.pow(1024, index);
  return `${value.toFixed(value >= 10 || index === 0 ? 0 : 1)}${units[index]}`;
};

const normaliseTitle = (fileName: string) => {
  const name = fileName.replace(path.extname(fileName), '');
  return name.replace(/[-_]/g, ' ').replace(/\s+/g, ' ').trim();
};

export async function getLocalDocuments(): Promise<DocumentEntry[] | null> {
  try {
    const directoryStats = await fs.stat(LIBRARY_DIR).catch(() => null);
    if (!directoryStats || !directoryStats.isDirectory()) {
      return null;
    }

    const entries = await fs.readdir(LIBRARY_DIR, { withFileTypes: true });
    const files = entries.filter((entry) => entry.isFile());

    const documentFiles = files.filter((entry) => {
      const ext = path.extname(entry.name).toLowerCase();
      return SUPPORTED_EXTENSIONS.includes(ext);
    });

    if (documentFiles.length === 0) {
      return null;
    }

    const documents = await Promise.all(
      documentFiles.map(async (entry) => {
        const ext = path.extname(entry.name).toLowerCase();
        const filePath = path.join(LIBRARY_DIR, entry.name);
        const stats = await fs.stat(filePath);
        const updatedAt = new Intl.DateTimeFormat('zh-CN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        }).format(stats.mtime);

        const size = formatBytes(stats.size);
        const readableTitle = normaliseTitle(entry.name) || entry.name;

        const importKey = `../content/sections/resources/library/${entry.name}`;
        const href = documentUrlMap[importKey];
        if (!href) return null;

        return {
          title: readableTitle,
          description: [updatedAt, size ? `· ${size}` : ''].join(' ').trim(),
          linkLabel: `打开${ext.replace('.', '').toUpperCase() || '文档'}`,
          href,
          ext: ext.replace('.', '').toUpperCase()
        } satisfies DocumentEntry;
      })
    );

    return documents
      .filter((doc): doc is DocumentEntry => Boolean(doc))
      .sort((a, b) => a.title.localeCompare(b.title, 'zh-CN'));
  } catch (error) {
    console.error('[Resources] Failed to read local documents:', error);
    return null;
  }
}
