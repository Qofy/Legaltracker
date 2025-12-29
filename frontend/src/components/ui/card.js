import { defineComponent, h } from 'vue';

export const Card = defineComponent({
  name: 'UiCard',
  props: { class: { type: [String, Array, Object], default: '' } },
  setup(props, { slots }) {
    return () => h('div', { class: ['bg-white rounded shadow-sm', props.class] }, slots.default && slots.default());
  }
});

export const CardHeader = defineComponent({
  name: 'UiCardHeader',
  props: { class: { type: [String, Array, Object], default: '' } },
  setup(props, { slots }) {
    return () => h('div', { class: ['pb-3 px-4 pt-4 border-b border-gray-100', props.class] }, slots.default && slots.default());
  }
});

export const CardContent = defineComponent({
  name: 'UiCardContent',
  props: { class: { type: [String, Array, Object], default: '' } },
  setup(props, { slots }) {
    return () => h('div', { class: ['p-4', props.class] }, slots.default && slots.default());
  }
});

export const CardTitle = defineComponent({
  name: 'UiCardTitle',
  props: { class: { type: [String, Array, Object], default: '' } },
  setup(props, { slots }) {
    return () => h('h3', { class: ['text-base font-semibold', props.class] }, slots.default && slots.default());
  }
});

export default {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
};
