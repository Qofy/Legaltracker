import { h } from 'vue';

const DropdownMenu = {
  name: 'UiDropdownMenu',
  setup(_, { slots }) {
    return () => h('div', { class: 'ui-dropdown-menu relative inline-block' }, slots.default ? slots.default() : []);
  },
};

const DropdownMenuTrigger = {
  name: 'UiDropdownMenuTrigger',
  setup(_, { slots }) {
    return () => h('div', { class: 'ui-dropdown-trigger inline-block' }, slots.default ? slots.default() : []);
  },
};

const DropdownMenuContent = {
  name: 'UiDropdownMenuContent',
  setup(_, { slots }) {
    return () => h('div', { class: 'ui-dropdown-content absolute bg-white rounded shadow' }, slots.default ? slots.default() : []);
  },
};

const DropdownMenuItem = {
  name: 'UiDropdownMenuItem',
  props: { as: { type: String, default: 'div' } },
  setup(props, { slots }) {
    return () => h(props.as, { class: 'ui-dropdown-item px-3 py-2 cursor-pointer hover:bg-gray-100' }, slots.default ? slots.default() : []);
  },
};

export { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem };
export default { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem };
