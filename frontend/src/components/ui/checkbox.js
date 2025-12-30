import { h, ref } from 'vue';

const Checkbox = {
  name: 'UiCheckbox',
  props: {
    modelValue: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const local = ref(!!props.modelValue);
    const toggle = () => {
      if (props.disabled) return;
      local.value = !local.value;
      emit('update:modelValue', local.value);
    };
    return () => h('button', {
      type: 'button',
      role: 'checkbox',
      'aria-checked': local.value,
      class: ['ui-checkbox inline-flex items-center justify-center w-5 h-5 border rounded', local.value ? 'bg-[#003aca] text-white' : 'bg-white'],
      onClick: toggle,
      disabled: props.disabled,
    }, local.value ? '✓' : '');
  },
};

export { Checkbox };
export default Checkbox;
