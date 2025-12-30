// Command component exports
import CommandRoot from './command.vue';

// CommandInput component
export const CommandInput = {
  name: 'CommandInput',
  props: {
    modelValue: String,
    placeholder: String
  },
  emits: ['update:modelValue'],
  template: `
    <div class="flex items-center border-b px-3">
      <svg class="mr-2 h-4 w-4 shrink-0 opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.35-4.35"></path></svg>
      <input
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        :placeholder="placeholder"
        class="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-gray-500 disabled:cursor-not-allowed disabled:opacity-50"
      />
    </div>
  `
};

// CommandEmpty component
export const CommandEmpty = {
  name: 'CommandEmpty',
  template: `
    <div class="py-6 text-center text-sm text-gray-500">
      <slot>No results found.</slot>
    </div>
  `
};

// CommandGroup component
export const CommandGroup = {
  name: 'CommandGroup',
  props: {
    heading: String
  },
  template: `
    <div class="overflow-hidden p-1">
      <div v-if="heading" class="px-2 py-1.5 text-xs font-medium text-gray-500">
        {{ heading }}
      </div>
      <div role="group">
        <slot />
      </div>
    </div>
  `
};

// CommandItem component
export const CommandItem = {
  name: 'CommandItem',
  props: {
    value: [String, Number],
    disabled: Boolean
  },
  emits: ['select'],
  template: `
    <div
      :class="[
        'relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors',
        disabled ? 'pointer-events-none opacity-50' : 'hover:bg-gray-100 hover:text-gray-900'
      ]"
      @click="!disabled && $emit('select', value)"
    >
      <slot />
    </div>
  `
};

// Main Command export
export const Command = CommandRoot;

export default Command;
