const blogImageModules = import.meta.glob('/src/content/blog/**/*.{png,jpg,jpeg,webp,avif,svg}', {
  eager: true,
  import: 'default'
}) as Record<string, any>;

const isExternal = (value: string) => /^(https?:)?\/\//.test(value);

const normalize = (value: string) => value.replace(/^\.\//, '');

export const resolveBlogImage = (slug: string, source?: string | null) => {
  if (!source) return undefined;
  if (isExternal(source)) return source;
  if (source.startsWith('/')) return source;

  const normalized = normalize(source);
  const directKey = `/src/content/blog/${slug}/${normalized}`;
  if (directKey in blogImageModules) {
    const module = blogImageModules[directKey];
    // 处理 import.meta.glob 返回的对象结构
    const result = typeof module === 'object' && module.src ? module.src : module;
    return typeof result === 'string' ? result : String(result);
  }

  const fallbackEntry = Object.entries(blogImageModules).find(([key]) => key.endsWith(`/${normalized}`));
  if (fallbackEntry) {
    const [, module] = fallbackEntry;
    // 处理 import.meta.glob 返回的对象结构
    const result = typeof module === 'object' && module.src ? module.src : module;
    return typeof result === 'string' ? result : String(result);
  }
  return source;
};
