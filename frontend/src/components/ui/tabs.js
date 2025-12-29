import { defineComponent, h, provide, inject, ref, watch } from 'vue';

const TabsContextKey = Symbol('TabsContext');

export const Tabs = defineComponent({
  name: 'UiTabs',
  props: { defaultValue: { type: String, default: null } },
  setup(props, { slots }) {
    const value = ref(props.defaultValue);
    const setValue = (v) => { value.value = v; };
    provide(TabsContextKey, { value, setValue });
    watch(() => props.defaultValue, (v) => { value.value = v });
    return () => h('div', { class: 'ui-tabs' }, slots.default && slots.default());
  }
});

export const TabsList = defineComponent({
  name: 'UiTabsList',
  setup(_, { slots }) {
    return () => h('div', { class: 'ui-tabs-list flex space-x-2' }, slots.default && slots.default());
  }
});

export const TabsTrigger = defineComponent({
  name: 'UiTabsTrigger',
  props: { value: { type: [String, Number], required: true }, class: { type: [String, Array, Object], default: '' } },
  setup(props, { slots }) {
    const ctx = inject(TabsContextKey, null);
    const handleClick = () => { if (ctx) ctx.setValue(props.value); };
    return () => h('button', { type: 'button', class: ['px-3 py-1 rounded', props.class, (ctx && ctx.value && ctx.value.value === props.value) ? 'bg-blue-600 text-white' : 'bg-transparent'], onClick: handleClick }, slots.default && slots.default());
  }
});

export const TabsContent = defineComponent({
  name: 'UiTabsContent',
  props: { value: { type: [String, Number], required: true } },
  setup(props, { slots }) {
    const ctx = inject(TabsContextKey, null);
    return () => {
      if (!ctx) return null;
      return ctx.value && ctx.value.value === props.value ? h('div', { class: 'ui-tabs-content' }, slots.default && slots.default()) : null;
    };
  }
});

export default Tabs;
