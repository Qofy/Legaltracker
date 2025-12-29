import { defineComponent, h } from 'vue';

export const Button = defineComponent({
  name: 'UiButton',
  props: {
    variant: { type: String, default: 'default' },
    size: { type: String, default: 'md' },
    class: { type: [String, Array, Object], default: '' },
  },
  setup(props, { slots, attrs }) {
    const classes = ['inline-flex items-center justify-center rounded', props.class];
    return () => h('button', { class: classes, ...attrs }, slots.default && slots.default());
  }
});

export default Button;
