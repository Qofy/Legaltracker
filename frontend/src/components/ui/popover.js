import { h } from 'vue';

const Popover = {
  name: 'UiPopover',
  setup(_, { slots }) {
    return () => h('div', { class: 'ui-popover relative block' }, slots.default ? slots.default() : []);
  },
};

const PopoverTrigger = {
  name: 'UiPopoverTrigger',
  setup(_, { slots }) {
    return () => h('div', { class: 'ui-popover-trigger block' }, slots.default ? slots.default() : []);
  },
};

const PopoverContent = {
  name: 'UiPopoverContent',
  props: { side: { type: String, default: 'bottom' } },
  setup(props, { slots }) {
    return () => h('div', { class: `ui-popover-content absolute ${props.side}` }, slots.default ? slots.default() : []);
  },
};

export { Popover, PopoverContent, PopoverTrigger };
export default { Popover, PopoverContent, PopoverTrigger };
