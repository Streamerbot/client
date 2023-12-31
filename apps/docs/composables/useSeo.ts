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

  defineOgImage({
    path: page.value?._path,
    url: 'https://streamerbot.github.io/client/og-image.png',
  });

  useSeoMeta({
    titleTemplate: '%s | Streamer.bot WebSocket Client',
    title: page.value?.title ?? '',
    ogUrl: `https://streamerbot.github.io/client${page.value?._path ?? ''}`,
    ogTitle: `${page.value?.title}`,
    ogDescription: page.value?.description,
  });
}