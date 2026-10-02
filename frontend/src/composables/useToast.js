import { reactive } from 'vue';

const state = reactive({ items: [] });
let sequence = 0;

export function useToast() {
  function dismiss(id) {
    const index = state.items.findIndex((item) => item.id === id);
    if (index !== -1) state.items.splice(index, 1);
  }

  function push(message, type = 'info', timeout = 4000) {
    const id = ++sequence;
    state.items.push({ id, message, type });
    if (timeout > 0) setTimeout(() => dismiss(id), timeout);
    return id;
  }

  return {
    items: state.items,
    success: (message) => push(message, 'success'),
    error: (message) => push(message, 'error'),
    info: (message) => push(message, 'info'),
    dismiss,
  };
}