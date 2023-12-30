import type { NavItem, ParsedContent } from '@nuxt/content/dist/runtime/types';

type OgImageOptions = {
  component: 'OgImageDefault';
}

const defaultOptions: OgImageOptions = {
  component: 'OgImageDefault',
};

/**
 * Automatically generate SEO meta tags
 * Automatically generate OpenGraph images for each page using `nuxt-og-image`
 */
export function useSeo(page: Ref<ParsedContent>, options: OgImageOptions = defaultOptions) {
  if (!page?.value) return;

  const route = useRoute();
  const navigation = inject<ComputedRef<NavItem[]>>('fullNavigation');
  const { navKeyFromPath } = useContentHelpers();

  // Grab any manually set category
  const category = navKeyFromPath(
    route.path.slice(0, route.path.lastIndexOf('/')),
    'category',
    navigation.value
  );

  // Grab root parent title/icon as fallbacks
  const parentPath = route.path?.split('/').at(1) ?? '';
  const parentTitle = parentPath
    ? navKeyFromPath(`/${parentPath}`, 'title', navigation.value)
    : undefined;
  const parentIcon = parentPath
    ? navKeyFromPath(`/${parentPath}`, 'icon', navigation.value)
    : undefined;

  if (page.value?.ogImage !== false) {
    defineOgImage({
      component: options.component ?? defaultOptions.component,
      title: page.value?.title ?? 'Docs',
      description: page.value?.description,
      icon: page.value?.icon ?? category?.icon ?? false,
      siteName: 'Streamer.bot WebSocket Client',
      categoryTitle: category?.title ?? parentTitle,
      categoryIcon: category?.icon ?? parentIcon,
      cacheKey: btoa(`${route.path}:${page.value?.title ?? 'Docs'}:${category?.title ?? parentTitle}`),
      cacheTtl: 60 * 60 * 24 * 30, // 30 days
    });
  }

  useSeoMeta({
    titleTemplate: '%s | Streamer.bot WebSocket Client',
    title: page.value?.title ?? '',
    ogUrl: `https://streamerbot.github.io${page.value?._path ?? ''}`,
    ogTitle: `${page.value?.title}`,
    ogDescription: page.value?.description,
  });
}