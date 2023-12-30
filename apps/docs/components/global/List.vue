<script lang="ts">
const iconTypeMap = {
  primary: 'heroicons-outline:check',
  info: 'heroicons-outline:information-circle',
  success: 'heroicons-outline:check-circle',
  warning: 'heroicons-outline:exclamation',
  danger: 'heroicons-outline:exclamation-circle'
}

const colorTypeMap = {
  primary: 'text-primary-400 bg-primary-900/25',
  info: 'text-blue-400',
  success: 'text-green-400',
  warning: 'text-amber-400',
  danger: 'text-red-400'
}

export default defineComponent({
  props: {
    /**
     * Used to override the default <code>type</code> icon, check out the
     *  <a href="https://github.com/nuxt/content/tree/dev/packages/theme-docs/src/components/global/icons">icons available</a>
     */
    icon: {
      type: String,
      default: null
    },
    /**
     * Type of list
     */
    type: {
      type: String,
      default: 'primary',
      validator: (value: string) => ['primary', 'info', 'success', 'warning', 'danger'].includes(value)
    }
  },
  setup (props) {
    const slots = useSlots()

    const { flatUnwrap, unwrap } = useUnwrap()

    const iconName = computed(() => props.icon || (iconTypeMap as any)[props.type])

    // Usage of render function is mandatory to access default slot
    // Otherwise Vue warns that slot "default" was invoked outside of the render function
    return () => {
      const items = flatUnwrap((slots.default && slots.default()) ?? [], ['ul']).map(li => unwrap(li, ['li']))

      return h(
        'ul',
        items.map(item =>
          h('li', [
            h('span', { class: `list-icon h-6 w-6 rounded-full ${colorTypeMap[props.type]}` }, h(resolveComponent('icon'), { name: iconName.value, class: 'icon h-full w-full' })),
            h('span', h(resolveComponent('ContentSlot'), { use: () => item }))
          ])
        )
      )
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