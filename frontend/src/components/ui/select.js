import { h, defineComponent } from 'vue';

const make = (name) => defineComponent({
  name,
  props: ['class'],
  setup(props, { slots }) {
    return () => h('div', { class: props.class }, slots.default ? slots.default() : null);
  }
});

export const Select = make('Select');
export const SelectTrigger = make('SelectTrigger');
export const SelectValue = make('SelectValue');
export const SelectContent = make('SelectContent');
export const SelectItem = make('SelectItem');

export default Select;
