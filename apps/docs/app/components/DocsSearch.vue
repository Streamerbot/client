<script setup lang="ts">
import type { Link } from '#ui-pro/types';
import type { Command, Group } from '#ui/types';
import type { NavItem, ParsedContent } from '@nuxt/content/dist/runtime/types';
import { useBreakpoints } from '@vueuse/core';
import type { UseFuseOptions } from '@vueuse/integrations/useFuse';
import { defu } from 'defu';

const config = {
  padding: 'p-0 sm:p-4',
  rounded: 'rounded-none sm:rounded-lg',
  width: 'sm:max-w-3xl',
  height: 'h-screen sm:h-[28rem]',
  commandPalette: {
    input: {
      height: 'h-[--header-height] sm:h-12',
      icon: {
        size: 'h-5 w-5',
        padding: 'ps-11',
      },
    },
    group: {
      command: {
        // eslint-disable-next-line quotes
        prefix: `!text-foreground after:content-['_>']`,
      },
    },
    container: 'scroll-py-10',
    closeButton: {
      icon: 'i-heroicons-x-mark-20-solid',
      color: 'gray' as const,
      variant: 'ghost' as const,
      size: 'xs' as const,
    },
  },
  fileIcon: {
    name: 'i-heroicons-document-text',
  },
};

const props = defineProps<{
  files?: ParsedContent[];
  navigation?: NavItem[];
  links?: Link[];
  groups?: Group[];
  fuse?: UseFuseOptions<Command>;
  ui?: Partial<typeof config>;
}>();

const router = useRouter();
const { navKeyFromPath } = useContentHelpers();
const { usingInput } = useShortcuts();
const { isDocsSearchModalOpen } = useUIState();
const breakpoints = useBreakpoints({ mobile: 640 });
const { ui, attrs } = useUI('docs.search', toRef(props, 'ui'), config, undefined, true);

const isXs = breakpoints.smaller('mobile');

const commandPaletteRef = ref<HTMLElement & { query: Ref<string>; results: { item: Command }[] }>();

function fileIcon(file) {
  if (file.icon) return file.icon;
  if (file.navigation?.icon) return file.navigation.icon;
  if (props.navigation) {
    file.icon = navKeyFromPath(file._path as string, 'icon', props.navigation);
  }
  return file.icon || ui.value.fileIcon.name;
}

// Computed

const fuse: ComputedRef<Partial<UseFuseOptions<Command>>> = computed(() =>
  defu({}, props.fuse, {
    fuseOptions: {
      ignoreLocation: true,
      includeMatches: true,
      threshold: 0.1,
      keys: [
        { name: 'title', weight: 5 },
        { name: 'label', weight: 5 },
        { name: 'suffix', weight: 3 },
        'children.children.value',
        'children.children.children.value',
        'children.children.children.children.value',
      ],
    },
    resultLimit: 12,
  })
);

const groups = computed<Group[]>(() => {
  return [
    props.links?.length && {
      key: 'links',
      label: 'Links',
      commands: props.links
        .flatMap((link) => {
          return [
            link.to && {
              id: router.resolve(link.to).fullPath,
              ...link,
              icon: link.icon || ui.value.fileIcon.name,
            },
            ...(link.children || []).map((child) => {
              return {
                id: router.resolve(child.to).fullPath,
                prefix: link.label,
                suffix: child.description,
                ...child,
                icon: child.icon || link.icon || ui.value.fileIcon.name,
              };
            }),
          ];
        })
        .filter(Boolean),
    },
    ...(props.navigation || []).map((link) => {
      return {
        key: link._path,
        label: link.title,
        commands: props.files
          .filter((file) => file._path?.startsWith(link._path))
          .flatMap((file) => {
            const category = findPageBreadcrumb(props.navigation, file).slice(1, 4)?.filter(
              (child) =>
                file._path.startsWith(child._path) &&
                file._path !== child._path &&
                child.children?.length
            )?.map(c => c.title).join(' > ');

            return [
              {
                id: file._id,
                label: file.navigation?.title || file.title,
                title: file.navigation?.title || file.title,
                prefix: category,
                to: file._path,
                suffix: file.description,
                icon: fileIcon(file), // @ts-ignore
              },
              ...Object.entries(groupByHeading(file.body.children)).map(
                ([hash, { title, children }]) => {
                  if (!title) {
                    return;
                  }

                  return {
                    id: `${file._path}${hash}`,
                    label: title,
                    prefix:
                      (category ? `${category} > ` : '') +
                      `${file.navigation?.title || file.title}`,
                    to: `${file._path}${hash}`,
                    children: concatChildren(children),
                    icon: fileIcon(file),
                    child: true,
                  };
                }
              ),
            ].filter(Boolean);
          }),
        filter: (query, commands) => {
          if (!query) {
            return commands?.filter((command) => !command.child);
          }

          return commands;
        },
      };
    }),
  ].filter(Boolean);
});

