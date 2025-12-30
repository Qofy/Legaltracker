import { h } from 'vue';

export const Textarea = {
  name: 'UiTextareaShim',
  props: {
    modelValue: { type: [String, Number], default: '' },
    rows: { type: [String, Number], default: 4 },
    placeholder: { type: String, default: '' },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const onInput = (e) => emit('update:modelValue', e.target.value);
    return () => h('textarea', {
      class: 'ui-textarea w-full p-2 border rounded',
      rows: props.rows,
      placeholder: props.placeholder,
      value: props.modelValue,
      onInput,
    });
  },
};

export default Textarea;
