import { defineComponent, h } from 'vue';

export const Progress = defineComponent({
  name: 'UiProgress',
  props: {
    value: { type: Number, default: 0 },
    max: { type: Number, default: 100 },
    class: { type: [String, Array, Object], default: '' },
  },
  setup(props) {
    const pct = Math.max(0, Math.min(100, (props.value / props.max) * 100));
    return () => h('div', { class: ['w-full bg-gray-200 rounded overflow-hidden', props.class] }, [
      h('div', { style: { width: `${pct}%`, height: '8px', background: '#06b6d4' } })
    ]);
  }
});

export default Progress;
