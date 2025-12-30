import { h } from 'vue';

const Label = {
  name: 'UiLabel',
  props: {
    for: { type: String, default: null },
    class: { type: [String, Array, Object], default: '' },
  },
  setup(props, { slots }) {
    return () => h('label', { for: props.for, class: ['ui-label text-sm text-gray-700', props.class] }, slots.default ? slots.default() : []);
  },
};

export { Label };
export default Label;
