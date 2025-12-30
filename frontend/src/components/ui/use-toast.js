import { ref } from 'vue';

const toasts = ref([]);
let toastId = 0;

export function useToast() {
  const toast = ({ title, description, variant = 'default', duration = 3000 }) => {
    const id = toastId++;
    const toastItem = {
      id,
      title,
      description,
      variant,
      visible: true
    };

    toasts.value.push(toastItem);

    if (duration > 0) {
      setTimeout(() => {
        dismiss(id);
      }, duration);
    }

    return { id };
  };

  const dismiss = (id) => {
    const index = toasts.value.findIndex(t => t.id === id);
    if (index !== -1) {
      toasts.value.splice(index, 1);
    }
  };

  return {
    toast,
    dismiss,
    toasts
  };
}
