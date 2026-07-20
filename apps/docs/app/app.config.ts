export default defineAppConfig({
  ui: {
    colors: {
      primary: 'sky',
      neutral: 'neutral',
    },

    table: {
      slots: {
        th: 'px-2 py-1.5 text-muted',
        td: 'px-1 pt-2 pb-1.5 align-top',
      },
    },

    prose: {
      th: {
        base: 'px-2 pt-2.5 pb-1.5 text-toned',
      },
      td: {
        base: 'px-2 pt-2.5 pb-1.5 align-baseline',
      },
    },

    contentToc: {
      defaultVariants: {
        highlight: true,
        highlightVariant: 'circuit',
      },
    },
  },
});