// avoid conflicts between multiple meta_k shortcuts
const canToggleModal = computed(() => isDocsSearchModalOpen.value || !usingInput.value);

// Methods
function remapChildren(children: any[]) {
  return children?.map((grandChild) => {
    if (['code', 'code-inline', 'em', 'a', 'strong'].includes(grandChild.tag)) {
      return {
        type: 'text',
        value: grandChild.children.find((child) => child.type === 'text')?.value || '',
      };
    }

    return grandChild;
  });
}

function concatChildren(children: any[]) {
  return children.map((child) => {
    if (['callout'].includes(child.tag)) {
      child.children = concatChildren(child.children);
    }
    if (child.tag === 'p') {
      child.children = remapChildren(child.children);

      child.children = child.children?.reduce((acc, grandChild) => {
        if (grandChild.type === 'text') {
          if (acc.length && acc[acc.length - 1].type === 'text') {
            acc[acc.length - 1].value += grandChild.value;
          } else {
            acc.push(grandChild);
          }
        } else {
          acc.push(grandChild);
        }
        return acc;
      }, []);
    }
    if (['style'].includes(child.tag)) {
      return null;
    }

    return child;
  });
}

function groupByHeading(children: any[]) {
  const groups = {}; // grouped by path
  let hash = ''; // file.page with potential `#anchor` concat
  let title: string | null;
  for (const node of children) {
    // if heading found, udpate current path
    if (['h2', 'h3'].includes(node.tag)) {
      // find heading text value
      title = node.children
        ?.map((child) => {
          if (child.type === 'text') {
            return child.value;
          }

          if (['code', 'code-inline', 'em', 'a', 'strong'].includes(child.tag)) {
            return child.children?.find((child) => child.type === 'text')?.value;
          }
        })
        .filter(Boolean)
        .join(' ');

      if (title) {
        hash = `#${node.props.id}`;
      }
    }
    // push to existing/new group based on path
    if (groups[hash]) {
      groups[hash].children.push(node);
    } else {
      groups[hash] = { children: [node], title };
    }
  }
  return groups;
}

function onSelect(option) {
  isDocsSearchModalOpen.value = false;

  if (option.click) {
    option.click();
  } else if (option.to) {
    if (option.target === '_blank' || option.to.startsWith('http')) {
      window.open(option.to, option.target || '_blank');
    } else {
      router.push(option.to);
    }
  } else if (option.href) {
    window.open(option.href, '_blank');
  }
}

// Shortcuts
defineShortcuts({
  meta_k: {
    usingInput: true,
    whenever: [canToggleModal],
    handler: () => {
      isDocsSearchModalOpen.value = !isDocsSearchModalOpen.value;
    },
  },
  escape: {
    usingInput: true,
    whenever: [isDocsSearchModalOpen],
    handler: () => {
      isDocsSearchModalOpen.value = false;
    },
  },
});

// Expose
defineExpose({
  commandPaletteRef,
});
</script>

<template>
  <UModal
    v-model="isDocsSearchModalOpen"
    :overlay="!isXs"
    :transition="!isXs"
    :ui="ui"
    v-bind="attrs"
  >
    <UCommandPalette
      ref="commandPaletteRef"
      :groups="groups"
      :ui="ui.commandPalette"
      :close-button="ui.commandPalette.closeButton"
      :fuse="fuse"
      @update:model-value="onSelect"
      @close="isDocsSearchModalOpen = false"
    />
  </UModal>
</template>
