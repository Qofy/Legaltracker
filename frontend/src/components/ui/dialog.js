import { defineComponent, h, ref, provide, inject, watch } from 'vue';

const DialogContextKey = Symbol('DialogContext');

export const Dialog = defineComponent({
  name: 'UiDialog',
  props: {
    modelValue: { type: Boolean, default: false }
  },
  emits: ['update:modelValue'],
  setup(props, { emit, slots }) {
    const open = ref(!!props.modelValue);
    const setOpen = (v) => {
      open.value = v;
      emit('update:modelValue', v);
    };

    provide(DialogContextKey, { open, setOpen });

    watch(() => props.modelValue, (v) => { open.value = !!v; });

    return () => h('div', { class: 'ui-dialog' }, slots.default && slots.default());
  }
});

export const DialogContent = defineComponent({
  name: 'UiDialogContent',
  setup(_, { slots }) {
    return () => h('div', { class: 'ui-dialog-content' }, slots.default && slots.default());
  }
});

export const DialogHeader = defineComponent({
  name: 'UiDialogHeader',
  setup(_, { slots }) {
    return () => h('div', { class: 'ui-dialog-header' }, slots.default && slots.default());
  }
});

export const DialogTitle = defineComponent({
  name: 'UiDialogTitle',
  setup(_, { slots }) {
    return () => h('h3', { class: 'ui-dialog-title' }, slots.default && slots.default());
  }
});

export const DialogTrigger = defineComponent({
  name: 'UiDialogTrigger',
  props: { asChild: { type: Boolean, default: false } },
  setup(props, { slots }) {
    const ctx = inject(DialogContextKey, null);
    const toggle = () => {
      if (!ctx) return;
      ctx.setOpen(!ctx.open.value);
    };

    return () => {
      const slot = slots.default && slots.default();
      if (!slot) return null;

      // If asChild is true, wrap the provided child to capture click
      if (props.asChild) {
        return h('span', { onClick: toggle }, slot);
      }

      // default: render a button that toggles dialog
      return h('button', { type: 'button', onClick: toggle, class: 'ui-dialog-trigger' }, slot);
    };
  }
});

export default Dialog;
