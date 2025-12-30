import { h } from 'vue';

const ScrollArea = {
  name: 'UiScrollArea',
  props: {
    horizontal: { type: Boolean, default: false },
    class: { type: [String, Array, Object], default: '' },
    style: { type: [String, Object], default: '' },
  },
  setup(props, { slots }) {
    const overflow = props.horizontal ? 'auto hidden' : 'auto';
    return () => h('div', {
      class: ['ui-scroll-area', props.class],
      style: Object.assign({ overflow: overflow }, typeof props.style === 'string' ? {} : props.style),
    }, slots.default ? slots.default() : []);
  },
};

export { ScrollArea };
export default ScrollArea;
