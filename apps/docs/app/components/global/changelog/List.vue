<script lang="ts">
export default defineComponent({
  name: 'ChangelogList',

  props: {
    type: {
      type: String,
      default: 'new'
    }
  },

  setup (props) {
    const slots = useSlots()
    const { flatUnwrap, unwrap } = useUnwrap()

    const iconMap: Record<string, string> = {
      new: 'mdi:plus',
      update: 'mdi:circle-edit-outline',
      fix: 'mdi:bug-check-outline',
      remove: 'mdi:minus',
      deprecated: 'mdi:alert-circle-outline'
    };
    const iconName = iconMap[props.type] ?? 'mdi:check';

    const colorTypeMap = {
      new: 'text-green-400 bg-green-900/25',
      update: 'text-blue-400 bg-blue-900/25',
      fix: 'text-amber-400 bg-amber-900/25',
      remove: 'text-red-400 bg-amber-900/25',
      deprecated: 'text-red-400 bg-red-900/25'
    }


    return () => {
      const newItems = flatUnwrap((slots.default && slots.default()) ?? [], ['ul']).map(li => unwrap(li, ['li']))

      return h('ul',
        newItems.map(item =>
          h('li', [
            h('span', { class: `list-icon h-6 w-6 rounded-full ${colorTypeMap[props.type]}` }, h(resolveComponent('icon'), { name: iconName, class: 'icon' })),
            h('span', h(resolveComponent('ContentSlot'), { use: () => item }))
          ])
        )
      );
    }
  }
})
</script>


<style scoped>
ul {
  padding-left: 0;
}

li {
  display: flex;
  align-items: flex-start;
  margin-bottom: 0.5rem;
}

li:last-child {
  margin-bottom: 0;
}

.list-icon {
  padding: 1px;
  margin-top: 3px;
  margin-inline-end: 0.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>