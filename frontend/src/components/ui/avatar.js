import { defineComponent, h } from 'vue';

export const Avatar = defineComponent({
  name: 'UiAvatar',
  props: {
    src: { type: String, default: '' },
    alt: { type: String, default: 'avatar' },
    size: { type: [String, Number], default: 32 },
    class: { type: [String, Array, Object], default: '' },
  },
  setup(props, { slots }) {
    const sizeStyle = { width: `${props.size}px`, height: `${props.size}px` };
    return () => h('div', { class: ['inline-flex rounded-full overflow-hidden', props.class], style: sizeStyle }, [
      props.src ? h('img', { src: props.src, alt: props.alt, style: { width: '100%', height: '100%', objectFit: 'cover' } }) : (slots.fallback ? slots.fallback() : h('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', background: '#ddd' } }, props.alt[0] || '?'))
    ]);
  }
});

export const AvatarFallback = defineComponent({
  name: 'UiAvatarFallback',
  setup(_, { slots }) {
    return () => slots.default && slots.default();
  }
});

export default Avatar;
