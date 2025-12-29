import { defineComponent, h } from 'vue';

export const Badge = defineComponent({
  name: 'UiBadge',
  props: {
    variant: { type: String, default: 'default' },
    class: { type: [String, Array, Object], default: '' },
  },
  setup(props, { slots }) {
    const classes = ['inline-flex items-center px-2 py-0.5 rounded text-xs font-medium', props.class];
    return () => h('span', { class: classes }, slots.default && slots.default());
  }
});

export default Badge;
