<template>
  <Teleport to="body">
    <div v-if="open" class="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"></div>
      <div class="relative bg-white dark:bg-slate-900 rounded-xl shadow-2xl w-full max-w-md p-6 transition-all transform duration-300">
        <slot></slot>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
const props = defineProps<{
  open: boolean
}>()

defineEmits<{
  (e: 'update:open', value: boolean): void
}>()
</script>

<script lang="ts">
import { defineComponent, h } from 'vue'

export const AlertDialogContent = defineComponent({
  setup(_, { slots }) {
    return () => h('div', { class: 'space-y-4' }, slots.default?.())
  }
})

export const AlertDialogHeader = defineComponent({
  setup(_, { slots }) {
    return () => h('div', { class: 'space-y-2' }, slots.default?.())
  }
})

export const AlertDialogTitle = defineComponent({
  setup(_, { slots }) {
    return () => h('h2', { class: 'text-lg font-semibold text-slate-900 dark:text-white' }, slots.default?.())
  }
})

export const AlertDialogDescription = defineComponent({
  setup(_, { slots }) {
    return () => h('p', { class: 'text-sm text-slate-500 dark:text-slate-400' }, slots.default?.())
  }
})

export const AlertDialogFooter = defineComponent({
  setup(_, { slots }) {
    return () => h('div', { class: 'mt-6 flex justify-end gap-3' }, slots.default?.())
  }
})

export const AlertDialogCancel = defineComponent({
  emits: ['click'],
  setup(_, { slots, emit }) {
    return () => h('button', { 
      class: 'px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 dark:text-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg transition-colors',
      onClick: (e) => emit('click', e)
    }, slots.default?.())
  }
})

export const AlertDialogAction = defineComponent({
  emits: ['click'],
  props: ['class'],
  setup(props, { slots, emit }) {
    return () => h('button', { 
      class: ['px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors', props.class],
      onClick: (e) => emit('click', e)
    }, slots.default?.())
  }
})
</script>
