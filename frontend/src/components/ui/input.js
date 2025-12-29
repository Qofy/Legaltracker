import { defineComponent, h } from 'vue';

export const Input = defineComponent({
  name: 'UiInput',
  props: {
    modelValue: { type: [String, Number], default: '' },
    type: { type: String, default: 'text' },
    placeholder: { type: String, default: '' },
    id: { type: String, default: null },
    disabled: { type: Boolean, default: false },
    class: { type: [String, Array, Object], default: '' },
  },
  emits: ['update:modelValue'],
  setup(props, { emit, attrs }) {
    return () => h('input', {
      id: props.id,
      type: props.type,
      placeholder: props.placeholder,
      value: props.modelValue,
      disabled: props.disabled,
      class: ['px-3 py-2 border rounded w-full', props.class],
      onInput: (e) => emit('update:modelValue', e.target.value),
      ...attrs
    });
  }
});

export default Input;
