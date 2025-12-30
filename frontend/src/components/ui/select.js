import { h, defineComponent, ref, provide, inject, watch } from 'vue';

const SELECT_KEY = Symbol('simple-select');

export const Select = defineComponent({
  name: 'Select',
  props: {
    modelValue: { required: false },
    disabled: { type: Boolean, default: false },
    class: { type: [String, Object, Array], default: '' }
  },
  emits: ['update:modelValue'],
  setup(props, { emit, slots }) {
    const value = ref(props.modelValue);

    watch(() => props.modelValue, (v) => {
      value.value = v;
    });

    const setValue = (v) => {
      if (props.disabled) return;
      value.value = v;
      emit('update:modelValue', v);
    };

    provide(SELECT_KEY, {
      value,
      setValue,
      disabled: props.disabled
    });

    return () => h('div', { class: props.class }, slots.default ? slots.default() : null);
  }
});

export const SelectTrigger = defineComponent({
  name: 'SelectTrigger',
  props: { class: { type: [String, Object, Array], default: '' } },
  setup(props, { slots }) {
    return () => h('div', { class: props.class }, slots.default ? slots.default() : null);
  }
});

export const SelectValue = defineComponent({
  name: 'SelectValue',
  props: { placeholder: { type: String, default: '' }, class: { type: [String, Object, Array], default: '' } },
  setup(props, { slots }) {
    const ctx = inject(SELECT_KEY, null);
    return () => {
      const val = ctx && ctx.value && ctx.value.value !== undefined && ctx.value.value !== null ? ctx.value.value : '';
      return h('div', { class: props.class }, slots.default ? slots.default() : (val ? String(val) : props.placeholder));
    };
  }
});

export const SelectContent = defineComponent({
  name: 'SelectContent',
  props: { class: { type: [String, Object, Array], default: '' } },
  setup(props, { slots }) {
    return () => h('div', { class: props.class }, slots.default ? slots.default() : null);
  }
});

export const SelectItem = defineComponent({
  name: 'SelectItem',
  props: { value: { required: false }, class: { type: [String, Object, Array], default: '' } },
  setup(props, { slots }) {
    const ctx = inject(SELECT_KEY, null);
    const onClick = (e) => {
      if (ctx && typeof ctx.setValue === 'function') {
        ctx.setValue(props.value);
      }
    };
    return () => h('div', { class: props.class, role: 'button', tabindex: 0, onClick }, slots.default ? slots.default() : String(props.value));
  }
});

export default Select;
